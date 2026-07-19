import uuid
import enum
from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, UUIDPrimaryKeyMixin, TimestampMixin


class ReportType(str, enum.Enum):
    weekly = "weekly"
    hotspot = "hotspot"
    case = "case"


class ReportStatus(str, enum.Enum):
    pending = "pending"
    generating = "generating"
    ready = "ready"
    failed = "failed"


class Report(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "reports"
    
    type: Mapped[ReportType] = mapped_column(ENUM(ReportType, name="report_type", create_type=False), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    status: Mapped[ReportStatus] = mapped_column(ENUM(ReportStatus, name="report_status", create_type=False), nullable=False, server_default="pending")
    requested_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    file_path: Mapped[str] = mapped_column(String(500), nullable=True)
    district_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("districts.id", ondelete="SET NULL"), nullable=True)
