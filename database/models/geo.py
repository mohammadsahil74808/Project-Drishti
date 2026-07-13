"""SentinelX AI — District & PoliceStation models."""
import uuid
from typing import TYPE_CHECKING

from geoalchemy2 import Geography
from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from database.models.user import User


class District(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "districts"

    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    state: Mapped[str] = mapped_column(String(80), default="Karnataka")
    boundary: Mapped[str | None] = mapped_column(Geography(geometry_type="POLYGON", srid=4326), nullable=True)
    population: Mapped[int | None] = mapped_column(Integer, nullable=True)

    stations: Mapped[list["PoliceStation"]] = relationship(back_populates="district")


class PoliceStation(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "police_stations"

    name: Mapped[str] = mapped_column(String(150), nullable=False)
    code: Mapped[str | None] = mapped_column(String(30), unique=True, nullable=True)
    district_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("districts.id", ondelete="RESTRICT"), nullable=False)
    location: Mapped[str] = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=False)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    jurisdiction_area: Mapped[str | None] = mapped_column(Geography(geometry_type="POLYGON", srid=4326), nullable=True)

    district: Mapped["District"] = relationship(back_populates="stations")
    users: Mapped[list["User"]] = relationship(back_populates="station")
