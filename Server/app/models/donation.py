from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.models.base import Base
import datetime

class Donation(Base):
    __tablename__ = "donations"
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    donor_id = Column(Integer, ForeignKey("users.id"))
    campaign_id = Column(Integer, ForeignKey("campaigns.id"))
    is_anonymous = Column(Boolean, default=False)
    donated_at = Column(DateTime, default=datetime.datetime.utcnow)
    donor = relationship("User", back_populates="donations")
    campaign = relationship("Campaign", back_populates="donations")
