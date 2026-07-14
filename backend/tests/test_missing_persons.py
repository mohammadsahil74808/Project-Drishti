import pytest
import uuid
from tests.utils import generate_unique_string, current_utc_iso

@pytest.mark.crud
@pytest.mark.integration
def test_missing_persons_crud(auth_client, ref_resolver):
    
    # POST
    payload = {
        "name_hash": f"hash_{generate_unique_string()}",
        "age": 30,
        "last_seen_date": "2026-07-14",
        "last_seen_location": {"lat": 12.9, "lng": 77.5},
        "last_seen_address": "MG Road"
    }
    post_resp = auth_client.post("/api/v1/missing-persons", json=payload)
    assert post_resp.status_code == 201
    mp_id = post_resp.json()["id"]
    
    # GET LIST
    list_resp = auth_client.get("/api/v1/missing-persons")
    assert list_resp.status_code == 200
    assert any(mp["id"] == mp_id for mp in list_resp.json())
    
    # GET BY ID
    get_resp = auth_client.get(f"/api/v1/missing-persons/{mp_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == mp_id
    
    # GET MATCHES
    match_resp = auth_client.get(f"/api/v1/missing-persons/{mp_id}/matches")
    assert match_resp.status_code == 200
    # Might be empty list or populated depending on AI mock, just assert it succeeds
    assert "candidates" in match_resp.json()

@pytest.mark.crud
@pytest.mark.integration
def test_missing_persons_invalid_payload(auth_client, ref_resolver):
    payload = {
        "age": 30,
        "last_seen_date": "2026-07-14",
    }
    resp = auth_client.post("/api/v1/missing-persons", json=payload)
    assert resp.status_code == 422

@pytest.mark.crud
@pytest.mark.integration
def test_missing_persons_nonexistent_id(auth_client):
    fake_id = str(uuid.uuid4())
    resp = auth_client.get(f"/api/v1/missing-persons/{fake_id}")
    assert resp.status_code == 404
