from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CampaignBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    objective: str = Field(min_length=1)
    duration: int = Field(gt=0, le=365)
    budget: float = Field(ge=0)
    status: str = Field(default="draft", max_length=50)


class CampaignCreate(CampaignBase):
    business_id: int = Field(gt=0)


class CampaignUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=255)
    objective: str | None = None
    duration: int | None = Field(default=None, gt=0, le=365)
    budget: float | None = Field(default=None, ge=0)
    status: str | None = Field(default=None, max_length=50)


class CampaignRead(CampaignBase):
    id: int
    business_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
