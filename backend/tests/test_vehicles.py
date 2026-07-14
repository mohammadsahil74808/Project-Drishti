import pytest

@pytest.mark.analytics
@pytest.mark.integration
def test_vehicles_theft_trends(auth_client):
    resp = auth_client.get("/api/v1/vehicles/theft-trends")
    assert resp.status_code == 200
    data = resp.json()
    assert "points" in data

@pytest.mark.analytics
@pytest.mark.integration
def test_vehicles_recovery_rate(auth_client):
    resp = auth_client.get("/api/v1/vehicles/recovery-rate?vehicle_type=2w")
    assert resp.status_code == 200
    data = resp.json()
    assert "recovery_rate_percent" in data
    assert "total_stolen" in data
    assert "total_recovered" in data


