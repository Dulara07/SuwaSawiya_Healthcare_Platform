# SuwaSawiya Backend (FastAPI)

Backend server for the Web-Based Medical Fundraising Platform for Sri Lanka.

> For complete setup instructions, see the main [README.md](../README.md) in the project root.

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- PostgreSQL 12 or higher

### Setup Steps

1. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

2. **Activate virtual environment:**
   ```bash
   # Windows:
   venv\Scripts\activate
   
   # macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure database:**
   - Update `app/config.py` with your PostgreSQL connection string
   - Format: `postgresql://user:password@localhost:5432/suwasawiya`

5. **Initialize database:**
   ```bash
   python create_db.py
   ```

6. **Start the server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

The server will run at: **http://localhost:8000**

---

## 📚 API Documentation

Once the server is running, access the interactive API documentation:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 📁 Folder Structure

```
Server/
├── app/
│   ├── models/              # SQLAlchemy ORM models
│   │   ├── base.py         # Base model configuration
│   │   ├── user.py         # User model
│   │   ├── campaign.py     # Campaign model
│   │   ├── donation.py     # Donation model
│   │   ├── document.py     # Document model
│   │   └── fraud_report.py # Fraud report model
│   ├── schemas/             # Pydantic validation schemas
│   │   ├── user.py
│   │   ├── campaign.py
│   │   ├── donation.py
│   │   ├── document.py
│   │   └── fraud_report.py
│   ├── routes/              # API endpoints
│   │   ├── auth.py         # Authentication endpoints
│   │   ├── user.py         # User management
│   │   ├── campaign.py     # Campaign endpoints
│   │   ├── donation.py     # Donation endpoints
│   │   ├── admin.py        # Admin endpoints
│   │   └── fraud_report.py # Fraud report endpoints
│   ├── services/            # Business logic layer
│   ├── auth/                # Authentication utilities
│   │   ├── auth_utils.py   # JWT & password handling
│   │   └── dependencies.py # FastAPI dependencies
│   ├── utils/               # Helper functions
│   │   ├── db.py           # Database utilities
│   │   ├── error_handling.py
│   │   └── logging.py
│   ├── config.py            # Configuration & database settings
│   └── main.py              # FastAPI app initialization
├── create_db.py             # Database initialization script
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

---

## 🔒 Authentication

The backend uses JWT (JSON Web Tokens) for authentication:
- Login endpoint: `POST /api/auth/login`
- Token required for protected endpoints
- Tokens stored in `Authorization: Bearer <token>` header

---

## 🔧 Key Features

- **User Management:** Registration, login, profile management
- **Role-Based Access Control:** Donor, Partner, Admin roles
- **Campaign Management:** Create, update, and manage fundraising campaigns
- **Document Handling:** Upload and store supporting documents
- **Donation Tracking:** Track and manage donations
- **Fraud Prevention:** Report and manage fraudulent activities
- **Admin Functions:** Dashboard, analytics, and system management

---

## 📝 Environment Variables

Create a `.env` file in the Server directory with:

```
DATABASE_URL=postgresql://user:password@localhost:5432/suwasawiya
JWT_SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 🛠 Development Commands

```bash
# Run with auto-reload (development)
uvicorn app.main:app --reload

# Run in production
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Create/reset database
python create_db.py

# Check database status
python check_db.py
```

---

## 🧪 Testing

```bash
# Run tests (if test suite is available)
pytest

# Run with coverage
pytest --cov=app
```

---

## 📦 Dependencies

Key packages in `requirements.txt`:
- **fastapi** - Web framework
- **uvicorn** - ASGI server
- **sqlalchemy** - ORM
- **psycopg2-binary** - PostgreSQL adapter
- **pydantic** - Data validation
- **python-jose** - JWT handling
- **passlib** - Password hashing
- **python-multipart** - File uploads

---

## 🔗 Integration with Frontend

The frontend connects to this backend via the API URL configured in `.env`:
```
VITE_API_URL=http://localhost:8000
```

All requests from the frontend should include the JWT token in the Authorization header.

---

## 📝 Notes

- Academic project for University of Kelaniya
- No real payment gateway integration
- Suitable for development and testing only
- CORS is enabled for frontend communication

---

For the complete project setup, refer to the main [README.md](../README.md).