"""
SentinelX AI — FIR Service
"""
import uuid
from datetime import datetime

from geoalchemy2.functions import ST_MakePoint, ST_SetSRID
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.fir import CaseStatus, FIRRecord
from app.schemas.fir import FIRCreate, FIRFilterParams, FIRUpdate


class FIRNotFoundError(Exception):
    pass


class DuplicateFIRNumberError(Exception):
    pass


def _make_point(lat: float, lng: float):
    return ST_SetSRID(ST_MakePoint(lng, lat), 4326)


def get_fir(db: Session, fir_id: uuid.UUID) -> FIRRecord:
    fir = db.get(FIRRecord, fir_id)
    if fir is None:
        raise FIRNotFoundError(f"FIR {fir_id} not found.")
    return fir


def list_firs(
    db: Session,
    filters: FIRFilterParams,
    page: int = 1,
    page_size: int = 25,
) -> tuple[list[FIRRecord], int]:
    stmt = select(FIRRecord)

    if filters.district_id:
        stmt = stmt.where(FIRRecord.district_id == filters.district_id)
    if filters.station_id:
        stmt = stmt.where(FIRRecord.station_id == filters.station_id)
    if filters.crime_type:
        stmt = stmt.where(FIRRecord.crime_type == filters.crime_type)
    if filters.status:
        stmt = stmt.where(FIRRecord.status == filters.status)
    if filters.date_from:
        stmt = stmt.where(FIRRecord.incident_datetime >= filters.date_from)
    if filters.date_to:
        stmt = stmt.where(FIRRecord.incident_datetime <= filters.date_to)

    total = len(list(db.scalars(stmt)))

    stmt = (
        stmt.order_by(FIRRecord.incident_datetime.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    items = list(db.scalars(stmt))
    return items, total


def create_fir(db: Session, payload: FIRCreate) -> FIRRecord:
    existing = db.scalar(select(FIRRecord).where(FIRRecord.fir_no == payload.fir_no))
    if existing:
        raise DuplicateFIRNumberError(f"FIR number '{payload.fir_no}' already exists.")

    fir = FIRRecord(
        fir_no=payload.fir_no,
        station_id=payload.station_id,
        district_id=payload.district_id,
        crime_type=payload.crime_type,
        ipc_sections=payload.ipc_sections,
        incident_datetime=payload.incident_datetime,
        reported_datetime=payload.reported_datetime,
        location=_make_point(payload.location.lat, payload.location.lng),
        address_text=payload.address_text,
        mo_description=payload.mo_description,
        victim_age_bucket=payload.victim_age_bucket,
        accused_count=payload.accused_count,
        weapon_used=payload.weapon_used,
        status=CaseStatus.OPEN,
    )
    db.add(fir)
    db.commit()
    db.refresh(fir)
    return fir


def update_fir(db: Session, fir_id: uuid.UUID, payload: FIRUpdate) -> FIRRecord:
    fir = get_fir(db, fir_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(fir, field, value)
    db.commit()
    db.refresh(fir)
    return fir