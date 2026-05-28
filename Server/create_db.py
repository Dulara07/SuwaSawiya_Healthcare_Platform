import sys
import os
from sqlalchemy import inspect, text
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.utils.db import engine
from app.models import base, campaign, document, donation, fraud_report, user, interaction, recommendation_impression, consent_audit

def create_all_tables():
    base.Base.metadata.create_all(bind=engine)
    inspector = inspect(engine)
    user_columns = [column["name"] for column in inspector.get_columns("users")]
    campaign_columns = [column["name"] for column in inspector.get_columns("campaigns")]
    document_columns = [column["name"] for column in inspector.get_columns("documents")]
    with engine.begin() as connection:
        if "registration_status" not in user_columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN registration_status VARCHAR DEFAULT 'approved'"))
        connection.execute(text("UPDATE users SET registration_status = 'approved' WHERE registration_status IS NULL"))
        if "total_donated" not in user_columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN total_donated FLOAT DEFAULT 0"))
        connection.execute(text("UPDATE users SET total_donated = 0 WHERE total_donated IS NULL"))
        if "donation_count" not in user_columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN donation_count INTEGER DEFAULT 0"))
        connection.execute(text("UPDATE users SET donation_count = 0 WHERE donation_count IS NULL"))
        if "category" not in campaign_columns:
            connection.execute(text("ALTER TABLE campaigns ADD COLUMN category VARCHAR"))
        if "beneficiary_name" not in campaign_columns:
            connection.execute(text("ALTER TABLE campaigns ADD COLUMN beneficiary_name VARCHAR"))
        if "beneficiary_age" not in campaign_columns:
            connection.execute(text("ALTER TABLE campaigns ADD COLUMN beneficiary_age INTEGER"))
        if "beneficiary_medical_condition" not in campaign_columns:
            connection.execute(text("ALTER TABLE campaigns ADD COLUMN beneficiary_medical_condition TEXT"))
        if "document_type" not in document_columns:
            connection.execute(text("ALTER TABLE documents ADD COLUMN document_type VARCHAR"))
    print("All tables created successfully.")

if __name__ == "__main__":
    create_all_tables()
