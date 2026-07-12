"""SentinelX AI — FIR schemas."""
import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.models.fir import CaseStatus, CrimeType
from app.schemas.common import ORMBase


class GeoPoint(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)


class FIRCreate(BaseModel):
    fir_no: str = Field(..., min_length=3, max_length=50)
    station_id: uuid.UUID
    district_id: uuid.UUID
    crime_type: CrimeType
    ipc_sections: list[str] = Field(default_factory=list)
    incident_datetime: datetime
    reported_datetime: datetime
    location: GeoPoint
    address_text: str | None = None
    mo_description: str | None = None
    victim_age_bucket: str | None = None
    accused_count: int = 0
    weapon_used: str | None = None


class FIRUpdate(BaseModel):
    status: CaseStatus | None = None
    mo_description: str | None = None
    accused_count: int | None = None
    weapon_used: str | None = None


class FIRResponse(ORMBase):
    id: uuid.UUID
    fir_no: str
    station_id: uuid.UUID
    district_id: uuid.UUID
    crime_type: CrimeType
    ipc_sections: list[str]
    incident_datetime: datetime
    reported_datetime: datetime
    address_text: str | None
    mo_description: str | None
    status: CaseStatus
    victim_age_bucket: str | None
    accused_count: int
    weapon_used: str | None
    created_at: datetime


class FIRFilterParams(BaseModel):
    district_id: uuid.UUID | None = None
    station_id: uuid.UUID | None = None
    crime_type: CrimeType | None = None
    status: CaseStatus | None = None
    date_from: datetime | None = None
    date_to: datetime | None = None