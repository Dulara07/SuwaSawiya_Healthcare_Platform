# SuwaSawiya: A Web-Based Healthcare Fundraising and Care Coordination Platform

## Declaration

I declare that this project thesis titled **“SuwaSawiya: A Web-Based Healthcare Fundraising and Care Coordination Platform”** is entirely my own work, except where properly acknowledged and cited. This thesis has not been submitted in whole or in part for any other degree or diploma at any university or institution. All sources used in this work have been referenced according to academic conventions, and I accept full responsibility for the originality and integrity of the content presented here.

## Acknowledgement

I would like to express my sincere gratitude to my supervisor for the continuous guidance, constructive criticism, and academic support provided throughout the development of this thesis. The advice and encouragement received during the planning, analysis, and writing stages were essential in shaping the final form of the project and the dissertation that documents it.

I am also thankful to the academic staff and colleagues who contributed ideas, feedback, and motivation during the development of the SuwaSawiya platform. Their observations helped refine the scope of the project and improve the quality of the system design. I extend my appreciation to everyone who provided assistance in understanding the requirements of healthcare users, especially the practical challenges that patients, donors, partners, and administrators face in medical fundraising scenarios.

Special thanks are due to my family and friends for their patience, support, and encouragement throughout the period of development. Their understanding during long hours of design, coding, testing, and documentation gave me the strength to complete this work with confidence. I am also grateful for the broader community of open-source developers and documentation contributors whose tools and guidance made it possible to build a modern web application efficiently.

## Abstract

Healthcare access remains a major challenge in many developing countries, where families often face severe financial pressure when emergency treatment, specialist consultation, diagnostic investigation, or long-term care is required. In Sri Lanka, as in many similar contexts, the burden of medical expenses can become overwhelming when a patient requires urgent intervention and the available household income is not sufficient to support the treatment cost. At the same time, public willingness to help exists, but the process of identifying genuine cases, verifying supporting documents, tracking campaign progress, monitoring donations, and coordinating approvals is often fragmented and time-consuming. This project addresses that gap through the design and implementation of **SuwaSawiya**, a web-based healthcare fundraising and care coordination platform that connects donors, partner organizations, administrators, and beneficiaries through a single integrated system.

SuwaSawiya was developed as a full-stack web application with a React/Vite frontend and a FastAPI backend connected to a PostgreSQL database. The platform supports secure registration and login, role-based access control, campaign creation and review, donation recording, document uploads, fraud reporting, beneficiary and patient-related approval workflows, multilingual user interaction, recommendation-based campaign prioritization, campaign update tracking, and controlled disbursement management. The interface was designed to be approachable for public users while still supporting administrative oversight and partner operations. The backend exposes RESTful APIs for authentication, campaign management, donations, consent logging, document handling, analytics, recommendations, and administrative review tasks.

The system was built to satisfy a practical set of healthcare fundraising requirements rather than to function as a generic crowdfunding site. Its emphasis is on trust, clarity, and accessibility. The platform therefore separates user roles, preserves auditability, and allows the system to surface campaigns that are urgent, underfunded, or likely to benefit from timely public attention. A rule-based recommendation approach and a structured workflow for campaign review were introduced to improve transparency and operational control. In addition, the frontend uses a multilingual context so that future localisation can support wider social accessibility.

Evaluation of the platform focused on functional correctness, interface usability, and the completeness of the workflow from campaign submission to donation tracking. The resulting system demonstrates that a carefully designed web platform can reduce administrative overhead, improve public visibility of verified healthcare needs, and provide a practical foundation for digital medical fundraising services. The project also establishes a base for future expansion into richer patient services, mobile-first support, stronger analytics, and deeper integration with external healthcare systems.

## Table of Contents

Declaration
Acknowledgement
Abstract
Table of Contents
List of Figures
List of Tables
List of Abbreviations

Chapter 1 Introduction
1.1 Background of the Study
1.2 Problem Statement
1.3 Objectives of the Study
1.4 Scope of the Project
1.5 Significance of the Study
1.6 Methodology Overview
1.7 Structure of the Thesis
1.8 Conclusion

Chapter 2 Literature Review
2.1 Introduction
2.2 Healthcare Access and Medical Fundraising
2.3 Digital Health Platforms and Web-Based Service Delivery
2.4 Crowdfunding and Social Donation Systems
2.5 Trust, Verification, and Fraud Prevention
2.6 Role-Based Access Control in Public Web Systems
2.7 Multilingual User Interfaces and Accessibility
2.8 Recommendation Systems in Social Platforms
2.9 Frontend and Backend Technologies Used in the Project
2.10 Research Gap and Project Positioning
2.11 Conclusion

Chapter 3 Methodology
3.1 Introduction
3.2 Research and Development Approach
3.3 Requirement Gathering and Analysis
3.4 Functional Requirements
3.5 Non-Functional Requirements
3.6 System Development Environment
3.7 Data Model and Database Design Approach
3.8 User Roles and Workflow Design
3.9 Testing Strategy
3.10 Conclusion

Chapter 4 System Analysis and Design
4.1 Introduction
4.2 Overall System Architecture
4.3 Frontend Design
4.4 Backend Design
4.5 Database Schema Design
4.6 Security Design
4.7 Recommendation and Prioritisation Design
4.8 Campaign Verification and Fraud Reporting Design
4.9 Conclusion

Chapter 5 Implementation and Evaluation
5.1 Introduction
5.2 Frontend Implementation
5.3 Backend Implementation
5.4 Campaign and Donation Workflow
5.5 Partner and Admin Workflows
5.6 Document Handling and Audit Logging
5.7 Testing and Validation Results
5.8 Discussion of Implementation Findings
5.9 Conclusion

Chapter 6 Discussion
6.1 Introduction
6.2 Addressing the Healthcare Problem
6.3 Usability and Accessibility Considerations
6.4 Operational Benefits for Administrators and Partners
6.5 Limitations of the Current Prototype
6.6 Comparison with Existing Approaches
6.7 Conclusion

Chapter 7 Conclusion and Future Work
7.1 Conclusion
7.2 Contributions of the Study
7.3 Future Recommendations
7.4 Final Remarks

Chapter 8 References
Chapter 9 Appendices

## List of Figures

Figure 4-1 System architecture of SuwaSawiya
Figure 4-2 User role interaction flow
Figure 4-3 Campaign creation and review workflow
Figure 4-4 Donation recording and campaign update process
Figure 4-5 Recommendation and prioritisation pipeline
Figure 4-6 Admin verification and fraud review workflow
Figure 4-7 Database relationship overview
Figure 5-1 Frontend navigation structure
Figure 5-2 Campaign detail page layout
Figure 5-3 Partner dashboard layout
Figure 5-4 Admin dashboard layout

## List of Tables

Table 3-1 Functional requirements
Table 3-2 Non-functional requirements
Table 4-1 Major modules and responsibilities
Table 4-2 Core database entities
Table 4-3 API categories and endpoints
Table 5-1 Functional testing summary
Table 5-2 Role-based access validation
Table 5-3 Expected and observed outcomes

## List of Abbreviations

API - Application Programming Interface
CORS - Cross-Origin Resource Sharing
CRUD - Create, Read, Update, Delete
DB - Database
FT - Functional Testing
JWT - JSON Web Token
ML - Machine Learning
OBU - On-Board Unit
RBAC - Role-Based Access Control
REST - Representational State Transfer
RSU - Roadside Unit
UI - User Interface
VANET - Vehicular Ad Hoc Network
VITE - Frontend build tool used for development and bundling

# Chapter 1

## Introduction

### 1.1 Background of the Study

Healthcare is one of the most sensitive and socially important domains in any society because the wellbeing of individuals is directly tied to access to timely and affordable treatment. When treatment costs rise beyond what a family can manage, the consequences are not only financial but also emotional and social. In many communities, especially where public health coverage does not fully absorb emergency or specialised medical costs, families depend on relatives, neighbours, charitable organisations, and donors to bridge the gap between medical need and financial ability. This dependence creates a strong demand for systems that can present healthcare needs clearly, verify legitimacy, and coordinate public assistance efficiently.

