from pydantic import BaseModel, constr, ConfigDict
from typing import Optional, List
from datetime import datetime

class CampaignBase(BaseModel):
    title: constr(min_length=3, max_length=100)
    description: str
    category: Optional[str] = None
    beneficiary_name: Optional[str] = None
    beneficiary_age: Optional[int] = None
    beneficiary_medical_condition: Optional[str] = None
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
    documents: Optional[List['DocumentRead']] = None
    updates: Optional[List['CampaignUpdateRead']] = None

    model_config = ConfigDict(from_attributes=True)

from app.schemas.document import DocumentRead
from app.schemas.campaign_update import CampaignUpdateRead
CampaignRead.update_forward_refs()
