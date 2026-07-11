# Coding Standards

## Python (Backend)
- Follow **PEP 8**. Enforce with `ruff` (linter) and `black` (formatter) — both free.
- Type hints are mandatory on all function signatures.
- Use **Pydantic v2 models** for all request/response schemas — never pass raw dicts across layers.
- Business logic belongs in `app/services/`, never directly in route handlers (`app/api/`).
- Every AI/ML module must expose a pure function interface (input → output) so it can be
  unit-tested without spinning up the API.
- Docstrings (Google style) required on all public functions/classes.
- No bare `except:` — always catch specific exceptions.

## TypeScript (Frontend)
- **Strict mode** enabled in `tsconfig.json` — no `any` unless explicitly justified with a comment.
- Functional components only, with hooks. No class components.
- One component per file; file name matches component name (PascalCase).
- Co-locate component-specific types in the same file; shared types go in `src/types/`.
- All API calls go through `src/api/` — components never call `fetch`/`axios` directly.
- Global state (Zustand) only for cross-page state; local state (`useState`) for everything else.

## General
- Commits follow **Conventional Commits** (see `docs/BRANCH_STRATEGY.md`).
- No secrets, API keys, or credentials committed — ever. Use `.env` (gitignored).
- Every new folder/module ships with a `README.md` explaining its purpose.
- Write tests alongside features, not after — minimum: one happy-path + one failure-path test per endpoint/service.
- Prefer explicit, readable code over clever one-liners. This is a police-grade system —
  auditability matters more than brevity.

## Linting/Formatting Commands
```bash
# Backend
ruff check backend/app
black backend/app

# Frontend
npm run lint --prefix frontend
npm run format --prefix frontend
```
