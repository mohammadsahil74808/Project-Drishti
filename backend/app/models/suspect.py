"""
SentinelX AI — Suspects & Criminal Network Edges

`Suspect` rows are linked to the FIR they were named in. `CriminalNetworkEdge`
captures a relationship between two suspects (co-accused, shared address,
shared vehicle, etc.), which the network analysis service turns into a graph.
"""

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ARRAY, Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.fir import FIRRecord


class Suspect(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "suspects"

    fir_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("fir_records.id", ondelete="CASCADE"),
        nullable=False,
    )
    name_hash: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    display_label: Mapped[str] = mapped_column(
        String(100), nullable=False
    )  # e.g. "Suspect A-104"
    age_bucket: Mapped[str | None] = mapped_column(String(20), nullable=True)
    gender: Mapped[str | None] = mapped_column(String(20), nullable=True)
    prior_case_ids: Mapped[list[str]] = mapped_column(ARRAY(String(50)), default=list)

    fir: Mapped["FIRRecord"] = relationship(back_populates="suspects")


class CriminalNetworkEdge(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "criminal_network_edges"

    suspect_a_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("suspects.id", ondelete="CASCADE"),
        nullable=False,
    )
    suspect_b_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("suspects.id", ondelete="CASCADE"),
        nullable=False,
    )
    relation_type: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # co_accused | shared_address | shared_vehicle
    weight: Mapped[float] = mapped_column(Float, default=1.0)
    source_fir_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("fir_records.id", ondelete="SET NULL"),
        nullable=True,
    )
