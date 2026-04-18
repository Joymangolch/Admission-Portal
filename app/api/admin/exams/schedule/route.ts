/**
 * POST /api/admin/exams/schedule
 * Schedule exam for candidates
 */

import { NextRequest } from 'next/server';
import {
  withRoleAuth,
  parseBody,
  successHandler,
  validateRequest,
} from '@/lib/auth/middleware';
import { ApiError, HttpStatus, ErrorCodes } from '@/lib/utils/response';
import { sendEmail, EmailTemplate } from '@/lib/email/sendgrid';
import prisma from '@/lib/db/prisma';

async function handler(req: NextRequest) {
  const user = (req as any).user;
  const body = await parseBody(req);

  // Validate input
  validateRequest(body, [
    'applicationIds',
    'examDate',
    'examTime',
    'examCenter',
  ]);

  const {
    applicationIds,
    examDate,
    examTime,
    examCenter,
    centerAddress,
  } = body;

  if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      ErrorCodes.INVALID_INPUT,
      'applicationIds must be a non-empty array'
    );
  }

  // Create exams for all applications
  const exams = await Promise.all(
    applicationIds.map((applicationId: string) =>
      prisma.exam.create({
        data: {
          applicationId,
          examDate: new Date(examDate),
          examTime,
          examCenter,
          centerAddress: centerAddress || undefined,
          hallTicketNumber: `HT_${applicationId}_${Date.now()}`,
          status: 'SCHEDULED',
        },
      })
    )
  );

  // Send exam scheduled emails
  const applications = await prisma.application.findMany({
    where: { id: { in: applicationIds } },
    include: { user: true },
  });

  for (const app of applications) {
    try {
      const userEmail = app.user.email || app.user.mobile + '@temp.com';
      await sendEmail(userEmail, EmailTemplate.EXAM_SCHEDULED, {
        applicantName: app.user.name,
        examDate,
        examTime,
        examCenter,
      });
    } catch (error) {
      console.error(`Failed to send exam notification to ${app.user.mobile}`);
    }
  }

  return successHandler(
    {
      scheduledCount: exams.length,
      message: `Exams scheduled for ${exams.length} candidates`,
    },
    HttpStatus.CREATED
  );
}

export const POST = withRoleAuth(
  ['EXAM_OFFICER', 'SYSTEM_ADMIN'],
  handler
);
