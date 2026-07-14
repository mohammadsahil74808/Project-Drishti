import uuid
from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, UUIDPrimaryKeyMixin, TimestampMixin


class Suspect(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "suspects"
    
    fir_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("fir_records.id", ondelete="CASCADE"), nullable=False)
    name_hash: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    display_label: Mapped[str] = mapped_column(String(100), nullable=False)
    age_bucket: Mapped[str] = mapped_column(String(20), nullable=True)
    gender: Mapped[str] = mapped_column(String(20), nullable=True)
    prior_case_ids: Mapped[list[str]] = mapped_column(ARRAY(String(50)), server_default="{}")
