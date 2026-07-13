-- ============================================================================
-- SentinelX AI — Crime Intelligence Platform
-- Core Schema DDL (PostgreSQL 15+ with PostGIS)
-- Run order: 01_schema.sql -> 02_constraints.sql -> 03_indexes.sql
--            -> 04_views.sql -> 05_materialized_views.sql -> 06_seed_data.sql
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- ENUM TYPES
-- ============================================================================
CREATE TYPE case_status AS ENUM ('open', 'investigation', 'chargesheet', 'closed');
CREATE TYPE missing_person_status AS ENUM ('reported', 'active_search', 'matched', 'closed');
CREATE TYPE vehicle_crime_status AS ENUM ('stolen', 'recovered', 'under_investigation');
CREATE TYPE hotspot_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE risk_entity_type AS ENUM ('zone', 'person', 'vehicle');
CREATE TYPE alert_type AS ENUM ('anomaly', 'forecast_spike', 'new_hotspot', 'missing_person_match', 'network_alert');
CREATE TYPE report_type AS ENUM ('weekly', 'hotspot', 'case', 'network', 'custom');
CREATE TYPE report_status AS ENUM ('pending', 'generating', 'ready', 'failed');
CREATE TYPE ai_prediction_type AS ENUM ('classification', 'risk_score', 'forecast', 'hotspot', 'network', 'recommendation');
CREATE TYPE chat_role AS ENUM ('user', 'assistant', 'system');
CREATE TYPE notification_type AS ENUM ('alert', 'report_ready', 'case_update', 'system', 'mention');
CREATE TYPE evidence_type AS ENUM ('physical', 'digital', 'document', 'photo', 'video', 'audio', 'testimony');
CREATE TYPE attachment_owner_type AS ENUM ('fir', 'evidence', 'report', 'missing_person');
CREATE TYPE network_relation_type AS ENUM ('co_accused', 'shared_address', 'shared_vehicle', 'family', 'associate', 'financial');

-- ============================================================================
-- 1. ROLES
-- ============================================================================
CREATE TABLE roles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(50) NOT NULL UNIQUE,       -- constable, sho, sp, commissioner, analyst, admin
    display_name    VARCHAR(100) NOT NULL,
    description     TEXT,
    permissions     JSONB NOT NULL DEFAULT '[]',        -- e.g. ["fir:create", "reports:generate"]
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. DISTRICTS & POLICE STATIONS (supporting geo hierarchy for stations)
-- ============================================================================
CREATE TABLE districts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(120) NOT NULL UNIQUE,
    state           VARCHAR(80) NOT NULL DEFAULT 'Karnataka',
    boundary        GEOGRAPHY(POLYGON, 4326),
    population      INTEGER,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE police_stations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(150) NOT NULL,
    code            VARCHAR(30) UNIQUE,
    district_id     UUID NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    location        GEOGRAPHY(POINT, 4326) NOT NULL,
    address         TEXT,
    phone           VARCHAR(20),
    jurisdiction_area GEOGRAPHY(POLYGON, 4326),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. USERS
-- ============================================================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(150) NOT NULL,
    badge_no        VARCHAR(50) NOT NULL UNIQUE,
    email           VARCHAR(150) UNIQUE,
    phone           VARCHAR(20),
    role_id         UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    station_id      UUID REFERENCES police_stations(id) ON DELETE SET NULL,
    password_hash   VARCHAR(255) NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 4. CRIME CATEGORIES & CRIME TYPES
