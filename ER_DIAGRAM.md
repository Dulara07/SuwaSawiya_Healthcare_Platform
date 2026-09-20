# SuwaSawiya Entity Relationship Diagram

```mermaid
erDiagram
    USERS {
        int id PK
        string username
        string email
        string hashed_password
        string full_name
        string role
        boolean is_active
        string registration_status
        float total_donated
        int donation_count
        datetime created_at
    }

    CAMPAIGNS {
        int id PK
        string title
        text description
        string category
        string beneficiary_name
        int beneficiary_age
        text beneficiary_medical_condition
        int medical_urgency
        int time_sensitivity
        float target_amount
        float raised_amount
        string status
        float priority_score
        datetime created_at
        datetime updated_at
        int owner_id FK
    }

    DONATIONS {
        int id PK
        float amount
        int donor_id FK
        int campaign_id FK
        boolean is_anonymous
        datetime donated_at
    }

    DOCUMENTS {
        int id PK
        string filename
        string file_url
        string document_type
        datetime uploaded_at
        int campaign_id FK
    }

    CAMPAIGN_UPDATES {
        int id PK
        int campaign_id FK
        int author_id FK
        string title
        text content
        datetime created_at
    }

    FRAUD_REPORTS {
        int id PK
        int reporter_id FK
        int campaign_id FK
        text reason
        string status
        datetime reported_at
    }

    CONSENTS {
        int id PK
        int user_id FK
        int campaign_id FK
        string consent_type
        boolean consent_given
        text metadata_json
        datetime created_at
    }

    AUDIT_LOGS {
        int id PK
        int user_id FK
        string action
        string resource_type
        int resource_id
        text details
        datetime created_at
    }

    RECOMMENDATION_IMPRESSIONS {
        int id PK
        int user_id FK
        int campaign_id FK
        int rank_position
        text reason_tags
        string source
        string session_id
        datetime created_at
    }

    DISBURSEMENTS {
        int id PK
        int campaign_id FK
        int requested_by_id FK
        int approved_by_id FK
        float amount
        string bank_account_number
        string bank_name
        string status
        text approval_notes
        datetime requested_at
        datetime approved_at
    }

    INTERACTION_LOGS {
        int id PK
        int user_id FK
        int campaign_id FK
        string event_type
        float weight
        text metadata_json
        datetime created_at
    }

    USERS ||--o{ CAMPAIGNS : owns
    USERS ||--o{ DONATIONS : makes
    USERS ||--o{ CAMPAIGN_UPDATES : authors
    USERS ||--o{ FRAUD_REPORTS : reports
    USERS ||--o{ CONSENTS : gives
    USERS ||--o{ AUDIT_LOGS : performs
    USERS ||--o{ RECOMMENDATION_IMPRESSIONS : views
    USERS ||--o{ DISBURSEMENTS : requests
    USERS ||--o{ DISBURSEMENTS : approves
    USERS ||--o{ INTERACTION_LOGS : generates

    CAMPAIGNS ||--o{ DONATIONS : receives
    CAMPAIGNS ||--o{ DOCUMENTS : has
    CAMPAIGNS ||--o{ CAMPAIGN_UPDATES : tracks
    CAMPAIGNS ||--o{ FRAUD_REPORTS : receives
    CAMPAIGNS ||--o{ CONSENTS : relates_to
    CAMPAIGNS ||--o{ RECOMMENDATION_IMPRESSIONS : appears_in
    CAMPAIGNS ||--o{ DISBURSEMENTS : funds
    CAMPAIGNS ||--o{ INTERACTION_LOGS : records
```

## Notes

- `USERS` and `CAMPAIGNS` are the two core tables that anchor most relationships.
- `DISBURSEMENTS` references `USERS` twice: once for the requester and once for the approver.
- `CONSENTS` and `AUDIT_LOGS` are separate tracking tables used for compliance and traceability.
- `INTERACTION_LOGS` and `RECOMMENDATION_IMPRESSIONS` support the recommendation and analytics features.