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

    let tenant;
    let adminUser;
    let categoriesCount = 0;
    let brandsCount = 0;
    let storesCount = 0;

    // Check if already seeded
    const existingTenant = await prisma.tenant.findFirst();
    if (existingTenant) {
      tenant = existingTenant;

      // Count existing data
      categoriesCount = await prisma.category.count({ where: { tenantId: tenant.id } });
      brandsCount = await prisma.brand.count({ where: { tenantId: tenant.id } });
      storesCount = await prisma.store.count({ where: { tenantId: tenant.id } });

      return NextResponse.json({
        message: 'Database already seeded!',
        data: {
          tenant: { id: tenant.id, name: tenant.name },
          categoriesCount,
          brandsCount,
          storesCount,
        }
      }, { status: 200 });
    }

    // 1. Create Tenant
    console.log('Creating tenant...');
    tenant = await prisma.tenant.create({
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

    adminUser = await prisma.user.create({
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

    // 3. Create Categories (one by one to avoid count issue)
    console.log('Creating categories...');
    const categoriesData = [
      { name: 'Finished Perfumes', nameArabic: 'العطور الجاهزة', description: 'Ready-to-sell perfume products' },
      { name: 'Oud Wood', nameArabic: 'خشب العود', description: 'Raw oud wood materials' },
      { name: 'Essential Oils', nameArabic: 'الزيوت الأساسية', description: 'Essential oils and extracts' },
      { name: 'Packaging Materials', nameArabic: 'مواد التعبئة', description: 'Bottles, boxes, and packaging' },
      { name: 'Raw Materials', nameArabic: 'المواد الخام', description: 'Other raw materials' },
    ];

    for (const cat of categoriesData) {
      try {
        await prisma.category.create({
          data: {
            ...cat,
            isActive: true,
            tenantId: tenant.id,
          },
        });
        categoriesCount++;
      } catch (error: any) {
        // Skip if already exists
        if (error.code === 'P2002') {
          console.log(`Category "${cat.name}" already exists, skipping...`);
        } else {
          console.error(`Error creating category "${cat.name}":`, error.message);
        }
      }
    }

    console.log('✅ Categories created:', categoriesCount);

    // 4. Create Brands (one by one to avoid count issue)
    console.log('Creating brands...');
    const brandsData = [
      { name: 'Oud Palace', nameArabic: 'قصر العود', description: 'Premium oud perfumes' },
      { name: 'Royal Collection', nameArabic: 'المجموعة الملكية', description: 'Luxury perfume collection' },
      { name: 'Arabian Nights', nameArabic: 'ليالي العرب', description: 'Traditional Arabian fragrances' },
    ];

    for (const brand of brandsData) {
      try {
        await prisma.brand.create({
          data: {
            ...brand,
            isActive: true,
            tenantId: tenant.id,
          },
        });
        brandsCount++;
      } catch (error: any) {
        // Skip if already exists
        if (error.code === 'P2002') {
          console.log(`Brand "${brand.name}" already exists, skipping...`);
        } else {
          console.error(`Error creating brand "${brand.name}":`, error.message);
        }
      }
    }

    console.log('✅ Brands created:', brandsCount);

    // 5. Create Default Store
    console.log('Creating default store...');
    let store;
    try {
      store = await prisma.store.create({
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
      storesCount = 1;
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
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log('Store already exists, skipping...');
        store = await prisma.store.findFirst({ where: { tenantId: tenant.id } });
        storesCount = await prisma.store.count({ where: { tenantId: tenant.id } });
      } else {
        throw error;
      }
    }

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
