"""
SentinelX AI — AI Engine Configuration

Standalone config for the ai-engine module. Deliberately independent of
backend/app/core/config.py — this module is designed to run either as a
library imported by the backend or as its own inference microservice
(see api/inference_api.py), so it must not import from backend/.
"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

MODEL_REGISTRY_DIR = Path(os.getenv("AI_MODEL_REGISTRY_DIR", BASE_DIR / "models_store"))
MODEL_REGISTRY_DIR.mkdir(parents=True, exist_ok=True)

FAISS_INDEX_PATH = MODEL_REGISTRY_DIR / "faiss_index.bin"
FAISS_METADATA_PATH = MODEL_REGISTRY_DIR / "faiss_metadata.json"

EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "paraphrase-multilingual-MiniLM-L12-v2")
EMBEDDING_DIM = 384

RANDOM_SEED = 42

SUPPORTED_CRIME_TYPES = [
    "theft", "chain_snatching", "burglary", "assault", "vehicle_theft",
    "cybercrime", "missing_person", "robbery", "other",
]

KARNATAKA_DISTRICTS = [
    "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Mangaluru", "Hubballi-Dharwad",
    "Belagavi", "Kalaburagi", "Ballari", "Tumakuru", "Shivamogga", "Davanagere",
    "Vijayapura", "Udupi", "Chikkamagaluru", "Hassan",
]

INFERENCE_API_HOST = os.getenv("AI_ENGINE_HOST", "0.0.0.0")
INFERENCE_API_PORT = int(os.getenv("AI_ENGINE_PORT", "8500"))
