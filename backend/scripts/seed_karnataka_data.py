import os
import sys
import uuid
import random
from datetime import datetime, timedelta

# Add parent directory to path so we can import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import SessionLocal
from app.models.geo import District, Station
from app.models.user import User, UserRole
from app.models.fir import FIR, CaseStatus
from app.models.missing_person import MissingPerson, MissingPersonStatus
from app.models.vehicle import Vehicle, VehicleCrimeStatus
from app.models.alert import Alert, AlertType
from app.models.analytics import CrimeHotspot as Hotspot, HotspotSeverity, RiskScore, RiskEntityType
from app.models.report import Report, ReportStatus, ReportType
from app.schemas.crime_type import CrimeType
from app.core.security import hash_password

KARNATAKA_DISTRICTS = [
    ("Bengaluru Urban", 9621551), ("Bengaluru Rural", 990923), ("Mysuru", 3001127), 
    ("Dakshina Kannada", 2089649), ("Udupi", 1177361), ("Belagavi", 4779661), 
    ("Dharwad", 1847023), ("Shivamogga", 1752753), ("Hassan", 1776421), 
    ("Kodagu", 554519), ("Ballari", 2452595), ("Kalaburagi", 2566326), 
    ("Raichur", 1928812), ("Vijayapura", 2177331), ("Tumakuru", 2678980), 
    ("Chitradurga", 1659456), ("Davanagere", 1945497), ("Koppal", 1389920), 
    ("Gadag", 1064570), ("Bidar", 1703300), ("Chamarajanagar", 1020791), 
    ("Ramanagara", 1082636), ("Mandya", 1805769), ("Haveri", 1597668), 
    ("Uttara Kannada", 1437169), ("Bagalkot", 1889752), ("Yadgir", 1174271), 
    ("Kolar", 1536401), ("Chikkaballapur", 1255104), ("Chikkamagaluru", 1137961)
]

STATION_PREFIXES = ["Town", "Rural", "Women", "Traffic", "Cyber"]

WEAPONS = ["None", "Knife", "Firearm", "Blunt Object", "Rope", "Poison"]
IPC_SECTIONS = ["378", "379", "390", "392", "300", "302", "351", "352", "415", "420", "498A"]

def get_random_location():
    # Bounding box roughly for Karnataka
    lat = random.uniform(11.5, 18.5)
    lng = random.uniform(74.0, 78.5)
    return f"SRID=4326;POINT({lng} {lat})"

def clear_data(db: Session):
    print("Clearing existing data...")
    # Delete in reverse dependency order
    db.execute(text("DELETE FROM reports"))
    db.execute(text("DELETE FROM risk_scores"))
    db.execute(text("DELETE FROM hotspots"))
    db.execute(text("DELETE FROM alerts"))
    db.execute(text("DELETE FROM vehicles"))
    db.execute(text("DELETE FROM missing_persons"))
    db.execute(text("DELETE FROM fir_records"))
    db.execute(text("DELETE FROM users"))
    db.execute(text("DELETE FROM stations"))
    db.execute(text("DELETE FROM districts"))
    db.commit()

def seed_districts_and_stations(db: Session):
    print("Seeding districts and stations...")
    districts_map = {}
    stations_list = []
    
    for d_name, pop in KARNATAKA_DISTRICTS:
        dist = District(
            id=uuid.uuid4(),
            name=d_name
        )
        db.add(dist)
        districts_map[d_name] = dist
        
        # 3-5 stations per district
        num_stations = random.randint(3, 5)
        selected_prefixes = random.sample(STATION_PREFIXES, num_stations)
        
        if d_name == "Bengaluru Urban":
            st_names = ["Cubbon Park PS", "Whitefield PS", "Koramangala PS", "Electronic City PS"]
        elif d_name == "Mysuru":
            st_names = ["Nazarbad PS", "Devaraja PS", "Vijayanagar PS"]
        elif d_name == "Dakshina Kannada":
            st_names = ["Pandeshwar PS", "Kadri PS", "Urwa PS"]
        else:
            st_names = [f"{d_name} {pref} PS" for pref in selected_prefixes]
            
        for s_name in st_names:
            st = Station(
                id=uuid.uuid4(),
                name=s_name,
                district_id=dist.id,
                lat=random.uniform(11.5, 18.5),
                lng=random.uniform(74.0, 78.5)
            )
            db.add(st)
            stations_list.append(st)
            
    db.commit()
    return list(districts_map.values()), stations_list

