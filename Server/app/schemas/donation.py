from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class DonationBase(BaseModel):
    amount: float
    campaign_id: int
    is_anonymous: Optional[bool] = False

class DonationCreate(DonationBase):
    pass

class DonationRead(DonationBase):
    id: int
    donor_id: int
    donated_at: datetime

    model_config = ConfigDict(from_attributes=True)
