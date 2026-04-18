/**
 * POST /api/auth/send-otp
 * Send OTP to mobile number
 */

import { NextRequest } from 'next/server';
import {
  withoutAuth,
  parseBody,
  successHandler,
  validateRequest,
} from '@/lib/auth/middleware';
import { ApiError, HttpStatus, ErrorCodes } from '@/lib/utils/response';
import { validateMobile } from '@/lib/utils/validation';
import prisma from '@/lib/db/prisma';

// Mock OTP storage (in production, use Redis or database)
const otpStore = new Map<
  string,
  { otp: string; expiresAt: number; attempts: number }
>();

async function handler(req: NextRequest) {
  const body = await parseBody(req);
  
  // Validate input
  validateRequest(body, ['mobile']);
  
  const { mobile } = body;

  if (!validateMobile(mobile)) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      ErrorCodes.INVALID_INPUT,
      'Invalid mobile number format'
    );
  }

  // Check rate limiting (max 3 OTPs per hour)
  const existing = otpStore.get(mobile);
  if (existing && existing.attempts >= 3) {
    throw new ApiError(
      HttpStatus.TOO_MANY_REQUESTS,
      ErrorCodes.RATE_LIMIT_EXCEEDED,
      'Too many OTP requests. Try again after some time.'
    );
  }

  // Generate OTP (6 digits)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpId = `otp_${Date.now()}_${mobile}`;
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Store OTP
  otpStore.set(mobile, {
    otp,
    expiresAt,
    attempts: (existing?.attempts || 0) + 1,
  });

  // In production: Send OTP via SMS (Twilio, AWS SNS, etc.)
  console.log(`OTP for ${mobile}: ${otp}`);

  return successHandler(
    {
      otpId,
      expiresIn: 600, // seconds
      message: 'OTP sent successfully',
    },
    HttpStatus.OK
  );
}

export const POST = withoutAuth(handler);
