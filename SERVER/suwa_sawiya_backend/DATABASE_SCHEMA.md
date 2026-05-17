# Database Schema

## Tables

### users
Base user table with polymorphic inheritance

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR(255) | Unique email |
| password_hash | VARCHAR(255) | Hashed password |
| first_name | VARCHAR(100) | First name |
| last_name | VARCHAR(100) | Last name |
| phone | VARCHAR(20) | Phone number |
| user_type | VARCHAR(50) | Type: donor, partner, admin |
| is_active | BOOLEAN | Account active |
| is_verified | BOOLEAN | Email verified |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Update timestamp |

### donors
Donor-specific information

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Foreign key to users |
| is_anonymous | BOOLEAN | Anonymous donor |
| total_donated | FLOAT | Total amount donated |
| notification_preferences | JSON | Notification settings |

### partners
Partner organization information

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Foreign key to users |
| organization_name | VARCHAR(255) | Organization name |
| organization_type | VARCHAR(100) | hospital, ngo, phi |
| registration_number | VARCHAR(100) | Unique registration |
| address | TEXT | Organization address |
| city | VARCHAR(100) | City |
| country | VARCHAR(100) | Country |
| bank_account_number | VARCHAR(100) | Bank account |
| bank_name | VARCHAR(100) | Bank name |
| is_verified | BOOLEAN | Organization verified |

### admins
Admin user information

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Foreign key to users |
| role | VARCHAR(50) | admin, super_admin |
| permissions | JSON | Admin permissions |

### campaigns
Medical fundraising campaigns

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | VARCHAR(255) | Campaign title |
| description | TEXT | Full description |
| category | VARCHAR(100) | surgery, medication, etc |
| urgency | VARCHAR(50) | critical, high, medium, low |
| target_amount | FLOAT | Fundraising target |
| funds_raised | FLOAT | Amount raised |
| status | VARCHAR(50) | pending, approved, etc |
| beneficiary_name | VARCHAR(255) | Patient name |
| beneficiary_age | INTEGER | Patient age |
| beneficiary_medical_condition | TEXT | Medical details |
| partner_id | UUID | Foreign key to partners |
| cover_image | VARCHAR(255) | Image file path |
| medical_document | VARCHAR(255) | Document file path |
| created_at | DATETIME | Creation date |
| updated_at | DATETIME | Update date |
| deadline | DATETIME | Campaign deadline |

### donations
Individual donations to campaigns

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| campaign_id | UUID | Foreign key to campaigns |
| donor_id | UUID | Foreign key to users |
| amount | FLOAT | Donation amount |
| is_anonymous | BOOLEAN | Anonymous donation |
| status | VARCHAR(50) | pending, completed, failed |
| transaction_id | VARCHAR(255) | Payment provider ID |
| donor_message | TEXT | Donor message |
| created_at | DATETIME | Donation date |
| completed_at | DATETIME | Completion date |

### documents
Medical and verification documents

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| campaign_id | UUID | Foreign key to campaigns |
| partner_id | UUID | Foreign key to partners |
| document_type | VARCHAR(100) | medical_certificate, etc |
| file_path | VARCHAR(255) | File path |
| file_name | VARCHAR(255) | Original file name |
| file_size | INTEGER | File size in bytes |
| is_verified | BOOLEAN | Document verified |
| verification_notes | TEXT | Verification notes |
| created_at | DATETIME | Upload date |
| updated_at | DATETIME | Update date |

### transactions
Payment transactions

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| donation_id | UUID | Foreign key to donations |
| payment_method | VARCHAR(50) | stripe, paypal, etc |
| transaction_reference | VARCHAR(255) | Payment ID |
| amount | FLOAT | Transaction amount |
| currency | VARCHAR(10) | Currency code |
| status | VARCHAR(50) | pending, success, failed |
| error_message | TEXT | Error details |
| created_at | DATETIME | Creation date |
| processed_at | DATETIME | Processing date |

### disbursements
Fund disbursement requests

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| campaign_id | UUID | Foreign key to campaigns |
| amount | FLOAT | Disbursement amount |
| status | VARCHAR(50) | pending, approved, processed |
| bank_account_number | VARCHAR(100) | Account number |
| bank_name | VARCHAR(100) | Bank name |
| approved_by_id | UUID | Approving admin |
| approval_notes | TEXT | Approval notes |
| created_at | DATETIME | Request date |
| approved_at | DATETIME | Approval date |
| processed_at | DATETIME | Processing date |

### fraud_reports
Fraud allegations and reports

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| campaign_id | UUID | Foreign key to campaigns |
| reported_by_id | UUID | Foreign key to users |
| description | TEXT | Fraud description |
| evidence_file | VARCHAR(255) | Evidence file |
| status | VARCHAR(50) | pending, investigating, etc |
| investigation_notes | TEXT | Investigation details |
| created_at | DATETIME | Report date |
| updated_at | DATETIME | Update date |

## Relationships

```
User (1) ──── (N) Donation
User (1) ──── (N) Campaign (as Partner)
Partner (1) ──── (N) Document
Campaign (1) ──── (N) Donation
Campaign (1) ──── (N) Document
Campaign (1) ──── (N) Disbursement
Campaign (1) ──── (N) FraudReport
Donation (1) ──── (1) Transaction
```

## Indexes

- users.email (UNIQUE)
- partners.registration_number (UNIQUE)
- donations.transaction_id (UNIQUE)
- transactions.transaction_reference (UNIQUE)
- campaigns.status
- donations.status
- fraud_reports.status
