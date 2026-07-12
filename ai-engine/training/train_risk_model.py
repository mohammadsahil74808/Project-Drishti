"""
SentinelX AI — Training Script: Risk Predictor

Usage:
    python -m training.train_risk_model --n-records 5000
"""
from __future__ import annotations

import argparse

from data.dataset_loader import load_fir_csv
from data.synthetic_generator import generate_synthetic_fir_dataset
from risk.risk_predictor import RiskPredictor


def main() -> None:
    parser = argparse.ArgumentParser(description="Train the SentinelX AI risk predictor.")
    parser.add_argument("--csv", type=str, default=None)
    parser.add_argument("--n-records", type=int, default=5000)
    args = parser.parse_args()

    df = load_fir_csv(args.csv) if args.csv else generate_synthetic_fir_dataset(n_records=args.n_records)
    print(f"Training on {len(df)} records")

    predictor = RiskPredictor().build()
    metrics = predictor.fit(df)
    print("Metrics:", metrics)

    version = predictor.save(metrics=metrics)
    print(f"Registered risk_predictor version {version}")


if __name__ == "__main__":
    main()
