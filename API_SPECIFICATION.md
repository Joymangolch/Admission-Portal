# 📡 Backend API Specification

**Document:** Complete API Reference for MTU Admission Portal  
**Status:** v1.0 - For Backend Implementation  
**Date:** April 17, 2026

---

## 🏗️ API Architecture

### Base URL
```
Development:  http://localhost:3001/api
Production:   https://api.admissions.mtu.ac.in/api
```

### Authentication
- All protected endpoints require `Authorization: Bearer {JWT_TOKEN}`
- JWT obtained from authentication endpoints
- Token expiry: 24 hours
- Refresh token valid for 30 days

### Response Format
All responses follow this structure:
```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "meta": {
    "timestamp": "2026-04-17T10:30:00Z",
    "version": "1.0"
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "status": 400,
    "code": "VALIDATION_ERROR",
    "message": "One or more fields have invalid input",
    "details": {
      "email": "Invalid email format",
      "mobile": "Mobile number already registered"
    }
  }
}
```

---

## 🔐 Authentication Endpoints

### POST `/auth/send-otp`
Send OTP to mobile number

**Request:**
```json
{
  "mobile": "9876543210"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "otpId": "otp_123456",
    "expiresIn": 600
  }
}
```

**Error Codes:**
- `INVALID_INPUT` (400) - Invalid mobile format
- `RATE_LIMIT_EXCEEDED` (429) - Too many OTP requests

---

### POST `/auth/verify-otp`
Verify OTP and create session

**Request:**
```json
{
  "mobile": "9876543210",
  "otpId": "otp_123456",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "ref_token_...",
    "user": {
      "id": "user_123",
      "mobile": "9876543210",
      "email": "user@example.com",
      "role": "candidate",
      "name": "Rahul Sharma"
    }
  }
}
```

**Error Codes:**
- `AUTH_INVALID_OTP` (400) - Wrong OTP
- `AUTH_OTP_EXPIRED` (400) - OTP expired
- `AUTH_UNAUTHORIZED` (401) - Unauthorized

---

### POST `/auth/refresh-token`
Refresh JWT token

**Request:**
```json
{
  "refreshToken": "ref_token_..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### POST `/auth/logout`
Logout user

**Request:** Empty body  
**Response (200):**
```json
{
  "success": true
}
```

---

## 👤 Candidate Profile Endpoints

### GET `/candidate/profile`
Get authenticated candidate's profile

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "Rahul Sharma",
    "mobile": "9876543210",
    "email": "rahul@example.com",
    "dob": "2005-06-15",
    "gender": "Male",
    "category": "GEN",
    "address": {
      "present": {
        "address": "123 Main St",
        "city": "Imphal",
        "state": "Manipur",
        "pincode": "795001"
      },
      "permanent": {
        "address": "123 Main St",
        "city": "Imphal",
        "state": "Manipur",
        "pincode": "795001"
      }
    },
    "createdAt": "2026-04-17T10:00:00Z"
  }
}
```

---

### PUT `/candidate/profile`
Update candidate profile

**Request:**
```json
{
  "name": "Rahul Sharma",
  "email": "newemail@example.com",
  "address": { /* address object */ }
}
```

**Response (200):**
Same as GET profile

---

## 📋 Application Endpoints

### POST `/candidate/applications`
Create new application (Draft)

**Request:**
```json
{
  "applicationType": "NonJEE",
  "personalDetails": {
    "fullName": "Rahul Sharma",
    "dob": "2005-06-15",
    "gender": "Male",
    "category": "GEN",
    "email": "rahul@example.com",
    "mobile": "9876543210"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "app_123456",
    "status": "draft",
    "createdAt": "2026-04-17T10:00:00Z"
  }
}
```

---

### GET `/candidate/applications/:id`
Get application details

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "app_123456",
    "status": "draft",
    "type": "NonJEE",
    "personalDetails": { /* all personal info */ },
    "parentDetails": { /* all parent info */ },
    "address": { /* address info */ },
    "academicDetails": { /* academic info */ },
    "jeeDetails": { /* if applicable */ },
    "coursePreferences": { /* 5 preferences */ },
    "declaration": { /* declaration */ },
    "documents": [ /* list of documents */ ],
    "submittedAt": null,
    "createdAt": "2026-04-17T10:00:00Z",
    "updatedAt": "2026-04-17T10:30:00Z"
  }
}
```

---

### PUT `/candidate/applications/:id`
Update application (before submission)

**Request:**
```json
{
  "personalDetails": { /* updated data */ },
  "academicDetails": { /* updated data */ }
}
```

**Response (200):**
Same as GET application

**Validation Rules:**
- Cannot update if status is not "draft"
- Cannot update if payment is pending
- All required fields must be valid

---

### POST `/candidate/applications/:id/submit`
Submit application (requires payment)

**Prerequisites:**
- Payment status must be "success"
- All required documents uploaded
- All required fields filled
- All validations passed

**Request:** Empty body  

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "app_123456",
    "status": "submitted",
    "submittedAt": "2026-04-17T11:00:00Z"
  }
}
```

