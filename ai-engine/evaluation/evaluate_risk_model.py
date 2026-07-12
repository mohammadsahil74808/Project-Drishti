"""
SentinelX AI — Evaluation Script: Risk Predictor

Usage: python -m evaluation.evaluate_risk_model
"""
from __future__ import annotations

from sklearn.metrics import mean_absolute_error, r2_score

from data.synthetic_generator import generate_synthetic_fir_dataset
from features.feature_engineering import build_risk_features
from registry.model_registry import registry
from risk.risk_predictor import FEATURE_COLUMNS, RiskPredictor


def main() -> None:
    predictor = RiskPredictor.load_latest()
    eval_df = generate_synthetic_fir_dataset(n_records=1000, seed=999)
    featured = build_risk_features(eval_df)

    target = predictor._prepare_target(featured) if hasattr(predictor, "_prepare_target") else None
    if target is None:
        # load_latest() only restores the model, not the label logic instance — rebuild it
        target_predictor = RiskPredictor()
        target = target_predictor._prepare_target(featured)

    X = featured[FEATURE_COLUMNS].fillna(0)
    preds = predictor.model.predict(X)

    print("Held-out MAE:", round(float(mean_absolute_error(target, preds)), 3))
    print("Held-out R2:", round(float(r2_score(target, preds)), 3))
    print("\nTraining-time metrics (from registry):", registry.get_metrics("risk_predictor"))


if __name__ == "__main__":
    main()
