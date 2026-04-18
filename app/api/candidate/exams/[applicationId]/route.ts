/**
 * GET /api/candidate/exams/:applicationId
 * Get exam details for candidate
 */

import { NextRequest } from 'next/server';
import { withAuth, successHandler } from '@/lib/auth/middleware';
import { ApiError, HttpStatus, ErrorCodes } from '@/lib/utils/response';
import prisma from '@/lib/db/prisma';

async function handler(req: NextRequest, context: any) {
  const user = (req as any).user;
  const { applicationId } = context.params;

  // Fetch exam
  const exam = await prisma.exam.findUnique({
    where: { applicationId },
    include: { application: true },
  });

  if (!exam) {
    throw new ApiError(
      HttpStatus.NOT_FOUND,
      ErrorCodes.NOT_FOUND,
      'Exam not scheduled yet'
    );
  }

  // Check authorization
  if (exam.application.userId !== user.id && user.role === 'CANDIDATE') {
    throw new ApiError(
      HttpStatus.FORBIDDEN,
      ErrorCodes.AUTH_FORBIDDEN,
      'You can only view your own exam details'
    );
  }

  return successHandler({
    hallTicketNumber: exam.hallTicketNumber,
    examDate: exam.examDate,
    examTime: exam.examTime,
    examDuration: exam.examDuration,
    examCenter: exam.examCenter,
    centerAddress: exam.centerAddress,
    status: exam.status,
  });
}

export const GET = withAuth(handler);
