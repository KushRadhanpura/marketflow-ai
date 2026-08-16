# MarketFlow AI Architecture

## Goal
Build a production-quality MVP for an Agentic Marketing-Ops Assistant that turns a business goal into a structured campaign workflow, tracks simulated campaign performance, and uses deterministic analytics plus agent recommendations to optimize the next campaign.

## Guiding Principles
- Treat the product as a workflow system, not a prompt-to-copy generator.
- Keep analytics deterministic in Python; let the LLM interpret results.
- Use structured Pydantic models for all important agent inputs and outputs.
- Keep the backend modular so real social platform integrations can be added later.
- Support demo/simulated data in MVP without claiming real publishing or live marketing execution.

## Planned System Layout

### Monorepo
- `backend/`: FastAPI application, database, analytics engine, agents, tests, seed script.
- `frontend/`: Next.js dashboard, campaign builder, detail views, charts, and settings.
- `docs/`: architecture, workflow, and API documentation.
- Root files: env template, gitignore, Docker Compose, top-level README.

### Backend Responsibilities
- FastAPI REST API for campaigns, dashboard, analytics, and agent orchestration.
- SQLAlchemy data layer with PostgreSQL as primary target and SQLite fallback for local development.
- LangGraph orchestration of specialized marketing agents.
- Pydantic schemas for validation and structured AI outputs.
- Deterministic analytics service for campaign metrics.
- Seed script to populate a demo business, campaigns, content items, metrics, and recommendations.
- Tests covering core analytics, API behavior, and workflow validation.

### Frontend Responsibilities
- Next.js dashboard and campaign management UI.
- Professional SaaS-style interface with reusable design system components.
- Multi-step campaign creation flow with visible agent workflow status.
- Campaign detail pages for strategy, content, analytics, and recommendations.
- Charts and KPI cards that render real API data from the backend.

## Backend Architecture Layers

### API Layer
- Route modules under `backend/app/api/`.
- Request/response schemas in `backend/app/schemas/`.
- No database logic in route handlers.

### Service Layer
- Campaign creation and orchestration services.
- Analytics service for KPI calculations.
- Recommendation and optimization services.
- LLM provider abstraction for interchangeable model backends.

### Agent Layer
- LangGraph state model in `backend/app/agents/state.py`.
- Specialized agents:
  - business understanding
  - strategy
  - content generation
  - campaign planning
  - analytics interpretation
  - optimization
- Graph coordinator in `backend/app/agents/graph.py`.

### Data Layer
- SQLAlchemy models in `backend/app/models/`.
- Database session and engine setup in `backend/app/database/`.
- PostgreSQL-compatible schema with SQLite development fallback.

## Agent Workflow
1. Business Understanding Agent parses the business brief into structured context.
2. Marketing Strategist Agent produces positioning, content pillars, KPIs, and channel strategy.
3. Content Agent generates structured campaign content ideas and creative briefs.
4. Campaign Planner Agent turns content into a 7-14 day executable calendar.
5. Deterministic analytics calculate campaign KPIs from demo or seeded data.
6. Analytics Agent interprets the numbers and identifies patterns.
7. Optimization Agent recommends next-step improvements based on measured performance.

## Data Flow
- User submits campaign brief from the frontend.
- Backend validates request and persists campaign records.
- LangGraph workflow generates strategy, content, and campaign schedule.
- Demo metrics are stored or loaded for analytics.
- Analytics service computes KPIs.
- LLM interprets analytics and generates recommendations.
- Frontend displays the results and the optimization loop.

## Planned Database Entities
- `businesses`
- `campaigns`
- `campaign_strategies`
- `content_items`
- `campaign_metrics`
- `recommendations`

## Demo Mode
- Seed data will create one realistic demo business and multiple campaigns.
- Simulated metrics will be intentionally varied so analytics can surface meaningful patterns.
- UI labels will clearly identify simulated data where applicable.

## Deployment Targets
- Local development with Docker Compose.
- Backend container with FastAPI/Uvicorn.
- Frontend container with Next.js.
- PostgreSQL container for local production-like development.

## Phase Plan
1. Create repository structure and architecture docs.
2. Build backend foundation.
3. Implement deterministic analytics.
4. Add LangGraph agent orchestration.
5. Seed realistic demo data.
6. Build the frontend and connect APIs.
7. Polish UX, error handling, and responsiveness.
8. Add tests, documentation, and deployment configuration.

## Non-Goals for MVP
- Real social media publishing APIs.
- Billing, RBAC, or enterprise multi-tenancy.
- Microservice decomposition.
- Event buses or unnecessary infrastructure.
- Hard-coded fake production behavior.
