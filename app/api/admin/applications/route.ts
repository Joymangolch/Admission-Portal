/**
 * GET /api/admin/applications
 * List all applications with filtering
 */

import { NextRequest } from 'next/server';
import { withRoleAuth, parseBody, successHandler } from '@/lib/auth/middleware';
import { ApiError, HttpStatus, ErrorCodes } from '@/lib/utils/response';
import prisma from '@/lib/db/prisma';

async function handler(req: NextRequest) {
  const user = (req as any).user;
  const { searchParams } = new URL(req.url);

  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const skip = (page - 1) * limit;

  // Build filter
  const where: any = {};
  if (status) where.status = status.toUpperCase();
  if (type) where.type = type.toUpperCase();

  // Fetch applications
  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            mobile: true,
            email: true,
          },
        },
        documents: true,
        payment: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.application.count({ where }),
  ]);

  return successHandler({
    applications: applications.map((app) => ({
      id: app.id,
      applicantName: app.user.name,
      applicantMobile: app.user.mobile,
      applicantEmail: app.user.email,
      type: app.type,
      status: app.status,
      documentsCount: app.documents.length,
      paymentStatus: app.payment?.status,
      submittedAt: app.submittedAt,
      createdAt: app.createdAt,
    })),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

export const GET = withRoleAuth(
  ['ADMIN', 'SYSTEM_ADMIN'],
  handler
);
