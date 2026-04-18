/**
 * Unified Response Handler for APIs
 * All endpoints should use this format
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    status: number;
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta?: {
    timestamp: string;
    version: string;
  };
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Format successful response
 */
export function successResponse<T>(data: T, meta?: any): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0',
      ...meta,
    },
  };
}

/**
 * Format error response
 */
export function errorResponse(error: ApiError | Error): ApiResponse {
  if (error instanceof ApiError) {
    return {
      success: false,
      error: {
        status: error.status,
        code: error.code,
        message: error.message,
        details: error.details,
      },
    };
  }

  // Generic error
  return {
    success: false,
    error: {
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'An unexpected error occurred',
    },
  };
}

/**
 * Common error codes
 */
export const ErrorCodes = {
  // Auth errors
  AUTH_INVALID_OTP: 'AUTH_INVALID_OTP',
  AUTH_OTP_EXPIRED: 'AUTH_OTP_EXPIRED',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',

  // Business logic errors
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INVALID_STATE: 'INVALID_STATE',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  DOCUMENT_UPLOAD_FAILED: 'DOCUMENT_UPLOAD_FAILED',

  // Generic
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};

/**
 * Common HTTP status codes
 */
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  RATE_LIMIT: 429,
  INTERNAL_ERROR: 500,
};
