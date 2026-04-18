/**
 * POST /api/admin/applications/:id/approve
 * Approve application
 */

import { NextRequest } from 'next/server';
import {
  withRoleAuth,
  parseBody,
  successHandler,
} from '@/lib/auth/middleware';
import { ApiError, HttpStatus, ErrorCodes } from '@/lib/utils/response';
import { sendEmail, EmailTemplate } from '@/lib/email/sendgrid';
import prisma from '@/lib/db/prisma';

async function handler(req: NextRequest, context: any) {
  const user = (req as any).user;
  const { id } = context.params;
  const body = await parseBody(req);

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
      status: 'APPROVED',
      approvedBy: user.id,
      approvedAt: new Date(),
      adminRemarks: body.remarks || undefined,
    },
  });

  // Send approval email
  try {
    const userEmail = application.user.email || application.user.mobile + '@temp.com';
    await sendEmail(userEmail, EmailTemplate.APPLICATION_APPROVED, {
      applicantName: application.user.name,
    });
  } catch (error) {
    console.error('Failed to send approval email:', error);
  }

  return successHandler({
    message: 'Application approved successfully',
    application: {
      id: updated.id,
      status: updated.status,
      approvedAt: updated.approvedAt,
    },
  });
}

export const POST = withRoleAuth(
  ['ADMIN', 'SYSTEM_ADMIN'],
  handler
);