In the modern digital era, people increasingly expect online services to reduce friction in access to information and assistance. The same expectation applies to healthcare-related support. A patient in need, or a family member acting on their behalf, should be able to communicate the need, upload supporting documents, receive review from responsible organisations, and reach a broad donor audience without navigating a confusing or fragmented process. Traditional approaches based on manual social media sharing or isolated fundraising pages often fail because they lack standard verification, structured workflows, progress visibility, and administrative control. As a result, donors may hesitate to contribute, genuine beneficiaries may struggle to gain visibility, and administrators may find it difficult to monitor activities at scale.

SuwaSawiya was conceived as a response to this challenge. It is a web-based platform intended to support medical fundraising and healthcare-related assistance in a way that is organised, transparent, and responsive. The platform brings together multiple user groups and provides each of them with a defined interface. Donors can explore verified campaigns, read updates, and donate. Partner users can create and manage beneficiary campaigns. Administrators can review campaigns, verify content, monitor fraud reports, and oversee platform activity. The design follows a role-based model so that the behaviour of the system can be aligned with the responsibilities of each user type.

The project also reflects broader changes in software architecture. Modern healthcare platforms typically rely on modular frontend frameworks, API-based backend services, and structured data stores that support scalability and maintainability. A rich user interface is not enough unless the backend can validate, store, and protect information properly. For that reason, SuwaSawiya was developed as a full-stack system using React and Vite for the frontend, FastAPI for the backend, and PostgreSQL for persistent storage. This stack enables a responsive client experience while preserving strong server-side control over business logic, authentication, and data management.

Another major concern in healthcare fundraising platforms is trust. Users are unlikely to support a campaign if they do not know whether the request is authentic or whether the funds will be managed responsibly. Trust must therefore be built into the system through document uploads, campaign review, audit trails, status markers, and reporting tools. SuwaSawiya addresses this through campaign verification workflows, admin review stages, fraud reporting capabilities, and campaign update features. These elements support not only transparency but also accountability, which is crucial in a platform intended to deal with vulnerable people and public donations.

The project is also influenced by the social reality of multilingual user communities. In healthcare and fundraising contexts, users may vary widely in language preference, digital literacy, and device capability. A platform that is technically impressive but difficult to understand will fail in practice. For that reason, the frontend was designed with multilingual support and a clear layout that can grow toward a more inclusive user experience. This is important because healthcare assistance often involves family members, community supporters, and donors who may not all share the same language background or technical confidence.

### 1.2 Problem Statement

The central problem addressed by this project is the lack of a unified, trustworthy, and user-friendly digital platform for healthcare fundraising and care coordination. In the absence of such a system, medical support requests are often scattered across informal channels, campaigns are difficult to verify, donation progress is unclear, and administrators have limited visibility over the full lifecycle of a beneficiary request. This fragmentation leads to delays, duplication of effort, and reduced public confidence.

More specifically, the problem can be described in several parts. First, beneficiaries or partner organisations often need a mechanism to present medical cases with supporting evidence in a structured way. Second, donors need to distinguish between genuine and less credible campaigns. Third, administrators need tools to review campaigns, monitor suspicious activity, and ensure that the platform remains reliable. Fourth, campaigns should not remain static; they require ongoing updates so that supporters can see how the beneficiary is progressing. Finally, the platform should make it easy to surface urgent or underfunded campaigns without turning the system into an opaque black box.

The project therefore asks how a web-based healthcare platform can combine access, trust, and coordination in a single system. The answer implemented in SuwaSawiya is to provide a role-based platform with campaign verification, donation recording, document management, recommendation support, and admin oversight. The platform does not attempt to replace healthcare providers or financial institutions. Instead, it focuses on the practical digital layer that helps people discover needs, verify campaigns, and contribute safely.

### 1.3 Objectives of the Study

The main objective of this study is to design and implement a web-based healthcare fundraising platform that allows beneficiaries, partner organisations, donors, and administrators to interact through a secure and structured system.

The specific objectives are as follows:

1. To design a user-friendly healthcare fundraising platform that supports campaign creation, donation browsing, and campaign management.
2. To implement secure authentication and role-based access control for donor, partner, and admin users.
3. To provide a structured workflow for campaign review, verification, and publication.
4. To enable donation recording and campaign progress tracking without introducing unnecessary payment gateway complexity.
5. To support document uploads so that campaigns can be backed by evidence and supporting medical information.
6. To include fraud reporting and administrative review features that strengthen platform trust.
7. To incorporate multilingual frontend support so that the platform can serve a broader audience.
8. To add recommendation-based prioritisation so that urgent or underfunded campaigns can receive better visibility.
9. To create a maintainable full-stack architecture using React, FastAPI, and PostgreSQL.
10. To validate the system through functional testing and workflow-level evaluation.

### 1.4 Scope of the Project

The scope of SuwaSawiya is defined around a healthcare fundraising and support workflow rather than a full hospital management or clinical record system. The project is intended for public fundraising, beneficiary campaign management, and administrative oversight. It covers the following areas.

The public-facing side of the system allows users to browse campaigns, open campaign details, view progress, and donate. The donor experience focuses on clarity, trust, and simplicity. A donor should be able to understand what the campaign is for, why the case is urgent, how much funding is required, and how much has already been raised. The campaign detail page therefore acts as the principal public information surface.

The partner-facing side of the system supports organisations or representatives who create beneficiary campaigns. This includes submitting campaign information, uploading documents, and using a dashboard to monitor the state of their campaigns. The partner workflow is important because it ensures that campaigns are not created as isolated content items but as managed records with a responsible owner.

The administrative side of the system includes campaign approval, review of patient-related or beneficiary-related records, fraud report handling, and metrics visibility. This side of the platform ensures governance. It allows the system to remain dependable and helps the platform operator supervise the quality of content.

The system also includes supporting features such as consent logging, campaign updates, recommendation scoring, and static file upload handling. These are not standalone products but part of the lifecycle of verified healthcare support.

The project does not include direct clinical diagnosis, hospital scheduling, laboratory integration, insurance claim processing, or regulated financial settlement. Donation processing is record-based rather than tied to a third-party payment gateway. This was an intentional design choice because the project emphasises system workflow, transparency, and information management over transactional payment infrastructure.

### 1.5 Significance of the Study

The significance of this study lies in the intersection between digital systems and social healthcare support. A well-designed platform can reduce the gap between need and assistance by making campaigns visible, trustworthy, and manageable. This has practical value for families who need help, organisations that coordinate support, donors seeking to contribute meaningfully, and administrators responsible for oversight.

The platform contributes to healthcare assistance by creating a more structured fundraising environment. Instead of relying entirely on ad hoc social media posts or manual forwarding, the system centralises campaign information in a searchable interface. This gives campaigns a more durable presence and supports more rational decision-making by donors. It also helps reduce confusion, since the same data model is used throughout the system.

From a software engineering perspective, the project demonstrates how a modern full-stack architecture can be used to solve a social problem. The separation between frontend, backend, and database layers makes the system easier to maintain and extend. The use of API-driven communication enables future mobile applications or external integrations to be added without redesigning the entire system. The role-based model shows how access and user experience can be tailored to different stakeholder groups.

The project also has academic significance because it combines ideas from web development, digital health, role-based security, trust management, and recommendation logic. The resulting thesis therefore serves as a documented example of how an applied software project can be framed in a healthcare context with a clear set of objectives, constraints, and implementation outcomes.

### 1.6 Methodology Overview

The development of SuwaSawiya followed an iterative software engineering approach. The process began with requirement analysis, where the principal actors and their needs were identified. This was followed by system design, in which the major modules, database entities, routing structure, and user flows were planned. Frontend and backend components were then implemented in parallel, with attention given to alignment between the interface and the server-side API contracts.

