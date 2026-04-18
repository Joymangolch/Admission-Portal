# MTU Admission Portal — Backend API Implementation Instructions

**Project Context:** MTU Admission Portal (admissions.mtu.ac.in)  
**Scope:** Backend API implementation for B.Tech admissions (JEE + Non-JEE pathways)  
**Created:** April 18, 2026  
**Last Updated:** April 18, 2026

---

## TECHNOLOGY STACK (BACKEND)

### Core Stack
- **Framework:** Next.js 14 (App Router) or Node.js + Express (as appropriate)
- **ORM:** Prisma 5.16.1
- **Database:** Google Cloud SQL (MySQL)
- **Storage:** Google Cloud Storage (GCS)
- **Authentication:** Firebase Admin SDK (server-side), Firebase Client SDK (browser)
- **Payments:** Razorpay 2.9.4
- **Async Processing:** Google Cloud Run microservices

### API Route Structure (Next.js Pattern)
```
app/api/
├── candidate/
│   ├── apply/route.ts                 (Draft & save application)
│   ├── documents/upload/route.ts      (Upload & store documents)
│   ├── submit/route.ts                (Submit application + validate payment)
│   └── profile/route.ts               (Get/update candidate profile)
├── payment/
│   ├── create/route.ts                (Create Razorpay order)
│   ├── webhook/route.ts               (Razorpay webhook handler)
│   └── verify/route.ts                (Verify payment status)
├── admin/
│   ├── applications/route.ts          (List, filter, paginate applications)
│   ├── approve/route.ts               (Approve application)
│   ├── reject/route.ts                (Reject with mandatory reason)
│   ├── exam/route.ts                  (Assign exam details)
│   └── results/route.ts               (Upload & publish results)
├── auth/
│   ├── verify-token/route.ts          (Verify Firebase JWT)
│   └── logout/route.ts                (Invalidate session)
└── middleware.ts                      (Authentication & authorization)
```

---

## IMPLEMENTATION RULES & PATTERNS

### 1. Authentication & Authorization

#### Firebase Token Verification (Server-Side)
```typescript
// ALWAYS verify Firebase tokens on all protected routes
import { getAuth } from 'firebase-admin/auth';

async function verifyToken(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  const token = authHeader.substring(7);
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    return { userId: decodedToken.uid, ok: true };
  } catch (error) {
    return { error: 'Invalid token', status: 401 };
  }
}
```

#### Role-Based Access Control (RBAC)
```typescript
// Use database role column for authorization
const user = await prisma.users.findUnique({
  where: { id: userId }
});

if (user?.role !== 'ADMIN') {
  return Response.json({ error: 'Forbidden' }, { status: 403 });
}
```

#### User-Scoped Queries (For Candidates)
```typescript
// ALWAYS filter by user_id for candidate endpoints
const application = await prisma.applications.findFirst({
  where: {
    id: applicationId,
    user_id: userId  // <-- CRITICAL for data isolation
  }
});

if (!application) {
  return Response.json({ error: 'Not found' }, { status: 404 });
}
```

### 2. Database Transactions (Atomic Operations)

#### Payment Processing Pattern
```typescript
// ALWAYS use transactions for operations that must succeed together
await prisma.$transaction(async (tx) => {
  // 1. Update payment record
  const payment = await tx.payments.update({
    where: { razorpay_order_id: orderId },
    data: {
      razorpay_payment_id: paymentId,
      status: 'CAPTURED',
      captured_at: new Date()
    }
  });

  // 2. Update application status
  await tx.applications.update({
    where: { id: payment.application_id },
    data: { status: 'SUBMITTED' }
  });

  // 3. Create audit log
  await tx.auditLogs.create({
    data: {
      user_id: userId,
      action: 'payment_captured',
      resource_type: 'payment',
      resource_id: payment.id,
      details: { amount: payment.amount_paise }
    }
  });
});
```

#### Application Submission Pattern
```typescript
// Use transaction when multiple resources must be updated atomically
await prisma.$transaction(async (tx) => {
  const app = await tx.applications.update({
    where: { id: applicationId },
    data: { status: 'SUBMITTED', submitted_at: new Date() }
  });

  // Verify all documents completed
  const pendingDocs = await tx.documents.findMany({
    where: {
      application_id: applicationId,
      processingStatus: { not: 'COMPLETED' }
    }
  });

  if (pendingDocs.length > 0) {
    throw new Error('All documents must be processed');
  }

  return app;
});
```

### 3. Payment Processing Security

#### Razorpay Signature Verification
```typescript
// ALWAYS verify signature using constant-time comparison
import crypto from 'crypto';

function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  razorpaySecret: string
): boolean {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', razorpaySecret)
    .update(body)
    .digest('hex');

  // Use constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

#### Idempotency Prevention
```typescript
// ALWAYS check if payment already processed before applying changes
const existingPayment = await prisma.payments.findUnique({
  where: { razorpay_payment_id: paymentId }
});

