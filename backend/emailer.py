import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from config import settings
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_pass = settings.SMTP_PASS
        self.smtp_from = settings.SMTP_FROM

    async def send_email(
        self, 
        to_email: str, 
        subject: str, 
        body: str, 
        html_body: Optional[str] = None
    ) -> bool:
        """Send an email"""
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.smtp_from
            msg['To'] = to_email

            # Add text part
            text_part = MIMEText(body, 'plain')
            msg.attach(text_part)

            # Add HTML part if provided
            if html_body:
                html_part = MIMEText(html_body, 'html')
                msg.attach(html_part)

            # For development, just log the email instead of actually sending
            if not self.smtp_user or not self.smtp_pass:
                logger.info(f"EMAIL TO {to_email}: {subject} - {body}")
                return True

            # Send email via SMTP
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_pass)
                server.send_message(msg)

            logger.info(f"Email sent successfully to {to_email}")
            return True

        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

    async def send_verification_email(self, to_email: str, code: str) -> bool:
        """Send email verification code"""
        subject = "Email Verification - AI Resume Screening"
        body = f"""
        Welcome to AI Resume Screening!
        
        Your email verification code is: {code}
        
        This code will expire in 10 minutes.
        
        If you didn't request this verification, please ignore this email.
        """
        
        html_body = f"""
        <html>
        <body>
            <h2>Welcome to AI Resume Screening!</h2>
            <p>Your email verification code is:</p>
            <h1 style="color: #2563eb; font-size: 2em; letter-spacing: 0.2em;">{code}</h1>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
        </body>
        </html>
        """
        
        return await self.send_email(to_email, subject, body, html_body)

    async def send_password_reset_email(self, to_email: str, code: str) -> bool:
        """Send password reset code"""
        subject = "Password Reset - AI Resume Screening"
        body = f"""
        Password Reset Request
        
        Your password reset code is: {code}
        
        This code will expire in 10 minutes.
        
        If you didn't request a password reset, please ignore this email.
        """
        
        html_body = f"""
        <html>
        <body>
            <h2>Password Reset Request</h2>
            <p>Your password reset code is:</p>
            <h1 style="color: #2563eb; font-size: 2em; letter-spacing: 0.2em;">{code}</h1>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
        </body>
        </html>
        """
        
        return await self.send_email(to_email, subject, body, html_body)

# Global email service instance
email_service = EmailService()
