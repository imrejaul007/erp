import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const prisma = new PrismaClient();

// GET - Fetch branding settings
export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    // Get the first (and should be only) branding record
    let branding = await prisma.branding.findFirst({
      where: { isActive: true },
    });

    // If no branding exists, create default one
    if (!branding) {
      branding = await prisma.branding.create({
        data: {
          companyName: 'Oud & Perfume ERP',
          primaryColor: '#d97706',
          primaryHover: '#b45309',
          accentColor: '#92400e',
        },
      });
    }

    return apiResponse({
      success: true,
      data: branding,
    });
  } catch (error) {
    console.error('Error fetching branding:', error);
    return apiError('Failed to fetch branding settings', 500);
  }
});

// PUT - Update branding settings
export const PUT = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const body = await request.json();

    // Get existing branding or create new one
    const existing = await prisma.branding.findFirst({
      where: { isActive: true },
    });

    let branding;

    if (existing) {
      // Update existing
      branding = await prisma.branding.update({
        where: { id: existing.id },
        data: body,
      });
    } else {
      // Create new
      branding = await prisma.branding.create({
        data: body,
      });
    }

    return apiResponse({
      success: true,
      data: branding,
      message: 'Branding updated successfully',
    });
  } catch (error) {
    console.error('Error updating branding:', error);
    return apiError('Failed to update branding settings', 500);
  }
});
