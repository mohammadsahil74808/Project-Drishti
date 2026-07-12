"""
SentinelX AI — User Model

Officers/analysts who access the platform. `role` drives RBAC checks in
app/core/deps.py — see docs/NAMING_CONVENTIONS.md for the role list.
"""

import enum
import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.geo import Station


class UserRole(str, enum.Enum):
    CONSTABLE = "constable"
    SHO = "sho"
    SP = "sp"
    COMMISSIONER = "commissioner"
    ANALYST = "analyst"
    ADMIN = "admin"


class User(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "users"

    name: Mapped[str] = mapped_column(String(150), nullable=False)
    badge_no: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False, index=True
    )
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role"), nullable=False
    )
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    station_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("stations.id", ondelete="SET NULL"),
        nullable=True,
    )
    station: Mapped["Station | None"] = relationship(back_populates="users")

    def __repr__(self) -> str:
        return f"<User {self.badge_no} ({self.role})>"
