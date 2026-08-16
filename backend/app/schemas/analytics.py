from datetime import date

from pydantic import BaseModel, Field


class MetricTotals(BaseModel):
    impressions: int = 0
    reach: int = 0
    engagements: int = 0
    clicks: int = 0
    conversions: int = 0
    spend: float = 0.0
    engagement_rate: float = 0.0
    ctr: float = 0.0
    conversion_rate: float = 0.0
    cost_per_conversion: float = 0.0
    roi: float = 0.0


class ChannelPerformanceItem(BaseModel):
    channel: str
    impressions: int
    reach: int
    engagements: int
    clicks: int
    conversions: int
    spend: float
    engagement_rate: float
    ctr: float
    conversion_rate: float
    cost_per_conversion: float
    roi: float


class ContentPerformanceItem(BaseModel):
    content_item_id: int | None = None
    label: str
    impressions: int
    engagements: int
    clicks: int
    conversions: int
    engagement_rate: float
    ctr: float
    conversion_rate: float
    spend: float


class AnalyticsSummary(BaseModel):
    campaign_id: int
    start_date: date | None = None
    end_date: date | None = None
    totals: MetricTotals
    channel_performance: list[ChannelPerformanceItem] = Field(default_factory=list)
    content_performance: list[ContentPerformanceItem] = Field(default_factory=list)
    best_channel: str | None = None
    best_content_type: str | None = None
