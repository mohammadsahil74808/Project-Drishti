import pytest

@pytest.fixture
def check_classifier(client):
    resp = client.get("/api/v1/health/ai")
    if resp.status_code == 200:
        if not resp.json().get("crime_classifier"):
            pytest.skip("Crime Classifier AI service unavailable")
    else:
        pytest.skip("Could not check AI health")

@pytest.mark.analytics
@pytest.mark.integration
def test_analytics_trend(auth_client):
    resp = auth_client.get("/api/v1/analytics/trend")
    assert resp.status_code == 200
    data = resp.json()
    assert "points" in data

@pytest.mark.analytics
@pytest.mark.integration
def test_analytics_distribution(auth_client):
    resp = auth_client.get("/api/v1/analytics/distribution")
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data

@pytest.mark.analytics
@pytest.mark.integration
def test_analytics_day_of_week(auth_client):
    resp = auth_client.get("/api/v1/analytics/day-of-week")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)

@pytest.mark.analytics
@pytest.mark.integration
def test_analytics_insight(auth_client):
    resp = auth_client.get("/api/v1/analytics/insight")
    if resp.status_code in (500, 503):
        pytest.skip("Insight AI service unavailable")
    assert resp.status_code == 200
    data = resp.json()
    assert "summary" in data

@pytest.mark.ai
@pytest.mark.integration
def test_analytics_classify(auth_client, check_classifier):
    payload = {
        "text": "Someone broke into my house and stole my laptop."
    }
    resp = auth_client.post("/api/v1/analytics/classify", json=payload)
    if resp.status_code in (500, 503):
        pytest.skip("Crime Classifier AI service unavailable or failed")
    assert resp.status_code == 200
    data = resp.json()
    assert "predicted_type" in data
    assert "confidence" in data
    
@pytest.mark.ai
@pytest.mark.integration
def test_analytics_classify_invalid_payload(auth_client, check_classifier):
    payload = {}
    resp = auth_client.post("/api/v1/analytics/classify", json=payload)
    assert resp.status_code == 422
