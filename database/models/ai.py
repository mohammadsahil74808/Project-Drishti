"""SentinelX AI — AIPrediction, AIChatHistory, SemanticSearchEmbedding models."""
import enum
import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey, JSON, Numeric, SmallInteger, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.models.base import Base, CreatedAtMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from database.models.fir import FIR
    from database.models.user import User


class AIPredictionType(str, enum.Enum):
    CLASSIFICATION = "classification"
    RISK_SCORE = "risk_score"
    FORECAST = "forecast"
    HOTSPOT = "hotspot"
    NETWORK = "network"
    RECOMMENDATION = "recommendation"


class ChatRole(str, enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class AIPrediction(Base, UUIDPrimaryKeyMixin, CreatedAtMixin):
    __tablename__ = "ai_predictions"

    prediction_type: Mapped[AIPredictionType] = mapped_column(Enum(AIPredictionType, name="ai_prediction_type"), nullable=False)
    entity_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    entity_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    input_features: Mapped[dict] = mapped_column(JSON, default=dict)
    output: Mapped[dict] = mapped_column(JSON, default=dict)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    model_version: Mapped[str] = mapped_column(String(50), nullable=False)
    confidence: Mapped[float | None] = mapped_column(Numeric(5, 4), nullable=True)


class AIChatHistory(Base, UUIDPrimaryKeyMixin, CreatedAtMixin):
    __tablename__ = "ai_chat_history"

    session_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    role: Mapped[ChatRole] = mapped_column(Enum(ChatRole, name="chat_role"), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    chart_payload: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    user: Mapped["User | None"] = relationship()


class SemanticSearchEmbedding(Base, UUIDPrimaryKeyMixin, CreatedAtMixin):
    __tablename__ = "semantic_search_embeddings"
    __table_args__ = (UniqueConstraint("fir_id", "model_name", name="uq_fir_model_embedding"),)

    fir_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("firs.id", ondelete="CASCADE"), nullable=False)
    embedding: Mapped[list[float]] = mapped_column(JSON, nullable=False)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    dims: Mapped[int] = mapped_column(SmallInteger, default=384)

    fir: Mapped["FIR"] = relationship()