**Error Codes:**
- `APP_INVALID_STATUS` (400) - Cannot submit in current state
- `APP_LOCKED` (400) - Application locked/already submitted
- `VALIDATION_ERROR` (422) - Validation failed

---

## 💳 Payment Endpoints

### POST `/payment/create`
Create Razorpay order

**Request:**
```json
{
  "applicationId": "app_123456",
  "amount": 2500,
  "category": "GEN"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "orderId": "order_123456",
    "razorpayOrderId": "order_9L21nIVU18L8D1",
    "amount": 250000,
    "currency": "INR",
    "notes": {
      "applicationId": "app_123456"
    }
  }
}
```

---

### POST `/payment/verify`
Verify payment signature (server-side)

**Request:**
```json
{
  "razorpayOrderId": "order_9L21nIVU18L8D1",
  "razorpayPaymentId": "pay_123456",
  "razorpaySignature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_123456",
    "status": "success",
    "amount": 250000,
    "createdAt": "2026-04-17T11:05:00Z"
  }
}
```

**Error Codes:**
- `PAYMENT_INVALID_SIGNATURE` (400) - Signature verification failed
- `PAYMENT_DUPLICATE` (409) - Payment already processed
- `PAYMENT_FAILED` (402) - Payment failed

---

### GET `/payment/:paymentId`
Get payment status

**Response (200):**
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_123456",
    "status": "success",
    "amount": 250000,
    "applicationId": "app_123456",
    "createdAt": "2026-04-17T11:05:00Z"
  }
}
```

---

## 📄 Document Endpoints

### POST `/documents/upload`
Upload document to GCS

**Request:** `multipart/form-data`
- `file`: File object
- `applicationId`: string
- `documentType`: string (e.g., "class_10_marksheet")

**Response (201):**
```json
{
  "success": true,
  "data": {
    "documentId": "doc_123456",
    "documentType": "class_10_marksheet",
    "gcsUrl": "https://storage.googleapis.com/...",
    "status": "pending",
    "uploadedAt": "2026-04-17T11:10:00Z"
  }
}
```

**Error Codes:**
- `DOC_INVALID_FORMAT` (400) - Invalid file type
- `DOC_SIZE_EXCEEDED` (413) - File too large
- `DOC_UPLOAD_FAILED` (500) - Upload error

---

### GET `/documents/:documentId/download`
Get signed URL for document

**Response (200):**
```json
{
  "success": true,
  "data": {
    "url": "https://storage.googleapis.com/...?X-Goog-Algorithm=GOOG4-RSA-SHA256&...",
    "expiresIn": 3600
  }
}
```

---

## 🧑‍💼 Admin Application Management Endpoints

### GET `/admin/applications`
List applications (with filtering)

**Query Parameters:**
- `status`: draft | submitted | under_review | approved | rejected
- `type`: JEE | NonJEE
- `category`: GEN | OBC | SC | ST | PWD | IDP
- `limit`: default 20, max 100
- `page`: pagination

**Response (200):**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "app_123456",
        "candidateName": "Rahul Sharma",
        "status": "submitted",
        "type": "NonJEE",
        "category": "GEN",
        "submittedAt": "2026-04-17T11:00:00Z",
        "createdAt": "2026-04-17T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1234
    }
  }
}
```

---

### POST `/admin/applications/:id/approve`
Approve application

**Request:**
```json
{
  "remarks": "All documents verified. Eligible for exam.",
  "examDate": "2026-05-15",
  "examTime": "10:00 AM",
  "examCenter": "Center-A, Imphal"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "app_123456",
    "status": "approved",
    "approvedAt": "2026-04-17T12:00:00Z",
    "approvedBy": "admin_user_123"
  }
}
```

---

### POST `/admin/applications/:id/reject`
Reject application

**Request:**
```json
{
  "reason": "Invalid Class XII marksheet",
  "details": "Marksheet is damaged and unreadable"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "app_123456",
    "status": "rejected",
    "rejectedAt": "2026-04-17T12:00:00Z",
    "rejectionReason": "Invalid Class XII marksheet"
  }
}
```

---

### POST `/admin/applications/:id/flag`
Flag application for clarification

**Request:**
```json
{
  "message": "Please clarify your JEE scores",
  "requiredBy": "2026-04-20"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "app_123456",
    "status": "flagged",
    "flaggedAt": "2026-04-17T12:00:00Z"
  }
}
```

---

## 🧪 Exam Endpoints

### POST `/admin/exams/schedule`
Schedule exam for a candidate

