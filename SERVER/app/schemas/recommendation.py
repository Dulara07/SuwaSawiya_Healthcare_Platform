from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict

from app.schemas.campaign import CampaignRead


class RecommendationItem(CampaignRead):
    score: float
    reason_tags: List[str] = []
    rank_position: int = 0
    source: str = "ml"
    fallback_used: bool = False

    model_config = ConfigDict(from_attributes=True)


class RecommendationImpressionCreate(BaseModel):
    user_id: Optional[int] = None
    campaign_id: int
    rank_position: int = 0
    reason_tags: List[str] = []
    source: str = "client"
    session_id: Optional[str] = None


class RecommendationBatchResponse(BaseModel):
    generated_at: datetime
    fallback_used: bool
    items: List[RecommendationItem]

    model_config = ConfigDict(from_attributes=True)