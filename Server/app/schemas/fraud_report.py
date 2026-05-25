from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class FraudReportBase(BaseModel):
    campaign_id: int
    reason: str

class FraudReportCreate(FraudReportBase):
    pass

class FraudReportRead(FraudReportBase):
    id: int
    reporter_id: int
    status: str
    reported_at: datetime

    model_config = ConfigDict(from_attributes=True)
