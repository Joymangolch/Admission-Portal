# 📖 Developer Quick Reference Guide

**Date:** April 17, 2026  
**Purpose:** How to use the analysis documents and created utilities  
**Status:** Ready for Team

---

## 📚 Document Overview

### For Project Managers & Stakeholders
**Start Here:** `ACTION_PLAN.md`
- Executive summary of current state
- 4-week implementation roadmap
- Resource and cost estimates
- Risk assessment

**Then Read:** `MISSING_FEATURES_ANALYSIS.md`
- Understand what's missing
- See the priority breakdown
- Understand business impact

---

### For Backend Developers
**Start Here:** `API_SPECIFICATION.md`
- All 50+ endpoints documented
- Request/response examples
- Error codes and status codes
- cURL examples for testing

**Reference:** `DATABASE_SCHEMA.prisma`
- Copy directly to your Prisma project
- Schema includes all relationships
- Ready for migration

**Then Read:** `IMPLEMENTATION_FIXES.md` (Phase 1-2 sections)
- Detailed implementation guidance
- Step-by-step setup instructions

---

### For Frontend Developers
**Start Here:** `IMPLEMENTATION_FIXES.md`
- Frontend integration points
- Which files need updating
- Quick wins to implement
- Form validation guide

**Reference:** `src/utils/validation.ts`
- Use for form validation
- Covers all PRD requirements
- Pre-built validation functions

**Reference:** `src/utils/apiError.ts`
- Handle API errors consistently
- Retry failed requests
- User-friendly error messages

**Reference:** `src/components/ProtectedRoute.tsx`
- Protect routes by role
- Implement RBAC
- Redirect unauthorized users

**Reference:** `src/components/ErrorBoundary.tsx`
- Already integrated in App.tsx
- Catches component errors
- Prevents full app crashes

---

### For DevOps/Infrastructure
**Start Here:** `ACTION_PLAN.md` (Deployment section)
- Infrastructure checklist
- Environment progression
- Service configuration

**Reference:** `.env.example`
- Copy to `.env.local`
- Fill in actual values
- All external services configured

---

## 🛠️ How to Use the Utility Files

### 1. Form Validation

**File:** `src/utils/validation.ts`

**Usage:**
```typescript
import { 
  validatePersonalDetails, 
  validateCompleteApplication,
  ValidationResult 
} from '@/utils/validation';

// Validate personal details
const personalResult = validatePersonalDetails({
  fullName: 'Rahul Sharma',
  dob: '2005-06-15',
  email: 'rahul@example.com',
  mobile: '9876543210'
});

if (!personalResult.isValid) {
  personalResult.errors.forEach(err => {
    console.log(`${err.field}: ${err.message}`);
  });
}

// Validate complete application before submission
const appResult = validateCompleteApplication(applicationData);
if (!appResult.isValid) {
  // Show errors to user
}
```

**Available Functions:**
- `validatePersonalDetails()` - Name, DOB, gender, email, mobile
- `validateAcademicDetails()` - Board, marks, percentage, year
- `validateCoursePreferences()` - Check for duplicates
- `validateAddress()` - PIN codes, city, state validation
- `validateDeclaration()` - Checkbox confirmation
- `validateCompleteApplication()` - Full app validation

---

### 2. API Error Handling

**File:** `src/utils/apiError.ts`

**Usage:**
```typescript
import { 
  parseAPIError,
  getErrorMessage,
  isRetryableError,
  retryWithBackoff
} from '@/utils/apiError';

// Parse error from fetch response
try {
  const response = await fetch('/api/candidate/profile');
  if (!response.ok) {
    const error = await parseAPIError(response);
    console.log(error.code); // 'AUTH_UNAUTHORIZED'
    console.log(error.message); // User-friendly message
  }
} catch (error) {
  const apiError = await parseAPIError(error);
  console.log(getErrorMessage(apiError.code));
}

// Retry failed requests automatically
const profile = await retryWithBackoff(
  () => fetch('/api/candidate/profile').then(r => r.json()),
  3, // max 3 retries
  1000 // 1 second initial delay
);

// Check if error is retryable
if (isRetryableError(error)) {
  // Show retry button
} else {
  // Show permanent error message
}
```

