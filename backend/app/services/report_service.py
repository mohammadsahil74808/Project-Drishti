"""
SentinelX AI — Report Service
"""
import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.report import Report, ReportStatus
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


def request_report(db: Session, payload: ReportGenerateRequest, requested_by: uuid.UUID, background_tasks = None) -> Report:
    title = _TYPE_TITLES.get(payload.type.value, "Report")
    report = Report(
        type=payload.type,
        title=title,
        status=ReportStatus.pending,
        requested_by=requested_by,
        district_id=payload.district_id,
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    from app.workers.tasks import generate_report_pdf

    if background_tasks:
        background_tasks.add_task(generate_report_pdf, str(report.id))
    else:
        try:
            generate_report_pdf.delay(str(report.id))
        except Exception as e:
            import logging
            logging.getLogger("sentinelx").warning("Celery broker unavailable, falling back to synchronous report generation: %s", e)
            generate_report_pdf(str(report.id))

    return report