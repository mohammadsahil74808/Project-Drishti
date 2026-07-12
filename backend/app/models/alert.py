"""
SentinelX AI — Alerts

Rule-engine output (Celery beat job) — anomalies, forecast spikes, new
hotspots, missing-person matches — targeted at a role and/or station,
pushed to clients over WebSocket and listed via the Alerts API.
"""

import enum
import uuid

from geoalchemy2 import Geography
from sqlalchemy import Boolean, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.hotspot import HotspotSeverity


class AlertType(str, enum.Enum):
    ANOMALY = "anomaly"
    FORECAST_SPIKE = "forecast_spike"
    NEW_HOTSPOT = "new_hotspot"
    MISSING_PERSON_MATCH = "missing_person_match"


class Alert(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "alerts"

    type: Mapped[AlertType] = mapped_column(
        Enum(AlertType, name="alert_type"), nullable=False
    )
    message: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[HotspotSeverity] = mapped_column(
        Enum(HotspotSeverity, name="hotspot_severity"), nullable=False
    )
    target_role: Mapped[str | None] = mapped_column(String(30), nullable=True)
    station_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("stations.id", ondelete="SET NULL"),
        nullable=True,
    )
    location: Mapped[str | None] = mapped_column(
        Geography(geometry_type="POINT", srid=4326), nullable=True
    )
    acknowledged: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    acknowledged_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