if (existingPayment && existingPayment.status === 'CAPTURED') {
  // Already processed, return success (idempotent)
  return Response.json({ message: 'Already processed' }, { status: 200 });
}
```

#### Fee Lookup (Dynamic by Pathway × Category)
```typescript
// ALWAYS fetch fee from fee_structures table
const feeStructure = await prisma.feeStructures.findUnique({
  where: {
    pathway_category: {
      pathway: application.pathway,
      category: application.category
    }
  }
});

if (!feeStructure) {
  return Response.json({ error: 'Fee not configured' }, { status: 400 });
}

const amountPaise = feeStructure.fee_paise;
```

### 4. Document Upload & Processing

#### Validation Before Upload
```typescript
// ALWAYS validate on server (never trust client)
const MAX_SIZES = {
  PHOTO: 500 * 1024,           // 500 KB
  SIGNATURE: 200 * 1024,        // 200 KB
  CERTIFICATE: 2 * 1024 * 1024  // 2 MB
};

const validMimeTypes = {
  PHOTO: ['image/jpeg', 'image/png'],
  SIGNATURE: ['image/jpeg', 'image/png'],
  CERTIFICATE: ['application/pdf', 'image/jpeg', 'image/png']
};

// Check file size and MIME type
if (file.size > MAX_SIZES[documentType]) {
  return Response.json({ error: 'File too large' }, { status: 400 });
}

if (!validMimeTypes[documentType].includes(file.type)) {
  return Response.json({ error: 'Invalid file type' }, { status: 400 });
}
```

#### Document Processing Workflow
```typescript
// 1. Create document record with PENDING status
const document = await prisma.documents.create({
  data: {
    id: `doc_${Date.now()}`,
    application_id: applicationId,
    documentType,
    originalPath: `gs://${bucket}/${userId}/${documentId}_original`,
    processingStatus: 'PENDING',
    uploadedAt: new Date()
  }
});

// 2. Store original file in GCS
await uploadToGCS(bucket, document.originalPath, file);

// 3. Trigger async processing (Cloud Run)
await fetch(process.env.IMAGE_PROCESSOR_SERVICE_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    documentId: document.id,
    gsPath: document.originalPath,
    outputBucket: bucket
  })
});

// 4. Return immediately (async processing)
return Response.json({
  id: document.id,
  processingStatus: 'PENDING'
}, { status: 200 });
```

#### Prevent Duplicate Documents (Unique Constraint)
```typescript
// Ensure one document per type per application
try {
  const document = await prisma.documents.create({
    data: {
      application_id: applicationId,
      documentType,
      // ... other fields
    }
  });
} catch (error) {
  if (error.code === 'P2002') { // Unique constraint violation
    // Optionally: update existing document or return error
    return Response.json(
      { error: 'Document already uploaded for this type' },
      { status: 409 }
    );
  }
  throw error;
}
```

### 5. Application Status Lifecycle

#### Valid State Transitions
```typescript
// ENFORCE state machine logic
const validTransitions = {
  'DRAFT': ['SUBMITTED'],
  'SUBMITTED': ['UNDER_REVIEW'],
  'UNDER_REVIEW': ['APPROVED', 'REJECTED'],
  'APPROVED': ['EXAM_ELIGIBLE'],
  'EXAM_ELIGIBLE': ['RESULT_PUBLISHED'],
  'RESULT_PUBLISHED': []
};

async function updateApplicationStatus(
  applicationId: string,
  newStatus: string
) {
  const app = await prisma.applications.findUnique({
    where: { id: applicationId }
  });

  if (!validTransitions[app.status]?.includes(newStatus)) {
    throw new Error(`Invalid transition: ${app.status} → ${newStatus}`);
  }

  return prisma.applications.update({
    where: { id: applicationId },
    data: { status: newStatus, updated_at: new Date() }
  });
}
```

### 6. Admin Operations & Audit Trail

#### Rejection with Mandatory Reason
```typescript
// ALWAYS require reason for rejections
async function rejectApplication(
  applicationId: string,
  reason: string,
  adminUserId: string
) {
  if (!reason || reason.trim().length < 10) {
    throw new Error('Rejection reason must be at least 10 characters');
  }

  return prisma.$transaction(async (tx) => {
    // 1. Update application
    const app = await tx.applications.update({
      where: { id: applicationId },
      data: {
        status: 'REJECTED',
        rejectionReason: reason,
        updated_at: new Date()
      }
    });

    // 2. Log audit trail
    await tx.auditLogs.create({
      data: {
        user_id: adminUserId,
        action: 'application_rejected',
        resource_type: 'application',
        resource_id: applicationId,
        details: { reason }
      }
    });

    return app;
  });
}
```

#### List Applications with Filtering & Pagination
```typescript
// ALWAYS paginate for performance
async function listApplications(
  status?: string,
  page: number = 1,
  pageSize: number = 20
) {
  const skip = (page - 1) * pageSize;

  const [applications, total] = await Promise.all([
    prisma.applications.findMany({
      where: status ? { status } : {},
      include: {
        profile: true,
        documents: true,
        payments: true
      },
      skip,
      take: pageSize,
      orderBy: { created_at: 'desc' }
    }),
    prisma.applications.count({
      where: status ? { status } : {}
    })
  ]);

  return {
    applications,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  };
}
```

### 7. Error Handling & Responses

#### Consistent Response Format
```typescript
// ALWAYS return consistent response structure
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Success response
return Response.json({
  success: true,
  data: application,
  message: 'Application submitted successfully'
}, { status: 200 });

