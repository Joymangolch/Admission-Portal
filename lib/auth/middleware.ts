/**
 * API Request Handler Wrapper
 * Provides unified error handling, auth verification, and response formatting
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  ApiError,
  errorResponse,
  successResponse,
  HttpStatus,
} from '@/lib/utils/response';
import { verifyFirebaseToken, extractBearerToken, canPerformAction } from '@/lib/auth/firebase';
import { FirebaseToken, validateRequiredFields } from '@/lib/utils/validation';
import prisma from '@/lib/db/prisma';

export interface AuthenticatedRequest {
  user: {
    id: string;
    firebaseUid: string;
    role: string;
  };
  body?: Record<string, any>;
}

/**
 * Handler function type
 */
export type ApiHandler = (
  req: NextRequest,
  context?: any
) => Promise<NextResponse>;

/**
 * Protected handler that requires authentication
 */
export function withAuth(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest, context?: any) => {
    try {
      // Extract and verify token
      const authHeader = req.headers.get('authorization');
      const token = extractBearerToken(authHeader || '');
      const decoded = await verifyFirebaseToken(token);

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { firebaseUid: decoded.uid || decoded.user_id || decoded.sub },
      });

      if (!user) {
        throw new ApiError(
          HttpStatus.UNAUTHORIZED,
          'AUTH_USER_NOT_FOUND',
          'User not found. Please register first.'
        );
      }

      // Attach user to request context
      (req as any).user = {
        id: user.id,
        firebaseUid: user.firebaseUid,
        role: user.role,
        mobile: user.mobile,
        email: user.email,
      };

      // Call the actual handler
      return await handler(req, context);
    } catch (error) {
      return errorHandler(error);
    }
  };
}

/**
 * Protected handler with role-based access control
 */
export function withRoleAuth(
  requiredRoles: string[],
  handler: ApiHandler
): ApiHandler {
  return withAuth(async (req: NextRequest, context?: any) => {
    try {
      const user = (req as any).user;

      if (!requiredRoles.includes(user.role)) {
        throw new ApiError(
          HttpStatus.FORBIDDEN,
          'AUTH_FORBIDDEN',
          `This action requires one of these roles: ${requiredRoles.join(', ')}`
        );
      }

      return await handler(req, context);
    } catch (error) {
      return errorHandler(error);
    }
  });
}

/**
 * Unprotected handler (no auth required)
 */
export function withoutAuth(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest, context?: any) => {
    try {
      return await handler(req, context);
    } catch (error) {
      return errorHandler(error);
    }
  };
}

/**
 * Parse request body
 */
export async function parseBody(req: NextRequest): Promise<Record<string, any>> {
  try {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      return await req.json();
    }

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const body: Record<string, any> = {};

      formData.forEach((value, key) => {
        body[key] = value;
      });

      return body;
    }

    return {};
  } catch (error) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      'INVALID_REQUEST_BODY',
      'Failed to parse request body'
    );
  }
}

/**
 * Unified error handler
 */
export function errorHandler(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return NextResponse.json(errorResponse(error), {
      status: error.status,
    });
  }

  if (error instanceof Error) {
    const apiError = new ApiError(
      HttpStatus.INTERNAL_ERROR,
      'INTERNAL_SERVER_ERROR',
      error.message
    );
    return NextResponse.json(errorResponse(apiError), {
      status: HttpStatus.INTERNAL_ERROR,
    });
  }

  return NextResponse.json(
    errorResponse(
      new ApiError(
        HttpStatus.INTERNAL_ERROR,
        'UNKNOWN_ERROR',
        'An unknown error occurred'
      )
    ),
    {
      status: HttpStatus.INTERNAL_ERROR,
    }
  );
}

/**
 * Success response helper
 */
export function successHandler<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(successResponse(data), { status });
}

/**
 * Validate required fields in request
 */
export function validateRequest(
  body: Record<string, any>,
  required: string[]
): void {
  validateRequiredFields(body, required);
}

/**
 * Check permission for action
 */
export function checkPermission(
  user: AuthenticatedRequest['user'],
  action: string
): void {
  if (!canPerformAction(user.role, action)) {
    throw new ApiError(
      HttpStatus.FORBIDDEN,
      'AUTH_FORBIDDEN',
      `You don't have permission to perform this action: ${action}`
    );
  }
}
