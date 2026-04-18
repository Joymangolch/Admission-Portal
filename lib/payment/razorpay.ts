/**
 * Razorpay Payment Integration
 * Handle payment creation, verification, and refunds
 */

import { ApiError, ErrorCodes, HttpStatus } from '../utils/response';
import crypto from 'crypto';

// Initialize Razorpay client in production
let razorpayClient: any = null;

/**
 * Initialize Razorpay
 */
export function initializeRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.warn('Razorpay credentials not configured');
    return;
  }

  // In production:
  // const Razorpay = require('razorpay');
  // razorpayClient = new Razorpay({
  //   key_id: keyId,
  //   key_secret: keySecret,
  // });
}

/**
 * Fee structure by category
 */
export const FeeStructure = {
  GEN: 5000, // ₹5000
  OBC: 3500, // ₹3500
  SC: 2500, // ₹2500
  ST: 2500, // ₹2500
  PWD: 1000, // ₹1000
  IDP: 1000, // ₹1000
};

/**
 * Get fee amount for category
 */
export function getFeeAmount(category: string): number {
  const fee = FeeStructure[category as keyof typeof FeeStructure];
  if (!fee) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      ErrorCodes.INVALID_INPUT,
      `Invalid category: ${category}`
    );
  }
  return fee;
}

/**
 * Create Razorpay order
 */
export async function createRazorpayOrder(
  amount: number, // in rupees
  applicationId: string,
  userId: string
): Promise<{
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}> {
  try {
    // Amount in paise (₹1 = 100 paise)
    const amountInPaise = amount * 100;

    // In production:
    // const order = await razorpayClient.orders.create({
    //   amount: amountInPaise,
    //   currency: 'INR',
    //   receipt: `app_${applicationId}`,
    //   notes: {
    //     applicationId,
    //     userId,
    //   },
    // });
    // return {
    //   orderId: order.id,
    //   amount: order.amount,
    //   currency: order.currency,
    //   keyId: process.env.RAZORPAY_KEY_ID!,
    // };

    // For development: generate mock order ID
    const orderId = `order_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    return {
      orderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
    };
  } catch (error: any) {
    throw new ApiError(
      HttpStatus.INTERNAL_ERROR,
      ErrorCodes.PAYMENT_FAILED,
      'Failed to create payment order',
      { originalError: error.message }
    );
  }
}

/**
 * Verify Razorpay payment signature
 * CRITICAL: Always verify signature on backend
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      throw new Error('Razorpay key secret not configured');
    }

    // Create hmac
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${orderId}|${paymentId}`);
    const generatedSignature = hmac.digest('hex');

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(signature)
    );
  } catch (error: any) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Refund payment
 */
export async function refundPayment(
  paymentId: string,
  amount?: number
): Promise<{
  refundId: string;
  status: string;
}> {
  try {
    // In production:
    // const refund = await razorpayClient.payments.refund(paymentId, {
    //   amount: amount ? amount * 100 : undefined,
    // });
    // return {
    //   refundId: refund.id,
    //   status: refund.status,
    // };

    const refundId = `rfnd_${Date.now()}`;
    return {
      refundId,
      status: 'processed',
    };
  } catch (error: any) {
    throw new ApiError(
      HttpStatus.INTERNAL_ERROR,
      ErrorCodes.PAYMENT_FAILED,
      'Failed to process refund',
      { originalError: error.message }
    );
  }
}

/**
 * Get payment status
 */
export async function getPaymentStatus(paymentId: string): Promise<{
  status: string;
  amount: number;
  method: string;
}> {
  try {
    // In production:
    // const payment = await razorpayClient.payments.fetch(paymentId);
    // return {
    //   status: payment.status,
    //   amount: payment.amount,
    //   method: payment.method,
    // };

    return {
      status: 'captured',
      amount: 0,
      method: 'upi',
    };
  } catch (error: any) {
    throw new ApiError(
      HttpStatus.NOT_FOUND,
      ErrorCodes.NOT_FOUND,
      'Payment not found',
      { originalError: error.message }
    );
  }
}
