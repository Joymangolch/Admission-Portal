/**
 * POST /api/payment/verify
 * Verify Razorpay payment signature
 */

import { NextRequest } from 'next/server';
import {
  withAuth,
  parseBody,
  successHandler,
  validateRequest,
} from '@/lib/auth/middleware';
import { verifyPaymentSignature } from '@/lib/payment/razorpay';
import { ApiError, HttpStatus, ErrorCodes } from '@/lib/utils/response';
import { sendEmail, EmailTemplate } from '@/lib/email/sendgrid';
import prisma from '@/lib/db/prisma';

async function handler(req: NextRequest) {
  const user = (req as any).user;
  const body = await parseBody(req);

  // Validate input
  validateRequest(body, ['orderId', 'paymentId', 'signature']);

  const { orderId, paymentId, signature } = body;

  // Verify signature (CRITICAL)
  if (!verifyPaymentSignature(orderId, paymentId, signature)) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      ErrorCodes.PAYMENT_FAILED,
      'Payment signature verification failed'
    );
  }

  // Find payment record
  const payment = await prisma.payment.findUnique({
    where: { razorpayOrderId: orderId },
    include: { application: true },
  });

  if (!payment) {
    throw new ApiError(
      HttpStatus.NOT_FOUND,
      ErrorCodes.NOT_FOUND,
      'Payment record not found'
    );
  }

  // Verify payment belongs to authenticated user
  if (payment.userId !== user.id) {
    throw new ApiError(
      HttpStatus.FORBIDDEN,
      ErrorCodes.AUTH_FORBIDDEN,
      'This payment does not belong to you'
    );
  }

  // Update payment status
  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: 'SUCCESS',
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      completedAt: new Date(),
    },
  });

  // Send payment success email
  try {
    const userEmail = user.email || user.mobile + '@temp.com';
    await sendEmail(userEmail, EmailTemplate.PAYMENT_SUCCESS, {
      amount: payment.amount / 100, // Convert from paise to rupees
      transactionId: paymentId,
    });
  } catch (error) {
    console.error('Failed to send payment email:', error);
  }

  return successHandler({
    message: 'Payment verified successfully',
    payment: {
      id: updated.id,
      status: updated.status,
      amount: updated.amount,
      completedAt: updated.completedAt,
    },
  });
}

export const POST = withAuth(handler);