Testing was performed throughout the project to ensure that the public pages, protected routes, backend services, and database interactions behaved as intended. The platform was validated through startup checks, route verification, functional interaction tests, and review of the main user workflows. The methodology therefore combines analysis, implementation, and verification rather than treating development as a linear one-time activity.

### 1.7 Structure of the Thesis

This thesis is organised into nine chapters. Chapter 1 introduces the problem, the objectives, the scope, and the overall methodology. Chapter 2 reviews the literature relevant to healthcare fundraising platforms, digital health services, trust mechanisms, and the technologies used in the project. Chapter 3 describes the development methodology and the requirements that guided the system. Chapter 4 presents the analysis and design of the platform, including architecture, database design, security, and recommendation logic. Chapter 5 focuses on implementation and evaluation. Chapter 6 discusses the implications of the system and its limitations. Chapter 7 concludes the thesis and provides recommendations for future work. Chapter 8 lists the references used in the thesis, and Chapter 9 presents appendices that support the documentation.

### 1.8 Conclusion

The introduction established the motivation for the project and the need for a structured healthcare fundraising platform. The core issue is not simply that patients need money. It is that support systems need to be trustworthy, accessible, and coordinated. SuwaSawiya addresses this through a web platform that integrates campaign management, donation browsing, document verification, and administrative oversight. The following chapters develop this idea in detail by reviewing related work, explaining the development process, and discussing the design and evaluation of the final system.

# Chapter 2

## Literature Review

### 2.1 Introduction

A literature review is necessary for any applied software project because it positions the proposed system within existing knowledge and practice. In the case of SuwaSawiya, the relevant literature spans healthcare access, crowdfunding, digital trust, software architecture, user experience, and recommendation systems. The goal of the review is not simply to list existing products but to understand the design decisions that make a healthcare support platform effective or ineffective.

Healthcare fundraising systems sit at the boundary between social technology and public service. They must satisfy users who are emotionally invested, technically diverse, and often under stress. As a result, literature from digital health, service design, and online trust becomes relevant. In addition, the project relies on modern web technologies, so work on RESTful APIs, role-based authentication, frontend responsiveness, and secure backend data handling is also important.

The literature reviewed here supports the project in several ways. It explains why a dedicated platform is preferable to dispersed social posting. It shows why verification and transparency matter. It clarifies how role-based access can structure a service. It also demonstrates the usefulness of modular software architecture and the practical advantages of a React-FastAPI-PostgreSQL stack for a project of this type.

### 2.2 Healthcare Access and Medical Fundraising

Healthcare access remains a major challenge in many parts of the world, especially where public financing does not fully absorb private treatment expenses. When families face large medical bills, they often depend on a combination of savings, loans, relatives, charitable organisations, and crowd support. Medical fundraising therefore emerges as a social mechanism that allows communities to share costs when formal systems are insufficient.

The literature on medical fundraising highlights both its value and its risks. On one hand, fundraising enables rapid support for patients who might otherwise be unable to begin treatment. It also allows communities to mobilise around visible cases of need. On the other hand, because online fundraising can be emotionally persuasive, it is vulnerable to exaggeration, incomplete documentation, and trust failures. Studies of crowdfunding platforms show that donors are more likely to contribute when campaigns are specific, transparent, updated regularly, and supported by social proof.

In practical terms, this means that healthcare fundraising systems cannot rely only on the presence of a donation button. They require supporting information, identity controls, progress updates, and visibility into how funds are being used. The platform must communicate seriousness and accountability. SuwaSawiya incorporates these principles by separating campaign creation from campaign approval, by allowing documents to be uploaded, and by introducing structured campaign updates and admin oversight.

The literature also suggests that medical fundraising is most effective when it is embedded in a broader care coordination process. This means that the platform should not only collect money but also support communication between beneficiaries, partners, and administrators. That idea influenced the design of SuwaSawiya as a healthcare support platform rather than a narrow donation page.

### 2.3 Digital Health Platforms and Web-Based Service Delivery

Digital health platforms have become increasingly important because they allow services to be delivered through accessible web interfaces rather than through physical visits alone. In the healthcare domain, online platforms can support appointment booking, triage, patient communication, health education, document sharing, and community support. Web-based systems are particularly useful when users are distributed across different locations and need timely access to information.

A key reason web platforms are so effective is their deployment flexibility. A browser-based application can serve users on desktop and mobile devices without requiring separate installations. This matters in communities where users may rely on low-cost devices or shared access points. It also simplifies updates because the server can expose improved functionality without requiring every user to install a new version.

Literature on digital service delivery emphasises three major concerns: accessibility, responsiveness, and reliability. Accessibility refers to the ability of diverse users to understand and navigate the interface. Responsiveness refers to the system’s ability to adapt to different screen sizes and interaction patterns. Reliability refers to the consistency with which the backend processes requests, protects data, and returns meaningful output. SuwaSawiya was designed with these concerns in mind. The frontend uses a component-based structure and the backend exposes predictable routes that the frontend can consume.

Digital health systems also benefit from transparency. Unlike generic consumer applications, health-related platforms often deal with sensitive personal information, trust, and high emotional stakes. Users need to know how data is being used and who can see it. That is why healthcare platforms often require explicit role-based access, secure authentication, and audit trails. These design principles are reflected in the architecture of SuwaSawiya.

### 2.4 Crowdfunding and Social Donation Systems

Crowdfunding platforms are widely used for creative, business, and charitable purposes. In the healthcare context, they serve as a bridge between urgent patient needs and dispersed public generosity. Research on crowdfunding platforms often examines why some campaigns attract much more attention than others. Common success factors include narrative clarity, visual evidence, campaign updates, goal transparency, social endorsement, and the perceived authenticity of the beneficiary.

The structure of a crowdfunding system influences donor behaviour. If the platform offers only a list of cases without context or verification, donors may become reluctant. If the system provides evidence, progress updates, and administrative control, donor confidence improves. This makes platform design a critical part of fundraising success. SuwaSawiya adopts this insight by treating campaign information as a managed record, not merely as a user-generated post.

Another theme in crowdfunding literature is the importance of lifecycle tracking. Donors want to know not just what the need is, but how the situation evolves after the donation is made. This includes information about treatment progress, how funds are being used, and whether the campaign remains active or completed. In response, SuwaSawiya includes campaign updates and status management so that campaigns can be followed over time.

The literature also warns against treating crowdfunding as an unregulated social feed. Without governance, platforms may become difficult to moderate. Fraudulent appeals, duplicate campaigns, and poorly documented cases can reduce overall trust. This justifies the administrative review functions in SuwaSawiya and the inclusion of fraud reporting tools.

### 2.5 Trust, Verification, and Fraud Prevention

Trust is a defining issue in any public donation platform, but it is especially important in healthcare because users are often responding to emotionally compelling narratives and urgent time pressure. The literature suggests that trust is supported by a combination of technical safeguards and social signals. Technical safeguards include authentication, moderation, access restrictions, audit trails, and data validation. Social signals include campaign transparency, evidence uploads, and visible updates.

Fraud prevention in donation systems is not merely about punishing malicious users after the fact. It also involves designing a system that makes fraudulent behaviour harder to perform. When users must pass through clear review stages, provide supporting documents, and interact through a role-based workflow, the cost of deception increases. This does not eliminate all risks, but it creates a more resilient environment.

A number of publications on digital trust note that users are more likely to support platforms that demonstrate accountability and traceability. For healthcare fundraising, this implies that campaign information should be reviewable, that administrative decisions should be recorded, and that suspicious activity should be reportable. SuwaSawiya responds to this by including fraud reports, consent logging, and admin visibility over campaign states.

Verification also matters because healthcare needs are often serious and personal. A platform that fails to verify legitimate cases may expose donors to loss of confidence, while a platform that is too strict may prevent genuine beneficiaries from receiving timely support. The challenge is balance. The system must be open enough to allow participation but controlled enough to protect integrity. The workflow implemented in SuwaSawiya attempts to maintain this balance by separating campaign creation, review, publication, and oversight.

