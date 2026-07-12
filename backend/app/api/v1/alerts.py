"""SentinelX AI — Alerts router."""

import uuid

from fastapi import APIRouter, HTTPException, status

from app.core.deps import CurrentUser, DbSession
from app.schemas.alert import AlertAcknowledgeResponse, AlertResponse
from app.services import alert_service

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("", response_model=list[AlertResponse])
def list_alerts(
    db: DbSession, current_user: CurrentUser, station_id: uuid.UUID | None = None
):
    return alert_service.list_alerts(db, current_user.role.value, station_id)


@router.post("/{alert_id}/acknowledge", response_model=AlertAcknowledgeResponse)
def acknowledge_alert(alert_id: uuid.UUID, db: DbSession, current_user: CurrentUser):
    try:
        alert = alert_service.acknowledge_alert(db, alert_id, current_user.id)
    except alert_service.AlertNotFoundError as exc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, str(exc)) from exc
    return AlertAcknowledgeResponse(
        id=alert.id, acknowledged=alert.acknowledged, acknowledged_by=current_user.id
    )
