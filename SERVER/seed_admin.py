from datetime import datetime
from sqlalchemy import text
from app.utils.db import engine
from app.auth.auth_utils import hash_password


def seed_admin(username='admin', email='admin@local', password='admin123'):
    hashed = hash_password(password)
    with engine.connect() as conn:
        # check exists
        res = conn.execute(text("SELECT id, username FROM users WHERE username = :u OR email = :e"), {"u": username, "e": email}).fetchone()
        if res:
            print('Admin user already exists:', res[1])
            return
        now = datetime.utcnow()
        conn.execute(text(
            """
            INSERT INTO users (username, email, hashed_password, full_name, role, is_active, registration_status, created_at)
            VALUES (:username, :email, :hashed_password, :full_name, :role, :is_active, :registration_status, :created_at)
            """),
            {
                "username": username,
                "email": email,
                "hashed_password": hashed,
                "full_name": 'Administrator',
                "role": 'admin',
                "is_active": True,
                "registration_status": 'approved',
                "created_at": now
            }
        )
        conn.commit()
        print('Admin user created:', username)


if __name__ == '__main__':
    seed_admin()
