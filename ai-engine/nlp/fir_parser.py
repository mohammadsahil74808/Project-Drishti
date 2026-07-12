"""
SentinelX AI — FIR NLP Parser

Extracts structured fields (crime type, location, time, suspects,
vehicles, weapons) from raw FIR narrative text (`mo_description`).

Design: deterministic rule/regex/gazetteer-based extraction as the
default path (zero model download, fully unit-testable, sub-millisecond).
If spaCy is installed with a loaded model, `SpacyEnhancer` layers proper
NER (PERSON/GPE/TIME) on top for higher recall — the rule-based path is
always the fallback, never a hard dependency.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field

from nlp.gazetteers import (
    CRIME_TYPE_KEYWORDS,
    LOCATION_MARKERS,
    SUSPECT_MARKERS,
    TIME_MARKERS,
    VEHICLE_REG_PATTERN,
    VEHICLE_TERMS,
    WEAPON_TERMS,
)

TIME_PATTERN = re.compile(
    r"\b(\d{1,2}(:\d{2})?\s?(am|pm|AM|PM))\b|\b(midnight|noon|morning|afternoon|evening|night)\b",
    re.IGNORECASE,
)


@dataclass
class ParsedFIR:
    raw_text: str
    crime_type: str | None = None
    crime_type_confidence: float = 0.0
    locations: list[str] = field(default_factory=list)
    time_mentions: list[str] = field(default_factory=list)
    suspects: list[str] = field(default_factory=list)
    vehicles: list[str] = field(default_factory=list)
    vehicle_registrations: list[str] = field(default_factory=list)
    weapons: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "crime_type": self.crime_type,
            "crime_type_confidence": self.crime_type_confidence,
            "locations": self.locations,
            "time_mentions": self.time_mentions,
            "suspects": self.suspects,
            "vehicles": self.vehicles,
            "vehicle_registrations": self.vehicle_registrations,
            "weapons": self.weapons,
        }


class FIRParser:
    """Stateless parser — safe to reuse a single instance across requests."""

    def parse(self, text: str) -> ParsedFIR:
        if not text or not text.strip():
            return ParsedFIR(raw_text=text or "")

        lowered = text.lower()
        result = ParsedFIR(raw_text=text)

        result.crime_type, result.crime_type_confidence = self._extract_crime_type(lowered)
        result.locations = self._extract_locations(text, lowered)
        result.time_mentions = self._extract_time(text)
        result.suspects = self._extract_suspects(text, lowered)
        result.vehicles = self._extract_vehicles(lowered)
        result.vehicle_registrations = self._extract_vehicle_registrations(text)
        result.weapons = self._extract_weapons(lowered)

        return result

    def parse_batch(self, texts: list[str]) -> list[ParsedFIR]:
        return [self.parse(t) for t in texts]

    # ---- individual extractors ----

    def _extract_crime_type(self, lowered: str) -> tuple[str | None, float]:
        best_type, best_hits = None, 0
        for crime_type, keywords in CRIME_TYPE_KEYWORDS.items():
            hits = sum(1 for kw in keywords if kw in lowered)
            if hits > best_hits:
                best_type, best_hits = crime_type, hits

        if best_type is None:
            return None, 0.0

        confidence = min(1.0, 0.5 + best_hits * 0.25)
        return best_type, round(confidence, 2)

    def _extract_locations(self, text: str, lowered: str) -> list[str]:
        locations: list[str] = []
        for marker in LOCATION_MARKERS:
            pattern = re.compile(
                rf"\b{re.escape(marker)}\s+((?:[A-Z][a-zA-Z]*\.?\s*){{1,4}})"
            )
            for match in pattern.finditer(text):
                candidate = match.group(1).strip().rstrip(".,;")
                if candidate and candidate not in locations:
                    locations.append(candidate)
        return locations[:5]

    def _extract_time(self, text: str) -> list[str]:
        mentions = [m.group(0) for m in TIME_PATTERN.finditer(text)]
        # de-duplicate, preserve order
        seen: set[str] = set()
        unique = []
        for m in mentions:
            key = m.lower()
            if key not in seen:
                seen.add(key)
                unique.append(m)
        return unique

    def _extract_suspects(self, text: str, lowered: str) -> list[str]:
        found = []
        for marker in SUSPECT_MARKERS:
            if marker in lowered:
                idx = lowered.find(marker)
                snippet = text[idx : idx + len(marker) + 30].split(".")[0].strip()
                if snippet and snippet not in found:
                    found.append(snippet)
        return found[:5]

    def _extract_vehicles(self, lowered: str) -> list[str]:
        return [v for v in VEHICLE_TERMS if re.search(rf"\b{re.escape(v)}\b", lowered)]

    def _extract_vehicle_registrations(self, text: str) -> list[str]:
        return list(
            dict.fromkeys(
                m.group(0).upper().replace(" ", "").replace("-", "")
                for m in VEHICLE_REG_PATTERN.finditer(text)
            )
        )

    def _extract_weapons(self, lowered: str) -> list[str]:
        return [w for w in WEAPON_TERMS if re.search(rf"\b{re.escape(w)}\b", lowered)]


class SpacyEnhancer:
    """
    Optional NER layer using spaCy, if a model is installed
    (`python -m spacy download en_core_web_sm`). Purely additive — merges
    PERSON/GPE/TIME entities into a ParsedFIR without replacing the
    rule-based extraction, so behavior degrades gracefully when spaCy or
    the model isn't available (e.g. offline / free-tier deployments).
    """

    def __init__(self, model_name: str = "en_core_web_sm"):
        self._nlp = None
        try:
            import spacy

            self._nlp = spacy.load(model_name)
        except Exception:
            self._nlp = None  # spaCy or model not installed — enhancer is a no-op

    @property
    def available(self) -> bool:
        return self._nlp is not None

    def enhance(self, parsed: ParsedFIR) -> ParsedFIR:
        if not self.available:
            return parsed

        doc = self._nlp(parsed.raw_text)
        for ent in doc.ents:
            if ent.label_ in ("GPE", "LOC", "FAC") and ent.text not in parsed.locations:
                parsed.locations.append(ent.text)
            elif ent.label_ == "PERSON" and ent.text not in parsed.suspects:
                parsed.suspects.append(ent.text)
            elif ent.label_ in ("TIME", "DATE") and ent.text not in parsed.time_mentions:
                parsed.time_mentions.append(ent.text)
        return parsed


def parse_fir_text(text: str, use_spacy: bool = False) -> dict:
    """Convenience function used by the inference API and RAG pipeline."""
    parser = FIRParser()
    result = parser.parse(text)
    if use_spacy:
        result = SpacyEnhancer().enhance(result)
    return result.to_dict()
