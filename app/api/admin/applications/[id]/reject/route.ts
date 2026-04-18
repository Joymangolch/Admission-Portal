/**
 * POST /api/admin/applications/:id/reject
 * Reject application
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

async function handler(req: NextRequest, context: any) {
  const user = (req as any).user;
  const { id } = context.params;
  const body = await parseBody(req);

  // Validate reason is provided
  validateRequest(body, ['reason']);

  // Fetch application
  const application = await prisma.application.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!application) {
    throw new ApiError(
      HttpStatus.NOT_FOUND,
      ErrorCodes.NOT_FOUND,
      'Application not found'
    );
  }

  // Update application
  const updated = await prisma.application.update({
    where: { id },
    data: {
      status: 'REJECTED',
      rejectionReason: body.reason,
      rejectedAt: new Date(),
      adminRemarks: body.remarks || undefined,
    },
  });

  // Send rejection email
  try {
    const userEmail = application.user.email || application.user.mobile + '@temp.com';
    await sendEmail(userEmail, EmailTemplate.APPLICATION_REJECTED, {
      applicantName: application.user.name,
      reason: body.reason,
    });
  } catch (error) {
    console.error('Failed to send rejection email:', error);
  }

  return successHandler({
    message: 'Application rejected',
    application: {
      id: updated.id,
      status: updated.status,
      rejectedAt: updated.rejectedAt,
    },
  });
}

export const POST = withRoleAuth(
  ['ADMIN', 'SYSTEM_ADMIN'],
  handler
);
