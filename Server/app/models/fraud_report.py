from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base
import datetime

class FraudReport(Base):
    __tablename__ = "fraud_reports"
    id = Column(Integer, primary_key=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id"))
    campaign_id = Column(Integer, ForeignKey("campaigns.id"))
    reason = Column(Text, nullable=False)
    status = Column(String, default="pending")  # pending, reviewed, resolved
    reported_at = Column(DateTime, default=datetime.datetime.utcnow)
