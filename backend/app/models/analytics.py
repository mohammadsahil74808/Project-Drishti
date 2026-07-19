import uuid
import enum
from datetime import date
from typing import Any
from sqlalchemy import String, Float, Integer, Date, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID, ENUM
from geoalchemy2 import Geography
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, UUIDPrimaryKeyMixin, TimestampMixin
from app.models.fir import CrimeType


class CrimeForecast(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "crime_forecasts"
    
    district_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("districts.id", ondelete="CASCADE"), nullable=False)
    crime_type: Mapped[CrimeType] = mapped_column(ENUM(CrimeType, name="crime_type", create_type=False), nullable=False)
    forecast_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    predicted_count: Mapped[float] = mapped_column(Float, nullable=False)
    lower_bound: Mapped[float] = mapped_column(Float, nullable=False)
    upper_bound: Mapped[float] = mapped_column(Float, nullable=False)
    model_version: Mapped[str] = mapped_column(String(50), server_default="v1")


class RiskEntityType(str, enum.Enum):
    zone = "zone"
    person = "person"


class RiskScore(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "risk_scores"
    
    entity_type: Mapped[RiskEntityType] = mapped_column(ENUM(RiskEntityType, name="risk_entity_type", create_type=False), nullable=False)
    entity_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    entity_label: Mapped[str] = mapped_column(String(150), nullable=False)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    shap_explanation: Mapped[Any] = mapped_column(JSON, server_default="[]")


class HotspotSeverity(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class CrimeHotspot(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "hotspots"
    
    district_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("districts.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=True)
    centroid: Mapped[str] = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=False)
    radius_m: Mapped[float] = mapped_column(Float, server_default="250.0")
    crime_density: Mapped[int] = mapped_column(Integer, server_default="0")
    time_window: Mapped[str] = mapped_column(String(20), server_default="30d")
    severity: Mapped[HotspotSeverity] = mapped_column(ENUM(HotspotSeverity, name="hotspot_severity", create_type=False), nullable=False)
