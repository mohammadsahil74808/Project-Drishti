"""
SentinelX AI — AI Engine Inference API

Standalone FastAPI service exposing every AI-engine capability over HTTP.
Runs independently of the main backend (`uvicorn api.inference_api:app
--port 8500`) — the main backend can either call this service over HTTP
or import ai-engine modules directly as a library; this file exists for
the former deployment style (e.g. scaling the AI workload on separate
infra from the CRUD API).
"""
from __future__ import annotations

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'lib')))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from api.schemas import (
    ChatRequest,
    ClassifyRequest,
    ForecastRequest,
    IndexFIRRequest,
    NetworkAnalyzeRequest,
    ParseFIRRequest,
    RiskPredictRequest,
    SemanticSearchRequest,
)
from assistant.chat_backend import handle_chat_message
from classification.crime_classifier import CrimeClassifier
from config import INFERENCE_API_HOST, INFERENCE_API_PORT
from network.network_analyzer import analyze_network
from nlp.fir_parser import parse_fir_text
from risk.risk_predictor import RiskPredictor
from search.semantic_search import SemanticSearchService

app = FastAPI(
    title="SentinelX AI — AI Engine",
    description="Standalone inference service for NLP, search, classification, risk, forecasting, and network analysis.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten to the backend's origin in production
    allow_methods=["*"],
    allow_headers=["*"],
)

_search_service = SemanticSearchService()


@app.get("/health", tags=["system"])
def health_check():
    return {"status": "ok", "service": "sentinelx-ai-engine"}


# ---- NLP ----
@app.post("/nlp/parse-fir", tags=["nlp"])
def parse_fir(payload: ParseFIRRequest):
    return parse_fir_text(payload.text, use_spacy=payload.use_spacy)


# ---- Classification ----
@app.post("/classify", tags=["classification"])
def classify(payload: ClassifyRequest):
    try:
        classifier = CrimeClassifier.load_latest()
    except FileNotFoundError as exc:
        raise HTTPException(503, f"No trained classifier available yet: {exc}") from exc
    return classifier.predict(payload.text)


# ---- Semantic Search ----
@app.post("/search/index", tags=["search"])
def index_fir(payload: IndexFIRRequest):
    _search_service.index_fir(payload.fir_id, payload.fir_no, payload.text)
    _search_service.persist()
    return {"status": "indexed", "fir_id": payload.fir_id}


@app.post("/search/semantic", tags=["search"])
def semantic_search(payload: SemanticSearchRequest):
    results = _search_service.search(payload.query, top_k=payload.top_k)
    return {"query": payload.query, "results": results}


# ---- Risk Scoring ----
@app.post("/risk/predict", tags=["risk"])
def predict_risk(payload: RiskPredictRequest):
    try:
        predictor = RiskPredictor.load_latest()
    except FileNotFoundError as exc:
        raise HTTPException(503, f"No trained risk model available yet: {exc}") from exc

    feature_row = payload.model_dump(exclude={"explain"})
    return predictor.predict(feature_row, explain=payload.explain)


# ---- Forecasting ----
@app.post("/forecast/predict", tags=["forecast"])
def predict_forecast(payload: ForecastRequest):
    from forecasting.forecaster import CrimeForecaster
    from registry.model_registry import registry

    model_name = f"crime_forecaster__{payload.district.replace(' ', '_')}"
    try:
        bundle = registry.load_latest(model_name)
    except FileNotFoundError as exc:
        raise HTTPException(
            503, f"No trained forecaster for district '{payload.district}' yet: {exc}"
        ) from exc

    forecaster = CrimeForecaster()
    forecaster.prophet_model = bundle["prophet_model"]
    forecaster.residual_model = bundle["residual_model"]
    return {"district": payload.district, "points": forecaster.predict(payload.horizon_days)}


# ---- Criminal Network ----
@app.post("/network/analyze", tags=["network"])
def network_analyze(payload: NetworkAnalyzeRequest):
    nodes = [n.model_dump() for n in payload.nodes]
    edges = [e.model_dump() for e in payload.edges]
    return analyze_network(nodes, edges)


# ---- AI Chat Assistant ----
@app.post("/assistant/chat", tags=["assistant"])
def chat(payload: ChatRequest):
    return handle_chat_message(payload.query, payload.session_id)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("api.inference_api:app", host=INFERENCE_API_HOST, port=INFERENCE_API_PORT, reload=True)
