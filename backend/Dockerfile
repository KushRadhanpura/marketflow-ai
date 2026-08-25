FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# curl is needed for the Docker healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY seed_demo.py ./seed_demo.py
COPY alembic ./alembic
COPY alembic.ini ./alembic.ini

EXPOSE 8000

HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# PORT is provided by Render; falls back to 8000 for local/Docker usage.
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
