from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class BusinessBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    category: str = Field(min_length=1, max_length=120)
    description: str | None = None
    target_audience: str = Field(min_length=1)


class BusinessCreate(BusinessBase):
    pass


class BusinessRead(BusinessBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
