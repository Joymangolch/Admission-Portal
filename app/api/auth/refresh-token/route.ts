/**
 * POST /api/auth/refresh-token
 * Refresh JWT token
 */

import { NextRequest } from 'next/server';
import {
  withoutAuth,
  parseBody,
  successHandler,
  validateRequest,
} from '@/lib/auth/middleware';
import { ApiError, HttpStatus, ErrorCodes } from '@/lib/utils/response';
import { createJWTToken } from '@/lib/auth/firebase';

async function handler(req: NextRequest) {
  const body = await parseBody(req);

  validateRequest(body, ['refreshToken']);

  const { refreshToken } = body;

  // In production: Validate refresh token properly
  // For now, we'll just issue a new token
  if (!refreshToken || refreshToken.trim() === '') {
    throw new ApiError(
      HttpStatus.UNAUTHORIZED,
      ErrorCodes.AUTH_TOKEN_INVALID,
      'Invalid refresh token'
    );
  }

  // In production: Extract user ID from refresh token and validate
  const newToken = createJWTToken('user_id', 24);

  return successHandler({
    token: newToken,
  });
}

export const POST = withoutAuth(handler);
