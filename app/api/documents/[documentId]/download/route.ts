/**
 * GET /api/documents/:documentId/download
 * Download document (returns signed URL)
 */

import { NextRequest } from 'next/server';
import { withAuth, successHandler } from '@/lib/auth/middleware';
import {
  generateSignedUrl,
  fileExists,
} from '@/lib/storage/gcs';
import { ApiError, HttpStatus, ErrorCodes } from '@/lib/utils/response';
import prisma from '@/lib/db/prisma';

async function handler(req: NextRequest, context: any) {
  const user = (req as any).user;
  const { documentId } = context.params;

  // Fetch document
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { application: true },
  });

  if (!document) {
    throw new ApiError(
      HttpStatus.NOT_FOUND,
      ErrorCodes.NOT_FOUND,
      'Document not found'
    );
  }

  // Check authorization (user or admin)
  if (
    document.userId !== user.id &&
    user.role === 'CANDIDATE'
  ) {
    throw new ApiError(
      HttpStatus.FORBIDDEN,
      ErrorCodes.AUTH_FORBIDDEN,
      'You can only download your own documents'
    );
  }

  // Check if file exists in GCS
  const exists = await fileExists(document.fileName);

  if (!exists) {
    throw new ApiError(
      HttpStatus.NOT_FOUND,
      ErrorCodes.NOT_FOUND,
      'File not found in storage'
    );
  }

  // Generate signed URL
  const signedUrl = await generateSignedUrl(document.fileName, 1); // 1 hour expiry

  return successHandler({
    documentId: document.id,
    fileName: document.fileName,
    type: document.type,
    downloadUrl: signedUrl,
    expiresIn: 3600, // seconds
  });
}

export const GET = withAuth(handler);
