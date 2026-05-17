"""Application factory"""
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from config import config
from app.models import init_db, db, migrate
from app.middleware.cors import init_cors
from app.middleware.error_handler import register_error_handlers


def create_app(config_name='development'):
    """Create and configure Flask application"""
    
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    init_db(app)
    jwt = JWTManager(app)
    
    # Initialize middleware
    init_cors(app)
    register_error_handlers(app)
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.donor import donor_bp
    from app.routes.partner import partner_bp
    from app.routes.admin import admin_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(donor_bp)
    app.register_blueprint(partner_bp)
    app.register_blueprint(admin_bp)
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'SuwaSawiya API is running'
        }), 200
    
    # Welcome endpoint
    @app.route('/api', methods=['GET'])
    def welcome():
        return jsonify({
            'message': 'Welcome to SuwaSawiya API',
            'version': '1.0.0',
            'endpoints': {
                'auth': '/api/auth',
                'donor': '/api/donor',
                'partner': '/api/partner',
                'admin': '/api/admin'
            }
        }), 200
    
    return app
