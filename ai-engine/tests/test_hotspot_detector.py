"""SentinelX AI — Unit tests for geo/hotspot_detector.py."""
import pandas as pd

from geo.hotspot_detector import detect_hotspots


def test_detects_dense_cluster():
    # 10 points tightly packed (should form one hotspot) + 3 far-away noise points
    dense = pd.DataFrame({"lat": [12.97 + i * 0.0005 for i in range(10)], "lng": [77.59] * 10})
    noise = pd.DataFrame({"lat": [10.0, 20.0, 25.0], "lng": [70.0, 85.0, 90.0]})
    df = pd.concat([dense, noise], ignore_index=True)

    hotspots = detect_hotspots(df, eps_km=0.5, min_samples=5)
    assert len(hotspots) == 1
    assert hotspots[0]["crime_density"] == 10


def test_no_hotspots_when_sparse():
    df = pd.DataFrame({"lat": [10.0, 20.0, 30.0, 40.0], "lng": [70.0, 80.0, 90.0, 100.0]})
    hotspots = detect_hotspots(df, eps_km=0.5, min_samples=5)
    assert hotspots == []


def test_empty_dataframe_returns_empty_list():
    df = pd.DataFrame({"lat": [], "lng": []})
    assert detect_hotspots(df) == []


def test_severity_assigned_to_all_clusters():
    dense = pd.DataFrame({"lat": [12.97 + i * 0.0005 for i in range(8)], "lng": [77.59] * 8})
    hotspots = detect_hotspots(dense, eps_km=0.5, min_samples=5)
    assert all(h["severity"] in ("low", "medium", "high", "critical") for h in hotspots)
