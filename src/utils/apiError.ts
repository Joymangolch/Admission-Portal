/**
 * API Error Handler Utilities
 * 
 * Provides standardized error handling for API calls
 * Matches backend error response format
 */

export interface APIError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp?: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  meta?: {
    timestamp: string;
    version: string;
  };
}

// HTTP Status Codes
export enum HTTPStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE = 422,
  RATE_LIMIT = 429,
  INTERNAL_ERROR = 500,
  SERVICE_UNAVAILABLE = 503
}

// Error Codes (backend-compatible)
export enum ErrorCode {
  // Authentication
  AUTH_INVALID_OTP = 'AUTH_INVALID_OTP',
  AUTH_OTP_EXPIRED = 'AUTH_OTP_EXPIRED',
  AUTH_SESSION_EXPIRED = 'AUTH_SESSION_EXPIRED',
  AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  REQUIRED_FIELD = 'REQUIRED_FIELD',

  // Application
  APP_NOT_FOUND = 'APP_NOT_FOUND',
  APP_ALREADY_EXISTS = 'APP_ALREADY_EXISTS',
  APP_INVALID_STATUS = 'APP_INVALID_STATUS',
  APP_LOCKED = 'APP_LOCKED',

  // Payment
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_DUPLICATE = 'PAYMENT_DUPLICATE',
  PAYMENT_INVALID_SIGNATURE = 'PAYMENT_INVALID_SIGNATURE',
  PAYMENT_TIMEOUT = 'PAYMENT_TIMEOUT',

  // Documents
  DOC_UPLOAD_FAILED = 'DOC_UPLOAD_FAILED',
  DOC_INVALID_FORMAT = 'DOC_INVALID_FORMAT',
  DOC_SIZE_EXCEEDED = 'DOC_SIZE_EXCEEDED',

  // Database
  DB_CONNECTION_ERROR = 'DB_CONNECTION_ERROR',
  DB_QUERY_ERROR = 'DB_QUERY_ERROR',

  // Server
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  NOT_FOUND = 'NOT_FOUND'
}

/**
 * Parses error response from backend
 * 
 * @param error - Error from fetch or axios
 * @returns Standardized APIError
 */
export async function parseAPIError(error: any): Promise<APIError> {
  // If it's already an APIError, return it
  if (error.status && error.code) {
    return error as APIError;
  }

  // Handle fetch Response
  if (error instanceof Response) {
    try {
      const data = await error.json();
      return {
        status: error.status,
        code: data.code || ErrorCode.INTERNAL_ERROR,
        message: data.message || getErrorMessage(error.status),
        details: data.details,
        timestamp: data.timestamp
      };
    } catch {
      return {
        status: error.status,
        code: ErrorCode.INTERNAL_ERROR,
        message: getErrorMessage(error.status)
      };
    }
  }

  // Handle network errors
  if (!navigator.onLine) {
    return {
      status: HTTPStatus.SERVICE_UNAVAILABLE,
      code: ErrorCode.SERVICE_UNAVAILABLE,
      message: 'No internet connection. Please check your network.'
    };
  }

  // Default error
  return {
    status: HTTPStatus.INTERNAL_ERROR,
    code: ErrorCode.INTERNAL_ERROR,
    message: error.message || 'An unexpected error occurred'
  };
}

/**
 * Get user-friendly error message
 * 
 * @param code - Error code or HTTP status
 * @returns User-friendly message
 */
