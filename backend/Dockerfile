FROM python:3.11-slim

# Create a non-root user
RUN groupadd -r sentinelx && useradd -r -g sentinelx sentinelx

WORKDIR /app

# System deps needed for psycopg2 / geo libs / build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
# We need gunicorn for production
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy all required modules (Catalyst sets build context to the backend folder)
COPY . /app

# Change ownership to non-root user
RUN chown -R sentinelx:sentinelx /app

# Switch to non-root user
USER sentinelx

EXPOSE 8000

# Use Gunicorn with Uvicorn workers, bound to Catalyst's dynamic port variable
CMD sh -c "gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --timeout 120 --bind 0.0.0.0:$X_ZOHO_CATALYST_LISTEN_PORT"
