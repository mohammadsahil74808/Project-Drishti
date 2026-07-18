"""
SentinelX AI — FIR Service
"""
import uuid
from datetime import datetime

from geoalchemy2.functions import ST_MakePoint, ST_SetSRID
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.schemas.crime_type import CrimeType
from app.models.fir import CaseStatus, FIR
from app.schemas.fir import FIRCreate, FIRFilterParams, FIRUpdate


class FIRNotFoundError(Exception):
    pass


class DuplicateFIRNumberError(Exception):
    pass


def _make_point(lat: float, lng: float):
    return ST_SetSRID(ST_MakePoint(lng, lat), 4326)


def get_fir(db: Session, fir_id: uuid.UUID) -> FIR:
    fir = db.get(FIR, fir_id)
    if fir is None:
        raise FIRNotFoundError(f"FIR {fir_id} not found.")
    return fir


def list_firs(
    db: Session,
    filters: FIRFilterParams,
    page: int = 1,
    page_size: int = 25,
) -> tuple[list[FIR], int]:
    stmt = select(FIR)

    if filters.district_id:
        stmt = stmt.where(FIR.district_id == filters.district_id)
    if filters.station_id:
        stmt = stmt.where(FIR.station_id == filters.station_id)
    if filters.crime_type:
        stmt = stmt.where(FIR.crime_type == filters.crime_type)
    if filters.status:
        stmt = stmt.where(FIR.status == filters.status)
    if filters.date_from:
        stmt = stmt.where(FIR.incident_datetime >= filters.date_from)
    if filters.date_to:
        stmt = stmt.where(FIR.incident_datetime <= filters.date_to)

    total = len(list(db.scalars(stmt)))

    stmt = (
        stmt.order_by(FIR.incident_datetime.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    items = list(db.scalars(stmt))
    return items, total


def create_fir(db: Session, payload: FIRCreate) -> FIR:
    existing = db.scalar(select(FIR).where(FIR.fir_no == payload.fir_no))
    if existing:
        raise DuplicateFIRNumberError(f"FIR number '{payload.fir_no}' already exists.")
    if payload.mo_description:
        import requests
        from app.core.config import settings
        try:
            resp = requests.post(
                f"{settings.ai_engine_url}/nlp/parse-fir", 
                json={"text": payload.mo_description, "use_spacy": False},
                timeout=10.0
            )
            if resp.status_code == 200:
                parsed = resp.json()
                if not payload.ipc_sections and parsed.get("sections"):
                    payload.ipc_sections = parsed["sections"]
                if not payload.weapon_used and parsed.get("weapons"):
                    payload.weapon_used = parsed["weapons"][0]
        except Exception as e:
            print(f"Failed to parse FIR: {e}")

    fir = FIR(
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
        status=CaseStatus.open,
    )
    db.add(fir)
    db.commit()
    db.refresh(fir)
    return fir


def update_fir(db: Session, fir_id: uuid.UUID, payload: FIRUpdate) -> FIR:
    fir = get_fir(db, fir_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(fir, field, value)
    db.commit()
    db.refresh(fir)
    return fir