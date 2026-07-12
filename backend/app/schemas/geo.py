"""SentinelX AI — Heatmap / hotspot schemas."""
import uuid

from pydantic import BaseModel

from app.models.fir import CrimeType
from app.models.hotspot import HotspotSeverity
from app.schemas.common import ORMBase
from app.schemas.fir import GeoPoint


class HeatmapPoint(BaseModel):
    lat: float
    lng: float
    weight: float
    crime_type: CrimeType


class HeatmapResponse(BaseModel):
    district_id: uuid.UUID | None
    window: str
    points: list[HeatmapPoint]


class HotspotResponse(ORMBase):
    id: uuid.UUID
    district_id: uuid.UUID
    name: str | None
    radius_m: float
    crime_density: int
    time_window: str
    severity: HotspotSeverity
    centroid: GeoPoint | None = None


class PatrolRouteStop(BaseModel):
    order: int
    label: str
    location: GeoPoint


class PatrolRouteResponse(BaseModel):
    station_id: uuid.UUID
    stops: list[PatrolRouteStop]
    total_distance_km: float