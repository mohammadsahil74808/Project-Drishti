"""
SentinelX AI — WebSocket Notifications

`GET /ws/alerts` (upgraded to WS) pushes real-time alerts to every
connected dashboard. The actual alert *creation* happens in Celery
(app/workers/tasks.py), which publishes to Redis channel
`sentinelx:alerts`; `redis_listener()` (started in main.py's lifespan)
subscribes to that channel and rebroadcasts to all connected clients via
`ConnectionManager`.
"""

import asyncio
import json

import redis.asyncio as aioredis
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.config import settings
from app.core.logging import get_logger
from app.services.ws_manager import manager

router = APIRouter(tags=["websocket"])
logger = get_logger("sentinelx.websocket")

REDIS_ALERT_CHANNEL = "sentinelx:alerts"


@router.websocket("/ws/alerts")
async def alerts_websocket(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Clients don't need to send anything; this just keeps the
            # connection alive and detects disconnects promptly.
            await websocket.receive_text()
    except WebSocketDisconnect:
        await manager.disconnect(websocket)


async def redis_listener() -> None:
    """Background task (started at app startup) bridging Redis pub/sub -> WebSocket clients."""
    redis_client = aioredis.from_url(settings.redis_url, decode_responses=True)
    pubsub = redis_client.pubsub()
    await pubsub.subscribe(REDIS_ALERT_CHANNEL)
    logger.info(
        "Subscribed to Redis channel '%s' for alert broadcasting.", REDIS_ALERT_CHANNEL
    )

    try:
        async for message in pubsub.listen():
            if message["type"] != "message":
                continue
            try:
                data = json.loads(message["data"])
            except (json.JSONDecodeError, TypeError):
                continue
            await manager.broadcast(data)
    except asyncio.CancelledError:
        await pubsub.unsubscribe(REDIS_ALERT_CHANNEL)
        raise
