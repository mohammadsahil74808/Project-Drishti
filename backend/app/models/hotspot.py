"""
SentinelX AI — Hotspots

Output of the DBSCAN/HDBSCAN spatial clustering job (app/ai/geo/). Refreshed
periodically; the heatmap API reads directly from this table plus raw FIR
geopoints for the density layer.
"""

import enum
import uuid

from geoalchemy2 import Geography
from sqlalchemy import Enum, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class HotspotSeverity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Hotspot(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "hotspots"

    district_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("districts.id", ondelete="CASCADE"),
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(150), nullable=True)
    centroid: Mapped[str] = mapped_column(
        Geography(geometry_type="POINT", srid=4326), nullable=False
    )
    radius_m: Mapped[float] = mapped_column(Float, default=250.0)
    crime_density: Mapped[int] = mapped_column(Integer, default=0)
    time_window: Mapped[str] = mapped_column(String(20), default="30d")
    severity: Mapped[HotspotSeverity] = mapped_column(
        Enum(HotspotSeverity, name="hotspot_severity"), nullable=False
    )
