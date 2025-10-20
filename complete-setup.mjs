import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function completeSetup() {
  try {
    console.log('Setting up complete application with all required data...\n');

    // Step 1: Create or get tenant
    console.log('Step 1: Creating/getting tenant...');
    let tenant = await prisma.tenants.findUnique({ where: { slug: 'default-org' } });

    if (!tenant) {
      tenant = await prisma.tenants.create({
        data: {
          id: randomUUID(),
          name: 'Default Organization',
          slug: 'default-org',
          isActive: true,
          status: 'ACTIVE',
          plan: 'FREE'
        }
      });
      console.log(`✅ Tenant created: ${tenant.name} (ID: ${tenant.id})`);
    } else {
      console.log(`✅ Tenant found: ${tenant.name} (ID: ${tenant.id})`);
    }

    // Step 2: Create or get user
    console.log('\nStep 2: Creating/getting admin user...');
    let user = await prisma.users.findUnique({ where: { email: 'admin@oudperfume.ae' } });

    if (!user) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      user = await prisma.users.create({
        data: {
          id: randomUUID(),
          email: 'admin@oudperfume.ae',
          username: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          name: 'Admin User',
          password: hashedPassword,
          role: 'OWNER',
          isActive: true,
          isVerified: true,
          language: 'en',
          timezone: 'Asia/Dubai',
          tenantId: tenant.id
        }
      });
      console.log(`✅ User created: ${user.email} (Password: admin123)`);
    } else {
      console.log(`✅ User found: ${user.email}`);
    }

    // Step 3: Create categories
    console.log('\nStep 3: Creating categories...');
    const categories = await prisma.categories.createMany({
      data: [
        { id: randomUUID(), name: 'Perfumes', nameArabic: 'عطور', isActive: true, tenantId: tenant.id },
        { id: randomUUID(), name: 'Oud', nameArabic: 'عود', isActive: true, tenantId: tenant.id },
        { id: randomUUID(), name: 'Incense', nameArabic: 'بخور', isActive: true, tenantId: tenant.id },
        { id: randomUUID(), name: 'Oils', nameArabic: 'زيوت', isActive: true, tenantId: tenant.id },
        { id: randomUUID(), name: 'General Products', nameArabic: 'منتجات عامة', isActive: true, tenantId: tenant.id }
      ]
    });
    console.log(`✅ Created ${categories.count} categories`);

    // Step 4: Create brands
    console.log('\nStep 4: Creating brands...');
    const brands = await prisma.brands.createMany({
      data: [
        { id: randomUUID(), name: 'House Brand', nameArabic: 'العلامة التجارية', isActive: true, tenantId: tenant.id },
        { id: randomUUID(), name: 'Premium Collection', nameArabic: 'المجموعة الفاخرة', isActive: true, tenantId: tenant.id },
        { id: randomUUID(), name: 'No Brand', nameArabic: 'بدون علامة', isActive: true, tenantId: tenant.id }
      ]
    });
    console.log(`✅ Created ${brands.count} brands`);

    // Step 5: Test product creation
    console.log('\nStep 5: Testing product creation...');
    const firstCategory = await prisma.categories.findFirst({ where: { tenantId: tenant.id } });
    const firstBrand = await prisma.brands.findFirst({ where: { tenantId: tenant.id } });

    const testProduct = await prisma.products.create({
      data: {
        id: randomUUID(),
        name: 'Test Oud Perfume',
        nameArabic: 'عطر عود تجريبي',
        sku: 'TEST-OUD-001',
        categoryId: firstCategory.id,
        brandId: firstBrand.id,
        unit: 'PIECE',
        unitPrice: 150.00,
        costPrice: 75.00,
        stockQuantity: 100,
        minStock: 10,
        maxStock: 500,
        isActive: true,
        tenantId: tenant.id,
        createdById: user.id
      }
    });

    console.log(`✅ Test product created: ${testProduct.name} (SKU: ${testProduct.sku})`);

    // Clean up test product
    await prisma.products.delete({ where: { id: testProduct.id } });
    console.log('✅ Test product cleaned up');

    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅  SETUP COMPLETE - YOUR APPLICATION IS READY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Login Credentials:');
    console.log('   Email: admin@oudperfume.ae');
    console.log('   Password: admin123');
    console.log('\n✅ Database Structure:');
    console.log('   - Tenants: Ready');
    console.log('   - Users: Ready (with tenantId)');
    console.log('   - Categories: 5 created');
    console.log('   - Brands: 3 created');
    console.log('   - Products table: Ready for use');
    console.log('\n🎉 You can now login and create products!\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    console.error('Details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

completeSetup();
