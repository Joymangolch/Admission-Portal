/**
 * POST /api/auth/verify-otp
 * Verify OTP and create user session
 */

import { NextRequest } from 'next/server';
import {
  withoutAuth,
  parseBody,
  successHandler,
  validateRequest,
} from '@/lib/auth/middleware';
import { ApiError, HttpStatus, ErrorCodes, successResponse } from '@/lib/utils/response';
import { validateOTP, validateMobile } from '@/lib/utils/validation';
import { createJWTToken } from '@/lib/auth/firebase';
import prisma from '@/lib/db/prisma';

// Mock OTP store (shared with send-otp)
const otpStore = new Map<
  string,
  { otp: string; expiresAt: number; attempts: number }
>();

async function handler(req: NextRequest) {
  const body = await parseBody(req);

  // Validate input
  validateRequest(body, ['mobile', 'otp']);

  const { mobile, otp } = body;

  if (!validateMobile(mobile)) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      ErrorCodes.INVALID_INPUT,
      'Invalid mobile number format'
    );
  }

  if (!validateOTP(otp)) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      ErrorCodes.INVALID_INPUT,
      'Invalid OTP format'
    );
  }

  // Verify OTP
  const storedOtp = otpStore.get(mobile);

  if (!storedOtp) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      ErrorCodes.AUTH_INVALID_OTP,
      'No OTP request found for this mobile'
    );
  }

  if (storedOtp.expiresAt < Date.now()) {
    otpStore.delete(mobile);
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      ErrorCodes.AUTH_OTP_EXPIRED,
      'OTP has expired'
    );
  }

  if (storedOtp.otp !== otp) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      ErrorCodes.AUTH_INVALID_OTP,
      'Invalid OTP'
    );
  }

  // Clear OTP after verification
  otpStore.delete(mobile);

  // Create or get user
  let user = await prisma.user.findUnique({
    where: { mobile },
  });

  if (!user) {
    // Create new user with Firebase UID (in production, comes from Firebase)
    const firebaseUid = `firebase_${Date.now()}_${mobile}`;
    user = await prisma.user.create({
      data: {
        mobile,
        firebaseUid,
        role: 'CANDIDATE',
        lastLogin: new Date(),
      },
    });
  } else {
    // Update last login
    user = await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
  }

  // Generate tokens
  const token = createJWTToken(user.id, 24); // 24 hour expiry
  const refreshToken = createJWTToken(user.id, 30 * 24); // 30 day expiry

  return successHandler({
    token,
    refreshToken,
    user: {
      id: user.id,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      name: user.name,
    },
  });
}

export const POST = withoutAuth(handler);
