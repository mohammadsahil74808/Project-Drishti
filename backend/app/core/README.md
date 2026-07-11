# core/

Cross-cutting concerns shared by the entire backend: configuration loading (`config.py`),
security utilities (JWT encode/decode, password hashing), and shared FastAPI dependencies
(e.g. `get_current_user`). Nothing feature-specific lives here — only plumbing every
other module relies on.
