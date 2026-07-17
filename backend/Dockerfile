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

# Install all requirements using CPU-only index to strip heavy CUDA binaries natively
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt gunicorn --extra-index-url https://download.pytorch.org/whl/cpu

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

# Change ownership to non-root user
RUN chown -R sentinelx:sentinelx /app

# Switch to non-root user
USER sentinelx

EXPOSE 8000

# Use Gunicorn with Uvicorn workers, bound to Catalyst's dynamic port variable
CMD sh -c "gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --timeout 120 --bind 0.0.0.0:$X_ZOHO_CATALYST_LISTEN_PORT"