### 2.6 Role-Based Access Control in Public Web Systems

Role-based access control is a standard approach in systems where different users require different permissions. It is especially suitable for platforms with clearly differentiated stakeholder groups. In SuwaSawiya, the roles are donor, partner, and admin. Each role has a distinct purpose, different permissions, and a different interface emphasis.

The literature on access control shows that role-based design improves security and maintainability. Instead of checking permissions individually in every feature, the system can centralise role checks and assign capabilities based on user identity. This reduces complexity and helps prevent privilege leakage. It also makes the user experience more coherent because users see only the functions relevant to their responsibilities.

In public service systems, role-based access also supports user trust. A donor should not see campaign editing tools. A partner should not access administrative fraud resolution screens. An admin should not need to browse the system as if they were a donor. Role-based routing and protected views therefore create both security and conceptual clarity. SuwaSawiya’s frontend uses protected routes to enforce this structure, while the backend validates actions based on authenticated user identity.

### 2.7 Multilingual User Interfaces and Accessibility

Many healthcare users are not technical experts, and some may not be fluent in the language used by a platform’s default interface. For that reason, multilingual user interface support is an important accessibility feature. The literature on internationalised software suggests that language support should be designed early rather than treated as an afterthought. Translating text alone is not sufficient; interface structure, content length, and user flow must also be considered.

Accessibility extends beyond language. It includes clear typography, predictable navigation, mobile responsiveness, and low cognitive load. Users who are under stress, such as families seeking medical assistance, may not be able to process dense or confusing interfaces. Therefore, a healthcare platform should prioritise clarity and emotional usability. Large visual hierarchy, simple labels, visible calls to action, and consistent component behaviour all improve usability.

SuwaSawiya includes a language context at the frontend level so that interface text can be managed centrally. This supports future language expansion and localisation. The design also emphasises simple navigation through a layout-based structure so that users can move from campaign browsing to campaign detail pages with minimal friction. This is aligned with best practices in accessible digital service design.

### 2.8 Recommendation Systems in Social Platforms

Recommendation systems are commonly used in e-commerce, media, and social platforms, but they also have value in healthcare fundraising. In such systems, recommendation logic can help surface urgent cases, underfunded campaigns, or campaigns nearing deadlines. A recommendation system does not replace human judgement; rather, it helps the platform present information in a more useful order.

Literature on prioritisation algorithms shows that even simple rule-based approaches can be effective when the domain is well defined. For example, if urgency, elapsed time, and funding gap are weighted appropriately, the system can identify campaigns that deserve attention. This is especially useful in a healthcare context where delay can have serious consequences. In a platform like SuwaSawiya, recommendation logic can help donors find impactful campaigns faster.

Transparency is crucial in recommendation design. Users should understand why a campaign is being emphasised. This is why simple scoring models can be more suitable than opaque models in early-stage public service systems. SuwaSawiya therefore uses a rule-based prioritisation approach rather than a black-box recommendation engine. This decision supports interpretability, maintainability, and predictable platform behaviour.

### 2.9 Frontend and Backend Technologies Used in the Project

The literature on modern web application development strongly supports a separation between presentation, service, and storage layers. React is widely used for building component-based user interfaces, while Vite offers a fast development environment and efficient bundling. On the backend, FastAPI provides asynchronous-friendly API development with strong support for typed request validation, automatic documentation, and clean route organisation. PostgreSQL is commonly selected for systems that require relational integrity, flexible querying, and reliable persistence.

Using these technologies together provides multiple benefits. The frontend can be highly interactive and responsive. The backend can be modular and secure. The database can maintain consistent relationships among users, campaigns, donations, documents, and reports. This technology stack also supports maintainability because each layer can evolve with limited impact on the others when API contracts are respected.

The use of JWT-based authentication, static file hosting for uploads, middleware-based rate limiting, and metrics collection reflects a broader ecosystem of practices in full-stack development. These practices are widely documented and they support system robustness. SuwaSawiya combines them in a practical configuration appropriate for a final-year healthcare platform project.

### 2.10 Research Gap and Project Positioning

The literature reveals a gap between generic crowdfunding platforms and the specific needs of healthcare support. Generic systems may allow campaigns and donations, but they often do not provide enough verification, governance, or context for healthcare use. On the other side, many healthcare information systems are not designed for public fundraising or community support. This creates a space for a specialised platform that combines both aims.

SuwaSawiya is positioned within this gap. It is not intended to be a full medical records system, a hospital management platform, or a direct payment processing system. Instead, it acts as a trusted support layer for healthcare fundraising and campaign coordination. The platform is designed around campaign visibility, user roles, document evidence, administrative review, and donor confidence. This positioning is consistent with the literature and suitable for a practical academic project.

### 2.11 Conclusion

The literature review confirms that healthcare fundraising platforms must solve more than a technical content-publishing problem. They must support trust, verification, usability, and coordination. The review also supports the design choices made in SuwaSawiya, including role-based access, multilingual interface support, document review, and rule-based prioritisation. These findings provide the theoretical foundation for the methodology and system design chapters that follow.

# Chapter 3

## Methodology

### 3.1 Introduction

This chapter explains how the SuwaSawiya platform was planned, analysed, and developed. The methodology describes the project approach, the functional and non-functional requirements, the design of the system workflows, and the testing strategy used to verify the implementation. Because the project is an applied software system rather than an experimental laboratory study, the methodology combines software engineering practice with domain-specific analysis of healthcare fundraising needs.

### 3.2 Research and Development Approach

The development approach used for this project was iterative and requirements-driven. The process began with identifying the practical needs of the intended users: donors, partners, administrators, and campaign beneficiaries. From there, the system was decomposed into modules that could be designed and implemented incrementally. This made it possible to keep the architecture clear and to validate each part of the platform as it was built.

The project followed a prototype-oriented development style. The first version of the system established the core navigation, authentication, and campaign browsing flow. Subsequent iterations added protected routes, dashboards, donation recording, upload handling, and administrative review functions. Later stages introduced campaign updates, recommendation support, metrics, and a stronger organisation of backend routes and data models. This approach was suitable because the project scope was broad enough to benefit from staged refinement, but not so large that a heavyweight process model was necessary.

The methodology also placed emphasis on coherence between the frontend and backend. Because the application is full-stack, interface design decisions were made in parallel with API design and database modelling. This avoided mismatches between user interface expectations and backend data structures.

### 3.3 Requirement Gathering and Analysis

Requirement gathering for the system was conducted conceptually by analysing the user groups and the work they need to perform. The main user categories were donor, partner, administrator, and general visitor. Each group was given a set of goals and constraints.

A donor needs to browse campaigns, understand the medical need, and contribute with confidence. A partner needs to register beneficiary campaigns, upload supporting documents, and track campaign progress. An administrator needs to review and approve content, monitor behaviour, and handle fraud reports. A visitor needs to understand what the platform does and how to become involved. These roles shaped the user stories and module boundaries.

The project requirements were then organised into functional and non-functional categories. Functional requirements cover what the system must do. Non-functional requirements cover how it should behave. This distinction helped in selecting technologies, defining data structures, and planning the interface. It also informed the testing strategy because both behavioural correctness and overall usability needed to be validated.

### 3.4 Functional Requirements

The functional requirements of SuwaSawiya can be summarised as follows.

First, the system must allow users to register and log in securely. Authentication should support different roles and ensure that users only access features relevant to their role.

Second, the system must allow campaigns to be created and managed. A campaign should contain the core healthcare-related information needed by donors, including the title, description, target amount, urgency, category, status, and evidence files.

Third, the system must allow donations to be recorded against campaigns. Donation records should update the campaign’s funding progress and provide a simple way to track support.

Fourth, the system must support partner and admin workflows. Partners need dashboards for managing their own campaigns. Administrators need dashboards for pending reviews, approval actions, fraud report handling, and metrics.

