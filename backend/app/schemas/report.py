"""SentinelX AI — Report generation schemas."""
import uuid
from datetime import datetime

from pydantic import BaseModel

from database.models.report import ReportStatus, ReportType
from app.schemas.common import ORMBase


class ReportGenerateRequest(BaseModel):
    type: ReportType
    district_id: uuid.UUID | None = None
    date_from: datetime | None = None
    date_to: datetime | None = None


class ReportResponse(ORMBase):
    id: uuid.UUID
    type: ReportType
    title: str
    status: ReportStatus
    file_path: str | None
    created_at: datetime