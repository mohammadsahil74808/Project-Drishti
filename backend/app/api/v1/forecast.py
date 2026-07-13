"""SentinelX AI — Forecast router."""

import uuid

from fastapi import APIRouter, Depends

from app.core.deps import DbSession, require_analyst_or_above
from app.schemas.crime_type import CrimeType
from app.schemas.forecast import ForecastRetrainResponse, ForecastSeriesResponse
from app.services import forecast_service

router = APIRouter(prefix="/forecast", tags=["forecast"])


@router.get("/{district_id}", response_model=ForecastSeriesResponse)
def get_forecast(
    db: DbSession, district_id: uuid.UUID, crime_type: CrimeType, horizon: int = 14
):
    return forecast_service.get_forecast_series(db, district_id, crime_type, horizon)


@router.post(
    "/retrain",
    response_model=ForecastRetrainResponse,
    dependencies=[Depends(require_analyst_or_above)],
)
def retrain():
    task_id = forecast_service.trigger_retrain()
    return ForecastRetrainResponse(task_id=task_id, status="queued")
