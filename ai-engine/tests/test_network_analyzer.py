"""SentinelX AI — Unit tests for network/network_analyzer.py."""
from network.network_analyzer import analyze_network, build_graph, compute_centrality


def _sample_graph_data():
    nodes = [{"id": f"s{i}", "label": f"Suspect {i}", "case_count": 1} for i in range(5)]
    edges = [
        {"source": "s0", "target": "s1"},
        {"source": "s0", "target": "s2"},
        {"source": "s1", "target": "s2"},
        {"source": "s3", "target": "s4"},
    ]
    return nodes, edges


def test_build_graph_has_correct_node_and_edge_count():
    nodes, edges = _sample_graph_data()
    g = build_graph(nodes, edges)
    assert g.number_of_nodes() == 5
    assert g.number_of_edges() == 4


def test_centrality_returns_score_for_every_node():
    nodes, edges = _sample_graph_data()
    g = build_graph(nodes, edges)
    centrality = compute_centrality(g)
    assert set(centrality.keys()) == {"s0", "s1", "s2", "s3", "s4"}
    assert all("degree_centrality" in v for v in centrality.values())


def test_analyze_network_detects_two_components():
    nodes, edges = _sample_graph_data()
    result = analyze_network(nodes, edges)
    assert result["num_components"] == 2
    assert len(result["nodes"]) == 5


def test_analyze_network_empty_graph():
    result = analyze_network([], [])
    assert result["nodes"] == []
    assert result["density"] == 0.0
