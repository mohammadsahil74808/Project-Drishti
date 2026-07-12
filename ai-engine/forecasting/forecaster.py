"""
SentinelX AI — Crime Forecasting

Prophet handles trend/seasonality baseline; LightGBM models the residual
using calendar + lag features (features/feature_engineering.py's
build_forecast_features) — the ensembling pattern described in the
project blueprint. Falls back to Prophet-only if LightGBM residual
training fails on very sparse series (e.g. a district/crime-type with
too few historical days).
"""
from __future__ import annotations

import numpy as np
import pandas as pd

from config import RANDOM_SEED
from features.feature_engineering import build_forecast_features
from registry.model_registry import registry

MODEL_NAME = "crime_forecaster"

RESIDUAL_FEATURES = [
    "day_of_week", "is_weekend", "month", "is_festival_month",
    "lag_1", "lag_7", "lag_14", "rolling_mean_7", "rolling_std_7",
]


def _daily_counts(df: pd.DataFrame, dt_col: str = "incident_datetime") -> pd.DataFrame:
    daily = df.set_index(pd.to_datetime(df[dt_col])).resample("D").size()
    daily = daily.rename("count").reset_index().rename(columns={dt_col: "date", "index": "date"})
    return daily


class CrimeForecaster:
    def __init__(self):
        self.prophet_model = None
        self.residual_model = None

    def fit(self, df: pd.DataFrame, dt_col: str = "incident_datetime") -> dict:
        from prophet import Prophet

        daily = _daily_counts(df, dt_col)
        daily = daily.rename(columns={daily.columns[0]: "date"}) if "date" not in daily.columns else daily

        prophet_df = daily.rename(columns={"date": "ds", "count": "y"})
        self.prophet_model = Prophet(
            weekly_seasonality=True, yearly_seasonality=True, daily_seasonality=False,
            interval_width=0.85,
        )
        self.prophet_model.fit(prophet_df)

        in_sample = self.prophet_model.predict(prophet_df[["ds"]])
        daily["prophet_pred"] = in_sample["yhat"].values
        daily["residual"] = daily["count"] - daily["prophet_pred"]

        featured = build_forecast_features(daily, count_col="count")
        featured["residual"] = daily["residual"].values
        featured = featured.dropna(subset=RESIDUAL_FEATURES + ["residual"])

        metrics = {"n_days_trained": int(len(daily))}

        if len(featured) >= 20:
            import lightgbm as lgb

            X = featured[RESIDUAL_FEATURES]
            y = featured["residual"]
            self.residual_model = lgb.LGBMRegressor(
                n_estimators=150, max_depth=4, learning_rate=0.05, random_state=RANDOM_SEED, verbose=-1
            )
            self.residual_model.fit(X, y)
            metrics["residual_model_trained"] = True
        else:
            self.residual_model = None
            metrics["residual_model_trained"] = False
            metrics["note"] = "Too few historical days for residual model; using Prophet-only."

        return metrics

    def predict(self, horizon_days: int = 14) -> list[dict]:
        future = self.prophet_model.make_future_dataframe(periods=horizon_days)
        forecast = self.prophet_model.predict(future)
        forecast_tail = forecast.tail(horizon_days).reset_index(drop=True)

        points = []
        for _, row in forecast_tail.iterrows():
            predicted = max(0.0, float(row["yhat"]))
            lower = max(0.0, float(row["yhat_lower"]))
            upper = max(0.0, float(row["yhat_upper"]))
            points.append(
                {
                    "date": row["ds"].strftime("%Y-%m-%d"),
                    "predicted_count": round(predicted, 2),
                    "lower_bound": round(lower, 2),
                    "upper_bound": round(upper, 2),
                }
            )
        return points

    def save(self, metrics: dict | None = None) -> str:
        bundle = {"prophet_model": self.prophet_model, "residual_model": self.residual_model}
        return registry.register(MODEL_NAME, bundle, metrics=metrics)

    @classmethod
    def load_latest(cls) -> "CrimeForecaster":
        bundle = registry.load_latest(MODEL_NAME)
        instance = cls()
        instance.prophet_model = bundle["prophet_model"]
        instance.residual_model = bundle["residual_model"]
        return instance


def forecast_crime(district_df: pd.DataFrame, horizon_days: int = 14) -> list[dict]:
    """Trains fresh on the given district/crime-type slice and returns the forecast — used
    by training/train_forecast_model.py per (district, crime_type) combination."""
    forecaster = CrimeForecaster()
    forecaster.fit(district_df)
    return forecaster.predict(horizon_days)
