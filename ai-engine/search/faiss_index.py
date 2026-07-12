"""
SentinelX AI — FAISS Index Manager

Persists a flat L2 FAISS index + parallel JSON metadata (fir_id, fir_no,
snippet) to disk under config.MODEL_REGISTRY_DIR. Uses IndexFlatIP over
normalized vectors (== cosine similarity) since the FIR corpus size
(tens of thousands of records) doesn't need an approximate index yet —
swap to IndexIVFFlat/HNSW if corpus size grows past ~1M vectors.
"""
from __future__ import annotations

import json
import threading
from pathlib import Path

import numpy as np

from config import EMBEDDING_DIM, FAISS_INDEX_PATH, FAISS_METADATA_PATH


class FAISSIndexManager:
    _instance: "FAISSIndexManager | None" = None

    def __init__(self, dim: int = EMBEDDING_DIM):
        self.dim = dim
        self._index = None
        self._metadata: list[dict] = []
        self._lock = threading.Lock()
        self._load_or_init()

    @classmethod
    def get_shared(cls) -> "FAISSIndexManager":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _load_or_init(self) -> None:
        import faiss

        if Path(FAISS_INDEX_PATH).exists() and Path(FAISS_METADATA_PATH).exists():
            self._index = faiss.read_index(str(FAISS_INDEX_PATH))
            self._metadata = json.loads(Path(FAISS_METADATA_PATH).read_text())
        else:
            self._index = faiss.IndexFlatIP(self.dim)
            self._metadata = []

    def add(self, vectors: np.ndarray, metadata_rows: list[dict]) -> None:
        """vectors: (n, dim) float32, L2-normalized. metadata_rows: parallel list of dicts."""
        if len(vectors) != len(metadata_rows):
            raise ValueError("vectors and metadata_rows must be the same length.")
        with self._lock:
            self._index.add(vectors.astype("float32"))
            self._metadata.extend(metadata_rows)

    def search(self, query_vector: np.ndarray, top_k: int = 10) -> list[dict]:
        if self._index.ntotal == 0:
            return []
        query = query_vector.reshape(1, -1).astype("float32")
        scores, indices = self._index.search(query, min(top_k, self._index.ntotal))

        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx == -1:
                continue
            row = dict(self._metadata[idx])
            row["score"] = float(score)
            results.append(row)
        return results

    def save(self) -> None:
        import faiss

        with self._lock:
            faiss.write_index(self._index, str(FAISS_INDEX_PATH))
            Path(FAISS_METADATA_PATH).write_text(json.dumps(self._metadata))

    def size(self) -> int:
        return self._index.ntotal if self._index else 0

    def reset(self) -> None:
        import faiss

        with self._lock:
            self._index = faiss.IndexFlatIP(self.dim)
            self._metadata = []
