import pytest
from tests.utils import generate_badge_no

@pytest.mark.auth
@pytest.mark.integration
def test_login_success(client, db_session):
    # Relies on ADMIN001 existing (handled by auth_client fixture in other tests, but we need it here)
    # Actually, we can just use the login endpoint
    resp = client.post("/api/v1/auth/login", json={
        "badge_no": "ADMIN001",
        "password": "Admin@123"
    })
    # If ADMIN001 wasn't seeded yet, this might fail, so we should seed it locally just in case
    if resp.status_code == 401:
        from app.models.user import User, UserRole
        from app.core.security import hash_password
        admin = User(name="Admin", badge_no="ADMIN001", role=UserRole.admin, password_hash=hash_password("Admin@123"))
        db_session.add(admin)
        db_session.commit()
        resp = client.post("/api/v1/auth/login", json={"badge_no": "ADMIN001", "password": "Admin@123"})
    
    assert resp.status_code == 200
    assert "access_token" in resp.json()
    assert "refresh_token" in resp.json()

@pytest.mark.auth
@pytest.mark.integration
def test_login_invalid_credentials(client):
    resp = client.post("/api/v1/auth/login", json={
        "badge_no": "INVALID",
        "password": "WrongPassword"
    })
    assert resp.status_code == 401

@pytest.mark.auth
@pytest.mark.integration
def test_refresh_token(auth_client, client):
    # First login to get refresh token
    resp = client.post("/api/v1/auth/login", json={
        "badge_no": "ADMIN001",
        "password": "Admin@123"
    })
    refresh_token = resp.json()["refresh_token"]
    
    # Now refresh
    refresh_resp = client.post("/api/v1/auth/refresh", json={
        "refresh_token": refresh_token
    })
    assert refresh_resp.status_code == 200
    assert "access_token" in refresh_resp.json()

@pytest.mark.auth
@pytest.mark.integration
def test_refresh_token_invalid(client):
    resp = client.post("/api/v1/auth/refresh", json={
        "refresh_token": "invalid.jwt.token"
    })
    assert resp.status_code == 401

@pytest.mark.auth
@pytest.mark.integration
def test_get_me(auth_client):
    resp = auth_client.get("/api/v1/auth/me")
    assert resp.status_code == 200
    assert resp.json()["badge_no"] == "ADMIN001"

@pytest.mark.auth
@pytest.mark.integration
def test_get_me_unauthorized(client):
    resp = client.get("/api/v1/auth/me")
    assert resp.status_code == 401

@pytest.mark.auth
@pytest.mark.integration
def test_get_me_invalid_jwt(client):
    client.headers.update({"Authorization": "Bearer invalid.jwt.token"})
    resp = client.get("/api/v1/auth/me")
    assert resp.status_code == 401
