from __future__ import annotations
import re
import uuid
from datetime import datetime

try:
    from transformers import pipeline
    _llm = pipeline("text2text-generation", model="google/flan-t5-small", max_length=200)
except Exception:
    _llm = None

from assistant.rag_pipeline import RAGPipeline

class ChatAssistant:
    def __init__(self):
        self.rag = RAGPipeline()

    def handle(self, query: str, session_id: str | None = None) -> dict:
        intent = self._detect_intent(query)
        payload = None

        try:
            if intent == "greeting":
                content = "Hello! I am SentinelX, your Intelligence Assistant. I am running in Standalone AI Mode."
            elif intent == "identity":
                content = "I am SentinelX AI. I can analyze crime trends, search FIRs, evaluate criminal networks, and generate forecasts."
            elif intent == "crime_trend":
                content = "### Crime Trends\n\n(Standalone Mode) The top crime category historically is Theft, followed by Assault. Connect the backend database for live metrics."
            elif intent == "district_compare":
                content = "### District Comparison\n\n(Standalone Mode) Both districts exhibit standard seasonal variations. Connect the backend DB for live stats."
            elif intent == "fir_summary":
                content = "### Recent FIR Summary\n\n(Standalone Mode) Recent FIRs show a mix of vehicle theft and cyber crime. Connect the backend DB for live FIRs."
            elif intent == "hotspots":
                content = "### Most Dangerous Districts (Hotspots)\n\n(Standalone Mode) 1. Bengaluru Urban\n2. Mysuru\n3. Hubballi"
            elif intent == "network":
                content = "### Top Wanted Suspects\n\n(Standalone Mode) Suspect network visualization requires the backend Graph DB."
            elif intent == "forecast":
                content = "### Forecast\n\n(Standalone Mode) Short-term risk is stable. Check the Predictive Forecast dashboard for live statistical bands."
            elif intent == "search":
                content = self._handle_search(query)
            else:
                content = self._handle_general(query)

            return {
                "id": str(uuid.uuid4()),
                "session_id": session_id,
                "role": "assistant",
                "content": content,
                "intent": intent,
                "created_at": datetime.utcnow().isoformat(),
                "chart_payload": payload,
            }
        except Exception as e:
            print(f"Assistant Error: {e}")
            return {
                "id": str(uuid.uuid4()),
                "session_id": session_id,
                "role": "assistant",
                "content": "I encountered a technical issue while generating the response. Please try again.",
                "intent": "error",
                "created_at": datetime.utcnow().isoformat(),
                "chart_payload": None,
            }

    def _detect_intent(self, query: str) -> str:
        q = query.lower()
        if re.search(r'\b(compare)\b', q): return "district_compare"
        if re.search(r'\b(trend|trends|growth|statistics)\b', q): return "crime_trend"
        if re.search(r'\b(summarize|summary|firs? from|last week)\b', q): return "fir_summary"
        if re.search(r'\b(hotspot|hotspots|highest crime|dangerous|top crime)\b', q): return "hotspots"
        if re.search(r'\b(network|criminals|suspects|gangs|connected|wanted)\b', q): return "network"
        if re.search(r'\b(forecast|risk|future|predict)\b', q): return "forecast"
        if re.search(r'\b(search|similar|find)\b', q): return "search"
        if re.search(r'^(hi|hello|hey|good morning)\b', q): return "greeting"
        if re.search(r'\b(who are you|capabilities)\b', q): return "identity"
        return "general"

    def _handle_search(self, query: str) -> str:
        rag_result = self.rag.generate_answer(query)
        if not rag_result["sources"]:
            return "No matching records were found in the standalone vector index."
            
        top = rag_result["sources"][0]
        ans = f"### Search Results\n\nI found {len(rag_result['sources'])} similar cases in the vector index. The closest match is:\n\n"
        ans += f"**FIR {top['fir_no']}** (Relevance: {top['score']:.2f})\n"
        ans += f"> {top['snippet'][:200]}...\n"
        return ans

    def _handle_general(self, query: str) -> str:
        if _llm:
            try:
                prompt = f"As a helpful police assistant, briefly answer: {query}"
                res = _llm(prompt, max_new_tokens=60, do_sample=True, temperature=0.7)
                return res[0]["generated_text"] if isinstance(res, list) else str(res)
            except Exception:
                pass
        return "I am currently focused on answering crime intelligence queries. Please ask me about crime trends, forecasts, hotspots, or search for FIRs."

def handle_chat_message(query: str, session_id: str | None = None) -> dict:
    return ChatAssistant().handle(query, session_id)

