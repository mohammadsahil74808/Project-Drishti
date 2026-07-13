"""
SentinelX AI — Report Service
"""
import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from database.models.report import Report, ReportStatus
from app.schemas.report import ReportGenerateRequest


class ReportNotFoundError(Exception):
    pass


_TYPE_TITLES = {
    "weekly": "Weekly District Summary",
    "hotspot": "Hotspot Assessment",
    "case": "Case File Report",
}


def list_reports(db: Session, requested_by: uuid.UUID | None = None) -> list[Report]:
    stmt = select(Report).order_by(Report.created_at.desc())
    if requested_by:
        stmt = stmt.where(Report.requested_by == requested_by)
    return list(db.scalars(stmt))


def get_report(db: Session, report_id: uuid.UUID) -> Report:
    report = db.get(Report, report_id)
    if report is None:
        raise ReportNotFoundError(f"Report {report_id} not found.")
    return report


def request_report(db: Session, payload: ReportGenerateRequest, requested_by: uuid.UUID) -> Report:
    title = _TYPE_TITLES.get(payload.type.value, "Report")
    report = Report(
        type=payload.type,
        title=title,
        status=ReportStatus.PENDING,
        requested_by=requested_by,
        district_id=payload.district_id,
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    from app.workers.tasks import generate_report_pdf

    generate_report_pdf.delay(str(report.id))

    return report