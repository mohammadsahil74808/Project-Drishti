"""SentinelX AI — CrimeCategory & CrimeType models."""
import uuid

from sqlalchemy import ARRAY, ForeignKey, SmallInteger, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.models.base import Base, CreatedAtMixin, UUIDPrimaryKeyMixin


class CrimeCategory(Base, UUIDPrimaryKeyMixin, CreatedAtMixin):
    __tablename__ = "crime_categories"

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    severity_weight: Mapped[int] = mapped_column(SmallInteger, default=1)

    crime_types: Mapped[list["CrimeType"]] = relationship(back_populates="category")


class CrimeType(Base, UUIDPrimaryKeyMixin, CreatedAtMixin):
    __tablename__ = "crime_types"

    category_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("crime_categories.id", ondelete="RESTRICT"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String(120), nullable=False)
    default_ipc_sections: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    category: Mapped["CrimeCategory"] = relationship(back_populates="crime_types")
