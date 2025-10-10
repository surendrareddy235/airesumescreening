from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
import stripe
import json
from datetime import datetime

from db import get_db
from models import User, Payment
from utils import get_current_user
from config import settings
from schemas import PaymentIntentResponse, SubscriptionResponse

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

router = APIRouter()

@router.post("/create-payment-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(
    request: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a Stripe payment intent for one-time payment"""
    try:
        if not settings.STRIPE_SECRET_KEY:
            raise HTTPException(
                status_code=500,
                detail="Stripe not configured. Please contact support."
            )

        amount = request.get("amount", 5.00)  # Default $5 for basic plan
        
        # Create or retrieve Stripe customer
        if not current_user.stripe_customer_id:
            customer = stripe.Customer.create(
                email=current_user.email,
                name=current_user.username,
                metadata={
                    "user_id": current_user.id
                }
            )
            current_user.stripe_customer_id = customer.id
            db.commit()
        
        # Create payment intent
        payment_intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),  # Convert to cents
            currency="usd",
            customer=current_user.stripe_customer_id,
            metadata={
                "user_id": current_user.id,
                "plan": "basic",
                "credits": "1000"
            },
            automatic_payment_methods={
                "enabled": True
            }
        )

        # Create payment record
        payment = Payment(
            user_id=current_user.id,
            stripe_payment_intent_id=payment_intent.id,
            amount=amount,
            currency="usd",
            status="pending"
        )
        db.add(payment)
        db.commit()

        return PaymentIntentResponse(
            ok=True,
            client_secret=payment_intent.client_secret,
            payment_intent_id=payment_intent.id
        )

    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Stripe error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Payment intent creation failed: {str(e)}"
        )

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhook events"""
    try:
        payload = await request.body()
        sig_header = request.headers.get('stripe-signature')

        if not settings.STRIPE_WEBHOOK_SECRET:
            # For development, just process the event without signature verification
            event = json.loads(payload)
        else:
            try:
                event = stripe.Webhook.construct_event(
                    payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
                )
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid payload")
            except stripe.error.SignatureVerificationError:
                raise HTTPException(status_code=400, detail="Invalid signature")

        # Handle the event
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            await handle_successful_payment(payment_intent, db)
        
        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            await handle_failed_payment(payment_intent, db)

        return {"status": "success"}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Webhook processing failed: {str(e)}"
        )

async def handle_successful_payment(payment_intent: dict, db: Session):
    """Handle successful payment"""
    try:
        # Update payment record
        payment = db.query(Payment).filter(
            Payment.stripe_payment_intent_id == payment_intent['id']
        ).first()
        
        if payment:
            payment.status = "succeeded"
            db.commit()

        # Update user credits
        user_id = payment_intent['metadata'].get('user_id')
        credits = int(payment_intent['metadata'].get('credits', 1000))
        
        if user_id:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                user.paid_credits = (user.paid_credits or 0) + credits
                db.commit()

    except Exception as e:
        print(f"Error handling successful payment: {str(e)}")

async def handle_failed_payment(payment_intent: dict, db: Session):
    """Handle failed payment"""
    try:
        # Update payment record
        payment = db.query(Payment).filter(
            Payment.stripe_payment_intent_id == payment_intent['id']
        ).first()
        
        if payment:
            payment.status = "failed"
            db.commit()

    except Exception as e:
        print(f"Error handling failed payment: {str(e)}")

@router.get("/checkout")
async def create_checkout_session(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create Stripe Checkout session"""
    try:
        if not settings.STRIPE_SECRET_KEY:
            raise HTTPException(
                status_code=500,
                detail="Stripe not configured. Please contact support."
            )

        # Create or retrieve Stripe customer
        if not current_user.stripe_customer_id:
            customer = stripe.Customer.create(
                email=current_user.email,
                name=current_user.username
            )
            current_user.stripe_customer_id = customer.id
            db.commit()

        # Create checkout session
        checkout_session = stripe.checkout.Session.create(
            customer=current_user.stripe_customer_id,
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': 'AI Resume Screening - Basic Plan',
                        'description': '1,000 resume credits for advanced AI matching',
                    },
                    'unit_amount': 500,  # $5.00 in cents
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=request.headers.get('origin', 'http://localhost:5000') + '/dashboard?payment=success',
            cancel_url=request.headers.get('origin', 'http://localhost:5000') + '/checkout?payment=cancelled',
            metadata={
                'user_id': current_user.id,
                'credits': '1000'
            }
        )

        return {"checkout_url": checkout_session.url}

    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Stripe error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Checkout session creation failed: {str(e)}"
        )

@router.get("/subscription", response_model=SubscriptionResponse)
async def get_subscription_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's subscription status"""
    try:
        subscription_status = "free_trial"
        credits_remaining = current_user.free_trial_remaining + current_user.paid_credits
        
        if current_user.stripe_subscription_id:
            try:
                subscription = stripe.Subscription.retrieve(current_user.stripe_subscription_id)
                subscription_status = subscription.status
            except stripe.error.StripeError:
                subscription_status = "inactive"

        return SubscriptionResponse(
            ok=True,
            status=subscription_status,
            credits_remaining=credits_remaining,
            free_trial_remaining=current_user.free_trial_remaining,
            paid_credits=current_user.paid_credits
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving subscription status: {str(e)}"
        )
