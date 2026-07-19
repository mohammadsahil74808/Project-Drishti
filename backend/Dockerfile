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
    pip install --no-cache-dir -r requirements.txt

# Verification requested by user: fail the build if uvicorn is missing
RUN python -m pip show uvicorn
RUN python -m pip list

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

CMD ["/opt/venv/bin/python", "run.py"]
