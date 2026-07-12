"""
SentinelX AI — Evaluation Script: Crime Classifier

Loads the latest registered classifier and reports metrics on a held-out
(freshly generated, unseen-seed) dataset — separate from the train-time
internal split, to catch overfitting to a single synthetic run.

Usage: python -m evaluation.evaluate_classifier
"""
from __future__ import annotations

from sklearn.metrics import accuracy_score, classification_report, f1_score

from classification.crime_classifier import CrimeClassifier
from data.synthetic_generator import generate_synthetic_fir_dataset
from registry.model_registry import registry


def main() -> None:
    classifier = CrimeClassifier.load_latest()
    eval_df = generate_synthetic_fir_dataset(n_records=1000, seed=999)

    predictions = [classifier.predict(text)["predicted_crime_type"] for text in eval_df["mo_description"]]
    actual = eval_df["crime_type"].tolist()

    print("Held-out accuracy:", round(accuracy_score(actual, predictions), 4))
    print("Held-out F1 (macro):", round(f1_score(actual, predictions, average="macro"), 4))
    print(classification_report(actual, predictions, zero_division=0))

    print("\nTraining-time metrics (from registry):", registry.get_metrics("crime_classifier"))


if __name__ == "__main__":
    main()
