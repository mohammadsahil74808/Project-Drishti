"""SentinelX AI — Report model."""
import enum
import uuid
from datetime import date as date_type, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.models.base import Base, CreatedAtMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from database.models.fir import FIR
    from database.models.geo import District
    from database.models.user import User


class ReportType(str, enum.Enum):
    WEEKLY = "weekly"
    HOTSPOT = "hotspot"
    CASE = "case"
    NETWORK = "network"
    CUSTOM = "custom"


class ReportStatus(str, enum.Enum):
    PENDING = "pending"
    GENERATING = "generating"
    READY = "ready"
    FAILED = "failed"


class Report(Base, UUIDPrimaryKeyMixin, CreatedAtMixin):
    __tablename__ = "reports"

    type: Mapped[ReportType] = mapped_column(Enum(ReportType, name="report_type"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    status: Mapped[ReportStatus] = mapped_column(Enum(ReportStatus, name="report_status"), default=ReportStatus.PENDING, nullable=False)
    requested_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    district_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("districts.id", ondelete="SET NULL"), nullable=True)
    fir_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("firs.id", ondelete="SET NULL"), nullable=True)
    file_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    date_from: Mapped[date_type | None] = mapped_column(Date, nullable=True)
    date_to: Mapped[date_type | None] = mapped_column(Date, nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    requester: Mapped["User | None"] = relationship()
    district: Mapped["District | None"] = relationship()
    fir: Mapped["FIR | None"] = relationship()
