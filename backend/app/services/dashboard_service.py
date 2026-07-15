"""
SentinelX AI — Dashboard Summary Service
"""
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.schemas.crime_type import CrimeType
from app.models.fir import CaseStatus, FIR
from app.models.geo import District
from app.models.analytics import CrimeHotspot as Hotspot, HotspotSeverity
from app.models.missing_person import MissingPerson, MissingPersonStatus
from app.models.analytics import RiskScore, RiskEntityType
from app.schemas.dashboard import DashboardSummaryResponse, DistrictRiskRow, StatTile


def get_dashboard_summary(db: Session) -> DashboardSummaryResponse:
    from datetime import datetime, date
    from app.models.alert import Alert
    from app.models.people import Suspect
    
    total_firs = db.scalar(select(func.count(FIR.id))) or 0
    today_firs = db.scalar(select(func.count(FIR.id)).where(func.date(FIR.reported_datetime) == date.today())) or 0
    active_alerts = db.scalar(select(func.count(Alert.id))) or 0
    
    open_missing = (
        db.scalar(
            select(func.count(MissingPerson.id)).where(
                MissingPerson.status != MissingPersonStatus.closed
            )
        )
        or 0
    )
    
    active_investigations = db.scalar(
        select(func.count(FIR.id)).where(FIR.status == CaseStatus.open)
    ) or 0
    
    wanted_criminals = db.scalar(
        select(func.count(Suspect.id))
    ) or 0 # Using total suspects as a proxy for wanted criminals in demo

    stmt = (
        select(RiskScore)
        .where(RiskScore.entity_type == RiskEntityType.zone)
        .distinct(RiskScore.entity_id)
        .order_by(RiskScore.entity_id, RiskScore.created_at.desc())
    )
    risk_scores = db.scalars(stmt).all()
    score_map = {rs.entity_id: rs.score for rs in risk_scores}
    
    high_risk_districts = sum(1 for score in score_map.values() if score >= 50)
    avg_ai_risk = sum(score_map.values()) / len(score_map) if score_map else 0.0

    stats = [
        StatTile(label="Total FIRs", value=str(total_firs), delta="+12%", trend="up"),
        StatTile(label="Today's FIRs", value=str(today_firs), delta="+5%", trend="up"),
        StatTile(label="Active Alerts", value=str(active_alerts), delta="-2", trend="down"),
        StatTile(label="High Risk Districts", value=str(high_risk_districts), delta="0", trend="up"),
        StatTile(label="Missing Persons", value=str(open_missing), delta="-1%", trend="down"),
        StatTile(label="Wanted Criminals", value=str(wanted_criminals), delta="+3", trend="up"),
        StatTile(label="Active Investigations", value=str(active_investigations), delta="+8%", trend="up"),
        StatTile(label="AI Risk Score", value=f"{avg_ai_risk:.1f}", delta="-0.5", trend="down"),
    ]

    districts = list(db.scalars(select(District)))
    district_rows = []
    for d in districts:
        score = score_map.get(str(d.id), 0.0)
        severity = "critical" if score >= 75 else "high" if score >= 50 else "medium" if score >= 30 else "low"
        district_rows.append(
            DistrictRiskRow(district_id=str(d.id), district_name=d.name, score=int(score), severity=severity)
        )

    district_rows.sort(key=lambda r: r.score, reverse=True)

    return DashboardSummaryResponse(stats=stats, district_risk=district_rows)