"""initial schema — all SentinelX AI tables

Hand-authored baseline migration (no live Postgres instance was available
in the scaffold environment to run `alembic revision --autogenerate`
against). Mirrors app/models/*.py exactly as of this commit. Once a real
Postgres+PostGIS instance is available, verify with:
    alembic upgrade head && alembic check
and let autogenerate produce all subsequent migrations from here on.

Revision ID: de379822be81
Revises:
Create Date: 2026-07-11

"""

from typing import Sequence, Union

import geoalchemy2
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql
import logging
logger = logging.getLogger("alembic.migration")


revision: str = "de379822be81"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    logger.info("Executing extension creation for postgis...")
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis")
    logger.info("Executed extension creation for postgis.")
    logger.info("Executing extension creation for uuid-ossp...")
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    logger.info("Executed extension creation for uuid-ossp.")

    # ---- districts ----
    logger.info("Creating table districts...")
    op.create_table(
        "districts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(120), nullable=False, unique=True),
        sa.Column(
            "boundary",
            geoalchemy2.Geography(geometry_type="POLYGON", srid=4326),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    logger.info("Table block closed.")

    # ---- stations ----
    logger.info("Creating table stations...")
    op.create_table(
        "stations",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(150), nullable=False),
        sa.Column(
            "district_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("districts.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("lat", sa.Float, nullable=False),
        sa.Column("lng", sa.Float, nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    logger.info("Table block closed.")

    # ---- users ----
    user_role_enum = postgresql.ENUM(
        "constable", "sho", "sp", "commissioner", "analyst", "admin", name="user_role"
    )
    logger.info("Table block closed.")
    logger.info("Creating enum user_role_enum...")
    user_role_enum.create(op.get_bind(), checkfirst=True)
    logger.info("Enum user_role_enum created.")
    logger.info("Creating table users...")
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(150), nullable=False),
        sa.Column("badge_no", sa.String(50), nullable=False, unique=True),
        sa.Column("role", user_role_enum, nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default=sa.true()),
        sa.Column(
            "station_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("stations.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    logger.info("Table block closed.")
    logger.info("Creating index...")
    op.create_index("ix_users_badge_no", "users", ["badge_no"])

    # ---- fir_records ----
    crime_type_enum = postgresql.ENUM(
        "theft",
        "chain_snatching",
        "burglary",
        "assault",
        "vehicle_theft",
        "cybercrime",
        "missing_person",
        "robbery",
        "other",
        name="crime_type",
    )
    logger.info("Table block closed.")
    logger.info("Creating enum crime_type_enum...")
    crime_type_enum.create(op.get_bind(), checkfirst=True)
    logger.info("Enum crime_type_enum created.")
    case_status_enum = postgresql.ENUM(
        "open", "investigation", "chargesheet", "closed", name="case_status"
    )
    logger.info("Table block closed.")
    logger.info("Creating enum case_status_enum...")
    case_status_enum.create(op.get_bind(), checkfirst=True)
    logger.info("Enum case_status_enum created.")

    logger.info("Creating table fir_records...")
    op.create_table(
        "fir_records",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("fir_no", sa.String(50), nullable=False, unique=True),
        sa.Column(
            "station_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("stations.id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column(
            "district_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("districts.id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("crime_type", crime_type_enum, nullable=False),
        sa.Column("ipc_sections", postgresql.ARRAY(sa.String(20)), server_default="{}"),
        sa.Column("incident_datetime", sa.DateTime(timezone=True), nullable=False),
        sa.Column("reported_datetime", sa.DateTime(timezone=True), nullable=False),
        sa.Column(
            "location",
            geoalchemy2.Geography(geometry_type="POINT", srid=4326),
            nullable=False,
        ),
        sa.Column("address_text", sa.Text, nullable=True),
        sa.Column("mo_description", sa.Text, nullable=True),
        sa.Column("status", case_status_enum, nullable=False, server_default="open"),
        sa.Column("victim_age_bucket", sa.String(20), nullable=True),
        sa.Column("accused_count", sa.Integer, server_default="0"),
        sa.Column("weapon_used", sa.String(100), nullable=True),
        sa.Column("embedding", sa.JSON, nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    logger.info("Table block closed.")
    logger.info("Creating index...")
    op.create_index("ix_fir_records_fir_no", "fir_records", ["fir_no"])
    logger.info("Creating index...")
    op.create_index("ix_fir_records_crime_type", "fir_records", ["crime_type"])
    logger.info("Creating index...")
    op.create_index("ix_fir_records_status", "fir_records", ["status"])
    logger.info("Creating index...")
    op.create_index(
        "ix_fir_records_incident_datetime", "fir_records", ["incident_datetime"]
    )
    logger.info("Table block closed.")

    # ---- suspects ----
    logger.info("Creating table suspects...")
    op.create_table(
        "suspects",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "fir_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("fir_records.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("name_hash", sa.String(128), nullable=False),
        sa.Column("display_label", sa.String(100), nullable=False),
        sa.Column("age_bucket", sa.String(20), nullable=True),
        sa.Column("gender", sa.String(20), nullable=True),
        sa.Column(
            "prior_case_ids", postgresql.ARRAY(sa.String(50)), server_default="{}"
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    logger.info("Table block closed.")
    logger.info("Creating index...")
    op.create_index("ix_suspects_name_hash", "suspects", ["name_hash"])

    # ---- criminal_network_edges ----
    logger.info("Creating table criminal_network_edges...")
    op.create_table(
        "criminal_network_edges",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "suspect_a_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("suspects.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "suspect_b_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("suspects.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("relation_type", sa.String(50), nullable=False),
        sa.Column("weight", sa.Float, server_default="1.0"),
        sa.Column(
            "source_fir_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("fir_records.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    logger.info("Table block closed.")

    # ---- missing_persons ----
    mp_status_enum = postgresql.ENUM(
        "reported", "active_search", "matched", "closed", name="missing_person_status"
    )
    logger.info("Table block closed.")
    logger.info("Creating enum mp_status_enum...")
    mp_status_enum.create(op.get_bind(), checkfirst=True)
    logger.info("Enum mp_status_enum created.")
    logger.info("Creating table missing_persons...")
    op.create_table(
        "missing_persons",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name_hash", sa.String(128), nullable=False),
        sa.Column("age", sa.Integer, nullable=False),
        sa.Column(
            "last_seen_location",
            geoalchemy2.Geography(geometry_type="POINT", srid=4326),
            nullable=False,
        ),
        sa.Column("last_seen_address", sa.String(255), nullable=True),
        sa.Column("last_seen_date", sa.Date, nullable=False),
        sa.Column("status", mp_status_enum, nullable=False, server_default="reported"),
        sa.Column(
            "matched_fir_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("fir_records.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    logger.info("Table block closed.")
    logger.info("Creating index...")
    op.create_index("ix_missing_persons_name_hash", "missing_persons", ["name_hash"])

    # ---- vehicles ----
    vehicle_status_enum = postgresql.ENUM(
        "stolen", "recovered", "under_investigation", name="vehicle_crime_status"
    )
    logger.info("Table block closed.")
    logger.info("Creating enum vehicle_status_enum...")
    vehicle_status_enum.create(op.get_bind(), checkfirst=True)
    logger.info("Enum vehicle_status_enum created.")
    logger.info("Creating table vehicles...")
    op.create_table(
        "vehicles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "fir_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("fir_records.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("vehicle_type", sa.String(50), nullable=False),
        sa.Column("reg_pattern_hash", sa.String(128), nullable=False),
        sa.Column(
            "theft_location",
            geoalchemy2.Geography(geometry_type="POINT", srid=4326),
            nullable=False,
        ),
        sa.Column(
            "recovery_location",
            geoalchemy2.Geography(geometry_type="POINT", srid=4326),
            nullable=True,
        ),
        sa.Column(
            "status", vehicle_status_enum, nullable=False, server_default="stolen"
        ),
        sa.Column("theft_date", sa.Date, nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    logger.info("Table block closed.")

    # ---- crime_forecasts ----
    logger.info("Creating table crime_forecasts...")
    op.create_table(
        "crime_forecasts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "district_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("districts.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("crime_type", crime_type_enum, nullable=False),
        sa.Column("forecast_date", sa.Date, nullable=False),
        sa.Column("predicted_count", sa.Float, nullable=False),
        sa.Column("lower_bound", sa.Float, nullable=False),
        sa.Column("upper_bound", sa.Float, nullable=False),
        sa.Column("model_version", sa.String(50), server_default="v1"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    logger.info("Table block closed.")
    logger.info("Creating index...")
    op.create_index(
        "ix_crime_forecasts_forecast_date", "crime_forecasts", ["forecast_date"]
    )
    logger.info("Table block closed.")

    # ---- risk_scores ----
    risk_entity_enum = postgresql.ENUM("zone", "person", name="risk_entity_type")
    logger.info("Creating enum risk_entity_enum...")
    risk_entity_enum.create(op.get_bind(), checkfirst=True)
    logger.info("Enum risk_entity_enum created.")
    logger.info("Creating table risk_scores...")
    op.create_table(
        "risk_scores",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("entity_type", risk_entity_enum, nullable=False),
        sa.Column("entity_id", sa.String(100), nullable=False),
        sa.Column("entity_label", sa.String(150), nullable=False),
        sa.Column("score", sa.Float, nullable=False),
        sa.Column("shap_explanation", sa.JSON, server_default="[]"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    logger.info("Table block closed.")
    logger.info("Creating index...")
    op.create_index("ix_risk_scores_entity_id", "risk_scores", ["entity_id"])

    # ---- hotspots ----
    severity_enum = postgresql.ENUM(
        "low", "medium", "high", "critical", name="hotspot_severity"
    )
    logger.info("Table block closed.")
    logger.info("Creating enum severity_enum...")
    severity_enum.create(op.get_bind(), checkfirst=True)
    logger.info("Enum severity_enum created.")
    logger.info("Creating table hotspots...")
    op.create_table(
        "hotspots",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "district_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("districts.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("name", sa.String(150), nullable=True),
        sa.Column(
            "centroid",
            geoalchemy2.Geography(geometry_type="POINT", srid=4326),
            nullable=False,
        ),
        sa.Column("radius_m", sa.Float, server_default="250.0"),
        sa.Column("crime_density", sa.Integer, server_default="0"),
        sa.Column("time_window", sa.String(20), server_default="30d"),
        sa.Column("severity", severity_enum, nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    logger.info("Table block closed.")

    # ---- alerts ----
    alert_type_enum = postgresql.ENUM(
        "anomaly",
        "forecast_spike",
        "new_hotspot",
        "missing_person_match",
        name="alert_type",
    )
    logger.info("Table block closed.")
    logger.info("Creating enum alert_type_enum...")
    alert_type_enum.create(op.get_bind(), checkfirst=True)
    logger.info("Enum alert_type_enum created.")
    logger.info("Creating table alerts...")
    op.create_table(
        "alerts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("type", alert_type_enum, nullable=False),
        sa.Column("message", sa.Text, nullable=False),
        sa.Column("severity", severity_enum, nullable=False),
        sa.Column("target_role", sa.String(30), nullable=True),
        sa.Column(
            "station_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("stations.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "location",
            geoalchemy2.Geography(geometry_type="POINT", srid=4326),
            nullable=True,
        ),
        sa.Column(
            "acknowledged", sa.Boolean, nullable=False, server_default=sa.false()
        ),
        sa.Column(
            "acknowledged_by",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    logger.info("Table block closed.")

    # ---- audit_log ----
    logger.info("Creating table audit_log...")
    op.create_table(
        "audit_log",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("action", sa.String(100), nullable=False),
        sa.Column("resource", sa.String(150), nullable=False),
        sa.Column("ip_address", sa.String(64), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    logger.info("Table block closed.")

    # ---- reports ----
    report_type_enum = postgresql.ENUM("weekly", "hotspot", "case", name="report_type")
    logger.info("Creating enum report_type_enum...")
    report_type_enum.create(op.get_bind(), checkfirst=True)
    logger.info("Enum report_type_enum created.")
    report_status_enum = postgresql.ENUM(
        "pending", "generating", "ready", "failed", name="report_status"
    )
    logger.info("Table block closed.")
    logger.info("Creating enum report_status_enum...")
    report_status_enum.create(op.get_bind(), checkfirst=True)
    logger.info("Enum report_status_enum created.")
    logger.info("Creating table reports...")
    op.create_table(
        "reports",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("type", report_type_enum, nullable=False),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column(
            "status", report_status_enum, nullable=False, server_default="pending"
        ),
        sa.Column(
            "requested_by",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("file_path", sa.String(500), nullable=True),
        sa.Column(
            "district_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("districts.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    logger.info("Table block closed.")


def downgrade() -> None:
    op.drop_table("reports")
    op.drop_table("audit_log")
    op.drop_table("alerts")
    op.drop_table("hotspots")
    op.drop_table("risk_scores")
    op.drop_table("crime_forecasts")
    op.drop_table("vehicles")
    op.drop_table("missing_persons")
    op.drop_table("criminal_network_edges")
    op.drop_table("suspects")
    op.drop_table("fir_records")
    op.drop_table("users")
    op.drop_table("stations")
    op.drop_table("districts")

    for enum_name in (
        "report_status",
        "report_type",
        "alert_type",
        "hotspot_severity",
        "risk_entity_type",
        "missing_person_status",
        "vehicle_crime_status",
        "case_status",
        "crime_type",
        "user_role",
    ):
        op.execute(f"DROP TYPE IF EXISTS {enum_name}")
