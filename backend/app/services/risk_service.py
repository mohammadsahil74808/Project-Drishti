"""
SentinelX AI — Risk Scoring Service
"""
import uuid
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from database.models.analytics import RiskScore, RiskEntityType
from app.schemas.risk import RiskScoreResponse, ShapContribution


def _severity_for(score: float) -> str:
    if score >= 75:
        return "critical"
    if score >= 50:
        return "high"
    if score >= 30:
        return "medium"
    return "low"


def get_risk_score(db: Session, entity_type: RiskEntityType, entity_id: str) -> RiskScoreResponse:
    row = db.scalar(
        select(RiskScore)
        .where(RiskScore.entity_type == entity_type, RiskScore.entity_id == entity_id)
        .order_by(RiskScore.created_at.desc())
    )

    if row is None:
        return _rule_based_fallback(entity_type, entity_id)

    return RiskScoreResponse(
        entity_type=row.entity_type,
        entity_id=row.entity_id,
        entity_label=row.entity_label,
        score=row.score,
        severity=_severity_for(row.score),
        shap_explanation=[ShapContribution(**c) for c in row.shap_explanation],
    )


def _rule_based_fallback(entity_type: RiskEntityType, entity_id: str) -> RiskScoreResponse:
    score = 42.0
    return RiskScoreResponse(
        entity_type=entity_type,
        entity_id=entity_id,
        entity_label=f"{entity_type.value.title()} {entity_id}",
        score=score,
        severity=_severity_for(score),
        shap_explanation=[
            ShapContribution(feature="historical_case_density", contribution=0.6, value="baseline"),
            ShapContribution(feature="model_not_yet_trained", contribution=0.0, value="fallback"),
        ],
    )