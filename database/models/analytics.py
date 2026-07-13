"""SentinelX AI — CrimeHotspot, CrimeForecast, RiskScore models."""
import enum
import uuid
from datetime import date as date_type, datetime
from typing import TYPE_CHECKING

from geoalchemy2 import Geography
from sqlalchemy import CheckConstraint, Date, DateTime, Enum, ForeignKey, Integer, JSON, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.models.base import Base, CreatedAtMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from database.models.crime import CrimeType
    from database.models.geo import District


class HotspotSeverity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class RiskEntityType(str, enum.Enum):
    ZONE = "zone"
    PERSON = "person"
    VEHICLE = "vehicle"


class CrimeHotspot(Base, UUIDPrimaryKeyMixin, CreatedAtMixin):
    __tablename__ = "crime_hotspots"

    district_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("districts.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str | None] = mapped_column(String(150), nullable=True)
    centroid: Mapped[str] = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=False)
    radius_m: Mapped[float] = mapped_column(Numeric(10, 2), default=250.0)
    crime_density: Mapped[int] = mapped_column(Integer, default=0)
    time_window: Mapped[str] = mapped_column(String(20), default="30d")
    severity: Mapped[HotspotSeverity] = mapped_column(Enum(HotspotSeverity, name="hotspot_severity"), nullable=False)
    computed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    district: Mapped["District"] = relationship()


class CrimeForecast(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "crime_forecasts"
    __table_args__ = (
        CheckConstraint("lower_bound <= predicted_count AND predicted_count <= upper_bound", name="chk_forecast_bounds"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    district_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("districts.id", ondelete="CASCADE"), nullable=False)
    crime_type_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("crime_types.id", ondelete="CASCADE"), nullable=False)
    forecast_date: Mapped[date_type] = mapped_column(Date, nullable=False)
    predicted_count: Mapped[float] = mapped_column(Numeric(8, 2), nullable=False)
    lower_bound: Mapped[float] = mapped_column(Numeric(8, 2), nullable=False)
    upper_bound: Mapped[float] = mapped_column(Numeric(8, 2), nullable=False)
    model_version: Mapped[str] = mapped_column(String(50), default="v1")
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    district: Mapped["District"] = relationship()
    crime_type: Mapped["CrimeType"] = relationship()


class RiskScore(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "risk_scores"
    __table_args__ = (CheckConstraint("score >= 0 AND score <= 100", name="chk_risk_score_range"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entity_type: Mapped[RiskEntityType] = mapped_column(Enum(RiskEntityType, name="risk_entity_type"), nullable=False)
    entity_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    entity_label: Mapped[str] = mapped_column(String(150), nullable=False)
    score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    shap_explanation: Mapped[list] = mapped_column(JSON, default=list)
    model_version: Mapped[str] = mapped_column(String(50), default="v1")
    computed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
