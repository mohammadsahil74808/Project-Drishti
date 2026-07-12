"""SentinelX AI — Users router: admin-only account management."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.deps import CurrentUser, DbSession, require_admin
from app.schemas.common import MessageResponse
from app.schemas.user import PasswordChangeRequest, UserCreate, UserResponse, UserUpdate
from app.services import user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.get(
    "", response_model=list[UserResponse], dependencies=[Depends(require_admin)]
)
def list_users(db: DbSession, station_id: uuid.UUID | None = None):
    return user_service.list_users(db, station_id)


@router.post(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
def create_user(payload: UserCreate, db: DbSession):
    try:
        return user_service.create_user(db, payload)
    except user_service.DuplicateBadgeError as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, str(exc)) from exc


@router.get(
    "/{user_id}", response_model=UserResponse, dependencies=[Depends(require_admin)]
)
def get_user(user_id: uuid.UUID, db: DbSession):
    try:
        return user_service.get_user(db, user_id)
    except user_service.UserNotFoundError as exc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, str(exc)) from exc


@router.patch(
    "/{user_id}", response_model=UserResponse, dependencies=[Depends(require_admin)]
)
def update_user(user_id: uuid.UUID, payload: UserUpdate, db: DbSession):
    try:
        return user_service.update_user(db, user_id, payload)
    except user_service.UserNotFoundError as exc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, str(exc)) from exc


@router.post("/me/change-password", response_model=MessageResponse)
def change_my_password(
    payload: PasswordChangeRequest, db: DbSession, current_user: CurrentUser
):
    try:
        user_service.change_password(
            db, current_user, payload.current_password, payload.new_password
        )
    except user_service.IncorrectPasswordError as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(exc)) from exc
    return MessageResponse(message="Password updated successfully.")