-- ============================================================================
CREATE TABLE crime_categories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL UNIQUE,   -- e.g. "Property Crime", "Violent Crime", "Cyber Crime"
    description     TEXT,
    severity_weight SMALLINT NOT NULL DEFAULT 1 CHECK (severity_weight BETWEEN 1 AND 10),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE crime_types (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id     UUID NOT NULL REFERENCES crime_categories(id) ON DELETE RESTRICT,
    name            VARCHAR(100) NOT NULL UNIQUE,   -- theft, chain_snatching, burglary, ...
    display_name    VARCHAR(120) NOT NULL,
    default_ipc_sections TEXT[] DEFAULT '{}',
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. FIRS (First Information Reports)
-- ============================================================================
CREATE TABLE firs (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fir_no              VARCHAR(50) NOT NULL UNIQUE,
    station_id          UUID NOT NULL REFERENCES police_stations(id) ON DELETE RESTRICT,
    district_id         UUID NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    crime_type_id       UUID NOT NULL REFERENCES crime_types(id) ON DELETE RESTRICT,
    ipc_sections        TEXT[] DEFAULT '{}',
    incident_datetime   TIMESTAMPTZ NOT NULL,
    reported_datetime   TIMESTAMPTZ NOT NULL,
    location            GEOGRAPHY(POINT, 4326) NOT NULL,
    address_text        TEXT,
    mo_description       TEXT,
    status              case_status NOT NULL DEFAULT 'open',
    victim_age_bucket   VARCHAR(20),
    accused_count       INTEGER NOT NULL DEFAULT 0,
    weapon_used         VARCHAR(100),
    investigating_officer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_reported_after_incident CHECK (reported_datetime >= incident_datetime)
);

-- ============================================================================
-- 6. VICTIMS, WITNESSES (per-FIR people records — PII stored hashed)
-- ============================================================================
CREATE TABLE victims (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fir_id          UUID NOT NULL REFERENCES firs(id) ON DELETE CASCADE,
    name_hash       VARCHAR(128) NOT NULL,
    display_label   VARCHAR(100) NOT NULL,
    age             SMALLINT CHECK (age IS NULL OR age BETWEEN 0 AND 130),
    gender          VARCHAR(20),
    contact_hash    VARCHAR(128),
    injury_severity VARCHAR(30),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE witnesses (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fir_id          UUID NOT NULL REFERENCES firs(id) ON DELETE CASCADE,
    name_hash       VARCHAR(128) NOT NULL,
    display_label   VARCHAR(100) NOT NULL,
    contact_hash    VARCHAR(128),
    statement       TEXT,
    reliability_score SMALLINT CHECK (reliability_score IS NULL OR reliability_score BETWEEN 1 AND 5),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 7. SUSPECTS (per-FIR, may or may not resolve to a known Criminal identity)
-- ============================================================================
CREATE TABLE suspects (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fir_id          UUID NOT NULL REFERENCES firs(id) ON DELETE CASCADE,
    criminal_id     UUID,  -- FK added after criminals table is created (circular-safe)
    name_hash       VARCHAR(128) NOT NULL,
    display_label   VARCHAR(100) NOT NULL,
    age_bucket      VARCHAR(20),
    gender          VARCHAR(20),
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 8. CRIMINALS (persistent identity across FIRs — repeat offenders)
-- ============================================================================
CREATE TABLE criminals (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_hash       VARCHAR(128) NOT NULL UNIQUE,
    display_label   VARCHAR(100) NOT NULL,
    age_bucket      VARCHAR(20),
    gender          VARCHAR(20),
    first_case_date DATE,
    total_case_count INTEGER NOT NULL DEFAULT 0,
    current_status  VARCHAR(30) DEFAULT 'at_large',  -- at_large, in_custody, on_bail, deceased
    risk_score      NUMERIC(5,2) CHECK (risk_score IS NULL OR risk_score BETWEEN 0 AND 100),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE suspects
    ADD CONSTRAINT fk_suspects_criminal FOREIGN KEY (criminal_id) REFERENCES criminals(id) ON DELETE SET NULL;

-- ============================================================================
-- 9. CRIMINAL NETWORKS (named gang/network groupings + membership + edges)
-- ============================================================================
CREATE TABLE criminal_networks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(150) NOT NULL,
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE criminal_network_members (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    network_id      UUID NOT NULL REFERENCES criminal_networks(id) ON DELETE CASCADE,
    criminal_id     UUID NOT NULL REFERENCES criminals(id) ON DELETE CASCADE,
    role_in_network VARCHAR(50) DEFAULT 'member',  -- leader, member, associate
    joined_at       DATE,
    UNIQUE (network_id, criminal_id)
);

CREATE TABLE criminal_network_edges (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    criminal_a_id   UUID NOT NULL REFERENCES criminals(id) ON DELETE CASCADE,
    criminal_b_id   UUID NOT NULL REFERENCES criminals(id) ON DELETE CASCADE,
    relation_type   network_relation_type NOT NULL,
    weight          NUMERIC(5,2) NOT NULL DEFAULT 1.0,
    source_fir_id   UUID REFERENCES firs(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_no_self_edge CHECK (criminal_a_id <> criminal_b_id)
);

-- ============================================================================
-- 10. VEHICLES
-- ============================================================================
CREATE TABLE vehicles (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fir_id              UUID NOT NULL REFERENCES firs(id) ON DELETE CASCADE,
    vehicle_type        VARCHAR(50) NOT NULL,   -- two_wheeler, four_wheeler, commercial
    registration_hash   VARCHAR(128) NOT NULL,
    make_model          VARCHAR(100),
    color               VARCHAR(40),
    theft_location      GEOGRAPHY(POINT, 4326) NOT NULL,
    recovery_location   GEOGRAPHY(POINT, 4326),
    status              vehicle_crime_status NOT NULL DEFAULT 'stolen',
    theft_date          DATE NOT NULL,
    recovery_date       DATE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_recovery_after_theft CHECK (recovery_date IS NULL OR recovery_date >= theft_date)
);

-- ============================================================================
-- 11. MISSING PERSONS
-- ============================================================================
CREATE TABLE missing_persons (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_hash           VARCHAR(128) NOT NULL,
    display_label       VARCHAR(100) NOT NULL,
    age                 SMALLINT NOT NULL CHECK (age BETWEEN 0 AND 130),
    gender              VARCHAR(20),
    last_seen_location  GEOGRAPHY(POINT, 4326) NOT NULL,
    last_seen_address   VARCHAR(255),
    last_seen_date      DATE NOT NULL,
    reported_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status              missing_person_status NOT NULL DEFAULT 'reported',
    matched_fir_id      UUID REFERENCES firs(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 12. CRIME HOTSPOTS
-- ============================================================================
CREATE TABLE crime_hotspots (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id     UUID NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
    name            VARCHAR(150),
    centroid        GEOGRAPHY(POINT, 4326) NOT NULL,
    radius_m        NUMERIC(10,2) NOT NULL DEFAULT 250.0,
    crime_density   INTEGER NOT NULL DEFAULT 0,
    time_window     VARCHAR(20) NOT NULL DEFAULT '30d',
    severity        hotspot_severity NOT NULL,
    computed_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 13. CRIME FORECASTS
-- ============================================================================
CREATE TABLE crime_forecasts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id     UUID NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
    crime_type_id   UUID NOT NULL REFERENCES crime_types(id) ON DELETE CASCADE,
    forecast_date   DATE NOT NULL,
    predicted_count NUMERIC(8,2) NOT NULL,
    lower_bound     NUMERIC(8,2) NOT NULL,
    upper_bound     NUMERIC(8,2) NOT NULL,
    model_version   VARCHAR(50) NOT NULL DEFAULT 'v1',
    generated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_forecast_bounds CHECK (lower_bound <= predicted_count AND predicted_count <= upper_bound)
);

-- ============================================================================
-- 14. RISK SCORES
-- ============================================================================
CREATE TABLE risk_scores (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type         risk_entity_type NOT NULL,
    entity_id           VARCHAR(100) NOT NULL,
    entity_label        VARCHAR(150) NOT NULL,
    score               NUMERIC(5,2) NOT NULL CHECK (score BETWEEN 0 AND 100),
    shap_explanation    JSONB NOT NULL DEFAULT '[]',
    model_version       VARCHAR(50) NOT NULL DEFAULT 'v1',
    computed_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 15. ALERTS
-- ============================================================================
CREATE TABLE alerts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type            alert_type NOT NULL,
    message         TEXT NOT NULL,
    severity        hotspot_severity NOT NULL,
    target_role_id  UUID REFERENCES roles(id) ON DELETE SET NULL,
    station_id      UUID REFERENCES police_stations(id) ON DELETE SET NULL,
    location        GEOGRAPHY(POINT, 4326),
    acknowledged    BOOLEAN NOT NULL DEFAULT false,
    acknowledged_by UUID REFERENCES users(id) ON DELETE SET NULL,
    acknowledged_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 16. REPORTS
-- ============================================================================
CREATE TABLE reports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type            report_type NOT NULL,
    title           VARCHAR(200) NOT NULL,
    status          report_status NOT NULL DEFAULT 'pending',
    requested_by    UUID REFERENCES users(id) ON DELETE SET NULL,
    district_id     UUID REFERENCES districts(id) ON DELETE SET NULL,
    fir_id          UUID REFERENCES firs(id) ON DELETE SET NULL,
    file_path       VARCHAR(500),
    date_from       DATE,
    date_to         DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at    TIMESTAMPTZ
);

-- ============================================================================
-- 17. AI PREDICTIONS (generic log of every AI-engine inference call)
-- ============================================================================
CREATE TABLE ai_predictions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prediction_type     ai_prediction_type NOT NULL,
    entity_type         VARCHAR(50),                 -- fir, zone, suspect, vehicle, ...
    entity_id           VARCHAR(100),
    input_features      JSONB NOT NULL DEFAULT '{}',
    output              JSONB NOT NULL DEFAULT '{}',
    model_name          VARCHAR(100) NOT NULL,
    model_version       VARCHAR(50) NOT NULL,
    confidence          NUMERIC(5,4),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 18. AI CHAT HISTORY
-- ============================================================================
CREATE TABLE ai_chat_history (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id      UUID NOT NULL,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    role            chat_role NOT NULL,
    message         TEXT NOT NULL,
    chart_payload   JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 19. SEMANTIC SEARCH EMBEDDINGS
-- ============================================================================
CREATE TABLE semantic_search_embeddings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fir_id          UUID NOT NULL REFERENCES firs(id) ON DELETE CASCADE,
    embedding       JSONB NOT NULL,          -- float array; migrate to pgvector's VECTOR(384) if extension available
    model_name      VARCHAR(100) NOT NULL,
    dims            SMALLINT NOT NULL DEFAULT 384,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (fir_id, model_name)
);

-- ============================================================================
-- 20. AUDIT LOGS (append-only — sensitive action trail)
-- ============================================================================
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    action          VARCHAR(100) NOT NULL,       -- e.g. "fir.create", "user.deactivate"
    resource        VARCHAR(150) NOT NULL,       -- e.g. "fir_records:<id>"
    ip_address      VARCHAR(64),
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 21. ACTIVITY LOGS (broader UX telemetry — searches, page views, exports)
-- ============================================================================
CREATE TABLE activity_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    activity_type   VARCHAR(80) NOT NULL,   -- search, view_dashboard, export_report, ...
    description     TEXT,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 22. NOTIFICATIONS
-- ============================================================================
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            notification_type NOT NULL,
    title           VARCHAR(200) NOT NULL,
    message         TEXT NOT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT false,
    related_alert_id UUID REFERENCES alerts(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    read_at         TIMESTAMPTZ
);

-- ============================================================================
-- 23. EVIDENCE
-- ============================================================================
CREATE TABLE evidence (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fir_id              UUID NOT NULL REFERENCES firs(id) ON DELETE CASCADE,
    evidence_type       evidence_type NOT NULL,
    description         TEXT NOT NULL,
    collected_by        UUID REFERENCES users(id) ON DELETE SET NULL,
    collected_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    storage_location    VARCHAR(255),
    chain_of_custody    JSONB NOT NULL DEFAULT '[]',   -- [{by, at, action}, ...]
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 24. ATTACHMENTS (polymorphic-lite: one owner type + id, no true polymorphic FK)
-- ============================================================================
CREATE TABLE attachments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_type      attachment_owner_type NOT NULL,
    owner_id        UUID NOT NULL,
    file_name       VARCHAR(255) NOT NULL,
    file_path       VARCHAR(500) NOT NULL,
    file_type       VARCHAR(50),
    file_size_bytes BIGINT,
    uploaded_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- End of core schema. See 02_constraints.sql, 03_indexes.sql for the rest.
-- ============================================================================
