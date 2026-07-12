"""
SentinelX AI — Logging Configuration

Structured, consistent logging across the API, workers, and AI pipelines.
Call configure_logging() once at process startup (main.py and celery_app.py).
"""
import logging
import sys

from app.core.config import settings

LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


def configure_logging() -> None:
    root_logger = logging.getLogger()
    root_logger.setLevel(settings.log_level.upper())

    if root_logger.handlers:
        return

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT))
    root_logger.addHandler(handler)

    for noisy in ("uvicorn.access", "sqlalchemy.engine"):
        logging.getLogger(noisy).setLevel(
            logging.WARNING if not settings.app_debug else logging.INFO
        )


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)