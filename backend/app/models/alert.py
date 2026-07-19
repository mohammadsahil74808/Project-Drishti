import uuid
import enum
from sqlalchemy import String, Text, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ENUM
from geoalchemy2 import Geography
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, UUIDPrimaryKeyMixin, TimestampMixin
from app.models.analytics import HotspotSeverity


class AlertType(str, enum.Enum):
    anomaly = "anomaly"
    forecast_spike = "forecast_spike"
    new_hotspot = "new_hotspot"
    missing_person_match = "missing_person_match"


class Alert(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "alerts"
    
    type: Mapped[AlertType] = mapped_column(ENUM(AlertType, name="alert_type", create_type=False), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[HotspotSeverity] = mapped_column(ENUM(HotspotSeverity, name="hotspot_severity", create_type=False), nullable=False)
    target_role: Mapped[str] = mapped_column(String(30), nullable=True)
    station_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("stations.id", ondelete="SET NULL"), nullable=True)
    location: Mapped[str] = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=True)
    acknowledged: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="false")
    acknowledged_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
