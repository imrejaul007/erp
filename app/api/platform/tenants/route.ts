import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'platform-secret-key-change-in-production';

// Middleware to verify platform admin token
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

// GET - List all tenants with stats
export async function GET(request: NextRequest) {
  try {
    const admin = verifyPlatformAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const plan = searchParams.get('plan');

    const where: any = {};
    if (status) where.status = status;
    if (plan) where.plan = plan;

    const tenants = await prisma.tenant.findMany({
      where,
      include: {
        _count: {
          select: {
            users: true,
            stores: true,
            products: true,
            orders: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get system-wide stats
    const stats = {
      total: tenants.length,
      active: tenants.filter(t => t.status === 'ACTIVE').length,
      trial: tenants.filter(t => t.status === 'TRIAL').length,
      suspended: tenants.filter(t => t.status === 'SUSPENDED').length,
      totalRevenue: tenants.reduce((sum, t) => sum + Number(t.totalSales), 0),
    };

    return NextResponse.json({ tenants, stats });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new tenant
export async function POST(request: NextRequest) {
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
      ownerName,
      ownerEmail,
      ownerPhone,
      ownerPassword,
      plan,
      businessType,
      tradeLicense,
      vatNumber,
      address,
      emirate,
      city,
      features,
    } = body;

    // Validation
    if (!name || !ownerName || !ownerEmail || !ownerPassword) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.users.findUnique({
      where: { email: ownerEmail.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug is unique
    let finalSlug = slug;
    let counter = 1;
    while (await prisma.tenant.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    // Calculate trial end date (14 days from now)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    // Create tenant and owner user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create tenant
      const tenant = await tx.tenant.create({
        data: {
          name,
          nameArabic,
          slug: finalSlug,
          ownerName,
          ownerEmail: ownerEmail.toLowerCase(),
          ownerPhone,
          businessType: businessType || 'RETAIL',
          tradeLicense,
          vatNumber,
          address,
          emirate,
          city,
          plan: plan || 'TRIAL',
          status: 'TRIAL',
          trialEndsAt,
          features: features || {
            pos: true,
            inventory: true,
            customers: true,
            production: plan === 'PROFESSIONAL' || plan === 'ENTERPRISE',
            events: plan === 'ENTERPRISE',
            api: plan === 'ENTERPRISE',
          },
          maxUsers: plan === 'BASIC' ? 5 : plan === 'PROFESSIONAL' ? 20 : 100,
          maxStores: plan === 'BASIC' ? 1 : plan === 'PROFESSIONAL' ? 5 : 999,
          maxProducts: plan === 'BASIC' ? 500 : plan === 'PROFESSIONAL' ? 5000 : 999999,
        },
      });

      // Hash password
      const hashedPassword = await bcrypt.hash(ownerPassword, 10);

      // Create owner user
      const user = await tx.user.create({
        data: {
          email: ownerEmail.toLowerCase(),
          password: hashedPassword,
          name: ownerName,
          phone: ownerPhone,
          role: 'SUPER_ADMIN',
          tenantId: tenant.id,
          isActive: true,
        },
      });

      // Create default category
      const category = await tx.category.create({
        data: {
          name: 'General',
          nameArabic: 'عام',
          description: 'Default category',
          tenantId: tenant.id,
        },
      });

      return { tenant, user, category };
    });

    return NextResponse.json({
      success: true,
      tenant: result.tenant,
      message: 'Tenant created successfully',
      credentials: {
        email: ownerEmail,
        password: ownerPassword,
        loginUrl: `https://oud-erp.onrender.com/login`,
      },
    });
  } catch (error) {
    console.error('Error creating tenant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
