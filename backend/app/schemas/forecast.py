"""SentinelX AI — Forecast schemas."""
import uuid
from datetime import date

from pydantic import BaseModel

from app.schemas.crime_type import CrimeType


class ForecastPoint(BaseModel):
    forecast_date: date
    predicted_count: float
    lower_bound: float
    upper_bound: float
    actual_count: float | None = None


class ForecastSeriesResponse(BaseModel):
    district_id: uuid.UUID
    crime_type: CrimeType
    horizon_days: int
    model_version: str
    points: list[ForecastPoint]


class BacktestPoint(BaseModel):
    week_label: str
    mape_percent: float


class ForecastRetrainResponse(BaseModel):
    task_id: str
    status: str