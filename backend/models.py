from sqlalchemy import Column, String, Integer, Boolean, DateTime, Decimal, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False)
    free_trial_remaining = Column(Integer, default=50)
    paid_credits = Column(Integer, default=0)
    stripe_customer_id = Column(String, nullable=True)
    stripe_subscription_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    jobs = relationship("Job", back_populates="user")
    stats = relationship("JobStats", back_populates="user", uselist=False)

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    jd_text = Column(Text, nullable=False)
    status = Column(String, default="queued")  # queued, processing, completed, failed
    tokens_used = Column(Integer, default=0)
    cost = Column(Decimal(10, 2), default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="jobs")
    candidates = relationship("CandidateSummary", back_populates="job")

class CandidateSummary(Base):
    __tablename__ = "candidate_summaries"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    job_id = Column(String, ForeignKey("jobs.id"), nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    experience_years = Column(Integer, default=0)
    skills = Column(Text, nullable=True)  # CSV string
    match_score = Column(Decimal(5, 2), nullable=False)
    status = Column(String, default="under_review")  # shortlisted, under_review, not_qualified
    reasoning = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    job = relationship("Job", back_populates="candidates")

class EmailVerification(Base):
    __tablename__ = "email_verifications"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, nullable=False)
    code = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class JobStats(Base):
    __tablename__ = "job_stats"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    total_jobs = Column(Integer, default=0)
    total_candidates = Column(Integer, default=0)
    total_tokens_used = Column(Integer, default=0)
    total_cost = Column(Decimal(10, 2), default=0)
    updated_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="stats")

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    stripe_payment_intent_id = Column(String, nullable=False)
    amount = Column(Decimal(10, 2), nullable=False)
    currency = Column(String, default="usd")
    status = Column(String, nullable=False)  # succeeded, failed, pending
    created_at = Column(DateTime, default=datetime.utcnow)
