from contextlib import asynccontextmanager
import logging

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'lib')))

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
import redis

from app.api.v1.router import api_router
from app.core.config import settings

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up and loading AI models...")
    try:
        from app.ai.classification.crime_classifier import CrimeClassifier
        app.state.crime_classifier = CrimeClassifier.load_latest()
    except Exception:
        app.state.crime_classifier = None

    try:
        from app.ai.risk_scoring.risk_predictor import RiskPredictor
        app.state.risk_predictor = RiskPredictor.load_latest()
    except Exception:
        app.state.risk_predictor = None

    try:
        from app.ai.search.semantic_search import SemanticSearchService
        app.state.semantic_search = SemanticSearchService()
    except Exception:
        app.state.semantic_search = None

    yield
    app.state.crime_classifier = None
    app.state.risk_predictor = None
    app.state.semantic_search = None

app = FastAPI(
    title=settings.app_name,
    description="AI-Driven Crime Analytics & Visualization Platform — Karnataka State Police",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)

from app.core.deps import DbSession

@app.get("/health", tags=["system"])
def health_check():
    return {"status": "ok", "service": "SentinelX AI backend"}

@app.get("/health/db", tags=["system"])
def health_db(db: DbSession):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "db": "connected"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}

@app.get("/health/redis", tags=["system"])
def health_redis():
    try:
        r = redis.from_url(settings.redis_url)
        if r.ping():
            return {"status": "ok", "redis": "connected"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}

@app.get("/health/ai", tags=["system"])
def health_ai():
    return {
        "status": "ok",
        "crime_classifier": app.state.crime_classifier is not None,
        "risk_predictor": app.state.risk_predictor is not None,
        "semantic_search": app.state.semantic_search is not None,
    }
