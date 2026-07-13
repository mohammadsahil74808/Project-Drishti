"""SentinelX AI — Vehicle crime analytics schemas."""
import uuid
from datetime import date

from pydantic import BaseModel

from database.models.vehicle import VehicleCrimeStatus


class VehicleTrendPoint(BaseModel):
    period: str
    stolen: int
    recovered: int


class VehicleTheftTrendResponse(BaseModel):
    vehicle_type: str | None
    district_id: uuid.UUID | None
    points: list[VehicleTrendPoint]


class VehicleRecoveryRateResponse(BaseModel):
    vehicle_type: str
    total_stolen: int
    total_recovered: int
    recovery_rate_percent: float


class VehicleCrimeResponse(BaseModel):
    id: uuid.UUID
    vehicle_type: str
    status: VehicleCrimeStatus
    theft_date: date

    class Config:
        from_attributes = True