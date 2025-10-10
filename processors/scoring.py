import re
from typing import Dict, List, Any, Optional
import logging
from config import settings

logger = logging.getLogger(__name__)

class ScoringService:
    """Service for candidate scoring and information extraction"""
    
    def __init__(self):
        self.skills_weight = settings.SKILLS_WEIGHT
        self.experience_weight = settings.EXPERIENCE_WEIGHT 
        self.education_weight = settings.EDUCATION_WEIGHT
        
        # Common technical skills for matching
        self.technical_skills = {
            'programming': [
                'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'go', 'rust', 'php',
                'ruby', 'scala', 'kotlin', 'swift', 'objective-c', 'r', 'matlab', 'sql'
            ],
            'frameworks': [
                'react', 'angular', 'vue', 'nodejs', 'express', 'django', 'flask', 'spring',
                'laravel', 'rails', 'asp.net', 'nextjs', 'nuxtjs', 'svelte', 'fastapi'
            ],
            'databases': [
                'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra',
                'oracle', 'sqlite', 'dynamodb', 'firebase'
            ],
            'cloud': [
                'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins',
                'github actions', 'gitlab ci', 'circleci'
            ],
            'tools': [
                'git', 'jira', 'confluence', 'slack', 'figma', 'postman', 'insomnia',
                'vs code', 'intellij', 'vim', 'nginx', 'apache'
            ]
        }
        
        # Education levels for scoring
        self.education_levels = {
            'phd': 5, 'ph.d': 5, 'doctorate': 5,
            'masters': 4, 'master': 4, 'msc': 4, 'mba': 4,
            'bachelor': 3, 'bachelors': 3, 'bsc': 3, 'ba': 3,
            'associate': 2, 'diploma': 2,
            'certificate': 1, 'certification': 1,
            'high school': 0, 'none': 0
        }
    
    def extract_candidate_info(self, resume_text: str) -> Dict[str, Any]:
        """Extract structured information from resume text"""
        
        text_lower = resume_text.lower()
        
        result = {
            'name': self._extract_name(resume_text),
            'email': self._extract_email(resume_text),
            'phone': self._extract_phone(resume_text),
            'experience_years': self._extract_experience_years(text_lower),
            'skills': self._extract_skills(text_lower),
            'education_level': self._extract_education_level(text_lower),
            'raw_text_length': len(resume_text)
        }
        
        return result
    
    def calculate_weighted_score(
        self, 
        similarity_score: float,
        experience_years: int = 0,
        education_level: str = 'none'
    ) -> float:
        """Calculate weighted score combining multiple factors"""
        
        # Skills score (based on similarity)
        skills_score = similarity_score
        
        # Experience score (normalize to 0-100)
        experience_score = min(100, (experience_years / 10) * 100)
        
        # Education score 
        education_score = (self.education_levels.get(education_level.lower(), 0) / 5) * 100
        
        # Calculate weighted average
        weighted_score = (
            skills_score * self.skills_weight +
            experience_score * self.experience_weight +
            education_score * self.education_weight
        )
        
        return max(0, min(100, weighted_score))
    
    def _extract_name(self, text: str) -> Optional[str]:
        """Extract candidate name from resume text"""
        lines = text.strip().split('\n')
        
        for line in lines[:5]:  # Check first 5 lines
            line = line.strip()
            if line and not any(char.isdigit() for char in line) and '@' not in line:
                # Simple heuristic: if line has 2-4 words and looks like a name
                words = line.split()
                if 2 <= len(words) <= 4 and all(word.isalpha() or word.replace('.', '').isalpha() for word in words):
                    return line
        
        return "Unknown Candidate"
    
    def _extract_email(self, text: str) -> Optional[str]:
        """Extract email from resume text"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        matches = re.findall(email_pattern, text)
        return matches[0] if matches else None
    
    def _extract_phone(self, text: str) -> Optional[str]:
        """Extract phone number from resume text"""
        # Pattern for various phone number formats
        phone_patterns = [
            r'\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})',
            r'\+?([0-9]{1,3})[-.\s]?([0-9]{3,4})[-.\s]?([0-9]{3,4})[-.\s]?([0-9]{3,4})',
        ]
        
        for pattern in phone_patterns:
            matches = re.findall(pattern, text)
            if matches:
                # Reconstruct phone number from groups
                if len(matches[0]) == 3:
                    return f"({matches[0][0]}) {matches[0][1]}-{matches[0][2]}"
                else:
                    return '-'.join(matches[0])
        
        return None
    
    def _extract_experience_years(self, text_lower: str) -> int:
        """Extract years of experience from resume text"""
        
        # Patterns for experience extraction
        experience_patterns = [
            r'(\d+)\+?\s*years?\s*of\s*experience',
            r'(\d+)\+?\s*years?\s*experience',
            r'experience:\s*(\d+)\+?\s*years?',
            r'(\d+)\+?\s*yrs?\s*experience',
            r'over\s*(\d+)\s*years?',
            r'more than\s*(\d+)\s*years?'
        ]
        
        max_experience = 0
        
        for pattern in experience_patterns:
            matches = re.findall(pattern, text_lower)
            for match in matches:
                try:
                    years = int(match)
                    if years > max_experience and years <= 50:  # Reasonable upper limit
                        max_experience = years
                except ValueError:
                    continue
        
        # If no explicit experience found, try to infer from job history
        if max_experience == 0:
            # Look for date ranges that might indicate work experience
            date_patterns = [
                r'(20\d{2})\s*-\s*(20\d{2})',  # 2020-2023
                r'(20\d{2})\s*to\s*(20\d{2})',  # 2020 to 2023
            ]
            
            total_experience = 0
            for pattern in date_patterns:
                matches = re.findall(pattern, text_lower)
                for start_year, end_year in matches:
                    try:
                        years_diff = int(end_year) - int(start_year)
                        if 0 <= years_diff <= 20:  # Reasonable range
                            total_experience += years_diff
                    except ValueError:
                        continue
            
            max_experience = min(total_experience, 25)  # Cap at 25 years
        
        return max_experience
    
    def _extract_skills(self, text_lower: str) -> List[str]:
        """Extract technical skills from resume text"""
        found_skills = []
        
        for category, skills_list in self.technical_skills.items():
            for skill in skills_list:
                # Look for skill mentions (whole word matches)
                pattern = r'\b' + re.escape(skill.lower()) + r'\b'
                if re.search(pattern, text_lower):
                    found_skills.append(skill)
        
        return list(set(found_skills))  # Remove duplicates
    
    def _extract_education_level(self, text_lower: str) -> str:
        """Extract highest education level from resume text"""
        
        highest_level = 'none'
        highest_score = -1
        
        for education, score in self.education_levels.items():
            if education in text_lower and score > highest_score:
                highest_level = education
                highest_score = score
        
        return highest_level
    
    def calculate_skills_match(self, resume_skills: List[str], job_requirements: str) -> float:
        """Calculate skills match percentage between resume and job requirements"""
        
        if not resume_skills:
            return 0.0
        
        job_requirements_lower = job_requirements.lower()
        required_skills = []
        
        # Extract required skills from job description
        for category, skills_list in self.technical_skills.items():
            for skill in skills_list:
                if skill.lower() in job_requirements_lower:
                    required_skills.append(skill.lower())
        
        if not required_skills:
            return 50.0  # Default if no specific skills found in JD
        
        # Calculate match
        resume_skills_lower = [skill.lower() for skill in resume_skills]
        matches = len(set(required_skills) & set(resume_skills_lower))
        
        match_percentage = (matches / len(required_skills)) * 100
        return min(100, match_percentage)
    
    def get_scoring_weights(self) -> Dict[str, float]:
        """Get current scoring weights"""
        return {
            'skills_weight': self.skills_weight,
            'experience_weight': self.experience_weight,
            'education_weight': self.education_weight
        }
    
    def update_scoring_weights(self, skills: float, experience: float, education: float) -> None:
        """Update scoring weights (must sum to 1.0)"""
        total = skills + experience + education
        if abs(total - 1.0) > 0.01:
            raise ValueError("Weights must sum to 1.0")
        
        self.skills_weight = skills
        self.experience_weight = experience
        self.education_weight = education
