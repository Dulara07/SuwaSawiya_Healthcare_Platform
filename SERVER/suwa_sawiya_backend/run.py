"""Application entry point"""
import os
from app import create_app
from config import config

if __name__ == '__main__':
    # Get config from environment or default to development
    config_name = os.getenv('FLASK_ENV', 'development')
    
    # Create app
    app = create_app(config_name)
    
    # Run development server
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=app.config.get('DEBUG', False)
    )
