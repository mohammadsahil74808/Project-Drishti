"""
SentinelX AI — WebSocket Connection Manager

In-process registry of connected WebSocket clients for a given channel
(currently just "alerts"). Celery workers run in a separate process, so
they can't call this directly — they publish to a Redis pub/sub channel
instead (see `publish_alert` in app/services/alert_service.py additions
/ app/workers/tasks.py), and `RedisListener` below bridges that into
`ConnectionManager.broadcast()` for every connected browser tab.
"""

import asyncio
import json

from fastapi import WebSocket

from app.core.logging import get_logger

logger = get_logger("sentinelx.websocket")


class ConnectionManager:
    def __init__(self) -> None:
        self._connections: set[WebSocket] = set()
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            self._connections.add(websocket)
        logger.info(
            "WebSocket connected. Active connections: %d", len(self._connections)
        )

    async def disconnect(self, websocket: WebSocket) -> None:
        async with self._lock:
            self._connections.discard(websocket)
        logger.info(
            "WebSocket disconnected. Active connections: %d", len(self._connections)
        )

    async def broadcast(self, message: dict) -> None:
        payload = json.dumps(message, default=str)
        stale: list[WebSocket] = []
        for connection in list(self._connections):
            try:
                await connection.send_text(payload)
            except Exception:
                stale.append(connection)
        for conn in stale:
            await self.disconnect(conn)


manager = ConnectionManager()