export function getErrorMessage(code: string | number): string {
  const errorMessages: Record<string, string> = {
    // Authentication
    [ErrorCode.AUTH_INVALID_OTP]: 'Invalid OTP. Please try again.',
    [ErrorCode.AUTH_OTP_EXPIRED]: 'OTP has expired. Please request a new one.',
    [ErrorCode.AUTH_SESSION_EXPIRED]: 'Your session has expired. Please login again.',
    [ErrorCode.AUTH_UNAUTHORIZED]: 'You are not authorized to perform this action.',

    // Validation
    [ErrorCode.VALIDATION_ERROR]: 'Please check your input and try again.',
    [ErrorCode.INVALID_INPUT]: 'One or more fields have invalid input.',
    [ErrorCode.REQUIRED_FIELD]: 'All required fields must be filled.',

    // Application
    [ErrorCode.APP_NOT_FOUND]: 'Application not found.',
    [ErrorCode.APP_ALREADY_EXISTS]: 'An application already exists for this user.',
    [ErrorCode.APP_INVALID_STATUS]: 'Invalid application status.',
    [ErrorCode.APP_LOCKED]: 'This application is locked and cannot be modified.',

    // Payment
    [ErrorCode.PAYMENT_FAILED]: 'Payment failed. Please try again.',
    [ErrorCode.PAYMENT_DUPLICATE]: 'This payment has already been processed.',
    [ErrorCode.PAYMENT_INVALID_SIGNATURE]: 'Payment signature verification failed. Please contact support.',
    [ErrorCode.PAYMENT_TIMEOUT]: 'Payment processing timed out. Please try again.',

    // Documents
    [ErrorCode.DOC_UPLOAD_FAILED]: 'Document upload failed. Please try again.',
    [ErrorCode.DOC_INVALID_FORMAT]: 'Invalid document format. Allowed formats: PDF, JPG, PNG.',
    [ErrorCode.DOC_SIZE_EXCEEDED]: 'Document size exceeds maximum allowed size.',

    // Database
    [ErrorCode.DB_CONNECTION_ERROR]: 'Database connection error. Please try again later.',
    [ErrorCode.DB_QUERY_ERROR]: 'Database error occurred. Please try again later.',

    // Server
    [ErrorCode.INTERNAL_ERROR]: 'Internal server error. Please try again later.',
    [ErrorCode.SERVICE_UNAVAILABLE]: 'Service is temporarily unavailable. Please try again later.',
    [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please wait before trying again.',
    [ErrorCode.NOT_FOUND]: 'The requested resource was not found.',

    // HTTP Status Codes
    [HTTPStatus.BAD_REQUEST]: 'Invalid request. Please check your input.',
    [HTTPStatus.UNAUTHORIZED]: 'You need to login to perform this action.',
    [HTTPStatus.FORBIDDEN]: 'You do not have permission to perform this action.',
    [HTTPStatus.NOT_FOUND]: 'The requested resource was not found.',
    [HTTPStatus.CONFLICT]: 'A conflict occurred. Please try again.',
    [HTTPStatus.UNPROCESSABLE]: 'The request could not be processed.',
    [HTTPStatus.RATE_LIMIT]: 'Too many requests. Please wait before trying again.',
    [HTTPStatus.INTERNAL_ERROR]: 'Internal server error. Please try again later.',
    [HTTPStatus.SERVICE_UNAVAILABLE]: 'Service is temporarily unavailable.'
  };

  return errorMessages[code] || 'An unexpected error occurred. Please try again.';
}

/**
 * Check if error is retryable
 * 
 * @param error - APIError
 * @returns true if error is retryable
 */
export function isRetryableError(error: APIError): boolean {
  const retryableCodes = [
    ErrorCode.SERVICE_UNAVAILABLE,
    ErrorCode.RATE_LIMIT_EXCEEDED,
    ErrorCode.DB_CONNECTION_ERROR,
    ErrorCode.PAYMENT_TIMEOUT,
    HTTPStatus.SERVICE_UNAVAILABLE,
    HTTPStatus.RATE_LIMIT
  ];

  return retryableCodes.includes(error.code as any) || retryableCodes.includes(error.status);
}

/**
 * Retry logic with exponential backoff
 * 
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param delay - Initial delay in ms
 * @returns Result of successful function call
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Check if error is retryable
      if (error instanceof Response) {
        const apiError = await parseAPIError(error);
        if (!isRetryableError(apiError)) {
          throw error;
        }
      } else if (error instanceof APIError) {
        if (!isRetryableError(error)) {
          throw error;
        }
      }

      // Wait before retrying (exponential backoff)
      const waitTime = delay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

/**
 * Validate API response
 * 
 * @param response - API response
 * @returns true if response is valid
 */
export function isValidAPIResponse(response: any): response is APIResponse {
  return (
    response &&
    typeof response === 'object' &&
    'success' in response &&
    typeof response.success === 'boolean'
  );
}
