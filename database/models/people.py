"""SentinelX AI — Victim, Witness, Suspect models (per-FIR people records)."""
import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, SmallInteger, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.models.base import Base, CreatedAtMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from database.models.criminal import Criminal
    from database.models.fir import FIR


class Victim(Base, UUIDPrimaryKeyMixin, CreatedAtMixin):
    __tablename__ = "victims"

    fir_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("firs.id", ondelete="CASCADE"), nullable=False)
    name_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    display_label: Mapped[str] = mapped_column(String(100), nullable=False)
    age: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    gender: Mapped[str | None] = mapped_column(String(20), nullable=True)
    contact_hash: Mapped[str | None] = mapped_column(String(128), nullable=True)
    injury_severity: Mapped[str | None] = mapped_column(String(30), nullable=True)

    fir: Mapped["FIR"] = relationship(back_populates="victims")


class Witness(Base, UUIDPrimaryKeyMixin, CreatedAtMixin):
    __tablename__ = "witnesses"

    fir_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("firs.id", ondelete="CASCADE"), nullable=False)
    name_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    display_label: Mapped[str] = mapped_column(String(100), nullable=False)
    contact_hash: Mapped[str | None] = mapped_column(String(128), nullable=True)
    statement: Mapped[str | None] = mapped_column(Text, nullable=True)
    reliability_score: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)

    fir: Mapped["FIR"] = relationship(back_populates="witnesses")


class Suspect(Base, UUIDPrimaryKeyMixin, CreatedAtMixin):
    __tablename__ = "suspects"

    fir_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("firs.id", ondelete="CASCADE"), nullable=False)
    criminal_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("criminals.id", ondelete="SET NULL"), nullable=True)
    name_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    display_label: Mapped[str] = mapped_column(String(100), nullable=False)
    age_bucket: Mapped[str | None] = mapped_column(String(20), nullable=True)
    gender: Mapped[str | None] = mapped_column(String(20), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    fir: Mapped["FIR"] = relationship(back_populates="suspects")
    criminal: Mapped["Criminal | None"] = relationship(back_populates="suspect_records")
