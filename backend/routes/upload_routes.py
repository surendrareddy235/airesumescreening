from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
import os
import tempfile
import shutil
from datetime import datetime

from db import get_db
from models import User, Job, CandidateSummary, JobStats
from auth import verify_token
from utils import get_current_user, validate_file, cleanup_temp_files
from processors.parser import extract_text_from_file
from processors.embedding import EmbeddingService
from processors.faiss_search import FAISSSearchService
from processors.scoring import ScoringService
from processors.groq_client import GroqClient
from config import settings
from schemas import JobUploadRequest, JobUploadResponse

router = APIRouter()

# Global services (initialized once)
embedding_service = EmbeddingService()
scoring_service = ScoringService()
groq_client = GroqClient()

async def process_job_background(
    job_id: str,
    file_paths: List[str],
    jd_text: str,
    user_id: str,
    db_session: Session
):
    """Background task to process uploaded resumes"""
    try:
        # Update job status to processing
        job = db_session.query(Job).filter(Job.id == job_id).first()
        if not job:
            return
            
        job.status = "processing"
        db_session.commit()

        # Extract text from files
        candidate_texts = []
        for file_path in file_paths:
            try:
                text = extract_text_from_file(file_path)
                if text.strip():
                    candidate_texts.append(text)
            except Exception as e:
                print(f"Error processing file {file_path}: {str(e)}")
                continue

        if not candidate_texts:
            job.status = "failed"
            db_session.commit()
            return

        # Generate embeddings for JD and candidates
        jd_embedding = embedding_service.create_embedding(jd_text)
        candidate_embeddings = [embedding_service.create_embedding(text) for text in candidate_texts]

        # Build FAISS index and perform similarity search
        faiss_service = FAISSSearchService()
        faiss_service.build_index(candidate_embeddings)
        
        # Calculate similarity scores
        similarities = faiss_service.search(jd_embedding, len(candidate_embeddings))
        
        # Process each candidate
        candidates_data = []
        total_tokens = 0
        
        for i, (text, similarity_score) in enumerate(zip(candidate_texts, similarities)):
            # Extract candidate information using scoring service
            candidate_info = scoring_service.extract_candidate_info(text)
            
            # Calculate weighted score
            weighted_score = scoring_service.calculate_weighted_score(
                similarity_score=similarity_score,
                experience_years=candidate_info.get('experience_years', 0),
                education_level=candidate_info.get('education_level', 'none')
            )
            
            candidates_data.append({
                'text': text,
                'info': candidate_info,
                'weighted_score': weighted_score
            })

        # Sort by score and select top candidates for Groq analysis
        candidates_data.sort(key=lambda x: x['weighted_score'], reverse=True)
        top_candidates = candidates_data[:20]  # Analyze top 20

        # Use Groq for final ranking and reasoning
        groq_results = await groq_client.rank_candidates(jd_text, top_candidates)
        total_tokens += groq_results.get('tokens_used', 0)

        # Save candidate summaries to database
        for candidate_data, groq_result in zip(top_candidates, groq_results.get('candidates', [])):
            match_score = groq_result.get('match_score', candidate_data['weighted_score'])
            status = "shortlisted" if match_score >= settings.SCORE_THRESHOLD else "under_review"
            if match_score < 50:
                status = "not_qualified"

            candidate_summary = CandidateSummary(
                job_id=job_id,
                name=candidate_data['info'].get('name', f"Candidate {len(candidates_data) - top_candidates.index(candidate_data) + 1}"),
                email=candidate_data['info'].get('email'),
                phone=candidate_data['info'].get('phone'),
                experience_years=candidate_data['info'].get('experience_years', 0),
                skills=', '.join(candidate_data['info'].get('skills', [])),
                match_score=round(match_score, 2),
                status=status,
                reasoning=groq_result.get('reasoning', 'Score based on AI analysis')
            )
            db_session.add(candidate_summary)

        # Update job completion
        cost = (total_tokens / 1000) * 0.002  # Approximate cost calculation
        job.status = "completed"
        job.tokens_used = total_tokens
        job.cost = cost
        db_session.commit()

        # Update user stats
        user_stats = db_session.query(JobStats).filter(JobStats.user_id == user_id).first()
        if not user_stats:
            user_stats = JobStats(user_id=user_id)
            db_session.add(user_stats)
        
        user_stats.total_jobs += 1
        user_stats.total_candidates += len(candidates_data)
        user_stats.total_tokens_used += total_tokens
        user_stats.total_cost = float(user_stats.total_cost) + cost
        user_stats.updated_at = datetime.utcnow()
        db_session.commit()

        # Decrement user credits
        user = db_session.query(User).filter(User.id == user_id).first()
        if user:
            if user.free_trial_remaining > 0:
                user.free_trial_remaining = max(0, user.free_trial_remaining - len(candidate_texts))
            elif user.paid_credits > 0:
                user.paid_credits = max(0, user.paid_credits - len(candidate_texts))
            db_session.commit()

    except Exception as e:
        # Update job status to failed
        job = db_session.query(Job).filter(Job.id == job_id).first()
        if job:
            job.status = "failed"
            db_session.commit()
        print(f"Background processing error: {str(e)}")
    
    finally:
        # Cleanup temporary files
        cleanup_temp_files(file_paths)
        db_session.close()

@router.post("/upload", response_model=JobUploadResponse)
async def upload_job(
    background_tasks: BackgroundTasks,
    title: str = Form(...),
    jd_text: str = Form(...),
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload job with resumes and start processing"""
    try:
        # Check user credits
        total_credits = (current_user.free_trial_remaining or 0) + (current_user.paid_credits or 0)
        if total_credits <= 0:
            raise HTTPException(
                status_code=402,
                detail="No remaining credits. Please upgrade your plan."
            )

        # Validate files
        if not files:
            raise HTTPException(
                status_code=400,
                detail="At least one resume file is required"
            )

        if len(files) > total_credits:
            raise HTTPException(
                status_code=400,
                detail=f"You can only process {total_credits} resumes with your current credits"
            )

        # Validate each file
        file_paths = []
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

        for file in files:
            # Validate file
            validate_file(file)
            
            # Save to temporary location
            temp_path = os.path.join(
                settings.UPLOAD_DIR, 
                f"{current_user.id}_{datetime.utcnow().timestamp()}_{file.filename}"
            )
            
            with open(temp_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            file_paths.append(temp_path)

        # Create job record
        job = Job(
            user_id=current_user.id,
            title=title,
            jd_text=jd_text,
            status="queued"
        )
        db.add(job)
        db.commit()
        db.refresh(job)

        # Start background processing
        # Create a new database session for background task
        from db import SessionLocal
        background_db = SessionLocal()
        background_tasks.add_task(
            process_job_background,
            job.id,
            file_paths,
            jd_text,
            current_user.id,
            background_db
        )

        return JobUploadResponse(
            ok=True,
            job_id=job.id,
            message="Job uploaded successfully. Processing will begin shortly."
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {str(e)}"
        )
