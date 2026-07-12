"""
SentinelX AI — Semantic Search Service
"""
import math

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.fir import FIRRecord
from app.schemas.assistant import SemanticSearchResponse, SemanticSearchResult


def semantic_search(db: Session, query: str, top_k: int = 10) -> SemanticSearchResponse:
    like_pattern = f"%{query}%"
    stmt = (
        select(FIRRecord)
        .where(
            or_(
                FIRRecord.mo_description.ilike(like_pattern),
                FIRRecord.address_text.ilike(like_pattern),
                FIRRecord.fir_no.ilike(like_pattern),
            )
        )
        .order_by(FIRRecord.incident_datetime.desc())
        .limit(top_k)
    )
    rows = list(db.scalars(stmt))

    results = []
    for i, fir in enumerate(rows):
        score = round(max(0.4, 1.0 - (i * (0.6 / max(top_k, 1)))), 2)
        snippet = (fir.mo_description or fir.address_text or "")[:180]
        results.append(
            SemanticSearchResult(fir_id=fir.id, fir_no=fir.fir_no, score=score, snippet=snippet)
        )

    return SemanticSearchResponse(query=query, results=results)