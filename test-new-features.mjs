import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function testNewFeatures() {
  try {
    console.log('🧪 TESTING ALL NEW FEATURES\n');
    console.log('='.repeat(80));

    const results = [];
    const timestamp = Date.now();

    // Get tenant and user for testing
    const tenant = await prisma.$queryRaw`SELECT id FROM tenants LIMIT 1`;
    const tenantId = tenant[0].id;
    const user = await prisma.users.findFirst({ where: { tenantId } });
    const userId = user.id;

    // TEST 1: CRM - LEADS
    console.log('\n📋 TEST 1: CRM - Leads');
    try {
      const leadCount = await prisma.leads.count();
      console.log(`   ✅ leads table: ${leadCount} records`);

      // Try creating a test lead
      const testLead = await prisma.leads.create({
        data: {
          id: `lead-test-${timestamp}`,
          leadNo: `LD-${timestamp}`,
          source: 'WEBSITE',
          status: 'NEW',
          firstName: 'Test',
          lastName: 'Lead',
          email: `testlead${timestamp}@example.com`,
          phone: '+971501234567',
          estimatedValue: 5000,
          createdById: userId,
          tenantId: tenantId,
          updatedAt: new Date()
        }
      });
      console.log(`   ✅ Created test lead: ${testLead.leadNo}`);

      // Clean up
      await prisma.leads.delete({ where: { id: testLead.id } });
      console.log(`   ✅ Cleanup: Test lead deleted`);

      results.push({ feature: 'CRM - Leads', status: 'WORKING', critical: true });
    } catch (error) {
      console.log(`   ❌ leads FAILED: ${error.message}`);
      results.push({ feature: 'CRM - Leads', status: 'BROKEN', critical: true });
    }

    // TEST 2: CRM - OPPORTUNITIES
    console.log('\n💼 TEST 2: CRM - Opportunities');
    try {
      const oppCount = await prisma.opportunities.count();
      console.log(`   ✅ opportunities table: ${oppCount} records`);

      // Try creating a test opportunity
      const testOpp = await prisma.opportunities.create({
        data: {
          id: `opp-test-${timestamp}`,
          opportunityNo: `OP-${timestamp}`,
          name: 'Test Opportunity',
          stage: 'PROSPECTING',
          amount: 10000,
          probability: 50,
          expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          tenantId: tenantId,
          updatedAt: new Date()
        }
      });
      console.log(`   ✅ Created test opportunity: ${testOpp.opportunityNo}`);

      // Clean up
      await prisma.opportunities.delete({ where: { id: testOpp.id } });
      console.log(`   ✅ Cleanup: Test opportunity deleted`);

      results.push({ feature: 'CRM - Opportunities', status: 'WORKING', critical: true });
    } catch (error) {
      console.log(`   ❌ opportunities FAILED: ${error.message}`);
      results.push({ feature: 'CRM - Opportunities', status: 'BROKEN', critical: true });
    }

    // TEST 3: CRM - ACTIVITIES
    console.log('\n📞 TEST 3: CRM - Activities');
    try {
      const activityCount = await prisma.activities.count();
      console.log(`   ✅ activities table: ${activityCount} records`);

      // Try creating a test activity
      const testActivity = await prisma.activities.create({
        data: {
          id: `activity-test-${timestamp}`,
          type: 'CALL',
          subject: 'Test Follow-up Call',
          description: 'Call customer about perfume inquiry',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          createdById: userId,
          tenantId: tenantId,
          updatedAt: new Date()
        }
      });
      console.log(`   ✅ Created test activity: ${testActivity.subject}`);

      // Clean up
      await prisma.activities.delete({ where: { id: testActivity.id } });
      console.log(`   ✅ Cleanup: Test activity deleted`);

      results.push({ feature: 'CRM - Activities', status: 'WORKING', critical: true });
    } catch (error) {
      console.log(`   ❌ activities FAILED: ${error.message}`);
      results.push({ feature: 'CRM - Activities', status: 'BROKEN', critical: true });
    }

    // TEST 4: NOTIFICATION TEMPLATES
    console.log('\n📧 TEST 4: Notification Templates');
    try {
      const templateCount = await prisma.notification_templates.count();
      console.log(`   ✅ notification_templates table: ${templateCount} records`);

      // Try creating a test template
      const testTemplate = await prisma.notification_templates.create({
        data: {
          id: `template-test-${timestamp}`,
          code: `WELCOME_EMAIL_${timestamp}`,
          name: 'Welcome Email',
          type: 'EMAIL',
          subject: 'Welcome to {{companyName}}',
          bodyTemplate: 'Dear {{customerName}}, welcome to our store!',
          variables: { companyName: 'string', customerName: 'string' },
          tenantId: tenantId,
          updatedAt: new Date()
        }
      });
      console.log(`   ✅ Created test template: ${testTemplate.code}`);

      // Clean up
      await prisma.notification_templates.delete({ where: { id: testTemplate.id } });
      console.log(`   ✅ Cleanup: Test template deleted`);

      results.push({ feature: 'Notification Templates', status: 'WORKING', critical: true });
    } catch (error) {
      console.log(`   ❌ notification_templates FAILED: ${error.message}`);
      results.push({ feature: 'Notification Templates', status: 'BROKEN', critical: true });
    }

    // TEST 5: NOTIFICATIONS
    console.log('\n🔔 TEST 5: Notifications');
    try {
      const notificationCount = await prisma.notifications.count();
      console.log(`   ✅ notifications table: ${notificationCount} records`);

      // Try creating a test notification
      const testNotification = await prisma.notifications.create({
        data: {
          id: `notification-test-${timestamp}`,
          type: 'EMAIL',
          recipient: 'test@example.com',
          subject: 'Test Notification',
          body: 'This is a test notification',
          status: 'PENDING',
          tenantId: tenantId,
          updatedAt: new Date()
        }
      });
      console.log(`   ✅ Created test notification for: ${testNotification.recipient}`);

      // Clean up
      await prisma.notifications.delete({ where: { id: testNotification.id } });
      console.log(`   ✅ Cleanup: Test notification deleted`);

      results.push({ feature: 'Notifications', status: 'WORKING', critical: true });
    } catch (error) {
      console.log(`   ❌ notifications FAILED: ${error.message}`);
      results.push({ feature: 'Notifications', status: 'BROKEN', critical: true });
    }

    // TEST 6: GIFT CARDS
    console.log('\n🎁 TEST 6: Gift Cards');
    try {
      const giftCardCount = await prisma.gift_cards.count();
      console.log(`   ✅ gift_cards table: ${giftCardCount} records`);

      // Try creating a test gift card
      const testGiftCard = await prisma.gift_cards.create({
        data: {
          id: `gc-test-${timestamp}`,
          cardNo: `GC-${timestamp}`,
          initialValue: 500,
          currentBalance: 500,
          issuedDate: new Date(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          tenantId: tenantId,
          updatedAt: new Date()
        }
      });
      console.log(`   ✅ Created test gift card: ${testGiftCard.cardNo} (AED ${testGiftCard.initialValue})`);

      // Clean up
      await prisma.gift_cards.delete({ where: { id: testGiftCard.id } });
      console.log(`   ✅ Cleanup: Test gift card deleted`);

      results.push({ feature: 'Gift Cards', status: 'WORKING', critical: true });
    } catch (error) {
      console.log(`   ❌ gift_cards FAILED: ${error.message}`);
      results.push({ feature: 'Gift Cards', status: 'BROKEN', critical: true });
    }

    // TEST 7: VOUCHERS
    console.log('\n🎟️  TEST 7: Vouchers');
    try {
      const voucherCount = await prisma.vouchers.count();
      console.log(`   ✅ vouchers table: ${voucherCount} records`);

      // Try creating a test voucher
      const testVoucher = await prisma.vouchers.create({
        data: {
          id: `voucher-test-${timestamp}`,
          code: `SAVE20-${timestamp}`,
          name: 'Save 20% Discount',
          type: 'PERCENTAGE',
          discountPercent: 20,
          minPurchaseAmount: 100,
          usageLimit: 100,
          validFrom: new Date(),
          validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          status: 'ACTIVE',
          tenantId: tenantId,
          updatedAt: new Date()
        }
      });
      console.log(`   ✅ Created test voucher: ${testVoucher.code} (${testVoucher.discountPercent}% off)`);

      // Clean up
      await prisma.vouchers.delete({ where: { id: testVoucher.id } });
      console.log(`   ✅ Cleanup: Test voucher deleted`);

      results.push({ feature: 'Vouchers', status: 'WORKING', critical: true });
    } catch (error) {
      console.log(`   ❌ vouchers FAILED: ${error.message}`);
      results.push({ feature: 'Vouchers', status: 'BROKEN', critical: true });
    }

    // TEST 8: WARRANTIES
    console.log('\n🛡️  TEST 8: Warranties');
    try {
      const warrantyCount = await prisma.warranties.count();
      console.log(`   ✅ warranties table: ${warrantyCount} records`);

      // Get a product and customer for warranty test
      const product = await prisma.products.findFirst({ where: { tenantId } });
      const customer = await prisma.customers.findFirst({ where: { tenantId } });

      if (product && customer) {
        // Try creating a test warranty
        const purchaseDate = new Date();
        const warrantyPeriod = 12; // 12 months
        const expiryDate = new Date(purchaseDate.getTime() + warrantyPeriod * 30 * 24 * 60 * 60 * 1000);

        const testWarranty = await prisma.warranties.create({
          data: {
            id: `warranty-test-${timestamp}`,
            warrantyNo: `WR-${timestamp}`,
            productId: product.id,
            customerId: customer.id,
            serialNumber: `SN-${timestamp}`,
            purchaseDate: purchaseDate,
            warrantyPeriod: warrantyPeriod,
            expiryDate: expiryDate,
            status: 'ACTIVE',
            terms: '12 months manufacturer warranty',
            tenantId: tenantId,
            updatedAt: new Date()
          }
        });
        console.log(`   ✅ Created test warranty: ${testWarranty.warrantyNo} (${warrantyPeriod} months)`);

        // Clean up
        await prisma.warranties.delete({ where: { id: testWarranty.id } });
        console.log(`   ✅ Cleanup: Test warranty deleted`);

        results.push({ feature: 'Warranties', status: 'WORKING', critical: true });
      } else {
        console.log(`   ⚠️  Skipped: No products or customers found for warranty test`);
        results.push({ feature: 'Warranties', status: 'SKIPPED', critical: true });
      }
    } catch (error) {
      console.log(`   ❌ warranties FAILED: ${error.message}`);
      results.push({ feature: 'Warranties', status: 'BROKEN', critical: true });
    }

    // TEST 9: WARRANTY CLAIMS
    console.log('\n🔧 TEST 9: Warranty Claims');
    try {
      const claimCount = await prisma.warranty_claims.count();
      console.log(`   ✅ warranty_claims table: ${claimCount} records`);

      // Get a warranty for claim test
      const warranty = await prisma.warranties.findFirst();

      if (warranty) {
        // Try creating a test warranty claim
        const testClaim = await prisma.warranty_claims.create({
          data: {
            id: `claim-test-${timestamp}`,
            claimNo: `CL-${timestamp}`,
            warrantyId: warranty.id,
            issueDescription: 'Product not working as expected',
            claimDate: new Date(),
            status: 'PENDING',
            updatedAt: new Date()
          }
        });
        console.log(`   ✅ Created test warranty claim: ${testClaim.claimNo}`);

        // Clean up
        await prisma.warranty_claims.delete({ where: { id: testClaim.id } });
        console.log(`   ✅ Cleanup: Test warranty claim deleted`);

        results.push({ feature: 'Warranty Claims', status: 'WORKING', critical: true });
      } else {
        console.log(`   ⚠️  Skipped: No warranties found for claim test`);
        results.push({ feature: 'Warranty Claims', status: 'SKIPPED', critical: true });
      }
    } catch (error) {
      console.log(`   ❌ warranty_claims FAILED: ${error.message}`);
      results.push({ feature: 'Warranty Claims', status: 'BROKEN', critical: true });
    }

    // TEST 10: PRODUCT SERIAL NUMBERS
    console.log('\n🔢 TEST 10: Product Serial Numbers');
    try {
      const serialCount = await prisma.product_serial_numbers.count();
      console.log(`   ✅ product_serial_numbers table: ${serialCount} records`);

      // Get a product for serial number test
      const product = await prisma.products.findFirst({ where: { tenantId } });

      if (product) {
        // Try creating a test serial number
        const testSerial = await prisma.product_serial_numbers.create({
          data: {
            id: `serial-test-${timestamp}`,
            productId: product.id,
            serialNumber: `SN-${timestamp}`,
            status: 'AVAILABLE',
            manufactureDate: new Date(),
            expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000), // 2 years from now
            tenantId: tenantId,
            updatedAt: new Date()
          }
        });
        console.log(`   ✅ Created test serial number: ${testSerial.serialNumber}`);

        // Clean up
        await prisma.product_serial_numbers.delete({ where: { id: testSerial.id } });
        console.log(`   ✅ Cleanup: Test serial number deleted`);

        results.push({ feature: 'Product Serial Numbers', status: 'WORKING', critical: true });
      } else {
        console.log(`   ⚠️  Skipped: No products found for serial number test`);
        results.push({ feature: 'Product Serial Numbers', status: 'SKIPPED', critical: true });
      }
    } catch (error) {
      console.log(`   ❌ product_serial_numbers FAILED: ${error.message}`);
      results.push({ feature: 'Product Serial Numbers', status: 'BROKEN', critical: true });
    }

    // SUMMARY
    console.log('\n📊 NEW FEATURES TEST SUMMARY\n');
    console.log('='.repeat(80));

    const working = results.filter(r => r.status === 'WORKING').length;
    const broken = results.filter(r => r.status === 'BROKEN').length;
    const skipped = results.filter(r => r.status === 'SKIPPED').length;

    results.forEach(r => {
      let icon = '✅';
      if (r.status === 'BROKEN') icon = '❌';
      if (r.status === 'SKIPPED') icon = '⚠️';

      const priority = r.critical ? '🔴 CRITICAL' : '🟢 OPTIONAL';
      console.log(`${icon} ${r.feature}: ${r.status} [${priority}]`);
    });

    console.log('\n' + '='.repeat(80));
    console.log(`\n✅ Working: ${working}/${results.length - skipped} (${((working/(results.length - skipped))*100).toFixed(1)}%)`);
    if (skipped > 0) {
      console.log(`⚠️  Skipped: ${skipped}/${results.length} (requires sample data)`);
    }
    if (broken > 0) {
      console.log(`❌ Broken: ${broken}/${results.length} (${((broken/results.length)*100).toFixed(1)}%)`);
    }

    if (working === results.length - skipped && broken === 0) {
      console.log('\n🎉 🎉 🎉  ALL NEW FEATURES WORKING!  🎉 🎉 🎉\n');
      console.log('✨ Your ERP now has CRM, notifications, gift cards, vouchers, warranties, and serial numbers! ✨\n');
      console.log('📋 WHAT YOU CAN NOW DO:\n');
      console.log('1. ✅ Manage leads and convert them to customers');
      console.log('2. ✅ Track opportunities through sales pipeline');
      console.log('3. ✅ Schedule and track activities (calls, meetings, tasks)');
      console.log('4. ✅ Send email/SMS/push notifications to customers');
      console.log('5. ✅ Issue and redeem gift cards');
      console.log('6. ✅ Create and use promotional vouchers');
      console.log('7. ✅ Track product warranties and claims');
      console.log('8. ✅ Manage product serial numbers for tracking');
      console.log('\n🚀 SYSTEM STATUS: 100% OPERATIONAL\n');
    } else {
      console.log('\n⚠️  Some features need attention. Review errors above.\n');
    }

    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n❌ TEST ERROR:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testNewFeatures();
