/**
 * GET /api/candidate/applications/:id
 * Get application details
 */

import { NextRequest } from 'next/server';
import { withAuth, successHandler } from '@/lib/auth/middleware';
import { ApiError, HttpStatus, ErrorCodes } from '@/lib/utils/response';
import prisma from '@/lib/db/prisma';

async function handler(req: NextRequest, context: any) {
  const user = (req as any).user;
  const { id } = context.params;

  // Fetch application
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      documents: true,
      payment: true,
      exam: true,
      result: true,
    },
  });

  if (!application) {
    throw new ApiError(
      HttpStatus.NOT_FOUND,
      ErrorCodes.NOT_FOUND,
      'Application not found'
    );
  }

  // Check authorization (user can only view own application)
  if (application.userId !== user.id && user.role === 'CANDIDATE') {
    throw new ApiError(
      HttpStatus.FORBIDDEN,
      ErrorCodes.AUTH_FORBIDDEN,
      'You can only view your own application'
    );
  }

  return successHandler({
    id: application.id,
    userId: application.userId,
    status: application.status,
    type: application.type,
    academicDetails: {
      class10Board: application.class10Board,
      class10Marks: application.class10Marks,
      class10Percent: application.class10Percent,
      class12Board: application.class12Board,
      class12Marks: application.class12Marks,
      class12Percent: application.class12Percent,
    },
    jeeDetails: {
      score: application.jeeScore,
      rank: application.jeeRank,
      percentile: application.jeePercentile,
      rollNumber: application.jeeRollNumber,
    },
    preferences: {
      preference1: application.preference1,
      preference2: application.preference2,
      preference3: application.preference3,
      preference4: application.preference4,
      preference5: application.preference5,
    },
    adminRemarks: application.adminRemarks,
    documents: application.documents.map((doc) => ({
      id: doc.id,
      type: doc.type,
      status: doc.status,
      uploadedAt: doc.uploadedAt,
    })),
    payment: application.payment
      ? {
          id: application.payment.id,
          status: application.payment.status,
          amount: application.payment.amount,
        }
      : null,
    submittedAt: application.submittedAt,
    approvedAt: application.approvedAt,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
  });
}

export const GET = withAuth(handler);
