/**
 * POST /api/auth/logout
 * Logout user (invalidate tokens)
 */

import { NextRequest } from 'next/server';
import { withAuth, successHandler } from '@/lib/auth/middleware';

async function handler(req: NextRequest) {
  // In production: Invalidate token in blacklist/cache
  // For stateless JWT, logout is handled on client side

  return successHandler({
    message: 'Logged out successfully',
  });
}

export const POST = withAuth(handler);
