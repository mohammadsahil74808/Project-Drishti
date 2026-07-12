"""
SentinelX AI — NLP Gazetteers

Keyword/pattern lookup tables used by fir_parser.py. Kept as plain data
structures (not a trained model) so extraction is deterministic, fast,
and requires no model download — swap/extend `WEAPON_TERMS`,
`VEHICLE_TERMS`, etc. as real FIR vocabulary is observed.
"""
import re

CRIME_TYPE_KEYWORDS: dict[str, list[str]] = {
    "chain_snatching": [
        "chain snatch", "chain-snatch", "neck chain", "gold chain snatched",
        "snatched a gold chain", "snatched the chain", "chain was snatched",
        "snatched her chain", "snatched his chain",
    ],
    "theft": ["theft", "stolen", "stole", "pickpocket", "burgled wallet", "mobile snatched"],
    "burglary": ["burglary", "house break", "broke into", "forced entry", "housebreaking"],
    "assault": ["assault", "attacked", "beaten", "assaulted", "physical altercation"],
    "vehicle_theft": ["vehicle theft", "bike stolen", "car stolen", "two-wheeler stolen", "vehicle stolen"],
    "cybercrime": ["cyber", "online fraud", "phishing", "otp fraud", "upi fraud", "hacked"],
    "missing_person": ["missing", "went missing", "not returned home", "untraceable"],
    "robbery": ["robbery", "robbed", "armed robbery", "looted", "held at knifepoint", "held at gunpoint"],
}

WEAPON_TERMS: list[str] = [
    "knife", "blade", "gun", "pistol", "revolver", "country-made pistol", "sickle",
    "iron rod", "rod", "sword", "chopper", "axe", "chain", "knifepoint", "gunpoint",
]

VEHICLE_TERMS: list[str] = [
    "two-wheeler", "motorcycle", "bike", "scooter", "car", "auto", "auto-rickshaw",
    "van", "truck", "lorry", "bicycle", "four-wheeler",
]

VEHICLE_REG_PATTERN = re.compile(r"\bKA[\s-]?\d{2}[\s-]?[A-Z]{1,2}[\s-]?\d{4}\b", re.IGNORECASE)

LOCATION_MARKERS: list[str] = [
    "near", "at", "opposite", "behind", "outside", "in front of", "close to", "beside",
]

TIME_MARKERS: list[str] = [
    "am", "pm", "morning", "afternoon", "evening", "night", "midnight", "noon",
    "today", "yesterday", "last night",
]

SUSPECT_MARKERS: list[str] = [
    "unidentified", "unknown person", "unknown persons", "suspect", "accused",
    "two men", "three men", "a man", "a woman", "two persons", "group of",
]
