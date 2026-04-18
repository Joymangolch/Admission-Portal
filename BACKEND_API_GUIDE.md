# Backend API Implementation - MTU Admission Portal

## ✅ Completed Backend Infrastructure

### Core Modules
- **Auth** (`/lib/auth/`) - Firebase authentication, JWT verification, RBAC
- **Database** (`/lib/db/`) - Prisma ORM client
- **Storage** (`/lib/storage/`) - Google Cloud Storage integration
- **Payment** (`/lib/payment/`) - Razorpay payment processing
- **Email** (`/lib/email/`) - SendGrid email service
- **Utils** (`/lib/utils/`) - Response formatting, validation, error handling
- **Middleware** (`/lib/auth/middleware.ts`) - Request handling, auth verification

### API Routes Implemented (20 endpoints)

#### Authentication (4 routes)
```
POST   /api/auth/send-otp              - Send OTP to mobile
POST   /api/auth/verify-otp            - Verify OTP & create session
POST   /api/auth/refresh-token         - Refresh JWT token
POST   /api/auth/logout                - Logout user
```

#### Candidate Profile (2 routes)
```
GET    /api/candidate/profile          - Get profile
PUT    /api/candidate/profile          - Update profile
```

#### Applications (4 routes)
```
POST   /api/candidate/applications     - Create application (draft)
GET    /api/candidate/applications/:id - Get application details
PUT    /api/candidate/applications/:id - Update application
POST   /api/candidate/applications/:id/submit - Submit application
```

#### Payments (3 routes)
```
POST   /api/payment/create             - Create payment order
POST   /api/payment/verify             - Verify payment signature
GET    /api/payment/:paymentId         - Get payment status
```

#### Documents (2 routes)
```
POST   /api/documents/upload           - Upload document
GET    /api/documents/:documentId/download - Download document
```

#### Admin (5 routes)
```
GET    /api/admin/applications         - List applications
POST   /api/admin/applications/:id/approve  - Approve application
POST   /api/admin/applications/:id/reject   - Reject application
POST   /api/admin/exams/schedule       - Schedule exams
GET    /api/admin/exams/:applicationId/admit-card - Get admit card
```

#### Exams & Results (4 routes)
```
GET    /api/candidate/exams/:applicationId       - Get exam details
POST   /api/admin/results/upload                 - Upload marks
POST   /api/admin/results/publish                - Publish results
GET    /api/candidate/results/:applicationId    - Get result
```

---

## 🚀 Setup & Installation

### 1. Environment Variables

Create `.env.local` with backend configuration:

```env
# Database
DATABASE_URL=mysql://user:password@cloud-sql-instance/database

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Razorpay
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-secret

# Google Cloud Storage
GCP_PROJECT_ID=your-gcp-project
GCS_BUCKET_NAME=your-bucket-name
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# SendGrid
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@admissions.mtu.ac.in

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRY=24h
```

### 2. Install Dependencies

```bash
npm install @prisma/client
npm install firebase-admin
npm install razorpay
npm install @google-cloud/storage
npm install @sendgrid/mail
npm install jsonwebtoken
npm install zod
```

### 3. Prisma Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

---

## 📋 API Response Format

All endpoints follow this response structure:

### Success Response
```json
{
  "success": true,
  "data": {
    // Endpoint-specific data
  },
  "meta": {
    "timestamp": "2026-04-18T10:30:00Z",
    "version": "1.0"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "status": 400,
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid",
    "details": {
      "mobile": "Invalid format"
    }
  }
}
```

---

## 🔐 Authentication

All protected endpoints require:
```
Authorization: Bearer {jwt_token}
```

**Token Flow:**
1. Client sends mobile OTP request
2. Server sends OTP to mobile
3. Client submits mobile + OTP
4. Server verifies and returns JWT token
5. Client uses JWT for all protected requests

---

## 🛠️ Development Workflow

### Creating a New Endpoint

1. **Create route file** in `/app/api/...`
2. **Define handler** using middleware helpers
3. **Add validation** using validation functions
4. **Implement logic** with Prisma queries
5. **Return formatted response** using `successHandler()`

Example:
```typescript
import { withAuth, parseBody, successHandler } from '@/lib/auth/middleware';

async function handler(req: NextRequest) {
  const user = (req as any).user;
  const body = await parseBody(req);
  
  // Your logic here
  
  return successHandler({ message: 'Success' });
}

export const POST = withAuth(handler);
```

### Common Patterns

**Protected Route:**
```typescript
export const GET = withAuth(handler);
```

**Role-Based Route:**
```typescript
export const POST = withRoleAuth(['ADMIN', 'SYSTEM_ADMIN'], handler);
```

**Public Route:**
```typescript
export const POST = withoutAuth(handler);
```

---

## 🔄 Integration Checklist

- [ ] Configure Firebase Admin SDK
- [ ] Set up Cloud SQL database
- [ ] Configure Razorpay keys
- [ ] Set up GCS bucket & service account
- [ ] Configure SendGrid API key
- [ ] Test OTP flow
- [ ] Test payment verification
- [ ] Test document upload
- [ ] Test admin approval workflow
- [ ] Test result publishing

---

## 📊 Database Schema

Key entities:
- **User** - Authentication & role management
- **Profile** - Candidate personal details
- **Application** - Application status tracking
- **Document** - Uploaded documents (linked to GCS)
- **Payment** - Payment records (Razorpay integration)
- **Exam** - Exam scheduling & admit cards
- **Result** - Exam marks & ranking
- **Notification** - Email notifications (audit log)
- **AuditLog** - All system actions logged

---

## 🚨 Error Handling

Standardized error codes:
- `AUTH_UNAUTHORIZED` - No token provided
- `AUTH_TOKEN_INVALID` - Invalid/expired token
- `AUTH_FORBIDDEN` - User lacks permission
- `VALIDATION_ERROR` - Input validation failed
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Business logic conflict
- `PAYMENT_FAILED` - Payment processing error
- `INTERNAL_SERVER_ERROR` - Server error

---

## 🧪 Testing Endpoints

### OTP Flow
```bash
# 1. Send OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210"}'

# 2. Verify OTP
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210","otp":"123456"}'
```

### Application Flow
```bash
# 1. Create application
curl -X POST http://localhost:3000/api/candidate/applications \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"type":"NONJEE"}'

# 2. Update application
curl -X PUT http://localhost:3000/api/candidate/applications/{id} \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{...}'

# 3. Create payment
curl -X POST http://localhost:3000/api/payment/create \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"applicationId":"{id}","category":"GEN"}'
```

---

## 📈 Performance Optimization

- Database indexes on `userId`, `status`, `createdAt`
- Pagination for list endpoints (default: 20 items)
- GCS signed URLs with expiry (24 hours)
- Response caching for public endpoints
- Rate limiting on OTP endpoint (3 per hour per mobile)

---

## 🔗 Related Documentation

- [API Specification](../markdown-files/API_SPECIFICATION.md)
- [Database Schema](../DATABASE_SCHEMA.prisma)
- [Project Architecture](../markdown-files/ARCHITECTURE.md)

---

## 📞 Support

For issues or questions, refer to:
- Prisma Docs: https://www.prisma.io/docs
- Firebase Admin: https://firebase.google.com/docs/admin/setup
- Razorpay API: https://razorpay.com/docs/api/
- SendGrid Docs: https://docs.sendgrid.com/

---

**Last Updated:** April 18, 2026  
**Status:** ✅ Core implementation complete, integration pending
