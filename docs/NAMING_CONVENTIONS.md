# Naming Conventions

## Python (Backend)
| Item | Convention | Example |
|---|---|---|
| Files/modules | `snake_case.py` | `risk_scoring.py` |
| Functions/variables | `snake_case` | `compute_risk_score()` |
| Classes | `PascalCase` | `class RiskScoreService` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RISK_SCORE = 100` |
| Pydantic schemas | `PascalCase` + suffix | `FIRCreateSchema`, `FIRResponseSchema` |
| SQLAlchemy models | `PascalCase` singular | `class FIRRecord` (table: `fir_records`) |
| API route files | `snake_case.py` matching resource | `missing_persons.py` |

## TypeScript (Frontend)
| Item | Convention | Example |
|---|---|---|
| Component files | `PascalCase.tsx` | `HeatmapLayer.tsx` |
| Non-component files | `camelCase.ts` | `apiClient.ts` |
| Component names | `PascalCase` | `function CrimeTrendChart()` |
| Variables/functions | `camelCase` | `fetchCrimeTrends()` |
| Types/interfaces | `PascalCase`, no `I` prefix | `interface CrimeRecord` |
| Zustand stores | `useXStore` | `useDashboardStore.ts` |
| CSS/Tailwind custom classes | `kebab-case` | `.command-map-panel` |

## Database
| Item | Convention | Example |
|---|---|---|
| Tables | `snake_case` plural | `fir_records`, `missing_persons` |
| Columns | `snake_case` | `incident_datetime` |
| Foreign keys | `<singular_table>_id` | `station_id`, `district_id` |
| Indexes | `ix_<table>_<column>` | `ix_fir_records_district_id` |

## API Endpoints
- Plural nouns, kebab-case for multi-word resources: `/api/v1/missing-persons`
- Nested resources reflect ownership: `/api/v1/fir/{id}/suspects`
- Versioned from day one: `/api/v1/...`

## Git Branches / Commits
See `docs/BRANCH_STRATEGY.md`.

## Environment Variables
`UPPER_SNAKE_CASE`, prefixed by concern where useful: `POSTGRES_*`, `REDIS_*`, `JWT_*`, `VITE_*`
(Vite requires the `VITE_` prefix for any variable exposed to frontend code.)
