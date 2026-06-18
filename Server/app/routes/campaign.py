from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas.campaign import CampaignCreate, CampaignRead
from app.schemas.document import DocumentRead
from app.schemas.campaign_update import CampaignUpdateCreate, CampaignUpdateRead
from app.schemas.disbursement import DisbursementCreate, DisbursementRead
from app.models.campaign import Campaign
from app.models.document import Document
from app.models.campaign_update import CampaignUpdate
from app.models.disbursement import Disbursement
from app.auth.dependencies import get_current_user, require_role
from app.utils.db import get_db
from app.config import settings
import os
from uuid import uuid4
import datetime

router = APIRouter(prefix="/campaigns", tags=["campaigns"])


def _store_uploaded_file(upload: UploadFile, request: Request):
    upload_dir = os.path.abspath(settings.FILE_UPLOAD_DIR)
    os.makedirs(upload_dir, exist_ok=True)

    stored_name = f"{uuid4().hex}_{upload.filename}"
    file_location = os.path.join(upload_dir, stored_name)
    file_url = str(request.base_url).rstrip("/") + f"/uploads/{stored_name}"
    return file_location, file_url, stored_name

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
    request: Request = None,
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
            file_location, file_url, _ = _store_uploaded_file(file, request)
            contents = await file.read()
            with open(file_location, "wb") as f:
                f.write(contents)
            document = Document(
                filename=file.filename,
                file_url=file_url,
                campaign_id=campaign.id
            )
            db.add(document)
        db.commit()
    db.refresh(campaign)
    return campaign


@router.post("/partner/register-beneficiary", response_model=CampaignRead)
async def register_beneficiary_campaign(
    beneficiary_name: str = Form(...),
    beneficiary_age: Optional[int] = Form(None),
    beneficiary_medical_condition: str = Form(...),
    category: Optional[str] = Form(None),
    medical_urgency: int = Form(...),
    time_sensitivity: int = Form(...),
    target_amount: float = Form(...),
    description: Optional[str] = Form(None),
    files: Optional[List[UploadFile]] = File(None),
    request: Request = None,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("partner"))
):
    if not files or len(files) < 4:
        raise HTTPException(status_code=400, detail="All four supporting documents are required")

    campaign = Campaign(
        title=f"Medical Campaign for {beneficiary_name}",
        description=description or f"Support needed for {beneficiary_name} ({beneficiary_medical_condition}).",
        category=category,
        beneficiary_name=beneficiary_name,
        beneficiary_age=beneficiary_age,
        beneficiary_medical_condition=beneficiary_medical_condition,
        medical_urgency=medical_urgency,
        time_sensitivity=time_sensitivity,
        target_amount=target_amount,
        owner_id=current_user.id,
        status="pending",
    )
    campaign.priority_score = calculate_priority_score(medical_urgency, time_sensitivity, 0.0, target_amount)
    db.add(campaign)
    db.commit()
    db.refresh(campaign)

    for file in files:
        file_location, file_url, _ = _store_uploaded_file(file, request)
        contents = await file.read()
        with open(file_location, "wb") as file_handle:
            file_handle.write(contents)

        campaign_document = Document(
            filename=file.filename,
            file_url=file_url,
            document_type="supporting_document",
            campaign_id=campaign.id,
        )
        db.add(campaign_document)

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


@router.get("/{campaign_id}", response_model=CampaignRead)
def get_campaign_details(campaign_id: int, db: Session = Depends(get_db)):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if campaign is None:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign


@router.get("/{campaign_id}/updates", response_model=List[CampaignUpdateRead])
def list_campaign_updates(campaign_id: int, db: Session = Depends(get_db)):
    return (
        db.query(CampaignUpdate)
        .filter(CampaignUpdate.campaign_id == campaign_id)
        .order_by(CampaignUpdate.created_at.desc())
        .all()
    )


@router.post("/partner/campaigns/{campaign_id}/updates", response_model=CampaignUpdateRead)
def create_campaign_update(
    campaign_id: int,
    payload: CampaignUpdateCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("partner")),
):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id, Campaign.owner_id == current_user.id).first()
    if campaign is None:
        raise HTTPException(status_code=404, detail="Campaign not found or unauthorized")

    update = CampaignUpdate(
        campaign_id=campaign.id,
        author_id=current_user.id,
        title=payload.title,
        content=payload.content,
    )
    db.add(update)
    db.commit()
    db.refresh(update)
    return update


