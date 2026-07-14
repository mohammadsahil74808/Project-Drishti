"""SentinelX AI — AI Assistant router (REST fallback; see also app/api/v1/websocket.py for streaming)."""

from fastapi import APIRouter

from app.core.deps import DbSession
from app.schemas.assistant import ChatMessageRequest
from app.services import assistant_service

router = APIRouter(prefix="/assistant", tags=["assistant"])


@router.post("/chat")
def chat(payload: ChatMessageRequest, db: DbSession):
    return assistant_service.answer_query(db, payload.query, None)
