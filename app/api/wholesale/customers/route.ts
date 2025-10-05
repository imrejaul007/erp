import { NextRequest } from 'next/server';
import { withTenant } from '@/lib/with-tenant';
import { apiResponse, apiError } from '@/lib/api-response';
import prisma from '@/lib/prisma';

export const GET = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const customers = await prisma.wholesaleCustomer.findMany({
      where: { tenantId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        priceList: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse({ customers });
  } catch (error) {
    console.error('Wholesale Customers Error:', error);
    return apiError('Failed to fetch wholesale customers', 500);
  }
});

export const POST = withTenant(async (request: NextRequest, { tenantId }) => {
  try {
    const body = await request.json();
    const {
      customerId,
      businessName,
      tradeLicense,
      vatNumber,
      creditLimit = 0,
      paymentTerms = 30,
      discountPercent = 0,
      priceListId,
    } = body;

    if (!customerId || !businessName) {
      return apiError('Missing required fields', 400);
    }

    const wholesaleCustomer = await prisma.wholesaleCustomer.create({
      data: {
        customerId,
        businessName,
        tradeLicense,
        vatNumber,
        creditLimit,
        paymentTerms,
        discountPercent,
        priceListId,
        tenantId,
      },
      include: {
        customer: true,
        priceList: true,
      },
    });

    return apiResponse(wholesaleCustomer, 201);
  } catch (error) {
    console.error('Wholesale Customer Creation Error:', error);
    return apiError('Failed to create wholesale customer', 500);
  }
});
