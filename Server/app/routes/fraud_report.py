from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.fraud_report import FraudReportCreate, FraudReportRead
from app.models.fraud_report import FraudReport
from app.auth.dependencies import get_current_user
from app.utils.db import get_db

router = APIRouter(prefix="/fraud-reports", tags=["fraud-reports"])

@router.post("/", response_model=FraudReportRead)
def report_fraud(report_in: FraudReportCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    report = FraudReport(
        reporter_id=current_user.id,
        campaign_id=report_in.campaign_id,
        reason=report_in.reason,
        status="pending"
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

@router.get("/", response_model=List[FraudReportRead])
def list_reports(db: Session = Depends(get_db)):
    return db.query(FraudReport).all()
