"""Document and Transaction models"""
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.models import db


class Document(db.Model):
    """Document model for medical and verification documents"""
    __tablename__ = 'documents'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    campaign_id = db.Column(UUID(as_uuid=True), db.ForeignKey('campaigns.id'), nullable=True)
    partner_id = db.Column(UUID(as_uuid=True), db.ForeignKey('partners.id'), nullable=True)
    
    document_type = db.Column(db.String(100), nullable=False)  # 'medical_certificate', 'prescription', 'registration', 'bank_details'
    file_path = db.Column(db.String(255), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    file_size = db.Column(db.Integer)
    
    is_verified = db.Column(db.Boolean, default=False)
    verification_notes = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': str(self.id),
            'document_type': self.document_type,
            'file_name': self.file_name,
            'file_size': self.file_size,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat(),
        }


class Transaction(db.Model):
    """Payment transaction model"""
    __tablename__ = 'transactions'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    donation_id = db.Column(UUID(as_uuid=True), db.ForeignKey('donations.id'), nullable=False)
    
    payment_method = db.Column(db.String(50))  # 'stripe', 'paypal', 'bank_transfer'
    transaction_reference = db.Column(db.String(255), unique=True)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(10), default='USD')
    
    status = db.Column(db.String(50), default='pending')  # 'pending', 'success', 'failed'
    error_message = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    processed_at = db.Column(db.DateTime)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': str(self.id),
            'payment_method': self.payment_method,
            'transaction_reference': self.transaction_reference,
            'amount': self.amount,
            'currency': self.currency,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
        }


class Disbursement(db.Model):
    """Fund disbursement model for direct-to-bank transfer"""
    __tablename__ = 'disbursements'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    campaign_id = db.Column(UUID(as_uuid=True), db.ForeignKey('campaigns.id'), nullable=False)
    
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='pending')  # 'pending', 'approved', 'processed', 'failed'
    
    bank_account_number = db.Column(db.String(100))
    bank_name = db.Column(db.String(100))
    
    approved_by_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=True)
    approval_notes = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    approved_at = db.Column(db.DateTime)
    processed_at = db.Column(db.DateTime)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': str(self.id),
            'campaign_id': str(self.campaign_id),
            'amount': self.amount,
            'status': self.status,
            'bank_name': self.bank_name,
            'created_at': self.created_at.isoformat(),
            'approved_at': self.approved_at.isoformat() if self.approved_at else None,
            'processed_at': self.processed_at.isoformat() if self.processed_at else None,
        }


class FraudReport(db.Model):
    """Fraud reporting model"""
    __tablename__ = 'fraud_reports'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    campaign_id = db.Column(UUID(as_uuid=True), db.ForeignKey('campaigns.id'), nullable=False)
    reported_by_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=True)
    
    description = db.Column(db.Text, nullable=False)
    evidence_file = db.Column(db.String(255))
    
    status = db.Column(db.String(50), default='pending')  # 'pending', 'investigating', 'confirmed', 'dismissed'
    investigation_notes = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': str(self.id),
            'campaign_id': str(self.campaign_id),
            'description': self.description,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
        }
