import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'platform-secret-key-change-in-production';

function verifyPlatformAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = verify(token, JWT_SECRET) as any;
    if (decoded.type !== 'platform_admin') {
      return null;
    }
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET - Get tenant details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = verifyPlatformAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: params.id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            lastLogin: true,
          },
        },
        stores: true,
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            users: true,
            stores: true,
            products: true,
            customers: true,
            orders: true,
          },
        },
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ tenant });
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update tenant
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = verifyPlatformAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      nameArabic,
      status,
      plan,
      isActive,
      maxUsers,
      maxStores,
      maxProducts,
      features,
      suspensionReason,
    } = body;

    const updateData: any = {};

    if (name) updateData.name = name;
    if (nameArabic) updateData.nameArabic = nameArabic;
    if (status) updateData.status = status;
    if (plan) updateData.plan = plan;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (maxUsers) updateData.maxUsers = maxUsers;
    if (maxStores) updateData.maxStores = maxStores;
    if (maxProducts) updateData.maxProducts = maxProducts;
    if (features) updateData.features = features;
    if (suspensionReason) updateData.suspensionReason = suspensionReason;

    if (status === 'SUSPENDED') {
      updateData.suspendedAt = new Date();
    }

    const tenant = await prisma.tenant.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      tenant,
      message: 'Tenant updated successfully',
    });
  } catch (error) {
    console.error('Error updating tenant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete tenant (dangerous!)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = verifyPlatformAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only PLATFORM_OWNER can delete tenants
    const platformAdmin = await prisma.platformAdmin.findUnique({
      where: { id: admin.id },
    });

    if (platformAdmin?.role !== 'PLATFORM_OWNER') {
      return NextResponse.json(
        { error: 'Only platform owner can delete tenants' },
        { status: 403 }
      );
    }

    await prisma.tenant.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Tenant deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting tenant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
