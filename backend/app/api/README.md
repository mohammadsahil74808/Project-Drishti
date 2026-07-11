# api/

HTTP route layer, versioned by subfolder (`v1/`). Route handlers stay thin: parse
request, call a `services/` function, return response. No business logic or DB queries
directly in this layer — that keeps routes trivially testable and versioning painless.
