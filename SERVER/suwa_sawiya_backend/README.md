# SuwaSawiya Backend API

A comprehensive medical fundraising platform backend built with Flask and PostgreSQL.

## Overview

SuwaSawiya is a digital medical fundraising platform that connects donors, beneficiaries, and partner organizations (hospitals, NGOs) to facilitate transparent and secure fundraising for medical treatments.

## Features

### For Donors
- Browse and search medical fundraising campaigns
- Filter campaigns by urgency and category
- Make secure donations via Stripe payment gateway
- Donate anonymously if preferred
- View donation history and campaign updates

### For Partners (Hospitals, NGOs, PHIs)
- Register and create fundraising campaigns
- Register patients on behalf of the organization
- Upload medical and verification documents
- Track campaign progress and donations
- Request fund disbursement to bank accounts

### For Administrators
- Comprehensive admin dashboard with statistics
- Review and approve/reject campaigns
- Verify partner organizations
- Manage all campaigns
- Handle fraud reports and investigations
- Approve fund disbursements

## Tech Stack

- **Backend Framework:** Flask 3.0
- **Database:** PostgreSQL 12+
- **ORM:** SQLAlchemy
- **Authentication:** JWT (Flask-JWT-Extended)
- **Payment Processing:** Stripe
- **API Validation:** Flask with JSON
- **CORS:** Flask-CORS

## Project Structure

```
suwa_sawiya_backend/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── models/
│   │   ├── __init__.py      # Database initialization
│   │   ├── user.py          # User models (Donor, Partner, Admin)
│   │   ├── campaign.py      # Campaign and Donation models
│   │   └── other.py         # Document, Transaction, Disbursement, FraudReport
│   ├── routes/
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── donor.py         # Donor endpoints
│   │   ├── partner.py       # Partner endpoints
│   │   └── admin.py         # Admin endpoints
│   ├── utils/
│   │   ├── auth.py          # Authentication utilities
│   │   ├── file_handler.py  # File upload utilities
│   │   ├── response.py      # Response formatting
│   │   └── payment.py       # Payment processing utilities
│   └── middleware/
│       ├── cors.py          # CORS configuration
│       └── error_handler.py # Error handling
├── migrations/              # Database migrations
├── uploads/                 # User uploaded files
├── config.py               # Configuration
├── run.py                  # Application entry point
├── init_db.py              # Database initialization script
├── requirements.txt        # Python dependencies
├── .env.example            # Environment variables template
└── README.md              # This file
```

## Installation

### Prerequisites

- Python 3.8+
- PostgreSQL 12+
- pip (Python package manager)

### Setup Steps

1. **Clone the repository**
   ```bash
   cd SERVER/suwa_sawiya_backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your settings:
   - `DATABASE_URL`: PostgreSQL connection string
   - `STRIPE_PUBLIC_KEY`: Your Stripe public key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `JWT_SECRET_KEY`: Your JWT secret key

5. **Create PostgreSQL database**
   ```bash
   createdb suwa_sawiya_db
   ```

6. **Initialize database**
   ```bash
   python init_db.py
   ```

7. **Run the application**
   ```bash
   python run.py
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register/donor` | Register as donor |
| POST | `/register/partner` | Register as partner organization |
| POST | `/login` | Login user |
| GET | `/profile` | Get current user profile |
| PUT | `/profile` | Update user profile |
| POST | `/change-password` | Change password |

### Donor (`/api/donor`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/campaigns` | Browse all campaigns |
| GET | `/campaigns/search` | Search and filter campaigns |
| GET | `/campaigns/priority` | Get priority campaigns by urgency |
| GET | `/campaigns/<id>` | Get campaign details |
| POST | `/donate` | Create a donation |
| POST | `/donations/<id>/confirm` | Confirm donation payment |
| GET | `/donations` | Get donation history |
| GET | `/campaigns/<id>/updates` | Get campaign progress updates |

### Partner (`/api/partner`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/campaigns` | Create a new campaign |
| POST | `/register-beneficiary` | Register a patient/beneficiary |
| POST | `/campaigns/<id>/documents` | Upload documents |
| GET | `/campaigns/<id>/progress` | Get campaign progress |
| POST | `/campaigns/<id>/request-disbursement` | Request fund disbursement |
| GET | `/campaigns` | Get partner's campaigns |
| GET | `/profile` | Get partner profile |
| PUT | `/profile` | Update partner profile |

