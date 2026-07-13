"""SentinelX AI — Evidence, Attachment models."""
import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, DateTime, Enum, ForeignKey, JSON, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.models.base import Base, CreatedAtMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from database.models.fir import FIR
    from database.models.user import User


class EvidenceType(str, enum.Enum):
    PHYSICAL = "physical"
    DIGITAL = "digital"
    DOCUMENT = "document"
    PHOTO = "photo"
    VIDEO = "video"
    AUDIO = "audio"
    TESTIMONY = "testimony"


class AttachmentOwnerType(str, enum.Enum):
    FIR = "fir"
    EVIDENCE = "evidence"
    REPORT = "report"
    MISSING_PERSON = "missing_person"


class Evidence(Base, UUIDPrimaryKeyMixin, CreatedAtMixin):
    __tablename__ = "evidence"

    fir_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("firs.id", ondelete="CASCADE"), nullable=False)
    evidence_type: Mapped[EvidenceType] = mapped_column(Enum(EvidenceType, name="evidence_type"), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    collected_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    collected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    storage_location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    chain_of_custody: Mapped[list] = mapped_column(JSON, default=list)

    fir: Mapped["FIR"] = relationship()
    collector: Mapped["User | None"] = relationship()


class Attachment(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "attachments"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_type: Mapped[AttachmentOwnerType] = mapped_column(Enum(AttachmentOwnerType, name="attachment_owner_type"), nullable=False)
    owner_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    file_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    file_size_bytes: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    uploaded_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    uploader: Mapped["User | None"] = relationship()
