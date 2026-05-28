from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.donation import DonationCreate, DonationRead
from app.models.donation import Donation
from app.models.campaign import Campaign
from app.auth.dependencies import get_current_user
from app.utils.db import get_db, SessionLocal
import threading
import traceback


def _trigger_retrain_async():
    def _job():
        db = SessionLocal()
        try:
            from app.services.recommendations import RecommendationEngine
            engine = RecommendationEngine()
            engine.train_from_db(db)
        except Exception:
            traceback.print_exc()
        finally:
            db.close()

    thread = threading.Thread(target=_job, daemon=True)
    thread.start()

router = APIRouter(prefix="/donations", tags=["donations"])

@router.post("/", response_model=DonationRead)
def make_donation(donation_in: DonationCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    campaign = db.query(Campaign).filter(Campaign.id == donation_in.campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    donation = Donation(
        amount=donation_in.amount,
        donor_id=current_user.id,
        campaign_id=donation_in.campaign_id,
        is_anonymous=donation_in.is_anonymous
    )
    campaign.raised_amount = float(campaign.raised_amount or 0) + float(donation_in.amount)
    current_user.total_donated = float(current_user.total_donated or 0) + float(donation_in.amount)
    current_user.donation_count = int(current_user.donation_count or 0) + 1
    db.add(donation)
    db.commit()
    db.refresh(donation)
    db.refresh(campaign)
    db.refresh(current_user)
    # trigger background retrain (non-blocking)
    try:
        _trigger_retrain_async()
    except Exception:
        pass
    return donation

@router.get("/", response_model=List[DonationRead])
def list_donations(db: Session = Depends(get_db)):
    return db.query(Donation).all()
