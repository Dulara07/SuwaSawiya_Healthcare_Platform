"""Error handling middleware"""
from flask import jsonify
from app.utils.response import error_response


def register_error_handlers(app):
    """Register error handlers"""
    
    @app.errorhandler(400)
    def bad_request(error):
        return error_response('Bad request', 400)
    
    @app.errorhandler(401)
    def unauthorized(error):
        return error_response('Unauthorized', 401)
    
    @app.errorhandler(403)
    def forbidden(error):
        return error_response('Forbidden', 403)
    
    @app.errorhandler(404)
    def not_found(error):
        return error_response('Resource not found', 404)
    
    @app.errorhandler(500)
    def internal_error(error):
        return error_response('Internal server error', 500)
