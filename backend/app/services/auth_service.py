"""
SentinelX AI — Authentication Service
"""
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import (
    TokenError,
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_password,
)
from app.models.user import User


class InvalidCredentialsError(Exception):
    pass


class InactiveUserError(Exception):
    pass


import sqlalchemy
from alembic.config import Config
from alembic import command
from app.models.user import UserRole
from app.core.security import hash_password
import logging

logger = logging.getLogger(__name__)

def authenticate_user(db: Session, badge_no: str, password: str) -> User:
    user = None
    try:
        user = db.scalar(select(User).where(User.badge_no == badge_no))
    except sqlalchemy.exc.ProgrammingError as e:
        if "relation \"users\" does not exist" in str(e):
            logger.warning("Users table missing. Running inline migrations...")
            db.rollback()
            alembic_cfg = Config("alembic.ini")
            command.upgrade(alembic_cfg, "head")
        else:
            raise e

    # Auto-seed ADMIN001 if it's missing (bypasses serverless background thread deaths)
    if user is None and badge_no == "ADMIN001" and password == "Admin@123":
        logger.info("Auto-seeding ADMIN001 during login request...")
        user = User(
            name="System Admin",
            badge_no="ADMIN001",
            role=UserRole.admin,
            password_hash=hash_password("Admin@123"),
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    if user is None or not verify_password(password, user.password_hash):
        raise InvalidCredentialsError("Invalid badge number or password.")
    if not user.is_active:
        raise InactiveUserError("This account has been deactivated.")
    return user


def issue_token_pair(user: User) -> dict[str, str]:
    role_str = user.role.value if hasattr(user.role, "value") else str(user.role)
    return {
        "access_token": create_access_token(str(user.id), role_str),
        "refresh_token": create_refresh_token(str(user.id)),
        "token_type": "bearer",
    }


def refresh_access_token(db: Session, refresh_token: str) -> dict[str, str]:
    try:
        payload = decode_token(refresh_token, expected_type="refresh")
    except TokenError as exc:
        raise InvalidCredentialsError(f"Invalid refresh token: {exc}") from exc

    user = db.get(User, payload["sub"])
    if user is None or not user.is_active:
        raise InactiveUserError("User not found or inactive.")

    return issue_token_pair(user)