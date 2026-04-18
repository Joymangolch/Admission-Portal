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

Public routes are accessible without authentication and use the **PublicLayout** component.

### 1. Home / Landing Page

| Property | Value |
|----------|-------|
| **Route Path** | `/` |
| **Component** | `LandingPage` |
| **File Path** | `src/app/pages/LandingPage.tsx` |
| **Layout** | PublicLayout |
| **Authentication** | Not required |
| **User Role** | Anyone (public) |
| **Page Title** | Home / Landing |

#### Purpose
The main landing page introducing the admission portal application. Serves as entry point for new visitors.

#### Key Features
- Hero section with application overview
- Key features highlight
- CTA (Call to Action) button to admission pathway
- How it works section
- Benefits/advantages section
- Testimonials or statistics
- Footer with links

#### Major UI Components Used
```
LandingPage
├── Hero Section
│   ├── Heading (H1)
│   ├── Subheading
│   ├── CTA Button
│   └── Hero Image
├── Features Section
│   └── Feature Cards (Card component)
├── Process/Timeline Section
│   └── Step indicators
├── Benefits Section
│   └── Benefit cards with icons
└── Footer
    ├── Links columns
    └── Copyright info
```

#### Navigation
- **To:** Admission Pathway page (via "Start Application" button)
- **To:** Login page (via "Login" link in navigation)

---

### 2. Admission Pathway Page

| Property | Value |
|----------|-------|
| **Route Path** | `/apply` |
| **Component** | `AdmissionPathwayPage` |
| **File Path** | `src/app/pages/AdmissionPathwayPage.tsx` |
| **Layout** | PublicLayout |
| **Authentication** | Not required |
| **User Role** | Anyone (public) |
| **Page Title** | Admission Pathway |

#### Purpose
Explains the admission process and application steps. Guides prospective candidates through the workflow before they log in.

#### Key Features
- Admission timeline/process flow
- Step-by-step instructions
- Required documents checklist
- Eligibility criteria
- Important dates/deadlines
- FAQ section
- Contact information
- "Apply Now" button to login

#### Major UI Components Used
```
AdmissionPathwayPage
├── Process Timeline
│   └── Timeline/Steps component
├── Eligibility Section
│   ├── Requirements list
│   └── Documents checklist
├── Important Dates
│   └── Timeline card
├── FAQ Accordion
│   ├── Accordion component
│   └── Accordion items
└── CTA Section
    └── Button to Login/Apply
```

#### Navigation
- **To:** Login page (via "Apply Now" button)
- **Back:** Landing page (via breadcrumb or navigation)

---

## Authentication Routes

### 3. Login Page

| Property | Value |
|----------|-------|
| **Route Path** | `/login` |
| **Component** | `LoginPage` |
| **File Path** | `src/app/pages/LoginPage.tsx` |
| **Layout** | None (standalone) |
| **Authentication** | Not required; redirects if already logged in |
| **User Role** | Anyone (public) |
| **Page Title** | Login |

#### Purpose
Authenticates users and grants access to role-specific dashboards. First page after applying.

#### Key Features
- Email/username and password input fields
- "Remember me" checkbox
- "Forgot password" link
- Form validation and error display
- Responsive design for mobile
- Redirect to dashboard after successful login
- Role-based redirection (different dashboard per role)

#### Form Fields
```
Login Form
├── Email/Username (Input)
├── Password (Input - password type)
├── Remember Me (Checkbox)
└── Forgot Password (Link)
```

#### Major UI Components Used
```
LoginPage
├── Card wrapper
│   ├── Card Header
│   │   ├── Title (h1)
│   │   └── Subtitle
│   ├── Form
│   │   ├── Label + Input (Email)
│   │   ├── Label + Input (Password)
│   │   ├── Checkbox (Remember Me)
│   │   ├── Link (Forgot Password)
│   │   └── Button (Login)
│   └── Footer text + Link to signup
└── Alert (for error messages if any)
```

#### Form Fields & Validation
| Field | Type | Validation |
|-------|------|-----------|
| Email | Text (email) | Required, valid email format |
| Password | Password | Required, minimum 6 characters |
| Remember Me | Checkbox | Optional |

#### Navigation
- **To:** Respective dashboard based on user role (Candidate, Admin, HOD, etc.)
- **To:** Signup / Registration page (if link exists)

---

## Candidate Dashboard Routes

Candidate routes are protected and use the **DashboardLayout** component. All routes require user authentication and `Candidate` role.

**Base Path:** `/dashboard`

### 4. Candidate Dashboard (Home)

| Property | Value |
|----------|-------|
| **Route Path** | `/dashboard` or `/dashboard/` |
| **Component** | `CandidateDashboard` |
| **File Path** | `src/app/pages/candidate/CandidateDashboard.tsx` |
| **Layout** | DashboardLayout |
| **Authentication** | Required (Candidate) |
| **User Roles** | Candidate only |
| **Page Title** | My Dashboard |

#### Purpose
Main dashboard for candidates showing personal application summary and quick access to key features.

#### Key Features
- Total applications count
- Current application status
- Payment status
- Recent notifications badge
- Quick action cards (Start Application, Upload Documents, etc.)
- Important deadlines
- Progress indicator
- Links to other dashboard sections

