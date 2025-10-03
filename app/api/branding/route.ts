import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const prisma = new PrismaClient();

// GET - Fetch branding settings
export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // Get tenant branding information
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        name: true,
        logoUrl: true,
        primaryColor: true,
        secondaryColor: true,
      }
    });

    if (!tenant) {
      return apiError('Tenant not found', 404);
    }

    // Map tenant branding to expected format
    const branding = {
      companyName: tenant.name,
      primaryColor: tenant.primaryColor || '#d97706',
      primaryHover: tenant.primaryColor || '#b45309',
      accentColor: tenant.secondaryColor || '#92400e',
      logoUrl: tenant.logoUrl,
    };

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
    const body = await request.json();

    // Map branding fields to tenant fields
    const updateData: any = {};

    if (body.companyName) updateData.name = body.companyName;
    if (body.primaryColor) updateData.primaryColor = body.primaryColor;
    if (body.accentColor) updateData.secondaryColor = body.accentColor;
    if (body.logoUrl !== undefined) updateData.logoUrl = body.logoUrl;

    // Update tenant branding
    const tenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: updateData,
      select: {
        name: true,
        logoUrl: true,
        primaryColor: true,
        secondaryColor: true,
      }
    });

    // Map back to expected branding format
    const branding = {
      companyName: tenant.name,
      primaryColor: tenant.primaryColor || '#d97706',
      primaryHover: tenant.primaryColor || '#b45309',
      accentColor: tenant.secondaryColor || '#92400e',
      logoUrl: tenant.logoUrl,
    };

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
