"""
SentinelX AI — FIR CRUD API tests (requires a reachable Postgres+PostGIS test DB).
"""
from datetime import datetime, timezone

from app.core.security import hash_password
from app.models.geo import District, Station
from app.models.user import User, UserRole
from tests.conftest import requires_db


def _seed_district_station(db_session):
    district = District(name="Test District")
    db_session.add(district)
    db_session.flush()
    station = Station(name="Test Station", district_id=district.id, lat=12.97, lng=77.59)
    db_session.add(station)
    db_session.commit()
    return district, station


def _auth_headers(client, db_session, role=UserRole.ANALYST):
    user = User(
        name="Analyst Test",
        badge_no=f"KSP-FIR-{role.value}",
        role=role,
        password_hash=hash_password("password123"),
    )
    db_session.add(user)
    db_session.commit()

    resp = client.post(
        "/api/v1/auth/login",
        json={"badge_no": user.badge_no, "password": "password123"},
    )
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@requires_db
def test_create_and_get_fir(client, db_session):
    district, station = _seed_district_station(db_session)
    headers = _auth_headers(client, db_session)

    payload = {
        "fir_no": "KA-2026-TEST-001",
        "station_id": str(station.id),
        "district_id": str(district.id),
        "crime_type": "theft",
        "ipc_sections": ["379"],
        "incident_datetime": datetime.now(timezone.utc).isoformat(),
        "reported_datetime": datetime.now(timezone.utc).isoformat(),
        "location": {"lat": 12.9716, "lng": 77.5946},
        "address_text": "MG Road, Bengaluru",
        "mo_description": "Mobile phone snatched from pedestrian.",
    }

    create_resp = client.post("/api/v1/fir", json=payload, headers=headers)
    assert create_resp.status_code == 201
    fir_id = create_resp.json()["id"]

    get_resp = client.get(f"/api/v1/fir/{fir_id}", headers=headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["fir_no"] == "KA-2026-TEST-001"


@requires_db
def test_create_fir_requires_auth(client, db_session):
    district, station = _seed_district_station(db_session)
    payload = {
        "fir_no": "KA-2026-TEST-002",
        "station_id": str(station.id),
        "district_id": str(district.id),
        "crime_type": "theft",
        "incident_datetime": datetime.now(timezone.utc).isoformat(),
        "reported_datetime": datetime.now(timezone.utc).isoformat(),
        "location": {"lat": 12.9716, "lng": 77.5946},
    }
    resp = client.post("/api/v1/fir", json=payload)
    assert resp.status_code == 401


@requires_db
def test_duplicate_fir_number_rejected(client, db_session):
    district, station = _seed_district_station(db_session)
    headers = _auth_headers(client, db_session)
    payload = {
        "fir_no": "KA-2026-TEST-003",
        "station_id": str(station.id),
        "district_id": str(district.id),
        "crime_type": "burglary",
        "incident_datetime": datetime.now(timezone.utc).isoformat(),
        "reported_datetime": datetime.now(timezone.utc).isoformat(),
        "location": {"lat": 12.9716, "lng": 77.5946},
    }
    first = client.post("/api/v1/fir", json=payload, headers=headers)
    assert first.status_code == 201

    second = client.post("/api/v1/fir", json=payload, headers=headers)
    assert second.status_code == 409


@requires_db
def test_list_firs_pagination(client, db_session):
    district, station = _seed_district_station(db_session)
    headers = _auth_headers(client, db_session)

    for i in range(3):
        payload = {
            "fir_no": f"KA-2026-LIST-{i}",
            "station_id": str(station.id),
            "district_id": str(district.id),
            "crime_type": "theft",
            "incident_datetime": datetime.now(timezone.utc).isoformat(),
            "reported_datetime": datetime.now(timezone.utc).isoformat(),
            "location": {"lat": 12.9716, "lng": 77.5946},
        }
        client.post("/api/v1/fir", json=payload, headers=headers)

    resp = client.get("/api/v1/fir?page=1&page_size=2", headers=headers)
    assert resp.status_code == 200
    body = resp.json()
    assert body["page_size"] == 2
    assert len(body["items"]) <= 2
    assert body["total"] >= 3
