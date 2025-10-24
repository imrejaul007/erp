import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function finalStatusCheck() {
  try {
    console.log('🔍 FINAL COMPREHENSIVE STATUS CHECK\n');
    console.log('='.repeat(80));

    const tenant = await prisma.$queryRaw`SELECT id, name FROM tenants LIMIT 1`;
    if (tenant.length === 0) {
      console.log('❌ No tenant found!');
      return;
    }
    const tenantId = tenant[0].id;

    const missing = [];
    const warnings = [];
    const optional = [];

    // ============= CRITICAL DATA =============
    console.log('\n📊 CRITICAL DATA CHECK\n');

    const users = await prisma.users.count({ where: { tenantId } });
    console.log(`👤 Users: ${users}`);
    if (users === 0) {
      missing.push('❌ No users (cannot login)');
    } else if (users === 1) {
      warnings.push('⚠️  Only 1 user - add staff accounts');
    }

    const customers = await prisma.customers.count({ where: { tenantId } });
    console.log(`👥 Customers: ${customers}`);
    if (customers === 0) {
      missing.push('❌ No customers (POS cannot work)');
    }

    const products = await prisma.products.count({ where: { tenantId, isActive: true } });
    console.log(`📦 Products: ${products}`);
    if (products === 0) {
      missing.push('❌ No products (cannot make sales)');
    }

    const stores = await prisma.stores.count({ where: { tenantId, isActive: true } });
    console.log(`🏪 Stores: ${stores}`);
    if (stores === 0) {
      missing.push('❌ No stores');
    }

    const suppliers = await prisma.suppliers.count({ where: { tenantId } });
    console.log(`🏭 Suppliers: ${suppliers}`);
    if (suppliers === 0) {
      optional.push('💡 Add suppliers for purchase orders');
    }

    const sales = await prisma.sales.count();
    console.log(`💰 Sales: ${sales}`);

    try {
      const returns = await prisma.return_orders.count();
      console.log(`🔄 Returns Table: ✅ Available`);
    } catch (e) {
      missing.push('❌ Returns table missing');
    }

    // Security check
    const adminUser = await prisma.users.findFirst({ where: { tenantId } });
    if (adminUser?.email.includes('admin@')) {
      warnings.push('🔴 Change default admin password!');
    }

    console.log('\n' + '='.repeat(80));
    console.log('❓ WHAT\'S MISSING\n');

    if (missing.length === 0) {
      console.log('✅ NO CRITICAL ITEMS MISSING!\n');
    } else {
      console.log('🔴 CRITICAL:');
      missing.forEach(m => console.log(`   ${m}`));
      console.log('');
    }

    if (warnings.length > 0) {
      console.log('⚠️  WARNINGS:');
      warnings.forEach(w => console.log(`   ${w}`));
      console.log('');
    }

    if (optional.length > 0) {
      console.log('💡 OPTIONAL:');
      optional.forEach(o => console.log(`   ${o}`));
      console.log('');
    }

    console.log('='.repeat(80));
    console.log('🎯 STATUS: ' + (missing.length === 0 ? '✅ READY' : '❌ NOT READY'));
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

finalStatusCheck();
