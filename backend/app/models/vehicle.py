"""
SentinelX AI — Vehicle Crime Records

Theft/recovery tracking per vehicle, linked to the originating FIR.
"""

import enum
import uuid

from geoalchemy2 import Geography
from sqlalchemy import Date, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class VehicleCrimeStatus(str, enum.Enum):
    STOLEN = "stolen"
    RECOVERED = "recovered"
    UNDER_INVESTIGATION = "under_investigation"


class VehicleCrimeRecord(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "vehicles"

    fir_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("fir_records.id", ondelete="CASCADE"),
        nullable=False,
    )
    vehicle_type: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # two_wheeler | four_wheeler | commercial
    reg_pattern_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    theft_location: Mapped[str] = mapped_column(
        Geography(geometry_type="POINT", srid=4326), nullable=False
    )
    recovery_location: Mapped[str | None] = mapped_column(
        Geography(geometry_type="POINT", srid=4326), nullable=True
    )
    status: Mapped[VehicleCrimeStatus] = mapped_column(
        Enum(VehicleCrimeStatus, name="vehicle_crime_status"),
        default=VehicleCrimeStatus.STOLEN,
        nullable=False,
    )
    theft_date: Mapped["Date"] = mapped_column(Date, nullable=False)
