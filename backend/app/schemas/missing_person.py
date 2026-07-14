"""SentinelX AI — Missing person schemas."""
import uuid
from datetime import date

from pydantic import BaseModel, Field

from app.models.missing_person import MissingPersonStatus
from app.schemas.common import ORMBase
from app.schemas.fir import GeoPoint


class MissingPersonCreate(BaseModel):
    name_hash: str = Field(..., description="Hashed/anonymized identifier — never store raw PII here")
    age: int = Field(..., ge=0, le=130)
    last_seen_location: GeoPoint
    last_seen_address: str | None = None
    last_seen_date: date


class MissingPersonResponse(ORMBase):
    id: uuid.UUID
    name_hash: str
    age: int
    last_seen_address: str | None
    last_seen_date: date
    status: MissingPersonStatus
    matched_fir_id: uuid.UUID | None = None


class MissingPersonMatch(BaseModel):
    fir_id: uuid.UUID
    confidence: float
    reason: str


class MissingPersonMatchResponse(BaseModel):
    missing_person_id: uuid.UUID
    candidates: list[MissingPersonMatch]