FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Catalyst provides the port dynamically via X_ZOHO_CATALYST_LISTEN_PORT
# We use a shell form for CMD so the environment variable is evaluated
CMD sh -c "uvicorn api.inference_api:app --host 0.0.0.0 --port $X_ZOHO_CATALYST_LISTEN_PORT"
