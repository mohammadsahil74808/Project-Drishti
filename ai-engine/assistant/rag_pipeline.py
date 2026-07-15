"""
SentinelX AI — RAG Pipeline

Retrieval-Augmented Generation over indexed FIR text: retrieve top-k
relevant FIRs via semantic_search, then compose a grounded context block.
Generation itself is template-based (no external LLM key required — free
tier), matching the pattern already used in backend/app/services/
assistant_service.py. `generate_answer`'s prompt-assembly step is the
exact swap point for a real LLM call (LangChain + any provider) later —
everything upstream of it (retrieval, context formatting) doesn't change.
"""
from __future__ import annotations

from search.semantic_search import SemanticSearchService


class RAGPipeline:
    def __init__(self):
        self.search_service = SemanticSearchService()

    def retrieve(self, query: str, top_k: int = 5) -> list[dict]:
        return self.search_service.search(query, top_k=top_k)

    def build_context(self, retrieved: list[dict]) -> str:
        if not retrieved:
            return "No relevant cases found in the indexed dataset."
        lines = [f"[{r['fir_no']}] (relevance {r['score']:.2f}): {r['snippet']}" for r in retrieved]
        return "\n".join(lines)

    def generate_answer(self, query: str, top_k: int = 5) -> dict:
        retrieved = self.retrieve(query, top_k=top_k)
        context = self.build_context(retrieved)

        if not retrieved:
            answer = "I couldn't find indexed cases matching your query."
        else:
            top = retrieved[0]
            answer = (
                f"Found {len(retrieved)} relevant case(s). The closest match is FIR {top['fir_no']} "
                f"(relevance {top['score']:.2f}): \"{top['snippet'][:150]}...\""
            )

        return {
            "query": query,
            "answer": answer,
            "sources": retrieved,
            "context_used": context,
        }
