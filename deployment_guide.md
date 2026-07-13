# SentinelX AI: Production Deployment Guide

This document outlines the architecture and deployment strategies for running SentinelX AI in a production environment. All configurations refer to the scaffolding generated in Phase 6.

## 1. Architecture Overview
SentinelX AI can be deployed via **Platform-as-a-Service (PaaS)** (Vercel + Render) or via **Infrastructure-as-a-Service (IaaS)** (Self-hosted Docker Compose). 

* **Frontend**: React (Vite), tailwindcss, ECharts.
* **Backend**: FastAPI, Gunicorn, Uvicorn Workers.
* **Worker**: Celery (Background Tasks).
* **Database**: PostgreSQL 15 + PostGIS.
* **Cache/Broker**: Redis.

## 2. Option A: Self-Hosted Docker Compose (IaaS)

The `docker-compose.prod.yml` file is designed for a single-VM deployment (e.g., AWS EC2, DigitalOcean Droplet, Azure VM).

### 2.1 Prerequisites
* A Linux VM with Docker and Docker Compose v2 installed.
* Ports `80` (HTTP), `443` (HTTPS), and `22` (SSH) open in the firewall.

### 2.2 Execution
1. Clone the repository to your server.
2. Copy `.env.production.example` to `.env.production` and fill in secure passwords.
3. Build and launch:
   ```bash
   docker compose -f docker-compose.prod.yml build
   docker compose -f docker-compose.prod.yml up -d
   ```

### 2.3 Nginx, HTTPS, and Certbot
The provided `nginx/default.conf` listens on port `80`. For production, you must terminate SSL. 
* We recommend setting up **Certbot/Let's Encrypt** alongside Nginx.
* Alternatively, if placing this VM behind an AWS ALB or Cloudflare, terminate SSL at the Load Balancer, and forward traffic to port `80`.

## 3. Option B: Platform-as-a-Service (Recommended)

### 3.1 Render.com (Backend & Database)
The provided `render.yaml` defines the Infrastructure-as-Code for Render.
1. Connect your GitHub repository to Render.
2. In the Render Dashboard, click **Blueprints > New Blueprint Instance** and select your repository.
3. Render will automatically provision:
   * A managed PostgreSQL database (`sentinelx-db`).
   * A managed Redis instance (`sentinelx-redis`).
   * A FastAPI Web Service (`sentinelx-backend`) running `Dockerfile.prod`.
   * A Celery Worker (`sentinelx-worker`) running `Dockerfile.prod`.

### 3.2 Vercel (Frontend)
The provided `frontend/vercel.json` ensures that client-side routing works flawlessly.
1. Connect your GitHub repository to Vercel.
2. Set the Framework Preset to **Vite**.
3. Set the Root Directory to `frontend`.
4. Add the `VITE_API_BASE_URL` environment variable pointing to your Render backend URL (e.g., `https://sentinelx-backend.onrender.com/api/v1`).
5. Deploy. Vercel's Edge Network will serve the static assets and terminate HTTPS automatically.

## 4. External Services

### 4.1 Neon PostgreSQL
If you choose not to use Render's database, we highly recommend **Neon.tech** for serverless PostgreSQL.
* Create a project and ensure the **PostGIS** extension is enabled: `CREATE EXTENSION postgis;`
* Copy the connection string to your `DATABASE_URL`. Neon handles connection pooling out of the box.

### 4.2 Upstash Redis
If you choose not to use Render's Redis, use **Upstash**.
* Create a database, copy the `rediss://` string to `REDIS_URL`. Upstash provides serverless billing and high availability.

## 5. Health Checks & Monitoring
The backend API exposes explicit health checks designed for Load Balancers and uptime monitors (e.g., Datadog, UptimeRobot, Pingdom):
* `/health` — App Server status
* `/health/db` — Executes `SELECT 1` to verify PostgreSQL latency.
* `/health/redis` — Executes `PING` to verify Broker availability.
* `/health/ai` — Verifies PyTorch models are loaded in `app.state`.

### 5.1 Logging
The Docker Compose setup uses the `json-file` logging driver with strict rotation (`max-size: 50m`, `max-file: 5`) to prevent disk overflow. For advanced setups, configure Promtail to ship logs to a Loki/Grafana cluster.

### 5.2 Backup Strategy
For self-hosted databases, set up a cron job to dump the database and push to S3:
```bash
0 3 * * * docker exec sentinelx-db-prod pg_dump -U sentinelx_prod sentinelx_prod_db | gzip > /tmp/db_backup.sql.gz && aws s3 cp /tmp/db_backup.sql.gz s3://your-bucket-name/backups/$(date +\%Y\%m\%d).sql.gz
```
Managed databases (Neon, Render) provide point-in-time recovery (PITR) automatically.
