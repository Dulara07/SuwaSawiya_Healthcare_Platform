# System Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React/Vite)                      │
│                    (src/ folder in Client/)                      │
└────────────────────────────┬──────────────────────────────────────┘
                             │ HTTP/REST API
                             │ (http://localhost:5000/api)
┌────────────────────────────▼──────────────────────────────────────┐
│                     FLASK API SERVER (Python)                     │
│                   (runs on http://localhost:5000)                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Flask Application                       │   │
│  │  (app/__init__.py - Application Factory)                │   │
│  └──────────────────┬───────────────────────────────────────┘   │
│                     │                                             │
│  ┌──────────────────▼──────────────────────────────────────┐   │
│  │            Middleware & Security Layer                  │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ • CORS (app/middleware/cors.py)                         │   │
│  │ • JWT Authentication (app/utils/auth.py)               │   │
│  │ • Error Handling (app/middleware/error_handler.py)     │   │
│  │ • Role-Based Access Control                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌──────────────────┬──────────────┬──────────────┐              │
│  │                  │              │              │              │
│  ▼                  ▼              ▼              ▼              │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│ │ Auth      │  │ Donor    │  │ Partner  │  │ Admin    │          │
│ │ Routes    │  │ Routes   │  │ Routes   │  │ Routes   │          │
│ │           │  │          │  │          │  │          │          │
│ │ /auth/*   │  │ /donor/* │  │ /partner │  │ /admin/* │          │
│ │           │  │          │  │   /*     │  │          │          │
│ └─────┬─────┘  └────┬─────┘  └────┬────┘  └────┬─────┘          │
│       │             │             │            │                │
│       └─────────────┼─────────────┼────────────┘                │
│                     │             │                             │
│  ┌──────────────────▼─────────────▼──────────────┐              │
│  │          Business Logic & Services            │              │
│  ├──────────────────────────────────────────────┤              │
│  │ • app/utils/auth.py (JWT, decorators)       │              │
│  │ • app/utils/file_handler.py (uploads)       │              │
│  │ • app/utils/response.py (formatting)        │              │
│  │ • app/utils/payment.py (Stripe)             │              │
│  └──────────────────┬──────────────────────────┘              │
│                     │                                           │
│  ┌──────────────────▼──────────────────────────┐              │
│  │      SQLAlchemy ORM - Data Models           │              │
│  ├──────────────────────────────────────────────┤              │
│  │ • User, Donor, Partner, Admin (user.py)    │              │
│  │ • Campaign, Donation (campaign.py)         │              │
│  │ • Document, Transaction, Disbursement,    │              │
│  │   FraudReport (other.py)                   │              │
│  └──────────────────┬──────────────────────────┘              │
│                     │                                           │
└─────────────────────┼──────────────────────────────────────────┘
                      │ SQL Queries (SQLAlchemy)
┌─────────────────────▼──────────────────────────────────────────┐
│               PostgreSQL Database                              │
│           (suwa_sawiya_db on localhost)                        │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────┬─────────┬──────────┬──────────┐                  │
│  │ users  │ donors  │ partners │ admins   │                  │
│  └────────┴─────────┴──────────┴──────────┘                  │
│  ┌────────┬──────────┬──────────┐                            │
│  │campaigns│ donations│documents │                            │
│  └────────┴──────────┴──────────┘                            │
│  ┌──────────┬──────────────┬──────────────┐                 │
│  │transactions│disbursements│fraud_reports│                  │
│  └──────────┴──────────────┴──────────────┘                 │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

## API Request/Response Flow

```
┌─────────────────────────────┐
│    Client Request           │
│  (React Component)          │
│  e.g., Login Form           │
└────────────┬────────────────┘
             │
             │ 1. HTTP POST Request
             │    /api/auth/login
             │    Content-Type: application/json
             ▼
┌─────────────────────────────┐
│  Flask Route Handler        │
│  (auth.py)                  │
│  @auth_bp.route('/login')   │
└────────────┬────────────────┘
             │
             │ 2. Request Processing
             │    - Parse JSON body
             │    - Validate input
             ▼
┌─────────────────────────────┐
│  Database Query             │
│  SQLAlchemy ORM             │
│  User.query.filter_by()     │
└────────────┬────────────────┘
             │
             │ 3. Database Response
             │    PostgreSQL
             ▼
┌─────────────────────────────┐
│  Business Logic             │
│  - Validate password        │
│  - Generate JWT token       │
│  - Format response          │
└────────────┬────────────────┘
             │
             │ 4. JSON Response
             │    {success, message, data}
             ▼
┌─────────────────────────────┐
│    Client receives data     │
│  - Store JWT token         │
│  - Update UI                │
│  - Navigate to dashboard    │
└─────────────────────────────┘
```

## Database Schema Overview

```
┌──────────────────┐
│      users       │
├──────────────────┤
│ id (PK)         │
│ email (UNIQUE)  │
│ password_hash   │
│ user_type       │ ──┬──────────────────────────┐
│ is_active       │   │                          │
│ created_at      │   │                          │
└──────────────────┘   │                          │
         │             │                          │
         │ Inheritance │                          │
         │             │                          │
    ┌────┴────┬────────┴────┬───────────┐        │
    │          │             │           │        │
    ▼          ▼             ▼           ▼        │
┌────────┐ ┌────────┐ ┌──────────┐ ┌────────┐  │
│ donors │ │partners│ │  admins  │ │  N/A   │  │
├────────┤ ├────────┤ ├──────────┤ └────────┘  │
│ id (FK)│ │ id (FK)│ │ id (FK) │            │
│ total_ │ │ org_   │ │ role    │            │
│ donated│ │ name   │ │ perms   │            │
└────────┘ └────┬───┘ └────────────            │
                │                              │
                │ 1:N                         │
                ▼                              │
        ┌──────────────┐                      │
        │  campaigns   │◄─────────────────────┘
        ├──────────────┤
        │ id (PK)      │
        │ title        │
        │ category     │
        │ urgency      │
        │ target_amt   │
        │ funds_raised │
        │ partner_id   │
        │ status       │
        └─────┬────────┘
              │
         ┌────┴────┬────────────┐
         │          │            │
         ▼          ▼            ▼
    ┌─────────┐┌─────────┐ ┌──────────┐
    │donations││documents│ │disburse  │
    ├─────────┤├─────────┤ ├──────────┤
    │id (PK)  ││id (PK) │ │id (PK)  │
    │campaign_││campaign│ │campaign_ │
    │donor_id ││type    │ │amount   │
    │amount   ││file    │ │status   │
    │status   ││path    │ └──────────┘
    │trans_id ││verified│
    └────┬────┘└────────┘
         │
         │ 1:1
         ▼
    ┌─────────────┐
    │transactions │
    ├─────────────┤
    │ id (PK)     │
    │ donation_id │
    │ payment_mth │
    │ trans_ref   │
    │ amount      │
    │ status      │
    └─────────────┘

┌──────────────┐
│ fraud_reports│
├──────────────┤
│ id (PK)      │
│ campaign_id  │
│ description  │
│ status       │
│ evidence     │
└──────────────┘
```

## Authentication Flow

```
┌─────────────────┐
│  User Login     │
│  (Email/Pass)   │
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│ Check user exists        │
│ User.query.filter_by     │
│ (email)                  │
└────────┬─────────────────┘
         │
         ├─ NO ──► Return 401 Unauthorized
         │
         ▼ YES
┌──────────────────────────┐
│ Verify password          │
│ check_password()         │
└────────┬─────────────────┘
         │
         ├─ INVALID ──► Return 401 Unauthorized
         │
         ▼ VALID
┌──────────────────────────┐
│ Generate JWT Token       │
│ create_access_token()    │
│ Claims:                  │
│  - user_id              │
│  - user_type            │
│  - exp (24h)           │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Return Response:         │
│ {                        │
│   success: true,         │
│   data: {                │
│     user: {...},         │
│     access_token: "..."  │
│   }                      │
│ }                        │
└──────────────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Client stores token      │
│ localStorage.setItem()   │
│ 'auth_token'            │
└──────────────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Use in future requests:  │
│ Authorization:          │
│ Bearer {token}          │
└──────────────────────────┘
```

## Donation Payment Flow

```
┌─────────────────────────┐
│  Donor selects campaign │
│  and enters amount      │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ POST /api/donor/donate          │
│ Payload:                        │
│ {                               │
│   campaign_id: "...",          │
│   amount: 100,                 │
│   is_anonymous: false          │
│ }                               │
└────────────┬────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Backend creates:                 │
│ 1. Donation record (pending)    │
│ 2. Stripe PaymentIntent         │
│ 3. Transaction record           │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Return client_secret to frontend │
│ Frontend loads Stripe            │
│ card element                     │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Donor enters card details        │
│ Clicks "Pay Now"                │
│ Frontend confirms with Stripe   │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Stripe processes payment         │
│ Returns success/failure          │
└────────────┬─────────────────────┘
             │
             ├─ FAILED ──► Return error to user
             │
             ▼ SUCCESS
┌──────────────────────────────────┐
│ POST /api/donor/donations/{id}   │
│ /confirm                         │
│                                  │
│ Backend:                        │
│ 1. Verify payment with Stripe  │
│ 2. Update donation status      │
│ 3. Create Transaction record   │
│ 4. Update campaign funds_raised│
│ 5. Update donor total_donated  │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Return confirmation              │
│ {                                │
│   donation: {...},              │
│   campaign_progress: {           │
│     funds_raised,               │
│     progress_percentage         │
│   }                             │
│ }                                │
└──────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Frontend shows thank you         │
│ Updates campaign progress        │
│ Sends email receipt (future)    │
└──────────────────────────────────┘
```

## Role-Based Access Control

```
┌─────────────────────────────────┐
│      JWT Token Received         │
│      Authorization: Bearer      │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Verify JWT Signature           │
│  Check expiration               │
└────────────┬────────────────────┘
             │
             ├─ INVALID ──► 401 Unauthorized
             │
             ▼ VALID
┌─────────────────────────────────┐
│  Extract user_id from claims    │
│  Query User table               │
└────────────┬────────────────────┘
             │
             ├─ NOT FOUND ──► 401 Unauthorized
             │
             ▼ FOUND
┌─────────────────────────────────┐
│  Check user_type:               │
│  - donor                        │
│  - partner                      │
│  - admin                        │
└────────────┬────────────────────┘
             │
    ┌────────┼────────┐
    │        │        │
    ▼        ▼        ▼
  DONOR   PARTNER   ADMIN
    │        │        │
    ▼        ▼        ▼
  ✓          ✓        ✓
/donor/*   /partner/* /admin/*
    │        │        │
    └────────┼────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Route handler executes         │
│  with user context              │
└─────────────────────────────────┘
```

---

## Key Technical Decisions

1. **Polymorphic Inheritance for Users**
   - Benefits: Shared user authentication, role-specific data
   - Single users table, specialized tables for each role

2. **JWT for Stateless Authentication**
   - Benefits: Scalable, no session storage needed
   - Tokens contain user_id and user_type

3. **PostgreSQL with SQLAlchemy**
   - Benefits: Robust, ACID compliance, complex queries
   - SQLAlchemy provides ORM abstraction

4. **Stripe for Payments**
   - Benefits: Secure, PCI-compliant, webhooks support
   - Client-side card handling with payment intents

5. **Flask Blueprints for Modularity**
   - Benefits: Organized routes, separate concerns
   - Four blueprints: auth, donor, partner, admin

6. **File Storage in /uploads**
   - Benefits: Simple implementation, local backups
   - Can be replaced with S3/cloud storage

---

This architecture ensures scalability, security, and maintainability.
