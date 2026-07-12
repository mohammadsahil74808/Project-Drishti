"""SentinelX AI — Vehicle Analytics router."""

import uuid

from fastapi import APIRouter

from app.core.deps import DbSession
from app.schemas.vehicle import VehicleRecoveryRateResponse, VehicleTheftTrendResponse
from app.services import vehicle_service

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


@router.get("/theft-trends", response_model=VehicleTheftTrendResponse)
def theft_trends(
    db: DbSession, district_id: uuid.UUID | None = None, vehicle_type: str | None = None
):
    return vehicle_service.get_theft_trend(db, district_id, vehicle_type)


@router.get("/recovery-rate", response_model=VehicleRecoveryRateResponse)
def recovery_rate(db: DbSession, vehicle_type: str):
    return vehicle_service.get_recovery_rate(db, vehicle_type)
