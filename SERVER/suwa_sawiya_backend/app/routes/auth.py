"""Authentication routes"""
from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models import db
from app.models.user import User, Donor, Partner, Admin
from app.utils.response import success_response, error_response

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/register/donor', methods=['POST'])
def register_donor():
    """Register a new donor"""
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password') or not data.get('first_name'):
            return error_response('Missing required fields', 400)
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return error_response('Email already registered', 400)
        
        # Create donor
        donor = Donor(
            email=data['email'],
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            phone=data.get('phone'),
            is_anonymous=data.get('is_anonymous', False)
        )
        donor.set_password(data['password'])
        
        db.session.add(donor)
        db.session.commit()
        
        access_token = create_access_token(identity=str(donor.id))
        
        return success_response(
            data={
                'user': donor.to_dict(),
                'access_token': access_token
            },
            message='Donor registered successfully',
            status_code=201
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


@auth_bp.route('/register/partner', methods=['POST'])
def register_partner():
    """Register a new partner (Hospital, NGO, PHI)"""
    try:
        data = request.get_json()
        
        required_fields = ['email', 'password', 'first_name', 'organization_name', 'organization_type']
        if not all(data.get(field) for field in required_fields):
            return error_response('Missing required fields', 400)
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return error_response('Email already registered', 400)
        
        # Create partner
        partner = Partner(
            email=data['email'],
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            phone=data.get('phone'),
            organization_name=data['organization_name'],
            organization_type=data['organization_type'],
            registration_number=data.get('registration_number'),
            address=data.get('address'),
            city=data.get('city'),
            country=data.get('country'),
            bank_account_number=data.get('bank_account_number'),
            bank_name=data.get('bank_name')
        )
        partner.set_password(data['password'])
        
        db.session.add(partner)
        db.session.commit()
        
        access_token = create_access_token(identity=str(partner.id))
        
        return success_response(
            data={
                'user': partner.to_dict(),
                'access_token': access_token
            },
            message='Partner registered successfully',
            status_code=201
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return error_response('Email and password required', 400)
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return error_response('Invalid credentials', 401)
        
        if not user.is_active:
            return error_response('User account is inactive', 401)
        
        access_token = create_access_token(identity=str(user.id))
        
        return success_response(
            data={
                'user': user.to_dict(),
                'access_token': access_token
            },
            message='Login successful'
        )
    except Exception as e:
        return error_response(str(e), 500)


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return error_response('User not found', 404)
        
        return success_response(data=user.to_dict())
    except Exception as e:
        return error_response(str(e), 500)


@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return error_response('User not found', 404)
        
        data = request.get_json()
        
        # Update allowed fields
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'phone' in data:
            user.phone = data['phone']
        
        db.session.commit()
        
        return success_response(data=user.to_dict(), message='Profile updated successfully')
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return error_response('User not found', 404)
        
        data = request.get_json()
        
        if not data.get('old_password') or not data.get('new_password'):
            return error_response('Old and new password required', 400)
        
        if not user.check_password(data['old_password']):
            return error_response('Incorrect password', 401)
        
        user.set_password(data['new_password'])
        db.session.commit()
        
        return success_response(message='Password changed successfully')
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)
