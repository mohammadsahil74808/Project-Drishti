import pytest
import uuid

@pytest.mark.analytics
@pytest.mark.integration
def test_risk_zone(auth_client, ref_resolver):
    # Depending on how Risk Predictor works, it might accept any UUID or need a real zone ID.
    # We will pass a random valid-looking UUID or the district_id
    zone_id = ref_resolver.get_district_id()
    resp = auth_client.get(f"/api/v1/risk/zone/{zone_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert "score" in data
    assert "shap_explanation" in data

@pytest.mark.analytics
@pytest.mark.integration
def test_risk_person(auth_client):
    suspect_id = str(uuid.uuid4())
    resp = auth_client.get(f"/api/v1/risk/person/{suspect_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert "score" in data
    assert "shap_explanation" in data


