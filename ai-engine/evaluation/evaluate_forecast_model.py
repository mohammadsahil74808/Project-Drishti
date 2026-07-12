"""
SentinelX AI — Evaluation Script: Crime Forecaster (backtest MAPE)

Walk-forward backtest: for each of the last N weeks, train on data up to
that point and measure MAPE against the following week's actual count —
matches the "Backtest Error (MAPE)" panel in the Forecast frontend page.

Usage: python -m evaluation.evaluate_forecast_model
"""
from __future__ import annotations

import numpy as np
import pandas as pd

from data.synthetic_generator import generate_synthetic_fir_dataset
from forecasting.forecaster import CrimeForecaster, _daily_counts


def _mape(actual: np.ndarray, predicted: np.ndarray) -> float:
    mask = actual != 0
    if not mask.any():
        return 0.0
    return float(np.mean(np.abs((actual[mask] - predicted[mask]) / actual[mask])) * 100)


def main(n_backtest_weeks: int = 4) -> None:
    df = generate_synthetic_fir_dataset(n_records=6000)
    district = df["district"].value_counts().idxmax()
    district_df = df[df["district"] == district]

    daily = _daily_counts(district_df)
    daily = daily.sort_values("date").reset_index(drop=True)

    results = []
    for week_idx in range(n_backtest_weeks, 0, -1):
        cutoff = len(daily) - week_idx * 7
        if cutoff < 30:
            continue

        train_slice = daily.iloc[:cutoff]
        actual_next_week = daily.iloc[cutoff : cutoff + 7]["count"].to_numpy()
        if len(actual_next_week) == 0:
            continue

        train_df = district_df[
            district_df["incident_datetime"].isin(
                pd.to_datetime(train_slice["date"]).astype(str).tolist()
            )
        ]
        # Simpler: refit directly on the truncated daily series via a minimal synthetic frame
        synthetic_events = train_slice.loc[train_slice.index.repeat(train_slice["count"].clip(lower=1))]
        synthetic_events = synthetic_events.assign(incident_datetime=synthetic_events["date"])

        forecaster = CrimeForecaster()
        forecaster.fit(synthetic_events, dt_col="incident_datetime")
        preds = forecaster.predict(horizon_days=7)
        predicted = np.array([p["predicted_count"] for p in preds])

        mape = _mape(actual_next_week, predicted)
        results.append({"week": f"Wk-{week_idx}", "mape_percent": round(mape, 2)})
        print(f"Week -{week_idx}: MAPE = {mape:.2f}%")

    if results:
        avg_mape = round(sum(r["mape_percent"] for r in results) / len(results), 2)
        print(f"\nAverage backtest MAPE across {len(results)} weeks: {avg_mape}%")
    else:
        print("Not enough historical data for a backtest.")


if __name__ == "__main__":
    main()