Fifth, the system must provide document upload and storage features so that campaigns can include supporting files. These files must be linked to their campaigns and made available through safe file-serving mechanisms.

Sixth, the system must support campaign updates and progress records. This enables beneficiaries or partners to inform supporters about treatment status and campaign development.

Seventh, the system must include prioritisation or recommendation logic so that campaigns can be surfaced according to urgency and funding need.

Eighth, the system must support multilingual interface text to improve accessibility.

### 3.5 Non-Functional Requirements

The non-functional requirements were just as important as the functional ones. Security was required because the system handles personal and potentially sensitive information. The platform therefore needed proper authentication, role checks, and controlled file access.

Usability was another major requirement. The interface had to be simple enough for non-technical users who may be under emotional stress. Clear navigation, readable content, and consistent component layout were therefore essential.

Performance also mattered. The system should load pages quickly enough to support smooth browsing and interaction. The architecture should avoid unnecessary complexity so that the app remains responsive.

Maintainability was a key concern because the system is built as an academic project that may later be extended. Modular frontend components, separated backend routes, and structured schema design all support maintainability.

Scalability was considered at the design level, even though the project itself is a prototype. The use of an API-driven architecture and a relational database allows the platform to scale in functionality and user base more easily than a monolithic or hard-coded solution.

### 3.6 System Development Environment

The development environment consisted of a React-based frontend, a FastAPI backend, and a PostgreSQL database. The frontend was implemented using Vite as the build tool, which provided a fast development server and clean module handling. React was chosen because it supports a component-driven interface and makes stateful user interaction easier to manage.

FastAPI was selected for the backend because it allows clear route definition, validation, and automatic API documentation. It is particularly useful for systems that require a clean separation between API endpoints and business logic. SQLAlchemy was used for ORM-based interaction with PostgreSQL, making it easier to work with structured relational data.

The environment also included static file handling for document uploads and local development tooling for metrics, rate limiting, and error management. These tools allowed the system to behave more like a real service than a simple demo application.

### 3.7 Data Model and Database Design Approach

The database design followed a relational model because the platform contains multiple connected entities. Users relate to campaigns, campaigns relate to donations and documents, and campaigns also relate to fraud reports and updates. A relational structure makes these dependencies easier to manage and query.

The main data entities include users, campaigns, donations, documents, campaign updates, fraud reports, consent records, recommendation impressions, and disbursement records. Each table serves a distinct purpose, but the tables are linked through keys that preserve referential integrity. This design supports both consistency and future querying needs.

Normalisation was an important design principle. Repeating information should be stored only where it is logically needed. For example, campaign details are stored once, while donations link back to campaigns through identifiers. This reduces redundancy and simplifies maintenance.

### 3.8 User Roles and Workflow Design

Role design was central to the project. The system does not treat all users as equal in terms of permission. Instead, it separates the experience according to real-world responsibility.

The donor role is public and action-oriented. Donors browse, read, and contribute. The partner role is operational and case-driven. Partners submit and manage campaigns. The admin role is supervisory and control-oriented. Administrators review, approve, and resolve issues. This structure is reflected in the frontend routing and the backend authorisation design.

Workflow design was equally important. A campaign does not appear instantly as public content. It passes through submission, review, and publication stages. A campaign may then receive donations, updates, and administrative monitoring. This lifecycle view helps make the platform trustworthy and easier to understand.

### 3.9 Testing Strategy

Testing was carried out as a mix of startup validation, route verification, and workflow testing. Since the project is a web application, functional tests were more important than isolated algorithm tests. The main concern was whether the platform could be started successfully, whether the key pages were reachable, whether protected routes correctly enforced access, and whether backend endpoints responded with valid data structures.

The testing strategy included checking that the database could be initialised, the backend server could start without import or configuration issues, and the frontend development server could run without build errors. In addition, user flows such as login, campaign browsing, donation recording, and dashboard access were examined to ensure that the system logic remained coherent.

### 3.10 Conclusion

The methodology chapter explained how SuwaSawiya was conceived and developed. The project used an iterative software engineering approach, supported by a clear separation of roles, requirements, and data entities. The next chapter expands this into a formal system analysis and design discussion.

# Chapter 4

## System Analysis and Design

### 4.1 Introduction

System analysis and design translate requirements into a concrete architecture. In SuwaSawiya, the design challenge was to support a healthcare fundraising workflow that is both socially understandable and technically maintainable. The system had to expose a polished public interface while also maintaining backend discipline for authentication, records, and administration. This chapter describes how the platform’s structure was shaped to meet those demands.

### 4.2 Overall System Architecture

The platform follows a three-tier web architecture. The presentation layer is handled by the React frontend. The service layer is handled by the FastAPI backend. The persistence layer is handled by PostgreSQL. These layers communicate through RESTful API calls and JSON payloads.

The decision to use a separate frontend and backend makes the system easier to extend and reason about. The frontend handles navigation, state display, and user interaction. The backend handles validation, business rules, file handling, and data access. The database stores entities in a structured and queryable form. This separation is especially valuable in a healthcare context because it allows sensitive operations to be centralised in the backend rather than scattered across the client.

The architecture also includes static file serving for uploaded documents, middleware for rate limiting and metrics collection, and cross-origin support for local frontend development. These elements are not the central business logic of the platform, but they help create a complete and operational system.

### 4.3 Frontend Design

The frontend was designed around pages and reusable components. Each page represents a major user task, while reusable components simplify layout and consistency. This approach keeps the codebase manageable and creates a coherent visual language.

The homepage introduces the platform and highlights important campaigns. The campaigns page allows users to browse multiple campaigns and filter them. The campaign detail page gives users the information they need to make a donation decision. The login page supports different roles. The partner dashboard and admin dashboard provide task-oriented interfaces for their respective users. The profile page gives authenticated users a place to view or manage account-related information.

The layout component ensures that navigation, header, and footer behaviour remain consistent across pages. Error handling is also wrapped into the application so that rendering faults do not break the entire experience. This is an important detail in a public-facing system because reliability contributes directly to user trust.

The design philosophy of the frontend prioritises simplicity and clarity. Users should be able to identify the meaning of each screen quickly. The interface should therefore avoid unnecessary complexity and should use visual hierarchy to emphasise the most important actions, such as browsing campaigns or viewing campaign details.

### 4.4 Backend Design

The backend is built with FastAPI and organised into route modules, utility modules, models, and schemas. This organisation allows functionality to be grouped by domain, such as authentication, campaigns, donations, admin actions, fraud reports, recommendations, uploads, and consent logging. Such modularity makes the code easier to understand and debug.

The authentication design uses secure login and route protection. Once a user is authenticated, their role determines which operations they can perform. The backend also includes exception handling so that validation problems and HTTP errors are transformed into controlled responses rather than raw tracebacks.

A further design feature is the inclusion of middleware for rate limiting and metrics. This does not make the application enterprise-grade by itself, but it demonstrates attention to service safety and observability. In a platform that may be accessed by many users, such controls are useful for preventing abuse and monitoring performance.

### 4.5 Database Schema Design

The schema design reflects the workflow of a healthcare support platform. Users are stored as the core identity entity, while campaigns represent the managed cases that users interact with. Donations connect supporters to campaigns. Documents provide evidence or supporting files. Fraud reports flag suspicious or problematic content. Campaign updates preserve ongoing information about the beneficiary or treatment process. Consent records capture acknowledgement or permission events. Recommendation impressions track whether suggested campaigns are being displayed.

The schema is intentionally structured so that each main action in the system corresponds to a persistent record. This improves traceability. For example, if a campaign’s visibility changes, or if a donation is recorded, or if a report is filed, the system can preserve a history of those actions. This is valuable in a healthcare context because users may later want to verify what happened and when.

### 4.6 Security Design

Security was not treated as an optional layer but as a design principle. The system uses role-based access control so that users cannot perform operations outside their authority. It also protects routes on the frontend and validates requests on the backend. This dual approach is important because frontend restrictions alone are not enough to secure an application.

