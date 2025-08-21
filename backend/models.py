from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.types import DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)  # UUIDs are 36 chars long
    username = Column(String(50), unique=True, nullable=False)  # Added length
    email = Column(String(255), unique=True, nullable=False)  # Added length
    password_hash = Column(String(255), nullable=False)  # Added length
    is_verified = Column(Boolean, default=False)
    free_trial_remaining = Column(Integer, default=50)
    paid_credits = Column(Integer, default=0)
    stripe_customer_id = Column(String(50), nullable=True)  # Added length
    stripe_subscription_id = Column(String(50), nullable=True)  # Added length
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    jobs = relationship("Job", back_populates="user")
    stats = relationship("JobStats", back_populates="user", uselist=False)

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String(100), nullable=False)  # Added length
    jd_text = Column(Text, nullable=False)
    status = Column(String(20), default="queued")  # Added length
    tokens_used = Column(Integer, default=0)
    cost = Column(DECIMAL(10, 2), default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="jobs")
    candidates = relationship("CandidateSummary", back_populates="job")

class CandidateSummary(Base):
    __tablename__ = "candidate_summaries"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    job_id = Column(String(36), ForeignKey("jobs.id"), nullable=False)
    name = Column(String(100), nullable=False)  # Added length
    email = Column(String(255), nullable=True)  # Added length
    phone = Column(String(20), nullable=True)  # Added length
    experience_years = Column(Integer, default=0)
    skills = Column(Text, nullable=True)
    match_score = Column(DECIMAL(5, 2), nullable=False)
    status = Column(String(20), default="under_review")  # Added length
    reasoning = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    job = relationship("Job", back_populates="candidates")

class EmailVerification(Base):
    __tablename__ = "email_verifications"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), nullable=False)  # Added length
    code = Column(String(10), nullable=False)  # Added length
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class JobStats(Base):
    __tablename__ = "job_stats"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    total_jobs = Column(Integer, default=0)
    total_candidates = Column(Integer, default=0)
    total_tokens_used = Column(Integer, default=0)
    total_cost = Column(DECIMAL(10, 2), default=0)
    updated_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="stats")

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    stripe_payment_intent_id = Column(String(50), nullable=False)  # Added length
    amount = Column(DECIMAL(10, 2), nullable=False)
    currency = Column(String(3), default="usd")  # Added length
    status = Column(String(20), nullable=False)  # Added length
    created_at = Column(DateTime, default=datetime.utcnow)