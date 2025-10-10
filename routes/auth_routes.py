from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from db import get_db
from models import User, EmailVerification
from auth import hash_password, verify_password, create_access_token, generate_verification_code
from emailer import email_service
from schemas import (
    SignupRequest, LoginRequest, VerifyEmailRequest, 
    ForgotPasswordRequest, ResetPasswordRequest,
    UserResponse, AuthResponse
)

router = APIRouter()

@router.post("/signup", response_model=dict)
async def signup(request: SignupRequest, db: Session = Depends(get_db)):
    """Register a new user and send verification email"""
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == request.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        
        existing_username = db.query(User).filter(User.username == request.username).first()
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )

        # Generate verification code
        code = generate_verification_code()
        expires_at = datetime.utcnow() + timedelta(minutes=10)

        # Save verification code
        verification = EmailVerification(
            email=request.email,
            code=code,
            expires_at=expires_at
        )
        db.add(verification)
        db.commit()

        # Send verification email
        await email_service.send_verification_email(request.email, code)

        return {"ok": True, "message": "Verification code sent to email"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/verify", response_model=AuthResponse)
async def verify_email(request: VerifyEmailRequest, db: Session = Depends(get_db)):
    """Verify email and complete user registration"""
    try:
        # Find verification record
        verification = db.query(EmailVerification).filter(
            EmailVerification.email == request.email,
            EmailVerification.code == request.code
        ).first()

        if not verification or verification.expires_at < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired verification code"
            )

        # Create user
        hashed_password = hash_password(request.password)
        user = User(
            username=request.username,
            email=request.email,
            password_hash=hashed_password,
            is_verified=True
        )
        db.add(user)
        
        # Delete verification record
        db.delete(verification)
        db.commit()

        # Generate access token
        access_token = create_access_token(data={"sub": user.id, "username": user.username})

        return AuthResponse(
            ok=True,
            user=UserResponse(
                id=user.id,
                username=user.username,
                email=user.email,
                is_verified=user.is_verified,
                free_trial_remaining=user.free_trial_remaining,
                paid_credits=user.paid_credits
            ),
            token=access_token
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user and return access token"""
    try:
        # Find user
        user = db.query(User).filter(User.email == request.email).first()
        if not user or not user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid credentials or unverified account"
            )

        # Verify password
        if not verify_password(request.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid credentials"
            )

        # Generate access token
        access_token = create_access_token(data={"sub": user.id, "username": user.username})

        return AuthResponse(
            ok=True,
            user=UserResponse(
                id=user.id,
                username=user.username,
                email=user.email,
                is_verified=user.is_verified,
                free_trial_remaining=user.free_trial_remaining,
                paid_credits=user.paid_credits
            ),
            token=access_token
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/forgot-password", response_model=dict)
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Send password reset code"""
    try:
        # Find user
        user = db.query(User).filter(User.email == request.email).first()
        if not user:
            # Return success even if user doesn't exist for security
            return {"ok": True, "message": "If account exists, reset code will be sent"}

        # Generate reset code
        code = generate_verification_code()
        expires_at = datetime.utcnow() + timedelta(minutes=10)

        # Save verification code (reusing EmailVerification table)
        verification = EmailVerification(
            email=request.email,
            code=code,
            expires_at=expires_at
        )
        db.add(verification)
        db.commit()

        # Send reset email
        await email_service.send_password_reset_email(request.email, code)

        return {"ok": True, "message": "Reset code sent to email"}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/reset-password", response_model=dict)
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset user password with verification code"""
    try:
        # Find verification record
        verification = db.query(EmailVerification).filter(
            EmailVerification.email == request.email,
            EmailVerification.code == request.code
        ).first()

        if not verification or verification.expires_at < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset code"
            )

        # Find user
        user = db.query(User).filter(User.email == request.email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User not found"
            )

        # Update password
        user.password_hash = hash_password(request.new_password)
        
        # Delete verification record
        db.delete(verification)
        db.commit()

        return {"ok": True, "message": "Password reset successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
