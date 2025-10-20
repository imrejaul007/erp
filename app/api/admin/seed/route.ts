import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

/**
 * ADMIN SEED ENDPOINT
 * Call this once to populate initial data
 * DELETE THIS FILE AFTER SEEDING FOR SECURITY!
 */

export async function POST(req: NextRequest) {
  try {
    console.log('🌱 Starting database seed...');

    // Check if already seeded
    const existingTenant = await prisma.tenant.findFirst();
    if (existingTenant) {
      return NextResponse.json({
        message: 'Database already seeded!',
        tenant: existingTenant.name,
      }, { status: 200 });
    }

    // 1. Create Tenant
    console.log('Creating tenant...');
    const tenant = await prisma.tenant.create({
      data: {
        name: 'Oud Palace',
        slug: 'oud-palace',
        email: 'admin@oudpalace.ae',
        phone: '+971501234567',
        address: 'Dubai, UAE',
        country: 'AE',
        timezone: 'Asia/Dubai',
        currency: 'AED',
        businessType: 'RETAIL',
        subscriptionPlan: 'PROFESSIONAL',
        subscriptionStatus: 'ACTIVE',
        isActive: true,
        status: 'ACTIVE',
      },
    });

    console.log('✅ Tenant created:', tenant.id);

    // 2. Create Admin User
    console.log('Creating admin user...');
    const hashedPassword = await hash('admin123', 12);

    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@oudpalace.ae',
        password: hashedPassword,
        role: 'OWNER',
        isActive: true,
        isVerified: true,
        tenantId: tenant.id,
      },
    });

    console.log('✅ Admin user created:', adminUser.id);

    // 3. Create Categories
    console.log('Creating categories...');
    const categoriesData = [
      {
        name: 'Finished Perfumes',
        nameArabic: 'العطور الجاهزة',
        description: 'Ready-to-sell perfume products',
        isActive: true,
        tenantId: tenant.id,
      },
      {
        name: 'Oud Wood',
        nameArabic: 'خشب العود',
        description: 'Raw oud wood materials',
        isActive: true,
        tenantId: tenant.id,
      },
      {
        name: 'Essential Oils',
        nameArabic: 'الزيوت الأساسية',
        description: 'Essential oils and extracts',
        isActive: true,
        tenantId: tenant.id,
      },
      {
        name: 'Packaging Materials',
        nameArabic: 'مواد التعبئة',
        description: 'Bottles, boxes, and packaging',
        isActive: true,
        tenantId: tenant.id,
      },
      {
        name: 'Raw Materials',
        nameArabic: 'المواد الخام',
        description: 'Other raw materials',
        isActive: true,
        tenantId: tenant.id,
      },
    ];

    const categories = await prisma.category.createMany({
      data: categoriesData,
      skipDuplicates: true,
    });

    const categoriesCount = categories.count || categoriesData.length;
    console.log('✅ Categories created:', categoriesCount);

    // 4. Create Brands
    console.log('Creating brands...');
    const brandsData = [
      {
        name: 'Oud Palace',
        nameArabic: 'قصر العود',
        description: 'Premium oud perfumes',
        isActive: true,
        tenantId: tenant.id,
      },
      {
        name: 'Royal Collection',
        nameArabic: 'المجموعة الملكية',
        description: 'Luxury perfume collection',
        isActive: true,
        tenantId: tenant.id,
      },
      {
        name: 'Arabian Nights',
        nameArabic: 'ليالي العرب',
        description: 'Traditional Arabian fragrances',
        isActive: true,
        tenantId: tenant.id,
      },
    ];

    const brands = await prisma.brand.createMany({
      data: brandsData,
      skipDuplicates: true,
    });

    const brandsCount = brands.count || brandsData.length;
    console.log('✅ Brands created:', brandsCount);

    // 5. Create Default Store
    console.log('Creating default store...');
    const store = await prisma.store.create({
      data: {
        name: 'Main Store',
        nameArabic: 'المتجر الرئيسي',
        code: 'MAIN-001',
        address: 'Dubai Mall, Dubai',
        emirate: 'Dubai',
        city: 'Dubai',
        phone: '+971501234567',
        email: 'store@oudpalace.ae',
        isActive: true,
        createdById: adminUser.id,
        tenantId: tenant.id,
      },
    });

    console.log('✅ Store created:', store.id);

    // 6. Assign user to store
    await prisma.userStore.create({
      data: {
        userId: adminUser.id,
        storeId: store.id,
        role: 'MANAGER',
        tenantId: tenant.id,
      },
    });

    console.log('✅ User assigned to store');

    return NextResponse.json({
      success: true,
      message: '🎉 Database seeded successfully!',
      data: {
        tenant: {
          id: tenant.id,
          name: tenant.name,
        },
        adminUser: {
          id: adminUser.id,
          email: adminUser.email,
          password: 'admin123', // Show password for first login
        },
        categoriesCreated: categoriesCount,
        brandsCreated: brandsCount,
        storesCreated: 1,
      },
      nextSteps: [
        '1. Login with: admin@oudpalace.ae / admin123',
        '2. Try creating a product now',
        '3. DELETE this seed endpoint for security: /app/api/admin/seed/route.ts',
      ],
    });

  } catch (error: any) {
    console.error('❌ Seed error:', error);

    // If error is about existing data, that's okay
    if (error.code === 'P2002') {
      return NextResponse.json({
        message: 'Database already has data. Seeding skipped.',
        error: 'Unique constraint violation',
      }, { status: 200 });
    }

    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.toString(),
    }, { status: 500 });
  }
}

// GET method to check if seeded
export async function GET() {
  try {
    const tenantCount = await prisma.tenant.count();
    const categoryCount = await prisma.category.count();
    const brandCount = await prisma.brand.count();
    const userCount = await prisma.user.count();
    const storeCount = await prisma.store.count();

    const isSeeded = tenantCount > 0 && categoryCount > 0;

    return NextResponse.json({
      isSeeded,
      counts: {
        tenants: tenantCount,
        categories: categoryCount,
        brands: brandCount,
        users: userCount,
        stores: storeCount,
      },
      message: isSeeded
        ? '✅ Database is seeded'
        : '❌ Database needs seeding - call POST /api/admin/seed',
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
    }, { status: 500 });
  }
}
