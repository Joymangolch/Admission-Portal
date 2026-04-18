/**
 * POST /api/payment/create
 * Create Razorpay payment order
 */

import { NextRequest } from 'next/server';
import {
  withAuth,
  parseBody,
  successHandler,
  validateRequest,
} from '@/lib/auth/middleware';
import {
  createRazorpayOrder,
  getFeeAmount,
} from '@/lib/payment/razorpay';
import { ApiError, HttpStatus, ErrorCodes } from '@/lib/utils/response';
import { validateCategory } from '@/lib/utils/validation';
import prisma from '@/lib/db/prisma';

async function handler(req: NextRequest) {
  const user = (req as any).user;
  const body = await parseBody(req);

  // Validate input
  validateRequest(body, ['applicationId', 'category']);

  const { applicationId, category } = body;

  if (!validateCategory(category)) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      ErrorCodes.INVALID_INPUT,
      'Invalid category'
    );
  }

  // Verify application exists and belongs to user
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    throw new ApiError(
      HttpStatus.NOT_FOUND,
      ErrorCodes.NOT_FOUND,
      'Application not found'
    );
  }

  if (application.userId !== user.id) {
    throw new ApiError(
      HttpStatus.FORBIDDEN,
      ErrorCodes.AUTH_FORBIDDEN,
      'You can only pay for your own application'
    );
  }

  // Check if payment already exists
  const existingPayment = await prisma.payment.findUnique({
    where: { applicationId },
  });

  if (existingPayment && existingPayment.status === 'SUCCESS') {
    throw new ApiError(
      HttpStatus.CONFLICT,
      ErrorCodes.CONFLICT,
      'Payment already completed for this application'
    );
  }

  // Get fee amount
  const amount = getFeeAmount(category);

  // Create Razorpay order
  const order = await createRazorpayOrder(amount, applicationId, user.id);

  // Save payment record
  const payment = await prisma.payment.create({
    data: {
      applicationId,
      userId: user.id,
      amount: order.amount,
      category: category.toUpperCase(),
      razorpayOrderId: order.orderId,
      status: 'PENDING',
      idempotencyKey: `${applicationId}_${Date.now()}`,
    },
  });

  return successHandler(
    {
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      keyId: order.keyId,
      message: 'Payment order created successfully',
    },
    HttpStatus.CREATED
  );
}

export const POST = withAuth(handler);
