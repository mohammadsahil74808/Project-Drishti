"""
Celery application instance, using Redis as broker and result backend.
Task modules are registered here as they're implemented.
"""
from celery import Celery
from app.core.config import settings

celery_app = Celery("sentinelx", broker=settings.redis_url, backend=settings.redis_url)

# Fail fast if Redis is unavailable
celery_app.conf.broker_connection_retry_on_startup = False
celery_app.conf.broker_connection_timeout = 2.0
