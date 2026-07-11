# Branch Strategy

We use a simplified **GitHub Flow** — easy for a small hackathon team, safe for a production-track project.

## Branches
- `main` — always deployable. Protected. No direct pushes.
- `develop` — integration branch where feature branches merge before release to `main`.
- `feature/<short-description>` — one branch per feature. Example: `feature/crime-heatmap-api`
- `fix/<short-description>` — bug fixes. Example: `fix/jwt-refresh-expiry`
- `docs/<short-description>` — documentation-only changes.
- `chore/<short-description>` — tooling, CI, dependency bumps.

## Workflow
1. Branch off `develop`: `git checkout -b feature/crime-heatmap-api develop`
2. Commit using **Conventional Commits**:
   - `feat: add heatmap aggregation endpoint`
   - `fix: correct PostGIS distance query units`
   - `docs: update setup guide for Redis`
   - `chore: bump fastapi version`
   - `refactor: extract risk scoring into service layer`
   - `test: add unit tests for forecast ensemble`
3. Open a Pull Request into `develop`. Fill the PR template (`.github/PULL_REQUEST_TEMPLATE.md`).
4. At least one teammate review required before merge (self-review acceptable for solo submission phases, but describe testing done).
5. `develop` → `main` merges happen only at stable milestones (e.g., before each datathon submission checkpoint).

## Rules
- Never commit directly to `main` or `develop`.
- Never commit `.env`, credentials, or large binary/model files (use `.gitignore`).
- Squash-merge feature branches to keep `develop` history clean.
- Tag releases on `main`: `v0.1.0-scaffold`, `v0.2.0-backend-core`, etc.
