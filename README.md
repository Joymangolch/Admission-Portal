# 🎓 MTU Admission & Examination Management System

> A cloud-native, end-to-end web application to digitize the B.Tech admission process for **Manipur Technical University (MTU)**.

---

## 📌 Overview

The **MTU Admission Portal** is a full-stack web application designed to replace the traditional paper-based admission system with a secure, scalable, and efficient digital platform.

It handles the complete admission lifecycle:

> Registration → Application → Document Upload → Payment → Verification → Exam → Result → Admission

---

## 🚀 Key Features

### 👤 Candidate Portal

* OTP-based authentication (Firebase)
* Multi-step application form
* Document upload & processing
* Category-based fee payment (Razorpay)
* Application status tracking (real-time)
* Admit card download (PDF)
* Result viewing with rank & marks
* Email notifications

---

### 🧑‍💼 Admin Portal

* Role-Based Access Control (RBAC)
* Application review dashboard
* Approve / Reject / Flag applications
* Document verification system
* Audit logs for all actions
* Bulk operations for exam eligibility

---

### 🧪 Examination Module

* Exam scheduling (date, time, center)
* District-based center allocation
* Admit card generation (LaTeX-based PDF)

---

### 📊 Result Module

* Marks upload (CSV / manual)
* Automatic total & rank calculation
* Category-wise merit processing
* Result publishing by Registrar

---

### 📧 Notification System

* Email alerts for:

  * Application submission
  * Payment success
  * Approval / rejection
  * Admit card availability
  * Result publication

---

## 🏗️ Tech Stack

| Layer          | Technology                    |
| -------------- | ----------------------------- |
| Frontend       | Next.js 14 (App Router)       |
| UI Framework   | Tailwind CSS + ShadCN UI      |
| Backend        | Next.js API Routes            |
| Authentication | Firebase Authentication (OTP) |
| Database       | Google Cloud SQL (MySQL)      |
| ORM            | Prisma                        |
| Storage        | Google Cloud Storage          |
| Microservices  | Google Cloud Run              |
| Payments       | Razorpay                      |
| Email Service  | SendGrid                      |
| Hosting        | Google Cloud Run              |

---

## 🧩 System Architecture

```text
Candidate/Admin
      ↓
Next.js Frontend (UI)
      ↓
Next.js Backend (API Layer)
      ↓
-----------------------------------------
| Firebase Auth (OTP)                  |
| Cloud SQL (Database)                |
| Google Cloud Storage (Files)        |
| Razorpay (Payments)                 |
| SendGrid (Emails)                   |
| Cloud Run (PDF + Image Processing)  |
-----------------------------------------
```

---

## 👥 User Roles

| Role                | Responsibilities                         |
| ------------------- | ---------------------------------------- |
| Candidate           | Apply, upload docs, pay fee, view status |
| Admission Office    | Review applications                      |
| HOD / SOD           | Department-level approval                |
| Examination Section | Manage exams                             |
| Registrar           | Final approval & result publishing       |
| Accounts            | Payment validation                       |
| System Admin        | Manage users & system                    |

---

## 🔄 Application Lifecycle

```text
Draft → Submitted → Under Review → Approved → Exam Eligible → Result Published
```

---

## 💳 Admission Pathways

### 1. JEE Pathway

* Direct admission based on JEE score
* No entrance exam required

### 2. Non-JEE Pathway

* Requires entrance exam
* Steps:

  * Apply → Exam → Result → Admission

### 3. IDP Category

* Special category
* No application fee

---

## 📂 Document Requirements

* Class X Certificate & Marksheet
* Class XII Marksheet
* Category Certificate (if applicable)
* JEE Scorecard (if applicable)
* Passport Photo
* Signature

---

## 🔐 Security Features

* JWT-based API authentication
* Firebase OTP verification
* Role-Based Access Control (RBAC)
* Secure file access via signed URLs
* Razorpay payment signature verification
* Audit logging for admin actions

---

## ⚙️ Non-Functional Requirements

| Category     | Target                      |
| ------------ | --------------------------- |
| Availability | 99.5% uptime                |
| Performance  | < 3s load time              |
| Scalability  | Auto-scale (Cloud Run)      |
| Concurrency  | 2000+ users/day             |
| Security     | TLS 1.2+, encrypted storage |

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mtu-admission-portal.git
cd mtu-admission-portal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file:

```env
DATABASE_URL=
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
RAZORPAY_KEY_ID=
RAZORPAY_SECRET=
SENDGRID_API_KEY=
GCP_STORAGE_BUCKET=
```

### 4. Run Development Server

```bash
npm run dev
```

---

## 📁 Project Structure

```text
/mtu-admission-portal
│
├── app/                 # Next.js App Router
├── components/          # UI Components
├── lib/                 # Utilities & helpers
├── prisma/              # Database schema
├── public/              # Static assets
├── services/            # External integrations
├── api/                 # Backend routes
└── microservices/       # Cloud Run services
```

---

## 🚀 Deployment

* Hosted on **Google Cloud Run**
* Database: **Cloud SQL**
* Storage: **GCS**
* Domain: `admissions.mtu.ac.in`

---

## 📅 MVP Roadmap (1 Week Sprint)

| Day   | Task                    |
| ----- | ----------------------- |
| Day 1 | Setup + Auth + DB       |
| Day 2 | Application Form        |
| Day 3 | Upload + Payment        |
| Day 4 | Admin Dashboard         |
| Day 5 | Exam + Admit Card       |
| Day 6 | Results + Notifications |
| Day 7 | Testing + Deployment    |

---

## ⚠️ Risks & Mitigation

| Risk            | Solution                 |
| --------------- | ------------------------ |
| High traffic    | Auto-scaling (Cloud Run) |
| Payment failure | Retry + idempotency      |
| OTP abuse       | Rate limiting            |
| DB overload     | Indexing + pooling       |

---

## 🔮 Future Enhancements (v1.1)

* SMS notifications
* Analytics dashboard
* Merit list automation
* Helpdesk system
* Mobile application

---


## 📜 License

This project is developed for **academic and institutional use** under Manipur Technical University.

---

## ⭐ Acknowledgement

Special thanks to MTU faculty and stakeholders for defining the problem and guiding the system design.

---


  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
