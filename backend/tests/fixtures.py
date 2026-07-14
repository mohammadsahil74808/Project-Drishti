import pytest
from app.core.security import hash_password
from app.models.user import User, UserRole
from app.models.geo import District, Station
from tests.conftest import requires_db

@pytest.fixture
def auth_client(client, db_session):
    # Ensure ADMIN001 exists
    admin = db_session.query(User).filter_by(badge_no="ADMIN001").first()
    if not admin:
        admin = User(
            name="System Admin",
            badge_no="ADMIN001",
            role=UserRole.admin,
            password_hash=hash_password("Admin@123")
        )
        db_session.add(admin)
        db_session.commit()
        
    response = client.post("/api/v1/auth/login", json={
        "badge_no": "ADMIN001",
        "password": "Admin@123"
    })
    
    assert response.status_code == 200, f"Login failed: {response.text}"
    token = response.json()["access_token"]
    
    client.headers.update({"Authorization": f"Bearer {token}"})
    return client

class ReferenceResolver:
    def __init__(self, client, db_session):
        self.client = client
        self.db_session = db_session
        
    def get_district_id(self):
        resp = self.client.get("/api/v1/geo/districts")
        data = resp.json()
        if data:
            return data[0]["id"]
            
        # Unavoidable DB write: no POST endpoint for geo entities
        district = District(name="Integration Test District")
        self.db_session.add(district)
        self.db_session.flush()
        
        station = Station(name="Integration Test Station", district_id=district.id, lat=12.97, lng=77.59)
        self.db_session.add(station)
        self.db_session.commit()
        return str(district.id)
        
    def get_station_id(self):
        # We know one station exists if we call get_district_id and it seeds, 
        # or we just seed it if it's completely missing
        self.get_district_id()
        station = self.db_session.query(Station).first()
        return str(station.id)

@pytest.fixture
def ref_resolver(auth_client, db_session):
    return ReferenceResolver(auth_client, db_session)
