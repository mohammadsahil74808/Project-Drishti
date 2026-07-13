"""SentinelX AI — Risk Scoring router."""

from fastapi import APIRouter

from app.core.deps import DbSession
from database.models.analytics import RiskScore, RiskEntityType
from app.schemas.risk import RiskScoreResponse
from app.services import risk_service

router = APIRouter(prefix="/risk", tags=["risk"])


@router.get("/zone/{zone_id}", response_model=RiskScoreResponse)
def zone_risk(db: DbSession, zone_id: str):
    return risk_service.get_risk_score(db, RiskEntityType.ZONE, zone_id)


@router.get("/person/{suspect_id}", response_model=RiskScoreResponse)
def person_risk(db: DbSession, suspect_id: str):
    return risk_service.get_risk_score(db, RiskEntityType.PERSON, suspect_id)
