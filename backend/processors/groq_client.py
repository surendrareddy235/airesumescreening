import httpx
import json
from typing import List, Dict, Any, Optional
import logging
from config import settings

logger = logging.getLogger(__name__)

class GroqClient:
    """Client for interacting with Groq API for LLM-powered candidate ranking"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GROQ_API_KEY
        self.base_url = "https://api.groq.com/openai/v1"
        self.model = "mixtral-8x7b-32768"  # Groq's Mixtral model
        
        if not self.api_key:
            logger.warning("Groq API key not configured. LLM ranking will be disabled.")
    
    async def rank_candidates(
        self, 
        job_description: str, 
        candidates_data: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Rank candidates using Groq LLM"""
        
        if not self.api_key:
            logger.warning("Groq API not configured, using fallback scoring")
            return self._fallback_ranking(candidates_data)
        
        try:
            # Prepare candidate summaries for the prompt
            candidate_summaries = []
            for i, candidate in enumerate(candidates_data):
                info = candidate.get('info', {})
                candidate_summaries.append(
                    f"Candidate {i+1}:\n"
                    f"- Name: {info.get('name', 'Unknown')}\n"
                    f"- Experience: {info.get('experience_years', 0)} years\n"
                    f"- Skills: {', '.join(info.get('skills', []))}\n"
                    f"- Education: {info.get('education_level', 'Not specified')}\n"
                    f"- Initial Score: {candidate.get('weighted_score', 0):.1f}%\n"
                )
            
            # Create the prompt
            prompt = self._create_ranking_prompt(job_description, candidate_summaries)
            
            # Call Groq API
            response = await self._call_groq_api(prompt)
            
            # Parse response
            parsed_results = self._parse_groq_response(response, candidates_data)
            
            return {
                'candidates': parsed_results,
                'tokens_used': response.get('usage', {}).get('total_tokens', 0),
                'model_used': self.model
            }
            
        except Exception as e:
            logger.error(f"Groq API call failed: {str(e)}")
            return self._fallback_ranking(candidates_data)
    
    def _create_ranking_prompt(
        self, 
        job_description: str, 
        candidate_summaries: List[str]
    ) -> str:
        """Create a structured prompt for candidate ranking"""
        
        candidates_text = "\n\n".join(candidate_summaries)
        
        prompt = f"""You are an expert HR professional tasked with ranking candidates for a job position. 

JOB DESCRIPTION:
{job_description}

CANDIDATES TO EVALUATE:
{candidates_text}

INSTRUCTIONS:
1. Analyze each candidate's fit for the role based on:
   - Skills alignment with job requirements (60% weight)
   - Relevant experience level (30% weight) 
   - Educational background (10% weight)

2. For each candidate, provide:
   - A match score from 0-100 (higher is better)
   - A brief 1-2 sentence reasoning explaining the score

3. Output your analysis in this exact JSON format:
{{
  "candidates": [
    {{
      "candidate_number": 1,
      "match_score": 85,
      "reasoning": "Strong technical skills match with relevant experience in required technologies."
    }},
    ...
  ]
}}

Be objective and focus on qualifications relevant to the job requirements. Provide realistic scores based on actual fit."""

        return prompt
    
    async def _call_groq_api(self, prompt: str) -> Dict[str, Any]:
        """Make API call to Groq"""
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert HR professional who provides objective, data-driven candidate assessments."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.1,  # Low temperature for consistent results
            "max_tokens": 2000
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload,
                timeout=30.0
            )
            
            response.raise_for_status()
            return response.json()
    
    def _parse_groq_response(
        self, 
        response: Dict[str, Any], 
        original_candidates: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Parse Groq API response and extract candidate rankings"""
        
        try:
            content = response['choices'][0]['message']['content']
            
            # Try to extract JSON from the response
            json_start = content.find('{')
            json_end = content.rfind('}') + 1
            
            if json_start != -1 and json_end != -1:
                json_str = content[json_start:json_end]
                parsed_data = json.loads(json_str)
                
                results = []
                groq_candidates = parsed_data.get('candidates', [])
                
                for i, groq_result in enumerate(groq_candidates):
                    if i < len(original_candidates):
                        results.append({
                            'match_score': groq_result.get('match_score', original_candidates[i].get('weighted_score', 50)),
                            'reasoning': groq_result.get('reasoning', 'LLM analysis completed')
                        })
                
                # Fill any missing candidates with fallback scores
                while len(results) < len(original_candidates):
                    idx = len(results)
                    results.append({
                        'match_score': original_candidates[idx].get('weighted_score', 50),
                        'reasoning': 'Fallback scoring applied'
                    })
                
                return results
            
        except (json.JSONDecodeError, KeyError, IndexError) as e:
            logger.error(f"Failed to parse Groq response: {str(e)}")
        
        # Fallback: return original scores
        return self._fallback_ranking(original_candidates)['candidates']
    
    def _fallback_ranking(self, candidates_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Fallback ranking when Groq API is unavailable"""
        
        results = []
        for candidate in candidates_data:
            weighted_score = candidate.get('weighted_score', 50)
            
            # Add some basic reasoning based on score
            if weighted_score >= 85:
                reasoning = "Strong match based on skills and experience analysis"
            elif weighted_score >= 70:
                reasoning = "Good match with some relevant qualifications"
            elif weighted_score >= 50:
                reasoning = "Moderate match, may need additional evaluation"
            else:
                reasoning = "Limited match with current job requirements"
            
            results.append({
                'match_score': weighted_score,
                'reasoning': reasoning
            })
        
        return {
            'candidates': results,
            'tokens_used': 0,
            'model_used': 'fallback_scoring'
        }
    
    def test_connection(self) -> bool:
        """Test if Groq API is accessible"""
        if not self.api_key:
            return False
        
        try:
            import asyncio
            
            async def test():
                try:
                    response = await self._call_groq_api("Test connection")
                    return True
                except:
                    return False
            
            return asyncio.run(test())
            
        except Exception:
            return False
