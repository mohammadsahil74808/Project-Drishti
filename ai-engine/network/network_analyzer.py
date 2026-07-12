"""
SentinelX AI — Criminal Network Analysis (NetworkX)

Builds a suspect linkage graph and computes centrality + community
detection — the real implementation behind backend's network_service.py
placeholder degree-centrality logic. Uses betweenness centrality (who
bridges otherwise-separate groups — the "connector"/kingpin signal) and
Louvain community detection (gang cluster identification).
"""
from __future__ import annotations

import networkx as nx


def build_graph(nodes: list[dict], edges: list[dict]) -> nx.Graph:
    """
    nodes: [{id, label, case_count}, ...]
    edges: [{source, target, relation_type, weight}, ...]
    """
    g = nx.Graph()
    for n in nodes:
        g.add_node(n["id"], label=n.get("label", n["id"]), case_count=n.get("case_count", 1))
    for e in edges:
        g.add_edge(e["source"], e["target"], relation_type=e.get("relation_type", "linked"), weight=e.get("weight", 1.0))
    return g


def compute_centrality(g: nx.Graph) -> dict[str, dict]:
    """Returns per-node degree, betweenness, and eigenvector centrality (0.0 fallback if disconnected)."""
    degree = nx.degree_centrality(g)
    betweenness = nx.betweenness_centrality(g, weight="weight")
    try:
        eigenvector = nx.eigenvector_centrality(g, weight="weight", max_iter=500)
    except (nx.PowerIterationFailedConvergence, nx.NetworkXError):
        eigenvector = {n: 0.0 for n in g.nodes}

    return {
        node: {
            "degree_centrality": round(degree.get(node, 0.0), 4),
            "betweenness_centrality": round(betweenness.get(node, 0.0), 4),
            "eigenvector_centrality": round(eigenvector.get(node, 0.0), 4),
        }
        for node in g.nodes
    }


def detect_communities(g: nx.Graph) -> dict[str, int]:
    """Louvain community detection — groups nodes into likely-gang clusters. Falls back to
    connected-components labeling if python-louvain isn't installed."""
    try:
        import community as community_louvain

        partition = community_louvain.best_partition(g, weight="weight")
        return {str(node): community_id for node, community_id in partition.items()}
    except ImportError:
        partition = {}
        for i, component in enumerate(nx.connected_components(g)):
            for node in component:
                partition[str(node)] = i
        return partition


def get_central_nodes(g: nx.Graph, top_k: int = 10, metric: str = "betweenness_centrality") -> list[dict]:
    centrality = compute_centrality(g)
    ranked = sorted(centrality.items(), key=lambda item: item[1][metric], reverse=True)[:top_k]
    return [
        {"id": node, "label": g.nodes[node].get("label", node), **scores}
        for node, scores in ranked
    ]


def analyze_network(nodes: list[dict], edges: list[dict]) -> dict:
    """Single entry point used by the inference API: builds graph + returns full analysis."""
    g = build_graph(nodes, edges)
    if g.number_of_nodes() == 0:
        return {"nodes": [], "central_nodes": [], "communities": {}, "density": 0.0}

    centrality = compute_centrality(g)
    communities = detect_communities(g)

    enriched_nodes = [
        {
            "id": node,
            "label": g.nodes[node].get("label", node),
            "case_count": g.nodes[node].get("case_count", 1),
            "community_id": communities.get(str(node), -1),
            **centrality[node],
        }
        for node in g.nodes
    ]

    return {
        "nodes": enriched_nodes,
        "central_nodes": get_central_nodes(g, top_k=10),
        "communities": communities,
        "density": round(nx.density(g), 4),
        "num_components": nx.number_connected_components(g),
    }
