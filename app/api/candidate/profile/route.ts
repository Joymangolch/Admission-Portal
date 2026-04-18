/**
 * GET /api/candidate/profile
 * Get authenticated candidate's profile
 */

import { NextRequest } from 'next/server';
import { withAuth, successHandler } from '@/lib/auth/middleware';
import { ApiError, HttpStatus, ErrorCodes } from '@/lib/utils/response';
import prisma from '@/lib/db/prisma';

async function handler(req: NextRequest) {
  const user = (req as any).user;

  // Fetch complete user profile with details
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) {
    throw new ApiError(
      HttpStatus.NOT_FOUND,
      ErrorCodes.NOT_FOUND,
      'Profile not found. Please complete your profile first.'
    );
  }

  return successHandler({
    id: user.id,
    mobile: user.mobile,
    email: user.email,
    name: user.name,
    firstName: profile.firstName,
    middleName: profile.middleName,
    lastName: profile.lastName,
    dateOfBirth: profile.dateOfBirth,
    gender: profile.gender,
    nationality: profile.nationality,
    category: profile.category,
    presentAddress: {
      address: profile.presentAddress,
      city: profile.presentCity,
      state: profile.presentState,
      pincode: profile.presentPincode,
    },
    permanentAddress: {
      address: profile.permanentAddress,
      city: profile.permanentCity,
      state: profile.permanentState,
      pincode: profile.permanentPincode,
    },
    fatherName: profile.fatherName,
    motherName: profile.motherName,
    guardianMobile: profile.guardianMobile,
    guardianEmail: profile.guardianEmail,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  });
}

export const GET = withAuth(handler);
