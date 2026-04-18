/**
 * POST /api/admin/results/upload
 * Upload exam results (marks)
 */

import { NextRequest } from 'next/server';
import {
  withRoleAuth,
  parseBody,
  successHandler,
  validateRequest,
} from '@/lib/auth/middleware';
import { ApiError, HttpStatus, ErrorCodes } from '@/lib/utils/response';
import prisma from '@/lib/db/prisma';

async function handler(req: NextRequest) {
  const user = (req as any).user;
  const body = await parseBody(req);

  // Validate input
  validateRequest(body, ['applicationId', 'marks']);

  const { applicationId, marks } = body;

  // Validate marks object
  if (
    typeof marks.mathematics !== 'number' ||
    typeof marks.physics !== 'number' ||
    typeof marks.chemistry !== 'number' ||
    typeof marks.english !== 'number'
  ) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      ErrorCodes.INVALID_INPUT,
      'All marks must be provided as numbers'
    );
  }

  // Verify application exists
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    throw new ApiError(
      HttpStatus.NOT_FOUND,
      ErrorCodes.NOT_FOUND,
      'Application not found'
    );
  }

  // Calculate total and percentage
  const totalMarks =
    marks.mathematics + marks.physics + marks.chemistry + marks.english;
  const percentageMarks = (totalMarks / 100) * 100;

  // Create or update result
  const result = await prisma.result.upsert({
    where: { applicationId },
    update: {
      mathematics: marks.mathematics,
      physics: marks.physics,
      chemistry: marks.chemistry,
      english: marks.english,
      totalMarks,
      percentageMarks,
    },
    create: {
      applicationId,
      mathematics: marks.mathematics,
      physics: marks.physics,
      chemistry: marks.chemistry,
      english: marks.english,
      totalMarks,
      percentageMarks,
      status: 'DRAFT',
    },
  });

  return successHandler({
    resultId: result.id,
    totalMarks: result.totalMarks,
    percentageMarks: result.percentageMarks,
    status: result.status,
  });
}

export const POST = withRoleAuth(
  ['REGISTRAR', 'SYSTEM_ADMIN'],
  handler
);
