"""
SentinelX AI — Crime Risk Prediction

Zone-level risk score (0-100) from an XGBoost regressor trained on
temporal + rolling-density features (features/feature_engineering.py's
build_risk_features). Every prediction is paired with a SHAP explanation
via shap_explainer.py — this is the pipeline backend/app/services/
risk_service.py's real-model path reads from once wired in.
"""
from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split

from config import RANDOM_SEED
from features.feature_engineering import build_risk_features
from registry.model_registry import registry
from risk.shap_explainer import SHAPExplainer

MODEL_NAME = "risk_predictor"

FEATURE_COLUMNS = [
    "hour", "day_of_week", "is_weekend", "month", "is_festival_month",
    "is_night", "trailing_7d_count", "trailing_30d_count", "is_severe_crime",
]


class RiskPredictor:
    def __init__(self):
        self.model = None

    def build(self):
        import xgboost as xgb

        self.model = xgb.XGBRegressor(
            n_estimators=250,
            max_depth=5,
            learning_rate=0.06,
            subsample=0.85,
            colsample_bytree=0.85,
            random_state=RANDOM_SEED,
        )
        return self

    def _prepare_target(self, df: pd.DataFrame) -> pd.Series:
        """
        Synthetic risk label: normalized combination of severity + local
        density, scaled 0-100. Swap for a real outcome-based label (e.g.
        actual next-30-day incident count per zone) once historical
        ground truth is available.
        """
        density_score = (df["trailing_30d_count"] / (df["trailing_30d_count"].max() or 1)) * 70
        severity_score = df["is_severe_crime"] * 20
        night_score = df["is_night"] * 10
        return (density_score + severity_score + night_score).clip(0, 100)

    def fit(self, df: pd.DataFrame) -> dict:
        if self.model is None:
            self.build()

        featured = build_risk_features(df)
        y = self._prepare_target(featured)
        X = featured[FEATURE_COLUMNS].fillna(0)

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=RANDOM_SEED)
        self.model.fit(X_train, y_train)
        preds = self.model.predict(X_test)

        return {
            "mae": round(float(mean_absolute_error(y_test, preds)), 3),
            "r2": round(float(r2_score(y_test, preds)), 3),
        }

    def predict(self, feature_row: dict, explain: bool = True) -> dict:
        X = pd.DataFrame([feature_row])[FEATURE_COLUMNS].fillna(0)
        score = float(self.model.predict(X)[0])
        score = max(0.0, min(100.0, score))

        result = {"score": round(score, 1), "severity": self._severity_for(score)}

        if explain:
            explainer = SHAPExplainer(self.model, FEATURE_COLUMNS)
            result["shap_explanation"] = explainer.explain_instance(X)

        return result

    @staticmethod
    def _severity_for(score: float) -> str:
        if score >= 75:
            return "critical"
        if score >= 50:
            return "high"
        if score >= 30:
            return "medium"
        return "low"

    def save(self, metrics: dict | None = None) -> str:
        return registry.register(MODEL_NAME, self.model, metrics=metrics)

    @classmethod
    def load_latest(cls) -> "RiskPredictor":
        instance = cls()
        instance.model = registry.load_latest(MODEL_NAME)
        return instance


def predict_zone_risk(feature_row: dict) -> dict:
    """Convenience function for the inference API."""
    predictor = RiskPredictor.load_latest()
    return predictor.predict(feature_row)
