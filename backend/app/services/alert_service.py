"""
SentinelX AI — Alert Service
"""
import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from database.models.alert import Alert


class AlertNotFoundError(Exception):
    pass


def list_alerts(db: Session, role: str | None, station_id: uuid.UUID | None) -> list[Alert]:
    stmt = select(Alert).order_by(Alert.created_at.desc())
    if role:
        stmt = stmt.where((Alert.target_role == role) | (Alert.target_role.is_(None)))
    if station_id:
        stmt = stmt.where((Alert.station_id == station_id) | (Alert.station_id.is_(None)))
    return list(db.scalars(stmt).unique())


def acknowledge_alert(db: Session, alert_id: uuid.UUID, acknowledged_by: uuid.UUID) -> Alert:
    alert = db.get(Alert, alert_id)
    if alert is None:
        raise AlertNotFoundError(f"Alert {alert_id} not found.")
    alert.acknowledged = True
    alert.acknowledged_by = acknowledged_by
    db.commit()
    db.refresh(alert)
    return alert