from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas.campaign import CampaignCreate, CampaignRead
from app.schemas.document import DocumentRead
from app.models.campaign import Campaign
from app.models.document import Document
from app.auth.dependencies import get_current_user
from app.utils.db import get_db
from app.config import settings
import os

router = APIRouter(prefix="/campaigns", tags=["campaigns"])

# Rule-based prioritization logic
def calculate_priority_score(medical_urgency, time_sensitivity, raised_amount, target_amount):
    urgency_weight = 0.5
    time_weight = 0.3
    funds_weight = 0.2
    funds_ratio = (target_amount - raised_amount) / target_amount if target_amount > 0 else 0
    score = (
        medical_urgency * urgency_weight +
        time_sensitivity * time_weight +
        funds_ratio * funds_weight * 5
    )
    return round(score, 2)

@router.post("/", response_model=CampaignRead)
async def create_campaign(
    title: str = Form(...),
    description: str = Form(...),
    medical_urgency: int = Form(...),
    time_sensitivity: int = Form(...),
    target_amount: float = Form(...),
    files: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    campaign = Campaign(
        title=title,
        description=description,
        medical_urgency=medical_urgency,
        time_sensitivity=time_sensitivity,
        target_amount=target_amount,
        owner_id=current_user.id,
        status="pending"
    )
    campaign.priority_score = calculate_priority_score(medical_urgency, time_sensitivity, 0.0, target_amount)
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    # Handle file uploads
    if files:
        for file in files:
            file_location = os.path.join(settings.FILE_UPLOAD_DIR, file.filename)
            contents = await file.read()
            with open(file_location, "wb") as f:
                f.write(contents)
            document = Document(
                filename=file.filename,
                file_url=file_location,
                campaign_id=campaign.id
            )
            db.add(document)
        db.commit()
    db.refresh(campaign)
    return campaign

@router.get("/", response_model=List[CampaignRead])
def list_campaigns(db: Session = Depends(get_db)):
    campaigns = db.query(Campaign).all()
    # Update priority scores dynamically
    for campaign in campaigns:
        campaign.priority_score = calculate_priority_score(
            campaign.medical_urgency,
            campaign.time_sensitivity,
            campaign.raised_amount,
            campaign.target_amount
        )
    db.commit()
    return campaigns

@router.get("/priority", response_model=List[CampaignRead])
def list_campaigns_by_priority(db: Session = Depends(get_db)):
    campaigns = db.query(Campaign).all()
    for campaign in campaigns:
        campaign.priority_score = calculate_priority_score(
            campaign.medical_urgency,
            campaign.time_sensitivity,
            campaign.raised_amount,
            campaign.target_amount
        )
    db.commit()
    sorted_campaigns = sorted(campaigns, key=lambda c: c.priority_score, reverse=True)
    return sorted_campaigns
