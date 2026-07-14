"""
SentinelX AI — AI Assistant Service
"""
import uuid
from sqlalchemy.orm import Session

def answer_query(db: Session, query: str, district_id: uuid.UUID | None = None) -> dict:
    return {
        "message": "AI Assistant is not configured."
    }