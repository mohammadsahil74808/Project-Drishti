"""
SentinelX AI — AI Assistant Service
"""
import uuid
from sqlalchemy.orm import Session

import httpx
from app.core.logging import get_logger

logger = get_logger(__name__)

def answer_query(db: Session, query: str, district_id: uuid.UUID | None = None) -> dict:
    try:
        # Connect to the standalone AI engine microservice
        with httpx.Client(timeout=30.0) as client:
            resp = client.post(
                "http://localhost:8500/assistant/chat",
                json={"query": query, "session_id": str(district_id) if district_id else None}
            )
            resp.raise_for_status()
            data = resp.json()
            # Map the ai-engine response format back to what the frontend expects
            return {
                "content": data.get("content", "No content returned from AI Engine.")
            }
    except Exception as e:
        logger.error(f"Failed to communicate with AI Engine: {e}")
        return {
            "content": "The AI Engine is currently offline or unreachable. Please start the ai-engine microservice."
        }