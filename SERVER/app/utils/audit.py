from app.utils.db import SessionLocal
from app.models.consent_audit import AuditLog


def log_action(user_id: int, action: str, resource_type: str = None, resource_id: int = None, details: str = None):
    db = SessionLocal()
    try:
        entry = AuditLog(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
        )
        db.add(entry)
        db.commit()
    finally:
        db.close()
