from pydantic import BaseModel, Field

from app.agents.state import AnalyticsInsight, BusinessContext, CampaignDayPlan, ContentCreative, MarketingStrategy, OptimizationRecommendation
from app.schemas.analytics import AnalyticsSummary


class CampaignGenerationResponse(BaseModel):
    campaign_id: int
    business_context: BusinessContext
    strategy: MarketingStrategy
    campaign_plan: list[CampaignDayPlan] = Field(default_factory=list)
    content_items: list[ContentCreative] = Field(default_factory=list)
    analytics: AnalyticsSummary
    insights: AnalyticsInsight
    recommendations: list[OptimizationRecommendation] = Field(default_factory=list)
    workflow_steps: list[str] = Field(default_factory=list)
