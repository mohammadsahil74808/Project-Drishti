from fastapi import APIRouter
from app.core.ai_deps import SemanticSearchDep
from app.schemas.assistant import SemanticSearchRequest, SemanticSearchResponse
from app.services import search_service

router = APIRouter(prefix="/search", tags=["search"])

@router.post("/semantic", response_model=SemanticSearchResponse)
def semantic_search(payload: SemanticSearchRequest, semantic_model: SemanticSearchDep):
    return search_service.semantic_search(payload.query, payload.top_k, semantic_model)
