"""Database initialization script"""
import os
import sys
from app import create_app, db
from app.models.user import User, Donor, Partner, Admin
from app.models.campaign import Campaign, Donation
from app.models.other import Document, Transaction, Disbursement, FraudReport


def init_db():
    """Initialize database"""
    app = create_app(os.getenv('FLASK_ENV', 'development'))
    
    with app.app_context():
        print("Creating database tables...")
        
        # Create all tables
        db.create_all()
        
        print("Database tables created successfully!")
        
        # Check if admin user exists
        admin = Admin.query.filter_by(email='admin@suwa.com').first()
        
        if not admin:
            print("Creating default admin user...")
            admin = Admin(
                email='admin@suwa.com',
                first_name='Admin',
                last_name='User',
                role='super_admin',
                is_active=True,
                is_verified=True
            )
            admin.set_password('admin123')  # Change this in production!
            
            db.session.add(admin)
            db.session.commit()
            
            print("Default admin user created!")
            print("Email: admin@suwa.com")
            print("Password: admin123")
            print("⚠️  IMPORTANT: Change the default password in production!")
        
        print("\nDatabase initialization complete!")


def drop_db():
    """Drop all database tables"""
    app = create_app(os.getenv('FLASK_ENV', 'development'))
    
    with app.app_context():
        print("Dropping all database tables...")
        db.drop_all()
        print("Database dropped successfully!")


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'drop':
        drop_db()
    else:
        init_db()
