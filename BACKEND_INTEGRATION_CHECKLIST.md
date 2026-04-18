# Backend Integration Checklist

## Prerequisites Setup

### 1. Cloud SQL Database Configuration
- [ ] Create Cloud SQL MySQL instance
- [ ] Create database `mtu_admissions`
- [ ] Create admin user
- [ ] Get connection string
- [ ] Add to `DATABASE_URL` in `.env.local`

```bash
# Example connection string:
# mysql://root:password@your-instance.cloudsql.net:3306/mtu_admissions
```

### 2. Firebase Setup
- [ ] Create Firebase project in Google Cloud Console
- [ ] Enable Firebase Authentication
- [ ] Download service account JSON key
- [ ] Extract credentials for `.env.local`:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_PRIVATE_KEY`
  - `FIREBASE_CLIENT_EMAIL`

### 3. Razorpay Integration
- [ ] Create Razorpay account
- [ ] Get API Keys (Key ID & Key Secret)
- [ ] Add to `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- [ ] Test with staging environment first

### 4. Google Cloud Storage
- [ ] Create GCS bucket (`mtu-admissions-bucket`)
- [ ] Create service account with Storage admin role
- [ ] Download service account key
- [ ] Set `GCP_PROJECT_ID` and `GCS_BUCKET_NAME`
- [ ] Configure `GOOGLE_APPLICATION_CREDENTIALS`

### 5. SendGrid Email Service
- [ ] Create SendGrid account
- [ ] Generate API key
- [ ] Verify sender email (`noreply@admissions.mtu.ac.in`)
- [ ] Create email templates for:
  - [ ] OTP verification
  - [ ] Application confirmation
  - [ ] Payment success
  - [ ] Application approval
  - [ ] Application rejection
  - [ ] Exam scheduled
  - [ ] Result published

---

## Environment Variables Configuration

### Step 1: Create `.env.local` File
```bash
cp .env.example .env.local
```

### Step 2: Fill Database Variables
```env
DATABASE_URL=mysql://user:password@cloud-sql-instance/database
```

### Step 3: Fill Firebase Variables
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@project.iam.gserviceaccount.com
```

### Step 4: Fill Razorpay Variables
```env
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
```

### Step 5: Fill GCS Variables
```env
GCP_PROJECT_ID=your-gcp-project
GCS_BUCKET_NAME=mtu-admissions-bucket
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

### Step 6: Fill SendGrid Variables
```env
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@admissions.mtu.ac.in
```

### Step 7: Fill JWT Variables
```env
JWT_SECRET=your-super-secret-key
JWT_EXPIRY=24h
```

---

## Database Setup

### Step 1: Install Prisma Tools
```bash
npm install -D prisma
npm install @prisma/client
```

### Step 2: Generate Prisma Client
```bash
npx prisma generate
```

### Step 3: Run Migrations
```bash
# Create and run migrations
npx prisma migrate dev --name init
```

### Step 4: Verify Database
```bash
# Open Prisma Studio
npx prisma studio
```

---

## Testing API Endpoints

### Using cURL

#### 1. Test OTP Endpoint
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210"}'
```

#### 2. Test OTP Verification
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210","otp":"123456"}'
```

#### 3. Test Protected Route (with Token)
```bash
curl -X GET http://localhost:3000/api/candidate/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Import Postman collection from `/postman/collection.json`
2. Set base URL to `http://localhost:3000`
3. Create environment with variables:
   - `token` - JWT token from login
   - `applicationId` - Application ID
   - `paymentId` - Payment ID
4. Run test requests

---

## Integration Testing Workflows

### Workflow 1: Complete Application & Payment

1. **Send OTP**
   - Endpoint: `POST /api/auth/send-otp`
   - Body: `{ "mobile": "9876543210" }`
   - Expected: OTP received ✓

2. **Verify OTP & Get Token**
   - Endpoint: `POST /api/auth/verify-otp`
   - Body: `{ "mobile": "9876543210", "otp": "123456" }`
   - Expected: JWT token ✓

