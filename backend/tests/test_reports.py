import pytest
import uuid
from tests.utils import generate_unique_string

try:
    from app.workers.celery_app import celery_app
except ImportError:
    pytest.skip("Celery background task processor not configured", allow_module_level=True)

@pytest.mark.reports
@pytest.mark.integration
def test_reports_crud(auth_client):
    # POST
    payload = {
        "title": f"Test Report {generate_unique_string()}",
        "type": "weekly",
        "parameters": {"date": "2026-07-14"}
    }
    post_resp = auth_client.post("/api/v1/reports/generate", json=payload)
    assert post_resp.status_code == 202
    report_id = post_resp.json()["id"]
    
    # GET LIST
    list_resp = auth_client.get("/api/v1/reports")
    assert list_resp.status_code == 200
    assert any(r["id"] == report_id for r in list_resp.json())
    
    # GET DOWNLOAD (usually returns a presigned URL or binary)
    dl_resp = auth_client.get(f"/api/v1/reports/{report_id}/download")
    assert dl_resp.status_code in (200, 307, 409) # Might not be ready yet

@pytest.mark.reports
@pytest.mark.integration
def test_reports_download_nonexistent(auth_client):
    fake_id = str(uuid.uuid4())
    resp = auth_client.get(f"/api/v1/reports/{fake_id}/download")
    assert resp.status_code == 404

@pytest.mark.reports
@pytest.mark.integration
def test_reports_invalid_payload(auth_client):
    # missing type
    payload = {
        "district_id": str(uuid.uuid4())
    }
    resp = auth_client.post("/api/v1/reports/generate", json=payload)
    assert resp.status_code == 422
