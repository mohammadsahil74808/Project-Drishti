"""SentinelX AI — Dashboard summary schemas."""
from pydantic import BaseModel


class StatTile(BaseModel):
    label: str
    value: str
    delta: str
    trend: str


class DistrictRiskRow(BaseModel):
    district_id: str
    district_name: str
    score: int
    severity: str


class DashboardSummaryResponse(BaseModel):
    stats: list[StatTile]
    district_risk: list[DistrictRiskRow]