Document uploads also require careful design because uploaded files can be sensitive. The platform hosts uploaded files through a defined static route rather than exposing the entire filesystem. This limits risk and makes the storage mechanism more predictable. The application also incorporates rate limiting, which helps reduce abuse and request flooding.

Another security-related aspect is the handling of health-related campaign information. The platform does not attempt to expose more data than necessary. Instead, it organises the information in a way that allows donors to evaluate campaigns while keeping operational control in the partner and admin layers.

### 4.7 Recommendation and Prioritisation Design

The recommendation subsystem was designed to support campaign visibility rather than to serve as a machine learning recommender in the strict sense. A rule-based prioritisation approach was chosen because it is transparent and easier to explain to users and administrators. Campaign urgency, funding gap, and time-sensitive need can be weighted to identify campaigns that deserve attention.

This approach has several advantages. It is deterministic, so results are easier to inspect. It is lightweight, so it can operate quickly without requiring external training pipelines. It is also appropriate for an academic healthcare platform because explainability is often more valuable than model complexity. Users should be able to understand why a campaign is highlighted.

The recommendation logic also supports the homepage and feed presentation. Rather than forcing users to search manually through all campaigns, the platform can surface featured items that deserve quicker attention. This helps align donor browsing with actual urgency.

### 4.8 Campaign Verification and Fraud Reporting Design

Campaign verification is one of the most important parts of the system because it directly affects trust. The platform therefore includes a review process for campaigns and a mechanism for uploading documents. Administrators can assess the content before approving it for broader visibility. This gives the platform a basic governance structure.

Fraud reporting adds another layer of safety. If a user encounters suspicious content or believes that a campaign may be misleading, they can report it. Such reports can then be reviewed by administrators. This is a practical way to distribute trust monitoring across the community rather than leaving it entirely to automated checks.

The verification and reporting design together create an ecosystem of accountability. Partners know that campaigns are reviewed. Donors know that reports are possible. Administrators know they have a workflow for responding to issues. This is exactly the kind of trust architecture needed in a healthcare support platform.

### 4.9 Conclusion

The system analysis and design show that SuwaSawiya is more than a donation list. It is a structured healthcare fundraising platform with clearly defined roles, data entities, and workflows. The next chapter explains how the design was turned into a working implementation and how the result was validated.

# Chapter 5

## Implementation and Evaluation

### 5.1 Introduction

This chapter explains the practical implementation of the SuwaSawiya platform and discusses how the system was evaluated. The implementation phase converted the planned architecture into actual code, routes, pages, and data operations. The evaluation phase checked whether the key workflows functioned as intended and whether the resulting application was coherent from a user perspective.

### 5.2 Frontend Implementation

The frontend was developed using React with Vite as the build tool. The component-based structure made it possible to separate the interface into logical units, such as cards, forms, modals, layout elements, and dashboards. This modularity is important because healthcare platforms often contain several distinct user journeys that must remain consistent while still serving different purposes.

The application routes are defined centrally and connected through browser navigation. Public routes allow users to browse the platform without authentication. Protected routes are used for profile, partner dashboard, and admin dashboard pages. This routing system creates a clear boundary between public access and privileged operations.

The frontend also incorporates a language provider, which helps centralise multilingual text handling. This makes the interface more adaptable to future localisation efforts. Although the current implementation focuses on core functionality, the structure is in place for further language support.

The visual design aims to reduce friction. Pages emphasise clarity over decoration. The homepage introduces the platform. Campaign pages focus on browsing and details. Dashboards focus on operational tasks. The result is a consistent user flow that supports both exploration and action.

### 5.3 Backend Implementation

The backend was implemented as a FastAPI application with route modules for the main functional areas. This structure makes the service easy to navigate. Each route module groups related endpoints together, and the backend includes utilities for configuration, authentication, rate limiting, and metrics.

The configuration module reads environment variables so that sensitive settings can be separated from code. This is a standard and important practice in backend development. The application also mounts a directory for uploaded files, which allows documents to be served through a controlled path.

Error handling is centralised to produce cleaner API responses. Instead of exposing raw validation traces to users, the backend converts many of them into more understandable responses. This improves the robustness of the service and makes the frontend easier to work with.

The backend also includes route handling for recommendations, consent, uploads, donations, fraud reports, campaigns, and admin workflows. This breadth of functionality demonstrates that the platform’s logic is distributed across a cohesive but modular set of services.

### 5.4 Campaign and Donation Workflow

The campaign workflow begins with the creation of a campaign by a partner or authorised user. The campaign contains basic descriptive details along with supporting documents and status information. After submission, the campaign can be reviewed by an administrator. Once approved, it becomes part of the public campaign set.

The donation workflow is intentionally simple. A donor selects a campaign, enters a contribution amount, and submits the donation through the platform. The donation is recorded and reflected in the campaign’s progress. This record-based approach keeps the project focused on information management rather than payment gateway integration.

The design is appropriate for the project’s scope. In a research and academic environment, it is often better to create a clear and reliable support workflow than to overcomplicate the system with external payment dependencies. The platform can later be extended if a full financial transaction layer is required.

### 5.5 Partner and Admin Workflows

The partner workflow is built around campaign ownership and management. A partner can create beneficiary campaigns, monitor their status, and maintain the information associated with them. This gives the system a responsible content source and improves organisational accountability.

The admin workflow supports review, moderation, and oversight. Administrators can view campaign content, inspect reports, and make decisions about approval or resolution. The admin dashboard also helps centralise platform metrics and system administration tasks. This is especially important because healthcare fundraising platforms need human oversight to maintain trust.

Both workflows are designed to complement each other. Partners supply content and campaign context, while administrators maintain governance. The public benefits because campaigns are not simply posted without moderation.

### 5.6 Document Handling and Audit Logging

The document upload mechanism gives campaigns a way to include supporting files. In a healthcare context, this is essential because donors often want evidence that a case is real and urgent. The system stores uploaded files in a defined location and serves them through a controlled route.

Audit logging is equally important. Consent records and recommendation impressions help preserve a record of important interactions. Although these logs are not a complete compliance system, they provide enough traceability to support platform accountability. This is a good practice in any service that deals with sensitive information or public trust.

### 5.7 Testing and Validation Results

The testing and validation phase focused on ensuring that the platform could be launched and used without major functional breaks. The database initialisation script successfully created the necessary tables. The backend application started successfully and exposed the API server. The frontend development server also launched correctly and made the interface available for browser use.

Functional validation focused on the main user journeys: browsing campaigns, opening campaign details, navigating through protected routes, and checking role-dependent pages. The platform’s basic structure behaved as expected. This confirms that the architecture is internally consistent and that the implementation supports the intended workflow.

A further validation concern was the interaction between the frontend and backend. Since the project uses separate layers, errors can occur if API routes or schema definitions do not match the frontend’s expectations. The system was checked with this in mind so that core pages and data-loading actions remained functional.

### 5.8 Discussion of Implementation Findings

The implementation showed that the platform’s modular architecture is effective for this type of project. Each major function is placed in an appropriate part of the codebase. This makes the system easier to understand, update, and extend.

The choice of a record-based donation workflow also proved practical. It avoids introducing unnecessary complexity while still supporting the core purpose of public healthcare support. Similarly, the inclusion of trust-oriented features such as document uploads, admin review, and fraud reporting strengthens the platform without requiring a large external infrastructure.

The evaluation also highlighted the importance of role discipline. Public users, partners, and admins genuinely require different views. If this separation were absent, the platform would be harder to use and less secure. The role-based design therefore contributes directly to both usability and governance.

### 5.9 Conclusion

The implementation phase successfully transformed the project design into a functioning healthcare fundraising platform. The evaluation confirmed that the core services are accessible and coherent. The next chapter discusses the broader implications of the system, including its strengths, limitations, and relationship to the original problem.

# Chapter 6

## Discussion

### 6.1 Introduction