**Error Codes Available:**
All PRD error codes are pre-defined:
- `AUTH_INVALID_OTP`
- `PAYMENT_FAILED`
- `DOC_UPLOAD_FAILED`
- And 15+ more...

---

### 3. Protected Routes

**File:** `src/components/ProtectedRoute.tsx`

**Usage:**
```typescript
import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute';

// In your routes:
<ProtectedRoute requiredRoles={['admin', 'registrar']}>
  <AdminDashboard />
</ProtectedRoute>

<AdminRoute>
  <UserManagement />
</AdminRoute>

// Candidate-only route
<ProtectedRoute requiredRoles={['candidate']}>
  <ApplicationForm />
</ProtectedRoute>
```

**Available Components:**
- `ProtectedRoute` - Auth + optional role check
- `AdminRoute` - Admin and above
- `RegistrarRoute` - Registrar only
- `PublicRoute` - Redirect authenticated users

---

### 4. Error Boundary

**File:** `src/components/ErrorBoundary.tsx`

**Already Integrated in App.tsx ✅**

The error boundary automatically:
- Catches component rendering errors
- Shows development error details in dev mode
- Shows user-friendly messages in production
- Provides retry and home navigation buttons

No additional setup needed!

---

## 🔄 Integration Workflow

### Step 1: Create API Service Layer

**File:** `src/services/api.ts` (You create this)

```typescript
import { retryWithBackoff, parseAPIError } from '@/utils/apiError';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function sendOTP(mobile: string) {
  try {
    const response = await retryWithBackoff(
      () => fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
      }).then(r => r.json()),
      3
    );
    return response;
  } catch (error) {
    throw await parseAPIError(error);
  }
}
```

---

### Step 2: Update Authentication Context

**File:** `src/context/AuthContext.tsx` (Needs update)

Replace mock auth with:
```typescript
import { sendOTP, verifyOTP } from '@/services/api';

export function AuthProvider() {
  const login = async (mobile: string, otp: string) => {
    try {
      const result = await verifyOTP(mobile, otp);
      setUser(result.user);
      localStorage.setItem('token', result.token);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };
}
```

---

### Step 3: Add Validation to Forms

**File:** `src/app/pages/candidate/ApplicationForm.tsx` (Needs update)

```typescript
import { validatePersonalDetails } from '@/utils/validation';

const handleNextStep = () => {
  const result = validatePersonalDetails(formData);
  
  if (!result.isValid) {
    result.errors.forEach(err => {
      showError(err.field, err.message);
    });
    return;
  }
  
  // Proceed to next step
  setCurrentStep(currentStep + 1);
};
```

---

### Step 4: Protect Routes

**File:** `src/app/routes.tsx` (Needs update)

```typescript
import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute requiredRoles={['candidate']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [/* ... */]
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [/* ... */]
  }
]);
```

---

## 🧪 Testing Checklist

### For Form Validation
- [ ] Test each validation function with valid data
- [ ] Test with invalid data (each field)
- [ ] Test with empty fields
- [ ] Test cross-field validation (e.g., preference duplicates)

### For API Integration
- [ ] Test OTP sending and verification
- [ ] Test application submission with validation
- [ ] Test payment flow
- [ ] Test document upload
- [ ] Test error scenarios (network down, invalid responses)

### For Route Protection
- [ ] Test authenticated user can access protected routes
- [ ] Test unauthenticated user redirected to login
- [ ] Test wrong role cannot access admin routes
- [ ] Test logout clears session

### For Error Handling
- [ ] Test all error codes display proper messages
- [ ] Test retry mechanism with transient errors
- [ ] Test error boundary catches component errors

---

## 📋 Common Patterns

### Pattern 1: API Call with Validation

