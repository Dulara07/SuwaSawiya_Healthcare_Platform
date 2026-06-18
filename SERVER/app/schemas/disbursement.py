from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class DisbursementCreate(BaseModel):
    amount: float
    bank_account_number: Optional[str] = None
    bank_name: Optional[str] = None


class DisbursementRead(DisbursementCreate):
    id: int
    campaign_id: int
    requested_by_id: Optional[int] = None
    approved_by_id: Optional[int] = None
    status: str
    approval_notes: Optional[str] = None
    requested_at: datetime
    approved_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)