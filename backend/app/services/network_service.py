"""
SentinelX AI — Criminal Network Service
"""
import uuid
from collections import defaultdict

from sqlalchemy import select
from sqlalchemy.orm import Session

from database.models.people import Suspect
from database.models.criminal import CriminalNetworkEdge
from app.schemas.network import CentralNodeResponse, CriminalNetworkGraphResponse, NetworkEdge, NetworkNode


def get_network_graph(
    db: Session, district_id: uuid.UUID | None = None, min_weight: float = 0.0
) -> CriminalNetworkGraphResponse:
    edge_stmt = select(CriminalNetworkEdge).where(CriminalNetworkEdge.weight >= min_weight)
    edges = list(db.scalars(edge_stmt))

    suspect_ids = {e.suspect_a_id for e in edges} | {e.suspect_b_id for e in edges}
    if not suspect_ids:
        return CriminalNetworkGraphResponse(nodes=[], edges=[])

    suspects = list(db.scalars(select(Suspect).where(Suspect.id.in_(suspect_ids))))

    degree: dict[uuid.UUID, int] = defaultdict(int)
    case_count: dict[uuid.UUID, int] = defaultdict(int)
    for e in edges:
        degree[e.suspect_a_id] += 1
        degree[e.suspect_b_id] += 1

    for s in suspects:
        case_count[s.id] = len(s.prior_case_ids) + 1

    max_degree = max(degree.values(), default=1)

    nodes = [
        NetworkNode(
            id=s.id,
            label=s.display_label,
            risk_score=min(100.0, degree[s.id] * 15.0),
            centrality=round(degree[s.id] / max_degree, 2) if max_degree else 0.0,
            case_count=case_count[s.id],
        )
        for s in suspects
    ]
    edge_responses = [
        NetworkEdge(source=e.suspect_a_id, target=e.suspect_b_id, relation_type=e.relation_type, weight=e.weight)
        for e in edges
    ]

    return CriminalNetworkGraphResponse(nodes=nodes, edges=edge_responses)


def get_central_nodes(db: Session, district_id: uuid.UUID | None = None, limit: int = 10) -> list[CentralNodeResponse]:
    graph = get_network_graph(db, district_id)
    ranked = sorted(graph.nodes, key=lambda n: n.centrality, reverse=True)[:limit]
    return [
        CentralNodeResponse(id=n.id, label=n.label, centrality=n.centrality, community_id=0)
        for n in ranked
    ]