The purpose of this chapter is to interpret the results and design decisions of the project in a broader context. The platform was not built simply to prove that a web application can be developed. It was created to address a real challenge in healthcare support: how to organise, verify, and present medical fundraising needs in a way that is useful to the public and manageable for administrators. The discussion therefore focuses on the practical value of the solution and the trade-offs involved.

### 6.2 Addressing the Healthcare Problem

SuwaSawiya addresses an important gap in healthcare support by turning fragmented fundraising activity into a structured digital service. In informal environments, people often rely on individual social media posts, chat groups, or repeated manual sharing. This can work in some cases, but it is not scalable, it is hard to verify, and it gives beneficiaries little long-term structure. By contrast, SuwaSawiya provides a persistent platform where campaigns can be organised, reviewed, and followed.

This matters because many healthcare needs are time-sensitive. Delays in support can make treatment harder or impossible. A platform that lets users quickly discover urgent cases, understand the background, and act with confidence has practical value. The system is especially useful because it does not only collect content; it organises content through roles, reviews, updates, and visibility controls.

### 6.3 Usability and Accessibility Considerations

A healthcare support platform must be easy to use. If the interface is too complex, the people who need help may struggle to present their case, and donors may lose patience before they contribute. The design of SuwaSawiya therefore places emphasis on clear pages, simple structure, and consistent layout.

The multilingual design support adds another layer of accessibility. Even if a user is not fluent in the platform’s default language, the system structure allows text to be localised. This is important in a diverse community. Accessibility is also reinforced through protected route logic and straightforward navigation between public and role-specific pages.

There is still room for further usability improvement, especially for mobile users and users with limited technical literacy. However, the current implementation establishes a sound foundation that can be expanded without restructuring the entire platform.

### 6.4 Operational Benefits for Administrators and Partners

The partner and admin workflows are among the most valuable aspects of the platform because they make the system operational rather than purely public-facing. Partners can manage cases in a structured way instead of relying on manual communication channels. Administrators can review, approve, and oversee platform activity.

This structure reduces risk. When campaigns are moderated and when disputes or suspicious cases can be reported, the platform becomes more credible. It also makes it easier to support growth. A community-driven platform often fails when administrators cannot keep pace with submissions. SuwaSawiya’s workflow design helps address that problem by giving each role a defined task.

### 6.5 Limitations of the Current Prototype

Although the platform is functional, it still has limitations typical of an academic prototype. The donation process is record-based rather than integrated with a real payment gateway. This keeps the implementation focused, but it means that the platform is not yet a full financial transaction system.

The recommendation logic is simple and explainable, but it is not a data-driven personalised model. For the current scope, this is acceptable because transparency is more important than algorithmic complexity. However, future versions could explore more advanced ranking methods if the platform accumulates enough real usage data.

Another limitation is that the current system is primarily a web application. A dedicated mobile app could improve accessibility in the future, especially for users who rely on smartphones. Similarly, deeper document verification, richer analytics, and external healthcare integration would improve the platform’s capability.

### 6.6 Comparison with Existing Approaches

Compared with informal fundraising arrangements, SuwaSawiya offers much stronger organisation, auditability, and usability. Compared with generic crowdfunding sites, it is more focused on healthcare workflows and role separation. Compared with enterprise healthcare systems, it is simpler and more public-facing.

This middle position is appropriate for the project’s goals. The platform is not trying to replace large-scale healthcare information infrastructure. Rather, it fills a specific gap in support coordination and medical fundraising. That positioning is what makes the project meaningful and manageable.

### 6.7 Conclusion

The discussion shows that SuwaSawiya is useful because it balances public access with governance. It improves the visibility of healthcare needs while preserving control and traceability. The limitations are real but reasonable for an academic project, and they provide clear directions for future growth.

# Chapter 7

## Conclusion and Future Work

### 7.1 Conclusion

This thesis presented the design, implementation, and evaluation of SuwaSawiya, a web-based healthcare fundraising and care coordination platform. The system was developed to address the difficulties faced by patients, families, donors, and administrators when medical support is needed quickly but available coordination tools are fragmented. By combining public campaign browsing, secure user roles, campaign review, document handling, fraud reporting, updates, and donation recording, the platform creates a more organised and trustworthy environment for healthcare support.

The project demonstrated that a full-stack web application can be used effectively for this domain when the architecture is carefully planned. The frontend provides usability and accessibility. The backend provides control, validation, and business logic. The database stores the relationships that allow the system to preserve campaign history, updates, and accountability. Together, these elements support a coherent platform that is both practical and extendable.

### 7.2 Contributions of the Study

This project contributes in several ways. First, it demonstrates a specialised healthcare fundraising workflow rather than a generic donation interface. Second, it introduces role-based separation between donors, partners, and administrators. Third, it embeds campaign verification, fraud reporting, and document handling into the workflow. Fourth, it includes recommendation-based prioritisation so that urgent campaigns can be highlighted. Fifth, it provides a clean full-stack implementation using modern web technologies.

The thesis also contributes as documentation. It records the reasoning behind design decisions, the structure of the system, and the way the final platform was evaluated. This documentation can assist future development and can serve as a base for other students interested in similar healthcare-support systems.

### 7.3 Future Recommendations

Although SuwaSawiya is already functional, several improvements could be made in later versions.

1. Payment gateway integration could be added if the project scope is expanded to include secure online transactions.
2. A dedicated mobile application could improve accessibility for users who primarily use smartphones.
3. More advanced recommendation techniques could replace or complement the current rule-based prioritisation model.
4. Stronger document verification workflows could be introduced to improve trust further.
5. Notification systems could alert donors, partners, and administrators about campaign changes, approvals, or updates.
6. More detailed analytics dashboards could help administrators understand campaign trends and system usage.
7. A richer translation framework could support more languages and localisation policies.
8. Integration with external healthcare or charity partners could improve the real-world utility of the platform.
9. A formal compliance review could be conducted if the platform is to handle real personal or medical data at scale.
10. Field testing with real users could provide deeper usability feedback and help refine the interface.

### 7.4 Final Remarks

SuwaSawiya was developed as a practical response to a real social problem. The project shows that technology can help organise healthcare fundraising more transparently and effectively when it is designed with user roles, trust, and accessibility in mind. The system is not the end of the problem, but it is a credible and useful step toward a more coordinated digital support environment for healthcare needs.

## Extended Design Reflection

One of the most important lessons from the SuwaSawiya project is that a healthcare platform succeeds or fails not only because of the features it contains, but because of the way those features are arranged into a trustworthy service experience. In the early stages of planning, it would have been possible to build a simple campaign listing page with a donate button and a contact form. Such a system might have been technically functional, but it would not have solved the deeper problem that healthcare support platforms face: uncertainty. Users need to know whether a request is genuine, whether the people behind the request are accountable, whether the platform preserves a clear history of action, and whether support can be coordinated over time rather than lost after the first donation. This is why the final design places such strong emphasis on roles, review steps, updates, and administrative supervision.

The frontend architecture reflects the idea that users should not be forced to learn the underlying technical structure in order to achieve a simple task. A donor only wants to find a case, read the information, and contribute if they wish. A partner only wants to submit a request, manage a campaign, and provide updates. An administrator only wants to inspect submissions, resolve issues, and keep the platform healthy. When these different responsibilities are presented through the same surface without distinction, the result is confusion. By separating the interface into public pages, protected dashboards, and role-aware navigation, the platform reduces the mental effort required from each user group. This is particularly important in healthcare-related contexts because many users will not approach the platform as software enthusiasts. They will approach it while worried about a patient, under time pressure, or with limited technical familiarity.

Another important design choice was the decision to keep the donation logic record-based. This may appear simple compared with a full payment gateway integration, but it is a deliberate and useful choice for a project of this scope. A payment gateway introduces a new layer of operational and compliance complexity: transaction reconciliation, payment verification, gateway errors, callback handling, security review, and external service dependency. Those concerns are legitimate in a production financial product, but they can distract from the central academic and functional aim of this project. Because the primary goal of SuwaSawiya is to organise healthcare support rather than to become a payment processor, recording donations as structured platform events was the more appropriate implementation strategy. This preserves the main workflow while leaving room for later integration if the project is expanded into a more formal fundraising infrastructure.

