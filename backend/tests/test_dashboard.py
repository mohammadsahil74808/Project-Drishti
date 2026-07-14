import pytest

@pytest.mark.analytics
@pytest.mark.integration
def test_dashboard_summary(auth_client):
    resp = auth_client.get("/api/v1/dashboard/summary")
    assert resp.status_code == 200
    data = resp.json()
    assert "stats" in data
    assert "district_risk" in data
    

