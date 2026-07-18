# Stage 1: Builder
FROM python:3.11-slim AS builder

WORKDIR /app

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .

# Install all requirements cleanly
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim

# Create a non-root user
RUN groupadd -r sentinelx && useradd -r -g sentinelx sentinelx

WORKDIR /app

# Install native dependencies required for LightGBM and XGBoost
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
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

# Render defaults to 10000
ENV PORT=10000
EXPOSE $PORT

CMD ["sh", "-c", "uvicorn api.inference_api:app --host 0.0.0.0 --port $PORT"]
