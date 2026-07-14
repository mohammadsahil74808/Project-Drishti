import pytest

@pytest.mark.integration
def test_get_districts(auth_client):
    resp = auth_client.get("/api/v1/geo/districts")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)

@pytest.mark.integration
def test_get_heatmap(auth_client):
    resp = auth_client.get("/api/v1/geo/heatmap")
    assert resp.status_code == 200
    assert "points" in resp.json()

@pytest.mark.integration
def test_get_hotspots(auth_client):
    resp = auth_client.get("/api/v1/geo/hotspots")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


