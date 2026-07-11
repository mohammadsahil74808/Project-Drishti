# store/

Zustand global state slices (auth/session, active filters, alert feed). Used only
for genuinely cross-page state — page-local state stays in components via `useState`.
