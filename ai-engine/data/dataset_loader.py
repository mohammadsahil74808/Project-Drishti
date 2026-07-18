"""
SentinelX AI — Dataset Loader

Single entry point for loading crime data into pandas DataFrames for
training/evaluation scripts. Supports two sources:
  1. CSV (synthetic_generator output, or any real export matching the schema)
"""
from __future__ import annotations

from pathlib import Path

import pandas as pd

FIR_COLUMNS = [
    "fir_id", "fir_no", "district", "station", "crime_type", "ipc_sections",
    "incident_datetime", "reported_datetime", "lat", "lng", "address_text",
    "mo_description", "status", "victim_age_bucket", "accused_count", "weapon_used",
]


def load_fir_csv(path: str | Path) -> pd.DataFrame:
    df = pd.read_csv(path, parse_dates=["incident_datetime", "reported_datetime"])
    missing = set(FIR_COLUMNS) - set(df.columns)
    if missing:
        raise ValueError(f"FIR dataset missing required columns: {sorted(missing)}")
    return df


def train_test_split_by_date(df: pd.DataFrame, date_col: str = "incident_datetime", test_fraction: float = 0.2):
    """Time-based split (not random) — correct practice for forecasting/trend models."""
    df_sorted = df.sort_values(date_col)
    cutoff = int(len(df_sorted) * (1 - test_fraction))
    return df_sorted.iloc[:cutoff], df_sorted.iloc[cutoff:]
