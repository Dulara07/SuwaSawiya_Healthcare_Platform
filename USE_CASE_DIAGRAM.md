# SuwaSawiya Use Case Diagram

```mermaid
flowchart LR
    Visitor([Visitor])
    Donor([Donor])
    Partner([Partner Organization])
    Admin([Administrator])

    subgraph System[SuwaSawiya Healthcare Fundraising Platform]
        direction TB

        UC_Home((View Home))
        UC_Campaigns((View Campaigns))
        UC_Register((Register))
        UC_Login((Login))

        UC_Donate((Donate))
        UC_Fraud((Report Fraud))
        UC_Profile((View Profile))
        UC_Dashboard((View Dashboard))

        UC_CreateCampaign((Create Campaign))
        UC_UploadDocs((Upload Documents))
        UC_UpdateCampaign((Update Campaign))
        UC_ManageCampaign((Manage Campaign))

        UC_Verify((Verify Campaign))
        UC_Approve((Approve Campaign))
        UC_Reject((Reject Campaign))
        UC_ManageUsers((Manage Users))
        UC_ReviewDocs((Review Documents))
        UC_ReviewFraud((Review Fraud Reports))
        UC_ManagePlatform((Manage Platform))
    end

    Visitor --> UC_Home
    Visitor --> UC_Campaigns
    Visitor --> UC_Register
    Visitor --> UC_Login

    Donor --> UC_Campaigns
    Donor --> UC_Donate
    Donor --> UC_Fraud
    Donor --> UC_Profile
    Donor --> UC_Dashboard

    Partner --> UC_CreateCampaign
    Partner --> UC_UploadDocs
    Partner --> UC_UpdateCampaign
    Partner --> UC_ManageCampaign
    Partner --> UC_Dashboard

    Admin --> UC_Verify
    Admin --> UC_Approve
    Admin --> UC_Reject
    Admin --> UC_ManageUsers
    Admin --> UC_ReviewDocs
    Admin --> UC_ReviewFraud
    Admin --> UC_ManagePlatform

    UC_CreateCampaign -.-> UC_UploadDocs
    UC_ManageCampaign -.-> UC_UpdateCampaign
    UC_Approve -.-> UC_Verify
    UC_Reject -.-> UC_Verify

    classDef actor fill:#0f172a,stroke:#0f172a,color:#ffffff,stroke-width:1px;
    classDef usecase fill:#f8fafc,stroke:#334155,color:#0f172a,stroke-width:1px;

    class Visitor,Donor,Partner,Admin actor;
    class UC_Home,UC_Campaigns,UC_Register,UC_Login,UC_Donate,UC_Fraud,UC_Profile,UC_Dashboard,UC_CreateCampaign,UC_UploadDocs,UC_UpdateCampaign,UC_ManageCampaign,UC_Verify,UC_Approve,UC_Reject,UC_ManageUsers,UC_ReviewDocs,UC_ReviewFraud,UC_ManagePlatform usecase;
```

## Notes

- The diagram reflects the core product flows exposed by the React frontend and FastAPI backend.
- Administrative actions map to the protected backend routes used for approval, review, and platform governance.
- Partner campaign operations align with campaign creation, document upload, and update endpoints.