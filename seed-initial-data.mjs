import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedInitialData() {
  try {
    console.log('Seeding initial data for your application...\n');

    // Step 1: Get tenant and user
    console.log('Step 1: Getting tenant and user...');
    const tenant = await prisma.tenants.findFirst();
    const user = await prisma.users.findFirst();

    if (!tenant || !user) {
      console.log('❌ Tenant or User not found!');
      return;
    }

    console.log(`✅ Tenant: ${tenant.name}`);
    console.log(`✅ User: ${user.email}`);

    // Step 2: Create default categories
    console.log('\nStep 2: Creating default categories...');

    const categories = [
      { name: 'Perfumes', nameArabic: 'عطور' },
      { name: 'Oud', nameArabic: 'عود' },
      { name: 'Incense', nameArabic: 'بخور' },
      { name: 'Oils', nameArabic: 'زيوت' },
      { name: 'General Products', nameArabic: 'منتجات عامة' }
    ];

    for (const cat of categories) {
      const existing = await prisma.$queryRaw`
        SELECT * FROM categories WHERE name = ${cat.name} AND "tenantId" = ${tenant.id} LIMIT 1
      `;

      if (existing.length === 0) {
        await prisma.$executeRaw`
          INSERT INTO categories (id, name, "nameArabic", "isActive", "tenantId", "createdAt")
          VALUES (gen_random_uuid()::text, ${cat.name}, ${cat.nameArabic}, true, ${tenant.id}, NOW())
        `;
        console.log(`   ✅ Created category: ${cat.name}`);
      } else {
        console.log(`   ⏭️  Category already exists: ${cat.name}`);
      }
    }

    // Step 3: Create default brands
    console.log('\nStep 3: Creating default brands...');

    const brands = [
      { name: 'House Brand', nameArabic: 'العلامة التجارية' },
      { name: 'Premium Collection', nameArabic: 'المجموعة الفاخرة' },
      { name: 'No Brand', nameArabic: 'بدون علامة' }
    ];

    for (const brand of brands) {
      const existing = await prisma.$queryRaw`
        SELECT * FROM brands WHERE name = ${brand.name} AND "tenantId" = ${tenant.id} LIMIT 1
      `;

      if (existing.length === 0) {
        await prisma.$executeRaw`
          INSERT INTO brands (id, name, "nameArabic", "isActive", "tenantId", "createdAt")
          VALUES (gen_random_uuid()::text, ${brand.name}, ${brand.nameArabic}, true, ${tenant.id}, NOW())
        `;
        console.log(`   ✅ Created brand: ${brand.name}`);
      } else {
        console.log(`   ⏭️  Brand already exists: ${brand.name}`);
      }
    }

    // Step 4: Test creating a product
    console.log('\nStep 4: Testing product creation...');

    const category = await prisma.$queryRaw`
      SELECT id FROM categories WHERE "tenantId" = ${tenant.id} LIMIT 1
    `;

    const brand = await prisma.$queryRaw`
      SELECT id FROM brands WHERE "tenantId" = ${tenant.id} LIMIT 1
    `;

    const testSKU = 'TEST-OUD-' + Date.now();
    await prisma.$executeRaw`
      INSERT INTO products (
        id, name, "nameArabic", sku, "categoryId", "brandId", unit,
        "unitPrice", "costPrice", "stockQuantity", "minStock", "maxStock",
        "isActive", "tenantId", "createdById", "createdAt", "updatedAt"
      )
      VALUES (
        gen_random_uuid()::text,
        'Test Oud Perfume',
        'عطر عود تجريبي',
        ${testSKU},
        ${category[0].id},
        ${brand[0].id},
        'PIECE',
        150.00,
        75.00,
        100,
        10,
        500,
        true,
        ${tenant.id},
        ${user.id},
        NOW(),
        NOW()
      )
    `;

    const testProduct = await prisma.$queryRaw`
      SELECT * FROM products WHERE sku = ${testSKU}
    `;

    console.log(`   ✅ Test product created successfully!`);
    console.log(`      ID: ${testProduct[0].id}`);
    console.log(`      Name: ${testProduct[0].name}`);
    console.log(`      SKU: ${testProduct[0].sku}`);

    // Clean up test product
    await prisma.$executeRaw`
      DELETE FROM products WHERE sku = ${testSKU}
    `;
    console.log('   ✅ Test product cleaned up');

    console.log('\n✅ DATABASE IS FULLY READY!');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Tenants table: Ready');
    console.log('✅ Users with tenantId: Ready');
    console.log('✅ Categories: Created');
    console.log('✅ Brands: Created');
    console.log('✅ Products table: Ready');
    console.log('\nYou can now use your application to create products!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
    console.error('Details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedInitialData();