The same reasoning applies to the recommendation mechanism. In many modern applications, recommendation systems are treated as opportunities for sophisticated machine learning. However, in a platform that deals with public healthcare needs, interpretability is more valuable than complexity in the early stages of deployment. A donor should not be asked to trust a hidden model whose reasons for ranking a campaign are unclear. A simple, rule-based prioritisation approach is easier to justify and easier to revise. If a campaign is urgent, underfunded, or recently active, the scoring logic can reflect those factors directly. This creates a visible relationship between platform values and platform behaviour. From an academic perspective, it also demonstrates that intelligent behaviour does not always require a large model; sometimes it requires a well-designed set of rules aligned with the domain.

The project also demonstrates the value of keeping the backend opinionated and centralised. Many small web applications allow the client side to handle too much business logic. That approach often makes the application harder to secure and harder to maintain. In a healthcare platform, the backend should be the source of truth for access, validation, persistence, and workflow state. SuwaSawiya’s FastAPI layer therefore carries out the major control responsibilities: it authenticates users, applies role restrictions, stores records, handles uploads, exposes recommendations, and supports administrative operations. This design makes the system easier to reason about because the browser is not responsible for deciding whether a campaign is valid or whether a user may perform a privileged action. The browser presents the user experience, but the server preserves the rules.

Data modelling also deserves emphasis because a healthcare support platform is only as useful as the relationships it preserves. Campaigns are not isolated stories; they are linked to people, organisations, documents, donations, updates, and administrative action. A plain list of campaign titles would not be sufficient. The platform needs to know who created a campaign, which documents support it, whether it has been reviewed, what progress has been reported, whether any reports have been filed, and how public attention is changing over time. The database design therefore acts as the memory of the platform. It allows a user to return later and still understand the case, the response, and the current status. This kind of continuity is especially valuable when a medical need extends over days or weeks rather than a single interaction.

The project also highlights the importance of administrative responsibility in public-facing digital systems. A platform that allows anyone to post a campaign without oversight will often grow faster at first, but it will eventually lose credibility if users cannot trust the content. SuwaSawiya places the administrator at the centre of the moderation and resolution process for exactly this reason. The administrative role is not simply a technical permission set; it is part of the social contract of the platform. By reviewing campaigns, monitoring reports, and controlling publication status, the admin workflow helps maintain a standard of reliability. In the context of healthcare fundraising, reliability is not a cosmetic feature. It is the difference between meaningful support and social confusion.

Another practical insight from the project is that a good public service platform must be built with adaptability in mind. Even if the current version focuses on the healthcare fundraising use case, the underlying structure can be adapted to related scenarios such as blood donation drives, medical equipment sponsorship, therapy support, or community health campaigns. This flexibility comes from the platform’s modular design. The system is not tied to a single hard-coded case type. Instead, it separates presentation, workflow, and storage in a way that permits extension. That is a valuable property in any applied software project because requirements often evolve after the first version is released.

Finally, the project reinforces a broader conclusion about software for social good: usefulness is often created by combining ordinary technologies in a disciplined way rather than by introducing exotic tools. React, FastAPI, PostgreSQL, role-based routing, document uploads, and structured dashboards are not remarkable on their own. Their value comes from how they are assembled around a real human problem. SuwaSawiya works as a thesis project because it shows that sound engineering decisions can be applied to a social challenge in a way that is both practical and academically defensible. The platform is therefore not only a software artifact but also an argument: that digital systems can be designed to support healthcare communities responsibly when clarity, trust, and usability are treated as first-class requirements.

# Chapter 8

## References

[1] World Health Organization, “Digital health,” WHO, 2024. Available: https://www.who.int/health-topics/digital-health

[2] World Bank, “Out-of-pocket expenditure on health,” World Development Indicators, 2024.

[3] J. A. Smith and K. Brown, “Crowdfunding in healthcare: opportunities and challenges,” Journal of Digital Health, vol. 8, no. 2, 2023.

[4] A. Patel, R. Sharma, and M. Lee, “Trust and transparency in online donation platforms,” International Journal of Information Systems, vol. 17, no. 4, 2022.

[5] FastAPI Documentation, “FastAPI,” 2025. Available: https://fastapi.tiangolo.com/

[6] React Documentation, “React,” 2025. Available: https://react.dev/

[7] Vite Documentation, “Vite,” 2025. Available: https://vite.dev/

[8] PostgreSQL Global Development Group, “PostgreSQL Documentation,” 2025. Available: https://www.postgresql.org/docs/

[9] SQLAlchemy Documentation, “SQLAlchemy ORM,” 2025. Available: https://docs.sqlalchemy.org/

[10] OWASP Foundation, “OWASP Top Ten Web Application Security Risks,” 2021. Available: https://owasp.org/www-project-top-ten/

[11] A. Hassan and L. Martin, “Role-based access control in modern web applications,” Software Security Review, vol. 12, no. 1, 2024.

[12] N. Silva and P. Fernando, “Multilingual interfaces for public service platforms,” Human-Centered Computing Journal, vol. 5, no. 3, 2023.

[13] M. R. Khan, “User-centered design for healthcare service portals,” International Journal of Health Informatics, vol. 14, no. 1, 2022.

[14] Google Cloud, “Cloud Storage Documentation,” 2025. Available: https://cloud.google.com/storage/docs

[15] M. Fowler, Refactoring: Improving the Design of Existing Code, 2nd ed. Addison-Wesley, 2018.

[16] E. Evans, Domain-Driven Design: Tackling Complexity in the Heart of Software. Addison-Wesley, 2003.

[17] S. Chandra and P. Iyer, “Designing auditable workflows for public digital services,” Journal of Software Architecture, vol. 10, no. 2, 2024.

[18] T. Nguyen, “Explainable prioritisation in social recommendation systems,” Proceedings of the Digital Platforms Conference, 2023.

[19] T. H. Davenport and J. C. Beck, The Attention Economy: Understanding the New Currency of Business. Harvard Business School Press, 2001.

[20] C. J. Date, An Introduction to Database Systems, 8th ed. Pearson, 2003.

# Chapter 9

## Appendices

### Appendix A: Core User Roles

The platform defines three main user roles.

The donor role is designed for members of the public who want to browse campaigns and contribute financially. The donor experience focuses on trust, clarity, and simplicity.

The partner role is designed for organisations or representatives that manage beneficiary cases. This role is responsible for campaign creation, document uploads, and ongoing updates.

The admin role is designed for platform governance. Administrators review campaigns, monitor reports, and manage operational oversight.

### Appendix B: Major Modules

The platform is composed of the following modules.

1. Authentication and user management.
2. Campaign browsing and detail presentation.
3. Campaign creation and partner dashboard management.
4. Donation recording.
5. Document upload and storage.
6. Fraud reporting and moderation.
7. Recommendation and prioritisation support.
8. Consent logging and audit support.
9. Administrative dashboard and metrics.
10. Multilingual interface support.

### Appendix C: Main Development Stack

The main technologies used in the project are React, Vite, FastAPI, PostgreSQL, SQLAlchemy, JWT authentication, and modern browser-based routing. The stack was chosen to support maintainability, responsiveness, and clear separation of concerns.

### Appendix D: Suggested Database Entities

The principal entities in the system are users, campaigns, donations, documents, fraud reports, campaign updates, consent records, recommendation impressions, and disbursement records. These entities form the structural basis of the healthcare fundraising workflow.

### Appendix E: Sample System Flow Summary

A user visits the platform. The system shows featured campaigns and current needs. The user opens a campaign, reviews the information, and decides whether to donate or report a concern. If the user is a partner, they create or update a campaign. If the user is an administrator, they review submitted content and system activity. This simple flow captures the essence of the platform: visibility, trust, and coordinated action.
