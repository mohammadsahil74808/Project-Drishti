"""
SentinelX AI — Semantic Search Service

Combines EmbeddingGenerator + FAISSIndexManager into the retrieval API
consumed by inference_api.py and the RAG pipeline. `index_fir` is called
once per FIR at ingestion time (or in bulk by training/train scripts);
`search` is the hot read path.
"""
from __future__ import annotations

from embeddings.embedding_generator import EmbeddingGenerator
from search.faiss_index import FAISSIndexManager


class SemanticSearchService:
    def __init__(self):
        self._embedder = EmbeddingGenerator.get_shared()
        self._index = FAISSIndexManager.get_shared()

    def index_fir(self, fir_id: str, fir_no: str, text: str) -> None:
        vector = self._embedder.encode(text)
        self._index.add(vector.reshape(1, -1), [{"fir_id": fir_id, "fir_no": fir_no, "snippet": text[:200]}])

    def index_fir_batch(self, rows: list[dict]) -> int:
        """rows: [{fir_id, fir_no, text}, ...]. Returns count indexed."""
        if not rows:
            return 0
        texts = [r["text"] for r in rows]
        vectors = self._embedder.encode(texts)
        metadata = [{"fir_id": r["fir_id"], "fir_no": r["fir_no"], "snippet": r["text"][:200]} for r in rows]
        self._index.add(vectors, metadata)
        return len(rows)

    def search(self, query: str, top_k: int = 10) -> list[dict]:
        if not query or not query.strip():
            return []
        query_vector = self._embedder.encode(query)
        return self._index.search(query_vector, top_k)

    def persist(self) -> None:
        self._index.save()

    def find_similar_firs(self, fir_text: str, top_k: int = 5, exclude_fir_id: str | None = None) -> list[dict]:
        """Used by the recommendation engine: 'FIRs similar to this one'."""
        results = self.search(fir_text, top_k=top_k + 1)
        if exclude_fir_id:
            results = [r for r in results if r.get("fir_id") != exclude_fir_id]
        return results[:top_k]
