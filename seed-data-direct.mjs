import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function seed() {
  try {
    console.log('🌱 Starting direct database seed...');

    // Check if tenant exists
    const existingTenant = await prisma.$queryRaw`SELECT * FROM tenants LIMIT 1`;

    let tenantId;
    if (existingTenant.length > 0) {
      console.log('✅ Tenant already exists');
      tenantId = existingTenant[0].id;
      console.log('Using existing tenant:', existingTenant[0].name);
    } else {
      // Create tenant
      tenantId = 'clt' + Date.now() + Math.random().toString(36).substr(2, 9);
      await prisma.$executeRaw`
        INSERT INTO tenants (id, name, slug, "ownerName", "ownerEmail", "ownerPhone", address, emirate, city, "businessType", plan, "isActive", status, features, "createdAt", "updatedAt")
        VALUES (${tenantId}, 'Oud Palace', 'oud-palace', 'Admin User', 'admin@oudpalace.ae', '+971501234567', 'Dubai, UAE', 'Dubai', 'Dubai', 'RETAIL', 'PROFESSIONAL', true, 'ACTIVE', '{}'::jsonb, NOW(), NOW())
      `;
      console.log('✅ Tenant created');
    }

    // Check if admin user exists
    const existingUser = await prisma.$queryRaw`SELECT * FROM users WHERE email = 'admin@oudpalace.ae' LIMIT 1`;
    let userId;
    if (existingUser.length > 0) {
      console.log('✅ Admin user already exists');
      userId = existingUser[0].id;
    } else {
      // Create admin user
      const hashedPw = await hash('admin123', 12);
      userId = 'clu' + Date.now() + Math.random().toString(36).substr(2, 9);
      await prisma.$executeRaw`
        INSERT INTO users (id, name, email, password, role, "isActive", "isVerified", "tenantId", "createdAt", "updatedAt")
        VALUES (${userId}, 'Admin User', 'admin@oudpalace.ae', ${hashedPw}, 'OWNER', true, true, ${tenantId}, NOW(), NOW())
      `;
      console.log('✅ Admin user created');
    }

    // Create categories
    const categories = [
      ['Finished Perfumes', 'العطور الجاهزة', 'Ready-to-sell perfume products'],
      ['Oud Wood', 'خشب العود', 'Raw oud wood materials'],
      ['Essential Oils', 'الزيوت الأساسية', 'Essential oils and extracts'],
      ['Packaging Materials', 'مواد التعبئة', 'Bottles, boxes, and packaging'],
      ['Raw Materials', 'المواد الخام', 'Other raw materials'],
    ];

    for (const [name, nameArabic, desc] of categories) {
      const catId = 'clc' + Date.now() + Math.random().toString(36).substr(2, 9);
      await prisma.$executeRaw`
        INSERT INTO categories (id, name, "nameArabic", description, "isActive", "tenantId", "createdAt")
        VALUES (${catId}, ${name}, ${nameArabic}, ${desc}, true, ${tenantId}, NOW())
      `;
    }
    console.log('✅ 5 categories created');

    // Create brands
    const brands = [
      ['Oud Palace', 'قصر العود', 'Premium oud perfumes'],
      ['Royal Collection', 'المجموعة الملكية', 'Luxury perfume collection'],
      ['Arabian Nights', 'ليالي العرب', 'Traditional Arabian fragrances'],
    ];

    for (const [name, nameArabic, desc] of brands) {
      const brandId = 'clb' + Date.now() + Math.random().toString(36).substr(2, 9);
      await prisma.$executeRaw`
        INSERT INTO brands (id, name, "nameArabic", description, "isActive", "tenantId", "createdAt")
        VALUES (${brandId}, ${name}, ${nameArabic}, ${desc}, true, ${tenantId}, NOW())
      `;
    }
    console.log('✅ 3 brands created');

    // Create store
    const storeId = 'cls' + Date.now() + Math.random().toString(36).substr(2, 9);
    await prisma.$executeRaw`
      INSERT INTO stores (id, name, "nameArabic", code, address, emirate, city, phone, email, "isActive", "createdById", "tenantId", "createdAt", "updatedAt")
      VALUES (${storeId}, 'Main Store', 'المتجر الرئيسي', 'MAIN-001', 'Dubai Mall, Dubai', 'Dubai', 'Dubai', '+971501234567', 'store@oudpalace.ae', true, ${userId}, ${tenantId}, NOW(), NOW())
    `;
    console.log('✅ Store created');

    // Assign user to store
    const userStoreId = 'clus' + Date.now() + Math.random().toString(36).substr(2, 9);
    await prisma.$executeRaw`
      INSERT INTO user_stores (id, "userId", "storeId", role, "tenantId", "createdAt", "updatedAt")
      VALUES (${userStoreId}, ${userId}, ${storeId}, 'MANAGER', ${tenantId}, NOW(), NOW())
    `;
    console.log('✅ User assigned to store');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nLogin with:');
    console.log('  Email: admin@oudpalace.ae');
    console.log('  Password: admin123');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
