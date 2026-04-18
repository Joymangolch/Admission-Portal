/**
 * POST /api/documents/upload
 * Upload document to GCS
 */

import { NextRequest } from 'next/server';
import {
  withAuth,
  parseBody,
  successHandler,
  validateRequest,
} from '@/lib/auth/middleware';
import {
  uploadFileToGCS,
  generateSignedUrl,
} from '@/lib/storage/gcs';
import {
  validateDocumentType,
  validateFileMimeType,
  validateFileSize,
} from '@/lib/utils/validation';
import { ApiError, HttpStatus, ErrorCodes } from '@/lib/utils/response';
import prisma from '@/lib/db/prisma';

async function handler(req: NextRequest) {
  const user = (req as any).user;
  const formData = await req.formData();

  const applicationId = formData.get('applicationId') as string;
  const documentType = formData.get('documentType') as string;
  const file = formData.get('file') as File;

  // Validate inputs
  if (!applicationId || !documentType || !file) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      ErrorCodes.MISSING_REQUIRED_FIELD,
      'Missing required fields: applicationId, documentType, file'
    );
  }

  if (!validateDocumentType(documentType)) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      ErrorCodes.INVALID_INPUT,
      'Invalid document type'
    );
  }

  // Validate file
  const fileBuffer = await file.arrayBuffer();
  const fileSizeBytes = fileBuffer.byteLength;

  if (!validateFileSize(fileSizeBytes, 10)) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      ErrorCodes.INVALID_INPUT,
      'File size exceeds 10 MB limit'
    );
  }

  if (!validateFileMimeType(file.type)) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      ErrorCodes.INVALID_INPUT,
      'Invalid file type. Only images and PDFs are allowed'
    );
  }

  // Verify application belongs to user
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
      'You can only upload documents for your own application'
    );
  }

  // Upload to GCS
  const uploadedFile = await uploadFileToGCS(
    Buffer.from(fileBuffer),
    user.id,
    applicationId,
    documentType,
    file.name
  );

  // Save document record
  const document = await prisma.document.create({
    data: {
      applicationId,
      userId: user.id,
      type: documentType.toUpperCase(),
      fileName: uploadedFile.fileName,
      fileSize: fileSizeBytes,
      mimeType: file.type,
      gcsOriginalUrl: uploadedFile.fileUrl,
      status: 'PENDING',
      uploadedAt: new Date(),
    },
  });

  return successHandler(
    {
      documentId: document.id,
      type: document.type,
      status: document.status,
      uploadedAt: document.uploadedAt,
      signedUrl: uploadedFile.signedUrl,
      message: 'Document uploaded successfully',
    },
    HttpStatus.CREATED
  );
}

export const POST = withAuth(handler);
