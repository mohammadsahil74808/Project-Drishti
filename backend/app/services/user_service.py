"""
SentinelX AI — User Service
"""
import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


class UserNotFoundError(Exception):
    pass


class DuplicateBadgeError(Exception):
    pass


class IncorrectPasswordError(Exception):
    pass


def get_user(db: Session, user_id: uuid.UUID) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise UserNotFoundError(f"User {user_id} not found.")
    return user


def list_users(db: Session, station_id: uuid.UUID | None = None) -> list[User]:
    stmt = select(User)
    if station_id:
        stmt = stmt.where(User.station_id == station_id)
    return list(db.scalars(stmt.order_by(User.name)))


def create_user(db: Session, payload: UserCreate) -> User:
    existing = db.scalar(select(User).where(User.badge_no == payload.badge_no))
    if existing:
        raise DuplicateBadgeError(f"Badge number '{payload.badge_no}' already exists.")

    user = User(
        name=payload.name,
        badge_no=payload.badge_no,
        role=payload.role,
        password_hash=hash_password(payload.password),
        station_id=payload.station_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user_id: uuid.UUID, payload: UserUpdate) -> User:
    user = get_user(db, user_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


def change_password(db: Session, user: User, current_password: str, new_password: str) -> None:
    if not verify_password(current_password, user.password_hash):
        raise IncorrectPasswordError("Current password is incorrect.")
    user.password_hash = hash_password(new_password)
    db.commit()


def deactivate_user(db: Session, user_id: uuid.UUID) -> User:
    user = get_user(db, user_id)
    user.is_active = False
    db.commit()
    db.refresh(user)
    return user