"""SentinelX AI — Criminal, CriminalNetwork, membership & edge models."""
import enum
import uuid
from datetime import date as date_type
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, CheckConstraint, Date, Enum, ForeignKey, Numeric, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.models.base import Base, CreatedAtMixin, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from database.models.fir import FIR
    from database.models.people import Suspect


class NetworkRelationType(str, enum.Enum):
    CO_ACCUSED = "co_accused"
    SHARED_ADDRESS = "shared_address"
    SHARED_VEHICLE = "shared_vehicle"
    FAMILY = "family"
    ASSOCIATE = "associate"
    FINANCIAL = "financial"


class Criminal(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "criminals"

    name_hash: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    display_label: Mapped[str] = mapped_column(String(100), nullable=False)
    age_bucket: Mapped[str | None] = mapped_column(String(20), nullable=True)
    gender: Mapped[str | None] = mapped_column(String(20), nullable=True)
    first_case_date: Mapped[date_type | None] = mapped_column(Date, nullable=True)
    total_case_count: Mapped[int] = mapped_column(default=0)
    current_status: Mapped[str] = mapped_column(String(30), default="at_large")
    risk_score: Mapped[float | None] = mapped_column(Numeric(5, 2), nullable=True)

    suspect_records: Mapped[list["Suspect"]] = relationship(back_populates="criminal")
    network_memberships: Mapped[list["CriminalNetworkMember"]] = relationship(back_populates="criminal")


class CriminalNetwork(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "criminal_networks"

    name: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    members: Mapped[list["CriminalNetworkMember"]] = relationship(back_populates="network")


class CriminalNetworkMember(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "criminal_network_members"
    __table_args__ = (UniqueConstraint("network_id", "criminal_id", name="uq_network_criminal"),)

    network_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("criminal_networks.id", ondelete="CASCADE"), nullable=False)
    criminal_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("criminals.id", ondelete="CASCADE"), nullable=False)
    role_in_network: Mapped[str] = mapped_column(String(50), default="member")
    joined_at: Mapped[date_type | None] = mapped_column(Date, nullable=True)

    network: Mapped["CriminalNetwork"] = relationship(back_populates="members")
    criminal: Mapped["Criminal"] = relationship(back_populates="network_memberships")


class CriminalNetworkEdge(Base, UUIDPrimaryKeyMixin, CreatedAtMixin):
    __tablename__ = "criminal_network_edges"
    __table_args__ = (CheckConstraint("criminal_a_id <> criminal_b_id", name="chk_no_self_edge"),)

    criminal_a_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("criminals.id", ondelete="CASCADE"), nullable=False)
    criminal_b_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("criminals.id", ondelete="CASCADE"), nullable=False)
    relation_type: Mapped[NetworkRelationType] = mapped_column(Enum(NetworkRelationType, name="network_relation_type"), nullable=False)
    weight: Mapped[float] = mapped_column(Numeric(5, 2), default=1.0)
    source_fir_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("firs.id", ondelete="SET NULL"), nullable=True)