// Error response
return Response.json({
  success: false,
  error: 'Invalid payment status'
}, { status: 400 });
```

#### Input Validation with Zod
```typescript
// ALWAYS validate input with Zod before processing
import { z } from 'zod';

const submitApplicationSchema = z.object({
  applicationId: z.string().min(1, 'Application ID required'),
  paymentId: z.string().min(1, 'Payment ID required')
});

const validated = submitApplicationSchema.safeParse(body);
if (!validated.success) {
  return Response.json({
    success: false,
    error: validated.error.errors
  }, { status: 400 });
}
```

#### Logging for Debugging
```typescript
// Log important events for debugging and monitoring
console.log('[PAYMENT_WEBHOOK]', {
  timestamp: new Date().toISOString(),
  razorpayOrderId: orderId,
  status: 'captured',
  amount: amountPaise,
  userId
});

// Log errors with context
console.error('[ERROR]', {
  timestamp: new Date().toISOString(),
  endpoint: '/api/candidate/submit',
  error: error.message,
  userId,
  applicationId
});
```

---

## API ENDPOINTS CHECKLIST

### Candidate Endpoints
- [ ] `POST /api/candidate/apply` — Create/update application draft with auto-save
- [ ] `POST /api/candidate/documents/upload` — Upload document with validation
- [ ] `POST /api/candidate/submit` — Submit application (payment + documents required)
- [ ] `GET /api/candidate/profile` — Get candidate profile
- [ ] `GET /api/candidate/application/:id` — Get application details (read-only after submit)

### Payment Endpoints
- [ ] `POST /api/payment/create` — Create Razorpay order
- [ ] `POST /api/payment/webhook` — Razorpay webhook handler (HMAC verified)
- [ ] `GET /api/payment/status/:applicationId` — Check payment status

### Admin Endpoints
- [ ] `GET /api/admin/applications` — List applications (paginated, filterable)
- [ ] `POST /api/admin/approve/:applicationId` — Approve application
- [ ] `POST /api/admin/reject/:applicationId` — Reject with mandatory reason
- [ ] `POST /api/admin/exam/assign` — Assign exam details to application
- [ ] `POST /api/admin/results/upload` — Upload result marks
- [ ] `GET /api/admin/audit-logs` — View audit trail

### Exam Endpoints (Day 5)
- [ ] `GET /api/exam/admit-card/:applicationId` — Download admit card PDF
- [ ] `POST /api/exam/schedule` — Schedule exam (admin only)

### Results Endpoints (Day 6)
- [ ] `GET /api/results/publish/:applicationId` — Publish result
- [ ] `GET /api/results/merit-list` — Get merit list (ranking)

---

## DATABASE QUERY PATTERNS

### Common Patterns (Copy-Paste Ready)

#### Find Application by ID (User-Scoped)
```typescript
const application = await prisma.applications.findFirst({
  where: {
    id: applicationId,
    user_id: userId  // Ensure data isolation
  },
  include: {
    profile: true,
    documents: true,
    payments: true
  }
});
```

#### Find All Documents for Application
```typescript
const documents = await prisma.documents.findMany({
  where: { application_id: applicationId },
  orderBy: { uploadedAt: 'desc' }
});
```

#### Check Payment Status
```typescript
const payment = await prisma.payments.findUnique({
  where: { application_id: applicationId }
});

