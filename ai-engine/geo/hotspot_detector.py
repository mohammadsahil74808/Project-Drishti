"""
SentinelX AI — Crime Hotspot Detection

DBSCAN clustering over FIR lat/lng (haversine metric, so eps is in real
kilometers, not degrees) — matches the project blueprint's hotspot
detection approach. Severity is derived from cluster size relative to
the dataset's cluster-size distribution, not a fixed magic number.
"""
from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.cluster import DBSCAN

EARTH_RADIUS_KM = 6371.0


def _severity_for_percentile(density: int, densities: np.ndarray) -> str:
    if len(densities) == 0:
        return "low"
    p50, p75, p90 = np.percentile(densities, [50, 75, 90])
    if density >= p90:
        return "critical"
    if density >= p75:
        return "high"
    if density >= p50:
        return "medium"
    return "low"


def detect_hotspots(
    df: pd.DataFrame,
    lat_col: str = "lat",
    lng_col: str = "lng",
    eps_km: float = 0.5,
    min_samples: int = 5,
) -> list[dict]:
    """
    Returns one row per detected cluster: centroid, point count, radius,
    severity. Noise points (DBSCAN label -1) are excluded — they aren't
    dense enough to be a "hotspot" by definition.
    """
    if df.empty:
        return []

    coords = np.radians(df[[lat_col, lng_col]].to_numpy())
    eps_rad = eps_km / EARTH_RADIUS_KM

    db = DBSCAN(eps=eps_rad, min_samples=min_samples, metric="haversine")
    labels = db.fit_predict(coords)

    df = df.copy()
    df["_cluster"] = labels

    clusters = df[df["_cluster"] != -1]
    if clusters.empty:
        return []

    cluster_sizes = clusters.groupby("_cluster").size().to_numpy()

    results = []
    for cluster_id, group in clusters.groupby("_cluster"):
        centroid_lat = group[lat_col].mean()
        centroid_lng = group[lng_col].mean()
        density = len(group)

        # radius = distance from centroid to farthest member point (haversine, km)
        centroid_rad = np.radians([[centroid_lat, centroid_lng]])
        member_rad = np.radians(group[[lat_col, lng_col]].to_numpy())
        dlat = member_rad[:, 0] - centroid_rad[0, 0]
        dlng = member_rad[:, 1] - centroid_rad[0, 1]
        a = np.sin(dlat / 2) ** 2 + np.cos(centroid_rad[0, 0]) * np.cos(member_rad[:, 0]) * np.sin(dlng / 2) ** 2
        distances_km = 2 * EARTH_RADIUS_KM * np.arcsin(np.sqrt(np.clip(a, 0, 1)))
        radius_m = float(max(distances_km.max() * 1000, 100.0))

        results.append(
            {
                "cluster_id": int(cluster_id),
                "centroid_lat": round(float(centroid_lat), 6),
                "centroid_lng": round(float(centroid_lng), 6),
                "crime_density": int(density),
                "radius_m": round(radius_m, 1),
                "severity": _severity_for_percentile(density, cluster_sizes),
            }
        )

    results.sort(key=lambda r: r["crime_density"], reverse=True)
    return results


def detect_hotspots_per_district(
    df: pd.DataFrame, district_col: str = "district", **kwargs
) -> dict[str, list[dict]]:
    """Runs detect_hotspots independently per district — avoids cross-district false clustering."""
    output = {}
    for district, group in df.groupby(district_col):
        output[district] = detect_hotspots(group, **kwargs)
    return output
