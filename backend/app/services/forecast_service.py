"""
SentinelX AI — Forecast Service
"""
import statistics
import uuid
from datetime import date, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.schemas.crime_type import CrimeType
from database.models.analytics import CrimeForecast
from app.schemas.forecast import ForecastPoint, ForecastSeriesResponse


def get_forecast_series(
    db: Session, district_id: uuid.UUID, crime_type: CrimeType, horizon_days: int = 14
) -> ForecastSeriesResponse:
    stmt = (
        select(CrimeForecast)
        .where(
            CrimeForecast.district_id == district_id,
            CrimeForecast.crime_type == crime_type,
            CrimeForecast.forecast_date >= date.today(),
        )
        .order_by(CrimeForecast.forecast_date)
        .limit(horizon_days)
    )
    rows = list(db.scalars(stmt))

    if not rows:
        rows = _naive_fallback_forecast(district_id, crime_type, horizon_days)
        points = rows
        model_version = "naive-fallback-v0"
    else:
        points = [
            ForecastPoint(
                forecast_date=r.forecast_date,
                predicted_count=r.predicted_count,
                lower_bound=r.lower_bound,
                upper_bound=r.upper_bound,
            )
            for r in rows
        ]
        model_version = rows[0].model_version if hasattr(rows[0], "model_version") else "v1"

    return ForecastSeriesResponse(
        district_id=district_id,
        crime_type=crime_type,
        horizon_days=horizon_days,
        model_version=model_version,
        points=points,
    )


def _naive_fallback_forecast(
    district_id: uuid.UUID, crime_type: CrimeType, horizon_days: int
) -> list[ForecastPoint]:
    baseline = 10.0
    points = []
    for i in range(horizon_days):
        d = date.today() + timedelta(days=i + 1)
        spread = 0.1 + (i * 0.01)
        points.append(
            ForecastPoint(
                forecast_date=d,
                predicted_count=baseline,
                lower_bound=round(baseline * (1 - spread), 1),
                upper_bound=round(baseline * (1 + spread), 1),
            )
        )
    return points


def trigger_retrain() -> str:
    from app.workers.tasks import retrain_forecast_models

    task = retrain_forecast_models.delay()
    return task.id