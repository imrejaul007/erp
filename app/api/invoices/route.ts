import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

// Invoice validation schema
const InvoiceCreateSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  orderId: z.string().optional(),
  invoiceType: z.enum(['STANDARD', 'PROFORMA', 'RECURRING', 'PARTIAL', 'CREDIT_NOTE', 'DEBIT_NOTE']).optional().default('STANDARD'),
  subtotal: z.number().min(0, 'Subtotal must be positive'),
  taxAmount: z.number().min(0, 'Tax amount must be positive'),
  discount: z.number().min(0).optional().default(0),
  totalAmount: z.number().min(0, 'Total amount must be positive'),
  dueDate: z.string().min(1, 'Due date is required'),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  lineItems: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    amount: z.number(),
  })),
  notes: z.string().optional(),
  terms: z.string().optional(),
  currency: z.string().optional().default('AED'),
});

// GET /api/invoices - List all invoices with filters
export const GET = withTenant(async (req: NextRequest, { tenantId, userId }) => {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status'); // DRAFT, SENT, PAID, etc.
    const customerId = url.searchParams.get('customerId');
    const fromDate = url.searchParams.get('fromDate');
    const toDate = url.searchParams.get('toDate');
    const overdue = url.searchParams.get('overdue'); // 'true' or 'false'

    const where: any = { tenantId };

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by customer
    if (customerId) {
      where.customerId = customerId;
    }

    // Filter by date range
    if (fromDate) {
      where.issueDate = { ...where.issueDate, gte: new Date(fromDate) };
    }
    if (toDate) {
      where.issueDate = { ...where.issueDate, lte: new Date(toDate) };
    }

    // Filter overdue invoices
    if (overdue === 'true') {
      const now = new Date();
      where.dueDate = { lt: now };
      where.status = {
        in: ['SENT', 'VIEWED', 'PARTIALLY_PAID'],
      };
    }

    const invoices = await prisma.customerInvoice.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return apiResponse(invoices);
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    return apiError(error.message || 'Failed to fetch invoices', 500);
  }
});

// POST /api/invoices - Create new invoice
export const POST = withTenant(async (req: NextRequest, { tenantId, userId }) => {
  try {
    const body = await req.json();
    const validated = InvoiceCreateSchema.parse(body);

    // Generate invoice number
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    // Get last invoice number for this month
    const lastInvoice = await prisma.customerInvoice.findFirst({
      where: {
        tenantId,
        invoiceNumber: {
          startsWith: `INV-${year}-${month}-`,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let sequence = 1;
    if (lastInvoice) {
      const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[3]);
      sequence = lastSequence + 1;
    }

    const invoiceNumber = `INV-${year}-${month}-${String(sequence).padStart(5, '0')}`;

    // Calculate balance due
    const balanceDue = validated.totalAmount - 0; // Initially no payments

    // Create invoice
    const invoice = await prisma.customerInvoice.create({
      data: {
        invoiceNumber,
        customerId: validated.customerId,
        orderId: validated.orderId,
        invoiceType: validated.invoiceType || 'STANDARD',
        subtotal: validated.subtotal,
        taxAmount: validated.taxAmount,
        discount: validated.discount || 0,
        totalAmount: validated.totalAmount,
        balanceDue,
        dueDate: new Date(validated.dueDate),
        paymentTerms: validated.paymentTerms,
        lineItems: validated.lineItems,
        notes: validated.notes,
        terms: validated.terms,
        currency: validated.currency || 'AED',
        tenantId,
        createdById: userId,
      },
      include: {
        customer: true,
        order: true,
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return apiResponse(invoice, 201);
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create invoice', 500);
  }
});

// PATCH /api/invoices?id=xxx - Update invoice
export const PATCH = withTenant(async (req: NextRequest, { tenantId, userId }) => {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return apiError('Invoice ID is required', 400);
    }

    const body = await req.json();

    // Check if invoice exists and belongs to tenant
    const existingInvoice = await prisma.customerInvoice.findFirst({
      where: { id, tenantId },
    });

    if (!existingInvoice) {
      return apiError('Invoice not found', 404);
    }

    // Don't allow updating paid invoices
    if (existingInvoice.status === 'PAID') {
      return apiError('Cannot update a paid invoice', 400);
    }

    const invoice = await prisma.customerInvoice.update({
      where: { id },
      data: {
        ...body,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        updatedAt: new Date(),
      },
      include: {
        customer: true,
        order: true,
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        payments: true,
      },
    });

    return apiResponse(invoice);
  } catch (error: any) {
    console.error('Error updating invoice:', error);
    return apiError(error.message || 'Failed to update invoice', 500);
  }
});

// DELETE /api/invoices?id=xxx - Cancel invoice
export const DELETE = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return apiError('Invoice ID is required', 400);
    }

    // Check if invoice exists and belongs to tenant
    const existingInvoice = await prisma.customerInvoice.findFirst({
      where: { id, tenantId },
    });

    if (!existingInvoice) {
      return apiError('Invoice not found', 404);
    }

    // Don't allow deleting paid invoices
    if (existingInvoice.status === 'PAID') {
      return apiError('Cannot delete a paid invoice', 400);
    }

    // Mark as cancelled instead of deleting
    const invoice = await prisma.customerInvoice.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date(),
      },
    });

    return apiResponse({ message: 'Invoice cancelled successfully', invoice });
  } catch (error: any) {
    console.error('Error cancelling invoice:', error);
    return apiError(error.message || 'Failed to cancel invoice', 500);
  }
});
