"""
SentinelX AI — Dataset Loader

Single entry point for loading crime data into pandas DataFrames for
training/evaluation scripts. Supports two sources:
  1. CSV (synthetic_generator output, or any real export matching the schema)
  2. Live Postgres, via a raw SQLAlchemy connection string — kept
     independent of backend/app/db so ai-engine never imports backend code.
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


def load_fir_from_postgres(connection_string: str, limit: int | None = None) -> pd.DataFrame:
    """
    Reads fir_records directly via SQLAlchemy — used by training scripts
    against the real backend database without importing backend code
    (schema knowledge is duplicated intentionally to keep ai-engine
    deployable as an independent service).
    """
    from sqlalchemy import create_engine

    query = """
        SELECT
            f.id AS fir_id, f.fir_no, d.name AS district, s.name AS station,
            f.crime_type, f.ipc_sections, f.incident_datetime, f.reported_datetime,
            ST_Y(f.location::geometry) AS lat, ST_X(f.location::geometry) AS lng,
            f.address_text, f.mo_description, f.status, f.victim_age_bucket,
            f.accused_count, f.weapon_used
        FROM fir_records f
        JOIN stations s ON s.id = f.station_id
        JOIN districts d ON d.id = f.district_id
        ORDER BY f.incident_datetime DESC
    """
    if limit:
        query += f" LIMIT {int(limit)}"

    engine = create_engine(connection_string)
    with engine.connect() as conn:
        return pd.read_sql(query, conn, parse_dates=["incident_datetime", "reported_datetime"])


def train_test_split_by_date(df: pd.DataFrame, date_col: str = "incident_datetime", test_fraction: float = 0.2):
    """Time-based split (not random) — correct practice for forecasting/trend models."""
    df_sorted = df.sort_values(date_col)
    cutoff = int(len(df_sorted) * (1 - test_fraction))
    return df_sorted.iloc[:cutoff], df_sorted.iloc[cutoff:]
