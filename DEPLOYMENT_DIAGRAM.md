# SuwaSawiya Deployment Diagram

```mermaid
flowchart LR
    Browser[Client Browser]
    Frontend[React + Vite Frontend]
    API[REST API]
    Backend[FastAPI Backend]
    DB[(PostgreSQL Database)]
    Storage[(Uploaded Document Storage)]

    Browser -->|HTTPS| Frontend
    Frontend -->|REST API Calls| API
    API --> Backend
    Backend -->|SQLAlchemy / JDBC-style DB access| DB
    Backend -->|Upload / Retrieve Files| Storage
    Storage -->|Document URLs| Frontend
    DB -->|Query Results| Backend
    Backend -->|JSON Responses| API
    API -->|Rendered Data| Frontend
    Frontend -->|User Interaction| Browser
```

## Notes

- The browser accesses the React + Vite frontend.
- The frontend communicates with the backend through REST API requests.
- FastAPI handles application logic and persists data in PostgreSQL through SQLAlchemy.
- Uploaded medical documents are stored in file storage and referenced by the backend.