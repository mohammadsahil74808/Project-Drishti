"""
SentinelX AI — Pytest Fixtures

DB-backed tests need a real PostgreSQL+PostGIS instance (Geography columns
aren't supported by SQLite), so `db_session` connects to
`TEST_DATABASE_URL` (defaults to the local docker-compose Postgres) and
auto-skips the whole DB-dependent test module if that database isn't
reachable — keeps `pytest` runnable in CI/sandboxes without Postgres while
still running for real against `docker compose up db`.
"""
import os

import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.models import Base

TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    "postgresql+psycopg2://sentinelx:change-me@localhost:5432/sentinelx_test_db",
)


def _database_available() -> bool:
    try:
        engine = create_engine(TEST_DATABASE_URL)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


requires_db = pytest.mark.skipif(
    not _database_available(),
    reason="No reachable PostgreSQL+PostGIS test database (set TEST_DATABASE_URL).",
)


@pytest.fixture(scope="session")
def db_engine():
    engine = create_engine(TEST_DATABASE_URL)
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))
        conn.commit()
    Base.metadata.create_all(engine)
    yield engine
    Base.metadata.drop_all(engine)


@pytest.fixture()
def db_session(db_engine):
    SessionLocal = sessionmaker(bind=db_engine)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()


@pytest.fixture()
def client(db_engine, db_session):
    from fastapi.testclient import TestClient

    from app.core.deps import get_db
    from app.main import app

    def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
