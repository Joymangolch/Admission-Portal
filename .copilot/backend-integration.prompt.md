# Backend API Integration with Google Cloud — Prompt Template

**Purpose:** Guide implementation of backend APIs with Firebase authentication, Cloud SQL, Cloud Storage, and Razorpay integration.  
**Target:** Next.js 14 App Router with Prisma ORM  
**Created:** April 18, 2026

---

## TASK DESCRIPTION

You are integrating a backend API for the MTU Admission Portal with the following Google Cloud services:

1. **Firebase** — Authentication (OTP + JWT)
2. **Google Cloud SQL** — Relational database (MySQL)
3. **Google Cloud Storage (GCS)** — Document and image storage
4. **Razorpay** — Payment processing
5. **Cloud Run** — Async microservices (image processing)

**Constraints:**
- Only modify backend code (API routes in `/app/api`)
- Do not modify existing frontend code in `/src`
- Follow the patterns in `.copilot/instructions.md`
- Use Prisma for all database operations
- Implement proper authentication and authorization

---

## INPUT PARAMETERS

When using this prompt, provide or verify these inputs:

```
Backend Task: {TASK_TYPE}
Service: {SERVICE_NAME}
API Endpoint: {ENDPOINT_PATH}
Operation: {CREATE|READ|UPDATE|DELETE|WEBHOOK}
User Role: {CANDIDATE|ADMIN|PUBLIC}
Data Validation: {ZOD_SCHEMA_NAME}
Dependencies: {LIST_OF_RELATED_ENDPOINTS}
```

**Example:**
```
Backend Task: Payment Processing
Service: Razorpay
API Endpoint: /api/payment/webhook
Operation: WEBHOOK
User Role: PUBLIC (webhook)
Data Validation: paymentWebhookSchema
Dependencies: [/api/candidate/submit, /api/payment/create]
```

---

## CORE WORKFLOW

### Phase 1: Setup & Authentication

```
Step 1: Initialize Firebase Admin SDK
  └─ Create lib/auth/auth-server.ts
     ├─ Initialize getAuth()
     ├─ Export verifyIdToken() function
     └─ Handle token errors gracefully

Step 2: Set Up Environment Variables
  └─ .env.local should contain:
     ├─ FIREBASE_PROJECT_ID
     ├─ FIREBASE_PRIVATE_KEY
     ├─ FIREBASE_CLIENT_EMAIL
     ├─ DATABASE_URL
     ├─ GOOGLE_CLOUD_STORAGE_BUCKET
     ├─ RAZORPAY_KEY_ID
     ├─ RAZORPAY_KEY_SECRET
     └─ IMAGE_PROCESSOR_SERVICE_URL

Step 3: Configure Prisma Client
  └─ lib/db/client.ts should export singleton
     ├─ Use PrismaClient with NODE_ENV check
     ├─ Handle connection pooling for Cloud SQL
     └─ Export as `export const prisma = ...`

Step 4: Create Authentication Middleware
  └─ lib/auth/middleware.ts
     ├─ Parse Authorization header
     ├─ Verify Firebase token
     ├─ Return userId or error
     └─ Use in all protected routes
```

### Phase 2: API Route Implementation

```
Step 1: For Each Endpoint
  ├─ Create route.ts file
  ├─ Add TypeScript types
  ├─ Validate input with Zod
  ├─ Verify Firebase token (if protected)
  ├─ Filter by user_id (if candidate endpoint)
  ├─ Execute database operation (Prisma)
  ├─ Create audit log (if admin action)
  ├─ Return consistent response
  └─ Handle errors with logging

Step 2: For Database Operations
  ├─ Use Prisma ORM (never raw SQL)
  ├─ Wrap atomic operations in transactions
  ├─ Check unique constraints (documents, payments)
  ├─ Include relations (profile, documents, payments)
  └─ Use pagination for list endpoints

Step 3: For Document Operations
  ├─ Validate file on server
  ├─ Upload to GCS
  ├─ Create document record (PENDING status)
  ├─ Trigger async processing via Cloud Run
  └─ Return immediately (don't wait for processing)

Step 4: For Payment Operations
  ├─ Create Razorpay order via API
  ├─ Save payment record with status CREATED
  ├─ Return order ID to client
  └─ Handle webhook verification with HMAC-SHA256
```

### Phase 3: Security & Validation

