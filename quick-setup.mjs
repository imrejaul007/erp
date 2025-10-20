import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function quickSetup() {
  try {
    console.log('Quick setup with raw SQL...\n');

    // Get or create tenant
    console.log('Step 1: Tenant...');
    let tenant = await prisma.$queryRaw`SELECT * FROM tenants WHERE slug = 'default-org' LIMIT 1`;
    const tenantId = tenant[0]?.id || randomUUID();

    if (tenant.length === 0) {
      await prisma.$executeRaw`
        INSERT INTO tenants (id, name, slug, "isActive", status, plan, "createdAt", "updatedAt")
        VALUES (${tenantId}, 'Default Organization', 'default-org', true, 'ACTIVE', 'FREE', NOW(), NOW())
      `;
      console.log('✅ Tenant created');
    } else {
      console.log('✅ Tenant exists');
    }

    // Get or create user
    console.log('\nStep 2: User...');
    const existingUser = await prisma.$queryRaw`SELECT * FROM users WHERE email = 'admin@oudperfume.ae' LIMIT 1`;

    if (existingUser.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const userId = randomUUID();

      await prisma.$executeRaw`
        INSERT INTO users (id, email, username, "firstName", "lastName", password, "isActive", language, timezone, "tenantId", "createdAt", "updatedAt")
        VALUES (${userId}, 'admin@oudperfume.ae', 'admin', 'Admin', 'User', ${hashedPassword}, true, 'en', 'Asia/Dubai', ${tenantId}, NOW(), NOW())
      `;
      console.log('✅ User created (Email: admin@oudperfume.ae, Password: admin123)');
    } else {
      console.log('✅ User exists');
    }

    // Create categories
    console.log('\nStep 3: Categories...');
    const categoryCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM categories WHERE "tenantId" = ${tenantId}`;

    if (Number(categoryCount[0].count) === 0) {
      const cats = [
        ['Perfumes', 'عطور'],
        ['Oud', 'عود'],
        ['Incense', 'بخور'],
        ['Oils', 'زيوت'],
        ['General Products', 'منتجات عامة']
      ];

      for (const [name, nameArabic] of cats) {
        await prisma.$executeRaw`
          INSERT INTO categories (id, name, "nameArabic", "isActive", "tenantId", "createdAt")
          VALUES (gen_random_uuid()::text, ${name}, ${nameArabic}, true, ${tenantId}, NOW())
        `;
      }
      console.log('✅ Created 5 categories');
    } else {
      console.log('✅ Categories exist');
    }

    // Create brands
    console.log('\nStep 4: Brands...');
    const brandCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM brands WHERE "tenantId" = ${tenantId}`;

    if (Number(brandCount[0].count) === 0) {
      const brands = [
        ['House Brand', 'العلامة التجارية'],
        ['Premium Collection', 'المجموعة الفاخرة'],
        ['No Brand', 'بدون علامة']
      ];

      for (const [name, nameArabic] of brands) {
        await prisma.$executeRaw`
          INSERT INTO brands (id, name, "nameArabic", "isActive", "tenantId", "createdAt")
          VALUES (gen_random_uuid()::text, ${name}, ${nameArabic}, true, ${tenantId}, NOW())
        `;
      }
      console.log('✅ Created 3 brands');
    } else {
      console.log('✅ Brands exist');
    }

    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅  SETUP COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Login Credentials:');
    console.log('   Email: admin@oudperfume.ae');
    console.log('   Password: admin123');
    console.log('\n✅ Your application is ready to use!');
    console.log('   - Tenant configured with multi-tenancy');
    console.log('   - User has tenantId assigned');
    console.log('   - Categories and brands created');
    console.log('   - Products table ready\n');
    console.log('You can now LOGIN and CREATE PRODUCTS!\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

quickSetup();
