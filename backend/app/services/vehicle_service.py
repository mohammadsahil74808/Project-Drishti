"""
SentinelX AI — Vehicle Crime Analytics Service
"""
import uuid

from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from app.models.vehicle import VehicleCrimeRecord, VehicleCrimeStatus
from app.schemas.vehicle import VehicleRecoveryRateResponse, VehicleTheftTrendResponse, VehicleTrendPoint


def get_theft_trend(
    db: Session, district_id: uuid.UUID | None, vehicle_type: str | None
) -> VehicleTheftTrendResponse:
    bucket = func.date_trunc("month", VehicleCrimeRecord.theft_date)

    stolen_count = func.count(VehicleCrimeRecord.id)
    recovered_count = func.sum(
        case((VehicleCrimeRecord.status == VehicleCrimeStatus.RECOVERED, 1), else_=0)
    )

    stmt = select(bucket.label("period"), stolen_count.label("stolen"), recovered_count.label("recovered"))
    if vehicle_type:
        stmt = stmt.where(VehicleCrimeRecord.vehicle_type == vehicle_type)
    stmt = stmt.group_by(bucket).order_by(bucket)

    rows = db.execute(stmt).all()
    points = [
        VehicleTrendPoint(period=str(r.period.date()), stolen=r.stolen, recovered=r.recovered or 0)
        for r in rows
    ]
    return VehicleTheftTrendResponse(vehicle_type=vehicle_type, district_id=district_id, points=points)


def get_recovery_rate(db: Session, vehicle_type: str) -> VehicleRecoveryRateResponse:
    stmt = select(
        func.count(VehicleCrimeRecord.id).label("total"),
        func.sum(case((VehicleCrimeRecord.status == VehicleCrimeStatus.RECOVERED, 1), else_=0)).label("recovered"),
    ).where(VehicleCrimeRecord.vehicle_type == vehicle_type)

    row = db.execute(stmt).one()
    total = row.total or 0
    recovered = row.recovered or 0
    rate = round((recovered / total * 100), 1) if total else 0.0

    return VehicleRecoveryRateResponse(
        vehicle_type=vehicle_type,
        total_stolen=total,
        total_recovered=recovered,
        recovery_rate_percent=rate,
    )