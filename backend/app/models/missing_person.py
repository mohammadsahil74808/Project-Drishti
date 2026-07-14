import uuid
import enum
from datetime import date
from sqlalchemy import String, Integer, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ENUM
from geoalchemy2 import Geography
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, UUIDPrimaryKeyMixin, TimestampMixin


class MissingPersonStatus(str, enum.Enum):
    reported = "reported"
    active_search = "active_search"
    matched = "matched"
    closed = "closed"


class MissingPerson(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "missing_persons"
    
    name_hash: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    last_seen_location: Mapped[str] = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=False)
    last_seen_address: Mapped[str] = mapped_column(String(255), nullable=True)
    last_seen_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[MissingPersonStatus] = mapped_column(ENUM(MissingPersonStatus, name="missing_person_status", create_type=True), nullable=False, server_default="reported")
    matched_fir_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("fir_records.id", ondelete="SET NULL"), nullable=True)
