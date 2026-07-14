import pytest
import uuid

@pytest.mark.crud
@pytest.mark.integration
def test_alerts_crud(auth_client, db_session):
    # GET LIST
    list_resp = auth_client.get("/api/v1/alerts")
    assert list_resp.status_code == 200
    alerts = list_resp.json()
    
    # We might not have alerts yet, so testing ACK on a real one might be hard unless we seed
    # Let's seed an alert if empty just for testing ACK
    if not alerts:
        from app.models.alert import Alert, AlertSeverity, AlertType
        alert = Alert(
            title="Test Alert",
            message="Test integration alert",
            severity=AlertSeverity.high,
            type=AlertType.risk_threshold
        )
        db_session.add(alert)
        db_session.commit()
        list_resp = auth_client.get("/api/v1/alerts")
        alerts = list_resp.json()
        
    alert_id = alerts[0]["id"]
    
    # POST ACK
    ack_resp = auth_client.post(f"/api/v1/alerts/{alert_id}/acknowledge")
    assert ack_resp.status_code == 200
    assert ack_resp.json()["acknowledged"] is True
    
    # ACK again shouldn't fail or crash
    ack_again = auth_client.post(f"/api/v1/alerts/{alert_id}/acknowledge")
    assert ack_again.status_code == 200

@pytest.mark.crud
@pytest.mark.integration
def test_alerts_ack_nonexistent(auth_client):
    fake_id = str(uuid.uuid4())
    resp = auth_client.post(f"/api/v1/alerts/{fake_id}/acknowledge")
    assert resp.status_code == 404