```
Step 1: Authentication
  ├─ Verify Firebase token on protected routes
  ├─ Use constant-time comparison for signatures
  ├─ Store user_id for audit logging
  └─ Never trust client-side user claims

Step 2: Authorization
  ├─ Check user_id for candidate endpoints
  ├─ Check role === 'ADMIN' for admin endpoints
  ├─ Enforce immutability after submission
  └─ Log all admin actions to audit_logs

Step 3: Input Validation
  ├─ Use Zod schemas for all inputs
  ├─ Validate file types and sizes on server
  ├─ Sanitize strings (no SQL injection)
  ├─ Check enum values against database
  └─ Return validation errors with field names

Step 4: Data Protection
  ├─ Filter all responses (remove secrets)
  ├─ Use GCS signed URLs (1-hour expiry)
  ├─ Never expose database errors
  ├─ Check Razorpay signature on every webhook
  └─ Use idempotency keys for duplicate prevention
```

### Phase 4: Error Handling & Logging

```
Step 1: Consistent Error Response
  ├─ Return { success: false, error: 'message' }
  ├─ Include HTTP status code
  ├─ Never expose stack traces
  ├─ Log full error internally with context
  └─ Use generic messages for client

Step 2: Logging Points
  ├─ Log on successful endpoint execution
  ├─ Log all errors with timestamp and user_id
  ├─ Log payment operations (create, webhook, verification)
  ├─ Log admin actions (approve, reject, assign exam)
  ├─ Log document processing (upload, complete, fail)
  └─ Use structured JSON format for parsing

Step 3: Database Transactions
  ├─ Wrap multi-step operations in transactions
  ├─ Ensure atomicity (all or nothing)
  ├─ Rollback on error automatically
  └─ Example: payment → application status → audit log
```

---

## SERVICE INTEGRATION DETAILS

### Firebase Integration

**Verification Flow:**
```typescript
// Client sends Bearer token
Authorization: Bearer {idToken}

// Server verifies
const decodedToken = await getAuth().verifyIdToken(token);
const userId = decodedToken.uid;

// Store in database (users table)
const user = await prisma.users.findUnique({
  where: { id: userId }
});
```

**When to Use:**
- Candidate login (OTP verification done on client)
- Admin login (same flow, check role in database)
- All protected endpoints (verify token first)

---

### Google Cloud SQL Integration

**Connection Setup:**
```typescript
// .env.local
DATABASE_URL=mysql://user:password@host:3306/db_name

// lib/db/client.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export { prisma };
```

**Common Queries:**
```typescript
// Find with relations
const app = await prisma.applications.findUnique({
  where: { id: applicationId },
  include: {
    profile: true,
    documents: true,
    payments: true
  }
});

// Update with transaction
await prisma.$transaction(async (tx) => {
  await tx.payments.update(...);
  await tx.applications.update(...);
  await tx.auditLogs.create(...);
});

// Paginated list
const apps = await prisma.applications.findMany({
  where: { status: 'SUBMITTED' },
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { created_at: 'desc' }
});
```

**When to Use:**
- Candidate application data (CRUD operations)
- Payment records (create, update on webhook)
- Document tracking (upload, processing status)
- Audit logs (all admin actions)
- Fee structure lookup (dynamic by pathway + category)

---

### Google Cloud Storage Integration

**Setup:**
```typescript
// .env.local
GOOGLE_CLOUD_STORAGE_BUCKET=mtu-admissions-dev-documents
GOOGLE_CLOUD_STORAGE_KEY_JSON={"type":"service_account",...}

// lib/storage/gcs.ts
import { Storage } from '@google-cloud/storage';
const storage = new Storage({ projectId: process.env.GCP_PROJECT_ID });
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);
```

**Upload Flow:**
```typescript
// 1. Receive file from client
const file = await req.json().then(b => b.file);

// 2. Validate on server
if (file.size > MAX_SIZE || !VALID_TYPES.includes(file.type)) {
  return Response.json({ error: 'Invalid' }, { status: 400 });
}

// 3. Upload to GCS
const gcsFile = bucket.file(`${userId}/${documentId}_original`);
await gcsFile.save(Buffer.from(file.data));

// 4. Create database record
const doc = await prisma.documents.create({
  data: {
    application_id: applicationId,
    documentType,
    originalPath: gcsFile.name,
    processingStatus: 'PENDING'
  }
});

// 5. Trigger async processing
await fetch(process.env.IMAGE_PROCESSOR_SERVICE_URL, {
  method: 'POST',
  body: JSON.stringify({
    documentId: doc.id,
    gsPath: doc.originalPath
  })
});

// 6. Return immediately
return Response.json({ id: doc.id, status: 'PENDING' });
```

