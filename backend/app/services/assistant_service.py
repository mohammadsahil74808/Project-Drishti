"""
SentinelX AI — AI Assistant Service
"""
import re
import uuid
from datetime import datetime

from sqlalchemy.orm import Session

from app.schemas.analytics import CrimeTrendResponse
from app.schemas.assistant import ChatMessageResponse
from app.services import analytics_service, search_service


def answer_query(db: Session, query: str, district_id: uuid.UUID | None = None) -> ChatMessageResponse:
    normalized = query.lower()

    if re.search(r"trend|how many|volume|cases?\b", normalized):
        distribution = analytics_service.get_crime_type_distribution(db, district_id, None, None)
        trend = analytics_service.get_crime_trend(db, district_id, None, None, None, "daily")
        insight = analytics_service.generate_ai_insight(distribution, trend)
        content = insight.summary
        chart_payload = {
            "type": "distribution",
            "data": [i.model_dump(mode="json") for i in distribution.items[:5]],
        }
    elif re.search(r"search|find|show me cases|pattern", normalized):
        results = search_service.semantic_search(db, query, top_k=5)
        if results.results:
            content = (
                f"Found {len(results.results)} matching cases. Top match: FIR "
                f"{results.results[0].fir_no} — \"{results.results[0].snippet[:100]}\""
            )
        else:
            content = "No matching cases found for that description in the current dataset."
        chart_payload = {"type": "search_results", "data": [r.model_dump(mode="json") for r in results.results]}
    else:
        content = (
            "I can answer questions about crime trends, case volumes, and search FIR "
            "narratives. Try asking about a specific crime type, district, or time range."
        )
        chart_payload = None

    return ChatMessageResponse(
        id=uuid.uuid4(),
        content=content,
        created_at=datetime.utcnow(),
        chart_payload=chart_payload,
    )
    