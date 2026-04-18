/**
 * POST /api/admin/results/publish
 * Publish exam results
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
  validateRequest(body, ['resultIds']);

  const { resultIds } = body;

  if (!Array.isArray(resultIds) || resultIds.length === 0) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      ErrorCodes.INVALID_INPUT,
      'resultIds must be a non-empty array'
    );
  }

  // Calculate ranks for each category
  const results = await prisma.result.findMany({
    where: { id: { in: resultIds } },
    include: { application: { include: { user: true } } },
  });

  // Group by category and sort by marks to calculate rank
  const resultsByCategory = new Map<string, any[]>();

  for (const result of results) {
    const category = result.application.profile?.category || 'GEN';
    if (!resultsByCategory.has(category)) {
      resultsByCategory.set(category, []);
    }
    resultsByCategory.get(category)!.push(result);
  }

  // Sort each category by total marks and assign ranks
  const updatedResults = [];
  for (const [category, categoryResults] of resultsByCategory.entries()) {
    categoryResults.sort((a, b) => b.totalMarks - a.totalMarks);

    for (let i = 0; i < categoryResults.length; i++) {
      const updated = await prisma.result.update({
        where: { id: categoryResults[i].id },
        data: {
          rankInCategory: i + 1,
          status: 'PUBLISHED',
          publishedAt: new Date(),
          selectionStatus:
            i < 100 ? 'SELECTED' : i < 150 ? 'WAITLISTED' : 'NOT_SELECTED',
        },
      });

      updatedResults.push(updated);

      // Send result email
      try {
        const userEmail = updated.application.user.email || 
          updated.application.user.mobile + '@temp.com';
        await sendEmail(userEmail, EmailTemplate.RESULT_PUBLISHED, {
          applicantName: updated.application.user.name,
          totalMarks: updated.totalMarks,
          status: updated.selectionStatus,
        });
      } catch (error) {
        console.error('Failed to send result email');
      }
    }
  }

  return successHandler({
    publishedCount: updatedResults.length,
    message: `Results published for ${updatedResults.length} candidates`,
  });
}

export const POST = withRoleAuth(
  ['REGISTRAR', 'SYSTEM_ADMIN'],
  handler
);
