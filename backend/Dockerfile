# Stage 1: Builder
FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .

# Install all requirements cleanly (ML dependencies have been removed)
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt gunicorn

# Aggressive cleanup of the virtual environment to minimize size
RUN find /opt/venv -type d -name "__pycache__" -exec rm -r {} + && \
    find /opt/venv -name "*.pyc" -delete && \
    find /opt/venv -name "*.pyo" -delete && \
    rm -rf /opt/venv/lib/python*/site-packages/pip && \
    rm -rf /opt/venv/lib/python*/site-packages/setuptools && \
    rm -rf /opt/venv/lib/python*/site-packages/wheel

# Stage 2: Runtime
FROM python:3.11-slim

# Create a non-root user
RUN groupadd -r sentinelx && useradd -r -g sentinelx sentinelx

WORKDIR /app

# Install ONLY runtime system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy application code
COPY . /app

# Final cleanup of app code
RUN find /app -type d -name "__pycache__" -exec rm -r {} + && \
    find /app -name "*.pyc" -delete

# Change ownership to non-root user
RUN chown -R sentinelx:sentinelx /app
USER sentinelx

EXPOSE 8000

# Use Gunicorn with Uvicorn workers, dynamically binding to Zoho Catalyst's port
CMD sh -c "gunicorn app.main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --timeout 60 --bind 0.0.0.0:${X_ZOHO_CATALYST_LISTEN_PORT:-8000}"
