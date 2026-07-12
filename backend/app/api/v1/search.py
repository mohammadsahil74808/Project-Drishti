"""SentinelX AI — Semantic Search router."""

from fastapi import APIRouter

from app.core.deps import DbSession
from app.schemas.assistant import SemanticSearchRequest, SemanticSearchResponse
from app.services import search_service

router = APIRouter(prefix="/search", tags=["search"])


@router.post("/semantic", response_model=SemanticSearchResponse)
def semantic_search(payload: SemanticSearchRequest, db: DbSession):
    return search_service.semantic_search(db, payload.query, payload.top_k)
