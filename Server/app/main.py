import os

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.config import settings

from app.routes import auth, user, campaign, donation, admin, fraud_report
from app.utils.error_handling import validation_exception_handler, http_exception_handler
from fastapi.exception_handlers import RequestValidationError
from fastapi.exceptions import HTTPException

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SuwaSawiya Medical Fundraising Platform")

os.makedirs(os.path.abspath(settings.FILE_UPLOAD_DIR), exist_ok=True)
app.mount("/uploads", StaticFiles(directory=os.path.abspath(settings.FILE_UPLOAD_DIR)), name="uploads")

app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(campaign.router)
app.include_router(donation.router)
app.include_router(admin.router)
app.include_router(fraud_report.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to SuwaSawiya Medical Fundraising Platform API"}

# Add CORS middleware LAST (it runs FIRST due to LIFO middleware order)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5173", "127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)