# Installation Guide (Manual / Non-Docker Setup)

Use this only if you need to run a service outside Docker (e.g. for debugging).

## Backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example ../.env       # if not already done
uvicorn app.main:app --reload
```
API available at http://localhost:8000 — Swagger UI at `/docs`.

## Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
App available at http://localhost:5173

## Database (PostgreSQL + PostGIS) without Docker
1. Install PostgreSQL 15+ locally (free): https://www.postgresql.org/download/
2. Enable PostGIS extension: `CREATE EXTENSION postgis;`
3. Create database matching `POSTGRES_DB` in `.env`
4. Run migrations (once Alembic is configured in a later phase):
   `alembic upgrade head`

## Redis without Docker
Install Redis (free): https://redis.io/download — run `redis-server`.

## Verifying Installation
- Backend health check: `GET http://localhost:8000/health` (added in later phase)
- Frontend loads without console errors
- `docker compose ps` shows all services healthy (Docker path)
