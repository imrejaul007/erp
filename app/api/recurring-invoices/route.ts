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

const RecurringInvoiceSchema = z.object({
  templateName: z.string().min(1),
  customerId: z.string(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
  subtotal: z.number().nonnegative(),
  taxAmount: z.number().nonnegative(),
  discount: z.number().nonnegative().default(0),
  totalAmount: z.number().nonnegative(),
  paymentTerms: z.string(),
  daysDue: z.number().int().positive().default(30),
  notes: z.string().optional(),
  terms: z.string().optional(),
  lineItems: z.array(LineItemSchema).min(1),
  currency: z.string().default('AED'),
  autoSend: z.boolean().default(false),
  sendEmailTo: z.string().email().optional().nullable(),
});

// Calculate next invoice date based on frequency
function calculateNextInvoiceDate(startDate: Date, frequency: string): Date {
  const next = new Date(startDate);

  switch (frequency) {
    case 'DAILY':
      next.setDate(next.getDate() + 1);
      break;
    case 'WEEKLY':
      next.setDate(next.getDate() + 7);
      break;
    case 'BIWEEKLY':
      next.setDate(next.getDate() + 14);
      break;
    case 'MONTHLY':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'QUARTERLY':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'SEMI_ANNUAL':
      next.setMonth(next.getMonth() + 6);
      break;
    case 'ANNUAL':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }

  return next;
}

// GET /api/recurring-invoices - List all recurring invoice templates
export const GET = withTenant(async (req: NextRequest, { tenantId, userId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');
    const isActive = searchParams.get('isActive');

    const where: any = { tenantId };

    if (customerId) {
      where.customerId = customerId;
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const recurringInvoices = await prisma.recurringInvoice.findMany({
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
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            generatedInvoices: true,
          },
        },
      },
      orderBy: { nextInvoiceDate: 'asc' },
    });

    return apiResponse({ recurringInvoices });
  } catch (error: any) {
    console.error('Error fetching recurring invoices:', error);
    return apiError(error.message || 'Failed to fetch recurring invoices', 500);
  }
});

// POST /api/recurring-invoices - Create new recurring invoice template
export const POST = withTenant(async (req: NextRequest, { tenantId, userId }) => {
  try {
    const body = await req.json();
    const validated = RecurringInvoiceSchema.parse(body);

    // Verify customer exists and belongs to tenant
    const customer = await prisma.customer.findFirst({
      where: {
        id: validated.customerId,
        tenantId,
      },
    });

    if (!customer) {
      return apiError('Customer not found', 404);
    }

    // Calculate next invoice date from start date
    const startDate = new Date(validated.startDate);
    const nextInvoiceDate = calculateNextInvoiceDate(startDate, validated.frequency);

    const recurringInvoice = await prisma.recurringInvoice.create({
      data: {
        templateName: validated.templateName,
        customerId: validated.customerId,
        frequency: validated.frequency,
        startDate,
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        nextInvoiceDate,
        subtotal: validated.subtotal,
        taxAmount: validated.taxAmount,
        discount: validated.discount,
        totalAmount: validated.totalAmount,
        paymentTerms: validated.paymentTerms,
        daysDue: validated.daysDue,
        notes: validated.notes,
        terms: validated.terms,
        lineItems: validated.lineItems,
        currency: validated.currency,
        autoSend: validated.autoSend,
        sendEmailTo: validated.sendEmailTo,
        tenantId,
        createdById: userId,
      },
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
      message: 'Recurring invoice template created successfully',
      recurringInvoice,
    }, 201);
  } catch (error: any) {
    console.error('Error creating recurring invoice:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create recurring invoice template', 500);
  }
});