#### Major UI Components Used
```
CandidateDashboard
├── Welcome Header
│   ├── Greeting message (personalized)
│   └── Candidate name
├── Stats Cards Grid
│   ├── Card: Total Applications
│   ├── Card: Applications Submitted
│   ├── Card: Under Review
│   ├── Card: Approved
│   └── Card: Rejected
├── Progress Card
│   ├── Title
│   └── Progress bar
├── Quick Actions Grid
│   ├── Button: View Application
│   ├── Button: Upload Documents
│   ├── Button: Pay Fees
│   ├── Button: Check Status
│   └── Button: Download Admit Card
├── Recent Activity
│   ├── Activity list
│   └── Timestamps
└── Important Dates
    └── Deadline badges
```

#### Navigation
- **To:** Application Form (via "New Application" button)
- **To:** Document Upload (via "Upload Documents" button)
- **To:** Payment (via "Pay Fees" button)
- **To:** Application Status (via "View Status" button)
- **To:** Admit Card (via "Get Admit Card" button)
- **To:** Results (via "View Results" button)
- **To:** Notifications (via notifications icon)

---

### 5. Application Form

| Property | Value |
|----------|-------|
| **Route Path** | `/dashboard/application` |
| **Component** | `ApplicationForm` |
| **File Path** | `src/app/pages/candidate/ApplicationForm.tsx` |
| **Layout** | DashboardLayout |
| **Authentication** | Required (Candidate) |
| **User Roles** | Candidate only |
| **Page Title** | Application Form |

#### Purpose
Multi-step form for candidates to submit their admission application. Core feature of the portal.

#### Key Features
- Multi-step form with validation
- Personal information section
- Education background section
- Document upload section
- Programme/Course selection
- Save as draft
- Submit application
- Progress indicator showing current step
- Error validation and display
- Auto-save functionality
- Confirmation before final submission

#### Form Sections
```
Application Form (Multi-Step)
├── Step 1: Personal Information
│   ├── Full Name (Input)
│   ├── Date of Birth (Date picker)
│   ├── Email (Email input)
│   ├── Phone (Phone input)
│   ├── Address (Textarea)
│   ├── City (Input)
│   ├── State (Select)
│   └── ZIP Code (Input)
├── Step 2: Education
│   ├── 10th Board (Select)
│   ├── 10th Percentage (Input)
│   ├── 12th Board (Select)
│   ├── 12th Percentage (Input)
│   ├── Bachelor's Degree (Select)
│   ├── CGPA (Input)
│   └── Graduation Year (Date picker)
├── Step 3: Programme Selection
│   ├── First Choice (Select with search)
│   ├── Second Choice (Select with search)
│   ├── Third Choice (Select)
│   └── Specialization (if available)
└── Step 4: Documents & Confirmation
    ├── Upload ID Proof
    ├── Upload Education Certificates
    ├── Upload Entrance Exam Score
    ├── Confirmation Checkbox
    ├── Terms & Conditions Checkbox
    ├── Submit Button
    └── Save Draft Button
```

#### Major UI Components Used
```
ApplicationForm
├── Tabs or Stepper (Step indicator)
├── Form container (Form context)
├── FormField components
│   ├── Label + Input pairs
│   ├── Label + Select pairs
│   ├── Label + Textarea pairs
│   └── Label + Checkbox pairs
├── Alert (for validation errors)
├── Alert (for success messages)
├── Progress Bar (step progress)
├── Card sections
├── Dialog (confirmation before submit)
└── Buttons (Save Draft, Next, Previous, Submit)
```

#### Status Tracking
- **Draft:** Auto-saved, not visible to admin
- **Submitted:** Locked, read-only, visible to admin
- **Under Review:** Locked, read-only, shows review timeline
- **Approved/Rejected:** Locked, read-only, shows decision

#### Navigation
- **To:** Document Upload (via Next button or sidebar)
- **To:** Dashboard (via Cancel or breadcrumb)
- **To:** Application Status (after submission)

---

### 6. Document Upload

| Property | Value |
|----------|-------|
| **Route Path** | `/dashboard/documents` |
| **Component** | `DocumentUpload` |
| **File Path** | `src/app/pages/candidate/DocumentUpload.tsx` |
| **Layout** | DashboardLayout |
| **Authentication** | Required (Candidate) |
| **User Roles** | Candidate only |
| **Page Title** | Document Upload |

#### Purpose
Manage and upload supporting documents required for admission application.

#### Key Features
- Drag-and-drop file upload
- Document type selection
- Multiple file upload
- File preview
- File size validation
- File type validation (PDF, images only)
- Upload progress indicator
- Document list showing all uploaded documents
- Edit/Delete document capability
- Document verification status shown by admin
- Expiry date tracking for documents

