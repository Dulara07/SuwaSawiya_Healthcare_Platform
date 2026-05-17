"""Campaign models"""
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.models import db


class Campaign(db.Model):
    """Medical fundraising campaign model"""
    __tablename__ = 'campaigns'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100), nullable=False)  # 'surgery', 'medication', 'treatment', 'emergency'
    urgency = db.Column(db.String(50), nullable=False)  # 'critical', 'high', 'medium', 'low'
    
    # Financial
    target_amount = db.Column(db.Float, nullable=False)
    funds_raised = db.Column(db.Float, default=0)
    status = db.Column(db.String(50), default='pending')  # 'pending', 'approved', 'rejected', 'completed', 'cancelled'
    
    # Beneficiary
    beneficiary_name = db.Column(db.String(255), nullable=False)
    beneficiary_age = db.Column(db.Integer)
    beneficiary_medical_condition = db.Column(db.Text)
    
    # Partner/Creator
    partner_id = db.Column(UUID(as_uuid=True), db.ForeignKey('partners.id'), nullable=True)
    
    # Images & Documents
    cover_image = db.Column(db.String(255))
    medical_document = db.Column(db.String(255))
    
    # Timeline
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deadline = db.Column(db.DateTime)
    
    # Relationships
    donations = db.relationship('Donation', backref='campaign', lazy=True, cascade='all, delete-orphan')
    documents = db.relationship('Document', backref='campaign', lazy=True, cascade='all, delete-orphan')
    disbursements = db.relationship('Disbursement', backref='campaign', lazy=True, cascade='all, delete-orphan')
    fraud_reports = db.relationship('FraudReport', backref='campaign', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, include_donations=False):
        """Convert to dictionary"""
        data = {
            'id': str(self.id),
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'urgency': self.urgency,
            'target_amount': self.target_amount,
            'funds_raised': self.funds_raised,
            'remaining_amount': self.target_amount - self.funds_raised,
            'status': self.status,
            'beneficiary_name': self.beneficiary_name,
            'beneficiary_age': self.beneficiary_age,
            'beneficiary_medical_condition': self.beneficiary_medical_condition,
            'partner_id': str(self.partner_id) if self.partner_id else None,
            'cover_image': self.cover_image,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'deadline': self.deadline.isoformat() if self.deadline else None,
            'progress_percentage': round((self.funds_raised / self.target_amount * 100), 2) if self.target_amount > 0 else 0,
        }
        
        if include_donations:
            data['donations'] = [d.to_dict() for d in self.donations]
        
        return data
    
    def get_progress_percentage(self):
        """Get campaign progress as percentage"""
        if self.target_amount == 0:
            return 0
        return round((self.funds_raised / self.target_amount * 100), 2)


class Donation(db.Model):
    """Donation model"""
    __tablename__ = 'donations'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    campaign_id = db.Column(UUID(as_uuid=True), db.ForeignKey('campaigns.id'), nullable=False)
    donor_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=True)
    
    amount = db.Column(db.Float, nullable=False)
    is_anonymous = db.Column(db.Boolean, default=False)
    
    status = db.Column(db.String(50), default='pending')  # 'pending', 'completed', 'failed', 'refunded'
    transaction_id = db.Column(db.String(255), unique=True)  # Payment gateway transaction ID
    
    # Message
    donor_message = db.Column(db.Text)
    
    # Timeline
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    # Relationships
    transaction = db.relationship('Transaction', backref='donation', uselist=False, lazy=True)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': str(self.id),
            'campaign_id': str(self.campaign_id),
            'donor_id': str(self.donor_id) if self.donor_id and not self.is_anonymous else None,
            'amount': self.amount,
            'is_anonymous': self.is_anonymous,
            'status': self.status,
            'donor_message': self.donor_message,
            'created_at': self.created_at.isoformat(),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
        }
