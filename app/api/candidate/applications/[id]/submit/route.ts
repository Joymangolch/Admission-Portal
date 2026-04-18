/**
 * POST /api/candidate/applications/:id/submit
 * Submit application (requires payment)
 */

import { NextRequest } from 'next/server';
import { withAuth, successHandler, validateRequest } from '@/lib/auth/middleware';
import { ApiError, HttpStatus, ErrorCodes } from '@/lib/utils/response';
import { sendEmail, EmailTemplate } from '@/lib/email/sendgrid';
import prisma from '@/lib/db/prisma';

async function handler(req: NextRequest, context: any) {
  const user = (req as any).user;
  const { id } = context.params;

  // Fetch application with payment
  const application = await prisma.application.findUnique({
    where: { id },
    include: { payment: true },
  });

  if (!application) {
    throw new ApiError(
      HttpStatus.NOT_FOUND,
      ErrorCodes.NOT_FOUND,
      'Application not found'
    );
  }

  // Check authorization
  if (application.userId !== user.id) {
    throw new ApiError(
      HttpStatus.FORBIDDEN,
      ErrorCodes.AUTH_FORBIDDEN,
      'You can only submit your own application'
    );
  }

  // Check if payment is successful
  if (!application.payment || application.payment.status !== 'SUCCESS') {
    throw new ApiError(
      HttpStatus.INVALID_STATE,
      ErrorCodes.INVALID_STATE,
      'Payment must be completed before submitting application'
    );
  }

  // Validate required documents are uploaded
  const requiredDocs = [
    'CLASS_10_CERT',
    'CLASS_12_MARKS',
    'PASSPORT_PHOTO',
  ];

  const documents = await prisma.document.findMany({
    where: { applicationId: id },
  });

  const uploadedTypes = documents.map((d) => d.type);
  const missingDocs = requiredDocs.filter((d) => !uploadedTypes.includes(d));

  if (missingDocs.length > 0) {
    throw new ApiError(
      HttpStatus.INVALID_STATE,
      ErrorCodes.INVALID_STATE,
      `Missing required documents: ${missingDocs.join(', ')}`
    );
  }

  // Update application status
  const updated = await prisma.application.update({
    where: { id },
    data: {
      status: 'SUBMITTED',
      submittedAt: new Date(),
    },
  });

  // Send confirmation email
  try {
    const userEmail = user.email || user.mobile + '@temp.com';
    await sendEmail(userEmail, EmailTemplate.APPLICATION_SUBMITTED, {
      applicationId: id,
      userName: user.name || 'Candidate',
    });
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }

  return successHandler({
    message: 'Application submitted successfully',
    application: {
      id: updated.id,
      status: updated.status,
      submittedAt: updated.submittedAt,
    },
  });
}

export const POST = withAuth(handler);
