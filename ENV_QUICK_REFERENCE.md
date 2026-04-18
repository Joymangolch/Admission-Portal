# 🚀 Environment Variables Quick Reference

**At a glance reference for setting up `.env.local`**

---

## 📋 Services Required

| Service | Purpose | Cost | Status |
|---------|---------|------|--------|
| **Cloud SQL** | Database | ~$10-30/mo | ✅ Required |
| **Firebase** | Authentication | Free tier | ✅ Required |
| **Razorpay** | Payments | 0 setup + % per txn | ✅ Required |
| **GCS** | File Storage | ~$0.02/GB | ✅ Required |
| **SendGrid** | Email | 100 free/day | ✅ Required |

---

## 🔑 Environment Variables by Service

### 1. **Database (Cloud SQL)**
```env
DATABASE_URL=mysql://user:password@host:port/database
```
- **Get from:** Google Cloud Console → Cloud SQL
- **Format:** mysql://username:password@instance-ip/database-name
- **Test:** `npx prisma db push`

### 2. **Firebase Admin SDK**
```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="...key..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@project.iam.gserviceaccount.com
```
- **Get from:** Firebase Console → Service Accounts → Generate Key
- **File:** Download JSON, extract these 3 values
- **Test:** `curl https://www.googleapis.com/oauth2/v4/token`

### 3. **Firebase Frontend Config**
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```
- **Get from:** Firebase Console → Project Settings → Your Apps
- **Copy:** Entire config object
- **Test:** OTP verification on frontend

### 4. **Razorpay**
```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=secret_key
PAYMENT_TEST_MODE=true
```
- **Get from:** Razorpay Dashboard → Settings → API Keys
- **Note:** Use `rzp_test_` for development
- **Test:** `npm run dev` → create payment order

### 5. **Google Cloud Storage**
```env
GCP_PROJECT_ID=your_gcp_project_id
GCS_BUCKET_NAME=mtu-admissions-bucket
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```
- **Get from:** GCP Console → Cloud Storage → Service Accounts
- **Steps:**
  1. Create bucket: `mtu-admissions-bucket`
  2. Create service account: `mtu-storage-admin`
  3. Grant role: `Storage Object Admin`
  4. Download JSON key
- **Test:** `gsutil ls gs://mtu-admissions-bucket/`

### 6. **SendGrid**
```env
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@admissions.mtu.ac.in
VITE_ENABLE_EMAIL=true
```
- **Get from:** SendGrid Dashboard → Settings → API Keys
- **Steps:**
  1. Create API Key: "Mail Send" access
  2. Verify sender: Settings → Sender Authentication
- **Test:** Check `/api/admin/results/publish` sends emails

### 7. **JWT Secret**
```env
JWT_SECRET=generate_random_string
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=30d
```
- **Generate:** `openssl rand -base64 32`
- **Example:** `xK8mN9pQ2rT4sU1vW3xY5zA7bC0dE2fG4hI6jK8lM0`
- **Use:** Authentication token signing

### 8. **Application Config**
```env
NODE_ENV=development
VITE_ENVIRONMENT=development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=MTU Admission Portal
VITE_APP_VERSION=1.0.0
```
- **Development:** Use `localhost`
- **Production:** Use your domain

---

## 🎯 Setup Checklist

### Phase 1: Create Accounts (20 mins)
- [ ] Google Cloud account
- [ ] Firebase project created
- [ ] Razorpay account created
- [ ] SendGrid account created

### Phase 2: Get Credentials (30 mins)
- [ ] Cloud SQL connection string → `DATABASE_URL`
- [ ] Firebase service account JSON → 3 backend variables
- [ ] Firebase frontend config → 6 VITE variables
- [ ] Razorpay API keys → 2 variables
- [ ] GCS service account JSON → 3 variables
- [ ] SendGrid API key → 2 variables
- [ ] Generate JWT secret → 1 variable

### Phase 3: Fill `.env.local` (10 mins)
- [ ] Copy 3 cloud service account files to safe location
- [ ] Fill all variables in `.env.local`
- [ ] Verify format (especially multiline strings)

### Phase 4: Test Connections (15 mins)
- [ ] Test database connection
- [ ] Test Firebase credentials
- [ ] Test GCS access
- [ ] Test SendGrid API
- [ ] Test Razorpay keys

---

## 📊 Variable Count by Service

| Service | Required | Optional | Total |
|---------|----------|----------|-------|
| Database | 1 | 2 | 3 |
| Firebase | 3 | 6 | 9 |
| Razorpay | 2 | 1 | 3 |
| GCS | 3 | 0 | 3 |
| SendGrid | 2 | 0 | 2 |
| JWT | 2 | 0 | 2 |
| App Config | 4 | 4 | 8 |
| **TOTAL** | **17** | **13** | **30** |

