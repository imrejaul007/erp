import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function addSampleCustomers() {
  try {
    console.log('👥 ADDING SAMPLE CUSTOMERS\n');
    console.log('='.repeat(70));

    // Get tenant
    const tenant = await prisma.$queryRaw`SELECT id FROM tenants LIMIT 1`;
    if (tenant.length === 0) {
      console.log('❌ No tenant found!');
      return;
    }
    const tenantId = tenant[0].id;

    // Check existing customers
    const existingCount = await prisma.customers.count({ where: { tenantId } });
    console.log(`\n📊 Current customers: ${existingCount}`);

    // Sample customers for UAE perfume business
    const sampleCustomers = [
      {
        id: 'cust-001-' + Date.now(),
        customerNo: 'CUST-001',
        firstName: 'Ahmed',
        lastName: 'Al Maktoum',
        email: 'ahmed.almaktoum@example.ae',
        phone: '+971501234567',
        type: 'INDIVIDUAL',
        country: 'UAE',
        city: 'Dubai',
        emirate: 'DUBAI',
        address: 'Dubai Marina, Tower 1',
        tenantId,
        updatedAt: new Date()
      },
      {
        id: 'cust-002-' + Date.now(),
        customerNo: 'CUST-002',
        firstName: 'Fatima',
        lastName: 'Al Nahyan',
        email: 'fatima.alnahyan@example.ae',
        phone: '+971502345678',
        type: 'INDIVIDUAL',
        country: 'UAE',
        city: 'Abu Dhabi',
        emirate: 'ABU_DHABI',
        address: 'Corniche Road, Abu Dhabi',
        tenantId,
        updatedAt: new Date()
      },
      {
        id: 'cust-003-' + Date.now(),
        customerNo: 'CUST-003',
        firstName: 'Mohammed',
        lastName: 'Al Qassimi',
        email: 'mohammed.qassimi@example.ae',
        phone: '+971503456789',
        type: 'INDIVIDUAL',
        country: 'UAE',
        city: 'Sharjah',
        emirate: 'SHARJAH',
        address: 'Al Majaz, Sharjah',
        tenantId,
        updatedAt: new Date()
      },
      {
        id: 'cust-004-' + Date.now(),
        customerNo: 'CUST-004',
        firstName: 'Noura',
        lastName: 'Al Shamsi',
        email: 'noura.shamsi@example.ae',
        phone: '+971504567890',
        type: 'INDIVIDUAL',
        country: 'UAE',
        city: 'Dubai',
        emirate: 'DUBAI',
        address: 'Jumeirah Beach Residence',
        tenantId,
        updatedAt: new Date()
      },
      {
        id: 'cust-005-' + Date.now(),
        customerNo: 'CUST-005',
        firstName: 'Khalid',
        lastName: 'Al Mansouri',
        email: 'khalid.mansouri@example.ae',
        phone: '+971505678901',
        type: 'INDIVIDUAL',
        country: 'UAE',
        city: 'Dubai',
        emirate: 'DUBAI',
        address: 'Downtown Dubai',
        tenantId,
        updatedAt: new Date()
      },
      {
        id: 'cust-006-' + Date.now(),
        customerNo: 'CUST-006',
        firstName: 'Luxury Hotels',
        lastName: 'Group',
        email: 'procurement@luxuryhotels.ae',
        phone: '+971506789012',
        type: 'CORPORATE',
        country: 'UAE',
        city: 'Dubai',
        emirate: 'DUBAI',
        address: 'Sheikh Zayed Road, Dubai',
        companyName: 'Luxury Hotels Group LLC',
        tenantId,
        updatedAt: new Date()
      },
      {
        id: 'cust-007-' + Date.now(),
        customerNo: 'CUST-007',
        firstName: 'Aisha',
        lastName: 'Al Suwaidi',
        email: 'aisha.suwaidi@example.ae',
        phone: '+971507890123',
        type: 'INDIVIDUAL',
        country: 'UAE',
        city: 'Abu Dhabi',
        emirate: 'ABU_DHABI',
        address: 'Al Reem Island',
        tenantId,
        updatedAt: new Date()
      },
      {
        id: 'cust-008-' + Date.now(),
        customerNo: 'CUST-008',
        firstName: 'Omar',
        lastName: 'Al Zaabi',
        email: 'omar.zaabi@example.ae',
        phone: '+971508901234',
        type: 'INDIVIDUAL',
        country: 'UAE',
        city: 'Dubai',
        emirate: 'DUBAI',
        address: 'Palm Jumeirah',
        tenantId,
        updatedAt: new Date()
      },
      {
        id: 'cust-009-' + Date.now(),
        customerNo: 'CUST-009',
        firstName: 'Maryam',
        lastName: 'Al Mazrouei',
        email: 'maryam.mazrouei@example.ae',
        phone: '+971509012345',
        type: 'INDIVIDUAL',
        country: 'UAE',
        city: 'Dubai',
        emirate: 'DUBAI',
        address: 'Business Bay',
        tenantId,
        updatedAt: new Date()
      },
      {
        id: 'cust-010-' + Date.now(),
        customerNo: 'CUST-010',
        firstName: 'Perfume Retailers',
        lastName: 'Trading',
        email: 'orders@perfumeretailers.ae',
        phone: '+971500123456',
        type: 'CORPORATE',
        country: 'UAE',
        city: 'Dubai',
        emirate: 'DUBAI',
        address: 'Deira, Gold Souk Area',
        companyName: 'Perfume Retailers Trading LLC',
        tenantId,
        updatedAt: new Date()
      }
    ];

    console.log(`\n📝 Adding ${sampleCustomers.length} sample customers...\n`);

    let added = 0;
    let skipped = 0;

    for (const customer of sampleCustomers) {
      try {
        // Check if customer with this customerNo already exists
        const existing = await prisma.customers.findFirst({
          where: {
            customerNo: customer.customerNo,
            tenantId
          }
        });

        if (existing) {
          console.log(`   ⏭️  ${customer.customerNo}: Already exists (${customer.firstName} ${customer.lastName})`);
          skipped++;
        } else {
          await prisma.customers.create({ data: customer });
          const type = customer.type === 'CORPORATE' ? '🏢' : '👤';
          console.log(`   ✅ ${type} ${customer.customerNo}: ${customer.firstName} ${customer.lastName}`);
          console.log(`      📧 ${customer.email}`);
          console.log(`      📱 ${customer.phone}`);
          console.log(`      📍 ${customer.city}, ${customer.emirate}\n`);
          added++;
        }
      } catch (error) {
        console.log(`   ❌ Failed to add ${customer.customerNo}: ${error.message}`);
      }
    }

    console.log('='.repeat(70));
    console.log('\n📊 SUMMARY\n');
    console.log(`   ✅ Added: ${added} customers`);
    console.log(`   ⏭️  Skipped: ${skipped} (already exist)`);
    console.log(`   📈 Total now: ${existingCount + added} customers`);

    if (added > 0) {
      console.log('\n🎉 SUCCESS! Sample customers added to database');
      console.log('\n💡 You can now:');
      console.log('   1. Go to /customers to view them');
      console.log('   2. Go to /pos to process sales with these customers');
      console.log('   3. Edit customer details as needed');
      console.log('   4. Add more customers anytime');
    } else if (skipped === sampleCustomers.length) {
      console.log('\n✅ All sample customers already exist in database');
      console.log('   No action needed - you can use them for POS sales');
    }

    // Show customer types breakdown
    const finalCount = await prisma.customers.count({ where: { tenantId } });
    const individualCount = await prisma.customers.count({
      where: { tenantId, type: 'INDIVIDUAL' }
    });
    const corporateCount = await prisma.customers.count({
      where: { tenantId, type: 'CORPORATE' }
    });

    console.log('\n📊 Customer Types:');
    console.log(`   👤 Individual: ${individualCount}`);
    console.log(`   🏢 Corporate: ${corporateCount}`);
    console.log(`   📋 Total: ${finalCount}`);

    console.log('\n='.repeat(70));

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleCustomers();
