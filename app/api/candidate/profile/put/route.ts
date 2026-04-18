/**
 * PUT /api/candidate/profile
 * Update candidate profile
 */

import { NextRequest } from 'next/server';
import { withAuth, parseBody, successHandler } from '@/lib/auth/middleware';
import prisma from '@/lib/db/prisma';
import { ApiError, HttpStatus, ErrorCodes } from '@/lib/utils/response';

async function handler(req: NextRequest) {
  const user = (req as any).user;
  const body = await parseBody(req);

  // Get or create profile
  let profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) {
    throw new ApiError(
      HttpStatus.NOT_FOUND,
      ErrorCodes.NOT_FOUND,
      'Profile not found. Please create profile first.'
    );
  }

  // Update profile
  const updated = await prisma.profile.update({
    where: { userId: user.id },
    data: {
      firstName: body.firstName || profile.firstName,
      middleName: body.middleName || profile.middleName,
      lastName: body.lastName || profile.lastName,
      dateOfBirth: body.dateOfBirth || profile.dateOfBirth,
      gender: body.gender || profile.gender,
      nationality: body.nationality || profile.nationality,
      category: body.category || profile.category,
      presentAddress: body.presentAddress?.address || profile.presentAddress,
      presentCity: body.presentAddress?.city || profile.presentCity,
      presentState: body.presentAddress?.state || profile.presentState,
      presentPincode: body.presentAddress?.pincode || profile.presentPincode,
      permanentAddress: body.permanentAddress?.address || profile.permanentAddress,
      permanentCity: body.permanentAddress?.city || profile.permanentCity,
      permanentState: body.permanentAddress?.state || profile.permanentState,
      permanentPincode: body.permanentAddress?.pincode || profile.permanentPincode,
      fatherName: body.fatherName || profile.fatherName,
      motherName: body.motherName || profile.motherName,
      guardianMobile: body.guardianMobile || profile.guardianMobile,
      guardianEmail: body.guardianEmail || profile.guardianEmail,
    },
  });

  // Also update user basic info
  if (body.email || body.name) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: body.email || user.email,
        name: body.name || user.name,
      },
    });
  }

  return successHandler({
    message: 'Profile updated successfully',
    profile: {
      firstName: updated.firstName,
      lastName: updated.lastName,
      category: updated.category,
      updatedAt: updated.updatedAt,
    },
  });
}

export const PUT = withAuth(handler);