**Request:**
```json
{
  "applicationId": "app_123456",
  "date": "2026-05-15",
  "time": "10:00 AM",
  "duration": 180,
  "center": "Center-A, Imphal",
  "hallTicketNumber": "MTU2026001"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "examId": "exam_123456",
    "applicationId": "app_123456",
    "date": "2026-05-15",
    "time": "10:00 AM",
    "status": "scheduled"
  }
}
```

---

### GET `/admin/exams/:applicationId/admit-card`
Generate admit card PDF

**Response (200):**
```json
{
  "success": true,
  "data": {
    "pdfUrl": "https://storage.googleapis.com/...admit-card.pdf",
    "generatedAt": "2026-04-17T12:00:00Z"
  }
}
```

---

## 📊 Result Endpoints

### POST `/admin/results/upload`
Upload marks via CSV

**Request:** `multipart/form-data`
- `file`: CSV file with columns: candidateId, math, physics, chemistry, english

**Response (201):**
```json
{
  "success": true,
  "data": {
    "recordsProcessed": 150,
    "recordsSuccessful": 150,
    "recordsFailed": 0,
    "processingTime": "2.5s"
  }
}
```

---

### POST `/admin/results/publish`
Publish results (Registrar only)

**Request:**
```json
{
  "publicationDate": "2026-05-20",
  "message": "Results for MTU B.Tech Entrance Exam 2026 are now available."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "publishedAt": "2026-05-20T10:00:00Z",
    "resultsPublished": 1234
  }
}
```

---

### GET `/candidate/results`
Get candidate's result

**Response (200):**
```json
{
  "success": true,
  "data": {
    "resultId": "result_123456",
    "applicationId": "app_123456",
    "marks": {
      "mathematics": 25,
      "physics": 28,
      "chemistry": 18,
      "english": 19
    },
    "totalMarks": 90,
    "outOf": 100,
    "rank": 145,
    "percentile": 87.5,
    "status": "published",
    "publishedAt": "2026-05-20T10:00:00Z"
  }
}
```

---

## 📧 Notification Endpoints

### POST `/notifications/send-email`
Send email notification

**Request:**
```json
{
  "to": "candidate@example.com",
  "template": "application_submitted",
  "data": {
    "candidateName": "Rahul Sharma",
    "applicationId": "app_123456"
  }
}
```

**Response (202):**
```json
{
  "success": true,
  "data": {
    "messageId": "msg_123456",
    "status": "queued"
  }
}
```

**Available Templates:**
- `application_submitted`
- `payment_success`
- `application_approved`
- `application_rejected`
- `admit_card_ready`
- `result_published`

---

## 🔑 Admin User Management Endpoints

### POST `/admin/users`
Create admin user (Registrar only)

**Request:**
```json
{
  "mobile": "9876543211",
  "email": "admin@mtu.edu.in",
  "name": "Admin User",
  "role": "admin"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "userId": "admin_123456",
    "mobile": "9876543211",
    "role": "admin",
    "createdAt": "2026-04-17T12:00:00Z"
  }
}
```

---

### GET `/admin/users`
List admin users

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "admin_123456",
        "name": "Admin User",
        "email": "admin@mtu.edu.in",
        "role": "admin",
        "createdAt": "2026-04-17T12:00:00Z"
      }
    ]
  }
}
```

---

## 📝 Public Endpoints

### GET `/public/courses`
Get list of courses

**Response (200):**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "cse",
        "name": "Computer Science & Engineering",
        "seats": 60
      },
      // ... more courses
    ]
  }
}
```

---

### GET `/public/fee-structure`
Get fee structure

**Response (200):**
```json
{
  "success": true,
  "data": {
    "feeStructure": {
      "JEE": {
        "GEN": 100,
        "OBC": 50,
        "SC": 50,
        "ST": 50,
        "PWD": 0,
        "IDP": 0
      },
      "NonJEE": {
        "GEN": 300,
        "OBC": 200,
        "SC": 100,
        "ST": 100,
        "PWD": 100,
        "IDP": 0
      }
    }
  }
}
```

---

## 🔐 Authorization Header Format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

---

## 🧪 Testing Guide

### Using cURL

```bash
# Send OTP
curl -X POST http://localhost:3001/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210"}'

# Verify OTP
curl -X POST http://localhost:3001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210","otpId":"otp_123456","otp":"123456"}'

# Get profile (with token)
curl -X GET http://localhost:3001/api/candidate/profile \
  -H "Authorization: Bearer {token}"
```

---

## 📊 Rate Limits

| Endpoint | Limit | Window |
|---|---|---|
| `/auth/send-otp` | 3 requests | 1 hour |
| `/auth/verify-otp` | 5 attempts | 1 hour |
| `/documents/upload` | 100 requests | 1 hour |
| Other endpoints | 1000 requests | 1 hour |

---

## 🔄 Status Codes

| Code | Meaning |
|---|---|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 202 | Accepted - Request queued |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Auth required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Duplicate/Conflict |
| 413 | Payload Too Large - File too large |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

*API Specification v1.0 — Generated April 17, 2026*