**Signed URL Generation (for downloads):**
```typescript
const [url] = await bucket.file(filePath).getSignedUrl({
  version: 'v4',
  action: 'read',
  expires: Date.now() + 1 * 60 * 60 * 1000 // 1 hour
});
```

**When to Use:**
- Store original uploaded documents
- Store processed images (from Image Processor)
- Store admit card PDFs
- Store result documents
- Never store sensitive data (passwords, tokens)

---

### Razorpay Integration

**Order Creation:**
```typescript
// 1. Fetch fee structure
const fee = await prisma.feeStructures.findUnique({
  where: {
    pathway_category: {
      pathway: 'JEE',
      category: 'GEN'
    }
  }
});

// 2. Create Razorpay order
const order = await razorpay.orders.create({
  amount: fee.fee_paise, // in paise
  currency: 'INR',
  receipt: `app_${applicationId}`
});

// 3. Save order in database
await prisma.payments.create({
  data: {
    application_id: applicationId,
    razorpay_order_id: order.id,
    amount_paise: order.amount,
    status: 'CREATED'
  }
});

// 4. Return order details to client
return Response.json({
  orderId: order.id,
  amount: order.amount,
  key: process.env.RAZORPAY_KEY_ID
});
```

**Webhook Verification:**
```typescript
// Receive webhook from Razorpay
const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

// Verify signature
const body = `${razorpay_order_id}|${razorpay_payment_id}`;
const expectedSig = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  .update(body)
  .digest('hex');

// Use constant-time comparison
const isValid = crypto.timingSafeEqual(
  Buffer.from(razorpay_signature),
  Buffer.from(expectedSig)
);

if (!isValid) {
  return Response.json({ error: 'Invalid signature' }, { status: 400 });
}

// Check idempotency (prevent duplicate processing)
const existing = await prisma.payments.findUnique({
  where: { razorpay_payment_id }
});

if (existing?.status === 'CAPTURED') {
  return Response.json({ message: 'Already processed' }, { status: 200 });
}

// Update payment and application atomically
await prisma.$transaction(async (tx) => {
  await tx.payments.update({
    where: { razorpay_order_id },
    data: {
      razorpay_payment_id,
      status: 'CAPTURED',
      captured_at: new Date()
    }
  });

  await tx.applications.update({
    where: { id: payment.application_id },
    data: { status: 'SUBMITTED' }
  });

  await tx.auditLogs.create({
    data: {
      user_id: applicationUserId,
      action: 'payment_captured',
      resource_type: 'payment',
      resource_id: payment.id,
      details: { amount: payment.amount_paise }
    }
  });
});

return Response.json({ status: 'ok' }, { status: 200 });
```

**When to Use:**
- Collect application fees
- Verify payment before submission
- Track payment lifecycle
- Generate receipts (future enhancement)

---

### Cloud Run Integration

**Image Processor Microservice:**
```
Purpose: Async image processing (resize, compress, validate)
Trigger: HTTP POST from /api/candidate/documents/upload
Input: { documentId, gsPath, outputBucket }
Output: Update document.processingStatus to COMPLETED or FAILED

// Invoke from API
await fetch(process.env.IMAGE_PROCESSOR_SERVICE_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    documentId: doc.id,
    gsPath: doc.originalPath,
    outputBucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET
  })
});
```

**When to Use:**
- Process large files asynchronously
- Avoid blocking the API request
- Handle failures gracefully (retry logic)
- Update database status after completion

---

## RESPONSE FORMAT

All API responses should follow this structure:

```typescript
// Success (200)
{
  "success": true,
  "data": { /* resource data */ },
  "message": "Operation successful"
}

// Error (4xx/5xx)
{
  "success": false,
  "error": "Descriptive error message",
  "code": "ERROR_CODE" // optional
}

// Paginated List (200)
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## VALIDATION SCHEMAS (Zod)

Create validation schemas in `lib/validations/` for each endpoint:

```typescript
// lib/validations/application.ts
import { z } from 'zod';

export const submitApplicationSchema = z.object({
  applicationId: z.string().min(1),
  paymentId: z.string().min(1)
});

