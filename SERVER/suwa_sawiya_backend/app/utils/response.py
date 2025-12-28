"""Response formatting utilities"""
from flask import jsonify


def success_response(data=None, message='Success', status_code=200):
    """Format success response"""
    response = {
        'success': True,
        'message': message,
        'data': data
    }
    return jsonify(response), status_code


def error_response(message='Error', status_code=400, data=None):
    """Format error response"""
    response = {
        'success': False,
        'message': message,
        'data': data
    }
    return jsonify(response), status_code


def paginated_response(items, total, page, per_page, message='Success'):
    """Format paginated response"""
    response = {
        'success': True,
        'message': message,
        'data': items,
        'pagination': {
            'total': total,
            'page': page,
            'per_page': per_page,
            'total_pages': (total + per_page - 1) // per_page
        }
    }
    return jsonify(response), 200
