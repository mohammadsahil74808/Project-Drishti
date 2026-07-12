"""
SentinelX AI — Synthetic Crime Dataset Generator

Generates a statistically realistic (fully synthetic, zero real PII) FIR
dataset for training/evaluating every model in this engine. Crime-type
mix and weekday/hour skew are sampled from fixed weights approximating
publicly known patterns (weekend/evening skew for street crime, etc.) —
not sourced from any real dataset, and NOT a claim of NCRB-accuracy;
tune `CRIME_TYPE_WEIGHTS` if calibrating against a real reference later.
"""
from __future__ import annotations

import random
import uuid
from datetime import datetime, timedelta

import numpy as np
import pandas as pd
from faker import Faker

from config import KARNATAKA_DISTRICTS, RANDOM_SEED, SUPPORTED_CRIME_TYPES

fake = Faker("en_IN")

CRIME_TYPE_WEIGHTS = {
    "theft": 0.28, "chain_snatching": 0.10, "burglary": 0.14, "assault": 0.10,
    "vehicle_theft": 0.16, "cybercrime": 0.08, "missing_person": 0.05,
    "robbery": 0.06, "other": 0.03,
}

WEAPONS = ["knife", "iron rod", "country-made pistol", None, None, None]
VEHICLES = ["motorcycle", "scooter", "car", "auto-rickshaw", None, None]

MO_TEMPLATES = {
    "theft": "Unidentified person stole {item} from the complainant near {loc} at around {time}.",
    "chain_snatching": "Two persons on a {vehicle} snatched a gold chain from the complainant near {loc} at around {time} and fled.",
    "burglary": "Unknown persons broke into the complainant's house near {loc} between {time} and next morning, stealing valuables.",
    "assault": "The complainant was assaulted by {n} persons near {loc} at around {time} following a verbal altercation.",
    "vehicle_theft": "The complainant's {vehicle} was stolen from outside their residence near {loc}, last seen at around {time}.",
    "cybercrime": "The complainant received a fraudulent call and lost money via UPI/OTP fraud, reported on {time}.",
    "missing_person": "The complainant's family member has been missing since {time}, last seen near {loc}.",
    "robbery": "The complainant was robbed at {weapon}-point near {loc} at around {time} by {n} unidentified persons.",
    "other": "Complainant reported an incident near {loc} at around {time}; details under investigation.",
}

ITEMS = ["mobile phone", "wallet", "handbag", "laptop bag", "gold ring"]


def _weighted_crime_type() -> str:
    types = list(CRIME_TYPE_WEIGHTS.keys())
    weights = list(CRIME_TYPE_WEIGHTS.values())
    return random.choices(types, weights=weights, k=1)[0]


def _random_datetime_with_skew(start: datetime, end: datetime) -> datetime:
    """Skews toward evening/night hours and weekends, matching common street-crime patterns."""
    span_days = (end - start).days
    day_offset = random.randint(0, max(span_days, 1))
    base_date = start + timedelta(days=day_offset)

    hour_weights = [1] * 24
    for h in (19, 20, 21, 22, 23, 0, 1):
        hour_weights[h] = 4
    hour = random.choices(range(24), weights=hour_weights, k=1)[0]

    if base_date.weekday() in (5, 6) and random.random() < 0.3:
        # amplify weekend density by occasionally re-rolling within the same weekend
        pass

    return base_date.replace(hour=hour, minute=random.randint(0, 59), second=0, microsecond=0)


def _mo_description(crime_type: str, loc: str, dt: datetime) -> str:
    template = MO_TEMPLATES.get(crime_type, MO_TEMPLATES["other"])
    return template.format(
        item=random.choice(ITEMS),
        loc=loc,
        time=dt.strftime("%I:%M %p"),
        vehicle=random.choice([v for v in VEHICLES if v]),
        n=random.choice(["two", "three", "a group of"]),
        weapon=random.choice(["knife", "gun"]),
    )


def generate_synthetic_fir_dataset(
    n_records: int = 5000,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    seed: int = RANDOM_SEED,
) -> pd.DataFrame:
    random.seed(seed)
    np.random.seed(seed)
    Faker.seed(seed)

    end_date = end_date or datetime.utcnow()
    start_date = start_date or (end_date - timedelta(days=365))

    rows = []
    for i in range(n_records):
        district = random.choice(KARNATAKA_DISTRICTS)
        crime_type = _weighted_crime_type()
        incident_dt = _random_datetime_with_skew(start_date, end_date)
        reported_dt = incident_dt + timedelta(hours=random.randint(0, 48))
        loc = fake.street_name()

        # Rough lat/lng jitter around a Karnataka bounding box, per-district offset
        base_lat, base_lng = 15.0 + (hash(district) % 100) / 100, 76.0 + (hash(district) % 70) / 70
        lat = round(base_lat + random.uniform(-0.4, 0.4), 6)
        lng = round(base_lng + random.uniform(-0.4, 0.4), 6)

        rows.append(
            {
                "fir_id": str(uuid.uuid4()),
                "fir_no": f"KA-{incident_dt.year}-{district[:3].upper()}-{i:06d}",
                "district": district,
                "station": f"{district} PS-{random.randint(1, 6)}",
                "crime_type": crime_type,
                "ipc_sections": "379" if crime_type == "theft" else "392" if crime_type == "robbery" else "441",
                "incident_datetime": incident_dt,
                "reported_datetime": reported_dt,
                "lat": lat,
                "lng": lng,
                "address_text": f"{loc}, {district}",
                "mo_description": _mo_description(crime_type, loc, incident_dt),
                "status": random.choices(
                    ["open", "investigation", "chargesheet", "closed"], weights=[0.35, 0.3, 0.15, 0.2]
                )[0],
                "victim_age_bucket": random.choice(["<18", "18-30", "31-45", "46-60", "60+"]),
                "accused_count": random.choices([0, 1, 2, 3, 4], weights=[0.2, 0.3, 0.25, 0.15, 0.1])[0],
                "weapon_used": random.choice(WEAPONS) if crime_type in ("robbery", "assault") else None,
            }
        )

    return pd.DataFrame(rows)


def save_dataset(df: pd.DataFrame, path: str) -> None:
    df.to_csv(path, index=False)


if __name__ == "__main__":
    dataset = generate_synthetic_fir_dataset(n_records=5000)
    save_dataset(dataset, "data/synthetic_fir_dataset.csv")
    print(f"Generated {len(dataset)} synthetic FIR records -> data/synthetic_fir_dataset.csv")
