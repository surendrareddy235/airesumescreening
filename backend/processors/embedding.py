from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Union
import logging
from config import settings

logger = logging.getLogger(__name__)

class EmbeddingService:
    """Service for creating and managing embeddings using sentence-transformers"""
    
    def __init__(self, model_name: str = None):
        self.model_name = model_name or settings.EMBEDDING_MODEL
        self.model = None
        self._load_model()
    
    def _load_model(self):
        """Load the sentence transformer model"""
        try:
            logger.info(f"Loading embedding model: {self.model_name}")
            self.model = SentenceTransformer(self.model_name)
            logger.info("Embedding model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load embedding model: {str(e)}")
            raise
    
    def create_embedding(self, text: str) -> np.ndarray:
        """Create embedding for a single text"""
        if not self.model:
            raise RuntimeError("Embedding model not loaded")
        
        try:
            # Clean and preprocess text
            clean_text = self._preprocess_text(text)
            
            # Generate embedding
            embedding = self.model.encode(clean_text, convert_to_numpy=True)
            return embedding
        
        except Exception as e:
            logger.error(f"Failed to create embedding: {str(e)}")
            raise
    
    def create_embeddings(self, texts: List[str]) -> List[np.ndarray]:
        """Create embeddings for multiple texts"""
        if not self.model:
            raise RuntimeError("Embedding model not loaded")
        
        try:
            # Clean and preprocess texts
            clean_texts = [self._preprocess_text(text) for text in texts]
            
            # Generate embeddings
            embeddings = self.model.encode(clean_texts, convert_to_numpy=True)
            return [embedding for embedding in embeddings]
        
        except Exception as e:
            logger.error(f"Failed to create embeddings: {str(e)}")
            raise
    
    def _preprocess_text(self, text: str) -> str:
        """Preprocess text before creating embeddings"""
        if not text or not isinstance(text, str):
            return ""
        
        # Basic cleaning
        text = text.strip()
        
        # Remove excessive whitespace
        text = ' '.join(text.split())
        
        # Truncate if too long (model-specific limits)
        max_length = 512  # Most sentence-transformer models have this limit
        words = text.split()
        if len(words) > max_length:
            text = ' '.join(words[:max_length])
        
        return text
    
    def calculate_similarity(self, embedding1: np.ndarray, embedding2: np.ndarray) -> float:
        """Calculate cosine similarity between two embeddings"""
        try:
            # Ensure embeddings are numpy arrays
            embedding1 = np.array(embedding1)
            embedding2 = np.array(embedding2)
            
            # Calculate cosine similarity
            dot_product = np.dot(embedding1, embedding2)
            norm1 = np.linalg.norm(embedding1)
            norm2 = np.linalg.norm(embedding2)
            
            if norm1 == 0 or norm2 == 0:
                return 0.0
            
            similarity = dot_product / (norm1 * norm2)
            
            # Convert to percentage and ensure it's between 0-100
            similarity_percentage = max(0, min(100, (similarity + 1) * 50))
            
            return similarity_percentage
        
        except Exception as e:
            logger.error(f"Failed to calculate similarity: {str(e)}")
            return 0.0
    
    def get_model_info(self) -> dict:
        """Get information about the loaded model"""
        if not self.model:
            return {"status": "not_loaded"}
        
        return {
            "status": "loaded",
            "model_name": self.model_name,
            "max_seq_length": getattr(self.model, 'max_seq_length', 'unknown'),
            "embedding_dimension": self.model.get_sentence_embedding_dimension()
        }
