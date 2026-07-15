from __future__ import annotations
import re
import sys
import os
import uuid
from datetime import datetime

# Setup path for backend DB access
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend')))
from app.db.session import SessionLocal
from app.models.fir import FIR
from app.models.geo import District
from app.models.people import Suspect
from app.models.analytics import RiskScore
from sqlalchemy import select, func, desc

try:
    from transformers import pipeline
    _llm = pipeline("text2text-generation", model="google/flan-t5-small", max_length=200)
except Exception:
    _llm = None

from assistant.rag_pipeline import RAGPipeline

class ChatAssistant:
    def __init__(self):
        self.rag = RAGPipeline()
        self.db = SessionLocal()

    def __del__(self):
        self.db.close()

    def handle(self, query: str, session_id: str | None = None) -> dict:
        intent = self._detect_intent(query)
        payload = None

        try:
            if intent == "greeting":
                content = "Hello! I am SentinelX, your Intelligence Assistant. I am connected to the live Karnataka Police database. How can I assist you with case analysis today?"
            elif intent == "identity":
                content = "I am SentinelX AI. I can analyze crime trends, search FIRs, evaluate criminal networks, and generate forecasts across Karnataka using real police data."
            elif intent == "crime_trend":
                content = self._handle_crime_trend(query)
            elif intent == "district_compare":
                content = self._handle_district_compare(query)
            elif intent == "fir_summary":
                content = self._handle_fir_summary(query)
            elif intent == "hotspots":
                content = self._handle_hotspots(query)
            elif intent == "network":
                content = self._handle_network(query)
            elif intent == "forecast":
                content = self._handle_forecast(query)
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
                "content": "I encountered a technical issue while querying the Karnataka database. Please try again.",
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

    def _extract_districts(self, query: str) -> list[District]:
        q = query.lower()
        districts = self.db.scalars(select(District)).all()
        return [d for d in districts if d.name.lower() in q]

    def _handle_crime_trend(self, query: str) -> str:
        dists = self._extract_districts(query)
        stmt = select(FIR.crime_type, func.count(FIR.id)).group_by(FIR.crime_type).order_by(desc(func.count(FIR.id)))
        if dists:
            stmt = stmt.where(FIR.district_id == dists[0].id)
            
        results = self.db.execute(stmt).all()
        if not results:
            return "No matching Karnataka Police records were found for this trend."
            
        loc = dists[0].name if dists else "Karnataka"
        ans = f"### Crime Trends in {loc}\n\nHere are the top reported crime categories based on live FIR data:\n\n"
        ans += "| Crime Type | Total Cases |\n|---|---|\n"
        for row in results[:5]:
            ans += f"| {row[0].title().replace('_', ' ')} | {row[1]} |\n"
        return ans

    def _handle_district_compare(self, query: str) -> str:
        dists = self._extract_districts(query)
        if len(dists) < 2:
            return "Please specify at least two valid Karnataka districts to compare (e.g., 'Compare Mysuru and Ballari')."
        
        d1, d2 = dists[0], dists[1]
        c1 = self.db.scalar(select(func.count(FIR.id)).where(FIR.district_id == d1.id))
        c2 = self.db.scalar(select(func.count(FIR.id)).where(FIR.district_id == d2.id))
        
        ans = f"### District Comparison: {d1.name} vs {d2.name}\n\n"
        ans += "| Metric | " + d1.name + " | " + d2.name + " |\n|---|---|---|\n"
        ans += f"| Total FIRs | {c1} | {c2} |\n"
        
        higher = d1.name if c1 > c2 else d2.name
        if c1 != c2:
            ans += f"\n**{higher}** currently has a higher volume of recorded cases."
        else:
            ans += f"\nBoth districts have the same number of recorded cases."
        return ans

    def _handle_fir_summary(self, query: str) -> str:
        stmt = select(FIR).order_by(desc(FIR.reported_datetime)).limit(5)
        dists = self._extract_districts(query)
        if dists:
            stmt = stmt.where(FIR.district_id == dists[0].id)
            
        firs = self.db.scalars(stmt).all()
        if not firs:
            return "No recent FIRs found in the database."
            
        loc = dists[0].name if dists else "Karnataka"
        ans = f"### Recent FIR Summary ({loc})\n\n"
        for f in firs:
            ans += f"- **{f.fir_no}** ({f.crime_type.title().replace('_', ' ')}): {f.description[:100]}...\n"
        return ans

    def _handle_hotspots(self, query: str) -> str:
        stmt = select(District.name, func.count(FIR.id)).join(FIR).group_by(District.name).order_by(desc(func.count(FIR.id))).limit(3)
        results = self.db.execute(stmt).all()
        if not results:
            return "No hotspot data found."
            
        ans = "### Most Dangerous Districts (Hotspots)\n\nBased on recent FIR density, these are the top hotspots in Karnataka:\n\n"
        for idx, row in enumerate(results, 1):
            ans += f"{idx}. **{row[0]}** ({row[1]} cases)\n"
        return ans

    def _handle_network(self, query: str) -> str:
        dists = self._extract_districts(query)
        # Using a raw query or joining. For SQLite/Postgres we can just check array length or simple join.
        # Suspect.prior_case_ids is an array. We can just fetch all and sort in Python to avoid Postgres specific array length functions.
        stmt = select(Suspect)
        if dists:
            stmt = stmt.join(FIR).where(FIR.district_id == dists[0].id)
            
        suspects = self.db.scalars(stmt).all()
        if not suspects:
            return "No matching suspects or criminal networks found."
            
        suspects.sort(key=lambda s: len(s.prior_case_ids) if s.prior_case_ids else 0, reverse=True)
        
        loc = dists[0].name if dists else "Karnataka"
        ans = f"### Top Wanted / Connected Suspects in {loc}\n\n"
        ans += "| Suspect Alias | Prior Cases | Age Group |\n|---|---|---|\n"
        for s in suspects[:5]:
            cases = len(s.prior_case_ids) if s.prior_case_ids else 0
            ans += f"| {s.display_label} | {cases} | {s.age_bucket} |\n"
        return ans

    def _handle_forecast(self, query: str) -> str:
        dists = self._extract_districts(query)
        if dists:
            c = self.db.scalar(select(func.count(FIR.id)).where(FIR.district_id == dists[0].id))
            trend = "rising" if c > 5 else "stable"
            return f"### Forecast for {dists[0].name}\n\nBased on {c} historical cases, the short-term risk is **{trend}**. Check the Predictive Forecast dashboard for statistical confidence bands."
        
        stmt = select(District.name, RiskScore.score).join(RiskScore, RiskScore.district_id == District.id).order_by(desc(RiskScore.score)).limit(3)
        results = self.db.execute(stmt).all()
        if not results:
            return "No forecast data available."
            
        ans = "### Highest Risk Districts (Forecast)\n\n"
        for row in results:
            ans += f"- **{row[0]}** (Risk Score: {row[1]:.1f})\n"
        return ans

    def _handle_search(self, query: str) -> str:
        rag_result = self.rag.generate_answer(query)
        if not rag_result["sources"]:
            return "No matching Karnataka Police records were found."
            
        top = rag_result["sources"][0]
        ans = f"### Search Results\n\nI found {len(rag_result['sources'])} similar cases. The closest match is:\n\n"
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
