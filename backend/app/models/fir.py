"""
SentinelX AI — FIR (First Information Report) Model

The core crime record table. `embedding` stores a Sentence-Transformer
vector (as JSON-serialized floats for portability without a pgvector
extension requirement) used by the semantic search service; swap to
`pgvector`'s Vector type directly if the extension is enabled.
"""

import enum
import uuid
from typing import TYPE_CHECKING

from geoalchemy2 import Geography
from sqlalchemy import ARRAY, Enum, ForeignKey, Integer, String, Text, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.geo import District, Station
    from app.models.suspect import Suspect


class CrimeType(str, enum.Enum):
    THEFT = "theft"
    CHAIN_SNATCHING = "chain_snatching"
    BURGLARY = "burglary"
    ASSAULT = "assault"
    VEHICLE_THEFT = "vehicle_theft"
    CYBERCRIME = "cybercrime"
    MISSING_PERSON = "missing_person"
    ROBBERY = "robbery"
    OTHER = "other"


class CaseStatus(str, enum.Enum):
    OPEN = "open"
    INVESTIGATION = "investigation"
    CHARGESHEET = "chargesheet"
    CLOSED = "closed"


class FIRRecord(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "fir_records"

    fir_no: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False, index=True
    )
    station_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("stations.id", ondelete="RESTRICT"),
        nullable=False,
    )
    district_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("districts.id", ondelete="RESTRICT"),
        nullable=False,
    )

    crime_type: Mapped[CrimeType] = mapped_column(
        Enum(CrimeType, name="crime_type"), nullable=False, index=True
    )
    ipc_sections: Mapped[list[str]] = mapped_column(ARRAY(String(20)), default=list)

    incident_datetime: Mapped["DateTime"] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    reported_datetime: Mapped["DateTime"] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    location: Mapped[str] = mapped_column(
        Geography(geometry_type="POINT", srid=4326), nullable=False
    )
    address_text: Mapped[str] = mapped_column(Text, nullable=True)

    mo_description: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[CaseStatus] = mapped_column(
        Enum(CaseStatus, name="case_status"),
        default=CaseStatus.OPEN,
        nullable=False,
        index=True,
    )

    victim_age_bucket: Mapped[str | None] = mapped_column(String(20), nullable=True)
    accused_count: Mapped[int] = mapped_column(Integer, default=0)
    weapon_used: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # Sentence-Transformer embedding for semantic search (list[float], 384-dim for MiniLM)
    embedding: Mapped[list[float] | None] = mapped_column(JSON, nullable=True)

    station: Mapped["Station"] = relationship()
    district: Mapped["District"] = relationship()
    suspects: Mapped[list["Suspect"]] = relationship(back_populates="fir")

    def __repr__(self) -> str:
        return f"<FIRRecord {self.fir_no} ({self.crime_type})>"
