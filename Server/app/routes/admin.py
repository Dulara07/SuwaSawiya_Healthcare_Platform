from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.campaign import Campaign
from app.models.user import User
from app.models.fraud_report import FraudReport
from app.models.donation import Donation
from app.models.document import Document
from app.models.disbursement import Disbursement
from app.auth.dependencies import require_role
from app.utils.audit import log_action
from app.utils.db import get_db
import datetime

router = APIRouter(prefix="/admin", tags=["admin"])

def _campaign_payload(campaign: Campaign):
    return {
        "id": campaign.id,
        "title": campaign.title,
        "description": campaign.description,
        "category": getattr(campaign, "category", None),
        "beneficiary_name": getattr(campaign, "beneficiary_name", None),
        "beneficiary_age": getattr(campaign, "beneficiary_age", None),
        "beneficiary_medical_condition": getattr(campaign, "beneficiary_medical_condition", None),
        "medical_urgency": campaign.medical_urgency,
        "time_sensitivity": campaign.time_sensitivity,
        "target_amount": campaign.target_amount,
        "raised_amount": campaign.raised_amount,
        "status": campaign.status,
        "priority_score": campaign.priority_score,
        "owner_id": campaign.owner_id,
        "created_at": campaign.created_at,
        "updated_at": campaign.updated_at,
    }

def _user_payload(user: User):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "is_active": user.is_active,
        "registration_status": user.registration_status,
        "created_at": user.created_at,
    }

def _fraud_payload(report: FraudReport):
    return {
        "id": report.id,
        "reporter_id": report.reporter_id,
        "campaign_id": report.campaign_id,
        "reason": report.reason,
        "status": report.status,
        "reported_at": report.reported_at,
    }


def _disbursement_payload(disbursement: Disbursement):
    return {
        "id": disbursement.id,
        "campaign_id": disbursement.campaign_id,
        "requested_by_id": disbursement.requested_by_id,
        "approved_by_id": disbursement.approved_by_id,
        "amount": disbursement.amount,
        "bank_account_number": disbursement.bank_account_number,
        "bank_name": disbursement.bank_name,
        "status": disbursement.status,
        "approval_notes": disbursement.approval_notes,
        "requested_at": disbursement.requested_at,
        "approved_at": disbursement.approved_at,
    }

@router.get("/dashboard")
def admin_dashboard(db: Session = Depends(get_db), admin = Depends(require_role("admin"))):
    return {
        "campaigns_pending_review": db.query(Campaign).filter(Campaign.status == "pending").count(),
        "patient_registrations_pending": db.query(User).filter(User.role == "patient", User.registration_status == "pending").count(),
        "fraud_reports_pending": db.query(FraudReport).filter(FraudReport.status == "pending").count(),
        "total_campaigns": db.query(Campaign).count(),
        "total_users": db.query(User).count(),
    }

@router.get("/campaigns/pending", response_model=List[dict])
def list_pending_campaigns(db: Session = Depends(get_db), admin = Depends(require_role("admin"))):
    campaigns = db.query(Campaign).filter(Campaign.status == "pending").all()
    return [_campaign_payload(c) for c in campaigns]

@router.get("/campaigns", response_model=List[dict])
def list_campaigns(db: Session = Depends(get_db), admin = Depends(require_role("admin"))):
    return [_campaign_payload(c) for c in db.query(Campaign).order_by(Campaign.created_at.desc()).all()]


@router.get("/campaigns/{campaign_id}")
def get_campaign(campaign_id: int, db: Session = Depends(get_db), admin = Depends(require_role("admin"))):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    documents = (
        db.query(Document)
        .filter(Document.campaign_id == campaign.id)
        .order_by(Document.uploaded_at.desc())
        .all()
    )

    payload = _campaign_payload(campaign)
    payload["documents"] = [
        {
            "id": document.id,
            "filename": document.filename,
            "file_url": document.file_url,
            "document_type": getattr(document, "document_type", None),
            "uploaded_at": document.uploaded_at,
            "campaign_id": document.campaign_id,
        }
        for document in documents
    ]
    payload["documents_count"] = len(documents)
    return payload

@router.post("/campaigns/{campaign_id}/verify")
def verify_campaign(campaign_id: int, db: Session = Depends(get_db), admin = Depends(require_role("admin"))):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    document_count = db.query(Document).filter(Document.campaign_id == campaign.id).count()
    if document_count == 0:
        raise HTTPException(status_code=400, detail="Upload supporting documents before approving the campaign")
    campaign.status = "approved"
    db.commit()
    try:
        log_action(admin.id, "approve_campaign", "campaign", campaign.id, details="approved via admin API")
    except Exception:
        pass
    return {"message": "Campaign approved", "campaign_id": campaign.id}

@router.post("/campaigns/{campaign_id}/reject")
def reject_campaign(campaign_id: int, db: Session = Depends(get_db), admin = Depends(require_role("admin"))):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    campaign.status = "rejected"
    db.commit()
    try:
        log_action(admin.id, "reject_campaign", "campaign", campaign.id, details="rejected via admin API")
    except Exception:
        pass
    return {"message": "Campaign rejected", "campaign_id": campaign.id}

