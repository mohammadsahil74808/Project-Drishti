"""
SentinelX AI — Application Configuration

Loaded from environment variables (see root .env.example). Single source of
truth for every setting used across the backend — never read os.environ
directly elsewhere in the app.
"""
import json
from functools import lru_cache
from typing import List, Union
from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(ROOT_DIR / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ---- App ----
    app_name: str = "SentinelX AI"
    app_env: str = "development"
    app_debug: bool = True
    app_secret_key: str = "change-me-to-a-long-random-string"
    api_v1_prefix: str = "/api/v1"

    # ---- Database ----
    database_url: str = (
        "postgresql+psycopg2://sentinelx:change-me@localhost:5432/sentinelx_db"
    )
    db_pool_size: int = 10
    db_max_overflow: int = 20

    # ---- Redis / Celery ----
    redis_url: str = "redis://localhost:6379/0"

    # ---- Auth / JWT ----
    jwt_secret_key: str = "change-me-to-a-long-random-string"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 7

    # ---- CORS ----
    cors_allow_origins: Union[str, List[str]] = ["http://localhost:5173"]

    # ---- AI / ML ----
    embedding_model_name: str = "paraphrase-multilingual-MiniLM-L12-v2"
    faiss_index_path: str = "./data/faiss_index"
    ai_engine_url: str = "https://sentinelx-ai-engine.onrender.com"

    # ---- Logging ----
    log_level: str = "INFO"

    @field_validator("cors_allow_origins", mode="before")
    @classmethod
    def _split_csv(cls, v):
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v


@lru_cache
def get_settings() -> Settings:
    """Cached settings singleton — import this, not Settings() directly."""
    return Settings()


settings = get_settings()