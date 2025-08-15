import os
import re
from typing import List, Optional
from pathlib import Path
from fastapi import HTTPException, Depends, status, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from db import get_db
from models import User
from auth import verify_token
from config import settings

# Security
security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    try:
        # Extract token from credentials
        token = credentials.credentials
        
        # Verify token
        payload = verify_token(token)
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        # Get user from database
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        return user
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )

def validate_file(file: UploadFile) -> None:
    """Validate uploaded file"""
    
    # Check file extension
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required")
    
    file_extension = Path(file.filename).suffix.lower()
    if file_extension not in settings.ALLOWED_FILE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file_extension} not allowed. Supported types: {', '.join(settings.ALLOWED_FILE_TYPES)}"
        )
    
    # Check file size (if available)
    if hasattr(file, 'size') and file.size:
        max_size_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
        if file.size > max_size_bytes:
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds maximum limit of {settings.MAX_FILE_SIZE_MB}MB"
            )
    
    # Validate filename (basic security check)
    if not is_safe_filename(file.filename):
        raise HTTPException(
            status_code=400,
            detail="Invalid filename. Only alphanumeric characters, dots, hyphens and underscores are allowed."
        )

def is_safe_filename(filename: str) -> bool:
    """Check if filename is safe (no path traversal, etc.)"""
    
    # Remove extension for checking
    name_without_ext = Path(filename).stem
    
    # Allow alphanumeric, dots, hyphens, underscores, and spaces
    safe_pattern = r'^[a-zA-Z0-9._\-\s]+$'
    
    return (
        bool(re.match(safe_pattern, name_without_ext)) and
        '..' not in filename and
        '/' not in filename and
        '\\' not in filename and
        filename not in ['', '.', '..']
    )

def cleanup_temp_files(file_paths: List[str]) -> None:
    """Clean up temporary files"""
    
    for file_path in file_paths:
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            # Log error but don't raise exception
            print(f"Warning: Could not remove temporary file {file_path}: {str(e)}")

def sanitize_filename(filename: str) -> str:
    """Sanitize filename for safe storage"""
    
    # Remove path components
    filename = os.path.basename(filename)
    
    # Replace unsafe characters
    safe_filename = re.sub(r'[^\w\-_\.]', '_', filename)
    
    # Limit length
    if len(safe_filename) > 100:
        name, ext = os.path.splitext(safe_filename)
        safe_filename = name[:95] + ext
    
    return safe_filename

def validate_job_description(jd_text: str) -> None:
    """Validate job description content"""
    
    if not jd_text or not jd_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty"
        )
    
    if len(jd_text.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail="Job description is too short. Please provide at least 50 characters."
        )
    
    if len(jd_text) > 10000:
        raise HTTPException(
            status_code=400,
            detail="Job description is too long. Please limit to 10,000 characters."
        )

def calculate_estimated_credits(num_files: int) -> int:
    """Calculate estimated credits needed for processing"""
    
    # Base cost: 1 credit per resume
    base_credits = num_files
    
    # Additional credits for processing overhead
    if num_files > 10:
        overhead = max(1, num_files // 10)
        base_credits += overhead
    
    return base_credits

def format_file_size(size_bytes: int) -> str:
    """Format file size in human readable format"""
    
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    
    return f"{size_bytes:.1f} TB"

def extract_keywords_from_jd(job_description: str) -> List[str]:
    """Extract key technical terms from job description"""
    
    # Common technical keywords to look for
    tech_keywords = [
        'python', 'java', 'javascript', 'react', 'angular', 'vue',
        'nodejs', 'express', 'django', 'flask', 'spring', 'aws',
        'azure', 'gcp', 'docker', 'kubernetes', 'mysql', 'postgresql',
        'mongodb', 'redis', 'git', 'ci/cd', 'devops', 'agile', 'scrum'
    ]
    
    jd_lower = job_description.lower()
    found_keywords = []
    
    for keyword in tech_keywords:
        if keyword in jd_lower:
            found_keywords.append(keyword)
    
    return found_keywords

def generate_job_summary(job_description: str) -> dict:
    """Generate a summary of job requirements"""
    
    jd_lower = job_description.lower()
    
    # Extract experience requirements
    experience_match = re.search(r'(\d+)\+?\s*years?\s*of\s*experience', jd_lower)
    required_experience = int(experience_match.group(1)) if experience_match else None
    
    # Extract education requirements
    education_requirements = []
    if 'bachelor' in jd_lower:
        education_requirements.append('Bachelor\'s degree')
    if 'master' in jd_lower:
        education_requirements.append('Master\'s degree')
    if 'phd' in jd_lower or 'doctorate' in jd_lower:
        education_requirements.append('PhD/Doctorate')
    
    # Extract key skills
    key_skills = extract_keywords_from_jd(job_description)
    
    return {
        'required_experience': required_experience,
        'education_requirements': education_requirements,
        'key_skills': key_skills,
        'description_length': len(job_description),
        'word_count': len(job_description.split())
    }

def validate_environment() -> dict:
    """Validate that all required environment variables are set"""
    
    required_vars = [
        'JWT_SECRET',
        'GROQ_API_KEY',
        'STRIPE_SECRET_KEY',
    ]
    
    optional_vars = [
        'SMTP_HOST',
        'SMTP_USER', 
        'SMTP_PASS',
        'DATABASE_URL'
    ]
    
    missing_required = []
    missing_optional = []
    
    for var in required_vars:
        if not getattr(settings, var, None):
            missing_required.append(var)
    
    for var in optional_vars:
        if not getattr(settings, var, None):
            missing_optional.append(var)
    
    return {
        'missing_required': missing_required,
        'missing_optional': missing_optional,
        'is_valid': len(missing_required) == 0
    }

class FileManager:
    """Utility class for file operations"""
    
    @staticmethod
    def ensure_upload_dir():
        """Ensure upload directory exists"""
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    @staticmethod
    def get_temp_file_path(user_id: str, filename: str) -> str:
        """Generate temporary file path"""
        FileManager.ensure_upload_dir()
        safe_filename = sanitize_filename(filename)
        return os.path.join(
            settings.UPLOAD_DIR,
            f"{user_id}_{int(__import__('time').time())}_{safe_filename}"
        )
    
    @staticmethod
    def cleanup_old_files(max_age_hours: int = 24):
        """Clean up old temporary files"""
        try:
            import time
            current_time = time.time()
            cutoff_time = current_time - (max_age_hours * 3600)
            
            for filename in os.listdir(settings.UPLOAD_DIR):
                filepath = os.path.join(settings.UPLOAD_DIR, filename)
                if os.path.isfile(filepath):
                    file_time = os.path.getctime(filepath)
                    if file_time < cutoff_time:
                        os.remove(filepath)
                        
        except Exception as e:
            print(f"Warning: Could not clean up old files: {str(e)}")
