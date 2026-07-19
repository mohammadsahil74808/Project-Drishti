from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base import Base
from app.models.user import User, UserRole
from app.core.security import hash_password
from app.core.config import settings

def main():
    engine = create_engine(settings.database_url)
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        admin = db.query(User).filter_by(badge_no="ADMIN001").first()
        if not admin:
            print("Seeding ADMIN001 user...")
            admin = User(
                name="System Admin",
                badge_no="ADMIN001",
                role=UserRole.admin,
                password_hash=hash_password("Admin@123"),
                is_active=True
            )
            db.add(admin)
            db.commit()
            print("ADMIN001 seeded successfully.")
        else:
            print("ADMIN001 already exists.")
    except Exception as e:
        print(f"Error seeding admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
