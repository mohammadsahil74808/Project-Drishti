"""
SentinelX AI — Training Script: Crime Forecaster

Trains one forecaster per (district, crime_type) combination present in
the dataset and registers each under a composite model name, since
forecasting is inherently a per-segment model, not one global model.

Usage:
    python -m training.train_forecast_model --n-records 8000
"""
from __future__ import annotations

import argparse

from data.dataset_loader import load_fir_csv
from data.synthetic_generator import generate_synthetic_fir_dataset
from forecasting.forecaster import CrimeForecaster
from registry.model_registry import registry


def main() -> None:
    parser = argparse.ArgumentParser(description="Train per-district crime forecasters.")
    parser.add_argument("--csv", type=str, default=None)
    parser.add_argument("--n-records", type=int, default=8000)
    parser.add_argument("--min-records-per-segment", type=int, default=30)
    args = parser.parse_args()

    df = load_fir_csv(args.csv) if args.csv else generate_synthetic_fir_dataset(n_records=args.n_records)
    print(f"Training on {len(df)} records across {df['district'].nunique()} districts")

    trained, skipped = 0, 0
    for district, group in df.groupby("district"):
        if len(group) < args.min_records_per_segment:
            skipped += 1
            continue

        forecaster = CrimeForecaster()
        metrics = forecaster.fit(group)
        model_name = f"crime_forecaster__{district.replace(' ', '_')}"
        version = registry.register(model_name, {
            "prophet_model": forecaster.prophet_model,
            "residual_model": forecaster.residual_model,
        }, metrics=metrics)
        print(f"  [{district}] trained -> version {version} ({metrics})")
        trained += 1

    print(f"Done. Trained {trained} district models, skipped {skipped} (insufficient data).")


if __name__ == "__main__":
    main()
