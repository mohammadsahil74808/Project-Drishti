# Frontend — Project Drishti (React + Vite + TypeScript + Tailwind)

Role-based command dashboards, live crime map, AI assistant chat, and analytics views.

## Structure
| Folder | Purpose |
|---|---|
| `src/components/` | Reusable UI, organized by domain (map, charts, dashboard, assistant, ui) |
| `src/pages/` | Route-level views composed from components |
| `src/store/` | Zustand global state slices |
| `src/api/` | Typed API client — the only place `fetch` is called |
| `src/hooks/` | Custom React hooks |
| `src/types/` | Shared TypeScript types/interfaces |

## Why this structure?
Domain-organized components (not one giant `components/` dump) keep the map, charting,
and dashboard code independently navigable as the platform grows past a hackathon demo
into something a real engineering team could maintain.

## Run locally
See root `docs/SETUP_GUIDE.md`.
