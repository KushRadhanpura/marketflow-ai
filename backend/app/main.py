from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.businesses import router as businesses_router
from app.api.analytics import router as analytics_router
from app.api.agents import router as agents_router
from app.api.campaigns import router as campaigns_router
from app.api.dashboard import router as dashboard_router
from app.config import get_settings
from app.database.base import Base
from app.database.session import engine
from app.models import *  # noqa: F401,F403

settings = get_settings()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="MarketFlow AI backend for campaign planning, analytics, and optimization.",
)

# Allow all origins when cors_allow_all is set (Render / Vercel deployments).
# In development the explicit list of localhost origins is used.
_allow_origins = ["*"] if settings.cors_allow_all else settings.cors_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allow_origins,
    allow_credentials=not settings.cors_allow_all,  # credentials cannot be combined with *
    allow_methods=["*"],
    allow_headers=["*"],
)

# Standard prefix registrations (e.g. /api)
app.include_router(campaigns_router, prefix=settings.api_v1_prefix)
app.include_router(businesses_router, prefix=settings.api_v1_prefix)
app.include_router(analytics_router, prefix=settings.api_v1_prefix)
app.include_router(dashboard_router, prefix=settings.api_v1_prefix)
app.include_router(agents_router, prefix=settings.api_v1_prefix)

# Fallback prefix registrations without the /api prefix, to prevent 404 router mismatch
if settings.api_v1_prefix != "":
    app.include_router(campaigns_router, prefix="")
    app.include_router(businesses_router, prefix="")
    app.include_router(analytics_router, prefix="")
    app.include_router(dashboard_router, prefix="")
    app.include_router(agents_router, prefix="")


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
