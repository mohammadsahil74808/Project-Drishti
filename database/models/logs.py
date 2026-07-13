"""SentinelX AI — AuditLog, ActivityLog models."""
import uuid
from typing import TYPE_CHECKING

from sqlalchemy import JSON, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.models.base import Base, CreatedAtMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from database.models.user import User


class AuditLog(Base, UUIDPrimaryKeyMixin, CreatedAtMixin):
    """Append-only sensitive-action trail. Never UPDATE/DELETE rows here — see docs/BACKUP_STRATEGY.md."""
    __tablename__ = "audit_logs"

    user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    resource: Mapped[str] = mapped_column(String(150), nullable=False)
    ip_address: Mapped[str | None] = mapped_column(String(64), nullable=True)
    metadata_: Mapped[dict] = mapped_column("metadata", JSON, default=dict)

    user: Mapped["User | None"] = relationship()


class ActivityLog(Base, UUIDPrimaryKeyMixin, CreatedAtMixin):
    """Broader UX telemetry (searches, dashboard views, exports) — not audit-grade, used for analytics."""
    __tablename__ = "activity_logs"

    user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    activity_type: Mapped[str] = mapped_column(String(80), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    metadata_: Mapped[dict] = mapped_column("metadata", JSON, default=dict)

    user: Mapped["User | None"] = relationship()
