/**
 * GET /api/payment/:paymentId
 * Get payment status
 */

import { NextRequest } from 'next/server';
import { withAuth, successHandler } from '@/lib/auth/middleware';
import { ApiError, HttpStatus, ErrorCodes } from '@/lib/utils/response';
import prisma from '@/lib/db/prisma';

async function handler(req: NextRequest, context: any) {
  const user = (req as any).user;
  const { paymentId } = context.params;

  // Fetch payment
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    throw new ApiError(
      HttpStatus.NOT_FOUND,
      ErrorCodes.NOT_FOUND,
      'Payment not found'
    );
  }

  // Check authorization
  if (payment.userId !== user.id && user.role === 'CANDIDATE') {
    throw new ApiError(
      HttpStatus.FORBIDDEN,
      ErrorCodes.AUTH_FORBIDDEN,
      'You can only view your own payments'
    );
  }

  return successHandler({
    id: payment.id,
    orderId: payment.razorpayOrderId,
    paymentId: payment.razorpayPaymentId,
    status: payment.status,
    amount: payment.amount,
    category: payment.category,
    initiatedAt: payment.initiatedAt,
    completedAt: payment.completedAt,
  });
}

export const GET = withAuth(handler);
