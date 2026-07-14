import pytest

@pytest.mark.analytics
@pytest.mark.integration
def test_network_graph(auth_client):
    resp = auth_client.get("/api/v1/network/graph")
    assert resp.status_code == 200
    data = resp.json()
    assert "nodes" in data
    assert "edges" in data

@pytest.mark.analytics
@pytest.mark.integration
def test_network_central_nodes(auth_client):
    resp = auth_client.get("/api/v1/network/central-nodes")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


