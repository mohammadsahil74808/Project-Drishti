import pytest
import uuid
from tests.utils import generate_badge_no

@pytest.mark.crud
@pytest.mark.integration
def test_users_crud(auth_client):
    # POST
    badge_no = generate_badge_no()
    payload = {
        "name": "Test Officer",
        "badge_no": badge_no,
        "role": "constable",
        "password": "Password123"
    }
    post_resp = auth_client.post("/api/v1/users", json=payload)
    assert post_resp.status_code == 201
    
    # GET LIST
    list_resp = auth_client.get("/api/v1/users")
    assert list_resp.status_code == 200
    assert len(list_resp.json()) > 0
    
    # GET BY ID (user_id)
    user_id = next(u["id"] for u in list_resp.json() if u["badge_no"] == badge_no)
    get_resp = auth_client.get(f"/api/v1/users/{user_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["badge_no"] == badge_no
    
    # PATCH
    patch_resp = auth_client.patch(f"/api/v1/users/{user_id}", json={"name": "Updated Officer"})
    assert patch_resp.status_code == 200
    assert patch_resp.json()["name"] == "Updated Officer"
    
    # GET AGAIN
    get_again = auth_client.get(f"/api/v1/users/{user_id}")
    assert get_again.status_code == 200
    assert get_again.json()["name"] == "Updated Officer"

@pytest.mark.crud
@pytest.mark.integration
def test_create_duplicate_user(auth_client):
    badge_no = generate_badge_no()
    payload = {
        "name": "Test Officer",
        "badge_no": badge_no,
        "role": "constable",
        "password": "Password123"
    }
    resp1 = auth_client.post("/api/v1/users", json=payload)
    assert resp1.status_code == 201
    
    resp2 = auth_client.post("/api/v1/users", json=payload)
    assert resp2.status_code == 409

@pytest.mark.crud
@pytest.mark.integration
def test_get_nonexistent_user(auth_client):
    fake_id = str(uuid.uuid4())
    resp = auth_client.get(f"/api/v1/users/{fake_id}")
    assert resp.status_code == 404

@pytest.mark.crud
@pytest.mark.integration
def test_change_password(auth_client):
    # Uses ADMIN001
    resp = auth_client.post("/api/v1/users/me/change-password", json={
        "current_password": "Admin@123",
        "new_password": "Admin@123" # Keep it the same for rerunnability
    })
    assert resp.status_code == 200

@pytest.mark.crud
@pytest.mark.integration
def test_invalid_role(auth_client):
    payload = {
        "name": "Test Officer",
        "badge_no": generate_badge_no(),
        "role": "INVALID_ROLE",
        "password": "Password123"
    }
    resp = auth_client.post("/api/v1/users", json=payload)
    assert resp.status_code == 422
