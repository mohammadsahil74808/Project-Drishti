# workers/

Celery background jobs: nightly forecast retraining, periodic alert-rule evaluation,
PDF report generation, and any other task too slow to run on the request/response
cycle. `celery_app.py` configures the Celery app (Redis as broker); `tasks.py` (added
in implementation phase) defines individual jobs.
