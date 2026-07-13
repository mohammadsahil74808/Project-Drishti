"""SentinelX AI — Risk scoring / explainability schemas."""
from pydantic import BaseModel

from database.models.analytics import RiskScore, RiskEntityType


class ShapContribution(BaseModel):
    feature: str
    contribution: float
    value: str | float


class RiskScoreResponse(BaseModel):
    entity_type: RiskEntityType
    entity_id: str
    entity_label: str
    score: float
    severity: str
    shap_explanation: list[ShapContribution]