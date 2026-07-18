"""SentinelX AI — Crime Analytics router."""

import uuid
from datetime import datetime

from fastapi import APIRouter

from app.core.deps import DbSession
from app.schemas.crime_type import CrimeType
from app.schemas.analytics import (
    AIInsight,
    CrimeTrendResponse,
    CrimeTypeDistributionResponse,
    DayOfWeekBucket,
)
from app.services import analytics_service
from pydantic import BaseModel

class ClassifyRequest(BaseModel):
    text: str

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/trend", response_model=CrimeTrendResponse)
def crime_trend(
    db: DbSession,
    district_id: uuid.UUID | None = None,
    crime_type: CrimeType | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    granularity: str = "daily",
):
    return analytics_service.get_crime_trend(
        db, district_id, crime_type, date_from, date_to, granularity
    )


@router.get("/distribution", response_model=CrimeTypeDistributionResponse)
def crime_type_distribution(
    db: DbSession,
    district_id: uuid.UUID | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
):
    return analytics_service.get_crime_type_distribution(
        db, district_id, date_from, date_to
    )


@router.get("/day-of-week", response_model=list[DayOfWeekBucket])
def day_of_week(db: DbSession, district_id: uuid.UUID | None = None):
    return analytics_service.get_day_of_week_pattern(db, district_id)


@router.get("/insight", response_model=AIInsight)
def ai_insight(db: DbSession, district_id: uuid.UUID | None = None):
    distribution = analytics_service.get_crime_type_distribution(
        db, district_id, None, None
    )
    trend = analytics_service.get_crime_trend(
        db, district_id, None, None, None, "daily"
    )
    return analytics_service.generate_ai_insight(distribution, trend)


@router.post('/classify')
def classify_text(payload: ClassifyRequest):
    return analytics_service.classify_text(payload.text)
