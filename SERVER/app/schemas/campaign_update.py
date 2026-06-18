from pydantic import BaseModel, ConfigDict
from datetime import datetime


class CampaignUpdateCreate(BaseModel):
    title: str
    content: str


class CampaignUpdateRead(CampaignUpdateCreate):
    id: int
    campaign_id: int
    author_id: int | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)