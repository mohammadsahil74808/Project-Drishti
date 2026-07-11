# api/

Typed API client (Axios instance + per-resource functions) — the single place that
talks to the backend. Components never call `fetch`/`axios` directly; they call
functions exported from here. Makes swapping/mocking the API trivial for tests.
