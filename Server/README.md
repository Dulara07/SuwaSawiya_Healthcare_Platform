# SuwaSawiya Backend (FastAPI)

This is the backend for the Web-Based Medical Fundraising Platform for Sri Lanka.

## Tech Stack
- FastAPI
- PostgreSQL
- SQLAlchemy
- JWT Authentication

## Setup Instructions

1. Create a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure your PostgreSQL database in `app/config.py`.
4. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

## Folder Structure
- `app/` - Main application code
- `app/models/` - SQLAlchemy models
- `app/schemas/` - Pydantic schemas
- `app/routes/` - API endpoints
- `app/services/` - Business logic
- `app/auth/` - Authentication & authorization
- `app/utils/` - Utility functions
- `app/config.py` - Configuration

## Features
- Secure user registration & login
- Role-based access control
- Campaign management
- Document upload & storage
- Donation simulation
- Rule-based campaign prioritization
- Admin dashboard
- Fraud reporting
- Fund disbursement tracking

---

For academic use only. No real payment gateway or AI/ML components included.