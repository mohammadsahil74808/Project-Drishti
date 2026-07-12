"""
SentinelX AI — Crime Classification

Predicts crime_type from FIR narrative text + structured features —
useful for auto-tagging FIRs where the crime_type field wasn't set
cleanly at intake, or for flagging likely mis-classifications. Uses a
TF-IDF + LightGBM pipeline (fast to train, interpretable, no GPU needed —
fits the free-tier constraint).
"""
from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report, f1_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder

from config import RANDOM_SEED, SUPPORTED_CRIME_TYPES
from registry.model_registry import registry

MODEL_NAME = "crime_classifier"


class CrimeClassifier:
    def __init__(self):
        self.vectorizer: TfidfVectorizer | None = None
        self.model = None
        self.label_encoder: LabelEncoder | None = None

    def build(self):
        import lightgbm as lgb

        self.vectorizer = TfidfVectorizer(max_features=2000, ngram_range=(1, 2), min_df=2)
        self.label_encoder = LabelEncoder()
        self.model = lgb.LGBMClassifier(
            n_estimators=200,
            max_depth=6,
            learning_rate=0.08,
            random_state=RANDOM_SEED,
            verbose=-1,
        )
        return self

    def fit(self, texts: pd.Series, labels: pd.Series) -> dict:
        if self.model is None:
            self.build()

        y = self.label_encoder.fit_transform(labels)
        X_text = texts.fillna("")
        X_train_text, X_test_text, y_train, y_test = train_test_split(
            X_text, y, test_size=0.2, random_state=RANDOM_SEED, stratify=y
        )

        X_train = self.vectorizer.fit_transform(X_train_text)
        X_test = self.vectorizer.transform(X_test_text)

        self.model.fit(X_train, y_train)
        preds = self.model.predict(X_test)

        metrics = {
            "accuracy": round(float(accuracy_score(y_test, preds)), 4),
            "f1_macro": round(float(f1_score(y_test, preds, average="macro")), 4),
        }
        self._last_report = classification_report(
            y_test, preds, target_names=self.label_encoder.classes_, zero_division=0
        )
        return metrics

    def predict(self, text: str) -> dict:
        X = self.vectorizer.transform([text or ""])
        proba = self.model.predict_proba(X)[0]
        pred_idx = int(np.argmax(proba))
        label = self.label_encoder.inverse_transform([pred_idx])[0]
        return {
            "predicted_crime_type": label,
            "confidence": round(float(proba[pred_idx]), 4),
            "all_probabilities": {
                cls: round(float(p), 4) for cls, p in zip(self.label_encoder.classes_, proba)
            },
        }

    def save(self, metrics: dict | None = None) -> str:
        bundle = {"vectorizer": self.vectorizer, "model": self.model, "label_encoder": self.label_encoder}
        return registry.register(MODEL_NAME, bundle, metrics=metrics)

    @classmethod
    def load_latest(cls) -> "CrimeClassifier":
        bundle = registry.load_latest(MODEL_NAME)
        instance = cls()
        instance.vectorizer = bundle["vectorizer"]
        instance.model = bundle["model"]
        instance.label_encoder = bundle["label_encoder"]
        return instance


def classify_crime_text(text: str) -> dict:
    """Convenience function used by the inference API."""
    classifier = CrimeClassifier.load_latest()
    return classifier.predict(text)
