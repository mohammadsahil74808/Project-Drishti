"""SentinelX AI — Alert model."""
import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from geoalchemy2 import Geography
from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.models.analytics import HotspotSeverity
from database.models.base import Base, CreatedAtMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from database.models.geo import PoliceStation
    from database.models.role import Role
    from database.models.user import User


class AlertType(str, enum.Enum):
    ANOMALY = "anomaly"
    FORECAST_SPIKE = "forecast_spike"
    NEW_HOTSPOT = "new_hotspot"
    MISSING_PERSON_MATCH = "missing_person_match"
    NETWORK_ALERT = "network_alert"


class Alert(Base, UUIDPrimaryKeyMixin, CreatedAtMixin):
    __tablename__ = "alerts"

    type: Mapped[AlertType] = mapped_column(Enum(AlertType, name="alert_type"), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[HotspotSeverity] = mapped_column(Enum(HotspotSeverity, name="hotspot_severity"), nullable=False)
    target_role_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("roles.id", ondelete="SET NULL"), nullable=True)
    station_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("police_stations.id", ondelete="SET NULL"), nullable=True)
    location: Mapped[str | None] = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=True)
    acknowledged: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    acknowledged_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    acknowledged_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    target_role: Mapped["Role | None"] = relationship()
    station: Mapped["PoliceStation | None"] = relationship()
    acknowledger: Mapped["User | None"] = relationship(foreign_keys=[acknowledged_by])
