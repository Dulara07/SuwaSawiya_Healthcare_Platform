import os
from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from typing import Optional
from app.schemas.user import UserCreate, UserRead
from app.models.user import User
from app.auth.auth_utils import hash_password, verify_password, create_access_token
from app.utils.db import get_db
from app.models.document import Document
from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

ALLOWED_MEDICAL_REPORT_TYPES = {"application/pdf", "image/jpeg", "image/png"}
MAX_MEDICAL_REPORT_SIZE = 5 * 1024 * 1024


async def _store_medical_report(report: UploadFile, request: Request):
    if report.content_type not in ALLOWED_MEDICAL_REPORT_TYPES:
        raise HTTPException(status_code=400, detail="Medical report must be a PDF, JPG, or PNG file")
    if not report.filename:
        raise HTTPException(status_code=400, detail="Medical report filename is required")

    contents = await report.read(MAX_MEDICAL_REPORT_SIZE + 1)
    if len(contents) > MAX_MEDICAL_REPORT_SIZE:
        raise HTTPException(status_code=400, detail="Medical report must be 5MB or smaller")

    upload_dir = os.path.abspath(settings.FILE_UPLOAD_DIR)
    os.makedirs(upload_dir, exist_ok=True)
    safe_filename = os.path.basename(report.filename).replace(" ", "_")
    stored_name = f"{uuid4().hex}_{safe_filename}"
    file_location = os.path.join(upload_dir, stored_name)
    with open(file_location, "wb") as file:
        file.write(contents)
    file_url = str(request.base_url).rstrip("/") + f"/uploads/{stored_name}"
    return file_location, file_url, len(contents)


def _authenticate_and_issue_token(username: str, password: str, db: Session, expected_role: Optional[str] = None):
    user = db.query(User).filter(
        (User.username == username) | (User.email == username)
    ).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    if expected_role and user.role != expected_role:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"This login is for {expected_role} accounts only")
    if user.registration_status and user.registration_status != "approved":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is pending approval")
    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=UserRead)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter((User.username == user_in.username) | (User.email == user_in.email)).first():
        raise HTTPException(status_code=400, detail="Username or email already registered")
    registration_status = "pending" if user_in.role == "patient" else "approved"
    user = User(
        username=user_in.username,
        email=user_in.email,
        full_name=user_in.full_name,
        role=user_in.role,
        hashed_password=hash_password(user_in.password),
        is_active=True,
        registration_status=registration_status,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/register/partner", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register_partner(
    username: str = Form(..., min_length=3, max_length=50),
    password: str = Form(..., min_length=6),
    email: str = Form(...),
    full_name: str = Form(...),
    role: str = Form("partner"),
    medical_report: UploadFile | None = File(None),
    request: Request = None,
    db: Session = Depends(get_db),
):
    if role != "partner":
        raise HTTPException(status_code=400, detail="This endpoint only registers partner accounts")
    if db.query(User).filter((User.username == username) | (User.email == email)).first():
        raise HTTPException(status_code=400, detail="Username or email already registered")

    stored_file = None
    try:
        if medical_report:
            stored_file = await _store_medical_report(medical_report, request)

        user = User(
            username=username,
            email=email,
            full_name=full_name,
            role="partner",
            hashed_password=hash_password(password),
            is_active=True,
            registration_status="approved",
        )
        db.add(user)
        db.flush()

        if stored_file:
            file_location, file_url, file_size = stored_file
            db.add(Document(
                filename=medical_report.filename,
                file_url=file_url,
                document_type="medical_report",
                file_size=file_size,
                user_id=user.id,
            ))

        db.commit()
        db.refresh(user)
        return user
    except HTTPException:
        if stored_file:
            os.remove(stored_file[0])
        raise
    except Exception:
        db.rollback()
        if stored_file:
            os.remove(stored_file[0])
        raise HTTPException(status_code=500, detail="Partner registration could not be completed")

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return _authenticate_and_issue_token(form_data.username, form_data.password, db)


@router.post("/login/donor")
def login_donor(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return _authenticate_and_issue_token(form_data.username, form_data.password, db, expected_role="donor")


@router.post("/login/partner")
def login_partner(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return _authenticate_and_issue_token(form_data.username, form_data.password, db, expected_role="partner")


@router.post("/login/admin")
def login_admin(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return _authenticate_and_issue_token(form_data.username, form_data.password, db, expected_role="admin")
