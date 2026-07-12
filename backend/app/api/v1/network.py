"""SentinelX AI — Criminal Network router."""

import uuid

from fastapi import APIRouter

from app.core.deps import DbSession
from app.schemas.network import CentralNodeResponse, CriminalNetworkGraphResponse
from app.services import network_service

router = APIRouter(prefix="/network", tags=["network"])


@router.get("/graph", response_model=CriminalNetworkGraphResponse)
def graph(db: DbSession, district_id: uuid.UUID | None = None, min_weight: float = 0.0):
    return network_service.get_network_graph(db, district_id, min_weight)


@router.get("/central-nodes", response_model=list[CentralNodeResponse])
def central_nodes(db: DbSession, district_id: uuid.UUID | None = None, limit: int = 10):
    return network_service.get_central_nodes(db, district_id, limit)
