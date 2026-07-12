"""
SentinelX AI — Models Package

Imports every model so `Base.metadata` is fully populated for Alembic
autogenerate and for `Base.metadata.create_all()` in tests. Import this
module (or anything under app.models) before running migrations.
"""

from app.db.base import Base  # noqa: F401

from app.models.user import User, UserRole  # noqa: F401
from app.models.geo import District, Station  # noqa: F401
from app.models.fir import FIRRecord, CrimeType, CaseStatus  # noqa: F401
from app.models.suspect import Suspect, CriminalNetworkEdge  # noqa: F401
from app.models.missing_person import MissingPerson, MissingPersonStatus  # noqa: F401
from app.models.vehicle import VehicleCrimeRecord, VehicleCrimeStatus  # noqa: F401
from app.models.forecast import CrimeForecast  # noqa: F401
from app.models.risk import RiskScore, RiskEntityType  # noqa: F401
from app.models.hotspot import Hotspot, HotspotSeverity  # noqa: F401
from app.models.alert import Alert, AlertType  # noqa: F401
from app.models.audit_log import AuditLog  # noqa: F401
from app.models.report import Report, ReportType, ReportStatus  # noqa: F401

__all__ = [
    "Base",
    "User",
    "UserRole",
    "District",
    "Station",
    "FIRRecord",
    "CrimeType",
    "CaseStatus",
    "Suspect",
    "CriminalNetworkEdge",
    "MissingPerson",
    "MissingPersonStatus",
    "VehicleCrimeRecord",
    "VehicleCrimeStatus",
    "CrimeForecast",
    "RiskScore",
    "RiskEntityType",
    "Hotspot",
    "HotspotSeverity",
    "Alert",
    "AlertType",
    "AuditLog",
    "Report",
    "ReportType",
    "ReportStatus",
]