### Admin (`/api/admin`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Get admin dashboard statistics |
| GET | `/campaigns/pending` | Get pending campaigns |
| POST | `/campaigns/<id>/approve` | Approve campaign |
| POST | `/campaigns/<id>/reject` | Reject campaign |
| GET | `/partners/pending` | Get pending partner verifications |
| POST | `/partners/<id>/verify` | Verify partner |
| POST | `/partners/<id>/reject` | Reject partner |
| GET | `/campaigns` | Get all campaigns |
| PUT | `/campaigns/<id>` | Update campaign |
| DELETE | `/campaigns/<id>` | Delete campaign |
| GET | `/fraud-reports` | Get fraud reports |
| POST | `/fraud-reports/<id>/investigate` | Start investigation |
| POST | `/fraud-reports/<id>/confirm` | Confirm fraud |
| POST | `/fraud-reports/<id>/dismiss` | Dismiss report |
| GET | `/disbursements` | Get disbursement requests |
| POST | `/disbursements/<id>/approve` | Approve disbursement |
| GET | `/users` | Get all users |

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

Tokens are obtained by logging in or registering.

## Request/Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Success message",
  "data": [],
  "pagination": {
    "total": 100,
    "page": 1,
    "per_page": 10,
    "total_pages": 10
  }
}
```

## File Upload

Supported file types:
- Images: `png`, `jpg`, `jpeg`, `gif`
- Documents: `pdf`, `doc`, `docx`
- Maximum file size: 50MB

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/suwa_sawiya_db

# Flask
FLASK_ENV=development
SECRET_KEY=your-secret-key

# JWT
JWT_SECRET_KEY=your-jwt-secret-key

# Stripe
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Database Models

### User
- Donor
- Partner
- Admin

### Campaign
- Title, description
- Category, urgency level
- Target amount, funds raised
- Beneficiary information
- Status (pending, approved, rejected, completed)

### Donation
- Campaign reference
- Donor reference
- Amount, payment method
- Anonymity option
- Status tracking

### Document
- Medical certificates
- Verification documents
- File management

### Transaction
- Payment records
- Stripe integration
- Status tracking

### Disbursement
- Fund transfer requests
- Bank account details
- Admin approval

### FraudReport
- Fraud allegations
- Investigation tracking
- Resolution status

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Functional Requirements Coverage

### Donor Requirements (FR-D)
- ✅ FR-D-01: Browse campaigns
- ✅ FR-D-02: Search and filter campaigns
- ✅ FR-D-03: Display priority campaigns
- ✅ FR-D-04: Campaign details
- ✅ FR-D-05: Secure donations via Stripe
- ✅ FR-D-06: Anonymous donations
- ✅ FR-D-07: Donation confirmations and updates

### Partner Requirements (FR-P)
- ✅ FR-P-01: Register and create campaigns
- ✅ FR-P-02: Register patients on behalf
- ✅ FR-P-03: Upload documents
- ✅ FR-P-04: View campaign progress
- ✅ FR-P-05: Direct-to-bank fund disbursement

### Admin Requirements (FR-A)
- ✅ FR-A-01: Admin dashboard
- ✅ FR-A-02: Review and verify campaigns
- ✅ FR-A-03: Approve/reject registrations
- ✅ FR-A-04: Manage campaigns
- ✅ FR-A-05: Fraud reporting mechanisms

## Default Admin User

After initialization, a default admin user is created:

- **Email:** admin@suwa.com
- **Password:** admin123

⚠️ **Important:** Change this password immediately in production!

## Development

### Running Tests
```bash
pytest tests/
```

### Database Migrations
```bash
# Create migration
flask db migrate -m "Description"

# Apply migration
flask db upgrade

# Rollback
flask db downgrade
```

## Production Deployment

1. Set `FLASK_ENV=production`
2. Change all secret keys
3. Configure real Stripe keys
4. Set up proper email configuration
5. Use production-grade database
6. Enable HTTPS
7. Set up proper logging
8. Configure backup strategies

## Contributing

Please ensure code follows PEP 8 standards and includes appropriate documentation.

## License

This project is part of the University of Kelaniya Year 4 Project.

## Support

For issues or questions, contact the development team.
