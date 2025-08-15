from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Base response models
class BaseResponse(BaseModel):
    ok: bool = True
    message: Optional[str] = None

# Authentication schemas
class SignupRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class VerifyEmailRequest(BaseModel):
    email: EmailStr
    code: str = Field(..., min_length=6, max_length=6)
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str = Field(..., min_length=6, max_length=6)
    new_password: str = Field(..., min_length=6)

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    is_verified: bool
    free_trial_remaining: int
    paid_credits: int

class AuthResponse(BaseResponse):
    user: UserResponse
    token: str

# Job and upload schemas
class JobUploadRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    jd_text: str = Field(..., min_length=10)

class JobUploadResponse(BaseResponse):
    job_id: str

class JobStatusResponse(BaseResponse):
    status: str
    job_id: str
    title: str
    tokens_used: int
    cost: float
    created_at: datetime

class JobStatsResponse(BaseResponse):
    stats: Dict[str, Any]

# Candidate schemas
class CandidateResponse(BaseModel):
    id: str
    name: str
    email: Optional[str]
    phone: Optional[str]
    experience_years: int
    skills: Optional[str]
    match_score: float
    status: str
    reasoning: Optional[str]

# Billing schemas
class PaymentIntentResponse(BaseResponse):
    client_secret: str
    payment_intent_id: str

class SubscriptionResponse(BaseResponse):
    status: str
    credits_remaining: int
    free_trial_remaining: int
    paid_credits: int

class PaymentRequest(BaseModel):
    amount: float = Field(5.00, gt=0)
    currency: str = "usd"

# Export schemas  
class ExportRequest(BaseModel):
    format: str = Field("csv", regex="^(csv|xlsx)$")
    candidates: List[str] = Field(default=["shortlisted"])  # shortlisted, all, under_review

# Processing schemas
class ProcessingStatusResponse(BaseResponse):
    job_id: str
    status: str  # queued, processing, completed, failed
    progress: Optional[int] = None  # 0-100
    current_step: Optional[str] = None
    estimated_completion: Optional[datetime] = None

# Error response
class ErrorResponse(BaseModel):
    ok: bool = False
    error: str
    detail: Optional[str] = None

# File upload schemas
class FileValidationError(BaseModel):
    filename: str
    error: str

class UploadValidationResponse(BaseResponse):
    valid_files: List[str]
    invalid_files: List[FileValidationError]
    total_files: int
    estimated_credits: int

# Analytics schemas
class MatchDistribution(BaseModel):
    low: int  # 0-50%
    medium: int  # 50-80% 
    high: int  # 80-90%
    excellent: int  # 90-100%

class JobAnalytics(BaseModel):
    total_candidates: int
    shortlisted_count: int
    average_match_score: float
    match_distribution: MatchDistribution
    processing_time_seconds: Optional[int]

class DashboardStats(BaseModel):
    tokens_used: int
    cost: str
    remaining_balance: int
    total_candidates: int
    total_jobs: int
    avg_match_score: Optional[float]

# Settings schemas
class UserSettings(BaseModel):
    email_notifications: bool = True
    score_threshold: float = Field(85.0, ge=0, le=100)
    auto_shortlist: bool = True

class ScoringWeights(BaseModel):
    skills_weight: float = Field(0.6, ge=0, le=1)
    experience_weight: float = Field(0.3, ge=0, le=1) 
    education_weight: float = Field(0.1, ge=0, le=1)

    def __init__(self, **data):
        super().__init__(**data)
        total = self.skills_weight + self.experience_weight + self.education_weight
        if abs(total - 1.0) > 0.01:
            raise ValueError("Scoring weights must sum to 1.0")
