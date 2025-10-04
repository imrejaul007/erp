import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const VendorInvoiceCreateSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  supplierId: z.string().min(1, 'Supplier is required'),
  purchaseOrderId: z.string().optional().nullable(),
  subtotal: z.number().positive('Subtotal must be positive'),
  taxAmount: z.number().min(0, 'Tax amount must be non-negative').default(0),
  discount: z.number().min(0, 'Discount must be non-negative').default(0),
  totalAmount: z.number().positive('Total amount must be positive'),
  invoiceDate: z.string().datetime(),
  dueDate: z.string().datetime(),
  paymentTerms: z.string().default('Net 30'),
  lineItems: z.array(z.object({
    description: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    amount: z.number().positive(),
  })),
  notes: z.string().optional(),
  attachments: z.array(z.object({
    url: z.string().url(),
    name: z.string(),
    type: z.string(),
  })).optional(),
  currency: z.string().default('AED'),
  exchangeRate: z.number().positive().optional(),
});

/**
 * GET /api/vendor-invoices - List all vendor invoices
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const supplierId = searchParams.get('supplierId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = { tenantId };

    if (status) where.status = status;
    if (supplierId) where.supplierId = supplierId;

    if (startDate || endDate) {
      where.invoiceDate = {};
      if (startDate) where.invoiceDate.gte = new Date(startDate);
      if (endDate) where.invoiceDate.lte = new Date(endDate);
    }

    const invoices = await prisma.vendorInvoice.findMany({
      where,
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        purchaseOrder: {
          select: {
            id: true,
            orderNumber: true,
          },
        },
        payments: true,
      },
      orderBy: [
        { invoiceDate: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return apiResponse(invoices);
  } catch (error: any) {
    console.error('Error fetching vendor invoices:', error);
    return apiError(error.message || 'Failed to fetch vendor invoices', 500);
  }
});

/**
 * POST /api/vendor-invoices - Create new vendor invoice
 */
export const POST = withTenant(async (req: NextRequest, { tenantId, user }) => {
  try {
    const body = await req.json();
    const validated = VendorInvoiceCreateSchema.parse(body);

    // Verify supplier exists
    const supplier = await prisma.supplier.findFirst({
      where: {
        id: validated.supplierId,
        tenantId,
      },
    });

    if (!supplier) {
      return apiError('Supplier not found', 404);
    }

    // Verify PO exists if provided
    if (validated.purchaseOrderId) {
      const po = await prisma.purchaseOrder.findFirst({
        where: {
          id: validated.purchaseOrderId,
          tenantId,
        },
      });

      if (!po) {
        return apiError('Purchase order not found', 404);
      }
    }

    // Check for duplicate invoice number from same supplier
    const existing = await prisma.vendorInvoice.findFirst({
      where: {
        tenantId,
        invoiceNumber: validated.invoiceNumber,
        supplierId: validated.supplierId,
      },
    });

    if (existing) {
      return apiError('Invoice number already exists for this supplier', 400);
    }

    const invoice = await prisma.vendorInvoice.create({
      data: {
        invoiceNumber: validated.invoiceNumber,
        supplierId: validated.supplierId,
        purchaseOrderId: validated.purchaseOrderId,
        subtotal: validated.subtotal,
        taxAmount: validated.taxAmount,
        discount: validated.discount,
        totalAmount: validated.totalAmount,
        invoiceDate: new Date(validated.invoiceDate),
        dueDate: new Date(validated.dueDate),
        paymentTerms: validated.paymentTerms,
        lineItems: validated.lineItems,
        notes: validated.notes,
        attachments: validated.attachments || [],
        currency: validated.currency,
        exchangeRate: validated.exchangeRate,
        status: 'PENDING',
        paidAmount: 0,
        balanceDue: validated.totalAmount,
        tenantId,
        createdById: user?.id || 'system',
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        purchaseOrder: true,
      },
    });

    return apiResponse({
      message: 'Vendor invoice created successfully',
      invoice,
    }, 201);
  } catch (error: any) {
    console.error('Error creating vendor invoice:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create vendor invoice', 500);
  }
});
