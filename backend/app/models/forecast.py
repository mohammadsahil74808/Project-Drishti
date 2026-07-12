"""
SentinelX AI — Crime Forecasts

Cached output of the Prophet + LightGBM ensemble forecasting pipeline
(app/ai/forecasting/). Populated by a nightly Celery job, read directly by
the API for fast dashboard responses (no on-request model inference).
"""

import uuid
from datetime import date as date_type

from sqlalchemy import Date, Enum, Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.fir import CrimeType


class CrimeForecast(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "crime_forecasts"

    district_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("districts.id", ondelete="CASCADE"),
        nullable=False,
    )
    crime_type: Mapped[CrimeType] = mapped_column(
        Enum(CrimeType, name="crime_type"), nullable=False
    )
    forecast_date: Mapped[date_type] = mapped_column(Date, nullable=False, index=True)
    predicted_count: Mapped[float] = mapped_column(Float, nullable=False)
    lower_bound: Mapped[float] = mapped_column(Float, nullable=False)
    upper_bound: Mapped[float] = mapped_column(Float, nullable=False)
    model_version: Mapped[str] = mapped_column(String(50), default="v1")
