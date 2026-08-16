from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RecommendationBase(BaseModel):
    category: str = Field(min_length=1, max_length=120)
    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1)
    reason: str = Field(min_length=1)
    priority: str = Field(default="medium", max_length=50)


class RecommendationCreate(RecommendationBase):
    campaign_id: int = Field(gt=0)


class RecommendationRead(RecommendationBase):
    id: int
    campaign_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