def seed_users(db: Session, stations):
    print("Seeding users...")
    admin = User(
        id=uuid.uuid4(),
        name="System Admin",
        badge_no="ADMIN001",
        password_hash=hash_password("Admin@123"),
        role=UserRole.admin,
        is_active=True
    )
    db.add(admin)
    
    roles = [UserRole.commissioner, UserRole.sp, UserRole.sho, UserRole.analyst, UserRole.constable]
    users_created = 1
    
    for i in range(41):
        role = random.choice(roles)
        station = random.choice(stations) if role in [UserRole.sho, UserRole.constable] else None
        u = User(
            id=uuid.uuid4(),
            name=f"Officer {users_created}",
            badge_no=f"KSP{users_created:03d}",
            password_hash=hash_password("Pass@123"),
            role=role,
            is_active=True,
            station_id=station.id if station else None
        )
        db.add(u)
        users_created += 1
        
    db.commit()

def seed_firs(db: Session, districts, stations):
    print("Seeding FIRs...")
    firs = []
    for i in range(200):
        st = random.choice(stations)
        dist = next(d for d in districts if d.id == st.district_id)
        
        reported_dt = datetime.utcnow() - timedelta(days=random.randint(1, 365))
        incident_dt = reported_dt - timedelta(hours=random.randint(1, 72))
        
        fir = FIR(
            id=uuid.uuid4(),
            fir_no=f"FIR-{reported_dt.year}-{i:04d}",
            station_id=st.id,
            district_id=dist.id,
            crime_type=random.choice(list(CrimeType)),
            ipc_sections=[random.choice(IPC_SECTIONS) for _ in range(random.randint(1, 3))],
            incident_datetime=incident_dt,
            reported_datetime=reported_dt,
            location=get_random_location(),
            address_text=f"Near {st.name} jurisdiction",
            mo_description="Sample modus operandi description generated by seed script.",
            victim_age_bucket=random.choice(["0-18", "19-35", "36-50", "51-65", "65+"]),
            accused_count=random.randint(1, 5),
            weapon_used=random.choice(WEAPONS),
            status=random.choice(list(CaseStatus))
        )
        db.add(fir)
        firs.append(fir)
    db.commit()
    return firs

def seed_missing_persons(db: Session, districts, stations):
    print("Seeding missing persons...")
    for i in range(50):
        st = random.choice(stations)
        dist = next(d for d in districts if d.id == st.district_id)
        
        mp = MissingPerson(
            id=uuid.uuid4(),
            name_hash=f"hash_person_{i}",
            age=random.randint(5, 85),
            last_seen_date=(datetime.utcnow() - timedelta(days=random.randint(1, 100))).date(),
            last_seen_location=get_random_location(),
            last_seen_address="Sample Address, Karnataka",
            status=random.choice(list(MissingPersonStatus))
        )
        db.add(mp)
    db.commit()

def seed_vehicles(db: Session, firs):
    print("Seeding vehicles...")
    for i in range(80):
        veh = Vehicle(
            id=uuid.uuid4(),
            fir_id=random.choice(firs).id,
            vehicle_type=random.choice(["Car", "Two-Wheeler", "Truck"]),
            reg_pattern_hash=f"hash_reg_{i}",
            theft_location=get_random_location(),
            status=random.choice(list(VehicleCrimeStatus)),
            theft_date=(datetime.utcnow() - timedelta(days=random.randint(1, 200))).date()
        )
        db.add(veh)
    db.commit()