if (payment?.status !== 'CAPTURED') {
  throw new Error('Payment not completed');
}
```

#### Create Audit Log
```typescript
await prisma.auditLogs.create({
  data: {
    user_id: adminUserId,
    action: 'application_approved',
    resource_type: 'application',
    resource_id: applicationId,
    details: {
      previousStatus: 'UNDER_REVIEW',
      newStatus: 'APPROVED',
      approvedAt: new Date()
    }
  }
});
```

---

## SECURITY CHECKLIST

- [ ] All protected routes verify Firebase token
- [ ] Candidate endpoints filter by `user_id`
- [ ] Admin endpoints check `role === 'ADMIN'`
- [ ] Razorpay webhooks verify HMAC-SHA256 signature
- [ ] Input validation with Zod on all requests
- [ ] Database transactions for atomic updates
- [ ] No sensitive data in response (filter secrets)
- [ ] Audit trail for all admin actions
- [ ] Error messages don't leak implementation details
- [ ] GCS signed URLs expire after 1 hour
- [ ] Payment idempotency check on webhook
- [ ] Rate limiting on OTP endpoints (3 per hour)

---

## TESTING PATTERNS

### Unit Tests
```typescript
// Test fee lookup
test('fee_structures: fetch by pathway and category', async () => {
  const fee = await prisma.feeStructures.findUnique({
    where: {
      pathway_category: {
        pathway: 'JEE',
        category: 'GEN'
      }
    }
  });
  expect(fee.fee_paise).toBe(10000); // ₹100
});

// Test signature verification
test('razorpay signature verification', () => {
  const result = verifyRazorpaySignature(
    'order_123',
    'pay_456',
    'valid_signature_hex',
    process.env.RAZORPAY_KEY_SECRET
  );
  expect(result).toBe(true);
});
```

### Integration Tests
```typescript
// Test full payment flow
test('payment flow: create order → webhook → update app', async () => {
  // 1. Create application
  const app = await createApplicationDraft(userId);

  // 2. Create payment order
  const order = await createRazorpayOrder(app.id);
  expect(order.status).toBe('created');

  // 3. Simulate webhook
  await handlePaymentWebhook({
    razorpay_order_id: order.razorpayOrderId,
    razorpay_payment_id: 'pay_xxx',
    status: 'captured'
  });

  // 4. Verify application transitioned to SUBMITTED
  const updated = await prisma.applications.findUnique({
    where: { id: app.id }
  });
  expect(updated.status).toBe('SUBMITTED');
});
```

---

## COMMON PITFALLS TO AVOID

| Issue | Solution |
|-------|----------|
| Forgot to verify Firebase token | Add token verification to every protected route |
| Hardcoded user check missing | Always filter by `user_id` in candidate endpoints |
| Payment webhook processed multiple times | Check `razorpay_payment_id` before updating |
| Signature verification using == instead of timingSafeEqual | Always use `crypto.timingSafeEqual()` |
| Documents remain PENDING forever | Add timeout logic in Image Processor + retry |
| Application not transitioned after payment | Use transactions to ensure atomicity |
| Fee fetched from wrong table | Always query fee_structures by pathway+category |
| No audit trail for admin actions | Create audit_logs entry for every admin operation |
| Admin can see other candidates' data | Filter all queries by `user_id` for candidates |
| Error messages expose secrets | Never return DB errors; use generic messages |

---

## ENVIRONMENT VARIABLES REQUIRED

```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# Firebase Client SDK (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# Database
DATABASE_URL=mysql://user:pass@host:3306/db

# Google Cloud
GCP_PROJECT_ID=
GOOGLE_CLOUD_STORAGE_BUCKET=
GOOGLE_CLOUD_STORAGE_KEY_JSON=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Cloud Run
IMAGE_PROCESSOR_SERVICE_URL=

# App
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## QUICK REFERENCE

### Essential Imports
```typescript
import { prisma } from '@/lib/db/client';
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { z } from 'zod';
import crypto from 'crypto';
```

### Verify Token (Copy-Paste)
```typescript
async function verifyAndGetUserId(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }

  try {
    const token = authHeader.substring(7);
    const decoded = await getAuth().verifyIdToken(token);
    return { userId: decoded.uid };
  } catch {
    return { error: 'Invalid token', status: 401 };
  }
}
```

### Respond Consistently (Copy-Paste)
```typescript
// Success
return NextResponse.json({ success: true, data }, { status: 200 });

// Error
return NextResponse.json({ success: false, error: 'Message' }, { status: 400 });
```

---

## WHAT THIS DOES NOT COVER

- **Frontend integration** — Only backend APIs
- **Deployment scripts** — See GCP_FIREBASE_SETUP.md
- **Email templates** — SendGrid integration (Day 6)
- **Admit card LaTeX generation** — Cloud Run service (Day 5)
- **Merit list algorithm** — Ranking calculation (Day 6)
- **Load testing** — See DAY7_SUMMARY.md

---

## REFERENCE DOCUMENTS

| Document | Purpose |
|----------|---------|
| `project-continuation.md` | Full project context & business rules |
| `DATABASE_SCHEMA.prisma` | Prisma schema (tables, relationships) |
| `DEVELOPMENT.md` | Local dev setup |
| `GCP_FIREBASE_SETUP.md` | Cloud infrastructure |

---

**Last Updated:** April 18, 2026  
**Scope:** Backend API implementation guidelines (Days 4–7)  
**Maintainer:** GitHub Copilot  
