/**
 * GET /api/admin/exams/:applicationId/admit-card
 * Get admit card details
 */

import { NextRequest } from 'next/server';
import { withRoleAuth, successHandler } from '@/lib/auth/middleware';
import { ApiError, HttpStatus, ErrorCodes } from '@/lib/utils/response';
import prisma from '@/lib/db/prisma';

async function handler(req: NextRequest, context: any) {
  const user = (req as any).user;
  const { applicationId } = context.params;

  // Fetch exam details
  const exam = await prisma.exam.findUnique({
    where: { applicationId },
    include: { application: { include: { user: true } } },
  });

  if (!exam) {
    throw new ApiError(
      HttpStatus.NOT_FOUND,
      ErrorCodes.NOT_FOUND,
      'Exam not scheduled for this application'
    );
  }

  // Format admit card data
  return successHandler({
    hallTicketNumber: exam.hallTicketNumber,
    candidateName: exam.application.user.name,
    candidateMobile: exam.application.user.mobile,
    examDate: exam.examDate,
    examTime: exam.examTime,
    examCenter: exam.examCenter,
    centerAddress: exam.centerAddress,
    applicationId: exam.applicationId,
    admitCardUrl: exam.hallTicketUrl || '/api/admin/exams/generate-pdf',
  });
}

export const GET = withRoleAuth(
  ['EXAM_OFFICER', 'ADMIN', 'SYSTEM_ADMIN'],
  handler
);
