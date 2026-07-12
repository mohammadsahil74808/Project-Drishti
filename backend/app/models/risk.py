"""
SentinelX AI — Risk Scores

Explainable risk scores for zones or persons, produced by the XGBoost +
SHAP pipeline (app/ai/risk_scoring/). `shap_explanation` stores the top
feature contributions as JSON so the API can return them without
recomputing SHAP values per request.
"""

import enum

from sqlalchemy import JSON, Enum, Float, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class RiskEntityType(str, enum.Enum):
    ZONE = "zone"
    PERSON = "person"


class RiskScore(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "risk_scores"

    entity_type: Mapped[RiskEntityType] = mapped_column(
        Enum(RiskEntityType, name="risk_entity_type"), nullable=False
    )
    entity_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    entity_label: Mapped[str] = mapped_column(String(150), nullable=False)
    score: Mapped[float] = mapped_column(Float, nullable=False)  # 0-100
    shap_explanation: Mapped[list[dict]] = mapped_column(JSON, default=list)
