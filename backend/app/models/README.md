# models/

SQLAlchemy ORM models — one class per database table, mirroring the schema defined in
the project blueprint (users, fir_records, suspects, criminal_network_edges,
missing_persons, vehicles, crime_forecasts, risk_scores, hotspots, alerts, audit_log).
This is the single source of truth for DB structure; Alembic migrations are generated
from changes made here.
