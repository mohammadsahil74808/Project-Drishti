# Backend — SentinelX AI (FastAPI)

The API, business logic, AI/ML pipelines, and database layer for SentinelX AI.

## Structure
| Folder | Purpose |
|---|---|
| `app/core/` | Configuration, security (JWT), shared dependencies |
| `app/api/v1/` | Route handlers, versioned — thin layer, delegates to `services/` |
| `app/models/` | SQLAlchemy ORM models mirroring the database schema |
| `app/schemas/` | Pydantic request/response schemas |
| `app/services/` | Business logic — the "brain" between API and DB/AI layers |
| `app/ai/` | All AI/ML pipelines (forecasting, risk scoring, NLP, network, geo, assistant) |
| `app/workers/` | Celery background jobs (retraining, alerts, report generation) |
| `app/db/` | DB session management + Alembic migrations |
| `tests/` | Unit and integration tests |

## Why this structure?
Separating `api/` (routing) from `services/` (logic) from `ai/` (ML) means each layer can be
tested and swapped independently — e.g. an AI model can be upgraded without touching a single
route handler. This mirrors how production fintech/govtech backends are structured, and is
what distinguishes this from a typical single-file hackathon script.

## Run locally
See root `docs/SETUP_GUIDE.md`.
