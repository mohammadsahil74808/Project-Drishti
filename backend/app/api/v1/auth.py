"""SentinelX AI — Auth router: POST /auth/login, /auth/refresh, GET /auth/me."""

from fastapi import APIRouter, HTTPException, status

from app.core.deps import CurrentUser, DbSession
from app.schemas.auth import LoginRequest, LoginResponse, RefreshRequest, TokenPair
from app.schemas.user import UserResponse
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: DbSession):
    try:
        user = auth_service.authenticate_user(db, payload.badge_no, payload.password)
    except auth_service.InvalidCredentialsError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, str(exc)) from exc
    except auth_service.InactiveUserError as exc:
        raise HTTPException(status.HTTP_403_FORBIDDEN, str(exc)) from exc

    tokens = auth_service.issue_token_pair(user)
    return LoginResponse(**tokens, user=UserResponse.model_validate(user))


@router.post("/refresh", response_model=TokenPair)
def refresh(payload: RefreshRequest, db: DbSession):
    try:
        tokens = auth_service.refresh_access_token(db, payload.refresh_token)
    except (
        auth_service.InvalidCredentialsError,
        auth_service.InactiveUserError,
    ) as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, str(exc)) from exc
    return TokenPair(**tokens)


@router.get("/me", response_model=UserResponse)
def me(current_user: CurrentUser):
    return UserResponse.model_validate(current_user)
