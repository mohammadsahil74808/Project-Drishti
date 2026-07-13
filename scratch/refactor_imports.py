import os
import re

BACKEND_DIR = r"c:\Users\Ayan\OneDrive\Desktop\Project Drishti\backend\app"

MAPPING = {
    r"from app\.models\.user import (.*)": r"from database.models.user import \1",
    r"from app\.models\.geo import (.*)": r"from database.models.geo import \1",
    r"from app\.models\.fir import (.*)": r"from database.models.fir import \1",
    r"from app\.models\.suspect import (.*)": r"from database.models.people import Suspect\nfrom database.models.criminal import CriminalNetworkEdge", # approx
    r"from app\.models\.missing_person import (.*)": r"from database.models.missing_person import \1",
    r"from app\.models\.vehicle import (.*)": r"from database.models.vehicle import \1",
    r"from app\.models\.forecast import (.*)": r"from database.models.analytics import CrimeForecast",
    r"from app\.models\.risk import (.*)": r"from database.models.analytics import RiskScore, RiskEntityType",
    r"from app\.models\.hotspot import (.*)": r"from database.models.analytics import CrimeHotspot as Hotspot, HotspotSeverity",
    r"from app\.models\.alert import (.*)": r"from database.models.alert import \1",
    r"from app\.models\.audit_log import (.*)": r"from database.models.logs import AuditLog",
    r"from app\.models\.report import (.*)": r"from database.models.report import \1",
    r"app\.models": r"database.models",
    r"\bFIRRecord\b": "FIR",
    r"\bStation\b": "PoliceStation"
}

def process_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    new_content = content
    for pattern, replacement in MAPPING.items():
        new_content = re.sub(pattern, replacement, new_content)
    
    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk(BACKEND_DIR):
    if "models" in root: # Skip the old models folder itself
        continue
    for file in files:
        if file.endswith(".py"):
            process_file(os.path.join(root, file))

# Also fix env.py
env_py = r"c:\Users\Ayan\OneDrive\Desktop\Project Drishti\backend\app\db\migrations\env.py"
with open(env_py, "r", encoding="utf-8") as f:
    content = f.read()
new_content = content.replace("from app.models import Base", "from database.models import Base")
with open(env_py, "w", encoding="utf-8") as f:
    f.write(new_content)
print("Updated env.py")
