"""SentinelX AI — Geo / Heatmap router."""

import uuid

from fastapi import APIRouter

from app.core.deps import DbSession
from app.models.fir import CrimeType
from app.schemas.geo import HeatmapResponse, HotspotResponse
from app.services import geo_service

router = APIRouter(prefix="/geo", tags=["geo"])


@router.get("/heatmap", response_model=HeatmapResponse)
def heatmap(
    db: DbSession,
    district_id: uuid.UUID | None = None,
    crime_type: CrimeType | None = None,
    window: str = "7d",
):
    return geo_service.get_heatmap(db, district_id, crime_type, window)


@router.get("/hotspots", response_model=list[HotspotResponse])
def hotspots(
    db: DbSession, district_id: uuid.UUID | None = None, severity: str | None = None
):
    return geo_service.list_hotspots(db, district_id, severity)
