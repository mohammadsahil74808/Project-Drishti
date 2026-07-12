"""SentinelX AI — Missing Persons router."""

import uuid

from fastapi import APIRouter, HTTPException, status

from app.core.deps import DbSession
from app.schemas.missing_person import (
    MissingPersonCreate,
    MissingPersonMatchResponse,
    MissingPersonResponse,
)
from app.services import missing_person_service

router = APIRouter(prefix="/missing-persons", tags=["missing-persons"])


@router.get("", response_model=list[MissingPersonResponse])
def list_missing_persons(
    db: DbSession, status_: str | None = None, district_id: uuid.UUID | None = None
):
    return missing_person_service.list_missing_persons(db, status_, district_id)


@router.post(
    "", response_model=MissingPersonResponse, status_code=status.HTTP_201_CREATED
)
def create_missing_person(payload: MissingPersonCreate, db: DbSession):
    return missing_person_service.create_missing_person(db, payload)


@router.get("/{mp_id}", response_model=MissingPersonResponse)
def get_missing_person(mp_id: uuid.UUID, db: DbSession):
    try:
        return missing_person_service.get_missing_person(db, mp_id)
    except missing_person_service.MissingPersonNotFoundError as exc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, str(exc)) from exc


@router.get("/{mp_id}/matches", response_model=MissingPersonMatchResponse)
def get_matches(mp_id: uuid.UUID, db: DbSession):
    try:
        return missing_person_service.find_candidate_matches(db, mp_id)
    except missing_person_service.MissingPersonNotFoundError as exc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, str(exc)) from exc