export const rejectApplicationSchema = z.object({
  applicationId: z.string().min(1),
  reason: z.string().min(10).max(500)
});

export const assignExamSchema = z.object({
  applicationId: z.string().min(1),
  examDate: z.string().datetime(),
  examTime: z.string().regex(/^\d{2}:\d{2}$/),
  centerLocation: z.string().min(1)
});
```

**Usage in Routes:**
```typescript
const validated = submitApplicationSchema.safeParse(body);
if (!validated.success) {
  return Response.json({ error: validated.error.errors }, { status: 400 });
}
```

---

## AUDIT LOGGING

Log all admin actions automatically:

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
      timestamp: new Date()
    }
  }
});
```

**Loggable Actions:**
- `application_submitted`
- `application_approved`
- `application_rejected`
- `exam_assigned`
- `results_published`
- `payment_captured`
- `document_uploaded`
- `document_processing_failed`

---

## TESTING CHECKLIST

Before deployment, verify:

- [ ] Firebase token verification works (valid and expired tokens)
- [ ] Database connection established (test query executes)
- [ ] GCS bucket accessible (test upload and download)
- [ ] Razorpay credentials valid (test order creation)
- [ ] Cloud Run microservice reachable (test HTTP call)
- [ ] All environment variables set in `.env.local`
- [ ] Prisma migrations applied (`npx prisma db push`)
- [ ] CORS enabled if APIs accessed from different domain
- [ ] Error handling returns proper status codes
- [ ] Audit logs created for admin actions

---

## COMMON IMPLEMENTATION PATTERNS

### Pattern 1: Protected Endpoint (Candidate)
```typescript
export async function POST(req: NextRequest) {
  // 1. Verify token
  const auth = req.headers.get('authorization');
  const token = auth?.substring(7);
  const decoded = await getAuth().verifyIdToken(token);
  const userId = decoded.uid;

  // 2. Validate input
  const body = await req.json();
  const validated = mySchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json({ error: validated.error.errors }, { status: 400 });
  }

  // 3. Query with user_id filter
  const data = await prisma.myTable.findUnique({
    where: { id: validated.data.id, user_id: userId }
  });

  // 4. Return response
  return NextResponse.json({ success: true, data });
}
```

### Pattern 2: Admin Endpoint
```typescript
export async function POST(req: NextRequest) {
  // 1. Verify token
  const decoded = await getAuth().verifyIdToken(token);
  const userId = decoded.uid;

  // 2. Check admin role
  const user = await prisma.users.findUnique({ where: { id: userId } });
  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 3. Execute admin action
  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.applications.update(...);
    await tx.auditLogs.create({
      data: { user_id: userId, action: '...', resource_id: updated.id, ... }
    });
    return updated;
  });

  return NextResponse.json({ success: true, data: result });
}
```

### Pattern 3: Webhook (Public)
```typescript
export async function POST(req: NextRequest) {
  // 1. Parse body
  const body = await req.json();

  // 2. Verify signature (specific to each service)
  const isValid = verifySignature(body, req.headers.get('x-signature'));
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  }

  // 3. Check idempotency
  const existing = await prisma.myTable.findUnique({
    where: { externalId: body.id }
  });
  if (existing?.processed) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // 4. Process atomically
  await prisma.$transaction(async (tx) => {
    await tx.myTable.update(...);
    await tx.otherTable.update(...);
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
```

---

## WHEN TO ASK FOR CLARIFICATION

Before implementing, ask about:

1. **Endpoint Scope** — Is this public (no auth), candidate-only, or admin-only?
2. **Data Isolation** — Should candidates see only their data?
3. **Validation Rules** — Are there business rules (e.g., immutable after submission)?
4. **Audit Requirements** — Should this action be logged?
5. **Error Handling** — What should happen on failure?
6. **Performance** — Needs pagination/caching?
7. **Related Operations** — What other tables are affected?

---

## REFERENCE LINKS

- **Project Context:** [project-continuation.md](project-continuation.md)
- **Database Schema:** [DATABASE_SCHEMA.prisma](DATABASE_SCHEMA.prisma)
- **Implementation Guide:** [.copilot/instructions.md](.copilot/instructions.md)
- **API Specification:** (Day 5 deliverable)

---

**Last Updated:** April 18, 2026  
**Scope:** Backend API integration with Google Cloud services  
**Target Audience:** Backend developers, API engineers  
