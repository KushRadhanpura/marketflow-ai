from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CampaignStrategyBase(BaseModel):
    strategy: str = Field(min_length=1)
    positioning: str = Field(min_length=1)
    content_pillars: list[str] = Field(default_factory=list)
    kpis: list[str] = Field(default_factory=list)
    channel_strategy: list[str] = Field(default_factory=list)


class CampaignStrategyCreate(CampaignStrategyBase):
    campaign_id: int = Field(gt=0)


class CampaignStrategyRead(CampaignStrategyBase):
    id: int
    campaign_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
