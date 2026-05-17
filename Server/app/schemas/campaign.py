from pydantic import BaseModel, constr
from typing import Optional, List
from datetime import datetime

class CampaignBase(BaseModel):
    title: constr(min_length=3, max_length=100)
    description: str
    medical_urgency: int
    time_sensitivity: int
    target_amount: float

class CampaignCreate(CampaignBase):
    pass

class CampaignRead(CampaignBase):
    id: int
    raised_amount: float
    status: str
    priority_score: float
    created_at: datetime
    updated_at: datetime
    owner_id: int
    documents: Optional[List['DocumentRead']]

    class Config:
        orm_mode = True

from app.schemas.document import DocumentRead
CampaignRead.update_forward_refs()
