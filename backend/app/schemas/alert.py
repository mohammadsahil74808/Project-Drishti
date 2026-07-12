"""SentinelX AI — Alert schemas."""
import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.alert import AlertType
from app.models.hotspot import HotspotSeverity
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