"""SentinelX AI — Unit tests for registry/model_registry.py."""
import tempfile
from pathlib import Path

import pytest

from registry.model_registry import ModelRegistry


@pytest.fixture()
def temp_registry():
    with tempfile.TemporaryDirectory() as tmp:
        yield ModelRegistry(registry_dir=Path(tmp))


def test_register_and_load_latest(temp_registry):
    version = temp_registry.register("dummy_model", {"weights": [1, 2, 3]}, metrics={"acc": 0.9})
    assert version

    loaded = temp_registry.load_latest("dummy_model")
    assert loaded == {"weights": [1, 2, 3]}


def test_multiple_versions_latest_wins(temp_registry):
    temp_registry.register("dummy_model", {"v": 1})
    v2 = temp_registry.register("dummy_model", {"v": 2})

    loaded = temp_registry.load_latest("dummy_model")
    assert loaded == {"v": 2}
    assert temp_registry.list_models()["dummy_model"]["latest"] == v2


def test_load_nonexistent_model_raises(temp_registry):
    with pytest.raises(FileNotFoundError):
        temp_registry.load_latest("does_not_exist")


def test_get_metrics_returns_dict(temp_registry):
    temp_registry.register("dummy_model", {"v": 1}, metrics={"mae": 1.23})
    metrics = temp_registry.get_metrics("dummy_model")
    assert metrics == {"mae": 1.23}


def test_get_metrics_missing_model_returns_empty_dict(temp_registry):
    assert temp_registry.get_metrics("nope") == {}
