from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from app.auth.dependencies import get_current_user
from app.utils.db import SessionLocal
from app.models.consent_audit import Consent

router = APIRouter(prefix="/consent", tags=["consent"])


class ConsentIn(BaseModel):
    consent_type: str
    consent_given: bool = True
    campaign_id: Optional[int] = None
    metadata: Optional[str] = None


@router.post("/")
def record_consent(payload: ConsentIn, user = Depends(get_current_user)):
    db = SessionLocal()
    try:
        c = Consent(
            user_id=user.id,
            campaign_id=payload.campaign_id,
            consent_type=payload.consent_type,
            consent_given=payload.consent_given,
            metadata=payload.metadata,
        )
        db.add(c)
        db.commit()
        db.refresh(c)
        return {"ok": True, "consent_id": c.id}
    finally:
        db.close()
