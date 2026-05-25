from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from typing import Optional
from app.schemas.user import UserCreate, UserRead
from app.models.user import User
from app.auth.auth_utils import hash_password, verify_password, create_access_token
from app.utils.db import get_db

router = APIRouter(prefix="/auth", tags=["auth"])


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
