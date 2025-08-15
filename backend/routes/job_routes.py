from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from db import get_db
from models import User, Job, CandidateSummary, JobStats
from utils import get_current_user
from schemas import JobStatusResponse, JobStatsResponse, CandidateResponse

router = APIRouter()

@router.get("/{job_id}/status", response_model=JobStatusResponse)
async def get_job_status(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get job processing status"""
    try:
        job = db.query(Job).filter(
            Job.id == job_id,
            Job.user_id == current_user.id
        ).first()
        
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        return JobStatusResponse(
            ok=True,
            status=job.status,
            job_id=job.id,
            title=job.title,
            tokens_used=job.tokens_used,
            cost=float(job.cost) if job.cost else 0,
            created_at=job.created_at
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving job status: {str(e)}"
        )

@router.get("/{job_id}/candidates", response_model=List[CandidateResponse])
async def get_job_candidates(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get candidates for a specific job"""
    try:
        # Verify job belongs to user
        job = db.query(Job).filter(
            Job.id == job_id,
            Job.user_id == current_user.id
        ).first()
        
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        # Get candidates sorted by match score
        candidates = db.query(CandidateSummary).filter(
            CandidateSummary.job_id == job_id
        ).order_by(CandidateSummary.match_score.desc()).all()

        candidate_responses = []
        for candidate in candidates:
            candidate_responses.append(CandidateResponse(
                id=candidate.id,
                name=candidate.name,
                email=candidate.email,
                phone=candidate.phone,
                experience_years=candidate.experience_years,
                skills=candidate.skills,
                match_score=float(candidate.match_score),
                status=candidate.status,
                reasoning=candidate.reasoning
            ))

        return candidate_responses

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving candidates: {str(e)}"
        )

@router.get("/stats", response_model=JobStatsResponse)
async def get_job_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's job statistics"""
    try:
        # Get user stats
        stats = db.query(JobStats).filter(JobStats.user_id == current_user.id).first()
        
        # Get most recent job for total candidates count
        recent_job = db.query(Job).filter(
            Job.user_id == current_user.id,
            Job.status == "completed"
        ).order_by(Job.created_at.desc()).first()
        
        total_candidates = 0
        if recent_job:
            total_candidates = db.query(CandidateSummary).filter(
                CandidateSummary.job_id == recent_job.id
            ).count()

        return JobStatsResponse(
            ok=True,
            stats={
                "tokens_used": stats.total_tokens_used if stats else 0,
                "cost": str(stats.total_cost) if stats else "0.00",
                "remaining_balance": current_user.free_trial_remaining + current_user.paid_credits,
                "total_candidates": total_candidates
            }
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving stats: {str(e)}"
        )

@router.get("/", response_model=List[JobStatusResponse])
async def get_user_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all jobs for the current user"""
    try:
        jobs = db.query(Job).filter(
            Job.user_id == current_user.id
        ).order_by(Job.created_at.desc()).all()

        job_responses = []
        for job in jobs:
            job_responses.append(JobStatusResponse(
                ok=True,
                status=job.status,
                job_id=job.id,
                title=job.title,
                tokens_used=job.tokens_used,
                cost=float(job.cost) if job.cost else 0,
                created_at=job.created_at
            ))

        return job_responses

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving jobs: {str(e)}"
        )
