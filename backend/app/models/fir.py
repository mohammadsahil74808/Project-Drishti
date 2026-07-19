import uuid
import enum
from datetime import datetime
from typing import Any
from sqlalchemy import String, Text, Integer, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID, ENUM, ARRAY, JSON
from geoalchemy2 import Geography
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, UUIDPrimaryKeyMixin, TimestampMixin


class CrimeType(str, enum.Enum):
    theft = "theft"
    chain_snatching = "chain_snatching"
    burglary = "burglary"
    assault = "assault"
    vehicle_theft = "vehicle_theft"
    cybercrime = "cybercrime"
    missing_person = "missing_person"
    robbery = "robbery"
    other = "other"


class CaseStatus(str, enum.Enum):
    open = "open"
    investigation = "investigation"
    chargesheet = "chargesheet"
    closed = "closed"


class FIR(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "fir_records"
    
    fir_no: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, index=True)
    station_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("stations.id", ondelete="RESTRICT"), nullable=False)
    district_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("districts.id", ondelete="RESTRICT"), nullable=False)
    crime_type: Mapped[CrimeType] = mapped_column(ENUM(CrimeType, name="crime_type", create_type=False), nullable=False, index=True)
    ipc_sections: Mapped[list[str]] = mapped_column(ARRAY(String(20)), server_default="{}")
    incident_datetime: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    reported_datetime: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    location: Mapped[str] = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=False)
    address_text: Mapped[str] = mapped_column(Text, nullable=True)
    mo_description: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[CaseStatus] = mapped_column(ENUM(CaseStatus, name="case_status", create_type=False), nullable=False, server_default="open", index=True)
    victim_age_bucket: Mapped[str] = mapped_column(String(20), nullable=True)
    accused_count: Mapped[int] = mapped_column(Integer, server_default="0")
    weapon_used: Mapped[str] = mapped_column(String(100), nullable=True)
    embedding: Mapped[Any] = mapped_column(JSON, nullable=True)
