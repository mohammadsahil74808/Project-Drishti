"""
SentinelX AI — Missing Person Service
"""
import uuid
from datetime import timedelta

from geoalchemy2.functions import ST_Distance
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.schemas.crime_type import CrimeType
from app.models.fir import FIR
from app.models.missing_person import MissingPerson
from app.schemas.fir import GeoPoint
from app.schemas.missing_person import MissingPersonCreate, MissingPersonMatch, MissingPersonMatchResponse
from app.services.fir_service import _make_point


class MissingPersonNotFoundError(Exception):
    pass


def get_missing_person(db: Session, mp_id: uuid.UUID) -> MissingPerson:
    mp = db.get(MissingPerson, mp_id)
    if mp is None:
        raise MissingPersonNotFoundError(f"Missing person {mp_id} not found.")
    return mp


def list_missing_persons(db: Session, status: str | None, district_id: uuid.UUID | None) -> list[MissingPerson]:
    stmt = select(MissingPerson)
    if status:
        stmt = stmt.where(MissingPerson.status == status)
    stmt = stmt.order_by(MissingPerson.last_seen_date.desc())
    return list(db.scalars(stmt))


def create_missing_person(db: Session, payload: MissingPersonCreate) -> MissingPerson:
    mp = MissingPerson(
        name_hash=payload.name_hash,
        age=payload.age,
        last_seen_location=_make_point(payload.last_seen_location.lat, payload.last_seen_location.lng),
        last_seen_address=payload.last_seen_address,
        last_seen_date=payload.last_seen_date,
    )
    db.add(mp)
    db.commit()
    db.refresh(mp)
    return mp


def find_candidate_matches(db: Session, mp_id: uuid.UUID, radius_km: float = 15.0) -> MissingPersonMatchResponse:
    mp = get_missing_person(db, mp_id)

    window_start = mp.last_seen_date
    window_end = mp.last_seen_date + timedelta(days=30)

    stmt = (
        select(
            FIR,
            ST_Distance(FIR.location, mp.last_seen_location).label("distance_m"),
        )
        .where(
            FIR.crime_type == CrimeType.MISSING_PERSON,
            FIR.incident_datetime >= window_start,
            FIR.incident_datetime <= window_end,
        )
        .order_by("distance_m")
        .limit(5)
    )

    candidates = []
    for fir, distance_m in db.execute(stmt).all():
        distance_km = (distance_m or 0) / 1000
        if distance_km > radius_km:
            continue
        confidence = max(0.0, round(1 - (distance_km / radius_km), 2))
        candidates.append(
            MissingPersonMatch(
                fir_id=fir.id,
                confidence=confidence,
                reason=f"{distance_km:.1f}km from last-seen location, within 30-day window",
            )
        )

    return MissingPersonMatchResponse(missing_person_id=mp_id, candidates=candidates)