"""SentinelX AI — Reports router."""

import uuid

from fastapi import APIRouter, HTTPException, status

from app.core.deps import CurrentUser, DbSession
from app.schemas.report import ReportGenerateRequest, ReportResponse
from app.services import report_service

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("", response_model=list[ReportResponse])
def list_reports(db: DbSession, current_user: CurrentUser):
    return report_service.list_reports(db, current_user.id)


@router.post(
    "/generate", response_model=ReportResponse, status_code=status.HTTP_202_ACCEPTED
)
def generate_report(
    payload: ReportGenerateRequest, db: DbSession, current_user: CurrentUser
):
    return report_service.request_report(db, payload, current_user.id)


@router.get("/{report_id}/download")
def download_report(report_id: uuid.UUID, db: DbSession):
    try:
        report = report_service.get_report(db, report_id)
    except report_service.ReportNotFoundError as exc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, str(exc)) from exc

    if report.status.value != "ready" or not report.file_path:
        raise HTTPException(
            status.HTTP_409_CONFLICT, "Report is not ready for download yet."
        )

    from fastapi.responses import FileResponse

    return FileResponse(
        report.file_path, filename=f"{report.title}.pdf", media_type="application/pdf"
    )
