"""
SentinelX AI — Auth API tests (requires a reachable Postgres+PostGIS test DB).
Run with: docker compose up -d db  (then) pytest tests/test_auth_api.py
"""
from app.core.security import hash_password
from app.models.user import User, UserRole
from tests.conftest import requires_db


@requires_db
def test_login_success(client, db_session):
    user = User(
        name="Inspector Test",
        badge_no="KSP-TEST-001",
        role=UserRole.SHO,
        password_hash=hash_password("supersecret123"),
    )
    db_session.add(user)
    db_session.commit()

    response = client.post(
        "/api/v1/auth/login",
        json={"badge_no": "KSP-TEST-001", "password": "supersecret123"},
    )
    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body
    assert body["user"]["badge_no"] == "KSP-TEST-001"


@requires_db
def test_login_wrong_password(client, db_session):
    user = User(
        name="Inspector Test2",
        badge_no="KSP-TEST-002",
        role=UserRole.SHO,
        password_hash=hash_password("correctpassword"),
    )
    db_session.add(user)
    db_session.commit()

    response = client.post(
        "/api/v1/auth/login",
        json={"badge_no": "KSP-TEST-002", "password": "wrongpassword"},
    )
    assert response.status_code == 401


@requires_db
def test_me_requires_auth(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


@requires_db
def test_login_then_me(client, db_session):
    user = User(
        name="Inspector Test3",
        badge_no="KSP-TEST-003",
        role=UserRole.ANALYST,
        password_hash=hash_password("mypassword123"),
    )
    db_session.add(user)
    db_session.commit()

    login_resp = client.post(
        "/api/v1/auth/login",
        json={"badge_no": "KSP-TEST-003", "password": "mypassword123"},
    )
    token = login_resp.json()["access_token"]

    me_resp = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["badge_no"] == "KSP-TEST-003"
