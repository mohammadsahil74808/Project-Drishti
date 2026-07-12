"""
SentinelX AI — Audit Log

Every sensitive action (login, FIR create/update, report generation, alert
acknowledgment) is recorded here. Required for a police-grade system —
never delete rows from this table; it's append-only by convention.
"""

import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class AuditLog(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "audit_log"

    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    action: Mapped[str] = mapped_column(
        String(100), nullable=False
    )  # e.g. "fir.create"
    resource: Mapped[str] = mapped_column(
        String(150), nullable=False
    )  # e.g. "fir_records:<id>"
    ip_address: Mapped[str | None] = mapped_column(String(64), nullable=True)
