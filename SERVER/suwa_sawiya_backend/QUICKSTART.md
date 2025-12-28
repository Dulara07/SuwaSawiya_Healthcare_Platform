# Quick Start Guide

## 1. Initial Setup

### Windows

```bash
# Navigate to backend folder
cd SERVER\suwa_sawiya_backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env
```

### Mac/Linux

```bash
# Navigate to backend folder
cd SERVER/suwa_sawiya_backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
```

## 2. Configure PostgreSQL

### Windows (using pgAdmin or Command Line)

```bash
# Using psql (PostgreSQL command line)
psql -U postgres

# In psql:
CREATE DATABASE suwa_sawiya_db;
CREATE USER suwa_user WITH PASSWORD 'secure_password';
ALTER ROLE suwa_user SET client_encoding TO 'utf8';
ALTER ROLE suwa_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE suwa_user SET default_transaction_deferrable TO on;
ALTER ROLE suwa_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE suwa_sawiya_db TO suwa_user;
\q
```

### Update .env file

```
DATABASE_URL=postgresql://suwa_user:secure_password@localhost:5432/suwa_sawiya_db
FLASK_ENV=development
SECRET_KEY=your-very-secret-key-change-in-production
JWT_SECRET_KEY=your-jwt-secret-key-change-in-production
```

## 3. Initialize Database

```bash
python init_db.py
```

Output:
```
Creating database tables...
Database tables created successfully!
Creating default admin user...
Default admin user created!
Email: admin@suwa.com
Password: admin123
⚠️  IMPORTANT: Change the default password in production!
```

## 4. Run the Application

```bash
python run.py
```

The API will start at: `http://localhost:5000`

Check health: `http://localhost:5000/api/health`

## 5. Test the API

### Using cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@suwa.com","password":"admin123"}'

# Register as donor
curl -X POST http://localhost:5000/api/auth/register/donor \
  -H "Content-Type: application/json" \
  -d '{
    "email":"donor@example.com",
    "password":"password123",
    "first_name":"John",
    "last_name":"Doe",
    "phone":"+1234567890"
  }'
```

### Using Postman

1. Import the Postman collection from `postman_collection.json`
2. Set up environment variables
3. Test endpoints

### Using Python

```python
import requests

# Login
response = requests.post(
    'http://localhost:5000/api/auth/login',
    json={
        'email': 'admin@suwa.com',
        'password': 'admin123'
    }
)

data = response.json()
token = data['data']['access_token']

# Get dashboard
headers = {'Authorization': f'Bearer {token}'}
response = requests.get(
    'http://localhost:5000/api/admin/dashboard',
    headers=headers
)

print(response.json())
```

## 6. Connect Frontend

In your React frontend (Client folder), update API base URL:

```javascript
// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

export const authService = {
  login: (email, password) => {
    return fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(r => r.json())
  },
  
  register: (userType, userData) => {
    return fetch(`${API_BASE_URL}/auth/register/${userType}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).then(r => r.json())
  }
}
```

## Key Endpoints for Testing

### Authentication
- POST `/api/auth/login` - Login
- POST `/api/auth/register/donor` - Register donor
- POST `/api/auth/register/partner` - Register partner
- GET `/api/auth/profile` - Get profile (requires auth)

### Donor Operations
- GET `/api/donor/campaigns` - Browse campaigns
- GET `/api/donor/campaigns/search?category=surgery&urgency=critical` - Search campaigns
- GET `/api/donor/campaigns/<id>` - Get campaign details
- POST `/api/donor/donate` - Make donation (requires auth)

### Partner Operations
- POST `/api/partner/campaigns` - Create campaign (requires auth)
- GET `/api/partner/campaigns/<id>/progress` - View progress (requires auth)
- POST `/api/partner/campaigns/<id>/request-disbursement` - Request disbursement (requires auth)

### Admin Operations
- GET `/api/admin/dashboard` - Dashboard (requires auth + admin role)
- GET `/api/admin/campaigns/pending` - Pending campaigns (requires auth + admin)
- POST `/api/admin/campaigns/<id>/approve` - Approve campaign (requires auth + admin)

## Troubleshooting

### Database Connection Error
```
Error: could not connect to server: Connection refused
```

**Solution:**
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in .env
3. Verify database and user exist

### Port Already in Use
```
Address already in use
```

**Solution:**
```bash
# Change port in run.py or use:
python run.py --port 5001
```

### JWT Token Invalid
```
{"message":"Invalid token"}
```

**Solution:**
1. Ensure token is in Authorization header as `Bearer <token>`
2. Check token hasn't expired
3. Verify JWT_SECRET_KEY matches

### File Upload Error
```
File type not allowed
```

**Solution:**
- Check ALLOWED_EXTENSIONS in config.py
- Ensure file extension is in the allowed list
- Verify file size is under MAX_CONTENT_LENGTH

## Development Workflow

1. **Start PostgreSQL**
2. **Activate virtual environment**
3. **Run the app:** `python run.py`
4. **Test in another terminal** using cURL, Postman, or Python
5. **Check logs** for errors
6. **Make changes** to code
7. **Changes auto-reload** in development mode

## Useful Commands

```bash
# Create database
createdb suwa_sawiya_db

# Drop database
dropdb suwa_sawiya_db

# Reset database
python init_db.py drop && python init_db.py

# Install new package
pip install package_name
pip freeze > requirements.txt

# Deactivate virtual environment
deactivate
```

## Next Steps

1. Configure Stripe keys for payment processing
2. Set up email service for notifications
3. Deploy to production server
4. Set up database backups
5. Configure logging and monitoring
6. Implement additional validation
7. Add rate limiting
8. Set up CI/CD pipeline

## Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [JWT Documentation](https://flask-jwt-extended.readthedocs.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Stripe API Reference](https://stripe.com/docs/api)
