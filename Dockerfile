# Use official Python runtime as base image
FROM python:3.11-slim

# Set working directory in container
WORKDIR /app

# Install system dependencies for psycopg2 and build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip to latest version
RUN pip install --no-cache-dir --upgrade pip

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (dynamic - Render uses $PORT)
EXPOSE 10000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s \
    --retries=3 CMD python -c "import urllib.request; \
    urllib.request.urlopen('http://localhost:${PORT:-10000}/healthz').read()"

# Run FastAPI with uvicorn
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-10000}"]