@router.get("/patients/pending", response_model=List[dict])
def list_pending_patients(db: Session = Depends(get_db), admin = Depends(require_role("admin"))):
    users = db.query(User).filter(User.role == "patient", User.registration_status == "pending").all()
    return [_user_payload(user) for user in users]

@router.get("/patients", response_model=List[dict])
def list_patients(db: Session = Depends(get_db), admin = Depends(require_role("admin"))):
    users = db.query(User).filter(User.role == "patient").order_by(User.created_at.desc()).all()
    return [_user_payload(user) for user in users]

@router.post("/patients/{user_id}/approve")
def approve_patient_registration(user_id: int, db: Session = Depends(get_db), admin = Depends(require_role("admin"))):
    user = db.query(User).filter(User.id == user_id, User.role == "patient").first()
    if not user:
        raise HTTPException(status_code=404, detail="Patient not found")
    user.registration_status = "approved"
    user.is_active = True
    db.commit()
    try:
        log_action(admin.id, "approve_patient", "user", user.id, details="approved patient registration")
    except Exception:
        pass
    return {"message": "Patient registration approved", "user_id": user.id}

@router.post("/patients/{user_id}/reject")
def reject_patient_registration(user_id: int, db: Session = Depends(get_db), admin = Depends(require_role("admin"))):
    user = db.query(User).filter(User.id == user_id, User.role == "patient").first()
    if not user:
        raise HTTPException(status_code=404, detail="Patient not found")
    user.registration_status = "rejected"
    user.is_active = False
    db.commit()
    try:
        log_action(admin.id, "reject_patient", "user", user.id, details="rejected patient registration")
    except Exception:
        pass
    return {"message": "Patient registration rejected", "user_id": user.id}

@router.get("/fraud-reports", response_model=List[dict])
def list_fraud_reports(db: Session = Depends(get_db), admin = Depends(require_role("admin"))):
    return [_fraud_payload(report) for report in db.query(FraudReport).order_by(FraudReport.reported_at.desc()).all()]

@router.post("/fraud-reports/{report_id}/review")
def review_fraud_report(report_id: int, db: Session = Depends(get_db), admin = Depends(require_role("admin"))):
    report = db.query(FraudReport).filter(FraudReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Fraud report not found")
    report.status = "reviewed"
    db.commit()
    return {"message": "Fraud report reviewed", "report_id": report.id}

@router.post("/fraud-reports/{report_id}/resolve")
def resolve_fraud_report(report_id: int, db: Session = Depends(get_db), admin = Depends(require_role("admin"))):
    report = db.query(FraudReport).filter(FraudReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Fraud report not found")
    report.status = "resolved"
    db.commit()
    return {"message": "Fraud report resolved", "report_id": report.id}


@router.get("/disbursements", response_model=List[dict])
def list_disbursements(db: Session = Depends(get_db), admin = Depends(require_role("admin"))):
    return [_disbursement_payload(item) for item in db.query(Disbursement).order_by(Disbursement.requested_at.desc()).all()]


@router.post("/disbursements/{disbursement_id}/approve")
def approve_disbursement(disbursement_id: int, db: Session = Depends(get_db), admin = Depends(require_role("admin"))):
    disbursement = db.query(Disbursement).filter(Disbursement.id == disbursement_id).first()
    if not disbursement:
        raise HTTPException(status_code=404, detail="Disbursement not found")
    disbursement.status = "approved"
    disbursement.approved_by_id = admin.id
    disbursement.approved_at = datetime.datetime.utcnow()
    db.commit()
    try:
        log_action(admin.id, "approve_disbursement", "disbursement", disbursement.id, details="approved via admin API")
    except Exception:
        pass
    return {"message": "Disbursement approved", "disbursement_id": disbursement.id}


@router.put("/campaigns/{campaign_id}")
def update_campaign(campaign_id: int, payload: dict, db: Session = Depends(get_db), admin = Depends(require_role("admin"))):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    allowed = {"title", "description", "medical_urgency", "time_sensitivity", "target_amount", "raised_amount", "status", "priority_score"}
    for key, val in payload.items():
        if key in allowed:
            setattr(campaign, key, val)
    db.commit()
    db.refresh(campaign)
    try:
        log_action(admin.id, "update_campaign", "campaign", campaign.id, details=str(payload))
    except Exception:
        pass
    return _campaign_payload(campaign)


@router.delete("/campaigns/{campaign_id}")
def delete_campaign(campaign_id: int, db: Session = Depends(get_db), admin = Depends(require_role("admin"))):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    # remove dependent records first
    db.query(Donation).filter(Donation.campaign_id == campaign_id).delete()
    db.query(Document).filter(Document.campaign_id == campaign_id).delete()
    db.query(FraudReport).filter(FraudReport.campaign_id == campaign_id).delete()
    db.delete(campaign)
    db.commit()
    try:
        log_action(admin.id, "delete_campaign", "campaign", campaign_id, details="deleted via admin API")
    except Exception:
        pass
    return {"message": "Campaign deleted", "campaign_id": campaign_id}
