import pytest
import uuid
from tests.utils import generate_fir_no, current_utc_iso

@pytest.mark.crud
@pytest.mark.integration
def test_fir_crud(auth_client, ref_resolver):
    # setup ref
    district_id = ref_resolver.get_district_id()
    station_id = ref_resolver.get_station_id()
    fir_no = generate_fir_no()
    
    # POST
    payload = {
        "fir_no": fir_no,
        "station_id": station_id,
        "district_id": district_id,
        "crime_type": "theft",
        "ipc_sections": ["379"],
        "incident_datetime": current_utc_iso(),
        "reported_datetime": current_utc_iso(),
        "location": {"lat": 12.9716, "lng": 77.5946},
        "address_text": "Integration Test Address",
        "mo_description": "Test MO"
    }
    post_resp = auth_client.post("/api/v1/fir", json=payload)
    assert post_resp.status_code == 201
    fir_id = post_resp.json()["id"]
    
    # GET LIST
    list_resp = auth_client.get("/api/v1/fir")
    assert list_resp.status_code == 200
    assert list_resp.json()["total"] > 0
    
    # GET BY ID
    get_resp = auth_client.get(f"/api/v1/fir/{fir_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["fir_no"] == fir_no
    
    # PATCH
    patch_resp = auth_client.patch(f"/api/v1/fir/{fir_id}", json={"status": "closed"})
    assert patch_resp.status_code == 200
    assert patch_resp.json()["status"] == "closed"
    
    # GET AGAIN
    get_again = auth_client.get(f"/api/v1/fir/{fir_id}")
    assert get_again.status_code == 200
    assert get_again.json()["status"] == "closed"

@pytest.mark.crud
@pytest.mark.integration
def test_fir_duplicate_no(auth_client, ref_resolver):
    district_id = ref_resolver.get_district_id()
    station_id = ref_resolver.get_station_id()
    fir_no = generate_fir_no()
    
    payload = {
        "fir_no": fir_no,
        "station_id": station_id,
        "district_id": district_id,
        "crime_type": "theft",
        "incident_datetime": current_utc_iso(),
        "reported_datetime": current_utc_iso(),
        "location": {"lat": 12.9716, "lng": 77.5946}
    }
    resp1 = auth_client.post("/api/v1/fir", json=payload)
    assert resp1.status_code == 201
    
    resp2 = auth_client.post("/api/v1/fir", json=payload)
    assert resp2.status_code == 409

@pytest.mark.crud
@pytest.mark.integration
def test_fir_invalid_payload(auth_client, ref_resolver):
    # Missing required 'location'
    payload = {
        "fir_no": generate_fir_no(),
        "station_id": ref_resolver.get_station_id(),
        "district_id": ref_resolver.get_district_id(),
        "crime_type": "theft",
        "incident_datetime": current_utc_iso(),
        "reported_datetime": current_utc_iso(),
    }
    resp = auth_client.post("/api/v1/fir", json=payload)
    assert resp.status_code == 422

@pytest.mark.crud
@pytest.mark.integration
def test_fir_nonexistent_id(auth_client):
    fake_id = str(uuid.uuid4())
    resp = auth_client.get(f"/api/v1/fir/{fake_id}")
    assert resp.status_code == 404
