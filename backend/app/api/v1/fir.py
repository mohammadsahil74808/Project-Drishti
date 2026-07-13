"""SentinelX AI — FIR CRUD router."""

import math
import uuid
from datetime import datetime

from fastapi import APIRouter, HTTPException, Query, status

from app.core.deps import DbSession, require_analyst_or_above
from fastapi import Depends

from app.schemas.crime_type import CrimeType
from database.models.fir import CaseStatus
from app.schemas.common import PaginatedResponse
from app.schemas.fir import FIRCreate, FIRFilterParams, FIRResponse, FIRUpdate
from app.services import fir_service

router = APIRouter(prefix="/fir", tags=["fir"])


@router.get("", response_model=PaginatedResponse[FIRResponse])
def list_firs(
    db: DbSession,
    district_id: uuid.UUID | None = None,
    station_id: uuid.UUID | None = None,
    crime_type: CrimeType | None = None,
    status_: CaseStatus | None = Query(default=None, alias="status"),
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=25, ge=1, le=100),
):
    filters = FIRFilterParams(
        district_id=district_id,
        station_id=station_id,
        crime_type=crime_type,
        status=status_,
        date_from=date_from,
        date_to=date_to,
    )
    items, total = fir_service.list_firs(db, filters, page, page_size)
    return PaginatedResponse(
        items=[FIRResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if page_size else 0,
    )


@router.post(
    "",
    response_model=FIRResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_analyst_or_above)],
)
def create_fir(payload: FIRCreate, db: DbSession):
    try:
        return fir_service.create_fir(db, payload)
    except fir_service.DuplicateFIRNumberError as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, str(exc)) from exc


@router.get("/{fir_id}", response_model=FIRResponse)
def get_fir(fir_id: uuid.UUID, db: DbSession):
    try:
        return fir_service.get_fir(db, fir_id)
    except fir_service.FIRNotFoundError as exc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, str(exc)) from exc


@router.patch(
    "/{fir_id}",
    response_model=FIRResponse,
    dependencies=[Depends(require_analyst_or_above)],
)
def update_fir(fir_id: uuid.UUID, payload: FIRUpdate, db: DbSession):
    try:
        return fir_service.update_fir(db, fir_id, payload)
    except fir_service.FIRNotFoundError as exc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, str(exc)) from exc
