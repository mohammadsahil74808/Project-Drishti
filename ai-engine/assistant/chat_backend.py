"""
SentinelX AI — AI Chat Assistant Backend

Intent router sitting in front of the AI engine's capabilities: detects
what kind of question was asked (search / classify / general) and calls
the right module. This is the engine-side counterpart to backend/app/
services/assistant_service.py — designed to be callable either as a
library (import ChatAssistant directly) or via api/inference_api.py's
/chat endpoint when running as a standalone service.
"""
from __future__ import annotations

import re
import uuid
from datetime import datetime

from assistant.rag_pipeline import RAGPipeline
from nlp.fir_parser import parse_fir_text

SEARCH_PATTERN = re.compile(r"\b(find|search|similar|show me|cases? (like|involving))\b", re.IGNORECASE)
PARSE_PATTERN = re.compile(r"\b(extract|parse|what crime|what happened|summarize this)\b", re.IGNORECASE)


class ChatAssistant:
    def __init__(self):
        self.rag = RAGPipeline()

    def handle(self, query: str, session_id: str | None = None) -> dict:
        intent = self._detect_intent(query)

        if intent == "parse":
            parsed = parse_fir_text(query)
            content = self._describe_parsed(parsed)
            payload = {"type": "parsed_fir", "data": parsed}
        elif intent == "search":
            rag_result = self.rag.generate_answer(query)
            content = rag_result["answer"]
            payload = {"type": "search_results", "data": rag_result["sources"]}
        else:
            content = (
                "I can search indexed cases, parse crime narratives into structured fields, "
                "or answer questions about trends and forecasts. Try: 'find cases similar to "
                "a chain snatching near MG Road' or 'what crime type is this: ...'"
            )
            payload = None

        return {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "role": "assistant",
            "content": content,
            "intent": intent,
            "created_at": datetime.utcnow().isoformat(),
            "chart_payload": payload,
        }

    def _detect_intent(self, query: str) -> str:
        if PARSE_PATTERN.search(query):
            return "parse"
        if SEARCH_PATTERN.search(query):
            return "search"
        return "general"

    def _describe_parsed(self, parsed: dict) -> str:
        parts = []
        if parsed.get("crime_type"):
            parts.append(f"crime type: {parsed['crime_type']} (confidence {parsed['crime_type_confidence']})")
        if parsed.get("locations"):
            parts.append(f"location(s): {', '.join(parsed['locations'])}")
        if parsed.get("time_mentions"):
            parts.append(f"time: {', '.join(parsed['time_mentions'])}")
        if parsed.get("weapons"):
            parts.append(f"weapon(s): {', '.join(parsed['weapons'])}")
        if parsed.get("vehicles"):
            parts.append(f"vehicle(s): {', '.join(parsed['vehicles'])}")
        return "Extracted — " + "; ".join(parts) if parts else "No structured fields could be confidently extracted."


def handle_chat_message(query: str, session_id: str | None = None) -> dict:
    return ChatAssistant().handle(query, session_id)