@router.get("/partner/campaigns/{campaign_id}/updates", response_model=List[CampaignUpdateRead])
def list_partner_campaign_updates(
    campaign_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("partner")),
):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id, Campaign.owner_id == current_user.id).first()
    if campaign is None:
        raise HTTPException(status_code=404, detail="Campaign not found or unauthorized")
    return (
        db.query(CampaignUpdate)
        .filter(CampaignUpdate.campaign_id == campaign.id)
        .order_by(CampaignUpdate.created_at.desc())
        .all()
    )


@router.post("/partner/campaigns/{campaign_id}/request-disbursement", response_model=DisbursementRead)
def request_disbursement(
    campaign_id: int,
    payload: DisbursementCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("partner")),
):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id, Campaign.owner_id == current_user.id).first()
    if campaign is None:
        raise HTTPException(status_code=404, detail="Campaign not found or unauthorized")

    amount = float(payload.amount)
    if amount <= 0 or amount > float(campaign.raised_amount or 0):
        raise HTTPException(status_code=400, detail="Invalid disbursement amount")

    disbursement = Disbursement(
        campaign_id=campaign.id,
        requested_by_id=current_user.id,
        amount=amount,
        bank_account_number=payload.bank_account_number,
        bank_name=payload.bank_name,
        status="pending",
        requested_at=datetime.datetime.utcnow(),
    )
    db.add(disbursement)
    db.commit()
    db.refresh(disbursement)
    return disbursement


@router.get("/partner/dashboard")
def get_partner_dashboard(db: Session = Depends(get_db), current_user = Depends(require_role("partner"))):
    campaigns = (
        db.query(Campaign)
        .order_by(Campaign.created_at.desc())
        .all()
    )

    campaigns_data = []
    total_raised = 0.0
    total_target = 0.0
    status_counts = {"pending": 0, "approved": 0, "rejected": 0, "completed": 0}

    for campaign in campaigns:
        raised_amount = float(campaign.raised_amount or 0)
        target_amount = float(campaign.target_amount or 0)
        total_raised += raised_amount
        total_target += target_amount

        status = (campaign.status or "pending").lower()
        if status not in status_counts:
            status_counts[status] = 0
        status_counts[status] += 1

        progress_percentage = round((raised_amount / target_amount) * 100, 2) if target_amount > 0 else 0.0
        campaigns_data.append(
            {
                "id": campaign.id,
                "title": campaign.title,
                "description": campaign.description,
                "category": campaign.category,
                "owner_id": campaign.owner_id,
                "beneficiary_name": campaign.beneficiary_name,
                "beneficiary_age": campaign.beneficiary_age,
                "beneficiary_medical_condition": campaign.beneficiary_medical_condition,
                "medical_urgency": campaign.medical_urgency,
                "time_sensitivity": campaign.time_sensitivity,
                "target_amount": target_amount,
                "raised_amount": raised_amount,
                "status": campaign.status,
                "priority_score": campaign.priority_score,
                "created_at": campaign.created_at.isoformat() if campaign.created_at else None,
                "updated_at": campaign.updated_at.isoformat() if campaign.updated_at else None,
                "progress_percentage": progress_percentage,
                "remaining_amount": max(target_amount - raised_amount, 0),
            }
        )

    return {
        "summary": {
            "total_campaigns": len(campaigns_data),
            "total_raised": round(total_raised, 2),
            "total_target": round(total_target, 2),
            "pending_review": status_counts.get("pending", 0),
            "approved_campaigns": status_counts.get("approved", 0),
            "rejected_campaigns": status_counts.get("rejected", 0),
            "completed_campaigns": status_counts.get("completed", 0),
        },
        "campaigns": campaigns_data,
    }


@router.post("/partner/campaigns/{campaign_id}/documents", response_model=DocumentRead)
async def upload_partner_campaign_document(
    campaign_id: int,
    document: UploadFile = File(...),
    document_type: str = Form("medical_certificate"),
    request: Request = None,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("partner"))
):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id, Campaign.owner_id == current_user.id).first()
    if campaign is None:
        raise HTTPException(status_code=404, detail="Campaign not found or unauthorized")

    file_location, file_url, _ = _store_uploaded_file(document, request)
    contents = await document.read()
    with open(file_location, "wb") as file_handle:
        file_handle.write(contents)

    campaign_document = Document(
        filename=document.filename,
        file_url=file_url,
        document_type=document_type,
        campaign_id=campaign.id,
    )
    db.add(campaign_document)
    db.commit()
    db.refresh(campaign_document)
    return campaign_document
