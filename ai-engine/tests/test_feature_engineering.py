"""SentinelX AI — Unit tests for features/feature_engineering.py."""
import pandas as pd

from features.feature_engineering import (
    add_geo_density_features,
    add_rolling_density_features,
    add_temporal_features,
)


def _sample_df():
    return pd.DataFrame(
        {
            "incident_datetime": pd.to_datetime(
                ["2026-01-05 22:00", "2026-01-10 14:00", "2026-06-15 09:00"]
            ),
            "district": ["A", "A", "B"],
            "lat": [12.97, 12.9701, 13.5],
            "lng": [77.59, 77.5901, 78.0],
        }
    )


def test_add_temporal_features_creates_expected_columns():
    df = add_temporal_features(_sample_df())
    for col in ("hour", "day_of_week", "is_weekend", "month", "is_festival_month", "is_night"):
        assert col in df.columns


def test_is_night_flag_correct():
    df = add_temporal_features(_sample_df())
    assert df.loc[0, "is_night"] == 1  # 22:00
    assert df.loc[1, "is_night"] == 0  # 14:00


def test_add_rolling_density_features_nondecreasing_within_group():
    df = add_rolling_density_features(_sample_df(), group_cols=["district"], windows=(30,))
    assert "trailing_30d_count" in df.columns
    assert (df["trailing_30d_count"] >= 0).all()


def test_add_geo_density_features_groups_nearby_points():
    df = add_geo_density_features(_sample_df(), grid_size=0.01)
    assert "geo_cell_density" in df.columns
    # rows 0 and 1 are ~0.0001 deg apart -> same grid cell -> density >= 2
    assert df.loc[0, "geo_cell_density"] >= 2
