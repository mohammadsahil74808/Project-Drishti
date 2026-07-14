import uuid
from sqlalchemy import String, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, UUIDPrimaryKeyMixin, TimestampMixin


class CriminalNetworkEdge(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "criminal_network_edges"
    
    suspect_a_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("suspects.id", ondelete="CASCADE"), nullable=False)
    suspect_b_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("suspects.id", ondelete="CASCADE"), nullable=False)
    relation_type: Mapped[str] = mapped_column(String(50), nullable=False)
    weight: Mapped[float] = mapped_column(Float, server_default="1.0")
    source_fir_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("fir_records.id", ondelete="SET NULL"), nullable=True)
