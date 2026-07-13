"""
SentinelX AI — AI Assistant Service
"""
import re
import uuid
from datetime import datetime

from sqlalchemy.orm import Session

from app.schemas.analytics import CrimeTrendResponse
from app.schemas.assistant import ChatMessageResponse
from assistant.chat_backend import handle_chat_message



def answer_query(db: Session, query: str, district_id: uuid.UUID | None = None) -> ChatMessageResponse:
    session_id = str(uuid.uuid4())
    try:
        ai_response = handle_chat_message(query, session_id=session_id)
        content = ai_response.get("response", ai_response.get("content", ""))
        chart_payload = ai_response.get("data")
    except Exception as e:
        content = f"Error communicating with AI engine: {e}"
        chart_payload = None

    return ChatMessageResponse(
        id=uuid.uuid4(),
        content=content,
        created_at=datetime.utcnow(),
        chart_payload=chart_payload,
    )
    