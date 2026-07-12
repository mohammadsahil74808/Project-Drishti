"""
SentinelX AI — Geo / Heatmap Service
"""
import uuid
from datetime import datetime, timedelta

from geoalchemy2.functions import ST_X, ST_Y
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.fir import CrimeType, FIRRecord
from app.models.hotspot import Hotspot
from app.schemas.geo import HeatmapPoint, HeatmapResponse, HotspotResponse
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
        ST_Y(FIRRecord.location).label("lat"),
        ST_X(FIRRecord.location).label("lng"),
        FIRRecord.crime_type,
    ).where(FIRRecord.incident_datetime >= since)

    if district_id:
        stmt = stmt.where(FIRRecord.district_id == district_id)
    if crime_type:
        stmt = stmt.where(FIRRecord.crime_type == crime_type)

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
        ST_Y(Hotspot.centroid).label("lat"),
        ST_X(Hotspot.centroid).label("lng"),
    )
    if district_id:
        stmt = stmt.where(Hotspot.district_id == district_id)
    if severity:
        stmt = stmt.where(Hotspot.severity == severity)
    stmt = stmt.order_by(Hotspot.crime_density.desc())

    results = []
    for hotspot, lat, lng in db.execute(stmt).all():
        item = HotspotResponse.model_validate(hotspot)
        item.centroid = GeoPoint(lat=lat, lng=lng)
        results.append(item)
    return results