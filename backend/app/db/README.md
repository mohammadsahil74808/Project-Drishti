# db/

Database session management (`session.py`) and Alembic migration environment
(`migrations/`). All schema changes must go through a migration — no manual `ALTER
TABLE` in production/demo environments, to keep history auditable (important for a
police-grade system).
