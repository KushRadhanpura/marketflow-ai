# MarketFlow AI

MarketFlow AI is an agentic marketing-ops assistant for SMBs. It turns a business brief into a structured campaign workflow, generates strategy and content with LangGraph-orchestrated agents, analyzes deterministic campaign metrics, and recommends the next optimized campaign plan.

## Problem
SMB owners often need to move from a marketing goal to an actual campaign workflow without hiring a full marketing operations team. Simple prompt-to-caption tools do not provide a repeatable planning, tracking, and optimization loop.

## Solution
MarketFlow AI provides a structured workflow:

Goal -> Strategy -> Content -> Campaign -> Analytics -> Optimization -> Next Campaign

The MVP uses simulated/demo campaign execution data, deterministic analytics, and a modular backend architecture that can later connect to publishing APIs.

## Features
- Landing page and SaaS-style dashboard
- Multi-step campaign creation flow
- Backend API for businesses, campaigns, analytics, dashboard, and agent workflow generation
- LangGraph-based specialized agents
- Deterministic analytics in Python
- Demo seed data for immediate review
- PostgreSQL-compatible SQLAlchemy models with SQLite fallback
- FastAPI automatic API docs at `/docs`
- Responsive frontend with campaign detail pages

## Tech Stack
- Frontend: Next.js, TypeScript, Tailwind CSS, Recharts
- Backend: FastAPI, SQLAlchemy, Pydantic, LangGraph
- Database: PostgreSQL-compatible schema, SQLite for local development
- Tooling: pytest, Alembic, npm

## Project Structure
- `frontend/`: Next.js application
- `backend/`: FastAPI application, agents, analytics, tests, and seed script
- `docs/`: architecture notes and workflow documentation

## Setup
### Backend
```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Demo Data
```bash
cd backend
.venv/bin/python seed_demo.py
```

### Docker
```bash
docker compose up --build
```

This starts PostgreSQL, the FastAPI backend, and the Next.js frontend.

## Environment Variables
Copy `.env.example` to `.env` and configure:
- `LLM_API_KEY`
- `LLM_MODEL`
- `DATABASE_URL`
- `NEXT_PUBLIC_API_URL`

## Running Tests
### Backend
```bash
cd backend
.venv/bin/pytest app/tests -q
```

### Frontend
```bash
cd frontend
npm test
npm run build
```

The frontend uses Vitest for helper and API tests, and the Next.js build still provides a production compile check.

## API Documentation
FastAPI exposes interactive docs at:
- `http://localhost:8000/docs`
- `http://localhost:8000/redoc`

Additional project docs:
- `docs/architecture.md`
- `docs/agent-workflow.md`
- `docs/api.md`

## Deployment Notes
- Backend can run behind Uvicorn or Gunicorn/Uvicorn workers.
- Frontend can be deployed on Vercel or a Node.js hosting platform.
- PostgreSQL should be used in production.
- Demo mode should remain available for review and testing.

## Limitations
- No live social publishing integrations in the MVP.
- No authentication or RBAC yet.
- ROI is not calculated from revenue because revenue is not part of the current data model.

## Roadmap
- Add richer campaign creation review and editing
- Expand deterministic demo metrics generation
- Add optional authentication
- Add containerized Docker Compose deployment
- Add more visualization views in the frontend
