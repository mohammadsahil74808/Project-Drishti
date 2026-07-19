import uuid
import enum
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, UUIDPrimaryKeyMixin, TimestampMixin


class UserRole(str, enum.Enum):
    constable = "constable"
    sho = "sho"
    sp = "sp"
    commissioner = "commissioner"
    analyst = "analyst"
    admin = "admin"


class User(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "users"
    
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    badge_no: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, index=True)
    role: Mapped[UserRole] = mapped_column(ENUM(UserRole, name="user_role", create_type=False), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="true")
    station_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("stations.id", ondelete="SET NULL"), nullable=True)
