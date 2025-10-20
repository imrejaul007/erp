import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query', 'error'] });

async function testAPILogic() {
  try {
    console.log('Testing the API logic that runs when you try to create a product...\n');

    // Step 1: Simulate getting the user from session (like withTenant middleware does)
    console.log('Step 1: Getting user (simulating session)...');
    const user = await prisma.users.findFirst({
      select: {
        id: true,
        email: true,
        tenantId: true,
      }
    });

    if (!user) {
      console.log('❌ No user found!');
      return;
    }

    console.log(`✅ User: ${user.email}`);
    console.log(`   TenantId: ${user.tenantId}`);

    // Step 2: Check if tenant exists
    console.log('\nStep 2: Checking tenant...');
    const tenant = await prisma.tenants.findUnique({
      where: { id: user.tenantId }
    });

    if (!tenant) {
      console.log('❌ Tenant not found!');
      return;
    }

    console.log(`✅ Tenant: ${tenant.name}`);

    // Step 3: Try to find if there are any categories
    console.log('\nStep 3: Checking if categories table exists and has data...');

    // First check what tables we have
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('categories', 'Category')
      ORDER BY table_name
    `;

    console.log('Category tables found:', tables);

    if (tables.length === 0) {
      console.log('\n❌ PROBLEM: No categories table exists!');
      console.log('   Your product creation requires a categoryId, but the table does not exist.');
      console.log('   Creating categories table...');

      // Create categories table
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          name TEXT NOT NULL,
          "nameArabic" TEXT,
          description TEXT,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "tenantId" TEXT NOT NULL,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          FOREIGN KEY ("tenantId") REFERENCES tenants(id) ON DELETE CASCADE
        )
      `;

      console.log('   ✅ Categories table created!');

      // Create a default category
      const defaultCategory = await prisma.$queryRaw`
        INSERT INTO categories (id, name, "tenantId")
        VALUES (gen_random_uuid()::text, 'General Products', ${user.tenantId})
        RETURNING id, name
      `;

      console.log(`   ✅ Default category created: ${defaultCategory[0].name}`);
    }

    // Step 4: Create a test product
    console.log('\nStep 4: Testing product creation...');

    // Get a category
    const category = await prisma.$queryRaw`
      SELECT id FROM categories WHERE "tenantId" = ${user.tenantId} LIMIT 1
    `;

    if (category.length === 0) {
      console.log('❌ No category found for this tenant');
      return;
    }

    const categoryId = category[0].id;
    console.log(`   Using categoryId: ${categoryId}`);

    // Create product directly with raw SQL to test
    const testSKU = 'TEST-' + Date.now();
    const testProduct = await prisma.$queryRaw`
      INSERT INTO products (
        id, name, sku, "categoryId", unit, "unitPrice",
        "stockQuantity", "minStock", "isActive", "tenantId",
        "createdAt", "updatedAt"
      )
      VALUES (
        gen_random_uuid()::text,
        'Test Product',
        ${testSKU},
        ${categoryId},
        'piece',
        100.00,
        10,
        5,
        true,
        ${user.tenantId},
        NOW(),
        NOW()
      )
      RETURNING id, name, sku
    `;

    console.log(`   ✅ Product created: ${testProduct[0].name} (${testProduct[0].sku})`);

    // Verify it exists
    const savedProduct = await prisma.$queryRaw`
      SELECT * FROM products WHERE sku = ${testSKU}
    `;

    if (savedProduct.length > 0) {
      console.log(`   ✅ Product verified in database!`);
      console.log(`      ID: ${savedProduct[0].id}`);
      console.log(`      Name: ${savedProduct[0].name}`);
      console.log(`      TenantId: ${savedProduct[0].tenantId}`);
    }

    // Clean up
    await prisma.$queryRaw`
      DELETE FROM products WHERE sku = ${testSKU}
    `;
    console.log('   ✅ Test product cleaned up');

    console.log('\n✅ DATABASE IS WORKING CORRECTLY!');
    console.log('\nIf you still cannot save data through the UI, the issue is likely:');
    console.log('1. Session/Authentication problem - user not logged in properly');
    console.log('2. Frontend validation error - check browser console');
    console.log('3. API route error - check Next.js terminal logs');
    console.log('4. Missing required fields in the form');

  } catch (error) {
    console.error('\n❌ Error:', error);
    console.error('Error message:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testAPILogic();
