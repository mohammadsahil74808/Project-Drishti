"""SentinelX AI — Criminal network graph schemas."""
import uuid

from pydantic import BaseModel


class NetworkNode(BaseModel):
    id: uuid.UUID
    label: str
    risk_score: float
    centrality: float
    case_count: int


class NetworkEdge(BaseModel):
    source: uuid.UUID
    target: uuid.UUID
    relation_type: str
    weight: float


class CriminalNetworkGraphResponse(BaseModel):
    nodes: list[NetworkNode]
    edges: list[NetworkEdge]


class CentralNodeResponse(BaseModel):
    id: uuid.UUID
    label: str
    centrality: float
    community_id: int