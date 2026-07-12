"""
SentinelX AI — Shared FastAPI Dependencies

`get_current_user` decodes the bearer JWT and loads the User row.
`require_roles(...)` is a dependency factory for RBAC — attach it to any
route that should be restricted to specific roles.
"""
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import TokenError, decode_token
from app.db.session import get_db
from app.models.user import User, UserRole

bearer_scheme = HTTPBearer(auto_error=False)

DbSession = Annotated[Session, Depends(get_db)]


def get_current_user(
    db: DbSession,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> User:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = decode_token(credentials.credentials, expected_type="access")
    except TokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {exc}",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    user = db.get(User, payload["sub"])
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def require_roles(*allowed_roles: UserRole):
    """Dependency factory — restricts a route to the given roles.

    Usage: `current_user: CurrentUser = Depends(require_roles(UserRole.SHO, UserRole.SP))`
    """

    def _check(current_user: CurrentUser) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{current_user.role}' is not permitted to perform this action.",
            )
        return current_user

    return _check


require_admin = require_roles(UserRole.ADMIN)
require_command_staff = require_roles(UserRole.SP, UserRole.COMMISSIONER, UserRole.ADMIN)
require_analyst_or_above = require_roles(
    UserRole.ANALYST, UserRole.SHO, UserRole.SP, UserRole.COMMISSIONER, UserRole.ADMIN
)