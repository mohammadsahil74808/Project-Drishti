"""
SentinelX AI — Security unit tests (no DB required).
"""
import pytest

from app.core.security import (
    TokenError,
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)


def test_password_hash_and_verify_roundtrip():
    hashed = hash_password("correct-horse-battery-staple")
    assert hashed != "correct-horse-battery-staple"
    assert verify_password("correct-horse-battery-staple", hashed)
    assert not verify_password("wrong-password", hashed)


def test_access_token_roundtrip():
    token = create_access_token(user_id="11111111-1111-1111-1111-111111111111", role="sho")
    payload = decode_token(token, expected_type="access")
    assert payload["sub"] == "11111111-1111-1111-1111-111111111111"
    assert payload["role"] == "sho"
    assert payload["type"] == "access"


def test_refresh_token_roundtrip():
    token = create_refresh_token(user_id="22222222-2222-2222-2222-222222222222")
    payload = decode_token(token, expected_type="refresh")
    assert payload["sub"] == "22222222-2222-2222-2222-222222222222"
    assert payload["type"] == "refresh"


def test_decode_rejects_wrong_token_type():
    access = create_access_token(user_id="u1", role="analyst")
    with pytest.raises(TokenError):
        decode_token(access, expected_type="refresh")


def test_decode_rejects_garbage_token():
    with pytest.raises(TokenError):
        decode_token("not-a-real-jwt", expected_type="access")
