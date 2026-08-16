# MarketFlow AI Backend

FastAPI backend for the MarketFlow AI MVP.

## Run Locally
```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Seed Demo Data
```bash
.venv/bin/python seed_demo.py
```

## Tests
```bash
.venv/bin/pytest app/tests -q
```

## Notes
- SQLite fallback is enabled for local development.
- PostgreSQL-compatible SQLAlchemy models and Alembic migrations are included.
- The agent workflow is powered by LangGraph.
