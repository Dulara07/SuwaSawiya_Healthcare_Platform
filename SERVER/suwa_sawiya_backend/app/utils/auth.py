"""Authentication utilities"""
from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models.user import User


def token_required(f):
    """Decorator to check JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user or not user.is_active:
                return jsonify({'message': 'User not found or inactive'}), 401
        except Exception as e:
            return jsonify({'message': str(e)}), 401
        return f(*args, **kwargs)
    return decorated


def role_required(*allowed_roles):
    """Decorator to check user role"""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            try:
                verify_jwt_in_request()
                user_id = get_jwt_identity()
                user = User.query.get(user_id)
                if not user or user.user_type not in allowed_roles:
                    return jsonify({'message': 'Insufficient permissions'}), 403
            except Exception as e:
                return jsonify({'message': str(e)}), 401
            return f(*args, **kwargs)
        return decorated
    return decorator
