import os
import re

files_to_dump = [
    "backend/run.py",
    "backend/app/main.py",
    "backend/alembic.ini",
    "backend/app/db/migrations/env.py",
    "backend/app/db/migrations/versions/de379822be81_initial_schema.py",
    "backend/app/db/session.py",
    "backend/app/db/base.py",
    "backend/app/models/user.py",
    "backend/app/core/config.py",
    "backend/Dockerfile",
    "docker-compose.yml",
    "docker-compose.prod.yml",
    "backend/app-config.json",
    "catalyst.json",
    "render.yaml",
    "backend/requirements.txt"
]

with open('dump.txt', 'w', encoding='utf-8') as out:
    for f in files_to_dump:
        out.write(f"\n==================================================\n")
        out.write(f"FILE: {f}\n")
        out.write(f"==================================================\n\n")
        try:
            with open(f, 'r', encoding='utf-8') as infile:
                out.write(infile.read())
        except Exception as e:
            out.write(f"ERROR reading {f}: {e}\n")
