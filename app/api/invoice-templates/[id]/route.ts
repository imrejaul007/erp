import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const UpdateInvoiceTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  isDefault: z.boolean().optional(),
  logo: z.string().optional(),
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
  companyEmail: z.string().email().optional(),
  companyWebsite: z.string().url().optional(),
  taxId: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  layout: z.enum(['standard', 'compact', 'detailed']).optional(),
  showLogo: z.boolean().optional(),
  showQRCode: z.boolean().optional(),
  showWatermark: z.boolean().optional(),
  watermarkText: z.string().optional(),
  headerText: z.string().optional(),
  footerText: z.string().optional(),
  paymentInstructions: z.string().optional(),
  defaultTerms: z.string().optional(),
  defaultNotes: z.string().optional(),
});

// GET /api/invoice-templates/[id] - Get single invoice template
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const template = await prisma.invoiceTemplate.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!template) {
      return apiError('Invoice template not found', 404);
    }

    return apiResponse({ template });
  } catch (error: any) {
    console.error('Error fetching invoice template:', error);
    return apiError(error.message || 'Failed to fetch invoice template', 500);
  }
});

// PATCH /api/invoice-templates/[id] - Update invoice template
export const PATCH = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = UpdateInvoiceTemplateSchema.parse(body);

    const existing = await prisma.invoiceTemplate.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!existing) {
      return apiError('Invoice template not found', 404);
    }

    // If setting as default, unset all other defaults
    if (validated.isDefault === true) {
      await prisma.invoiceTemplate.updateMany({
        where: {
          tenantId,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    const template = await prisma.invoiceTemplate.update({
      where: { id },
      data: validated,
    });

    return apiResponse({
      message: 'Invoice template updated successfully',
      template,
    });
  } catch (error: any) {
    console.error('Error updating invoice template:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update invoice template', 500);
  }
});

// DELETE /api/invoice-templates/[id] - Delete invoice template
export const DELETE = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const existing = await prisma.invoiceTemplate.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!existing) {
      return apiError('Invoice template not found', 404);
    }

    if (existing.isDefault) {
      return apiError('Cannot delete the default template', 400);
    }

    await prisma.invoiceTemplate.delete({
      where: { id },
    });

    return apiResponse({
      message: 'Invoice template deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting invoice template:', error);
    return apiError(error.message || 'Failed to delete invoice template', 500);
  }
});
