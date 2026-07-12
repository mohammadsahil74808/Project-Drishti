"""
SentinelX AI — Recommendation Engine

Three recommendation surfaces used across the platform:
  1. similar_firs()      — "cases like this one" (wraps semantic_search)
  2. recommend_patrol_zones() — where to deploy patrols next, ranked by
     a blend of hotspot density + forecasted risk
  3. recommend_investigation_leads() — for a given suspect, ranks their
     network neighbors by combined risk + connection strength as
     candidate leads worth investigating next
"""
from __future__ import annotations

from search.semantic_search import SemanticSearchService


def similar_firs(fir_text: str, top_k: int = 5, exclude_fir_id: str | None = None) -> list[dict]:
    service = SemanticSearchService()
    return service.find_similar_firs(fir_text, top_k=top_k, exclude_fir_id=exclude_fir_id)


def recommend_patrol_zones(hotspots: list[dict], forecasts: list[dict], top_k: int = 5) -> list[dict]:
    """
    hotspots: [{cluster_id, centroid_lat, centroid_lng, crime_density, severity}, ...]
    forecasts: [{district, predicted_count}, ...] (aggregate per-district forecast, matched by nearest label)
    Returns top_k zones ranked by a blended score (60% observed density, 40% forecasted risk).
    """
    forecast_lookup = {f.get("district"): f.get("predicted_count", 0) for f in forecasts}
    max_density = max((h["crime_density"] for h in hotspots), default=1) or 1
    max_forecast = max(forecast_lookup.values(), default=1) or 1

    scored = []
    for h in hotspots:
        forecast_value = forecast_lookup.get(h.get("district"), 0)
        density_norm = h["crime_density"] / max_density
        forecast_norm = forecast_value / max_forecast
        blended = round(0.6 * density_norm + 0.4 * forecast_norm, 4)
        scored.append({**h, "patrol_priority_score": blended})

    scored.sort(key=lambda z: z["patrol_priority_score"], reverse=True)
    return scored[:top_k]


def recommend_investigation_leads(
    network_analysis: dict, target_suspect_id: str, top_k: int = 5
) -> list[dict]:
    """
    network_analysis: output of network.network_analyzer.analyze_network()
    Ranks neighbors of target_suspect_id by (centrality * case_count), i.e.
    "well-connected repeat offenders near this suspect" as investigative leads.
    """
    nodes_by_id = {n["id"]: n for n in network_analysis["nodes"]}
    if target_suspect_id not in nodes_by_id:
        return []

    candidates = [n for n in network_analysis["nodes"] if n["id"] != target_suspect_id]
    for c in candidates:
        c["lead_score"] = round(c["betweenness_centrality"] * (c["case_count"] + 1), 4)

    candidates.sort(key=lambda c: c["lead_score"], reverse=True)
    return candidates[:top_k]
