"""
SentinelX AI — Database Layer Configuration

Standalone config for the database/ module (independent of backend/app/core
so this layer can be provisioned/migrated/seeded before or separately from
the backend service — e.g. by a DBA or a CI migration job).
"""
import os

from pydantic_settings import BaseSettings, SettingsConfigDict


class DatabaseSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    postgres_user: str = "sentinelx"
    postgres_password: str = "change-me"
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "sentinelx_db"

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg2://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )


settings = DatabaseSettings()
