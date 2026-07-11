# Setup Guide

## Prerequisites (all free)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose on Linux)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/)
- Node.js 20+ (only needed if running frontend outside Docker)
- Python 3.11+ (only needed if running backend outside Docker)

## Quick Start (Docker — recommended)
1. Clone the repo: `git clone <repo-url> && cd sentinelx-ai`
2. Copy environment template: `cp .env.example .env` and fill in values
3. Start everything: `docker compose up --build`
4. Access:
   - Frontend: http://localhost:5173
   - Backend API docs (Swagger): http://localhost:8000/docs
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

## Recommended VS Code Extensions
- Python
- Pylance
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Docker
- GitLens

See `.vscode/extensions.json` (generated in a later phase) for the enforced list.

## Next Steps
Once the environment is running, proceed to `docs/INSTALLATION_GUIDE.md` for
service-specific (non-Docker) setup, and `docs/CODING_STANDARDS.md` before writing code.
