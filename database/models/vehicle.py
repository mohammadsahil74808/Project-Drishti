"""SentinelX AI — Vehicle model."""
import enum
import uuid
from datetime import date as date_type
from typing import TYPE_CHECKING

from geoalchemy2 import Geography
from sqlalchemy import CheckConstraint, Date, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.models.base import Base, CreatedAtMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from database.models.fir import FIR


class VehicleCrimeStatus(str, enum.Enum):
    STOLEN = "stolen"
    RECOVERED = "recovered"
    UNDER_INVESTIGATION = "under_investigation"


class Vehicle(Base, UUIDPrimaryKeyMixin, CreatedAtMixin):
    __tablename__ = "vehicles"
    __table_args__ = (
        CheckConstraint("recovery_date IS NULL OR recovery_date >= theft_date", name="chk_recovery_after_theft"),
    )

    fir_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("firs.id", ondelete="CASCADE"), nullable=False)
    vehicle_type: Mapped[str] = mapped_column(String(50), nullable=False)
    registration_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    make_model: Mapped[str | None] = mapped_column(String(100), nullable=True)
    color: Mapped[str | None] = mapped_column(String(40), nullable=True)
    theft_location: Mapped[str] = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=False)
    recovery_location: Mapped[str | None] = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=True)
    status: Mapped[VehicleCrimeStatus] = mapped_column(Enum(VehicleCrimeStatus, name="vehicle_crime_status"), default=VehicleCrimeStatus.STOLEN, nullable=False)
    theft_date: Mapped[date_type] = mapped_column(Date, nullable=False)
    recovery_date: Mapped[date_type | None] = mapped_column(Date, nullable=True)

    fir: Mapped["FIR"] = relationship()
