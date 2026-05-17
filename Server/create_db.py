import sys
import os
from sqlalchemy import inspect, text
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.utils.db import engine
from app.models import base, campaign, document, donation, fraud_report, user

def create_all_tables():
    base.Base.metadata.create_all(bind=engine)
    inspector = inspect(engine)
    columns = [column["name"] for column in inspector.get_columns("users")]
    with engine.begin() as connection:
        if "registration_status" not in columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN registration_status VARCHAR DEFAULT 'approved'"))
        connection.execute(text("UPDATE users SET registration_status = 'approved' WHERE registration_status IS NULL"))
    print("All tables created successfully.")

if __name__ == "__main__":
    create_all_tables()
