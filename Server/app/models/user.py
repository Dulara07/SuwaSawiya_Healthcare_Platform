from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from app.models.base import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, nullable=False)  # 'donor', 'patient', 'partner', 'admin'
    is_active = Column(Boolean, default=True)
    registration_status = Column(String, default="approved")  # pending, approved, rejected
    total_donated = Column(Float, default=0)
    donation_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    # Relationships
    campaigns = relationship("Campaign", back_populates="owner")
    donations = relationship("Donation", back_populates="donor")
