from fastapi import APIRouter
from app.schemas.assistant import SemanticSearchRequest, SemanticSearchResponse
from app.services import search_service

router = APIRouter(prefix="/search", tags=["search"])

@router.post("/semantic", response_model=SemanticSearchResponse)
def semantic_search(payload: SemanticSearchRequest):
    return search_service.semantic_search(payload.query, payload.top_k)

