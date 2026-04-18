# Pages & Routes Documentation - Admission Portal

## Table of Contents
1. [Route Architecture Overview](#route-architecture-overview)
2. [Public Routes](#public-routes)
3. [Authentication Routes](#authentication-routes)
4. [Candidate Dashboard Routes](#candidate-dashboard-routes)
5. [Admin Dashboard Routes](#admin-dashboard-routes)
6. [HOD Dashboard Routes](#hod-dashboard-routes)
7. [Exam Coordinator Dashboard Routes](#exam-coordinator-dashboard-routes)
8. [Registrar Dashboard Routes](#registrar-dashboard-routes)
9. [Accounts Officer Dashboard Routes](#accounts-officer-dashboard-routes)
10. [Route Configuration File](#route-configuration-file)

---

## Route Architecture Overview

### Layout Structure

The application uses two main layout systems:

```
PublicLayout (for unauthenticated users)
├── Header/Navigation
├── Main Content (Routes)
└── Footer

DashboardLayout (for authenticated users)
├── Sidebar + Main Navigation
├── Top Header (breadcrumb, user menu, theme toggle)
└── Main Content (Routes)
```

### Route Hierarchy

```
/                          (PublicLayout)
├── /                      (LandingPage)
└── /apply                 (AdmissionPathwayPage)

/login                     (LoginPage - no layout)

/dashboard                 (DashboardLayout - Candidate)
├── /                      (CandidateDashboard)
├── /application           (ApplicationForm)
├── /documents             (DocumentUpload)
├── /notifications         (NotificationsPage)
├── /payment               (PaymentPage)
├── /application-status    (ApplicationStatusPage)
├── /admit-card            (AdmitCardPage)
└── /results               (ResultPage)

/admin                     (DashboardLayout - Admin)
├── /dashboard             (AdminDashboard)
├── /applications          (Placeholder)
├── /review                (ApplicationReviewPage)
├── /verification          (Placeholder)
├── /users                 (UserRoleManagementPage)
├── /exams                 (ExamManagementPage)
├── /results               (ResultManagementPage)
├── /notifications         (NotificationSystemPage)
└── /settings              (Placeholder)

/hod                       (DashboardLayout - HOD)
├── /dashboard             (HODDashboard)
├── /candidates            (Placeholder)
└── /courses               (Placeholder)

/exam                      (DashboardLayout - Exam Coordinator)
├── /dashboard             (ExamDashboard)
├── /results               (Placeholder)
└── /reports               (Placeholder)

/registrar                 (DashboardLayout - Registrar)
├── /dashboard             (RegistrarDashboard)
├── /enrollments           (Placeholder)
└── /records               (Placeholder)

/accounts                  (DashboardLayout - Accounts Officer)
├── /dashboard             (AccountsDashboard)
├── /payments              (Placeholder)
└── /reports               (Placeholder)

/* (Wildcard)             (404 Not Found page)
```

---

## Public Routes

### 1. Home / Landing Page

| Property | Value |
|----------|-------|
| **Route Path** | `/` |
| **Component** | `LandingPage` |
| **File Path** | `src/app/pages/LandingPage.tsx` |
| **Layout** | PublicLayout |
| **Authentication** | Not required |
| **Purpose** | Main landing page introducing the admission portal |

**Key Features:** Hero section, features highlight, CTA button, process explanation, benefits, testimonials, footer

---

### 2. Admission Pathway Page

| Property | Value |
|----------|-------|
| **Route Path** | `/apply` |
| **Component** | `AdmissionPathwayPage` |
| **File Path** | `src/app/pages/AdmissionPathwayPage.tsx` |
| **Layout** | PublicLayout |
| **Authentication** | Not required |
| **Purpose** | Explains admission process and application workflow |

**Key Features:** Process timeline, step-by-step instructions, eligibility criteria, documents checklist, important dates, FAQ, contact info, "Apply Now" button

---

## Authentication Routes

### 3. Login Page

| Property | Value |
|----------|-------|
| **Route Path** | `/login` |
| **Component** | `LoginPage` |
| **File Path** | `src/app/pages/LoginPage.tsx` |
| **Layout** | None (standalone) |
| **Authentication** | Not required |
| **Purpose** | User authentication and dashboard access |

**Form Fields:**
- Email/Username (required, email format)
- Password (required, min 6 chars)
- Remember Me (checkbox, optional)
- "Forgot Password" link
- Login button

**Features:** Form validation, error messages, responsive design, role-based redirection

---

## Candidate Dashboard Routes

All routes require `Candidate` role authentication. **Base Path:** `/dashboard`

### 4. Candidate Dashboard (Home)

| Property | Value |
|----------|-------|
| **Route Path** | `/dashboard` |
| **Component** | `CandidateDashboard` |
| **File Path** | `src/app/pages/candidate/CandidateDashboard.tsx` |
| **Layout** | DashboardLayout |
| **Purpose** | Main dashboard with application summary and quick access |

**Key Features:** Welcome greeting, stats cards (applications, submitted, reviewed, approved, rejected), progress indicator, quick action buttons, recent activity, important deadlines

**Quick Actions:** View Application, Upload Documents, Pay Fees, Check Status, Download Admit Card, View Results

---

### 5. Application Form

| Property | Value |
|----------|-------|
| **Route Path** | `/dashboard/application` |
| **Component** | `ApplicationForm` |
| **File Path** | `src/app/pages/candidate/ApplicationForm.tsx` |
| **Layout** | DashboardLayout |
| **Purpose** | Multi-step form for submitting admission application |

**Form Sections:**
1. **Personal Information:** Name, DOB, Email, Phone, Address, City, State, ZIP
2. **Education:** 10th/12th marks, Bachelor's degree, CGPA, graduation year
3. **Programme Selection:** First/second/third choice programs
4. **Documents & Confirmation:** Document uploads, terms acceptance

**Features:** Progress indicator, step validation, save as draft, submission confirmation, auto-save, error display

**Status Tracking:** Draft → Submitted → Under Review → Approved/Rejected → Enrollment

---

### 6. Document Upload

| Property | Value |
|----------|-------|
| **Route Path** | `/dashboard/documents` |
| **Component** | `DocumentUpload` |
| **File Path** | `src/app/pages/candidate/DocumentUpload.tsx` |
| **Layout** | DashboardLayout |
| **Purpose** | Upload and manage supporting documents |

**Document Types:** National ID, Educational Certificates (10th, 12th, Bachelor's), Entrance Exam Score, Character Certificate, Medical Certificate, Domicile, Income Certificate

**Features:** Drag-and-drop upload, file type validation (PDF, JPG, PNG, DOC, DOCX), file size validation (max 5MB per file), upload progress, document list with verification status, preview, delete functionality

**Validation:** Max 50MB total, auto-resize images, document type selector

---

### 7. Notifications Page

| Property | Value |
|----------|-------|
| **Route Path** | `/dashboard/notifications` |
| **Component** | `NotificationsPage` |
| **File Path** | `src/app/pages/candidate/NotificationsPage.tsx` |
| **Layout** | DashboardLayout |
| **Purpose** | Center for all candidate notifications |

**Notification Types:** Application updates, Payment notifications, Exam notices, System messages

**Features:** Filter by type, mark as read/unread, mark all as read, delete notifications, real-time badge on sidebar, search/filter, sort by date (newest first), notification detail view

**Status Colors:** Application (blue), Payment (amber), Exam (green), System (gray)

---

### 8. Payment Page

| Property | Value |
|----------|-------|
| **Route Path** | `/dashboard/payment` |
| **Component** | `PaymentPage` |
| **File Path** | `src/app/pages/candidate/PaymentPage.tsx` |
| **Layout** | DashboardLayout |
| **Purpose** | Manage application fees and payment processing |

**Fee Structure:**
- Application Fee: ₹500
- Processing Fee: ₹100
- Subtotal: ₹600
- GST (18%): ₹108
- **Total: ₹708**

**Features:** Fee breakdown display, tax calculation, payment method selection (Card, UPI, Net Banking, Wallet), transaction history, invoice generation/download, payment confirmation, payment gateway integration (Razorpay)

**Payment States:** Pending, Processing, Completed, Failed (with retry), Refunded

---

### 9. Application Status Page

| Property | Value |
|----------|-------|
| **Route Path** | `/dashboard/application-status` |
| **Component** | `ApplicationStatusPage` |
| **File Path** | `src/app/pages/candidate/ApplicationStatusPage.tsx` |
| **Layout** | DashboardLayout |
| **Purpose** | Track application progress through review workflow |

**Status Timeline:**
```
Draft → Submitted → Under Review → Approved/Rejected → Enrollment
```

**Features:** Status timeline with visual indicators, current stage highlighted, status badges (color-coded), reviewer comments display, estimated decision date, action required alerts, document upload request option, status history with timestamps

**Status Badge Colors:** Draft (gray), Submitted (blue), Under Review (amber), Approved (green), Rejected (red)

---

### 10. Admit Card Page

| Property | Value |
|----------|-------|
| **Route Path** | `/dashboard/admit-card` |
| **Component** | `AdmitCardPage` |
| **File Path** | `src/app/pages/candidate/AdmitCardPage.tsx` |
| **Layout** | DashboardLayout |
| **Purpose** | Display and manage exam admit card |
| **Access** | Only after approval |

**Admit Card Content:**
- Candidate ID, Name, DOB, Email, Phone, Photo
- Exam name, date, time, duration
- Exam center, room number, seat number
- Reporting time, allowed items, prohibited items
- Important instructions/guidelines
- Center address and map

**Features:** Print optimization (A4 format), PDF download, hall ticket number, admit card validity, multiple exams (if applicable), 30-minute reporting time indicator

---

### 11. Result Page

| Property | Value |
|----------|-------|
| **Route Path** | `/dashboard/results` |
| **Component** | `ResultPage` |
| **File Path** | `src/app/pages/candidate/ResultPage.tsx` |
| **Layout** | DashboardLayout |
| **Purpose** | Display exam results and marks breakdown |
| **Access** | After exam completion and result publication |

**Result Structure:**
- Overall score (marks/total, percentage)
- Passing status indicator (PASSED/FAILED)
- Subject-wise marks breakdown
- Percentile ranking
- National/category rank
- Cutoff comparison

**Features:** Visual score display (circular progress), subject breakdown table, performance charts (pie/bar), percentile calculation, merit position display, result certificate download, revaluation request option (if allowed)

**Charts Used:** Pie chart (subject distribution), Bar chart (subject vs cutoff), Line chart (score trend if multiple attempts)

---

## Admin Dashboard Routes

All routes require `Admin` role authentication. **Base Path:** `/admin`

### 12. Admin Dashboard

| Property | Value |
|----------|-------|
| **Route Path** | `/admin/dashboard` |
| **Component** | `AdminDashboard` |
| **File Path** | `src/app/pages/admin/AdminDashboard.tsx` |
| **Layout** | DashboardLayout |
| **Purpose** | System-wide statistics and management overview |

**Dashboard Widgets:**
- Stats cards: Total applications, Pending, Approved, Rejected, Total users, Active today, Total revenue, Payment success rate
- Status distribution chart
- Recent applications table
- System alerts (pending reviews, document verification due, payment failures)
- Quick action buttons

---

### 13. Application Review Page

| Property | Value |
|----------|-------|
| **Route Path** | `/admin/review` |
| **Component** | `ApplicationReviewPage` |
| **File Path** | `src/app/pages/admin/ApplicationReviewPage.tsx` |
| **Layout** | DashboardLayout |
| **Purpose** | Review and process candidate applications |

**Features:** Applications list with advanced filtering (status, date range, program, merit score, verification status), application detail view, document verification toggle, add comments/review notes, approve/reject with reason, bulk actions, email notifications, review history tracking, document preview/zoom, reviewer assignment

**Filter Options:** Status (All, Draft, Submitted, Under Review, Approved, Rejected), Date range, Programme, Merit score range, Verification status

**Review Actions:** Approve, Reject, Request information, Assign to reviewer, Send email

---

### 14. User Role Management Page

| Property | Value |
|----------|-------|
| **Route Path** | `/admin/users` |
| **Component** | `UserRoleManagementPage` |
| **File Path** | `src/app/pages/admin/UserRoleManagementPage.tsx` |
| **Layout** | DashboardLayout |
| **Purpose** | Manage user accounts and assign roles |

**Manageable Roles:**
- Candidate, ReviewOfficer, Registrar, ExamCoordinator, HOD, AccountsOfficer, Admin

**Features:** User list with search, create new account, edit user details, assign/change roles, deactivate/activate users, reset password, user activity log, batch operations, email notifications on role change, permission matrix

**User Actions:** Edit, Change role, Reset password, View activity, Deactivate, Delete

---

### 15. Exam Management Page

| Property | Value |
|----------|-------|
| **Route Path** | `/admin/exams` |
| **Component** | `ExamManagementPage` |
| **File Path** | `src/app/pages/admin/ExamManagementPage.tsx` |
| **Layout** | DashboardLayout |
| **Purpose** | Create, schedule, and manage entrance exams |

**Exam Configuration:**
- Exam name, date, time, duration (minutes)
- Total marks, pass marks, section configuration
- Questions count per section, marks per question
- Negative marking (yes/no, value if yes)
- Centers selection, question paper upload
- Admit card generation control

**Features:** Exam creation form, exam list with status (Draft, Scheduled, Live, Completed, Results Published), registered candidates list, exam centers management, section-wise configuration, result settings, admit card generation

**Exam Status:** Draft, Scheduled, Live, Completed, Results Published

---

### 16. Result Management Page

| Property | Value |
|----------|-------|
| **Route Path** | `/admin/results` |
| **Component** | `ResultManagementPage` |
| **File Path** | `src/app/pages/admin/ResultManagementPage.tsx` |
| **Layout** | DashboardLayout |
| **Purpose** | Upload, manage, and publish exam results |

**Features:** Bulk result upload (CSV/Excel), individual result entry, result verification, cutoff mark setting, merit ranking calculation, result publication control, modification audit trail, candidate notification, revaluation request tracking, statistical analysis

**Result Upload Process:** Select exam → Upload file → Map columns → Validate data → Review → Publish

**Result Status:** Draft, Published, Revaluation pending

---

### 17. Notification System Page

| Property | Value |
|----------|-------|
| **Route Path** | `/admin/notifications` |
| **Component** | `NotificationSystemPage` |
| **File Path** | `src/app/pages/admin/NotificationSystemPage.tsx` |
| **Layout** | DashboardLayout |
| **Purpose** | Send system-wide or targeted notifications |

**Notification Types:** Manual (admin-composed), Automated (system-triggered)

**Automated Triggers:** Application status changes, Payment confirmations, Exam schedules, Results published, Deadline reminders

**Features:** Compose and send notifications, target specific user groups/roles, email integration, SMS integration (if available), notification templates, schedule notifications, track delivery/read status, notification history, bulk messaging, personalization (merge fields like {CANDIDATE_NAME}, {PROGRAM_NAME})

---

## HOD Dashboard Routes

**Base Path:** `/hod`

### 18. HOD Dashboard

| Property | Value |
|----------|-------|
| **Route Path** | `/hod/dashboard` |
| **Component** | `HODDashboard` |
| **File Path** | `src/app/pages/hod/HODDashboard.tsx` |
| **Layout** | DashboardLayout |
| **Purpose** | Department-level dashboard for candidates and courses |

**Features:** Department candidates list, departmental statistics, course management overview, candidate performance tracking, admission status for department

---

### 19-20. HOD Sub Routes (Placeholder)

**Routes:**
- `/hod/candidates` - Department candidates list/management
- `/hod/courses` - Course management for department

---

## Exam Coordinator Dashboard Routes

**Base Path:** `/exam`

### 21. Exam Dashboard

| Property | Value |
|----------|-------|
| **Route Path** | `/exam/dashboard` |
| **Component** | `ExamDashboard` |
| **File Path** | `src/app/pages/exam/ExamDashboard.tsx` |
| **Layout** | DashboardLayout |
| **Purpose** | Exam operations and result management overview |

**Features:** Upcoming exams schedule, exam statistics, results status, candidate statistics, quick action panels

---

### 22-23. Exam Sub Routes (Placeholder)

**Routes:**
- `/exam/results` - Results management
- `/exam/reports` - Exam reports and analytics

---

## Registrar Dashboard Routes

**Base Path:** `/registrar`

### 24. Registrar Dashboard

| Property | Value |
|----------|-------|
| **Route Path** | `/registrar/dashboard` |
| **Component** | `RegistrarDashboard` |
| **File Path** | `src/app/pages/registrar/RegistrarDashboard.tsx` |
| **Layout** | DashboardLayout |
| **Purpose** | Student enrollment and academic records management |

**Features:** Enrollment statistics, academic records overview, pending enrollments, student list, quick actions

---

### 25-26. Registrar Sub Routes (Placeholder)

**Routes:**
- `/registrar/enrollments` - Student enrollment management
- `/registrar/records` - Academic records management

---

## Accounts Officer Dashboard Routes

**Base Path:** `/accounts`

### 27. Accounts Dashboard

| Property | Value |
|----------|-------|
| **Route Path** | `/accounts/dashboard` |
| **Component** | `AccountsDashboard` |
| **File Path** | `src/app/pages/accounts/AccountsDashboard.tsx` |
| **Layout** | DashboardLayout |
| **Purpose** | Financial management dashboard |

**Features:** Revenue summary, payment statistics, failed payments tracking, refund requests, financial metrics, quick action buttons

---

### 28-29. Accounts Sub Routes (Placeholder)

**Routes:**
- `/accounts/payments` - Payment management and tracking
- `/accounts/reports` - Financial reports and analytics

---

## Route Configuration File

**Location:** `src/app/routes.tsx`

The routes are configured using **React Router v6** `createBrowserRouter`. 

### Router Setup Pattern

```typescript
export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: 'apply',
        element: <AdmissionPathwayPage />
      }
    ]
  },
  // ... more routes
]);
```

### Protected Route Pattern

Routes within `DashboardLayout` are protected via `ProtectedRoute` component that:
- Checks authentication status
- Verifies user role
- Redirects to login if not authenticated
- Redirects to dashboard if role not authorized

### Error Handling

- 404 handler: `path: '*'` route shows "Page Not Found"
- All errors redirect to error page or show alert

---

## Route Access Control Summary

| Route | Public | Auth | Candidate | Admin | HOD | Exam | Registrar | Accounts |
|-------|--------|------|-----------|-------|-----|------|-----------|----------|
| / | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| /apply | ✓ | ✓ | ✓ | ✓ | - | - | - | - |
| /login | ✓ | Redirect | Redirect | Redirect | Redirect | Redirect | Redirect | Redirect |
| /dashboard* | - | ✓ | ✓ | - | - | - | - | - |
| /admin* | - | ✓ | - | ✓ | - | - | - | - |
| /hod* | - | ✓ | - | - | ✓ | - | - | - |
| /exam* | - | ✓ | - | - | - | ✓ | - | - |
| /registrar* | - | ✓ | - | - | - | - | ✓ | - |
| /accounts* | - | ✓ | - | - | - | - | - | ✓ |

---

## Component Import Pattern

All pages use consistent component imports:

```typescript
// Layout
import { DashboardLayout } from './components/layouts/DashboardLayout';

// UI Components
import { Button } from '@/app/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
// ... more as needed

// Context
import { useUser } from '@/app/context/AuthContext';
import { useApplication } from '@/app/context/ApplicationContext';

// Utils
import { cn } from '@/app/components/ui/utils';
```

---

## Documentation Summary

**Total Routes:** 29 documented

**Breakdown:**
- Public Routes: 2 (Landing, Admission Pathway)
- Auth Route: 1 (Login)
- Candidate Routes: 8 (Dashboard + 7 sub-routes)
- Admin Routes: 6 (Dashboard + 5 full, 3 placeholder)
- HOD Routes: 3 (Dashboard + 2 placeholder)
- Exam Routes: 3 (Dashboard + 2 placeholder)
- Registrar Routes: 3 (Dashboard + 2 placeholder)
- Accounts Routes: 3 (Dashboard + 2 placeholder)

**Layouts:** 2
- PublicLayout
- DashboardLayout

**Common UI Components Used:** 30+ across all pages
(Button, Card, Table, Badge, Alert, Dialog, Form, Input, Textarea, Select, Checkbox, Radio, etc.)

---

**Documentation Version:** 1.0  
**Last Updated:** April 2026  
**Maintained By:** Development Team
