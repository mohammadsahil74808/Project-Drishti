"""SentinelX AI — FIR model."""
import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from geoalchemy2 import Geography
from sqlalchemy import ARRAY, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from database.models.crime import CrimeType
    from database.models.geo import District, PoliceStation
    from database.models.people import Suspect, Victim, Witness
    from database.models.user import User


class CaseStatus(str, enum.Enum):
    OPEN = "open"
    INVESTIGATION = "investigation"
    CHARGESHEET = "chargesheet"
    CLOSED = "closed"


class FIR(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "firs"

    fir_no: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    station_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("police_stations.id", ondelete="RESTRICT"), nullable=False)
    district_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("districts.id", ondelete="RESTRICT"), nullable=False)
    crime_type_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("crime_types.id", ondelete="RESTRICT"), nullable=False)
    ipc_sections: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    incident_datetime: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    reported_datetime: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    location: Mapped[str] = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=False)
    address_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    mo_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[CaseStatus] = mapped_column(Enum(CaseStatus, name="case_status"), default=CaseStatus.OPEN, nullable=False, index=True)
    victim_age_bucket: Mapped[str | None] = mapped_column(String(20), nullable=True)
    accused_count: Mapped[int] = mapped_column(Integer, default=0)
    weapon_used: Mapped[str | None] = mapped_column(String(100), nullable=True)
    investigating_officer_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    station: Mapped["PoliceStation"] = relationship()
    district: Mapped["District"] = relationship()
    crime_type: Mapped["CrimeType"] = relationship()
    investigating_officer: Mapped["User | None"] = relationship()
    suspects: Mapped[list["Suspect"]] = relationship(back_populates="fir")
    victims: Mapped[list["Victim"]] = relationship(back_populates="fir")
    witnesses: Mapped[list["Witness"]] = relationship(back_populates="fir")

    def __repr__(self) -> str:
        return f"<FIR {self.fir_no}>"
