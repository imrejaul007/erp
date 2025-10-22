import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';

const PortalAccessCreateSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  canViewInvoices: z.boolean().default(true),
  canMakePayments: z.boolean().default(true),
  canViewOrders: z.boolean().default(true),
  canSubmitTickets: z.boolean().default(true),
});

/**
 * GET /api/customer-portal - List all portal access accounts
 */
export const GET = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');
    const isActive = searchParams.get('isActive');

    const where: any = { tenantId };

    if (customerId) where.customerId = customerId;
    if (isActive !== null) where.isActive = isActive === 'true';

    const portalAccess = await prisma.customerPortalAccess.findMany({
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
      },
      orderBy: { createdAt: 'desc' },
    });

    // Remove password from response
    const sanitized = portalAccess.map(({ passwordHash, ...rest }) => rest);

    return apiResponse(sanitized);
  } catch (error: any) {
    console.error('Error fetching portal access:', error);
    return apiError(error.message || 'Failed to fetch portal access', 500);
  }
});

/**
 * POST /api/customer-portal - Create portal access for customer
 */
export const POST = withTenant(async (req: NextRequest, { tenantId }) => {
  try {
    const body = await req.json();
    const validated = PortalAccessCreateSchema.parse(body);

    // Verify customer exists
    const customer = await prisma.customers.findFirst({
      where: {
        id: validated.customerId,
        tenantId,
      },
    });

    if (!customer) {
      return apiError('Customer not found', 404);
    }

    // Check if portal access already exists
    const existing = await prisma.customerPortalAccess.findFirst({
      where: {
        OR: [
          { customerId: validated.customerId },
          { email: validated.email },
        ],
        tenantId,
      },
    });

    if (existing) {
      return apiError('Portal access already exists for this customer or email', 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validated.password, 10);

    const portalAccess = await prisma.customerPortalAccess.create({
      data: {
        customerId: validated.customerId,
        email: validated.email,
        passwordHash,
        canViewInvoices: validated.canViewInvoices,
        canMakePayments: validated.canMakePayments,
        canViewOrders: validated.canViewOrders,
        canSubmitTickets: validated.canSubmitTickets,
        isActive: true,
        tenantId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Remove password from response
    const { passwordHash: _, ...sanitizedAccess } = portalAccess;

    return apiResponse({
      message: 'Portal access created successfully',
      portalAccess: sanitizedAccess,
    }, 201);
  } catch (error: any) {
    console.error('Error creating portal access:', error);
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || 'Failed to create portal access', 500);
  }
});