#### Document Types
- National ID / Passport
- Educational Certificates (10th, 12th, Bachelor's)
- Entrance Exam Scorecard
- Character Certificate
- Medical Certificate
- Domicile Certificate
- Income Certificate (if applicable)

#### Major UI Components Used
```
DocumentUpload
├── Header Section
│   ├── Title
│   └── Instructions
├── Upload Area
│   ├── Drag-drop zone
│   ├── File input (hidden)
│   ├── Browse button
│   └── File type/size info
├── Document List
│   ├── Table (Table component)
│   │   ├── Document Name
│   │   ├── Type
│   │   ├── Upload Date
│   │   ├── Size
│   │   ├── Status (Verified/Pending)
│   │   └── Actions (View, Delete)
│   └── Pagination
├── Upload Progress
│   └── Progress bar
└── Alert messages (success/error)
```

#### File Validation
- **Allowed Types:** PDF, JPG, PNG, DOC, DOCX
- **Max File Size:** 5MB per file
- **Max Total:** 50MB
- **Dimensions (images):** Max 4000x3000px

#### Navigation
- **To:** Application Form (via sidebar)
- **To:** Dashboard (via breadcrumb)

---

### 7. Notifications Page

| Property | Value |
|----------|-------|
| **Route Path** | `/dashboard/notifications` |
| **Component** | `NotificationsPage` |
| **File Path** | `src/app/pages/candidate/NotificationsPage.tsx` |
| **Layout** | DashboardLayout |
| **Authentication** | Required (Candidate) |
| **User Roles** | Candidate only |
| **Page Title** | Notifications |

#### Purpose
Center for all candidate notifications including application updates, exam notices, and system messages.

#### Key Features
- Notification list with timestamps
- Filter by notification type (Application, Payment, Exam, System)
- Mark as read/unread
- Delete individual notifications
- Mark all as read
- Notification detail view
- Real-time notification badge on sidebar
- Search/filter functionality
- Sorting by date (newest first)

#### Notification Types
| Type | Color | Examples |
|------|-------|----------|
| Application | Blue | Application submitted, Under review, Approved, Rejected |
| Payment | Amber | Payment due, Payment received, Invoice generated |
| Exam | Green | Admit card available, Exam reschedule, Result published |
| System | Gray | Maintenance notice, Policy update, Deadline reminder |

#### Major UI Components Used
```
NotificationsPage
├── Header
│   ├── Title
│   ├── Filter Tabs
│   │   ├── All
│   │   ├── Application
│   │   ├── Payment
│   │   ├── Exam
│   │   └── System
│   └── Mark all as read button
├── Search & Filter
│   ├── Search input
│   └── Sort dropdown
├── Notification List
│   ├── Badge (read/unread)
│   ├── Notification title
│   ├── Truncated message
│   ├── Timestamp
│   ├── Type badge
│   └── Action (Delete, View)
├── Notification Detail (expandable)
│   ├── Full message
│   ├── Action buttons
│   └── View related item button
└── Empty State (if no notifications)
```

#### Navigation
- **To:** Related pages (e.g., click notification → Application Status)
- **To:** Dashboard (via breadcrumb)

---

### 8. Payment Page

| Property | Value |
|----------|-------|
| **Route Path** | `/dashboard/payment` |
| **Component** | `PaymentPage` |
| **File Path** | `src/app/pages/candidate/PaymentPage.tsx` |
| **Layout** | DashboardLayout |
| **Authentication** | Required (Candidate) |
| **User Roles** | Candidate only |
| **Page Title** | Payment |

#### Purpose
Manage application fees and payments. Handles fee structure, amount calculation, and payment processing.

#### Key Features
- Fee breakdown display
- Tax (GST) calculation
- Payment method selection (if multiple available)
- Transaction history
- Invoice generation and download
- Payment status tracking
- Payment confirmation
- Receipt generation
- Payment gateway integration (e.g., Razorpay, PayPal)

#### Fee Structure
| Description | Amount (INR) | Notes |
|-------------|--------|-------|
| Application Fee | 500 | Base fee |
| Processing Fee | 100 | Administrative |
| GST (18%) | 108 | Tax on subtotal |
| **Total** | **708** | **Final amount** |

#### Major UI Components Used
```
PaymentPage
├── Fee Summary Card
│   ├── Candidate Name
│   ├── Programme Applied
│   ├── Fee Breakdown Table
│   │   ├── Application Fee: 500
│   │   ├── Processing Fee: 100
│   │   ├── Subtotal: 600
│   │   ├── GST (18%): 108
│   │   └── Total: 708
│   └── Payment Date
├── Payment Method Selection
│   ├── Radio/Select for method
│   │   ├── Credit/Debit Card
│   │   ├── UPI
│   │   ├── Net Banking
│   │   └── Wallet
│   └── Disclaimer
├── Payment Form
│   ├── Button: Pay Now / Proceed to Payment
│   └── Info: "You'll be redirected to payment gateway"
├── Transaction History
│   ├── Table
│   │   ├── Date
│   │   ├── Amount
│   │   ├── Method
│   │   ├── Status
│   │   └── Receipt link
│   └── Pagination
└── Alert messages (success/error)
```

#### Payment States
- **Pending:** Awaiting payment
- **Processing:** Payment being processed
- **Completed:** Payment successful
- **Failed:** Payment failed, retry option
- **Refunded:** Refund processed

#### Navigation
- **To:** Dashboard (after successful payment)
- **To:** Notifications (payment confirmation)
- **Back:** Dashboard (via breadcrumb or cancel)

---

### 9. Application Status Page

| Property | Value |
|----------|-------|
| **Route Path** | `/dashboard/application-status` |
| **Component** | `ApplicationStatusPage` |
| **File Path** | `src/app/pages/candidate/ApplicationStatusPage.tsx` |
| **Layout** | DashboardLayout |
| **Authentication** | Required (Candidate) |
| **User Roles** | Candidate only |
| **Page Title** | Application Status |

#### Purpose
Real-time tracking of application progress through the review workflow. Shows timeline and current stage.

#### Key Features
- Status timeline showing all stages
- Current status highlighted
- Status badge with color coding
- Reviewer comments (if any)
- Estimated decision date
- Action required notifications
- Status history with timestamps
- Request for additional documents (if needed)
- Approval/rejection details

#### Status Timeline
```
Draft
  ↓
Submitted (Date: YYYY-MM-DD HH:MM)
  ↓
Under Review (Current Stage - In Progress)
  ↓
Approved/Rejected (Pending)
  ↓
Enrollment / Rejection Letter
```

#### Major UI Components Used
```
ApplicationStatusPage
├── Status Header Card
│   ├── Current Status Badge
│   ├── Current Stage
│   ├── Last Updated Date
│   └── Estimated Decision Date
├── Timeline Component
│   ├── Timeline item: Draft (completed)
│   ├── Timeline item: Submitted (completed)
│   │   └── Timestamp
│   ├── Timeline item: Under Review (current)
│   │   └── Progress indicator
│   ├── Timeline item: Approved/Rejected (pending)
│   └── Timeline dots/connectors
├── Reviewer Comments Card
│   └── Comments text (if available)
├── Action Required Alert (if applicable)
│   ├── Alert icon
│   ├── Action description
│   └── "Upload Documents" button
└── Status History Table
    ├── Date
    ├── Status
    ├── Remarks
    └── Timestamp
```

#### Status Details by Stage
| Stage | Duration | Actions |
|-------|----------|---------|
| Draft | Until submit | View form, edit, save |
| Submitted | Day 0 | Confirmation email sent |
| Under Review | Days 1-7 | Admin reviewing, waiting |
| Approved/Rejected | Day 8+ | Decision made, notification sent |
| Enrollment | Post acceptance | Enrollment link sent |

#### Navigation
- **To:** Application Form (via "Edit Application" if in draft)
- **To:** Document Upload (via "Upload Documents" if needed)
- **To:** Dashboard (via breadcrumb)

---

### 10. Admit Card Page

| Property | Value |
|----------|-------|
| **Route Path** | `/dashboard/admit-card` |
| **Component** | `AdmitCardPage` |
| **File Path** | `src/app/pages/candidate/AdmitCardPage.tsx` |
| **Layout** | DashboardLayout |
| **Authentication** | Required (Candidate) |
| **User Roles** | Candidate (only after approved) |
| **Page Title** | Admit Card |

#### Purpose
Display and manage admit card for entrance exam. Print-ready format for offline use.

#### Key Features
- Admit card display with candidate details
- Exam details (date, time, center)
- Print functionality (optimized for A4)
- Download as PDF
- Hall ticket number
- Important instructions for exam
- Reporting time information
- Center location map/address
- Multiple admit cards (if multiple exams)
- Validity dates

#### Admit Card Content
```
UNIVERSITY NAME
ADMIT CARD

Candidate Details:
├── Candidate ID
├── Full Name
├── Date of Birth
├── Email
├── Phone
├── Photo (passport size)

Exam Details:
├── Exam Name
├── Exam Date
├── Exam Time (Start - End)
├── Exam Center
├── Room Number
├── Seat Number

Center Details:
├── Center Address
├── Center Phone
├── Map/Directions
└── Parking Info

Instructions:
├── Report time (30 mins before)
├── Allowed items (pen, ID)
├── Prohibited items
└── Important dos and don'ts

---
Signature Field
Issued Date
```

#### Major UI Components Used
```
AdmitCardPage
├── Header
│   ├── Title
│   └── Buttons (Print, Download PDF)
├── Admit Card Container
│   ├── Print-optimized styling
│   ├── University Header
│   ├── "ADMIT CARD" Title
│   ├── Candidate Photo (Avatar)
│   ├── Candidate Details Section
│   │   └── 2-column layout (name, ID, etc.)
│   ├── Exam Details Section
│   │   └── 2-column layout
│   ├── Center Details Section
│   ├── Instructions Accordion
│   ├── Important Notes Alert
│   └── Footer (signature line, date)
├── Center Location Map (embedded)
└── Download Section
    ├── Button: Download PDF
    └── Button: Print Admit Card
```

#### Navigation
- **To:** Dashboard (via breadcrumb)
- **To:** Exam Details (if link available)

---

### 11. Result Page

| Property | Value |
|----------|-------|
| **Route Path** | `/dashboard/results` |
| **Component** | `ResultPage` |
| **File Path** | `src/app/pages/candidate/ResultPage.tsx` |
| **Layout** | DashboardLayout |
| **Authentication** | Required (Candidate) |
| **User Roles** | Candidate (only after exam and result publication) |
| **Page Title** | Results |

#### Purpose
Display exam results and marks breakdown for candidates.

#### Key Features
- Overall score display
- Subject-wise marks breakdown
- Percentile ranking
- Passing status indicator
- Result statistics/metrics
- Comparison with cutoff
- Merit position (if applicable)
- Download result certificate
- Re-evaluation request (if allowed)
- Score card display

#### Result Structure
```
Exam Name: MBA Entrance Exam
Date: 2026-04-15

Overall Result:
├── Total Marks: 350
├── Marks Obtained: 285
├── Percentage: 81.43%
├── Status: PASSED ✓

Subject Breakdown:
├── Quantitative Aptitude: 95/100
├── Logical Reasoning: 95/100
├── Verbal Ability: 95/100

Statistics:
├── Percentile: 98.5
├── National Rank: 1,234
├── Category Rank: 567
├── Cutoff Passed: Yes (285 > 200)
```

#### Major UI Components Used
```
ResultPage
├── Status Header Card
│   ├── Exam Name
│   ├── Result Status Badge (PASSED/FAILED)
│   ├── Overall Score Display
│   │   ├── Circle Progress
│   │   └── Score text (285/350)
│   └── Percentage shown as visual

├── Result Summary Grid
│   ├── Card: Total Marks
│   ├── Card: Marks Obtained
│   ├── Card: Percentage
│   ├── Card: Passing Status
│   ├── Card: Percentile Rank
│   └── Card: Merit Position

├── Subject-wise Marks Table
│   ├── Subject Name
│   ├── Marks Obtained
│   ├── Max Marks
│   ├── Percentage
│   └── Progress bar

├── Detailed Analysis
│   ├── Chart (bar/line)
│   ├── Distribution comparison
│   └── Cutoff comparison

└── Actions
    ├── Download Result Certificate
    ├── Request Re-evaluation (if applicable)
    └── Share Result (if enabled)
```

#### Charts Used
- **Pie Chart:** Subject-wise score distribution
- **Bar Chart:** Subject performance vs. cutoff
- **Line Chart:** Score trend (if multiple attempts)

#### Navigation
- **To:** Dashboard (via breadcrumb)
- **Print/Download:** Result certificate as PDF

---

## Admin Dashboard Routes

Admin routes are protected and use the **DashboardLayout** component. All routes require user authentication and `Admin` role.

**Base Path:** `/admin`

### 12. Admin Dashboard

| Property | Value |
|----------|-------|
| **Route Path** | `/admin/dashboard` |
| **Component** | `AdminDashboard` |
| **File Path** | `src/app/pages/admin/AdminDashboard.tsx` |
| **Layout** | DashboardLayout |
| **Authentication** | Required (Admin) |
| **User Roles** | Admin only |
| **Page Title** | Admin Dashboard |

#### Purpose
Central admin dashboard showing system-wide statistics, recent activities, and management controls.

#### Key Features
- System-wide metrics and KPIs
- Total applications count
- Application status breakdown
- Recent applications list
- User statistics
- Payment summary
- Quick action panels
- System health status
- Activity logs
- Alert notifications for critical events

#### Dashboard Widgets
```
Admin Dashboard
├── Header Stats Cards
│   ├── Total Applications: 1,234
│   ├── Pending Review: 234
│   ├── Approved: 567
│   ├── Rejected: 89
│   ├── Total Users: 2,000
│   ├── Active Today: 456
│   ├── Total Revenue: ₹870,312
│   └── Payment Success Rate: 98.5%

├── Status Distribution Chart
│   └── Pie or Doughnut chart

├── Recent Applications Table
│   ├── Candidate Name
│   ├── Application Date
│   ├── Status
│   ├── Current Stage
│   └── Actions (Review, View)

├── System Alerts Section
│   ├── Pending reviews
│   ├── Document verification due
│   └── Payment failures

└── Quick Actions
    ├── Button: Review Applications
    ├── Button: Manage Users
    ├── Button: View Reports
    └── Button: System Settings
```

#### Major UI Components Used
```
AdminDashboard
├── Header section
├── Stats Cards Grid (responsive)
├── Charts Container
│   ├── Bar chart or Pie chart
│   └── Data visualization
├── Recent Items Table
│   └── Table component with pagination
├── Alert Section
│   └── Multiple Alert components
├── Quick Actions Grid
│   └── Button grid
└── Activity Log Card
    └── List of recent activities
```

#### Navigation
- **To:** Application Review (via "Review Applications" button)
- **To:** User Management (via sidebar)
- **To:** Exam Management (via sidebar)
- **To:** Payment/Accounts (via "Revenue" section)

---

### 13. Application Review Page

| Property | Value |
|----------|-------|
| **Route Path** | `/admin/review` |
| **Component** | `ApplicationReviewPage` |
| **File Path** | `src/app/pages/admin/ApplicationReviewPage.tsx` |
| **Layout** | DashboardLayout |
| **Authentication** | Required (Admin) |
| **User Roles** | Admin, ReviewOfficer |
| **Page Title** | Application Review |

#### Purpose
Core admin functionality for reviewing and processing candidate applications.

#### Key Features
- Applications list with filters
- Advanced search and filtering
- Application detail view
- Document verification status
- Review status tracking
- Add comments/notes
- Approve/Reject with reason
- Bulk actions (approve multiple)
- Email notification on action
- Review history tracking
- Document preview/zoom
- Assign reviewer functionality

#### Filter Options
- **Status:** All, Draft, Submitted, Under Review, Approved, Rejected
- **Date Range:** Custom date selection
- **Programme:** Multiple programme filter
- **Merit Score Range:** Min-Max slider
- **Verification Status:** Verified, Pending, Failed

#### Review States
| State | Action | Next State |
|-------|--------|-----------|
| Submitted | Initiate Review | Under Review |
| Under Review | Approve | Approved |
| Under Review | Request Info | Submitted |
| Under Review | Reject | Rejected |
| Approved | Cancel | Under Review |
| Rejected | Appeal | Under Review |

#### Major UI Components Used
```
ApplicationReviewPage
├── Toolbar
│   ├── Search input
│   ├── Filter button/dropdown
│   ├── Status filter tabs
│   ├── Sort dropdown
│   └── Export button

├── Application List
│   ├── Table View
│   │   ├── Checkbox (select multiple)
│   │   ├── Candidate Name
│   │   ├── Application ID
│   │   ├── Programme
│   │   ├── Submission Date
│   │   ├── Current Status
│   │   ├── Verification Status
│   │   └── Actions (Review, View)
│   └── Pagination

├── Application Detail Panel (accordion/drawer)
│   ├── Candidate Info
│   │   ├── Name, Email, Phone
│   │   ├── Applied Programme
│   │   └── Application Date
│   ├── Education Details
│   │   ├── Qualifications
│   │   └── Scores
│   ├── Uploaded Documents
│   │   ├── Document list
│   │   ├── Verification toggle
│   │   ├── Document preview (modal)
│   │   └── Download option
│   ├── Review Section
│   │   ├── Comments/Notes textarea
│   │   ├── Review checklist
│   │   └── Status selector
│   └── Actions
│       ├── Button: Approve
│       ├── Button: Reject
│       ├── Button: Request Info
│       └── Button: Send Email
│
└── Bulk Actions
    ├── Approve Selected
    ├── Reject Selected
    └── Assign to Reviewer
```

#### Document Verification
- Click document → preview in modal
- Zoom, pan, rotate functionality
- Verification checkbox per document
- Status: Verified, Pending, Rejected
- Rejection reason dropdown

#### Navigation
- **To:** Admin Dashboard (via breadcrumb)
- **To:** User Management (via sidebar)

---

### 14. User Role Management Page

| Property | Value |
|----------|-------|
| **Route Path** | `/admin/users` |
| **Component** | `UserRoleManagementPage` |
| **File Path** | `src/app/pages/admin/UserRoleManagementPage.tsx` |
| **Layout** | DashboardLayout |
| **Authentication** | Required (Admin) |
| **User Roles** | Admin only |
| **Page Title** | User & Role Management |

#### Purpose
Manage user accounts, assign roles, and control user permissions across the system.

#### Key Features
- User list with search
- Create new user account
- Edit user details
- Assign/change roles
- Deactivate/activate users
- Reset password
- User activity log
- Batch operations
- Email notifications on role change
- Permission matrix view

#### User Roles Manageable
| Role | Permissions | Primary Functions |
|------|-----------|------------------|
| Candidate | View own application, upload docs, check status | Apply, track application |
| ReviewOfficer | Review applications, verify docs, make decisions | Review and approve/reject |
| Registrar | View enrollments, manage academic records | Handle enrollments |
| ExamCoordinator | Manage exams, upload results | Exam operations |
| HOD | View department candidates, manage courses | Department management |
| AccountsOfficer | Manage payments, view financial data | Payment handling |
| Admin | Full system access | Root management |

#### Major UI Components Used
```
UserRoleManagementPage
├── Toolbar
│   ├── Search input (by name, email, ID)
│   ├── Filter dropdown (by role)
│   ├── Status filter (Active, Inactive)
│   ├── Sort options
│   └── Button: Add New User

├── User List Table
│   ├── Checkbox (select)
│   ├── User Name
│   ├── Email
│   ├── User ID
│   ├── Role(s)
│   ├── Status (Active/Inactive)
│   ├── Last Login
│   └── Actions button (dropdown menu)
│       ├── Edit
│       ├── Change Role
│       ├── Reset Password
│       ├── View Activity
│       ├── Deactivate
│       └── Delete

├── User Detail Modal (on Edit)
│   ├── Personal Info
│   │   ├── First Name
│   │   ├── Last Name
│   │   ├── Email
│   │   └── Phone
│   ├── Role Assignment
│   │   ├── Multi-select roles
│   │   └── Permission preview
│   ├── Account Status
│   │   ├── Toggle: Active/Inactive
│   │   └── Expiry date (if applicable)
│   └── Actions
│       ├── Save Changes
│       └── Cancel

├── Create User Form
│   ├── Email
│   ├── First Name
│   ├── Last Name
│   ├── Phone
│   ├── Role(s) selection
│   └── temporary password field

└── Bulk Actions
    ├── Deactivate Selected
    ├── Activate Selected
    ├── Reset Password
    └── Send Email Notification
```

#### Navigation
- **To:** Admin Dashboard (via breadcrumb)
- **To:** Exam Management (via sidebar)

---

### 15. Exam Management Page

| Property | Value |
|----------|-------|
| **Route Path** | `/admin/exams` |
| **Component** | `ExamManagementPage` |
| **File Path** | `src/app/pages/admin/ExamManagementPage.tsx` |
| **Layout** | DashboardLayout |
| **Authentication** | Required (Admin) |
| **User Roles** | Admin, ExamCoordinator |
| **Page Title** | Exam Management |

#### Purpose
Create, manage, and schedule entrance exams for the admission process.

#### Key Features
- Exam creation and scheduling
- Exam center management
- Exam date and time setup
- Exam question paper upload
- Candidate registration for exams
- Exam status tracking
- Admit card generation
- Result publication workflow
- Exam analytics (registration, attendance)
- Section-wise configuration (if required)

#### Exam Details
```
Exam Management
├── Exam List
│   ├── Exam Name
│   ├── Scheduled Date
│   ├── Scheduled Time
│   ├── Duration
│   ├── Total Candidates Registered
│   ├── Centers Count
│   ├── Status (Draft, Scheduled, Live, Completed, Results Published)
│   └── Actions (Edit, Delete, View Details)

├── Exam Creation Form (if creating new)
│   ├── Exam Name
│   ├── Description
│   ├── Exam Date (Date picker)
│   ├── Exam Time (Time picker)
│   ├── Duration (in minutes)
│   ├── Total Marks
│   ├── Pass Marks
│   ├── Section Configuration
│   │   ├── Section Name
│   │   ├── Questions Count
│   │   ├── Marks per Question
│   │   ├── Negative Marking (yes/no)
│   │   ├── Negative Mark Value
│   │   └── Add More Sections button
│   ├── Centers Selection
│   │   └── Multi-select centers
│   ├── Question Paper Upload
│   │   └── File upload (PDF)
│   └── Generate Admit Cards checkbox

└── Exam Details View
    ├── Basic Info
    ├── Registered Candidates list
    ├── Exam Centers
    ├── Questions/Sections
    ├── Result Settings (passing criteria)
    └── Actions (Edit, Delete, Cancel, Publish Results)
```

#### Major UI Components Used
```
ExamManagementPage
├── Tabs (List view, Create new, Analytics)
├── Toolbar (if list view)
│   ├── Search
│   ├── Filter by status
│   └── Button: Create New Exam
├── Exam List Table
│   ├── Exam Name, Date, Time, Status
│   ├── Registered Candidates Count
│   └── Actions dropdown
├── Create/Edit Form
│   ├── Form fields with Labels
│   ├── Date/Time pickers
│   ├── File upload
│   ├── Multi-select for centers
│   ├── Repeatable sections
│   └── Submit/Save buttons
└── Analytics Section
    ├── Charts (registration trend, attendance)
    └── Statistics cards
```

#### Navigation
- **To:** Admin Dashboard (via breadcrumb)
- **To:** Result Management (after exam completion)

---

### 16. Result Management Page

| Property | Value |
|----------|-------|
| **Route Path** | `/admin/results` |
| **Component** | `ResultManagementPage` |
| **File Path** | `src/app/pages/admin/ResultManagementPage.tsx` |
| **Layout** | DashboardLayout |
| **Authentication** | Required (Admin) |
| **User Roles** | Admin, ExamCoordinator |
| **Page Title** | Result Management |

#### Purpose
Upload, manage, and publish exam results for candidates.

#### Key Features
- Bulk result upload (CSV/Excel)
- Individual result entry
- Result verification
- Cutoff mark setting
- Merit ranking calculation
- Result publication control
- Result modification audit trail
- Candidate result notification
- Request for revaluation
- Statistical analysis

#### Result Upload Process
1. Select exam
2. Upload result file (CSV/Excel format)
3. Map columns (Roll No → Candidate, Marks sections)
4. Validate data
5. Review before publishing
6. Publish results (triggers notifications)

#### Major UI Components Used
```
ResultManagementPage
├── Tabs (List, Upload New, Analytics)

├── Result Upload Section
│   ├── Exam selection dropdown
│   ├── File drag-drop area
│   ├── Upload button
│   ├── Column mapping interface
│   ├── Validation results table
│   ├── Errors/warnings list
│   └── Publish button

├── Result List Table
│   ├── Exam Name
│   ├── Upload Date
│   ├── Candidates Count
│   ├── Status (Draft, Published, Revaluation Pending)
│   └── Actions (Edit, View, Publish, Withdraw)

├── Individual Result Entry
│   ├── Candidate search
│   ├── Exam selection
│   ├── Section-wise marks input
│   ├── Total marks display (auto-calculated)
│   ├── Save as Draft / Publish toggle
│   └── Submit button

└── Result Analysis
    ├── Statistics (average, median, mode)
    ├── Distribution chart
    ├── Cutoff comparison chart
    └── Merit ranking table
```

#### Result Publishing
- Results initially saved as Draft
- Admin reviews and verifies
- Publish sends notifications to all candidates
- Published results are locked (can modify with audit trail)
- Revaluation requests can be tracked

#### Navigation
- **To:** Admin Dashboard (via breadcrumb)
- **To:** Exam Management (via related link)

---

### 17. Notification System Page

| Property | Value |
|----------|-------|
| **Route Path** | `/admin/notifications` |
| **Component** | `NotificationSystemPage` |
| **File Path** | `src/app/pages/admin/NotificationSystemPage.tsx` |
| **Layout** | DashboardLayout |
| **Authentication** | Required (Admin) |
| **User Roles** | Admin only |
| **Page Title** | Notification System |

#### Purpose
Send system-wide or targeted notifications to users about important events and updates.

#### Key Features
- Compose and send notifications
- Target specific user groups/roles
- Email integration
- SMS integration (if available)
- Notification templates
- Schedule notifications
- Track delivery and read status
- Notification history
- Bulk messaging
- Personalization (merge fields)

#### Notification Types
- **Manual:** Admin-composed messages
- **Automated:** Triggered by system events
  - Application status changes
  - Payment confirmations
  - Exam schedules
  - Results published
  - Deadline reminders

#### Major UI Components Used
```
NotificationSystemPage
├── Compose Section (Card)
│   ├── Recipient Selection
│   │   ├── Radio/Checkbox for groups
│   │   │   ├── All Users
│   │   │   ├── All Candidates
│   │   │   ├── Specific Status
│   │   │   ├── Specific Role
│   │   │   └── Custom List
│   │   └── Preview recipient count
│   ├── Notification Type
│   │   ├── Email
│   │   ├── SMS
│   │   └── In-App Notification
│   ├── Template Selection
│   │   └── Dropdown of saved templates
│   ├── Subject Line
│   ├── Message Content (Textarea or Rich Editor)
│   ├── Personalization Variables
│   │   └── Available merge fields list
│   ├── Schedule Option
│   │   ├── Send Now / Schedule
│   │   ├── Date picker
│   │   └── Time picker
│   └── Buttons
│       ├── Schedule Notification
│       └── Send Now (with confirmation)

├── Notification History Table
│   ├── Date Sent
│   ├── Recipient Group
│   ├── Subject
│   ├── Type (Email/SMS/In-App)
│   ├── Status (Sent, Delivered, Failed)
│   ├── Delivery Rate %
│   ├── Read Rate % (for in-app)
│   └── Actions (View, Resend, Delete)

└── Template Management
    ├── Template list
    ├── Create template
    ├── Edit template
    └── Delete template
```

#### Notification Templates Example
**Application Approved Template:**
```
Subject: Your Application has been Approved!

Dear {CANDIDATE_NAME},

Congratulations! Your application for {PROGRAM_NAME} 
has been approved.

Your Admit Card is now available.
Download: {ADMIT_CARD_LINK}

Important Dates:
- Exam Date: {EXAM_DATE}
- Reporting Time: {REPORTING_TIME}
- Exam Center: {CENTER_NAME}

Best Regards,
Admission Portal Team
```

#### Navigation
- **To:** Admin Dashboard (via breadcrumb)
- **Back:** Other admin pages via sidebar

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
| **Authentication** | Required (HOD) |
| **User Roles** | HOD only |
| **Page Title** | HOD Dashboard |

#### Purpose
Department-level dashboard showing candidates and course management for the department.

#### Key Features
- Department candidates list
- Departmental statistics
- Course management overview
- Candidate performance tracking (if exam taken)
- Admission status for department

#### Major UI Components Used
```
HODDashboard
├── Welcome header (personalized)
├── Department Stats Cards
│   ├── Total Candidates
│   ├── Seats Filled
│   ├── Pending Approvals
│   └── Courses Running
├── Candidates List
├── Course Management Quick Links
└── Recent Activity
```

#### Navigation
- **To:** Candidates list page (via sidebar)
- **To:** Course Management (via sidebar)

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
| **Authentication** | Required (Exam Coordinator) |
| **User Roles** | ExamCoordinator only |
| **Page Title** | Exam Dashboard |

#### Purpose
Exam coordinator dashboard for managing exams, results, and related reports.

#### Key Features
- Upcoming exams schedule
- Exam statistics
- Results status
- Candidate statistics
- Quick action panels

#### Major UI Components Used
```
ExamDashboard
├── Welcome header
├── Upcoming Exams Cards
├── Statistics Cards
├── Results Status
├── Candidate Stats
└── Quick Actions
```

#### Navigation
- **To:** Results management (via sidebar)
- **To:** Reports (via sidebar)

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
| **Authentication** | Required (Registrar) |
| **User Roles** | Registrar only |
| **Page Title** | Registrar Dashboard |

#### Purpose
Registrar dashboard for managing enrollments and academic records.

#### Key Features
- Enrollment statistics
- Academic records overview
- Pending enrollments
- Student list
- Quick actions for enrollment

#### Major UI Components Used
```
RegistrarDashboard
├── Welcome header
├── Enrollment Stats Cards
├── Pending Enrollments List
├── Student Statistics
└── Quick Actions
```

#### Navigation
- **To:** Enrollments (via sidebar)
- **To:** Academic Records (via sidebar)

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
| **Authentication** | Required (Accounts Officer) |
| **User Roles** | AccountsOfficer only |
| **Page Title** | Accounts Dashboard |

#### Purpose
Financial dashboard for accounts officer to manage payments and financial reports.

#### Key Features
- Revenue summary
- Payment statistics
- Failed payments tracking
- Refund requests
- Financial metrics
- Quick action buttons

#### Major UI Components Used
```
AccountsDashboard
├── Welcome header
├── Revenue Cards
│   ├── Total Revenue
│   ├── Today's Collections
│   ├── Pending Payments
│   └── Failed Transactions
├── Payment Stats Chart
├── Failed Payments List
├── Refund Requests
└── Quick Actions
```

#### Navigation
- **To:** Payment Management (via sidebar)
- **To:** Financial Reports (via sidebar)

---

### 28-29. Accounts Sub Routes (Placeholder)

**Routes:**
- `/accounts/payments` - Payment management and tracking
- `/accounts/reports` - Financial reports and analytics

---

## Route Configuration File

**Location:** [src/app/routes.tsx](src/app/routes.tsx)

The routes are configured using React Router v6 `createBrowserRouter`. Key configuration points:

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

- 404 handler: `path: '*'` route at the end shows "Page Not Found"
- All error responses should redirect to error page or show alert

---

## Route Access Control Summary

| Route | Public | Authenticated | Candidate | Admin | HOD | Exam | Registrar | Accounts |
|-------|--------|---------------|-----------|-------|-----|------|-----------|----------|
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

## Component Import Patterns

All pages import components as follows:

```typescript
// Layout
import { DashboardLayout } from './components/layouts/DashboardLayout';

// UI Components
import { Button } from '@/app/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
// ... and many more as needed

// Context/State
import { useUser } from '@/app/context/AuthContext';
import { useApplication } from '@/app/context/ApplicationContext';

// Utils
import { cn } from '@/app/components/ui/utils';
```

---

## Documentation Summary

**Total Routes:** 29 documented
- **Public Routes:** 2 (Landing, Admission Pathway)
- **Auth Route:** 1 (Login)
- **Candidate Routes:** 8 (Dashboard + 7 sub-routes)
- **Admin Routes:** 6 (Dashboard + 5 sub-routes)
- **HOD Routes:** 3 (Dashboard + 2 sub-routes)
- **Exam Routes:** 3 (Dashboard + 2 sub-routes)
- **Registrar Routes:** 3 (Dashboard + 2 sub-routes)
- **Accounts Routes:** 3 (Dashboard + 2 sub-routes)

**Layouts:** 2
- PublicLayout
- DashboardLayout

**Common UI Components Used Across Pages:** 30+
- Button, Card, Table, Badge, Alert, Dialog, Form, Input, Textarea, Select, Checkbox, Radio, etc.

---

**Documentation Version:** 1.0  
**Last Updated:** April 2026  
**Maintained By:** Development Team
