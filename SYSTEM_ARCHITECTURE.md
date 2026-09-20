# SuwaSawiya System Architecture

```mermaid
flowchart TB
    %% Actors and presentation layer
    Users[Users\n- Donors\n- Patients\n- Partners\n- Admins]
    Frontend[React Frontend\nVite SPA]

    Users -->|HTTPS / Web UI| Frontend

    %% Backend application layer
    subgraph Backend[FastAPI Backend]
        direction TB
        API[REST API Endpoints]
        Auth[Authentication\nJWT]
        UsersMod[User Management]
        Campaigns[Campaign Management]
        Donations[Donation Management]
        Reco[Recommendation Module]
        Fraud[Fraud Reporting]
        Docs[Document Management]
        Consent[Consent Logging]
        Admin[Administration]
    end

    Frontend -->|REST API| API

    API --> Auth
    API --> UsersMod
    API --> Campaigns
    API --> Donations
    API --> Reco
    API --> Fraud
    API --> Docs
    API --> Consent
    API --> Admin

    %% Persistence and storage
    subgraph Data[Data Layer]
        direction TB
        ORM[SQLAlchemy ORM]
        DB[(PostgreSQL Database)]
        Storage[(File Storage\nUploaded Medical Documents)]
    end

    Backend --> ORM
    ORM --> DB
    Backend --> Storage

    %% Optional deployment note for uploads
    Docs --> Storage
    Campaigns --> Storage
```

## Notes

- The React frontend is a Vite single-page application that talks to the backend over REST.
- FastAPI exposes the application modules shown above and uses JWT for authenticated requests.
- SQLAlchemy mediates access to PostgreSQL.
- Uploaded medical documents are stored on file storage managed by the backend and served through the upload/static file path.