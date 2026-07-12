"""SentinelX AI — Unit tests for recommendation/recommender.py."""
from network.network_analyzer import analyze_network
from recommendation.recommender import recommend_investigation_leads, recommend_patrol_zones


def test_recommend_patrol_zones_ranks_by_blended_score():
    hotspots = [
        {"cluster_id": 0, "district": "A", "crime_density": 50, "severity": "high"},
        {"cluster_id": 1, "district": "B", "crime_density": 10, "severity": "low"},
    ]
    forecasts = [{"district": "A", "predicted_count": 20}, {"district": "B", "predicted_count": 5}]

    ranked = recommend_patrol_zones(hotspots, forecasts, top_k=2)
    assert ranked[0]["district"] == "A"
    assert ranked[0]["patrol_priority_score"] >= ranked[1]["patrol_priority_score"]


def test_recommend_patrol_zones_respects_top_k():
    hotspots = [{"cluster_id": i, "district": f"D{i}", "crime_density": i + 1, "severity": "low"} for i in range(10)]
    ranked = recommend_patrol_zones(hotspots, [], top_k=3)
    assert len(ranked) == 3


def test_recommend_investigation_leads_excludes_target():
    nodes = [{"id": f"s{i}", "label": f"S{i}", "case_count": 2} for i in range(4)]
    edges = [{"source": "s0", "target": "s1"}, {"source": "s0", "target": "s2"}, {"source": "s0", "target": "s3"}]
    analysis = analyze_network(nodes, edges)

    leads = recommend_investigation_leads(analysis, target_suspect_id="s0", top_k=5)
    assert all(lead["id"] != "s0" for lead in leads)
    assert len(leads) <= 3


def test_recommend_investigation_leads_unknown_suspect_returns_empty():
    nodes = [{"id": "s0", "label": "S0", "case_count": 1}]
    analysis = analyze_network(nodes, [])
    leads = recommend_investigation_leads(analysis, target_suspect_id="does-not-exist")
    assert leads == []
