"""CORS middleware configuration"""
from flask_cors import CORS


def init_cors(app):
    """Initialize CORS for the application"""
    CORS(app, 
         origins=app.config.get('CORS_ORIGINS', ['http://localhost:3000', 'http://localhost:5173']),
         supports_credentials=True,
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'])
