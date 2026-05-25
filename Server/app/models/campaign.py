from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base
import datetime

class Campaign(Base):
    __tablename__ = "campaigns"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=True)
    beneficiary_name = Column(String, nullable=True)
    beneficiary_age = Column(Integer, nullable=True)
    beneficiary_medical_condition = Column(Text, nullable=True)
    medical_urgency = Column(Integer, nullable=False)  # 1-5 scale
    time_sensitivity = Column(Integer, nullable=False)  # 1-5 scale
    target_amount = Column(Float, nullable=False)
    raised_amount = Column(Float, default=0.0)
    status = Column(String, default="pending")  # pending, approved, rejected, completed
    priority_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="campaigns")
    documents = relationship("Document", back_populates="campaign")
    donations = relationship("Donation", back_populates="campaign")
