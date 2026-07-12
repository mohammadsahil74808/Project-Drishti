"""SentinelX AI — Auth request/response schemas."""
from pydantic import BaseModel, Field

from app.schemas.user import UserResponse


class LoginRequest(BaseModel):
    badge_no: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class LoginResponse(TokenPair):
    user: UserResponse


class RefreshRequest(BaseModel):
    refresh_token: str