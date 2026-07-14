"""
SentinelX AI — Celery Background Tasks

Every task opens and closes its own DB session (Celery workers run in a
separate process from FastAPI, so app.core.deps.get_db's request-scoped
generator doesn't apply here). Tasks call into app/ai/* pipelines for the
actual modeling — kept as clearly-labeled statistical placeholders until
those pipelines are trained on real data, matching the pattern already
used in the service-layer fallbacks.
"""

import os
import uuid
from datetime import date, datetime, timedelta

from sqlalchemy import func, select

from app.core.logging import configure_logging, get_logger
from app.db.session import SessionLocal
from app.models.alert import Alert, AlertType
from app.schemas.crime_type import CrimeType
from app.models.fir import FIR
from app.models.analytics import CrimeForecast
from app.models.geo import District
from app.models.analytics import CrimeHotspot as Hotspot, HotspotSeverity
from app.models.report import Report, ReportStatus
from app.models.analytics import RiskScore, RiskEntityType
from app.workers.celery_app import celery_app

configure_logging()
logger = get_logger("sentinelx.worker")


@celery_app.task(name="app.workers.tasks.retrain_forecast_models")
def retrain_forecast_models() -> str:
    """
    Nightly job: retrains the Prophet + LightGBM ensemble
    (app/ai/forecasting/) per district/crime-type and writes fresh rows to
    crime_forecasts. Uses a simple moving-average + trend placeholder until
    the real ensemble is trained — same output contract either way, so the
    forecast API and frontend never need to change.
    """
    db = SessionLocal()
    written = 0
    try:
        districts = list(db.scalars(select(District)))
        for district in districts:
            for crime_type in CrimeType:
                recent_avg = (
                    db.scalar(
                        select(func.count(FIR.id)).where(
                            FIR.district_id == district.id,
                            FIR.crime_type == crime_type,
                            FIR.incident_datetime
                            >= datetime.utcnow() - timedelta(days=30),
                        )
                    )
                    or 0
                )
                daily_baseline = max(0.5, recent_avg / 30)

                for i in range(14):
                    forecast_date = date.today() + timedelta(days=i + 1)
                    spread = 0.1 + (i * 0.015)
                    db.add(
                        CrimeForecast(
                            district_id=district.id,
                            crime_type=crime_type,
                            forecast_date=forecast_date,
                            predicted_count=round(daily_baseline, 2),
                            lower_bound=round(daily_baseline * (1 - spread), 2),
                            upper_bound=round(daily_baseline * (1 + spread), 2),
                            model_version="moving-avg-v1",
                        )
                    )
                    written += 1
        db.commit()
        logger.info("retrain_forecast_models: wrote %d forecast rows", written)
        return f"wrote {written} forecast rows"
    finally:
        db.close()


@celery_app.task(name="app.workers.tasks.recompute_hotspots")
def recompute_hotspots() -> str:
    """
    Nightly job: clusters recent FIR geopoints per district into hotspots.
    Uses a simple density-count grouping placeholder for DBSCAN
    (app/ai/geo/) until that pipeline is wired to real coordinate data.
    """
    db = SessionLocal()
    try:
        db.query(Hotspot).delete()
        districts = list(db.scalars(select(District)))
        written = 0
        for district in districts:
            count_30d = (
                db.scalar(
                    select(func.count(FIR.id)).where(
                        FIR.district_id == district.id,
                        FIR.incident_datetime
                        >= datetime.utcnow() - timedelta(days=30),
                    )
                )
                or 0
            )
            if count_30d < 5:
                continue

            severity = (
                HotspotSeverity.critical
                if count_30d >= 60
                else (
                    HotspotSeverity.high
                    if count_30d >= 30
                    else (
                        HotspotSeverity.medium
                        if count_30d >= 10
                        else HotspotSeverity.low
                    )
                )
            )
            sample_point = db.scalar(
                select(FIR.location)
                .where(FIR.district_id == district.id)
                .limit(1)
            )
            if sample_point is None:
                continue

            db.add(
                Hotspot(
                    district_id=district.id,
                    name=f"{district.name} primary cluster",
                    centroid=sample_point,
                    radius_m=300.0,
                    crime_density=count_30d,
                    time_window="30d",
                    severity=severity,
                )
            )
            written += 1
        db.commit()
        logger.info("recompute_hotspots: wrote %d hotspot rows", written)
        return f"wrote {written} hotspot rows"
    finally:
        db.close()


