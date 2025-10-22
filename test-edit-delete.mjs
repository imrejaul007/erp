import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function testEditDelete() {
  try {
    console.log('🧪 TESTING EDIT & DELETE OPERATIONS\n');
    console.log('=' .repeat(70));

    const tenant = await prisma.$queryRaw`SELECT id FROM tenants LIMIT 1`;
    if (tenant.length === 0) {
      console.log('❌ No tenant found!');
      return;
    }
    const tenantId = tenant[0].id;
    console.log(`✅ Tenant: ${tenantId}\n`);

    const results = {
      categories: { create: false, update: false, delete: false },
      brands: { create: false, update: false, delete: false },
      products: { create: false, update: false, delete: false },
      customers: { create: false, update: false, delete: false },
      stores: { create: false, update: false, delete: false },
    };

    // ============= TEST CATEGORIES =============
    console.log('📂 TEST 1: CATEGORIES');
    try {
      // CREATE
      const testCat = await prisma.categories.create({
        data: {
          id: 'test-cat-' + Date.now(),
          name: 'Test Category Original',
          nameArabic: 'فئة اختبار',
          tenantId
        }
      });
      console.log('   ✅ CREATE: Working');
      results.categories.create = true;

      // UPDATE
      try {
        const updated = await prisma.categories.update({
          where: { id: testCat.id },
          data: { name: 'Test Category UPDATED' }
        });
        if (updated.name === 'Test Category UPDATED') {
          console.log('   ✅ UPDATE: Working');
          results.categories.update = true;
        } else {
          console.log('   ⚠️  UPDATE: Data not updated correctly');
        }
      } catch (err) {
        console.log(`   ❌ UPDATE: ${err.message}`);
      }

      // DELETE
      try {
        await prisma.categories.delete({ where: { id: testCat.id } });
        const check = await prisma.categories.findUnique({ where: { id: testCat.id } });
        if (!check) {
          console.log('   ✅ DELETE: Working\n');
          results.categories.delete = true;
        } else {
          console.log('   ⚠️  DELETE: Record still exists\n');
        }
      } catch (err) {
        console.log(`   ❌ DELETE: ${err.message}\n`);
      }
    } catch (error) {
      console.log(`   ❌ CREATE: ${error.message}\n`);
    }

    // ============= TEST BRANDS =============
    console.log('🏷️  TEST 2: BRANDS');
    try {
      // CREATE
      const testBrand = await prisma.brands.create({
        data: {
          id: 'test-brand-' + Date.now(),
          name: 'Test Brand Original',
          nameArabic: 'علامة اختبار',
          tenantId
        }
      });
      console.log('   ✅ CREATE: Working');
      results.brands.create = true;

      // UPDATE
      try {
        const updated = await prisma.brands.update({
          where: { id: testBrand.id },
          data: { name: 'Test Brand UPDATED' }
        });
        if (updated.name === 'Test Brand UPDATED') {
          console.log('   ✅ UPDATE: Working');
          results.brands.update = true;
        } else {
          console.log('   ⚠️  UPDATE: Data not updated correctly');
        }
      } catch (err) {
        console.log(`   ❌ UPDATE: ${err.message}`);
      }

      // DELETE
      try {
        await prisma.brands.delete({ where: { id: testBrand.id } });
        const check = await prisma.brands.findUnique({ where: { id: testBrand.id } });
        if (!check) {
          console.log('   ✅ DELETE: Working\n');
          results.brands.delete = true;
        } else {
          console.log('   ⚠️  DELETE: Record still exists\n');
        }
      } catch (err) {
        console.log(`   ❌ DELETE: ${err.message}\n`);
      }
    } catch (error) {
      console.log(`   ❌ CREATE: ${error.message}\n`);
    }

    // ============= TEST PRODUCTS =============
    console.log('📦 TEST 3: PRODUCTS');
    try {
      // Get a category for the test
      const cat = await prisma.categories.findFirst({ where: { tenantId } });

      // CREATE
      const testProd = await prisma.products.create({
        data: {
          id: 'test-prod-' + Date.now(),
          code: 'TEST-' + Date.now(),
          name: 'Test Product Original',
          sku: 'SKU-TEST-' + Date.now(),
          category: 'Test',
          baseUnit: 'PIECE',
          costPrice: 50,
          sellingPrice: 100,
          currency: 'AED',
          vatRate: 5,
          isActive: true,
          tenantId,
          updatedAt: new Date()
        }
      });
      console.log('   ✅ CREATE: Working');
      results.products.create = true;

      // UPDATE
      try {
        const updated = await prisma.products.update({
          where: { id: testProd.id },
          data: {
            name: 'Test Product UPDATED',
            sellingPrice: 150,
            updatedAt: new Date()
          }
        });
        if (updated.name === 'Test Product UPDATED' && Number(updated.sellingPrice) === 150) {
          console.log('   ✅ UPDATE: Working');
          results.products.update = true;
        } else {
          console.log(`   ⚠️  UPDATE: Data not updated correctly (name: ${updated.name}, price: ${updated.sellingPrice})`);
        }
      } catch (err) {
        console.log(`   ❌ UPDATE: ${err.message}`);
      }

      // DELETE
      try {
        await prisma.products.delete({ where: { id: testProd.id } });
        const check = await prisma.products.findUnique({ where: { id: testProd.id } });
        if (!check) {
          console.log('   ✅ DELETE: Working\n');
          results.products.delete = true;
        } else {
          console.log('   ⚠️  DELETE: Record still exists\n');
        }
      } catch (err) {
        console.log(`   ❌ DELETE: ${err.message}\n`);
      }
    } catch (error) {
      console.log(`   ❌ CREATE: ${error.message}\n`);
    }

    // ============= TEST CUSTOMERS =============
    console.log('👥 TEST 4: CUSTOMERS');
    try {
      // CREATE
      const testCust = await prisma.customers.create({
        data: {
          id: 'test-cust-' + Date.now(),
          customerNo: 'CUST-' + Date.now(),
          firstName: 'Test',
          lastName: 'Customer',
          email: 'test' + Date.now() + '@test.com',
          phone: '+971501234567',
          type: 'INDIVIDUAL',
          country: 'UAE',
          tenantId,
          updatedAt: new Date()
        }
      });
      console.log('   ✅ CREATE: Working');
      results.customers.create = true;

      // UPDATE
      try {
        const updated = await prisma.customers.update({
          where: { id: testCust.id },
          data: {
            firstName: 'UPDATED',
            lastName: 'Customer',
            updatedAt: new Date()
          }
        });
        if (updated.firstName === 'UPDATED' && updated.lastName === 'Customer') {
          console.log('   ✅ UPDATE: Working');
          results.customers.update = true;
        } else {
          console.log('   ⚠️  UPDATE: Data not updated correctly');
        }
      } catch (err) {
        console.log(`   ❌ UPDATE: ${err.message}`);
      }

      // DELETE
      try {
        await prisma.customers.delete({ where: { id: testCust.id } });
        const check = await prisma.customers.findUnique({ where: { id: testCust.id } });
        if (!check) {
          console.log('   ✅ DELETE: Working\n');
          results.customers.delete = true;
        } else {
          console.log('   ⚠️  DELETE: Record still exists\n');
        }
      } catch (err) {
        console.log(`   ❌ DELETE: ${err.message}\n`);
      }
    } catch (error) {
      console.log(`   ❌ CREATE: ${error.message}\n`);
    }

    // ============= TEST STORES =============
    console.log('🏪 TEST 5: STORES');
    try {
      // CREATE
      const testStore = await prisma.stores.create({
        data: {
          id: 'test-store-' + Date.now(),
          code: 'TST' + Date.now(),
          name: 'Test Store Original',
          address: '123 Test Street',
          emirate: 'DUBAI',
          city: 'Dubai',
          isActive: true,
          tenantId,
          updatedAt: new Date()
        }
      });
      console.log('   ✅ CREATE: Working');
      results.stores.create = true;

      // UPDATE
      try {
        const updated = await prisma.stores.update({
          where: { id: testStore.id },
          data: { name: 'Test Store UPDATED' }
        });
        if (updated.name === 'Test Store UPDATED') {
          console.log('   ✅ UPDATE: Working');
          results.stores.update = true;
        } else {
          console.log('   ⚠️  UPDATE: Data not updated correctly');
        }
      } catch (err) {
        console.log(`   ❌ UPDATE: ${err.message}`);
      }

      // DELETE
      try {
        await prisma.stores.delete({ where: { id: testStore.id } });
        const check = await prisma.stores.findUnique({ where: { id: testStore.id } });
        if (!check) {
          console.log('   ✅ DELETE: Working\n');
          results.stores.delete = true;
        } else {
          console.log('   ⚠️  DELETE: Record still exists\n');
        }
      } catch (err) {
        console.log(`   ❌ DELETE: ${err.message}\n`);
      }
    } catch (error) {
      console.log(`   ❌ CREATE: ${error.message}\n`);
    }

    // ============= SUMMARY =============
    console.log('=' .repeat(70));
    console.log('\n📊 CRUD OPERATIONS SUMMARY\n');

    const printStatus = (feature, ops) => {
      const create = ops.create ? '✅' : '❌';
      const update = ops.update ? '✅' : '❌';
      const del = ops.delete ? '✅' : '❌';
      const allWorking = ops.create && ops.update && ops.delete;
      const icon = allWorking ? '🟢' : '🟡';
      console.log(`${icon} ${feature.padEnd(15)} Create: ${create}  Update: ${update}  Delete: ${del}`);
    };

    printStatus('Categories', results.categories);
    printStatus('Brands', results.brands);
    printStatus('Products', results.products);
    printStatus('Customers', results.customers);
    printStatus('Stores', results.stores);

    console.log('\n' + '=' .repeat(70));
    console.log('\n✨ EDITABILITY REPORT\n');

    const allFullyEditable = Object.values(results).every(r => r.create && r.update && r.delete);

    if (allFullyEditable) {
      console.log('🎉 ALL FEATURES ARE FULLY EDITABLE!\n');
      console.log('✅ Users can CREATE, UPDATE, and DELETE all records');
      console.log('✅ All CRUD operations working correctly');
    } else {
      console.log('⚠️  SOME FEATURES HAVE LIMITED EDITABILITY\n');

      Object.entries(results).forEach(([feature, ops]) => {
        const missing = [];
        if (!ops.create) missing.push('CREATE');
        if (!ops.update) missing.push('UPDATE');
        if (!ops.delete) missing.push('DELETE');

        if (missing.length > 0) {
          console.log(`   ⚠️  ${feature}: Missing ${missing.join(', ')}`);
        }
      });
    }

    console.log('\n' + '=' .repeat(70));

  } catch (error) {
    console.error('\n❌ TEST ERROR:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testEditDelete();
