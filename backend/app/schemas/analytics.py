"""SentinelX AI — Crime analytics schemas (trends, distribution)."""
from datetime import date

from pydantic import BaseModel

from app.schemas.crime_type import CrimeType


class TrendPoint(BaseModel):
    period: str
    count: int


class CrimeTrendResponse(BaseModel):
    district_id: str | None
    crime_type: CrimeType | None
    granularity: str
    points: list[TrendPoint]


class CrimeTypeDistributionItem(BaseModel):
    crime_type: CrimeType
    count: int


class CrimeTypeDistributionResponse(BaseModel):
    total: int
    items: list[CrimeTypeDistributionItem]


class DayOfWeekBucket(BaseModel):
    day: str
    count: int


class AIInsight(BaseModel):
    summary: str
    generated_at: str