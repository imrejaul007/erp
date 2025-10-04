import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const LineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
  amount: z.number().nonnegative(),
});

const UpdateRecurringInvoiceSchema = z.object({
  templateName: z.string().min(1).optional(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL']).optional(),
  endDate: z.string().datetime().optional().nullable(),
  subtotal: z.number().nonnegative().optional(),
  taxAmount: z.number().nonnegative().optional(),
  discount: z.number().nonnegative().optional(),
  totalAmount: z.number().nonnegative().optional(),
  paymentTerms: z.string().optional(),
  daysDue: z.number().int().positive().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  lineItems: z.array(LineItemSchema).min(1).optional(),
  currency: z.string().optional(),
  autoSend: z.boolean().optional(),
  sendEmailTo: z.string().email().optional().nullable(),
  isActive: z.boolean().optional(),
});

// GET /api/recurring-invoices/[id] - Get single recurring invoice template
export const GET = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    const recurringInvoice = await prisma.recurringInvoice.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        generatedInvoices: {
          select: {
            id: true,
            invoiceNumber: true,
            status: true,
            issueDate: true,
            dueDate: true,
            totalAmount: true,
            paidAmount: true,
            balanceDue: true,
          },
          orderBy: {
            issueDate: 'desc',
          },
        },
      },
    });

    if (!recurringInvoice) {
      return apiError('Recurring invoice template not found', 404);
    }

    return apiResponse({ recurringInvoice });
  } catch (error: any) {
    console.error('Error fetching recurring invoice:', error);
    return apiError(error.message || 'Failed to fetch recurring invoice template', 500);
  }
});

// PATCH /api/recurring-invoices/[id] - Update recurring invoice template
export const PATCH = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validated = UpdateRecurringInvoiceSchema.parse(body);

    // Check if template exists
    const existingTemplate = await prisma.recurringInvoice.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!existingTemplate) {
      return apiError('Recurring invoice template not found', 404);
    }

    const updateData: any = {};

    if (validated.templateName !== undefined) updateData.templateName = validated.templateName;
    if (validated.frequency !== undefined) updateData.frequency = validated.frequency;
    if (validated.endDate !== undefined) updateData.endDate = validated.endDate ? new Date(validated.endDate) : null;
    if (validated.subtotal !== undefined) updateData.subtotal = validated.subtotal;
    if (validated.taxAmount !== undefined) updateData.taxAmount = validated.taxAmount;
    if (validated.discount !== undefined) updateData.discount = validated.discount;
    if (validated.totalAmount !== undefined) updateData.totalAmount = validated.totalAmount;
    if (validated.paymentTerms !== undefined) updateData.paymentTerms = validated.paymentTerms;
    if (validated.daysDue !== undefined) updateData.daysDue = validated.daysDue;
    if (validated.notes !== undefined) updateData.notes = validated.notes;
    if (validated.terms !== undefined) updateData.terms = validated.terms;
    if (validated.lineItems !== undefined) updateData.lineItems = validated.lineItems;
    if (validated.currency !== undefined) updateData.currency = validated.currency;
    if (validated.autoSend !== undefined) updateData.autoSend = validated.autoSend;
    if (validated.sendEmailTo !== undefined) updateData.sendEmailTo = validated.sendEmailTo;
    if (validated.isActive !== undefined) updateData.isActive = validated.isActive;

    const updatedTemplate = await prisma.recurringInvoice.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return apiResponse({
      message: 'Recurring invoice template updated successfully',
      recurringInvoice: updatedTemplate,
    });
  } catch (error: any) {
    console.error('Error updating recurring invoice:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to update recurring invoice template', 500);
  }
});

// DELETE /api/recurring-invoices/[id] - Delete recurring invoice template
export const DELETE = withTenant(async (
  req: NextRequest,
  { params, tenantId }: { params: { id: string }; tenantId: string }
) => {
  try {
    const { id } = params;

    // Check if template exists
    const existingTemplate = await prisma.recurringInvoice.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        _count: {
          select: {
            generatedInvoices: true,
          },
        },
      },
    });

    if (!existingTemplate) {
      return apiError('Recurring invoice template not found', 404);
    }

    // Soft delete: just deactivate instead of deleting if it has generated invoices
    if (existingTemplate._count.generatedInvoices > 0) {
      await prisma.recurringInvoice.update({
        where: { id },
        data: { isActive: false },
      });

      return apiResponse({
        message: 'Recurring invoice template deactivated (has generated invoices)',
      });
    }

    // Hard delete if no invoices generated
    await prisma.recurringInvoice.delete({
      where: { id },
    });

    return apiResponse({
      message: 'Recurring invoice template deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting recurring invoice:', error);
    return apiError(error.message || 'Failed to delete recurring invoice template', 500);
  }
});
