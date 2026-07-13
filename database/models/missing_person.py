"""SentinelX AI — MissingPerson model."""
import enum
import uuid
from datetime import date as date_type
from typing import TYPE_CHECKING

from geoalchemy2 import Geography
from sqlalchemy import Date, Enum, ForeignKey, SmallInteger, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from database.models.fir import FIR
    from database.models.user import User


class MissingPersonStatus(str, enum.Enum):
    REPORTED = "reported"
    ACTIVE_SEARCH = "active_search"
    MATCHED = "matched"
    CLOSED = "closed"


class MissingPerson(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "missing_persons"

    name_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    display_label: Mapped[str] = mapped_column(String(100), nullable=False)
    age: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    gender: Mapped[str | None] = mapped_column(String(20), nullable=True)
    last_seen_location: Mapped[str] = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=False)
    last_seen_address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    last_seen_date: Mapped[date_type] = mapped_column(Date, nullable=False)
    reported_by_user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    status: Mapped[MissingPersonStatus] = mapped_column(Enum(MissingPersonStatus, name="missing_person_status"), default=MissingPersonStatus.REPORTED, nullable=False)
    matched_fir_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("firs.id", ondelete="SET NULL"), nullable=True)

    reported_by: Mapped["User | None"] = relationship()
    matched_fir: Mapped["FIR | None"] = relationship()
