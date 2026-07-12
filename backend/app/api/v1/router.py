"""
SentinelX AI — API v1 Router Aggregator

Combines every resource router under a single `api_router`, mounted once
in main.py behind `settings.api_v1_prefix`. Adding a new resource means
adding one line here — nothing else in main.py changes.
"""

from fastapi import APIRouter

from app.api.v1 import (
    alerts,
    analytics,
    assistant,
    auth,
    dashboard,
    fir,
    forecast,
    geo,
    missing_persons,
    network,
    reports,
    risk,
    search,
    users,
    vehicles,
)

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(fir.router)
api_router.include_router(analytics.router)
api_router.include_router(geo.router)
api_router.include_router(forecast.router)
api_router.include_router(risk.router)
api_router.include_router(network.router)
api_router.include_router(missing_persons.router)
api_router.include_router(vehicles.router)
api_router.include_router(search.router)
api_router.include_router(assistant.router)
api_router.include_router(reports.router)
api_router.include_router(alerts.router)
api_router.include_router(dashboard.router)
