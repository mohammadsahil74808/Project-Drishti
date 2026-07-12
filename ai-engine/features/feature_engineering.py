"""
SentinelX AI — Feature Engineering

Shared feature-building functions used by classification, risk scoring,
and forecasting training/inference. Kept as pure functions operating on
pandas DataFrames so the exact same code path runs at train time and
inference time — avoids train/serve skew.
"""
from __future__ import annotations

import numpy as np
import pandas as pd

FESTIVAL_MONTHS = {1, 3, 8, 10, 11}  # rough Sankranti/Ugadi/Independence/Dasara/Diwali proxy


def add_temporal_features(df: pd.DataFrame, dt_col: str = "incident_datetime") -> pd.DataFrame:
    df = df.copy()
    dt = pd.to_datetime(df[dt_col])
    df["hour"] = dt.dt.hour
    df["day_of_week"] = dt.dt.dayofweek  # 0=Mon
    df["is_weekend"] = df["day_of_week"].isin([5, 6]).astype(int)
    df["month"] = dt.dt.month
    df["is_festival_month"] = df["month"].isin(FESTIVAL_MONTHS).astype(int)
    df["is_night"] = df["hour"].apply(lambda h: 1 if (h >= 20 or h < 5) else 0)
    return df


def add_rolling_density_features(
    df: pd.DataFrame, group_cols: list[str], dt_col: str = "incident_datetime", windows: tuple[int, ...] = (7, 30)
) -> pd.DataFrame:
    """
    For each row, computes trailing case counts within `windows` days for
    the same group (e.g. district+crime_type) — the core input feature for
    both risk scoring and forecasting. O(n log n) via sort + rolling merge,
    not O(n^2).
    """
    df = df.sort_values(dt_col).copy()
    df[dt_col] = pd.to_datetime(df[dt_col])

    for window in windows:
        col_name = f"trailing_{window}d_count"
        df[col_name] = 0
        for _, group in df.groupby(group_cols):
            idx = group.index
            times = group[dt_col].values
            counts = np.zeros(len(times), dtype=int)
            start = 0
            for i in range(len(times)):
                while times[i] - times[start] > np.timedelta64(window, "D"):
                    start += 1
                counts[i] = i - start
            df.loc[idx, col_name] = counts

    return df


def add_geo_density_features(df: pd.DataFrame, lat_col: str = "lat", lng_col: str = "lng", grid_size: float = 0.01) -> pd.DataFrame:
    """Bins coordinates into a coarse grid and counts co-located incidents — a cheap density proxy."""
    df = df.copy()
    df["geo_cell"] = (
        (df[lat_col] / grid_size).round().astype(int).astype(str)
        + "_"
        + (df[lng_col] / grid_size).round().astype(int).astype(str)
    )
    cell_counts = df["geo_cell"].value_counts()
    df["geo_cell_density"] = df["geo_cell"].map(cell_counts)
    return df


def build_classification_features(df: pd.DataFrame) -> pd.DataFrame:
    """Feature set for crime_classifier.py: predicts crime_type from structured + text-derived signals."""
    df = add_temporal_features(df)
    df = add_geo_density_features(df)
    df["mo_length"] = df["mo_description"].fillna("").str.len()
    df["has_weapon_mention"] = df["mo_description"].fillna("").str.contains(
        "knife|gun|pistol|weapon|rod|blade", case=False, regex=True
    ).astype(int)
    return df


def build_risk_features(df: pd.DataFrame) -> pd.DataFrame:
    """Feature set for risk_predictor.py: zone-level risk from density + temporal + severity mix."""
    df = add_temporal_features(df)
    df = add_rolling_density_features(df, group_cols=["district"])
    severe_types = {"robbery", "assault", "chain_snatching"}
    df["is_severe_crime"] = df["crime_type"].isin(severe_types).astype(int)
    return df


def build_forecast_features(daily_counts: pd.DataFrame, count_col: str = "count") -> pd.DataFrame:
    """
    Feature set for forecaster.py's LightGBM residual model. Expects a
    DataFrame already aggregated to one row per day (date, count).
    """
    df = daily_counts.copy().sort_values("date").reset_index(drop=True)
    df["date"] = pd.to_datetime(df["date"])
    df["day_of_week"] = df["date"].dt.dayofweek
    df["is_weekend"] = df["day_of_week"].isin([5, 6]).astype(int)
    df["month"] = df["date"].dt.month
    df["is_festival_month"] = df["month"].isin(FESTIVAL_MONTHS).astype(int)

    for lag in (1, 7, 14):
        df[f"lag_{lag}"] = df[count_col].shift(lag)
    df["rolling_mean_7"] = df[count_col].shift(1).rolling(7).mean()
    df["rolling_std_7"] = df[count_col].shift(1).rolling(7).std()

    return df
