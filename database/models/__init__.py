"""
SentinelX AI — Database Models Package

Imports every model so Base.metadata is fully populated for Alembic
autogenerate. This models/ package mirrors sql/01_schema.sql exactly —
the two must be kept in sync; sql/ is the source of truth for raw DDL
(used for manual review/DBA runs), models/ is the source of truth for
Alembic-driven migrations.
"""
from database.models.base import Base  # noqa: F401

from database.models.role import Role  # noqa: F401
from database.models.geo import District, PoliceStation  # noqa: F401
from database.models.user import User  # noqa: F401
from database.models.crime import CrimeCategory, CrimeType  # noqa: F401
from database.models.fir import FIR  # noqa: F401
from database.models.people import Victim, Witness, Suspect  # noqa: F401
from database.models.criminal import (  # noqa: F401
    Criminal,
    CriminalNetwork,
    CriminalNetworkMember,
    CriminalNetworkEdge,
)
from database.models.vehicle import Vehicle  # noqa: F401
from database.models.missing_person import MissingPerson  # noqa: F401
from database.models.analytics import CrimeHotspot, CrimeForecast, RiskScore  # noqa: F401
from database.models.alert import Alert  # noqa: F401
from database.models.report import Report  # noqa: F401
from database.models.ai import AIPrediction, AIChatHistory, SemanticSearchEmbedding  # noqa: F401
from database.models.logs import AuditLog, ActivityLog  # noqa: F401
from database.models.notification import Notification  # noqa: F401
from database.models.evidence import Evidence, Attachment  # noqa: F401

__all__ = [
    "Base", "Role", "District", "PoliceStation", "User", "CrimeCategory", "CrimeType",
    "FIR", "Victim", "Witness", "Suspect", "Criminal", "CriminalNetwork",
    "CriminalNetworkMember", "CriminalNetworkEdge", "Vehicle", "MissingPerson",
    "CrimeHotspot", "CrimeForecast", "RiskScore", "Alert", "Report", "AIPrediction",
    "AIChatHistory", "SemanticSearchEmbedding", "AuditLog", "ActivityLog",
    "Notification", "Evidence", "Attachment",
]
