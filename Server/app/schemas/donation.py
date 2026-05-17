from pydantic import BaseModel
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

    class Config:
        orm_mode = True