@celery_app.task(name="app.workers.tasks.recompute_risk_scores")
def recompute_risk_scores() -> str:
    """
    Weekly job: computes zone-level risk scores. Uses a transparent
    rule-based formula (normalized 30-day case density) until the
    XGBoost + SHAP pipeline (app/ai/risk_scoring/) is trained — the
    "shap_explanation" field is clearly labeled as rule-based, not a real
    SHAP value, matching the risk_service fallback contract.
    """
    db = SessionLocal()
    try:
        districts = list(db.scalars(select(District)))
        max_count = 1
        counts: dict[uuid.UUID, int] = {}
        for d in districts:
            c = (
                db.scalar(
                    select(func.count(FIR.id)).where(
                        FIR.district_id == d.id,
                        FIR.incident_datetime
                        >= datetime.utcnow() - timedelta(days=30),
                    )
                )
                or 0
            )
            counts[d.id] = c
            max_count = max(max_count, c)

        written = 0
        for d in districts:
            score = round((counts[d.id] / max_count) * 100, 1)
            db.add(
                RiskScore(
                    entity_type=RiskEntityType.zone,
                    entity_id=str(d.id),
                    entity_label=d.name,
                    score=score,
                    shap_explanation=[
                        {
                            "feature": "30d_case_density_normalized",
                            "contribution": 0.8,
                            "value": counts[d.id],
                        },
                        {
                            "feature": "rule_based_placeholder",
                            "contribution": 0.2,
                            "value": "true",
                        },
                    ],
                )
            )
            written += 1
        db.commit()
        logger.info("recompute_risk_scores: wrote %d risk score rows", written)
        return f"wrote {written} risk score rows"
    finally:
        db.close()


@celery_app.task(name="app.workers.tasks.evaluate_alert_rules")
def evaluate_alert_rules() -> str:
    """
    Runs every 15 minutes: scans for statistically unusual spikes in the
    last 24h vs the trailing 4-week daily average per district, and creates
    an Alert row (+ publishes to Redis for live WebSocket delivery) when a
    spike crosses threshold. This is the anomaly-detection rule engine
    described in the blueprint — Isolation Forest can replace the z-score
    threshold below without changing the Alert-creation contract.
    """
    from app.services.alert_service import publish_alert_event

    db = SessionLocal()
    created = 0
    try:
        districts = list(db.scalars(select(District)))
        for d in districts:
            last_24h = (
                db.scalar(
                    select(func.count(FIR.id)).where(
                        FIR.district_id == d.id,
                        FIR.incident_datetime
                        >= datetime.utcnow() - timedelta(hours=24),
                    )
                )
                or 0
            )
            trailing_avg = (
                db.scalar(
                    select(func.count(FIR.id)).where(
                        FIR.district_id == d.id,
                        FIR.incident_datetime
                        >= datetime.utcnow() - timedelta(days=28),
                        FIR.incident_datetime
                        < datetime.utcnow() - timedelta(days=1),
                    )
                )
                or 0
            ) / 27

            if trailing_avg > 0 and last_24h > trailing_avg * 1.4 and last_24h >= 5:
                pct = round(((last_24h - trailing_avg) / trailing_avg) * 100)
                alert = Alert(
                    type=AlertType.anomaly,
                    message=f"Anomaly: crime volume in {d.name} up {pct}% vs 4-week average in the last 24h.",
                    severity=(
                        HotspotSeverity.high if pct >= 60 else HotspotSeverity.medium
                    ),
                    target_role=None,
                )
                db.add(alert)
                db.commit()
                db.refresh(alert)
                publish_alert_event(alert)
                created += 1
        logger.info("evaluate_alert_rules: created %d alerts", created)
        return f"created {created} alerts"
    finally:
        db.close()


@celery_app.task(name="app.workers.tasks.generate_report_pdf")
def generate_report_pdf(report_id: str) -> str:
    """
    Renders a simple PDF for the given Report row using ReportLab (free,
    pure-Python — no external binary dependency like wkhtmltopdf needed).
    Kept intentionally simple; swap the canvas drawing calls for a proper
    template once report design is finalized.
    """
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen import canvas

    db = SessionLocal()
    try:
        report = db.get(Report, uuid.UUID(report_id))
        if report is None:
            return f"report {report_id} not found"

        report.status = ReportStatus.generating
        db.commit()

        output_dir = "/tmp/sentinelx_reports"
        os.makedirs(output_dir, exist_ok=True)
        file_path = os.path.join(output_dir, f"{report.id}.pdf")

        c = canvas.Canvas(file_path, pagesize=A4)
        width, height = A4
        c.setFont("Helvetica-Bold", 18)
        c.drawString(50, height - 60, "SentinelX AI")
        c.setFont("Helvetica", 12)
        c.drawString(50, height - 90, report.title)
        c.setFont("Helvetica", 9)
        c.drawString(50, height - 110, f"Generated: {datetime.utcnow().isoformat()}Z")
        c.drawString(50, height - 130, f"Report type: {report.type.value}")
        c.line(50, height - 140, width - 50, height - 140)
        c.setFont("Helvetica", 10)
        c.drawString(
            50,
            height - 170,
            "This is an auto-generated summary. Full narrative sections populate",
        )
        c.drawString(50, height - 185, "once the report template is finalized.")
        c.save()

        report.status = ReportStatus.ready
        report.file_path = file_path
        db.commit()
        logger.info("generate_report_pdf: wrote %s", file_path)
        return file_path
    except Exception:
        db.rollback()
        report = db.get(Report, uuid.UUID(report_id))
        if report:
            report.status = ReportStatus.failed
            db.commit()
        raise
    finally:
        db.close()
