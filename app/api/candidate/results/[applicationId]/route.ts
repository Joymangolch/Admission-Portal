/**
 * GET /api/candidate/results/:applicationId
 * Get exam result for candidate
 */

import { NextRequest } from 'next/server';
import { withAuth, successHandler } from '@/lib/auth/middleware';
import { ApiError, HttpStatus, ErrorCodes } from '@/lib/utils/response';
import prisma from '@/lib/db/prisma';

async function handler(req: NextRequest, context: any) {
  const user = (req as any).user;
  const { applicationId } = context.params;

  // Fetch result
  const result = await prisma.result.findUnique({
    where: { applicationId },
    include: { application: true },
  });

  if (!result) {
    throw new ApiError(
      HttpStatus.NOT_FOUND,
      ErrorCodes.NOT_FOUND,
      'Result not found or not published yet'
    );
  }

  // Check authorization
  if (
    result.application.userId !== user.id &&
    user.role === 'CANDIDATE'
  ) {
    throw new ApiError(
      HttpStatus.FORBIDDEN,
      ErrorCodes.AUTH_FORBIDDEN,
      'You can only view your own result'
    );
  }

  // Only show published results to candidates
  if (result.status === 'DRAFT' && user.role === 'CANDIDATE') {
    throw new ApiError(
      HttpStatus.NOT_FOUND,
      ErrorCodes.NOT_FOUND,
      'Result not published yet'
    );
  }

  return successHandler({
    marks: {
      mathematics: result.mathematics,
      physics: result.physics,
      chemistry: result.chemistry,
      english: result.english,
    },
    totalMarks: result.totalMarks,
    percentageMarks: result.percentageMarks,
    rankInCategory: result.rankInCategory,
    status: result.selectionStatus,
    publishedAt: result.publishedAt,
  });
}

export const GET = withAuth(handler);