---

## ⚡ Priority Setup Order

**Start with these first (will unblock you):**

1. **Database** - Needed for any API testing
2. **Firebase** - Needed for OTP/auth flow
3. **JWT** - Generate immediately (no service needed)
4. **Razorpay** - Needed for payment flow testing

**Then add these:**

5. **GCS** - Needed for document uploads
6. **SendGrid** - Needed for email notifications

---

## 🔍 How to Find Each Value

### Cloud SQL Connection String
```
Google Cloud Console
  → Cloud SQL
  → Instances
  → Click your instance
  → Connection Name (use this format)
  → mysql://user:pass@/db?unix_socket=/cloudsql/connection-name
```

### Firebase Credentials
```
Firebase Console (firebase.google.com)
  → Your Project
  → ⚙️ Settings
  → Service Accounts
  → Generate New Private Key (JSON)
  → Extract: project_id, private_key, client_email
```

### Firebase Frontend Config
```
Firebase Console
  → Your Project
  → ⚙️ Settings
  → Your Apps
  → Copy entire firebaseConfig object
```

### Razorpay Keys
```
Razorpay Dashboard (dashboard.razorpay.com)
  → Settings (⚙️)
  → API Keys
  → Test Key ID & Test Key Secret
```

### GCS Bucket & Service Account
```
Google Cloud Console
  → Cloud Storage → Buckets
  → Create bucket (name: mtu-admissions-bucket)
  
Then:
Google Cloud Console
  → IAM & Admin → Service Accounts
  → Create new account (name: mtu-storage-admin)
  → Grant: Storage Object Admin
  → Create key (JSON)
```

### SendGrid API Key
```
SendGrid Dashboard (app.sendgrid.com)
  → Settings → API Keys
  → Create API Key
  → Select scope: Mail Send
  
Plus:
  → Settings → Sender Authentication
  → Verify Single Sender (add noreply@admissions.mtu.ac.in)
```

---

## 📝 Template Variables

Copy-paste these templates and fill in your values:

```env
# TEMPLATE TO FILL
DATABASE_URL=mysql://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]

FIREBASE_PROJECT_ID=[PROJECT_ID_FROM_JSON]
FIREBASE_PRIVATE_KEY="[PRIVATE_KEY_FROM_JSON]"
FIREBASE_CLIENT_EMAIL=[CLIENT_EMAIL_FROM_JSON]

RAZORPAY_KEY_ID=[TEST_KEY_ID]
RAZORPAY_KEY_SECRET=[TEST_KEY_SECRET]

GCP_PROJECT_ID=[YOUR_GCP_PROJECT]
GCS_BUCKET_NAME=mtu-admissions-bucket
GOOGLE_APPLICATION_CREDENTIALS=/path/to/gcs-key.json

SENDGRID_API_KEY=[API_KEY]
SENDGRID_FROM_EMAIL=noreply@admissions.mtu.ac.in

JWT_SECRET=[GENERATE_WITH: openssl rand -base64 32]
```

---

## ✅ Validation

### Quick Validation Commands

```bash
# Test database (after .env.local is set)
npx prisma db push

# Test Firebase
node -e "console.log(process.env.FIREBASE_PROJECT_ID)"

# Test Razorpay keys (format check)
grep "rzp_test_" .env.local

# Test GCS bucket exists
gsutil ls gs://mtu-admissions-bucket/

# Test SendGrid API
curl -H "Authorization: Bearer ${SENDGRID_API_KEY}" \
  https://api.sendgrid.com/v3/mail/settings/footer
```

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| "Database connection refused" | Check Cloud SQL IP whitelist, verify connection string |
| "Firebase auth failed" | Verify FIREBASE_PRIVATE_KEY has `\n` for newlines |
| "Payment verification failed" | Check RAZORPAY_KEY_SECRET exactly, use test keys first |
| "GCS upload failed" | Verify bucket exists, service account has Storage permissions |
| "SendGrid email not sent" | Verify sender email is verified, check API key is valid |
| "JWT token invalid" | Ensure JWT_SECRET is set, not empty |

---

## 📚 Further Reading

- Full Setup Guide: [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md)
- Backend API Guide: [BACKEND_API_GUIDE.md](BACKEND_API_GUIDE.md)
- Integration Checklist: [BACKEND_INTEGRATION_CHECKLIST.md](BACKEND_INTEGRATION_CHECKLIST.md)

---

**⏱️ Total Setup Time: ~60-90 minutes**  
**Difficulty: Easy to Medium**  
**Required Accounts: 5 (Google, Firebase, Razorpay, SendGrid, GCS)**

---

*Last Updated: April 18, 2026*
