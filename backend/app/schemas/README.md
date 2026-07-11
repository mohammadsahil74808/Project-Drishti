# schemas/

Pydantic models defining API request/response shapes. Kept separate from `models/`
(ORM) so the database structure can evolve independently of what the API exposes —
e.g. hiding internal fields like `name_hash` from API responses.
