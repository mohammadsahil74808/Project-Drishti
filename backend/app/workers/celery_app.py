"""
Celery application instance, using Redis as broker and result backend.
Task modules are registered here as they're implemented.
"""
# from celery import Celery
# from app.core.config import settings
#
# celery_app = Celery("sentinelx", broker=settings.redis_url, backend=settings.redis_url)
