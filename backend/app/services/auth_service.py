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


import logging
logger = logging.getLogger(__name__)

def authenticate_user(db: Session, badge_no: str, password: str) -> User:
    logger.info("--- AUTHENTICATION DEBUG ---")
    logger.info(f"Attempting login for badge_no: '{badge_no}'")
    logger.info(f"provided_password_repr: {repr(password)}")
    
    user = db.scalar(select(User).where(User.badge_no == badge_no))
    logger.info(f"user_found={user is not None}")
    
    if user is None:
        raise InvalidCredentialsError("Invalid badge number or password.")
        
    logger.info(f"stored_hash={user.password_hash}")
    verify_result = verify_password(password, user.password_hash)
    logger.info(f"verify_result={verify_result}")
    logger.info(f"is_active={user.is_active}")
    
    if not verify_result:
        raise InvalidCredentialsError("Invalid badge number or password.")
        
    if not user.is_active:
        raise InactiveUserError("This account has been deactivated.")
        
    return user


def issue_token_pair(user: User) -> dict[str, str]:
    return {
        "access_token": create_access_token(str(user.id), user.role.value),
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