```typescript
const handleSubmit = async () => {
  // 1. Validate
  const result = validateCompleteApplication(data);
  if (!result.isValid) {
    setErrors(result.errors);
    return;
  }

  // 2. Call API
  try {
    const response = await submitApplication(data);
    // 3. Handle success
    toast.success('Application submitted!');
  } catch (error) {
    // 4. Handle error
    const apiError = await parseAPIError(error);
    toast.error(getErrorMessage(apiError.code));
  }
};
```

### Pattern 2: Protected Admin Route

```typescript
<AdminRoute>
  <Card>
    <CardHeader>
      <CardTitle>Admin Only</CardTitle>
    </CardHeader>
    <CardContent>
      {/* Admin content */}
    </CardContent>
  </Card>
</AdminRoute>
```

### Pattern 3: Form Field Validation

```typescript
<Input
  value={formData.email}
  onChange={(e) => setFormData({...formData, email: e.target.value})}
  onBlur={() => {
    const result = validateEmail(formData.email);
    if (!result) setError('email', 'Invalid email');
  }}
/>
{errors.email && <p className="text-red-500">{errors.email}</p>}
```

---

## 🐛 Debugging Tips

### If Validation Not Working
1. Check if function is called with correct data structure
2. Verify error field names match your form field names
3. Check if validation thresholds match PRD requirements
4. Use `console.log()` to inspect validation result

### If API Errors Not Showing
1. Verify error response matches expected format
2. Check if error code is in `ErrorCode` enum
3. Verify `getErrorMessage()` has translation for that code
4. Check browser console for actual error response

### If Routes Not Protected
1. Verify user role is set correctly in AuthContext
2. Check if role matches `requiredRoles` array
3. Verify token is stored in localStorage
4. Check if `ProtectedRoute` is wrapping the component

---

## 📞 Troubleshooting

### Error: "User not authenticated"
→ Check if `/auth/verify-otp` API is returning valid token
→ Verify token is stored in localStorage
→ Check if AuthContext.user is properly set

### Error: "Invalid file format"
→ File type validation is in `validateFileType()`
→ Check accepted MIME types in DocumentUpload
→ Verify file upload sends correct file type

### Error: "Rate limit exceeded"
→ Check if backend has rate limiting enabled
→ Use exponential backoff: `retryWithBackoff()`
→ Show user a "wait and retry" message

---

## 🚀 Performance Tips

1. **Memoize validation results:**
   ```typescript
   const validationResult = useMemo(
     () => validateCompleteApplication(data),
     [data]
   );
   ```

2. **Debounce validation:**
   ```typescript
   const debouncedValidate = debounce(
     () => validatePersonalDetails(formData),
     500
   );
   ```

3. **Lazy load large components:**
   ```typescript
   const ApplicationForm = lazy(() => import('./ApplicationForm'));
   ```

---

## 📖 PRD References

When implementing, refer to these PRD sections:

| Document | PRD Section | Topic |
|---|---|---|
| API_SPECIFICATION.md | Section 12 | API Structure |
| DATABASE_SCHEMA.prisma | Section 11 | Database Schema |
| validation.ts | Section 4-5 | Business Rules |
| apiError.ts | Section 13 | Security/Error Codes |

---

## ✅ Before Going to Production

- [ ] All form validations working
- [ ] All API errors handled
- [ ] All routes protected with RBAC
- [ ] Error boundary catches component errors
- [ ] Environment variables set (.env.local)
- [ ] Payment processing tested in sandbox
- [ ] Email notifications tested
- [ ] Database backups configured
- [ ] Load testing passed (2000+ users)
- [ ] Security audit completed

---

## 📞 Support

**Question about:**
- **Validation?** → See `src/utils/validation.ts`
- **API Errors?** → See `src/utils/apiError.ts`
- **Routes?** → See `src/components/ProtectedRoute.tsx`
- **API Contracts?** → See `API_SPECIFICATION.md`
- **Database?** → See `DATABASE_SCHEMA.prisma`
- **What's Missing?** → See `MISSING_FEATURES_ANALYSIS.md`
- **Action Plan?** → See `ACTION_PLAN.md`

---

*Quick Reference v1.0 — April 17, 2026*
