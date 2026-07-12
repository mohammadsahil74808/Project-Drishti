"""SentinelX AI — AI Engine inference API request/response schemas."""
from __future__ import annotations

from pydantic import BaseModel


class ParseFIRRequest(BaseModel):
    text: str
    use_spacy: bool = False


class ClassifyRequest(BaseModel):
    text: str


class SemanticSearchRequest(BaseModel):
    query: str
    top_k: int = 10


class IndexFIRRequest(BaseModel):
    fir_id: str
    fir_no: str
    text: str


class RiskPredictRequest(BaseModel):
    hour: int
    day_of_week: int
    is_weekend: int
    month: int
    is_festival_month: int
    is_night: int
    trailing_7d_count: float
    trailing_30d_count: float
    is_severe_crime: int
    explain: bool = True


class ForecastRequest(BaseModel):
    district: str
    horizon_days: int = 14


class NetworkNodeIn(BaseModel):
    id: str
    label: str
    case_count: int = 1


class NetworkEdgeIn(BaseModel):
    source: str
    target: str
    relation_type: str = "linked"
    weight: float = 1.0


class NetworkAnalyzeRequest(BaseModel):
    nodes: list[NetworkNodeIn]
    edges: list[NetworkEdgeIn]


class ChatRequest(BaseModel):
    query: str
    session_id: str | None = None
