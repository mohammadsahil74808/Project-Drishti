"""
SentinelX AI — Crime Analytics Service
"""
import uuid
from datetime import datetime

from sqlalchemy import cast, func, select
from sqlalchemy.orm import Session
from sqlalchemy.types import Date

from app.schemas.crime_type import CrimeType
from database.models.fir import FIR
from app.schemas.analytics import (
    AIInsight,
    CrimeTrendResponse,
    CrimeTypeDistributionItem,
    CrimeTypeDistributionResponse,
    DayOfWeekBucket,
    TrendPoint,
)


def get_crime_trend(
    db: Session,
    district_id: uuid.UUID | None,
    crime_type: CrimeType | None,
    date_from: datetime | None,
    date_to: datetime | None,
    granularity: str = "daily",
) -> CrimeTrendResponse:
    bucket = func.date_trunc(granularity.rstrip("ly") if granularity != "daily" else "day", FIR.incident_datetime)

    stmt = select(bucket.label("period"), func.count(FIR.id).label("count"))
    if district_id:
        stmt = stmt.where(FIR.district_id == district_id)
    if crime_type:
        stmt = stmt.where(FIR.crime_type == crime_type)
    if date_from:
        stmt = stmt.where(FIR.incident_datetime >= date_from)
    if date_to:
        stmt = stmt.where(FIR.incident_datetime <= date_to)

    stmt = stmt.group_by(bucket).order_by(bucket)
    rows = db.execute(stmt).all()

    points = [TrendPoint(period=str(r.period.date()), count=r.count) for r in rows]
    return CrimeTrendResponse(
        district_id=str(district_id) if district_id else None,
        crime_type=crime_type,
        granularity=granularity,
        points=points,
    )


def get_crime_type_distribution(
    db: Session, district_id: uuid.UUID | None, date_from: datetime | None, date_to: datetime | None
) -> CrimeTypeDistributionResponse:
    stmt = select(FIR.crime_type, func.count(FIR.id).label("count"))
    if district_id:
        stmt = stmt.where(FIR.district_id == district_id)
    if date_from:
        stmt = stmt.where(FIR.incident_datetime >= date_from)
    if date_to:
        stmt = stmt.where(FIR.incident_datetime <= date_to)
    stmt = stmt.group_by(FIR.crime_type).order_by(func.count(FIR.id).desc())

    rows = db.execute(stmt).all()
    items = [CrimeTypeDistributionItem(crime_type=r.crime_type, count=r.count) for r in rows]
    return CrimeTypeDistributionResponse(total=sum(i.count for i in items), items=items)


def get_day_of_week_pattern(db: Session, district_id: uuid.UUID | None) -> list[DayOfWeekBucket]:
    dow = func.extract("dow", FIR.incident_datetime)
    stmt = select(dow.label("dow"), func.count(FIR.id).label("count"))
    if district_id:
        stmt = stmt.where(FIR.district_id == district_id)
    stmt = stmt.group_by(dow).order_by(dow)

    labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    rows = {int(r.dow): r.count for r in db.execute(stmt).all()}
    return [DayOfWeekBucket(day=labels[i], count=rows.get(i, 0)) for i in range(7)]


def generate_ai_insight(distribution: CrimeTypeDistributionResponse, trend: CrimeTrendResponse) -> AIInsight:
    if not distribution.items:
        summary = "Not enough data in the selected range to generate an insight."
    else:
        top = distribution.items[0]
        pct = (top.count / distribution.total * 100) if distribution.total else 0
        recent_trend = "rising" if len(trend.points) >= 2 and trend.points[-1].count > trend.points[0].count else "stable"
        summary = (
            f"{top.crime_type.value.replace('_', ' ').title()} is the leading crime type in this view "
            f"({top.count} cases, {pct:.0f}% of total). Overall volume trend for the period looks {recent_trend}."
        )
    return AIInsight(summary=summary, generated_at=datetime.utcnow().isoformat())