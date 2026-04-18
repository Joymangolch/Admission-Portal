# 🔐 Environment Variables Setup Guide

Complete guide to configure `.env.local` for the MTU Admission Portal

---

## 📋 Quick Checklist

- [ ] Create Cloud SQL database instance
- [ ] Set up Firebase project
- [ ] Configure Razorpay account
- [ ] Create GCS bucket
- [ ] Set up SendGrid account
- [ ] Generate JWT secret
- [ ] Fill in all environment variables
- [ ] Test database connection
- [ ] Verify API credentials

---

## 🗄️ 1. Database Configuration

### What You Need
- MySQL database (Cloud SQL recommended)
- Database name: `mtu_admissions`
- Database user and password

### How to Set Up

#### Option A: Google Cloud SQL (Recommended)

1. **Go to Google Cloud Console**
   - Navigate to: Cloud SQL → Instances

2. **Create MySQL Instance**
   - Click "Create Instance" → Choose MySQL
   - Instance ID: `mtu-admissions-db`
   - Region: Select closest to your location
   - MySQL Version: 8.0

3. **Get Connection String**
   ```
   mysql://username:password@/database_name?unix_socket=/cloudsql/instance-connection-name
   ```

4. **Update `.env.local`**
   ```env
   DATABASE_URL=mysql://user:password@cloud-sql-instance/mtu_admissions
   ```

#### Option B: Local MySQL

```bash
# Install MySQL
brew install mysql  # macOS
apt install mysql-server  # Ubuntu

# Start MySQL
mysql -u root -p

# Create database
CREATE DATABASE mtu_admissions;
CREATE USER 'mtu_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON mtu_admissions.* TO 'mtu_user'@'localhost';
FLUSH PRIVILEGES;
```

Update `.env.local`:
```env
DATABASE_URL=mysql://mtu_user:strong_password@localhost:3306/mtu_admissions
```

---

## 🔐 2. Firebase Authentication Setup

### What You Need
- Google Cloud Project
- Firebase project
- Service account credentials

### How to Set Up

1. **Go to Google Cloud Console**
   - Create a new project or select existing

2. **Enable Firebase**
   - Search for "Firebase" in APIs
   - Enable Firebase Management API

3. **Create Firebase Project**
   - Go to Firebase Console (firebase.google.com)
   - Click "Add project"
   - Select your GCP project
   - Complete setup

4. **Get Service Account Credentials**
   - In Firebase Console: Settings (⚙️) → Service Accounts
   - Click "Generate New Private Key"
   - Save JSON file safely

5. **Extract Values from JSON**
   ```json
   {
     "type": "service_account",
     "project_id": "your_project_id",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "firebase-adminsdk-xxxxx@project.iam.gserviceaccount.com",
   }
   ```

6. **Update `.env.local`**
   ```env
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@project.iam.gserviceaccount.com
   ```

7. **Frontend Firebase Config**
   - In Firebase Console: Project Settings
   - Under "Your apps" section
   - Copy the Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef...
   ```

---

## 💳 3. Razorpay Integration

### What You Need
- Razorpay account
- API keys (test and production)

### How to Set Up

1. **Create Razorpay Account**
   - Go to razorpay.com
   - Sign up as Business

2. **Get Test Keys (Development)**
   - Dashboard → Settings → API Keys
   - Copy Test Key ID and Test Key Secret
   - These start with `rzp_test_`

3. **Update `.env.local` (Development)**
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=your_test_secret_key
   PAYMENT_TEST_MODE=true
   ```

4. **For Production (Later)**
   - In Settings: Activate Live Mode
   - Copy Live Key ID and Live Key Secret
   - These start with `rzp_live_`

### Testing Razorpay Integration

```bash
# Install Razorpay CLI (optional)
npm install razorpay

# Test webhook (optional)
# Use Razorpay Dashboard → Webhooks section
```

---

## 🗂️ 4. Google Cloud Storage Setup

