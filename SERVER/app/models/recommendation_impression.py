from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.models.base import Base
import datetime


class RecommendationImpression(Base):
    __tablename__ = "recommendation_impressions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=False, index=True)
    rank_position = Column(Integer, nullable=False)
    reason_tags = Column(Text, nullable=True)
    source = Column(String, default="ml")
    session_id = Column(String, nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    user = relationship("User")
    campaign = relationship("Campaign")