"""SentinelX AI — Alert schemas."""
import uuid
from datetime import datetime

from pydantic import BaseModel

from database.models.alert import AlertType
from database.models.analytics import CrimeHotspot as Hotspot, HotspotSeverity
from app.schemas.common import ORMBase


class AlertResponse(ORMBase):
    id: uuid.UUID
    type: AlertType
    message: str
    severity: HotspotSeverity
    target_role: str | None
    station_id: uuid.UUID | None
    acknowledged: bool
    created_at: datetime


class AlertAcknowledgeResponse(BaseModel):
    id: uuid.UUID
    acknowledged: bool
    acknowledged_by: uuid.UUID