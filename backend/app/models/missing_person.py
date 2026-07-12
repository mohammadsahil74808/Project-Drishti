"""
SentinelX AI — Missing Persons

Tracks missing-person cases through a status pipeline. `matched_fir_id`
is populated by the AI matching service when an unidentified-person report
is linked with high confidence.
"""

import enum
import uuid

from geoalchemy2 import Geography
from sqlalchemy import Date, Enum, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class MissingPersonStatus(str, enum.Enum):
    REPORTED = "reported"
    ACTIVE_SEARCH = "active_search"
    MATCHED = "matched"
    CLOSED = "closed"


class MissingPerson(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "missing_persons"

    name_hash: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    last_seen_location: Mapped[str] = mapped_column(
        Geography(geometry_type="POINT", srid=4326), nullable=False
    )
    last_seen_address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    last_seen_date: Mapped["Date"] = mapped_column(Date, nullable=False)
    status: Mapped[MissingPersonStatus] = mapped_column(
        Enum(MissingPersonStatus, name="missing_person_status"),
        default=MissingPersonStatus.REPORTED,
        nullable=False,
    )
    matched_fir_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("fir_records.id", ondelete="SET NULL"),
        nullable=True,
    )
