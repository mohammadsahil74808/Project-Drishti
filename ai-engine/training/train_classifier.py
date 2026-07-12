"""
SentinelX AI — Training Script: Crime Classifier

Usage:
    python -m training.train_classifier --n-records 5000
    python -m training.train_classifier --csv path/to/real_fir_export.csv
"""
from __future__ import annotations

import argparse

from classification.crime_classifier import CrimeClassifier
from data.dataset_loader import load_fir_csv
from data.synthetic_generator import generate_synthetic_fir_dataset


def main() -> None:
    parser = argparse.ArgumentParser(description="Train the SentinelX AI crime classifier.")
    parser.add_argument("--csv", type=str, default=None, help="Path to a real FIR CSV export.")
    parser.add_argument("--n-records", type=int, default=5000, help="Synthetic record count if --csv not given.")
    args = parser.parse_args()

    if args.csv:
        df = load_fir_csv(args.csv)
        print(f"Loaded {len(df)} records from {args.csv}")
    else:
        df = generate_synthetic_fir_dataset(n_records=args.n_records)
        print(f"Generated {len(df)} synthetic records")

    classifier = CrimeClassifier().build()
    metrics = classifier.fit(df["mo_description"], df["crime_type"])
    print("Metrics:", metrics)
    print(classifier._last_report)

    version = classifier.save(metrics=metrics)
    print(f"Registered crime_classifier version {version}")


if __name__ == "__main__":
    main()
