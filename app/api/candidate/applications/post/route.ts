/**
 * POST /api/candidate/applications
 * Create new application (Draft)
 */

import { NextRequest } from 'next/server';
import { withAuth, parseBody, successHandler, validateRequest } from '@/lib/auth/middleware';
import { validateApplicationType } from '@/lib/utils/validation';
import { ApiError, HttpStatus, ErrorCodes } from '@/lib/utils/response';
import prisma from '@/lib/db/prisma';

async function handler(req: NextRequest) {
  const user = (req as any).user;
  const body = await parseBody(req);

  // Validate input
  validateRequest(body, ['type']);
  
  if (!validateApplicationType(body.type)) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      ErrorCodes.INVALID_INPUT,
      'Invalid application type'
    );
  }

  // Check if user already has an application
  const existing = await prisma.application.findUnique({
    where: { userId: user.id },
  });

  if (existing && existing.status !== 'DRAFT') {
    throw new ApiError(
      HttpStatus.CONFLICT,
      ErrorCodes.CONFLICT,
      'You already have a submitted application'
    );
  }

  // Create new application
  const application = await prisma.application.create({
    data: {
      userId: user.id,
      type: body.type.toUpperCase(),
      status: 'DRAFT',
    },
  });

  return successHandler(
    {
      id: application.id,
      status: application.status,
      type: application.type,
      createdAt: application.createdAt,
      message: 'Application created successfully. You can now add details.',
    },
    HttpStatus.CREATED
  );
}

export const POST = withAuth(handler);