def seed_alerts(db: Session):
    print("Seeding alerts...")
    for i in range(30):
        alert = Alert(
            id=uuid.uuid4(),
            type=random.choice(list(AlertType)),
            severity=random.choice(list(HotspotSeverity)),
            message=f"System generated alert #{i} for statewide monitoring.",
            target_role=random.choice([r for r in UserRole] + [None])
        )
        db.add(alert)
    db.commit()

def seed_hotspots(db: Session, districts):
    print("Seeding hotspots...")
    hotspot_centers = ["Bengaluru Urban", "Mysuru", "Dharwad", "Dakshina Kannada", "Kalaburagi"]
    for i in range(25):
        d_name = random.choice(hotspot_centers)
        dist = next(d for d in districts if d.name == d_name)
        
        hs = Hotspot(
            id=uuid.uuid4(),
            district_id=dist.id,
            name=f"{d_name} Cluster {i}",
            centroid=get_random_location(),
            radius_m=random.uniform(500.0, 5000.0),
            crime_density=random.randint(10, 150),
            severity=random.choice(list(HotspotSeverity)),
            time_window="30d"
        )
        db.add(hs)
    db.commit()

def seed_risk_scores(db: Session, districts):
    print("Seeding risk scores...")
    for dist in districts:
        if dist.name == "Bengaluru Urban":
            score = 82.5
        elif dist.name == "Mysuru":
            score = 58.0
        elif dist.name == "Kodagu":
            score = 18.2
        else:
            score = random.uniform(10.0, 90.0)
            
        rs = RiskScore(
            id=uuid.uuid4(),
            entity_type=RiskEntityType.zone,
            entity_id=str(dist.id),
            entity_label=dist.name,
            score=score,
            shap_explanation=[
                {"feature": "historical_crime_rate", "contribution": random.uniform(0.1, 0.5), "value": random.randint(100, 1000)},
                {"feature": "population_density", "contribution": random.uniform(0.1, 0.4), "value": random.randint(500000, 5000000)}
            ]
        )
        db.add(rs)
    db.commit()

def seed_reports(db: Session):
    print("Seeding reports...")
    for i in range(20):
        rep = Report(
            id=uuid.uuid4(),
            title=f"Monthly Analysis {i}",
            type=random.choice(list(ReportType)),
            status=random.choice(list(ReportStatus)),
            file_path=f"/tmp/reports/{uuid.uuid4()}.pdf" if random.choice([True, False]) else None
        )
        db.add(rep)
    db.commit()

def verify(db: Session):
    print("\nVerification Summary:")
    print("-" * 20)
    
    counts = {
        "Districts": db.execute(text("SELECT COUNT(*) FROM districts")).scalar(),
        "Stations": db.execute(text("SELECT COUNT(*) FROM stations")).scalar(),
        "Users": db.execute(text("SELECT COUNT(*) FROM users")).scalar(),
        "FIRs": db.execute(text("SELECT COUNT(*) FROM fir_records")).scalar(),
        "Missing Persons": db.execute(text("SELECT COUNT(*) FROM missing_persons")).scalar(),
        "Vehicles": db.execute(text("SELECT COUNT(*) FROM vehicles")).scalar(),
        "Alerts": db.execute(text("SELECT COUNT(*) FROM alerts")).scalar(),
        "Hotspots": db.execute(text("SELECT COUNT(*) FROM hotspots")).scalar(),
        "Reports": db.execute(text("SELECT COUNT(*) FROM reports")).scalar(),
    }
    
    for k, v in counts.items():
        print(f"✓ {k}: {v}")

def main():
    db = SessionLocal()
    try:
        clear_data(db)
        districts, stations = seed_districts_and_stations(db)
        seed_users(db, stations)
        firs = seed_firs(db, districts, stations)
        seed_missing_persons(db, districts, stations)
        seed_vehicles(db, firs)
        seed_alerts(db)
        seed_hotspots(db, districts)
        seed_risk_scores(db, districts)
        seed_reports(db)
        verify(db)
        print("\nSeeding completed successfully!")
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
