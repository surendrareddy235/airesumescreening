import faiss
import numpy as np
from typing import List, Tuple, Optional
import logging

logger = logging.getLogger(__name__)

class FAISSSearchService:
    """Service for vector similarity search using FAISS"""
    
    def __init__(self):
        self.index = None
        self.dimension = None
        self.embeddings = None
    
    def build_index(self, embeddings: List[np.ndarray]) -> None:
        """Build FAISS index from embeddings"""
        try:
            if not embeddings:
                raise ValueError("No embeddings provided")
            
            # Convert to numpy array
            embeddings_array = np.array(embeddings).astype('float32')
            
            # Store embeddings and get dimension
            self.embeddings = embeddings_array
            self.dimension = embeddings_array.shape[1]
            
            # Create FAISS index (using L2 distance, then convert to cosine similarity)
            self.index = faiss.IndexFlatIP(self.dimension)  # Inner Product for cosine similarity
            
            # Normalize embeddings for cosine similarity
            faiss.normalize_L2(embeddings_array)
            
            # Add embeddings to index
            self.index.add(embeddings_array)
            
            logger.info(f"FAISS index built successfully with {len(embeddings)} embeddings")
            
        except Exception as e:
            logger.error(f"Failed to build FAISS index: {str(e)}")
            raise
    
    def search(self, query_embedding: np.ndarray, k: Optional[int] = None) -> List[float]:
        """Search for similar embeddings and return similarity scores"""
        try:
            if self.index is None:
                raise RuntimeError("FAISS index not built. Call build_index() first.")
            
            # Use all embeddings if k not specified
            if k is None:
                k = self.index.ntotal
            
            # Ensure k doesn't exceed available embeddings
            k = min(k, self.index.ntotal)
            
            # Prepare query embedding
            query_array = np.array([query_embedding]).astype('float32')
            faiss.normalize_L2(query_array)
            
            # Search
            similarities, indices = self.index.search(query_array, k)
            
            # Convert inner product back to similarity scores (0-100 scale)
            similarity_scores = []
            for i in range(len(indices[0])):
                if indices[0][i] != -1:  # Valid result
                    # Inner product similarity (already normalized)
                    inner_product = similarities[0][i]
                    # Convert to 0-100 scale
                    similarity_percentage = max(0, min(100, (inner_product + 1) * 50))
                    similarity_scores.append(float(similarity_percentage))
                else:
                    similarity_scores.append(0.0)
            
            return similarity_scores
            
        except Exception as e:
            logger.error(f"Failed to search FAISS index: {str(e)}")
            raise
    
    def search_top_k(self, query_embedding: np.ndarray, k: int = 10) -> List[Tuple[int, float]]:
        """Search for top-k similar embeddings and return indices with scores"""
        try:
            if self.index is None:
                raise RuntimeError("FAISS index not built. Call build_index() first.")
            
            # Ensure k doesn't exceed available embeddings
            k = min(k, self.index.ntotal)
            
            # Prepare query embedding
            query_array = np.array([query_embedding]).astype('float32')
            faiss.normalize_L2(query_array)
            
            # Search
            similarities, indices = self.index.search(query_array, k)
            
            # Prepare results
            results = []
            for i in range(len(indices[0])):
                if indices[0][i] != -1:  # Valid result
                    idx = indices[0][i]
                    inner_product = similarities[0][i]
                    # Convert to 0-100 scale
                    similarity_percentage = max(0, min(100, (inner_product + 1) * 50))
                    results.append((int(idx), float(similarity_percentage)))
            
            return results
            
        except Exception as e:
            logger.error(f"Failed to search top-k in FAISS index: {str(e)}")
            raise
    
    def get_embedding(self, index: int) -> Optional[np.ndarray]:
        """Get embedding by index"""
        try:
            if self.embeddings is None or index < 0 or index >= len(self.embeddings):
                return None
            return self.embeddings[index]
        except Exception as e:
            logger.error(f"Failed to get embedding at index {index}: {str(e)}")
            return None
    
    def get_index_info(self) -> dict:
        """Get information about the current index"""
        if self.index is None:
            return {"status": "not_built"}
        
        return {
            "status": "built",
            "total_vectors": self.index.ntotal,
            "dimension": self.dimension,
            "index_type": "IndexFlatIP"  # Inner Product for cosine similarity
        }
    
    def clear_index(self) -> None:
        """Clear the current index"""
        self.index = None
        self.dimension = None
        self.embeddings = None
        logger.info("FAISS index cleared")
