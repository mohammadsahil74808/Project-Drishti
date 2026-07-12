"""
SentinelX AI — Explainable AI (SHAP)

Thin wrapper around SHAP's TreeExplainer (works directly with
LightGBM/XGBoost, no surrogate model needed) — used by risk_predictor.py
and crime_classifier.py to turn a raw prediction into a ranked list of
feature contributions for the frontend's "Explain" panel.
"""
from __future__ import annotations

import numpy as np
import pandas as pd


class SHAPExplainer:
    def __init__(self, model, feature_names: list[str]):
        self.model = model
        self.feature_names = feature_names
        self._explainer = None

    def _get_explainer(self):
        import shap

        if self._explainer is None:
            self._explainer = shap.TreeExplainer(self.model)
        return self._explainer

    def explain_instance(self, X_row: pd.DataFrame | np.ndarray, top_k: int = 5) -> list[dict]:
        """Returns the top_k features by |SHAP value| for a single-row input."""
        explainer = self._get_explainer()
        shap_values = explainer.shap_values(X_row)

        # Binary/regression models return a single array; multiclass returns a list per class
        values = shap_values[1] if isinstance(shap_values, list) else shap_values
        values = np.asarray(values).reshape(-1)

        row_values = X_row.iloc[0].to_numpy() if hasattr(X_row, "iloc") else np.asarray(X_row[0])

        contributions = [
            {
                "feature": self.feature_names[i],
                "contribution": round(float(values[i]), 4),
                "value": (
                    round(float(row_values[i]), 3)
                    if isinstance(row_values[i], (int, float, np.floating))
                    else str(row_values[i])
                ),
            }
            for i in range(len(self.feature_names))
        ]
        contributions.sort(key=lambda c: abs(c["contribution"]), reverse=True)
        return contributions[:top_k]

    def global_importance(self, X: pd.DataFrame, top_k: int = 10) -> list[dict]:
        """Mean |SHAP value| per feature across a batch — for a model-level importance view."""
        explainer = self._get_explainer()
        shap_values = explainer.shap_values(X)
        values = shap_values[1] if isinstance(shap_values, list) else shap_values
        mean_abs = np.abs(np.asarray(values)).mean(axis=0)

        ranked = sorted(
            zip(self.feature_names, mean_abs), key=lambda pair: pair[1], reverse=True
        )[:top_k]
        return [{"feature": name, "mean_abs_shap": round(float(val), 4)} for name, val in ranked]
