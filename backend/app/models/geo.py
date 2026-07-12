"""
SentinelX AI — Organizational / Geographic Hierarchy

Districts and Stations. District boundaries are stored as PostGIS polygons
for spatial aggregation (heatmap binning, district-level rollups).
"""

import uuid
from typing import TYPE_CHECKING

from geoalchemy2 import Geography
from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.user import User


class District(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "districts"

    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    boundary: Mapped[str | None] = mapped_column(
        Geography(geometry_type="POLYGON", srid=4326), nullable=True
    )

    stations: Mapped[list["Station"]] = relationship(back_populates="district")


class Station(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "stations"

    name: Mapped[str] = mapped_column(String(150), nullable=False)
    district_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("districts.id", ondelete="CASCADE"),
        nullable=False,
    )
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lng: Mapped[float] = mapped_column(Float, nullable=False)

    district: Mapped["District"] = relationship(back_populates="stations")
    users: Mapped[list["User"]] = relationship(back_populates="station")
