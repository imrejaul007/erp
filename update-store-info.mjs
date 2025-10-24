import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function updateStoreInfo() {
  try {
    console.log('🏪 UPDATING STORE INFORMATION\n');
    console.log('='.repeat(80));

    // Get tenant ID
    const tenant = await prisma.$queryRaw`SELECT id FROM tenants LIMIT 1`;
    if (tenant.length === 0) {
      console.log('❌ No tenant found!');
      return;
    }
    const tenantId = tenant[0].id;

    // Get the store
    const store = await prisma.stores.findFirst({
      where: { tenantId, isActive: true }
    });

    if (!store) {
      console.log('❌ No store found!');
      return;
    }

    console.log(`\nℹ️  Current Store: ${store.name} (${store.code})`);
    console.log(`   Address: ${store.address || 'Not set'}`);
    console.log(`   Phone: ${store.phone || 'Not set'}`);
    console.log(`   Email: ${store.email || 'Not set'}`);

    // Check what's missing
    const missing = [];
    if (!store.address || store.address === 'Test Address') missing.push('address');
    if (!store.phone) missing.push('phone');
    if (!store.email) missing.push('email');

    if (missing.length === 0) {
      console.log('\n✅ Store information is already complete!');
      return;
    }

    console.log(`\n🔄 Updating missing fields: ${missing.join(', ')}...\n`);

    // Update store with complete information
    const updated = await prisma.stores.update({
      where: { id: store.id },
      data: {
        address: store.address && store.address !== 'Test Address'
          ? store.address
          : 'Dubai Perfume Souk, Deira, Dubai',
        phone: store.phone || '+971-4-2234567',
        email: store.email || 'store@oudperfume.ae',
        updatedAt: new Date()
      }
    });

    console.log('✅ Store information updated!\n');
    console.log('Updated Details:');
    console.log(`   📍 Address: ${updated.address}`);
    console.log(`   📞 Phone: ${updated.phone}`);
    console.log(`   📧 Email: ${updated.email}`);

    console.log('\n📋 This information will appear on:');
    console.log('   • Customer receipts');
    console.log('   • Invoices');
    console.log('   • Reports');
    console.log('   • Customer communications');

    console.log('\n='.repeat(80));
    console.log('✅ SUCCESS! Store information is now complete.\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

updateStoreInfo();