### What You Need
- GCS bucket
- Service account with Storage permissions
- Service account JSON key

### How to Set Up

1. **Create GCS Bucket**
   - Go to Google Cloud Console
   - Cloud Storage → Buckets
   - Click "Create"
   - Bucket name: `mtu-admissions-bucket`
   - Region: Same as your database
   - Click Create

2. **Create Service Account**
   - IAM & Admin → Service Accounts
   - Click "Create Service Account"
   - Name: `mtu-storage-admin`
   - Grant Role: "Storage Object Admin"
   - Click Create

3. **Create and Download Key**
   - In Service Accounts list
   - Click the service account
   - Keys tab → Add Key → Create New Key
   - Format: JSON
   - Download and save the file

4. **Update `.env.local`**
   ```env
   GCP_PROJECT_ID=your_gcp_project_id
   GCS_BUCKET_NAME=mtu-admissions-bucket
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/gcs-service-account.json
   ```

5. **Security Configuration**
   - Bucket Permissions → Add Member
   - Add: `storage.objectAdmin` to service account
   - Enable versioning (recommended)

---

## 📧 5. SendGrid Email Setup

### What You Need
- SendGrid account
- API key
- Verified sender email

### How to Set Up

1. **Create SendGrid Account**
   - Go to sendgrid.com
   - Sign up for Free tier (12,000 emails/month)

2. **Create API Key**
   - Settings → API Keys
   - Click "Create API Key"
   - Name: `mtu-admissions-api`
   - Permissions: "Mail Send" full access
   - Copy the key (shown once only)

3. **Verify Sender Email**
   - Settings → Sender Authentication
   - Click "Verify a Single Sender"
   - Enter: `noreply@admissions.mtu.ac.in`
   - Verify the email (follow email confirmation)

4. **Create Email Templates** (Optional)
   - Dynamic Templates
   - Create templates for:
     - OTP Verification
     - Application Submitted
     - Payment Success
     - Application Approved
     - Application Rejected
     - Exam Scheduled
     - Result Published

5. **Update `.env.local`**
   ```env
   SENDGRID_API_KEY=SG.xxxxx_your_key_xxxxx
   SENDGRID_FROM_EMAIL=noreply@admissions.mtu.ac.in
   VITE_ENABLE_EMAIL=true
   ```

---

## 🔑 6. JWT Secret Generation

### Generate Strong JWT Secret

```bash
# Using OpenSSL (Linux/macOS)
openssl rand -base64 32

# Example output:
# xK8mN9pQ2rT4sU1vW3xY5zA7bC0dE2fG4hI6jK8lM0

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Update `.env.local`
```env
JWT_SECRET=your_generated_secret_key_here
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=30d
```

---

## 🚀 7. Complete Configuration Example

Here's a filled `.env.local` example:

```env
# Database
DATABASE_URL=mysql://mtu_user:MyStr0ng!Pass@mtu-db.c.project-id.cloudsql.net:3306/mtu_admissions

# Firebase
FIREBASE_PROJECT_ID=mtu-admissions-prod
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-a1b2c@mtu-admissions-prod.iam.gserviceaccount.com

# Razorpay
RAZORPAY_KEY_ID=rzp_test_1234567890123
RAZORPAY_KEY_SECRET=abcdef1234567890
PAYMENT_TEST_MODE=true

# GCS
GCP_PROJECT_ID=mtu-admissions-prod
GCS_BUCKET_NAME=mtu-admissions-bucket
GOOGLE_APPLICATION_CREDENTIALS=/workspaces/Admission-Portal/keys/gcs-service-account.json

# SendGrid
SENDGRID_API_KEY=SG.1234567890abcdefghijklmnop
SENDGRID_FROM_EMAIL=noreply@admissions.mtu.ac.in
VITE_ENABLE_EMAIL=true

# JWT
JWT_SECRET=xK8mN9pQ2rT4sU1vW3xY5zA7bC0dE2fG4hI6jK8lM0
JWT_EXPIRY=24h

