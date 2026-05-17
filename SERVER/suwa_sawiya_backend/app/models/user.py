"""User models for different roles: Donor, Partner, Admin"""
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import db


class User(db.Model):
    """Base User model"""
    __tablename__ = 'users'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    user_type = db.Column(db.String(50), nullable=False)  # 'donor', 'partner', 'admin'
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    donations = db.relationship('Donation', backref='donor', lazy=True, foreign_keys='Donation.donor_id')
    
    __mapper_args__ = {
        'polymorphic_on': user_type,
        'polymorphic_identity': 'user'
    }
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verify password"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': str(self.id),
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'user_type': self.user_type,
            'is_active': self.is_active,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat(),
        }


class Donor(User):
    """Donor user model"""
    __tablename__ = 'donors'
    
    id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), primary_key=True)
    is_anonymous = db.Column(db.Boolean, default=False)
    total_donated = db.Column(db.Float, default=0)
    notification_preferences = db.Column(db.JSON, default={})
    
    __mapper_args__ = {
        'polymorphic_identity': 'donor'
    }


class Partner(User):
    """Partner user model (Hospital, NGO, PHI)"""
    __tablename__ = 'partners'
    
    id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), primary_key=True)
    organization_name = db.Column(db.String(255), nullable=False)
    organization_type = db.Column(db.String(100))  # 'hospital', 'ngo', 'phi'
    registration_number = db.Column(db.String(100), unique=True)
    address = db.Column(db.Text)
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    bank_account_number = db.Column(db.String(100))
    bank_name = db.Column(db.String(100))
    is_verified = db.Column(db.Boolean, default=False)
    
    # Relationships
    campaigns = db.relationship('Campaign', backref='partner', lazy=True)
    documents = db.relationship('Document', backref='partner', lazy=True)
    
    __mapper_args__ = {
        'polymorphic_identity': 'partner'
    }


class Admin(User):
    """Admin user model"""
    __tablename__ = 'admins'
    
    id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), primary_key=True)
    role = db.Column(db.String(50))  # 'admin', 'super_admin'
    permissions = db.Column(db.JSON, default={})
    
    __mapper_args__ = {
        'polymorphic_identity': 'admin'
    }
