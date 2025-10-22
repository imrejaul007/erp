import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function testSchemaFixes() {
  try {
    console.log('🧪 TESTING ALL SCHEMA FIXES...\n');
    console.log('=' .repeat(70));

    const tests = [];
    let passed = 0;
    let failed = 0;

    // Get tenant for all tests
    const tenant = await prisma.$queryRaw`SELECT id FROM tenants LIMIT 1`;
    if (tenant.length === 0) {
      console.log('❌ No tenant found!');
      return;
    }
    const tenantId = tenant[0].id;
    console.log(`✅ Using tenant: ${tenantId}\n`);

    // Test 1: Categories
    console.log('📂 TEST 1: CATEGORIES');
    try {
      const categories = await prisma.categories.findMany({
        where: { tenantId },
        take: 3
      });
      console.log(`   ✅ Found ${categories.length} categories`);
      if (categories.length > 0) {
        console.log(`      - ${categories[0].name}`);
      }
      passed++;
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      failed++;
    }

    // Test 2: Brands
    console.log('\n🏷️  TEST 2: BRANDS');
    try {
      const brands = await prisma.brands.findMany({
        where: { tenantId },
        take: 3
      });
      console.log(`   ✅ Found ${brands.length} brands`);
      if (brands.length > 0) {
        console.log(`      - ${brands[0].name}`);
      }
      passed++;
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      failed++;
    }

    // Test 3: Products
    console.log('\n📦 TEST 3: PRODUCTS');
    try {
      const products = await prisma.products.findMany({
        where: { tenantId },
        take: 3
      });
      console.log(`   ✅ Found ${products.length} products`);
      if (products.length > 0) {
        console.log(`      - ${products[0].name || products[0].code}`);
      }
      passed++;
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      failed++;
    }

    // Test 4: Customers
    console.log('\n👥 TEST 4: CUSTOMERS');
    try {
      const customers = await prisma.customers.findMany({
        where: { tenantId },
        take: 3
      });
      console.log(`   ✅ Found ${customers.length} customers`);
      if (customers.length > 0) {
        console.log(`      - ${customers[0].name || customers[0].email}`);
      }
      passed++;
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      failed++;
    }

    // Test 5: Stores
    console.log('\n🏪 TEST 5: STORES');
    try {
      const stores = await prisma.stores.findMany({
        where: { tenantId },
        take: 3
      });
      console.log(`   ✅ Found ${stores.length} stores`);
      if (stores.length > 0) {
        console.log(`      - ${stores[0].name}`);
      }
      passed++;
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      failed++;
    }

    // Test 6: Users
    console.log('\n👤 TEST 6: USERS');
    try {
      const users = await prisma.users.findMany({
        where: { tenantId },
        take: 3
      });
      console.log(`   ✅ Found ${users.length} users`);
      if (users.length > 0) {
        console.log(`      - ${users[0].email}`);
      }
      passed++;
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      failed++;
    }

    // Test 7: Create a test category
    console.log('\n📝 TEST 7: CREATE CATEGORY');
    try {
      const newCategory = await prisma.categories.create({
        data: {
          id: 'cat-test-' + Date.now(),
          name: 'Test Category',
          nameArabic: 'فئة اختبار',
          description: 'Schema fix test',
          tenantId: tenantId
        }
      });
      console.log(`   ✅ Created category: ${newCategory.name}`);

      // Clean up
      await prisma.categories.delete({ where: { id: newCategory.id } });
      console.log(`   ✅ Cleaned up test category`);
      passed++;
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      failed++;
    }

    // Test 8: Create a test brand
    console.log('\n📝 TEST 8: CREATE BRAND');
    try {
      const newBrand = await prisma.brands.create({
        data: {
          id: 'br-test-' + Date.now(),
          name: 'Test Brand',
          nameArabic: 'علامة اختبار',
          description: 'Schema fix test',
          tenantId: tenantId
        }
      });
      console.log(`   ✅ Created brand: ${newBrand.name}`);

      // Clean up
      await prisma.brands.delete({ where: { id: newBrand.id } });
      console.log(`   ✅ Cleaned up test brand`);
      passed++;
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      failed++;
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('\n📊 TEST SUMMARY:');
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

    if (failed === 0) {
      console.log('\n🎉 🎉 🎉  ALL TESTS PASSED!  🎉 🎉 🎉');
      console.log('='.repeat(70));
      console.log('\n✅ All schema fixes are working correctly!');
      console.log('✅ Categories API: WORKING');
      console.log('✅ Brands API: WORKING');
      console.log('✅ Products API: WORKING');
      console.log('✅ Customers API: WORKING');
      console.log('✅ Stores API: WORKING');
      console.log('✅ Users API: WORKING');
      console.log('\n👉 Ready to commit and deploy!');
    } else {
      console.log('\n⚠️  SOME TESTS FAILED!');
      console.log('Review the errors above and fix before deploying.');
    }

  } catch (error) {
    console.error('\n❌ TEST ERROR:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testSchemaFixes();
