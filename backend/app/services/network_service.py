"""
SentinelX AI — Criminal Network Service
"""
import uuid
from collections import defaultdict

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.people import Suspect
from app.models.criminal import CriminalNetworkEdge
from app.schemas.network import CentralNodeResponse, CriminalNetworkGraphResponse, NetworkEdge, NetworkNode


def get_network_graph(
    db: Session, district_id: uuid.UUID | None = None, min_weight: float = 0.0
) -> CriminalNetworkGraphResponse:
    suspect_stmt = select(Suspect)
    if district_id:
        from app.models.fir import FIR
        suspect_stmt = suspect_stmt.join(FIR).where(FIR.district_id == district_id)
        
    district_suspects = list(db.scalars(suspect_stmt))
    district_suspect_ids = {s.id for s in district_suspects}

    if not district_suspect_ids:
        return CriminalNetworkGraphResponse(nodes=[], edges=[])

    edge_stmt = select(CriminalNetworkEdge).where(
        (CriminalNetworkEdge.weight >= min_weight) &
        (CriminalNetworkEdge.suspect_a_id.in_(district_suspect_ids)) &
        (CriminalNetworkEdge.suspect_b_id.in_(district_suspect_ids))
    )
    edges = list(db.scalars(edge_stmt))
    
    suspect_ids = {e.suspect_a_id for e in edges} | {e.suspect_b_id for e in edges}
    if not suspect_ids:
        return CriminalNetworkGraphResponse(nodes=[], edges=[])

    suspects = [s for s in district_suspects if s.id in suspect_ids]

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
            risk_score=min(100.0, (degree[s.id] * 12.0) + (case_count[s.id] * 10.0)),
            centrality=round(degree[s.id] / max_degree, 2) if max_degree else 0.0,
            case_count=case_count[s.id],
        )
        for s in suspects
    ]
    edge_responses = [
        NetworkEdge(source=e.suspect_a_id, target=e.suspect_b_id, relation_type=e.relation_type, weight=e.weight)
        for e in edges
    ]

    try:
        import httpx
        from app.core.config import settings
        with httpx.Client(timeout=10.0) as client:
            resp = client.post(
                f"{settings.ai_engine_url}/network/analyze",
                json={
                    "nodes": [{"id": str(n.id), "label": n.label, "case_count": n.case_count} for n in nodes],
                    "edges": [{"source": str(e.source), "target": str(e.target), "relation_type": e.relation_type, "weight": e.weight} for e in edge_responses]
                }
            )
            resp.raise_for_status()
            data = resp.json()
            
            ai_nodes = []
            num_nodes = len(nodes)
            for n in data.get("nodes", []):
                # degree_centrality = abs_degree / (num_nodes - 1)
                # Therefore abs_degree = degree_centrality * (num_nodes - 1)
                abs_degree = float(n.get("degree_centrality", 0)) * max(1, num_nodes - 1)
                c_count = int(n.get("case_count", 1))
                ai_nodes.append(NetworkNode(
                    id=uuid.UUID(n["id"]),
                    label=n["label"],
                    risk_score=min(100.0, (abs_degree * 12.0) + (c_count * 10.0)),
                    centrality=float(n.get("betweenness_centrality", 0)),
                    case_count=c_count
                ))
            return CriminalNetworkGraphResponse(nodes=ai_nodes, edges=edge_responses)
    except Exception:
        # Fallback to local naive calculation if AI engine is offline
        return CriminalNetworkGraphResponse(nodes=nodes, edges=edge_responses)


def get_central_nodes(db: Session, district_id: uuid.UUID | None = None, limit: int = 10) -> list[CentralNodeResponse]:
    graph = get_network_graph(db, district_id)
    ranked = sorted(graph.nodes, key=lambda n: n.centrality, reverse=True)[:limit]
    return [
        CentralNodeResponse(id=n.id, label=n.label, centrality=n.centrality, community_id=0)
        for n in ranked
    ]