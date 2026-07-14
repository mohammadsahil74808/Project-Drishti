"""
SentinelX AI — Pytest Fixtures

DB-backed tests need a real PostgreSQL+PostGIS instance.
"""
import os

import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.models import Base
from tests.pytest_reporter import ReportingTestClient
from tests.pytest_reporter import pytest_runtest_makereport, pytest_sessionfinish # Important hooks

TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    "postgresql+psycopg2://postgres:Sahil%40123@localhost:5432/sentinelx_db",
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
    reason="No reachable PostgreSQL+PostGIS test database.",
)

@pytest.fixture(scope="session")
def db_engine():
    engine = create_engine(TEST_DATABASE_URL)
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))
        conn.commit()
    Base.metadata.create_all(engine)
    yield engine
    # Base.metadata.drop_all(engine)  # We should keep it for DB debugging, but we could drop

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
    from app.core.deps import get_db
    from app.main import app

    def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    with ReportingTestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

# Expose plugins for pytest hooks
pytest_plugins = [
    "tests.fixtures",
]
