from pydantic import BaseModel, ConfigDict, Field


class ContentItemBase(BaseModel):
    day: int = Field(gt=0)
    channel: str = Field(min_length=1, max_length=120)
    content_type: str = Field(min_length=1, max_length=120)
    objective: str = Field(min_length=1, max_length=255)
    hook: str = Field(min_length=1)
    caption: str = Field(min_length=1)
    cta: str = Field(min_length=1)
    creative_brief: str = Field(min_length=1)
    status: str = Field(default="planned", max_length=50)


class ContentItemCreate(ContentItemBase):
    campaign_id: int = Field(gt=0)


class ContentItemRead(ContentItemBase):
    id: int
    campaign_id: int

    model_config = ConfigDict(from_attributes=True)
