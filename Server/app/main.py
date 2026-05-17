from fastapi import FastAPI
from app.config import settings

from app.routes import auth, user, campaign, donation, admin, fraud_report
from app.utils.error_handling import validation_exception_handler, http_exception_handler
from fastapi.exception_handlers import RequestValidationError
from fastapi.exceptions import HTTPException

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SuwaSawiya Medical Fundraising Platform")

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


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],  # Add all frontend dev ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)