# Stage 1: Builder
FROM python:3.11-slim AS builder

WORKDIR /app

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .

# Install all requirements using CPU-only index to strip heavy CUDA binaries natively
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu

# Stage 2: Runtime
FROM python:3.11-slim

# Create a non-root user
RUN groupadd -r sentinelx && useradd -r -g sentinelx sentinelx

WORKDIR /app

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy application code
COPY . /app

# Change ownership to non-root user
RUN chown -R sentinelx:sentinelx /app

# Switch to non-root user
USER sentinelx

# Catalyst provides the port dynamically via X_ZOHO_CATALYST_LISTEN_PORT
CMD sh -c "uvicorn api.inference_api:app --host 0.0.0.0 --port $X_ZOHO_CATALYST_LISTEN_PORT"
