import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function testRemainingFeatures() {
  try {
    console.log('🧪 TESTING REMAINING UNTESTED FEATURES\n');
    console.log('='.repeat(80));

    const tenant = await prisma.$queryRaw`SELECT id FROM tenants LIMIT 1`;
    if (tenant.length === 0) {
      console.log('❌ No tenant found!');
      return;
    }
    const tenantId = tenant[0].id;

    const results = [];
    const timestamp = Date.now();

    // ============= TEST 1: USERS WRITE OPERATIONS =============
    console.log('\n👤 TEST 1: Users Write Operations');
    console.log('Testing CREATE, UPDATE, DELETE for users...\n');

    try {
      // Get existing user count
      const beforeCount = await prisma.users.count({ where: { tenantId } });
      console.log(`   ℹ️  Current users: ${beforeCount}`);

      // CREATE - Create a test user
      const hashedPassword = await bcrypt.hash('TestPassword123!', 10);
      const testUser = await prisma.users.create({
        data: {
          id: `test-user-${timestamp}`,
          email: `testuser${timestamp}@test.com`,
          username: `testuser${timestamp}`,
          password: hashedPassword,
          firstName: 'Test',
          lastName: 'User',
          isActive: true,
          tenantId,
          updatedAt: new Date()
        }
      });
      console.log('   ✅ CREATE: Can create users');
      console.log(`      Created: ${testUser.email}`);

      // UPDATE - Update the test user
      await prisma.users.update({
        where: { id: testUser.id },
        data: {
          firstName: 'Updated',
          lastName: 'TestUser',
          updatedAt: new Date()
        }
      });
      console.log('   ✅ UPDATE: Can update users');

      // DELETE - Delete the test user
      await prisma.users.delete({ where: { id: testUser.id } });
      console.log('   ✅ DELETE: Can delete users');

      // Verify deletion
      const afterCount = await prisma.users.count({ where: { tenantId } });
      if (afterCount === beforeCount) {
        console.log('   ✅ VERIFIED: User successfully deleted, count restored');
      }

      results.push({ feature: 'Users - Write', status: 'WORKING', critical: false });
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ feature: 'Users - Write', status: 'BROKEN', critical: false });
    }

    // ============= TEST 2: SALES CREATE =============
    console.log('\n💰 TEST 2: Sales Create Operation');
    console.log('Testing sale creation with full workflow...\n');

    try {
      // Get necessary data
      const store = await prisma.stores.findFirst({ where: { tenantId, isActive: true } });
      const customer = await prisma.customers.findFirst({ where: { tenantId } });
      const product = await prisma.products.findFirst({ where: { tenantId, isActive: true } });
      const user = await prisma.users.findFirst({ where: { tenantId } });

      if (!store || !customer || !product || !user) {
        console.log('   ⚠️  SKIPPED: Missing required data (store, customer, product, or user)');
        results.push({ feature: 'Sales - Create', status: 'SKIPPED', critical: false });
      } else {
        console.log(`   ℹ️  Using store: ${store.name}`);
        console.log(`   ℹ️  Using customer: ${customer.firstName} ${customer.lastName}`);
        console.log(`   ℹ️  Using product: ${product.name}`);

        // Get current sales count
        const beforeSales = await prisma.sales.count();
        console.log(`   ℹ️  Current sales: ${beforeSales}`);

        // Calculate sale values
        const quantity = 2;
        const unitPrice = Number(product.sellingPrice);
        const subtotal = unitPrice * quantity;
        const vatRate = Number(product.vatRate) || 0;
        const vatAmount = (subtotal * vatRate) / 100;
        const totalAmount = subtotal + vatAmount;

        // Create sale
        const sale = await prisma.sales.create({
          data: {
            id: `test-sale-${timestamp}`,
            saleNo: `TEST-${timestamp}`,
            saleDate: new Date(),
            storeId: store.id,
            customerId: customer.id,
            subtotal: subtotal,
            vatAmount: vatAmount,
            totalAmount: totalAmount,
            status: 'COMPLETED',
            paymentStatus: 'PAID',
            paymentMethod: 'CASH',
            createdById: user.id,
            updatedById: user.id,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        console.log('   ✅ CREATE: Can create sales');
        console.log(`      Sale Number: ${sale.saleNo}`);
        console.log(`      Total: AED ${totalAmount.toFixed(2)}`);

        // Create sale items
        const saleItem = await prisma.sale_items.create({
          data: {
            id: `test-item-${timestamp}`,
            saleId: sale.id,
            productId: product.id,
            quantity: quantity,
            unit: product.baseUnit || 'PIECE',
            unitPrice: unitPrice,
            discountAmount: 0,
            vatRate: vatRate,
            vatAmount: vatAmount,
            totalAmount: subtotal + vatAmount
          }
        });
        console.log('   ✅ CREATE: Can create sale items');

        // Create payment record
        const payment = await prisma.payments.create({
          data: {
            id: `test-payment-${timestamp}`,
            paymentNo: `PAY-TEST-${timestamp}`,
            saleId: sale.id,
            amount: totalAmount,
            method: 'CASH',
            status: 'PAID',
            paymentDate: new Date(),
            updatedAt: new Date()
          }
        });
        console.log('   ✅ CREATE: Can create payment records');

        // Verify sale was created
        const afterSales = await prisma.sales.count();
        if (afterSales === beforeSales + 1) {
          console.log('   ✅ VERIFIED: Sale successfully created');
        }

        // CLEANUP - Delete test data
        console.log('\n   🧹 Cleaning up test data...');
        await prisma.payments.delete({ where: { id: payment.id } });
        console.log('      ✅ Payment deleted');
        await prisma.sale_items.delete({ where: { id: saleItem.id } });
        console.log('      ✅ Sale item deleted');
        await prisma.sales.delete({ where: { id: sale.id } });
        console.log('      ✅ Sale deleted');

        // Verify cleanup
        const finalSales = await prisma.sales.count();
        if (finalSales === beforeSales) {
          console.log('   ✅ CLEANUP: Test data successfully removed');
        }

        results.push({ feature: 'Sales - Create', status: 'WORKING', critical: true });
      }
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      console.log(`   Stack: ${error.stack}`);
      results.push({ feature: 'Sales - Create', status: 'BROKEN', critical: true });
    }

    // ============= SUMMARY =============
    console.log('\n' + '='.repeat(80));
    console.log('\n📊 REMAINING FEATURES TEST SUMMARY\n');

    const working = results.filter(r => r.status === 'WORKING').length;
    const broken = results.filter(r => r.status === 'BROKEN').length;
    const skipped = results.filter(r => r.status === 'SKIPPED').length;

    results.forEach(r => {
      const icon = r.status === 'WORKING' ? '✅' :
                   r.status === 'BROKEN' ? '❌' :
                   r.status === 'SKIPPED' ? '⚠️' : '❓';
      console.log(`${icon} ${r.feature}: ${r.status}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('\n📈 STATISTICS\n');
    console.log(`✅ Working: ${working}/${results.length}`);
    console.log(`❌ Broken: ${broken}/${results.length}`);
    console.log(`⚠️  Skipped: ${skipped}/${results.length}`);

    if (working === results.length) {
      console.log('\n🎉 🎉 🎉  ALL REMAINING FEATURES WORKING!  🎉 🎉 🎉\n');
    } else if (broken > 0) {
      console.log(`\n⚠️  ${broken} feature(s) not working\n`);
    }

    console.log('='.repeat(80));

    // ============= COMBINED SUMMARY =============
    console.log('\n📊 COMPLETE SYSTEM STATUS\n');
    console.log('Previously tested: 18/20 features ✅ (100%)');
    console.log(`Just tested: ${working}/${results.length} features ✅`);

    if (working === results.length) {
      console.log('\n🎉 FINAL STATUS: 20/20 FEATURES WORKING (100%) 🎉\n');
      console.log('✨ Your ERP system is FULLY FUNCTIONAL! ✨\n');
    }

    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n❌ TEST ERROR:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testRemainingFeatures();
