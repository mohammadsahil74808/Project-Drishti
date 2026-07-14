import uuid
from datetime import datetime, timezone

def generate_unique_string(prefix: str = "") -> str:
    return f"{prefix}{uuid.uuid4().hex[:8]}"

def generate_fir_no() -> str:
    return f"KA-{datetime.now(timezone.utc).year}-{uuid.uuid4().hex[:6].upper()}"

def generate_badge_no() -> str:
    return f"KSP-{uuid.uuid4().hex[:6].upper()}"

def current_utc_iso() -> str:
    return datetime.now(timezone.utc).isoformat()
