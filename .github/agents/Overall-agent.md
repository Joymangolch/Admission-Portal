# MTU Admission & Examination Management System — Full Requirements

> **Project:** Manipur Technical University Admission Portal
> **Platform URL:** `admissions.mtu.ac.in`
> **Document Version:** v1.0 (PRD)
> **Status:** Draft — For Review
> **Date:** 17 April 2026
---
## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Stakeholders & User Roles](#2-stakeholders--user-roles)
3. [Candidate Journey](#3-candidate-journey)
4. [Business Requirements](#4-business-requirements)
5. [Functional Requirements — Candidate Portal](#5-functional-requirements--candidate-portal)
6. [Functional Requirements — Admin Portal](#6-functional-requirements--admin-portal)
7. [Functional Requirements — Examination Module](#7-functional-requirements--examination-module)
8. [Functional Requirements — Result Module](#8-functional-requirements--result-module)
9. [Functional Requirements — Notification System](#9-functional-requirements--notification-system)
10. [Technical Architecture](#10-technical-architecture)
11. [Database Schema](#11-database-schema)
12. [API Structure](#12-api-structure)
13. [Security Architecture](#13-security-architecture)
14. [Non-Functional Requirements](#14-non-functional-requirements)
15. [Infrastructure & Cost](#15-infrastructure--cost)
16. [Risk Register](#16-risk-register)
17. [Delivery Plan — MVP Sprint](#17-delivery-plan--mvp-sprint)
18. [Out of Scope (v1.0)](#18-out-of-scope-v10)
19. [Deferred to v1.1](#19-deferred-to-v11)
20. [Appendix — Reference Data](#20-appendix--reference-data)

---

## 1. Project Overview

### 1.1 What It Is
A **cloud-native, end-to-end digitization** of Manipur Technical University's B.Tech admissions process. It replaces the existing **paper-based workflow** with a secure, scalable, and accessible web platform.

### 1.2 What It Handles
The system manages the **complete admissions lifecycle**:
- Candidate registration
- Application form submission
- Document upload & verification
- Fee payment processing
- Entrance examination management (Non-JEE candidates)
- Admit card generation & download
- Result publication
- Candidate dashboard

### 1.3 Problem Being Solved
MTU's current process uses:
- Physical forms
- Manual document handling
- In-person fee collection

This causes:
- High operational overhead
- Processing delays
- Error-prone manual verification
- Limited accessibility for candidates across Manipur's dispersed districts

### 1.4 Scope — What Is Included in v1.0
- B.Tech Admissions via JEE and Non-JEE pathways
- Online application form and document upload
- Fee payment via **Razorpay**
- Admin review, verification, and approval workflow
- Entrance examination system for Non-JEE candidates
- Admit card generation and download
- Result publication and candidate dashboard
- Email notification system

---

## 2. Stakeholders & User Roles

| Role | Portal Access | Key Responsibilities |
|---|---|---|
| **Candidate** | Candidate Portal | Register, complete application, upload documents, pay fee, download admit card, view results |
| **Admission Office** | Admin Portal | Review submitted applications, verify uploaded documents, flag discrepancies |
| **HOD / SOD** | Admin Portal | Department-level approval of applications |
| **Examination Section** | Admin Portal | Manage exam scheduling, center allocation, admit card release |
| **Registrar** | Admin Portal | Final authority — overall approvals, result publication sign-off |
| **Accounts Department** | Admin Portal | Validate payment records, reconcile fee collection |
| **System Administrator** | Admin Portal | User management, system configuration, deployment |

---

## 3. Candidate Journey

The primary user — the **Candidate** — follows this structured multi-step journey:

| Step | Action | Applies To |
|---|---|---|
| Step 1 | Register with mobile number via OTP | All |
| Step 2 | Fill personal, academic, and preference details | All |
| Step 3 | Upload required documents | All |
| Step 4 | Pay application fee | All |
| Step 5 | Submit application and track status | All |
| Step 6 | Download admit card and attend entrance exam | Non-JEE only |
| Step 7 | View result and admission status | All |

---

## 4. Business Requirements

### 4.1 Dual Admission Pathway

| Pathway | Eligibility | Process | Fee (GEN/OBC) | Fee (SC/ST/PWD) |
|---|---|---|---|---|
| **JEE Pathway** | Valid JEE Main score | Direct application → Review → Admission | ₹100 | ₹50 |
| **Non-JEE Pathway** | Class XII qualifying criteria | Application → Entrance Exam → Result → Admission | ₹300 | ₹200 |
| **IDP Category** | Specially designated | Application → Review → Admission | ₹0 | ₹0 |

### 4.2 Core Business Rules

1. **Payment must be completed before application submission is allowed.** Application remains locked in `Draft` status until payment is confirmed.
2. **Course preferences (priority 1–5) cannot be modified after submission.**
3. Category-based eligibility determines fee structure and seat allocation.
4. Admit cards are generated **only** for applications with status `Exam Eligible`.
5. **JEE candidates do not appear for the MTU entrance examination.**
6. A candidate can have **only one active application** per admission cycle.

### 4.3 Application Lifecycle — Status Flow

| Status | Description | Triggered By |
|---|---|---|
| `Draft` | Application started but not submitted | Candidate begins form |
| `Submitted` | Completed and paid; awaiting review | Candidate submits after payment |
| `Under Review` | Being evaluated by Admission Office | Admin picks up application |
| `Approved` | Verified and forwarded for exam/admission | Admin approves |
| `Rejected` | Disqualified with documented reason | Admin rejects |
| `Exam Eligible` | Cleared for Non-JEE entrance exam | System assigns after approval |
| `Result Published` | Exam result declared; final status set | Registrar publishes results |

---

## 5. Functional Requirements — Candidate Portal

### 5.1 Registration & Authentication

- **OTP-based registration** using mobile number via **Firebase Authentication**
- Automatic account creation on first successful OTP verification
- Session persistence with secure token management
- **Email linkage** collected during registration (used for notifications)

### 5.2 Application Form — All Data Fields

#### Section: Personal Details
| Field | Notes |
|---|---|
| First Name | Required |
| Middle Name | Optional |
| Last Name | Required |
| Date of Birth | Required |
| Gender | Required |
| Mobile Number | Required |
| Email Address | Required |
| Nationality | Required |
| Category | GEN / OBC / SC / ST / PWD / IDP — determines fee and eligibility |

#### Section: Parent / Guardian Details
| Field |
|---|
| Father's Name |
| Mother's Name |
| Guardian Contact |
| Guardian Email |

#### Section: Address Details
| Field |
|---|
| Present Address |
| Permanent Address |
| Country |
| State |
| District |
| City |
| PIN Code |

#### Section: Academic — Class X
| Field |
|---|
| Board |
| Year of Passing |
| Subjects |
| Marks Obtained |
| Total Marks |
| Percentage |

#### Section: Academic — Class XII
| Field |
|---|
| Board |
| Year of Passing |
| Subjects |
| Marks Obtained |
| Total Marks |
| Percentage |

#### Section: JEE Details *(Conditional — shown only if candidate is JEE pathway)*
| Field |
|---|
| JEE Main Score |
| JEE Application Number |

#### Section: Course Preferences
- Candidate selects priority **1 through 5** from the following branches:
  - Civil Engineering
  - Computer Science and Engineering (CSE)
  - Electrical Engineering
  - Electronics and Communication Engineering (ECE)
  - Mechanical Engineering
- **Preferences cannot be modified after form submission**

#### Section: Declaration
| Field |
|---|
| Checkbox confirmation |
| Date |
| Digital Signature upload |

### 5.3 Document Upload Requirements

| Document | Purpose | Accepted Formats | Max Size |
|---|---|---|---|
| Class X Certificate | Date of Birth proof | PDF / JPG | 2 MB |
| Class X Marksheet | Academic record | PDF / JPG | 2 MB |
| Class XII Marksheet | Eligibility proof | PDF / JPG | 2 MB |
| Category Certificate | Reservation proof *(if applicable)* | PDF / JPG | 2 MB |
| JEE Score Card | JEE pathway proof *(if applicable)* | PDF / JPG | 2 MB |
| Passport Photo | Identity / Admit card | JPG | 500 KB |
| Signature | Declaration / Admit card | JPG | 200 KB |

### 5.4 Payment System

- **Payment gateway:** Razorpay (Indian payment infrastructure)
- Payment is **required before submission**; application stays locked in `Draft` until payment is confirmed
- **Server-side signature verification** for every transaction (HMAC-SHA256 via Razorpay)
- Payment status persisted in the database with **idempotency keys** to prevent duplicate charges
- Refund policy governed by MTU regulations — **out of system scope for v1.0**

### 5.5 Candidate Dashboard

- View current application status (mapped to lifecycle statuses above)
- View submission confirmation
- Download admit card *(only if status is `Exam Eligible`)*
- View result after Registrar publishes

---

## 6. Functional Requirements — Admin Portal

### 6.1 Application Review Workflow

- Dashboard showing applications **segmented by status**
- **Inline document viewer** — supports PDF and image preview without download
- Actions per application:
  - **Approve** — moves application forward
  - **Reject** — requires mandatory reason text
  - **Flag for clarification** — marks discrepancies for candidate or team
- **Bulk status update** — mark multiple applications as exam-eligible simultaneously
- **Audit trail** — every admin action is logged with:
  - Timestamp
  - Admin user ID
  - Action performed

### 6.2 User & Role Management

- **Registrar** has the authority to create and manage admin accounts
- **RBAC enforcement** — each role sees only its relevant modules:
  - Admission Office → application review
  - HOD/SOD → department-level approval
  - Examination Section → exam scheduling and admit cards
  - Registrar → final approvals and result sign-off
  - Accounts → payment validation
  - System Admin → system config and user management
- **Activity log** maintained per admin account

---

## 7. Functional Requirements — Examination Module

### 7.1 Exam Paper Structure

| Subject | Maximum Marks |
|---|---|
| Mathematics | 30 |
| Physics | 30 |
| Chemistry | 20 |
| English | 20 |
| **Total** | **100** |

### 7.2 Exam Scheduling

- Admin assigns each candidate:
  - Exam date
  - Exam time
  - Center name
  - Center address
- **Center allocation** based on candidate's district or preference

### 7.3 Admit Card

- Admit card is generated as a **PDF rendered via LaTeX**
- Contains:
  - Candidate photograph
  - Candidate signature
  - Exam date, time, and center details
  - Candidate personal details
- Available for **download only** to candidates with status `Exam Eligible`
- Stored in **Google Cloud Storage (GCS)** with time-limited signed URL access

---

## 8. Functional Requirements — Result Module

- Admin uploads marks via:
  - **CSV upload** interface, OR
  - **Manual entry** interface
- System processes marks and computes:
  - **Category-wise merit lists**
- **Result PDF** generated per candidate
- Candidates view results on dashboard **only after Registrar publishes**

---

## 9. Functional Requirements — Notification System

| Trigger Event | Recipient | Channel |
|---|---|---|
| Application submission confirmed | Candidate | Email |
| Payment successful | Candidate | Email |
| Application approved | Candidate | Email |
| Application rejected | Candidate | Email + Rejection Reason |
| Admit card available | Candidate | Email |
| Result published | Candidate | Email |
| New application assigned | Admin | Email *(optional)* |

- **Sender address:** `admissions@mtu.ac.in` (Google Workspace)
- **Delivery mechanism:** SendGrid transactional API

---

## 10. Technical Architecture

### 10.1 Technology Stack

| Layer | Technology | Purpose | Rationale |
|---|---|---|---|
| **Frontend** | Next.js 14 (App Router) | Web UI + SSR | Unified stack, fast development |
| **UI System** | Tailwind CSS + Shadcn UI | Styling & components | Rapid, accessible UI |
| **Backend** | Next.js Route Handlers | API & business logic | Co-located; reduces complexity |
| **Authentication** | Firebase Authentication | OTP + session tokens | Secure, low dev overhead |
| **Database** | Google Cloud SQL (MySQL) | Relational persistent store | Strong consistency, ACID compliance |
| **ORM** | Prisma | Database abstraction | Type-safe, fast schema iteration |
| **File Storage** | Google Cloud Storage | Documents, PDFs, media | Scalable, secure signed URLs |
| **Processing** | Cloud Run (microservices) | Image conversion + PDF generation | Serverless, auto-scaling |
| **Payments** | Razorpay | Fee collection | India-ready payment gateway |
| **Email** | SendGrid | Transactional notifications | Reliable API-based delivery |
| **Hosting** | Cloud Run | Application deployment | Auto-scaling containers |
| **DNS** | Cloud DNS | `admissions.mtu.ac.in` | Managed DNS |

### 10.2 System Architecture — High-Level Flow

```
Candidate / Admin
      ↓
Next.js Frontend (App Router + Tailwind + Shadcn UI)
      ↓
Next.js Backend API (Route Handlers)
      ↓
┌─────────────────────────────────────────────────────┐
│  Firebase Auth  │  Cloud SQL  │  Google Cloud Storage │
│  Razorpay       │  SendGrid   │  Cloud Run Services    │
│                 │             │  (Image Processor +    │
│                 │             │   PDF Generator)       │
└─────────────────────────────────────────────────────┘
```

### 10.3 Microservices

| Service | Function | Runtime | Output |
|---|---|---|---|
| **Image Processor** | Convert uploaded documents to standardized JPEG | Cloud Run | Processed JPEG saved to GCS |
| **PDF Generator** | Render admit cards and result documents via LaTeX | Cloud Run | PDF stored in GCS |
| **Notification Worker** | Async email dispatch *(optional in v1.0)* | Cloud Run / background | SendGrid API calls |

---

## 11. Database Schema

### Table: `users`
| Field | Type | Notes |
|---|---|---|
| `id` | Primary Key | Auto-increment |
| `firebase_uid` | String | Unique Firebase identifier |
| `role` | Enum | candidate / admission_office / hod / exam_section / registrar / accounts / sysadmin |
| `mobile` | String | Used for OTP auth |
| `email` | String | For notifications |
| `created_at` | Timestamp | |

**Relationships:** One-to-many with `applications`, `payments`

---

### Table: `profiles`
| Field | Type | Notes |
|---|---|---|
| `id` | Primary Key | |
| `user_id` | Foreign Key → users | |
| `name` | String | Full name fields |
| `dob` | Date | Date of birth |
| `gender` | String | |
| `category` | Enum | GEN / OBC / SC / ST / PWD / IDP |
| `address` | JSON / Text | Present and permanent address |

**Relationships:** One-to-one with `users`

---

### Table: `applications`
| Field | Type | Notes |
|---|---|---|
| `id` | Primary Key | |
| `user_id` | Foreign Key → users | |
| `status` | Enum | Draft / Submitted / Under Review / Approved / Rejected / Exam Eligible / Result Published |
| `type` | Enum | JEE / NonJEE |
| `submitted_at` | Timestamp | Null until submitted |

**Relationships:** One-to-many with `documents`

---

### Table: `documents`
| Field | Type | Notes |
|---|---|---|
| `id` | Primary Key | |
| `application_id` | Foreign Key → applications | |
| `type` | Enum | class_x_cert / class_x_marksheet / class_xii_marksheet / category_cert / jee_scorecard / passport_photo / signature |
| `gcs_url` | String | Original upload URL in GCS |
| `processed_url` | String | Post-processing JPEG URL |
| `status` | Enum | Pending / Verified / Rejected |

**Relationships:** Many-to-one with `applications`

---

### Table: `payments`
| Field | Type | Notes |
|---|---|---|
| `id` | Primary Key | |
| `user_id` | Foreign Key → users | |
| `application_id` | Foreign Key → applications | |
| `razorpay_order_id` | String | Razorpay's order identifier |
| `amount` | Integer | Amount in paise |
| `status` | Enum | Pending / Success / Failed |

**Relationships:** One-to-one with `applications`

---

### Table: `exams`
| Field | Type | Notes |
|---|---|---|
| `id` | Primary Key | |
| `application_id` | Foreign Key → applications | |
| `center` | String | Exam center name |
| `date` | Date | Exam date |
| `time` | Time | Exam time slot |
| `hall_ticket_url` | String | GCS URL of generated admit card PDF |

**Relationships:** One-to-one with `applications`

---

### Table: `results`
| Field | Type | Notes |
|---|---|---|
| `id` | Primary Key | |
| `application_id` | Foreign Key → applications | |
| `math` | Integer | Marks out of 30 |
| `physics` | Integer | Marks out of 30 |
| `chem` | Integer | Marks out of 20 |
| `english` | Integer | Marks out of 20 |
| `total` | Integer | Sum of all subjects (max 100) |
| `rank` | Integer | Category-wise merit rank |
| `status` | Enum | Pass / Fail / Published |

**Relationships:** One-to-one with `exams`

---

## 12. API Structure

### 12.1 Endpoint Prefixes

| Prefix | Scope | Access |
|---|---|---|
| `/api/public` | Open endpoints — no auth required | Public |
| `/api/candidate` | Authenticated candidate endpoints | JWT-verified candidate |
| `/api/payment` | Payment processing | JWT-verified candidate |
| `/api/admin` | Admin operations | JWT-verified admin + RBAC |
| `/api/system` | Internal system use (microservices) | Internal only |

### 12.2 Example Endpoints

#### Public
```
GET  /api/public/courses          → List of available B.Tech branches
GET  /api/public/fee-structure    → Fee amounts by category and pathway
```

#### Candidate
```
POST /api/candidate/apply         → Create or update application
GET  /api/candidate/status        → Get current application status
GET  /api/candidate/admit-card    → Download admit card (if Exam Eligible)
```

#### Payment
```
POST /api/payment/create          → Create Razorpay order
POST /api/payment/verify          → Verify Razorpay signature server-side
```

#### Admin
```
GET  /api/admin/applications      → List applications (filtered by status/role)
POST /api/admin/approve           → Approve an application
POST /api/admin/reject            → Reject with mandatory reason
```

#### System (Internal)
```
POST /api/system/generate-pdf     → Trigger LaTeX PDF generation (admit card / result)
POST /api/system/process-image    → Trigger image standardization microservice
```

---

## 13. Security Architecture

| Area | Control | Implementation |
|---|---|---|
| **API Authentication** | JWT verification on all protected routes | Firebase Admin SDK |
| **Role Enforcement** | RBAC middleware layer | Custom Next.js middleware |
| **File Access** | Time-limited signed URLs | Google Cloud Storage |
| **Payment Integrity** | Razorpay signature verification | HMAC-SHA256 |
| **Data Isolation** | Candidate can only access own data | `user_id`-scoped database queries |
| **Audit Trail** | All admin actions logged with timestamp | Dedicated database audit table |

---

## 14. Non-Functional Requirements

| Category | Requirement | Target |
|---|---|---|
| **Availability** | System uptime during admission period | 99.5% |
| **Performance** | Page load time (95th percentile) | < 3 seconds |
| **Concurrency** | Simultaneous active sessions | 2,000+ / day |
| **Scalability** | Peak load handling | Auto-scale via Cloud Run |
| **Security** | Data encryption in transit | TLS 1.2+ |
| **Security** | Data encryption at rest | GCP default encryption |
| **Reliability** | Payment idempotency | Zero duplicate charges |
| **Compliance** | Student data protection | Minimal data collection |
| **Accessibility** | Device support | Desktop + mobile browser |
| **Maintainability** | Code documentation coverage | README + API docs |

---

## 15. Infrastructure & Cost

### 15.1 Environment Strategy

| Environment | Purpose | Access |
|---|---|---|
| **Development** | Feature development and unit testing | Engineering team |
| **Staging** | Integration testing and UAT | Engineering + Admin team |
| **Production** | Live system for candidates and staff | Public / Restricted |

### 15.2 Infrastructure Sizing (Initial)

| Component | Configuration | Notes |
|---|---|---|
| **Cloud Run (App)** | 1–2 vCPU, autoscale 0–10 instances | Scales to zero when idle |
| **Cloud SQL** | `db-g1-small` → `db-f1-micro` initially | Upgrade if write contention increases |
| **Google Cloud Storage** | Standard tier, multi-region | Documents, processed files, PDFs |
| **Firebase Auth** | Free tier | OTP cost via SMS — monitor usage |
| **SendGrid** | Free tier (100 emails/day initially) | Upgrade before peak admission window |

### 15.3 Monthly Cost Estimate

| Service | Estimated Monthly Cost (INR) | Notes |
|---|---|---|
| Cloud Run (App + Services) | ₹1,000 – ₹3,000 | Usage dependent |
| Cloud SQL | ₹1,500 – ₹4,000 | Small instance |
| Google Cloud Storage | ₹500 – ₹1,000 | Based on document volume |
| Firebase Authentication | ₹0 – ₹1,000 | OTP SMS cost dependent |
| SendGrid | ₹0 – ₹1,500 | Free tier initially |
| Razorpay Transaction Fees | ~2% per transaction | e.g., ₹50,000 on ₹25L revenue |
| **TOTAL (Infra)** | **₹5,000 – ₹10,000/month** | Excluding payment gateway fees |

---

## 16. Risk Register

| Risk | Probability | Impact | Mitigation Strategy |
|---|---|---|---|
| High traffic spike at application deadline | High | High | Cloud Run autoscaling; load test before go-live |
| Payment gateway downtime | Low | High | Retry logic; idempotency keys; fallback messaging |
| OTP abuse / fraudulent registrations | Medium | Medium | Firebase reCAPTCHA; rate limiting on OTP requests |
| Document upload failures | Medium | Medium | Chunked upload; retry; user-visible error states |
| Database bottleneck under load | Medium | High | Indexed queries; connection pooling; read replicas if needed |
| Email deliverability issues | Low | Medium | SPF/DKIM/DMARC configuration on sending domain |
| Data loss from Cloud SQL failure | Low | Critical | Automated daily backups; point-in-time recovery enabled |
| Scope creep delaying go-live | High | High | Strict MVP definition; defer non-essential features to v1.1 |

---

## 17. Delivery Plan — MVP Sprint

### Sprint Schedule (7-Day MVP)

| Day | Focus Area | Deliverables |
|---|---|---|
| **Day 1** | Foundation | Next.js scaffold, Firebase auth, Prisma schema, Cloud SQL setup, GCS bucket config |
| **Day 2** | Candidate Portal — Form | Multi-step application form UI (all sections), draft save functionality |
| **Day 3** | Documents + Payment | File upload to GCS, document processing microservice, Razorpay integration |
| **Day 4** | Admin Portal | Application list dashboard, document viewer, approve/reject workflow, RBAC |
| **Day 5** | Exam + Admit Card | Exam scheduling, PDF generation service (LaTeX), admit card download |
| **Day 6** | Results + Notifications | Marks upload, result processing, result PDF, SendGrid email triggers |
| **Day 7** | QA + Deployment | End-to-end testing, Cloud Run deployment, DNS setup, staging UAT |

### MVP Feature Checklist

- [ ] Candidate registration and OTP login
- [ ] Complete application form with all sections
- [ ] Document upload and processing
- [ ] Razorpay fee payment
- [ ] Admin review and approval workflow
- [ ] Admit card generation and download
- [ ] Result upload and candidate-facing result view
- [ ] Email notifications for key lifecycle events

---

## 18. Out of Scope (v1.0)

The following are **explicitly excluded** from this version:

- M.Tech, MBA, or other program admissions
- Mobile application (Android / iOS)
- Online proctored examination
- Alumni or student portal integration

---

## 19. Deferred to v1.1

The following features are **planned but not in v1.0**:

- Bulk email campaigns and SMS notifications
- Advanced analytics and reporting dashboard
- Merit list generation and seat allocation engine
- Candidate helpdesk / ticket system
- Mobile application

---

## 20. Appendix — Reference Data

### 20.1 Supported B.Tech Branches

| Branch |
|---|
| Civil Engineering |
| Computer Science and Engineering (CSE) |
| Electrical Engineering |
| Electronics and Communication Engineering (ECE) |
| Mechanical Engineering |

### 20.2 Category Codes

| Code | Category | Eligibility |
|---|---|---|
| `GEN` | General | Open category |
| `OBC` | Other Backward Class | State OBC certificate required |
| `SC` | Scheduled Caste | State SC certificate required |
| `ST` | Scheduled Tribe | State ST certificate required |
| `PWD` | Person with Disability | Disability certificate required |
| `IDP` | Internally Displaced Person | IDP certificate required; **fee waived** |

### 20.3 Document Format Standards

| Document Type | Accepted Formats | Max File Size | Processed Format |
|---|---|---|---|
| Academic Certificates | PDF, JPG, JPEG, PNG | 2 MB | JPEG (standardized) |
| Category Certificates | PDF, JPG, JPEG, PNG | 2 MB | JPEG (standardized) |
| Passport Photograph | JPG, JPEG, PNG | 500 KB | JPEG (200×200 px) |
| Candidate Signature | JPG, JPEG, PNG | 200 KB | JPEG (400×150 px) |
| Admit Card Output | System-generated | N/A | PDF (LaTeX-rendered) |

### 20.4 Glossary

| Term | Definition |
|---|---|
| **JEE** | Joint Entrance Examination — national-level engineering entrance test |
| **Non-JEE** | Candidates without JEE scores; must appear for MTU entrance exam |
| **IDP** | Internally Displaced Person — special category with fee waiver |
| **RBAC** | Role-Based Access Control — restricts portal features by user role |
| **GCS** | Google Cloud Storage — object storage for documents and generated files |
| **OTP** | One-Time Password — used for mobile-based authentication |
| **Razorpay** | Indian payment gateway used for fee collection |
| **SendGrid** | Email delivery service used for transactional notifications |
| **Prisma** | TypeScript ORM used for database access and schema management |
| **Cloud Run** | Google Cloud serverless container platform for app and microservice deployment |

---

*End of Requirements Document — MTU Admission Portal v1.0*