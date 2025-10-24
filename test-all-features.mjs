import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function testAllFeatures() {
  try {
    console.log('🧪 TESTING ALL FEATURES - WHAT ACTUALLY WORKS?\n');
    console.log('='.repeat(80));

    const tenant = await prisma.$queryRaw`SELECT id FROM tenants LIMIT 1`;
    if (tenant.length === 0) {
      console.log('❌ No tenant found!');
      return;
    }
    const tenantId = tenant[0].id;

    const results = [];
    const timestamp = Date.now();

    // ============= TEST 1: USERS =============
    console.log('\n👤 TEST 1: Users Management');
    try {
      const users = await prisma.users.findMany({ where: { tenantId }, take: 1 });
      if (users.length > 0) {
        console.log('   ✅ READ: Can query users');
        results.push({ feature: 'Users - Read', status: 'WORKING', critical: true });
      }

      // Don't create test users (security risk)
      console.log('   ℹ️  CREATE/UPDATE/DELETE: Not tested (security)');
      results.push({ feature: 'Users - Write', status: 'UNTESTED', critical: false });
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ feature: 'Users', status: 'BROKEN', critical: true });
    }

    // ============= TEST 2: CUSTOMERS =============
    console.log('\n👥 TEST 2: Customers Management');
    try {
      // READ
      const customers = await prisma.customers.findMany({ where: { tenantId }, take: 1 });
      console.log(`   ✅ READ: ${customers.length} customers found`);

      // CREATE
      const testCustomer = await prisma.customers.create({
        data: {
          id: `test-cust-${timestamp}`,
          customerNo: `TEST-${timestamp}`,
          firstName: 'Test',
          lastName: 'Customer',
          email: `test${timestamp}@test.com`,
          phone: '+971501111111',
          type: 'INDIVIDUAL',
          country: 'UAE',
          tenantId,
          updatedAt: new Date()
        }
      });
      console.log('   ✅ CREATE: Can create customers');

      // UPDATE
      await prisma.customers.update({
        where: { id: testCustomer.id },
        data: { firstName: 'Updated', updatedAt: new Date() }
      });
      console.log('   ✅ UPDATE: Can update customers');

      // DELETE
      await prisma.customers.delete({ where: { id: testCustomer.id } });
      console.log('   ✅ DELETE: Can delete customers');

      results.push({ feature: 'Customers', status: 'WORKING', critical: true });
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ feature: 'Customers', status: 'BROKEN', critical: true });
    }

    // ============= TEST 3: PRODUCTS =============
    console.log('\n📦 TEST 3: Products Management');
    try {
      // READ
      const products = await prisma.products.findMany({ where: { tenantId }, take: 1 });
      console.log(`   ✅ READ: ${products.length} products found`);

      // CREATE
      const testProduct = await prisma.products.create({
        data: {
          id: `test-prod-${timestamp}`,
          code: `TEST-${timestamp}`,
          name: 'Test Product',
          sku: `SKU-${timestamp}`,
          category: 'Test',
          baseUnit: 'PIECE',
          costPrice: 50,
          sellingPrice: 100,
          currency: 'AED',
          vatRate: 5,
          tenantId,
          updatedAt: new Date()
        }
      });
      console.log('   ✅ CREATE: Can create products');

      // UPDATE
      await prisma.products.update({
        where: { id: testProduct.id },
        data: { sellingPrice: 150, updatedAt: new Date() }
      });
      console.log('   ✅ UPDATE: Can update products');

      // DELETE
      await prisma.products.delete({ where: { id: testProduct.id } });
      console.log('   ✅ DELETE: Can delete products');

      results.push({ feature: 'Products', status: 'WORKING', critical: true });
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ feature: 'Products', status: 'BROKEN', critical: true });
    }

    // ============= TEST 4: CATEGORIES =============
    console.log('\n📂 TEST 4: Categories Management');
    try {
      const categories = await prisma.categories.findMany({ where: { tenantId }, take: 1 });
      console.log(`   ✅ READ: ${categories.length} categories found`);

      const testCat = await prisma.categories.create({
        data: {
          id: `test-cat-${timestamp}`,
          name: 'Test Category',
          tenantId
        }
      });
      console.log('   ✅ CREATE: Can create categories');

      await prisma.categories.update({
        where: { id: testCat.id },
        data: { name: 'Updated Category' }
      });
      console.log('   ✅ UPDATE: Can update categories');

      await prisma.categories.delete({ where: { id: testCat.id } });
      console.log('   ✅ DELETE: Can delete categories');

      results.push({ feature: 'Categories', status: 'WORKING', critical: true });
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ feature: 'Categories', status: 'BROKEN', critical: true });
    }

    // ============= TEST 5: BRANDS =============
    console.log('\n🏷️  TEST 5: Brands Management');
    try {
      const brands = await prisma.brands.findMany({ where: { tenantId }, take: 1 });
      console.log(`   ✅ READ: ${brands.length} brands found`);

      const testBrand = await prisma.brands.create({
        data: {
          id: `test-brand-${timestamp}`,
          name: 'Test Brand',
          tenantId
        }
      });
      console.log('   ✅ CREATE: Can create brands');

      await prisma.brands.update({
        where: { id: testBrand.id },
        data: { name: 'Updated Brand' }
      });
      console.log('   ✅ UPDATE: Can update brands');

      await prisma.brands.delete({ where: { id: testBrand.id } });
      console.log('   ✅ DELETE: Can delete brands');

      results.push({ feature: 'Brands', status: 'WORKING', critical: true });
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ feature: 'Brands', status: 'BROKEN', critical: true });
    }

    // ============= TEST 6: STORES =============
    console.log('\n🏪 TEST 6: Stores Management');
    try {
      const stores = await prisma.stores.findMany({ where: { tenantId }, take: 1 });
      console.log(`   ✅ READ: ${stores.length} stores found`);

      const testStore = await prisma.stores.create({
        data: {
          id: `test-store-${timestamp}`,
          code: `TST${timestamp}`,
          name: 'Test Store',
          address: 'Test Address',
          emirate: 'DUBAI',
          city: 'Dubai',
          tenantId,
          updatedAt: new Date()
        }
      });
      console.log('   ✅ CREATE: Can create stores');

      await prisma.stores.update({
        where: { id: testStore.id },
        data: { name: 'Updated Store', updatedAt: new Date() }
      });
      console.log('   ✅ UPDATE: Can update stores');

      await prisma.stores.delete({ where: { id: testStore.id } });
      console.log('   ✅ DELETE: Can delete stores');

      results.push({ feature: 'Stores', status: 'WORKING', critical: true });
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ feature: 'Stores', status: 'BROKEN', critical: true });
    }

    // ============= TEST 7: SALES =============
    console.log('\n💰 TEST 7: Sales/POS');
    try {
      const sales = await prisma.sales.findMany({ take: 1 });
      console.log(`   ✅ READ: ${sales.length} sales found`);
      console.log('   ℹ️  CREATE: Not tested (would create real sale)');
      results.push({ feature: 'Sales - Read', status: 'WORKING', critical: true });
      results.push({ feature: 'Sales - Create', status: 'UNTESTED', critical: true });
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ feature: 'Sales', status: 'BROKEN', critical: true });
    }

    // ============= TEST 8: RETURNS =============
    console.log('\n🔄 TEST 8: Returns System');
    try {
      await prisma.return_orders.findMany({ take: 1 });
      console.log('   ✅ TABLE EXISTS: Returns table available');
      results.push({ feature: 'Returns', status: 'WORKING', critical: true });
    } catch (error) {
      if (error.message.includes('return_orders') || error.message.includes('does not exist')) {
        console.log('   ❌ TABLE MISSING: Returns table does not exist');
        results.push({ feature: 'Returns', status: 'TABLE MISSING', critical: true });
      } else {
        console.log(`   ❌ ERROR: ${error.message}`);
        results.push({ feature: 'Returns', status: 'ERROR', critical: true });
      }
    }

    // ============= TEST 9: PURCHASE ORDERS =============
    console.log('\n📋 TEST 9: Purchase Orders');
    try {
      const pos = await prisma.purchase_orders.findMany({ take: 1 });
      console.log(`   ✅ READ: Table exists, ${pos.length} orders found`);
      results.push({ feature: 'Purchase Orders', status: 'WORKING', critical: false });
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ feature: 'Purchase Orders', status: 'BROKEN', critical: false });
    }

    // ============= TEST 10: SUPPLIERS =============
    console.log('\n🏭 TEST 10: Suppliers');
    try {
      const suppliers = await prisma.suppliers.findMany({ where: { tenantId }, take: 1 });
      console.log(`   ✅ READ: ${suppliers.length} suppliers found`);

      const testSupplier = await prisma.suppliers.create({
        data: {
          id: `test-supp-${timestamp}`,
          code: `SUP${timestamp}`,
          name: 'Test Supplier',
          contactPerson: 'Test Person',
          email: `supp${timestamp}@test.com`,
          phone: '+971502222222',
          country: 'UAE',
          category: 'Perfumes',
          type: 'LOCAL',
          isActive: true,
          tenantId,
          updatedAt: new Date()
        }
      });
      console.log('   ✅ CREATE: Can create suppliers');

      await prisma.suppliers.delete({ where: { id: testSupplier.id } });
      console.log('   ✅ DELETE: Can delete suppliers');

      results.push({ feature: 'Suppliers', status: 'WORKING', critical: false });
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ feature: 'Suppliers', status: 'BROKEN', critical: false });
    }

    // ============= TEST 11: STOCK MOVEMENTS =============
    console.log('\n📊 TEST 11: Stock Movements');
    try {
      const movements = await prisma.stock_movements.findMany({ take: 1 });
      console.log(`   ✅ READ: ${movements.length} movements found`);
      results.push({ feature: 'Stock Movements', status: 'WORKING', critical: false });
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ feature: 'Stock Movements', status: 'BROKEN', critical: false });
    }

    // ============= TEST 12: INVOICES =============
    console.log('\n📄 TEST 12: Invoices');
    try {
      const invoices = await prisma.invoices.findMany({ take: 1 });
      console.log(`   ✅ READ: ${invoices.length} invoices found`);
      results.push({ feature: 'Invoices', status: 'WORKING', critical: false });
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ feature: 'Invoices', status: 'BROKEN', critical: false });
    }

    // ============= TEST 13: PAYMENTS =============
    console.log('\n💳 TEST 13: Payments');
    try {
      const payments = await prisma.payments.findMany({ take: 1 });
      console.log(`   ✅ READ: ${payments.length} payments found`);
      results.push({ feature: 'Payments', status: 'WORKING', critical: false });
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ feature: 'Payments', status: 'BROKEN', critical: false });
    }

    // ============= TEST 14: INVENTORY =============
    console.log('\n📦 TEST 14: Store Inventory');
    try {
      const inventory = await prisma.store_inventory.findMany({ take: 1 });
      console.log(`   ✅ READ: ${inventory.length} inventory records found`);
      results.push({ feature: 'Store Inventory', status: 'WORKING', critical: false });
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ feature: 'Store Inventory', status: 'BROKEN', critical: false });
    }

    // ============= TEST 15: TRANSFERS =============
    console.log('\n🔄 TEST 15: Stock Transfers');
    try {
      // transfers table doesn't have tenantId directly, must query through stores relation
      const transfers = await prisma.transfers.findMany({
        where: {
          stores_transfers_fromStoreIdTostores: {
            tenantId: tenantId
          }
        },
        take: 1
      });
      console.log(`   ✅ READ: ${transfers.length} transfers found`);
      results.push({ feature: 'Stock Transfers', status: 'WORKING', critical: false });
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ feature: 'Stock Transfers', status: 'BROKEN', critical: false });
    }

    // ============= TEST 16: PRODUCTION =============
    console.log('\n🏭 TEST 16: Production Batches');
    try {
      // production_batches doesn't have tenantId, query through products relation
      const batches = await prisma.production_batches.findMany({
        where: {
          products: {
            tenantId: tenantId
          }
        },
        take: 1
      });
      console.log(`   ✅ READ: ${batches.length} batches found`);
      results.push({ feature: 'Production', status: 'WORKING', critical: false });
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ feature: 'Production', status: 'BROKEN', critical: false });
    }

    // ============= TEST 17: LOYALTY =============
    console.log('\n🎁 TEST 17: Customer Loyalty');
    try {
      const loyalty = await prisma.customer_loyalty.findMany({ take: 1 });
      console.log(`   ✅ READ: ${loyalty.length} loyalty records found`);
      results.push({ feature: 'Customer Loyalty', status: 'WORKING', critical: false });
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ feature: 'Customer Loyalty', status: 'BROKEN', critical: false });
    }

    // ============= TEST 18: PROMOTIONS =============
    console.log('\n🎉 TEST 18: Promotions');
    try {
      // promotions table doesn't have tenantId field, query without it
      const promos = await prisma.promotions.findMany({ take: 1 });
      console.log(`   ✅ READ: ${promos.length} promotions found`);
      results.push({ feature: 'Promotions', status: 'WORKING', critical: false });
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ feature: 'Promotions', status: 'BROKEN', critical: false });
    }

    // ============= SUMMARY =============
    console.log('\n' + '='.repeat(80));
    console.log('\n📊 FEATURE TEST SUMMARY\n');

    const working = results.filter(r => r.status === 'WORKING').length;
    const broken = results.filter(r => r.status === 'BROKEN').length;
    const missing = results.filter(r => r.status === 'TABLE MISSING').length;
    const untested = results.filter(r => r.status === 'UNTESTED').length;
    const errors = results.filter(r => r.status === 'ERROR').length;

    console.log('CRITICAL FEATURES:');
    results.filter(r => r.critical).forEach(r => {
      const icon = r.status === 'WORKING' ? '✅' :
                   r.status === 'TABLE MISSING' ? '❌' :
                   r.status === 'UNTESTED' ? 'ℹ️' :
                   r.status === 'BROKEN' ? '❌' : '⚠️';
      console.log(`${icon} ${r.feature}: ${r.status}`);
    });

    console.log('\nADVANCED FEATURES:');
    results.filter(r => !r.critical).forEach(r => {
      const icon = r.status === 'WORKING' ? '✅' :
                   r.status === 'TABLE MISSING' ? '❌' :
                   r.status === 'UNTESTED' ? 'ℹ️' :
                   r.status === 'BROKEN' ? '❌' : '⚠️';
      console.log(`${icon} ${r.feature}: ${r.status}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('\n📈 STATISTICS\n');
    console.log(`✅ Working: ${working}/${results.length}`);
    console.log(`❌ Broken: ${broken}/${results.length}`);
    console.log(`❌ Missing Tables: ${missing}/${results.length}`);
    console.log(`⚠️  Errors: ${errors}/${results.length}`);
    console.log(`ℹ️  Untested: ${untested}/${results.length}`);

    const successRate = ((working / (results.length - untested)) * 100).toFixed(1);
    console.log(`\n📊 Success Rate: ${successRate}% (excluding untested)`);

    console.log('\n' + '='.repeat(80));

    if (broken === 0 && missing === 0 && errors === 0) {
      console.log('\n🎉 🎉 🎉  ALL TESTED FEATURES WORKING!  🎉 🎉 🎉\n');
    } else if (broken + missing + errors === 1) {
      console.log('\n✅ ALMOST PERFECT - Only 1 issue found!\n');
    } else {
      console.log(`\n⚠️  ISSUES FOUND: ${broken + missing + errors} features not working\n`);
    }

    // Show what doesn't work
    const notWorking = results.filter(r =>
      r.status === 'BROKEN' || r.status === 'TABLE MISSING' || r.status === 'ERROR'
    );

    if (notWorking.length > 0) {
      console.log('🔴 FEATURES NOT WORKING:\n');
      notWorking.forEach(r => {
        console.log(`   ❌ ${r.feature}: ${r.status}`);
        if (r.critical) {
          console.log(`      ⚠️  CRITICAL - This affects core operations!`);
        }
      });
    }

    console.log('\n' + '='.repeat(80));

  } catch (error) {
    console.error('\n❌ TEST ERROR:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testAllFeatures();
