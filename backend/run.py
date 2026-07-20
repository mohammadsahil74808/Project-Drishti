import os
import sys
import uvicorn
import logging
from alembic.config import Config
from alembic import command
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.models.user import User, UserRole
from app.core.security import hash_password
from app.core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_startup_tasks():
    # 1. Run Alembic migrations
    logger.info("Running database migrations...")
    logger.info(f"Current working directory (pwd): {os.getcwd()}")
    try:
        # Force-kill any lingering connections/locks from the Neon SQL Editor before migrating
        logger.info("Attempting to forcefully clear Neon database locks...")
        try:
            engine = create_engine(settings.database_url)
            with engine.connect() as conn:
                from sqlalchemy import text
                conn.execute(text("""
                    SELECT pg_terminate_backend(pid) 
                    FROM pg_stat_activity 
                    WHERE pid <> pg_backend_pid() AND usename = current_user;
                """))
                conn.commit()
            engine.dispose()
        except Exception as lock_err:
            logger.error(f"Error clearing locks: {lock_err}")

        alembic_cfg = Config("alembic.ini")
        command.upgrade(alembic_cfg, "head")
        logger.info("Database migrations completed successfully.")
    except Exception as e:
        import traceback
        error_msg = f"Migration failed: {e}\n{traceback.format_exc()}"
        print(error_msg, file=sys.stdout)
        print(error_msg, file=sys.stderr)
        logger.error(error_msg)
        sys.exit(1)
        
    # 2. Seed ADMIN001
    logger.info("Checking for ADMIN001 user...")
    try:
        engine = create_engine(settings.database_url)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        admin = db.query(User).filter_by(badge_no="ADMIN001").first()
        if not admin:
            logger.info("ADMIN001 does not exist. Seeding...")
            admin = User(
                name="System Admin",
                badge_no="ADMIN001",
                role=UserRole.admin,
                password_hash=hash_password("Admin@123"),
                is_active=True
            )
            db.add(admin)
            db.commit()
            logger.info("ADMIN001 seeded successfully.")
        else:
            logger.info("ADMIN001 already exists. Skipping seed.")
    except Exception as e:
        logger.error(f"Error seeding admin: {e}", exc_info=True)
        sys.exit(1)
    finally:
        if 'db' in locals():
            db.close()

if __name__ == "__main__":
    import threading
    startup_thread = threading.Thread(target=run_startup_tasks)
    startup_thread.daemon = True
    startup_thread.start()

    # Zoho Catalyst passes the port as an environment variable
    # We must read it in Python rather than depending on bash expansion
    port_str = os.environ.get("X_ZOHO_CATALYST_LISTEN_PORT", "8000")
    try:
        port = int(port_str)
    except ValueError:
        port = 8000
    
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
