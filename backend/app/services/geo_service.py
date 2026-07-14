"""
SentinelX AI — Geo / Heatmap Service
"""
import uuid
from datetime import datetime, timedelta

from geoalchemy2 import Geometry
from geoalchemy2.functions import ST_X, ST_Y
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.schemas.crime_type import CrimeType
from app.models.fir import FIR
from app.models.analytics import CrimeHotspot as Hotspot, HotspotSeverity
from app.models.geo import District
from app.schemas.geo import HeatmapPoint, HeatmapResponse, HotspotResponse, DistrictResponse
from app.schemas.fir import GeoPoint

WINDOW_TO_DAYS = {"24h": 1, "7d": 7, "30d": 30, "90d": 90}


def get_heatmap(
    db: Session,
    district_id: uuid.UUID | None,
    crime_type: CrimeType | None,
    window: str = "7d",
) -> HeatmapResponse:
    days = WINDOW_TO_DAYS.get(window, 7)
    since = datetime.utcnow() - timedelta(days=days)

    stmt = select(
        ST_Y(FIR.location.cast(Geometry)).label("lat"),
        ST_X(FIR.location.cast(Geometry)).label("lng"),
        FIR.crime_type,
    ).where(FIR.incident_datetime >= since)

    if district_id:
        stmt = stmt.where(FIR.district_id == district_id)
    if crime_type:
        stmt = stmt.where(FIR.crime_type == crime_type)

    rows = db.execute(stmt).all()
    points = [
        HeatmapPoint(lat=r.lat, lng=r.lng, weight=1.0, crime_type=r.crime_type)
        for r in rows
    ]
    return HeatmapResponse(district_id=district_id, window=window, points=points)


def list_hotspots(
    db: Session, district_id: uuid.UUID | None, severity: str | None
) -> list[HotspotResponse]:
    stmt = select(
        Hotspot,
        ST_Y(Hotspot.centroid.cast(Geometry)).label("lat"),
        ST_X(Hotspot.centroid.cast(Geometry)).label("lng"),
    )
    if district_id:
        stmt = stmt.where(Hotspot.district_id == district_id)
    if severity:
        stmt = stmt.where(Hotspot.severity == severity)
    stmt = stmt.order_by(Hotspot.crime_density.desc())

    results = []
    for hotspot, lat, lng in db.execute(stmt).all():
        item = HotspotResponse(
            id=hotspot.id,
            district_id=hotspot.district_id,
            name=hotspot.name,
            radius_m=hotspot.radius_m,
            crime_density=hotspot.crime_density,
            time_window=hotspot.time_window,
            severity=hotspot.severity,
            created_at=hotspot.created_at,
            updated_at=hotspot.updated_at,
            centroid=GeoPoint(lat=lat, lng=lng)
        )
        results.append(item)
    return results


def list_districts(db: Session) -> list[DistrictResponse]:
    stmt = select(District).order_by(District.name)
    districts = db.execute(stmt).scalars().all()
    return [DistrictResponse.model_validate(d) for d in districts]