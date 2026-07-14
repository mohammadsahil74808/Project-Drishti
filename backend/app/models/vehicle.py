import uuid
import enum
from datetime import date
from sqlalchemy import String, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ENUM
from geoalchemy2 import Geography
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, UUIDPrimaryKeyMixin, TimestampMixin


class VehicleCrimeStatus(str, enum.Enum):
    stolen = "stolen"
    recovered = "recovered"
    under_investigation = "under_investigation"


class Vehicle(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "vehicles"
    
    fir_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("fir_records.id", ondelete="CASCADE"), nullable=False)
    vehicle_type: Mapped[str] = mapped_column(String(50), nullable=False)
    reg_pattern_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    theft_location: Mapped[str] = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=False)
    recovery_location: Mapped[str] = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=True)
    status: Mapped[VehicleCrimeStatus] = mapped_column(ENUM(VehicleCrimeStatus, name="vehicle_crime_status", create_type=True), nullable=False, server_default="stolen")
    theft_date: Mapped[date] = mapped_column(Date, nullable=False)
