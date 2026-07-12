"""SentinelX AI — Dashboard summary router."""

from fastapi import APIRouter

from app.core.deps import DbSession
from app.schemas.dashboard import DashboardSummaryResponse
from app.services import dashboard_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummaryResponse)
def dashboard_summary(db: DbSession):
    return dashboard_service.get_dashboard_summary(db)
