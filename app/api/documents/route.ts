import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const DocumentCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  documentType: z.enum(['CONTRACT', 'INVOICE', 'RECEIPT', 'PURCHASE_ORDER', 'DELIVERY_NOTE', 'CERTIFICATE', 'REPORT', 'POLICY', 'PROCEDURE', 'LEGAL', 'MARKETING', 'OTHER']),
  category: z.string().optional(),
  fileName: z.string().min(1, 'File name is required'),
  fileUrl: z.string().url('Valid file URL is required'),
  fileSize: z.number().int().positive('File size must be positive'),
  mimeType: z.string().min(1, 'MIME type is required'),
  tags: z.array(z.string()).optional(),
  customFields: z.record(z.any()).optional(),
  customerId: z.string().optional(),
  supplierId: z.string().optional(),
  orderId: z.string().optional(),
  invoiceId: z.string().optional(),
  isPublic: z.boolean().default(false),
  allowedUsers: z.array(z.string()).optional(),
  allowedRoles: z.array(z.string()).optional(),
  requiresSignature: z.boolean().default(false),
  expiryDate: z.string().datetime().optional(),
});

/**
 * GET /api/documents - List all documents
 */
export const GET = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const documentType = searchParams.get('documentType');
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');
    const supplierId = searchParams.get('supplierId');

    const where: any = { tenantId };

    if (documentType) where.documentType = documentType;
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (supplierId) where.supplierId = supplierId;

    // Filter by access control unless user is admin
    if (user?.role !== 'ADMIN') {
      where.OR = [
        { isPublic: true },
        { uploadedBy: user?.id },
        { allowedUsers: { has: user?.id } },
      ];
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
          },
        },
        _count: {
          select: {
            versions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse(documents);
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    return apiError(error.message || 'Failed to fetch documents', 500);
  }
});

/**
 * POST /api/documents - Upload new document
 */
export const POST = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    const body = await req.json();
    const validated = DocumentCreateSchema.parse(body);

    // Generate document number
    const count = await prisma.document.count({ where: { tenantId } });
    const documentNumber = `DOC-${String(count + 1).padStart(6, '0')}`;

    const document = await prisma.document.create({
      data: {
        documentNumber,
        title: validated.title,
        description: validated.description,
        documentType: validated.documentType,
        category: validated.category,
        fileName: validated.fileName,
        fileUrl: validated.fileUrl,
        fileSize: validated.fileSize,
        mimeType: validated.mimeType,
        version: 1,
        isLatestVersion: true,
        tags: validated.tags || [],
        customFields: validated.customFields || {},
        customerId: validated.customerId,
        supplierId: validated.supplierId,
        orderId: validated.orderId,
        invoiceId: validated.invoiceId,
        isPublic: validated.isPublic,
        allowedUsers: validated.allowedUsers || [],
        allowedRoles: validated.allowedRoles || [],
        status: 'DRAFT',
        requiresSignature: validated.requiresSignature,
        signatures: [],
        expiryDate: validated.expiryDate ? new Date(validated.expiryDate) : null,
        uploadedBy: user?.id || 'system',
        tenantId,
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return apiResponse({
      message: 'Document uploaded successfully',
      document,
    }, 201);
  } catch (error: any) {
    console.error('Error uploading document:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to upload document', 500);
  }
});
