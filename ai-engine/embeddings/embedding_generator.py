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
            from sentence_transformers import SentenceTransformer

            self._model = SentenceTransformer(self.model_name)
        return self._model

    def encode(self, texts: str | list[str], normalize: bool = True) -> np.ndarray:
        """Returns a (n, EMBEDDING_DIM) float32 array. Accepts a single string or a list."""
        single = isinstance(texts, str)
        batch = [texts] if single else list(texts)
        batch = [t if t and t.strip() else " " for t in batch]

        model = self._load()
        vectors = model.encode(batch, normalize_embeddings=normalize, show_progress_bar=False)
        vectors = np.asarray(vectors, dtype="float32")
        return vectors[0] if single else vectors

    def dim(self) -> int:
        return EMBEDDING_DIM


def embed_text(text: str) -> list[float]:
    """Convenience function for a single-string embedding, used by fir_service-style callers."""
    return EmbeddingGenerator.get_shared().encode(text).tolist()


def embed_batch(texts: list[str]) -> list[list[float]]:
    return EmbeddingGenerator.get_shared().encode(texts).tolist()
