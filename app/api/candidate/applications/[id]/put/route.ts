/**
 * PUT /api/candidate/applications/:id
 * Update application details (before submission)
 */

import { NextRequest } from 'next/server';
import { withAuth, parseBody, successHandler, validateRequest } from '@/lib/auth/middleware';
import { ApiError, HttpStatus, ErrorCodes } from '@/lib/utils/response';
import prisma from '@/lib/db/prisma';

async function handler(req: NextRequest, context: any) {
  const user = (req as any).user;
  const { id } = context.params;
  const body = await parseBody(req);

  // Fetch application
  const application = await prisma.application.findUnique({
    where: { id },
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
      'You can only update your own application'
    );
  }

  // Can only update if in DRAFT status
  if (application.status !== 'DRAFT') {
    throw new ApiError(
      HttpStatus.INVALID_STATE,
      ErrorCodes.INVALID_STATE,
      `Cannot update application in ${application.status} status`
    );
  }

  // Update application
  const updated = await prisma.application.update({
    where: { id },
    data: {
      class10Board: body.class10Board || application.class10Board,
      class10Marks: body.class10Marks || application.class10Marks,
      class10Percent: body.class10Percent || application.class10Percent,
      class10Year: body.class10Year || application.class10Year,
      class12Board: body.class12Board || application.class12Board,
      class12Marks: body.class12Marks || application.class12Marks,
      class12Percent: body.class12Percent || application.class12Percent,
      class12Year: body.class12Year || application.class12Year,
      jeeScore: body.jeeScore || application.jeeScore,
      jeeRank: body.jeeRank || application.jeeRank,
      jeePercentile: body.jeePercentile || application.jeePercentile,
      jeeRollNumber: body.jeeRollNumber || application.jeeRollNumber,
      preference1: body.preference1 || application.preference1,
      preference2: body.preference2 || application.preference2,
      preference3: body.preference3 || application.preference3,
      preference4: body.preference4 || application.preference4,
      preference5: body.preference5 || application.preference5,
    },
  });

  return successHandler({
    message: 'Application updated successfully',
    application: {
      id: updated.id,
      status: updated.status,
      updatedAt: updated.updatedAt,
    },
  });
}

export const PUT = withAuth(handler);
