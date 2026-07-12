"""SentinelX AI — Unit tests for nlp/fir_parser.py (no models/DB required)."""
from nlp.fir_parser import parse_fir_text


def test_extracts_chain_snatching_crime_type():
    text = "Two men on a motorcycle snatched a gold chain near MG Road at 9pm."
    result = parse_fir_text(text)
    assert result["crime_type"] == "chain_snatching"
    assert result["crime_type_confidence"] > 0


def test_extracts_vehicle_and_registration():
    text = "The complainant's motorcycle KA05MN1234 was stolen from outside their residence."
    result = parse_fir_text(text)
    assert "motorcycle" in result["vehicles"]
    assert "KA05MN1234" in result["vehicle_registrations"]


def test_extracts_weapon_including_compound_terms():
    text = "The complainant was robbed at knifepoint near the bus stand."
    result = parse_fir_text(text)
    assert "knifepoint" in result["weapons"]


def test_extracts_location_after_marker():
    text = "The incident occurred near MG Road around midnight."
    result = parse_fir_text(text)
    assert any("MG Road" in loc for loc in result["locations"])


def test_extracts_time_mentions():
    text = "The theft was reported at around 9:30 PM last night."
    result = parse_fir_text(text)
    assert any("9:30" in t or "PM" in t.upper() for t in result["time_mentions"])


def test_empty_text_returns_empty_result():
    result = parse_fir_text("")
    assert result["crime_type"] is None
    assert result["locations"] == []


def test_unrelated_text_has_no_crime_type():
    result = parse_fir_text("The weather today is pleasant with light rain expected.")
    assert result["crime_type"] is None
