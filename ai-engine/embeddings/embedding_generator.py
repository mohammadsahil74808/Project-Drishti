"""
SentinelX AI — Embedding Generator

Wraps Sentence-Transformers for FIR text embedding. Model loads lazily
(only on first call) and is cached on the instance, since loading the
transformer is the expensive part — never re-instantiate per request.
"""
from __future__ import annotations

import numpy as np

from config import EMBEDDING_DIM, EMBEDDING_MODEL_NAME


class EmbeddingGenerator:
    _instance: "EmbeddingGenerator | None" = None

    def __init__(self, model_name: str = EMBEDDING_MODEL_NAME):
        self.model_name = model_name
        self._model = None

    @classmethod
    def get_shared(cls) -> "EmbeddingGenerator":
        """Process-wide singleton — avoids reloading the transformer per call site."""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _load(self):
        if self._model is None:
            from fastembed import TextEmbedding

            # By default FastEmbed caches to a local directory, very lightweight
            self._model = TextEmbedding(model_name=self.model_name)
        return self._model

    def encode(self, texts: str | list[str], normalize: bool = True) -> np.ndarray:
        """Returns a (n, EMBEDDING_DIM) float32 array. Accepts a single string or a list."""
        single = isinstance(texts, str)
        batch = [texts] if single else list(texts)
        batch = [t if t and t.strip() else " " for t in batch]

        model = self._load()
        # FastEmbed encode returns a generator of numpy arrays
        vectors_gen = model.embed(batch)
        vectors = np.array(list(vectors_gen), dtype="float32")
        
        # FastEmbed automatically normalizes L2 under the hood for most models, 
        # but if we explicitly require it to ensure compatibility:
        if normalize:
            norms = np.linalg.norm(vectors, axis=1, keepdims=True)
            # Avoid division by zero
            norms[norms == 0] = 1
            vectors = vectors / norms

        return vectors[0] if single else vectors

    def dim(self) -> int:
        return EMBEDDING_DIM


def embed_text(text: str) -> list[float]:
    """Convenience function for a single-string embedding, used by fir_service-style callers."""
    return EmbeddingGenerator.get_shared().encode(text).tolist()


def embed_batch(texts: list[str]) -> list[list[float]]:
    return EmbeddingGenerator.get_shared().encode(texts).tolist()