# Application
NODE_ENV=development
VITE_ENVIRONMENT=development
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## ✅ Verification Steps

### 1. Test Database Connection
```bash
npm install -D mysql2
node -e "
  const mysql = require('mysql2');
  const conn = mysql.createConnection(process.env.DATABASE_URL);
  conn.connect((err) => {
    if (err) console.error('❌ DB Error:', err);
    else console.log('✅ Database connected!');
    conn.end();
  });
"
```

### 2. Test Firebase Credentials
```bash
npx firebase login
npx firebase projects:list
# Should show your project
```

### 3. Test GCS Bucket
```bash
gsutil ls -b gs://mtu-admissions-bucket/
# Should list bucket contents (empty initially)
```

### 4. Test SendGrid API
```bash
curl -X GET "https://api.sendgrid.com/v3/mail/settings/footer" \
  -H "Authorization: Bearer $SENDGRID_API_KEY" \
  -H "Content-Type: application/json"
# Should return 200 OK
```

### 5. Test Razorpay Keys
```bash
curl -u "RAZORPAY_KEY_ID:RAZORPAY_KEY_SECRET" \
  https://api.razorpay.com/v1/orders
# Should return 200 OK
```

---

## 🚨 Security Best Practices

### ⚠️ DO NOT
- ❌ Commit `.env.local` to Git
- ❌ Share credentials via email/chat
- ❌ Use same credentials for test and production
- ❌ Store secrets in code comments
- ❌ Push JSON key files to repository

### ✅ DO
- ✅ Use `.gitignore` (already configured)
- ✅ Use strong, random JWT secrets
- ✅ Rotate API keys periodically
- ✅ Store keys in CI/CD secrets (GitHub, GitLab)
- ✅ Enable IP whitelisting where possible
- ✅ Monitor API usage regularly
- ✅ Use service accounts (not personal keys)

---

## 🔄 Switching Between Environments

### Development
```bash
# Use test API keys
RAZORPAY_KEY_ID=rzp_test_xxxxx
PAYMENT_TEST_MODE=true
NODE_ENV=development
```

### Staging
```bash
# Use test API keys with production database
RAZORPAY_KEY_ID=rzp_test_xxxxx
NODE_ENV=staging
DATABASE_URL=mysql://user:pass@staging-db.cloudsql.net/mtu_admissions
```

### Production
```bash
# Use live API keys
RAZORPAY_KEY_ID=rzp_live_xxxxx
PAYMENT_TEST_MODE=false
NODE_ENV=production
```

---

## 📞 Troubleshooting

### "Database connection failed"
- Check `DATABASE_URL` format
- Verify database instance is running
- Check username/password
- Verify IP whitelisting on Cloud SQL

### "Firebase credentials invalid"
- Verify `FIREBASE_PRIVATE_KEY` formatting (with `\n`)
- Check service account has required permissions
- Ensure JSON was extracted correctly

### "Razorpay API error"
- Verify keys are not `rzp_live_` when `PAYMENT_TEST_MODE=true`
- Check API rate limits
- Verify IP not blocked

### "GCS upload failed"
- Check bucket exists
- Verify service account has `storage.objectAdmin` role
- Ensure `GOOGLE_APPLICATION_CREDENTIALS` path is correct
- Check file size under 10MB

### "SendGrid email not sending"
- Verify sender email is verified
- Check API key is valid
- Review SendGrid dashboard for failures
- Check recipient email is valid

---

## 📝 Notes

- `.env.local` is for development only
- For production, use platform's secret manager:
  - Heroku: Config Vars
  - Vercel/Netlify: Environment Variables
  - Cloud Run: Secret Manager
  - GitHub Actions: Secrets

- Keep `.env.local` in `.gitignore` (already configured)

---

**Last Updated:** April 18, 2026  
**Status:** Ready for Configuration
