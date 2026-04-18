/**
 * Input Validation Schemas & Functions
 */

import { ApiError, ErrorCodes, HttpStatus } from './response';

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate mobile number (Indian format)
 */
export function validateMobile(mobile: string): boolean {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile.replace(/\D/g, ''));
}

/**
 * Validate OTP (6 digits)
 */
export function validateOTP(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

/**
 * Sanitize and validate required fields
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): void {
  const missing = requiredFields.filter((field) => !data[field]);

  if (missing.length > 0) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      ErrorCodes.MISSING_REQUIRED_FIELD,
      'Missing required fields',
      { fields: missing }
    );
  }
}

/**
 * Validate application type
 */
export function validateApplicationType(type: string): boolean {
  return ['JEE', 'NONJEE', 'IDP'].includes(type.toUpperCase());
}

/**
 * Validate category
 */
export function validateCategory(category: string): boolean {
  return ['GEN', 'OBC', 'SC', 'ST', 'PWD', 'IDP'].includes(
    category.toUpperCase()
  );
}

/**
 * Validate percentage (0-100)
 */
export function validatePercentage(value: number): boolean {
  return value >= 0 && value <= 100;
}

/**
 * Validate document type
 */
export function validateDocumentType(type: string): boolean {
  const validTypes = [
    'CLASS_10_CERT',
    'CLASS_10_MARKS',
    'CLASS_12_MARKS',
    'CATEGORY_CERT',
    'JEE_SCORECARD',
    'PASSPORT_PHOTO',
    'SIGNATURE',
    'DOMICILE_CERT',
  ];
  return validTypes.includes(type.toUpperCase());
}

/**
 * Validate file size (in MB)
 */
export function validateFileSize(sizeInBytes: number, maxSizeMB: number = 10): boolean {
  return sizeInBytes <= maxSizeMB * 1024 * 1024;
}

/**
 * Validate file MIME type
 */
export function validateFileMimeType(
  mimeType: string,
  allowedTypes: string[] = []
): boolean {
  if (allowedTypes.length === 0) {
    // Default: images and PDFs
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  }
  return allowedTypes.includes(mimeType);
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

/**
 * Parse and validate JWT payload structure
 */
export interface FirebaseToken {
  iss: string;
  aud: string;
  auth_time: number;
  user_id: string;
  sub: string;
  iat: number;
  exp: number;
  firebase?: {
    sign_in_provider: string;
    identities?: Record<string, any>;
  };
}

/**
 * Extract UID from Firebase token
 */
export function extractFirebaseUID(token: FirebaseToken): string {
  return token.uid || token.user_id || token.sub;
}

/**
 * Validate user role
 */
export function validateUserRole(role: string): boolean {
  const validRoles = [
    'CANDIDATE',
    'ADMIN',
    'HOD',
    'EXAM_OFFICER',
    'REGISTRAR',
    'ACCOUNTS',
    'SYSTEM_ADMIN',
  ];
  return validRoles.includes(role.toUpperCase());
}

/**
 * Validate application status
 */
export function validateApplicationStatus(status: string): boolean {
  const validStatuses = [
    'DRAFT',
    'SUBMITTED',
    'UNDER_REVIEW',
    'APPROVED',
    'REJECTED',
    'EXAM_ELIGIBLE',
    'RESULT_PUBLISHED',
  ];
  return validStatuses.includes(status.toUpperCase());
}
