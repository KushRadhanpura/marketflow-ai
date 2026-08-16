from typing import TypedDict
from typing import Any

from pydantic import BaseModel, Field

from app.schemas.analytics import AnalyticsSummary
from app.schemas.business import BusinessRead
from app.schemas.campaign import CampaignRead


class BusinessContext(BaseModel):
    business_summary: str
    target_audience: str
    primary_goal: str
    constraints: list[str] = Field(default_factory=list)
    success_metrics: list[str] = Field(default_factory=list)


class MarketingStrategy(BaseModel):
    strategy: str
    positioning: str
    content_pillars: list[str] = Field(default_factory=list)
    kpis: list[str] = Field(default_factory=list)
    channel_strategy: list[str] = Field(default_factory=list)


class ContentCreative(BaseModel):
    day: int
    channel: str
    content_type: str
    objective: str
    hook: str
    caption: str
    cta: str
    creative_brief: str


class CampaignDayPlan(BaseModel):
    day: int
    channel: str
    content_type: str
    objective: str
    hook: str
    caption: str
    cta: str
    creative_brief: str


class AnalyticsInsight(BaseModel):
    summary: str
    best_channel: str | None = None
    best_content_type: str | None = None
    risks: list[str] = Field(default_factory=list)
    trends: list[str] = Field(default_factory=list)


class OptimizationRecommendation(BaseModel):
    category: str
    title: str
    description: str
    reason: str
    priority: str = "medium"


class MarketingState(TypedDict, total=False):
    campaign_record: Any
    campaign: CampaignRead
    business: BusinessRead
    business_context: BusinessContext
    strategy: MarketingStrategy
    content_items: list[ContentCreative]
    campaign_plan: list[CampaignDayPlan]
    analytics: AnalyticsSummary
    insights: AnalyticsInsight
    recommendations: list[OptimizationRecommendation]
