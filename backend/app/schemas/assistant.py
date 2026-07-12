"""SentinelX AI — AI Assistant / semantic search schemas."""
import uuid
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel


class ChatMessageRequest(BaseModel):
    query: str
    session_id: str | None = None


class ChatMessageResponse(BaseModel):
    id: uuid.UUID
    role: Literal["assistant"] = "assistant"
    content: str
    created_at: datetime
    chart_payload: dict[str, Any] | None = None


class SemanticSearchRequest(BaseModel):
    query: str
    top_k: int = 10


class SemanticSearchResult(BaseModel):
    fir_id: uuid.UUID
    fir_no: str
    score: float
    snippet: str


class SemanticSearchResponse(BaseModel):
    query: str
    results: list[SemanticSearchResult]