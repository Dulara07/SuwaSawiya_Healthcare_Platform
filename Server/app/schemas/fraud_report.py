from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional
from datetime import datetime

class FraudReportBase(BaseModel):
    campaign_id: int
    reason: str

class FraudReportCreate(FraudReportBase):
    pass

class FraudReportResolve(BaseModel):
    verdict: str  # "confirmed" or "dismissed"

    @field_validator("verdict")
    @classmethod
    def validate_verdict(cls, value: str) -> str:
        if value not in {"confirmed", "dismissed"}:
            raise ValueError("verdict must be 'confirmed' or 'dismissed'")
        return value

class FraudReportRead(FraudReportBase):
    id: int
    reporter_id: int
    status: str
    resolution: Optional[str] = None
    reported_at: datetime

    model_config = ConfigDict(from_attributes=True)