3. **Create Application**
   - Endpoint: `POST /api/candidate/applications`
   - Headers: `Authorization: Bearer {token}`
   - Body: `{ "type": "NONJEE" }`
   - Expected: Application created ✓

4. **Create Payment Order**
   - Endpoint: `POST /api/payment/create`
   - Headers: `Authorization: Bearer {token}`
   - Body: `{ "applicationId": "{id}", "category": "GEN" }`
   - Expected: Razorpay order created ✓

5. **Verify Payment**
   - Endpoint: `POST /api/payment/verify`
   - Headers: `Authorization: Bearer {token}`
   - Body: `{ "orderId": "{orderId}", "paymentId": "{paymentId}", "signature": "{signature}" }`
   - Expected: Payment marked success ✓

6. **Submit Application**
   - Endpoint: `POST /api/candidate/applications/{id}/submit`
   - Headers: `Authorization: Bearer {token}`
   - Expected: Application submitted ✓

### Workflow 2: Admin Review

1. **Admin Login** (same as candidate)
2. **List Applications**
   - Endpoint: `GET /api/admin/applications`
   - Headers: `Authorization: Bearer {admin_token}`
3. **Approve Application**
   - Endpoint: `POST /api/admin/applications/{id}/approve`
   - Headers: `Authorization: Bearer {admin_token}`
4. **Schedule Exam**
   - Endpoint: `POST /api/admin/exams/schedule`
   - Body: `{ "applicationIds": [...], "examDate": "...", ... }`

### Workflow 3: Result Publishing

1. **Upload Marks**
   - Endpoint: `POST /api/admin/results/upload`
   - Body: `{ "applicationId": "{id}", "marks": { "mathematics": 25, ... } }`

2. **Publish Results**
   - Endpoint: `POST /api/admin/results/publish`
   - Body: `{ "resultIds": [...] }`

3. **Candidate Views Result**
   - Endpoint: `GET /api/candidate/results/{applicationId}`

---

## Troubleshooting

### Firebase Integration Issues
```
Error: "Failed to initialize Firebase Admin SDK"
Solution:
1. Check SERVICE_ACCOUNT_KEY file path
2. Verify JSON format is correct
3. Check IAM permissions in GCP
```

### Razorpay Integration Issues
```
Error: "Payment signature verification failed"
Solution:
1. Verify RAZORPAY_KEY_SECRET is exact
2. Check signature calculation method
3. Test with Razorpay sandbox first
```

### GCS Upload Issues
```
Error: "Failed to upload file to storage"
Solution:
1. Check GCS bucket exists
2. Verify service account has permissions
3. Check GOOGLE_APPLICATION_CREDENTIALS path
```

### SendGrid Email Issues
```
Error: "Failed to send email"
Solution:
1. Verify SENDGRID_API_KEY is valid
2. Check sender email is verified
3. Check email templates exist
```

---

## Deployment Checklist

### Before Production Deployment
- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] Firebase credentials verified
- [ ] Razorpay in production mode
- [ ] GCS bucket secured
- [ ] SendGrid templates created
- [ ] SSL/TLS configured
- [ ] CORS settings configured
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Database backups configured
- [ ] Monitoring alerts set up

### Deployment Steps
1. Build Next.js app: `npm run build`
2. Test production build: `npm start`
3. Deploy to Cloud Run
4. Verify endpoints in production
5. Monitor logs for errors
6. Set up alerts

---

## Monitoring & Logging

### Key Metrics to Monitor
- OTP verification success rate
- Payment verification success rate
- Document upload completion
- Email delivery rate
- API response times
- Database query performance
- GCS upload/download times

### Logging Locations
- Cloud Logging: Application logs
- Prisma Logs: Database queries (dev only)
- Firebase Console: Auth events
- Razorpay Dashboard: Payment events
- SendGrid Dashboard: Email delivery

---

## Contact & Support

For issues during integration:
1. Check error message codes in `/lib/utils/response.ts`
2. Review API examples in this guide
3. Consult external service documentation
4. Check database for records
5. Review application logs

---

**Last Updated:** April 18, 2026  
**Integration Status:** Ready for Configuration
