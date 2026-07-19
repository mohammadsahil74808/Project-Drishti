from contextlib import asynccontextmanager
import logging

import sys
import os

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
import redis

from app.api.v1.router import api_router
from app.core.config import settings

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up Backend API...")
    yield

app = FastAPI(
    title=settings.app_name,
    description="AI-Driven Crime Analytics & Visualization Platform — Karnataka State Police",
    version="0.1.0",
    lifespan=lifespan,
)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=settings.cors_allow_origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

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
    import requests
    try:
        resp = requests.get(f"{settings.ai_engine_url}/health", timeout=5.0)
        resp.raise_for_status()
        return {"status": "ok", "ai_engine": "connected", "details": resp.json()}
    except Exception as e:
        return {"status": "error", "ai_engine": "disconnected", "detail": str(e)}
