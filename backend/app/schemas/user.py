"""SentinelX AI — User schemas."""
import uuid

from pydantic import BaseModel, Field

from app.core.deps import UserRole
from app.schemas.common import ORMBase


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    badge_no: str = Field(..., min_length=2, max_length=50)
    role: UserRole
    password: str = Field(..., min_length=8)
    station_id: uuid.UUID | None = None


class UserUpdate(BaseModel):
    name: str | None = None
    station_id: uuid.UUID | None = None
    is_active: bool | None = None


class UserResponse(ORMBase):
    id: uuid.UUID
    name: str
    badge_no: str
    role: UserRole
    is_active: bool
    station_id: uuid.UUID | None = None


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)