from pydantic import BaseModel, Field

from app.schemas.analytics import ChannelPerformanceItem, MetricTotals
from app.schemas.campaign import CampaignRead
from app.schemas.recommendation import RecommendationRead


class DashboardSummary(BaseModel):
    active_campaigns: int = 0
    totals: MetricTotals = Field(default_factory=MetricTotals)
    channel_performance: list[ChannelPerformanceItem] = Field(default_factory=list)
    recent_recommendations: list[RecommendationRead] = Field(default_factory=list)
    recent_campaigns: list[CampaignRead] = Field(default_factory=list)
