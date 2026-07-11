"""
SentinelX AI — FastAPI application entrypoint.

This is a scaffold-stage placeholder. Route registration, middleware,
and startup/shutdown events will be added in the backend implementation phase.
"""
from fastapi import FastAPI

app = FastAPI(
    title="SentinelX AI",
    description="AI-Driven Crime Analytics & Visualization Platform — Karnataka State Police",
    version="0.1.0",
)


@app.get("/health", tags=["system"])
def health_check():
    """Basic liveness check — extended with DB/Redis checks in a later phase."""
    return {"status": "ok", "service": "SentinelX AI backend"}
