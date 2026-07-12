"""
SentinelX AI — Model Registry

Lightweight filesystem-based model registry (joblib artifacts + a JSON
manifest per model name) — no external MLflow/S3 dependency needed to
stay on the free tier. Each `register()` call versions the artifact by
timestamp and updates a `latest` pointer in the manifest, so inference
code always loads via `load_latest(name)` without knowing version numbers.
"""
from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any

import joblib

from config import MODEL_REGISTRY_DIR

MANIFEST_PATH = MODEL_REGISTRY_DIR / "manifest.json"


class ModelRegistry:
    def __init__(self, registry_dir: Path = MODEL_REGISTRY_DIR):
        self.registry_dir = Path(registry_dir)
        self.registry_dir.mkdir(parents=True, exist_ok=True)
        self.manifest_path = self.registry_dir / "manifest.json"
        if not self.manifest_path.exists():
            self.manifest_path.write_text(json.dumps({}))

    def _read_manifest(self) -> dict:
        return json.loads(self.manifest_path.read_text())

    def _write_manifest(self, manifest: dict) -> None:
        self.manifest_path.write_text(json.dumps(manifest, indent=2, default=str))

    def register(self, name: str, model: Any, metrics: dict | None = None, metadata: dict | None = None) -> str:
        """Saves `model` via joblib and records it as the new latest version for `name`."""
        version = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        filename = f"{name}__{version}.joblib"
        filepath = self.registry_dir / filename
        joblib.dump(model, filepath)

        manifest = self._read_manifest()
        entry = manifest.setdefault(name, {"versions": []})
        entry["versions"].append(
            {
                "version": version,
                "file": filename,
                "metrics": metrics or {},
                "metadata": metadata or {},
                "registered_at": datetime.utcnow().isoformat(),
            }
        )
        entry["latest"] = version
        self._write_manifest(manifest)
        return version

    def load_latest(self, name: str) -> Any:
        manifest = self._read_manifest()
        if name not in manifest or "latest" not in manifest[name]:
            raise FileNotFoundError(f"No registered model found for '{name}'.")
        latest_version = manifest[name]["latest"]
        return self.load_version(name, latest_version)

    def load_version(self, name: str, version: str) -> Any:
        manifest = self._read_manifest()
        entry = manifest.get(name)
        if not entry:
            raise FileNotFoundError(f"No registered model found for '{name}'.")
        version_entry = next((v for v in entry["versions"] if v["version"] == version), None)
        if not version_entry:
            raise FileNotFoundError(f"Version '{version}' not found for model '{name}'.")
        filepath = self.registry_dir / version_entry["file"]
        return joblib.load(filepath)

    def get_metrics(self, name: str, version: str | None = None) -> dict:
        manifest = self._read_manifest()
        entry = manifest.get(name)
        if not entry:
            return {}
        version = version or entry.get("latest")
        version_entry = next((v for v in entry["versions"] if v["version"] == version), None)
        return version_entry["metrics"] if version_entry else {}

    def list_models(self) -> dict:
        return self._read_manifest()


registry = ModelRegistry()
