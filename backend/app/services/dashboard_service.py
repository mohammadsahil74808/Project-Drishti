"""
SentinelX AI — Dashboard Summary Service
"""
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.fir import CaseStatus, FIRRecord
from app.models.geo import District
from app.models.hotspot import Hotspot
from app.models.missing_person import MissingPerson, MissingPersonStatus
from app.models.risk import RiskEntityType, RiskScore
from app.schemas.dashboard import DashboardSummaryResponse, DistrictRiskRow, StatTile


def get_dashboard_summary(db: Session) -> DashboardSummaryResponse:
    total_firs = db.scalar(select(func.count(FIRRecord.id))) or 0
    active_hotspots = db.scalar(select(func.count(Hotspot.id))) or 0
    open_missing = (
        db.scalar(
            select(func.count(MissingPerson.id)).where(
                MissingPerson.status != MissingPersonStatus.CLOSED
            )
        )
        or 0
    )

    stats = [
        StatTile(label="Total FIRs", value=str(total_firs), delta="", trend="up"),
        StatTile(label="Active Hotspots", value=str(active_hotspots), delta="", trend="up"),
        StatTile(label="Missing Persons (open)", value=str(open_missing), delta="", trend="down"),
    ]

    district_rows = []
    districts = list(db.scalars(select(District)))
    for d in districts:
        score_row = db.scalar(
            select(RiskScore)
            .where(RiskScore.entity_type == RiskEntityType.ZONE, RiskScore.entity_id == str(d.id))
            .order_by(RiskScore.created_at.desc())
        )
        score = score_row.score if score_row else 0.0
        severity = "critical" if score >= 75 else "high" if score >= 50 else "medium" if score >= 30 else "low"
        district_rows.append(
            DistrictRiskRow(district_id=str(d.id), district_name=d.name, score=int(score), severity=severity)
        )

    district_rows.sort(key=lambda r: r.score, reverse=True)

    return DashboardSummaryResponse(stats=stats, district_risk=district_rows)