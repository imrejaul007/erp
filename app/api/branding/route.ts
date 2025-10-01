import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch branding settings
export async function GET() {
  try {
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

    return NextResponse.json({
      success: true,
      data: branding,
    });
  } catch (error) {
    console.error('Error fetching branding:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch branding settings',
      },
      { status: 500 }
    );
  }
}

// PUT - Update branding settings
export async function PUT(request: NextRequest) {
  try {
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

    return NextResponse.json({
      success: true,
      data: branding,
      message: 'Branding updated successfully',
    });
  } catch (error) {
    console.error('Error updating branding:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update branding settings',
      },
      { status: 500 }
    );
  }
}
