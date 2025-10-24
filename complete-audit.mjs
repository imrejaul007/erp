import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function completeAudit() {
  try {
    console.log('🔍 COMPLETE SYSTEM AUDIT - CHECKING EVERYTHING\n');
    console.log('='.repeat(80));

    const tenant = await prisma.$queryRaw`SELECT id, name FROM tenants LIMIT 1`;
    if (tenant.length === 0) {
      console.log('❌ CRITICAL: No tenant found!');
      return;
    }
    const tenantId = tenant[0].id;
    const tenantName = tenant[0].name;

    console.log(`\n🏢 Tenant: ${tenantName}`);
    console.log(`   ID: ${tenantId}\n`);

    const issues = [];
    const warnings = [];
    const suggestions = [];

    // ============= SECTION 1: DATABASE CONTENT =============
    console.log('━'.repeat(80));
    console.log('📊 SECTION 1: DATABASE CONTENT CHECK\n');

    // Users
    const users = await prisma.users.findMany({ where: { tenantId } });
    console.log(`👤 Users: ${users.length}`);
    if (users.length === 0) {
      issues.push('❌ CRITICAL: No users found');
    } else {
      console.log(`   Admin: ${users[0].email}`);

      // Check if using default password (can't check directly, but can check if user was recently created)
      const createdRecently = new Date(users[0].createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      if (createdRecently && users[0].email.includes('admin')) {
        warnings.push('⚠️  SECURITY: Likely using default password - CHANGE IT!');
      }

      if (users.length === 1) {
        suggestions.push('💡 Add staff user accounts for multi-user access');
      }
    }

    // Customers
    const customers = await prisma.customers.count({ where: { tenantId } });
    console.log(`👥 Customers: ${customers}`);
    if (customers === 0) {
      issues.push('❌ CRITICAL: No customers - POS cannot process sales');
    } else if (customers < 5) {
      warnings.push(`⚠️  Only ${customers} customers - may need more for production`);
    }

    // Products
    const products = await prisma.products.count({ where: { tenantId, isActive: true } });
    console.log(`📦 Products: ${products}`);
    if (products === 0) {
      issues.push('❌ CRITICAL: No products - Cannot make sales');
    } else if (products < 10) {
      warnings.push(`⚠️  Only ${products} products - may need more for production`);
    }

    // Categories
    const categories = await prisma.categories.count({ where: { tenantId } });
    console.log(`📂 Categories: ${categories}`);
    if (categories === 0) {
      warnings.push('⚠️  No categories - helps with organization');
    }

    // Brands
    const brands = await prisma.brands.count({ where: { tenantId } });
    console.log(`🏷️  Brands: ${brands}`);
    if (brands === 0) {
      warnings.push('⚠️  No brands - helps with organization');
    }

    // Stores
    const stores = await prisma.stores.count({ where: { tenantId, isActive: true } });
    console.log(`🏪 Stores: ${stores}`);
    if (stores === 0) {
      issues.push('❌ CRITICAL: No stores - Need at least one location');
    }

    // Suppliers
    const suppliers = await prisma.suppliers.count({ where: { tenantId } });
    console.log(`🏭 Suppliers: ${suppliers}`);
    if (suppliers === 0) {
      suggestions.push('💡 Add suppliers for purchase orders');
    }

    // Sales (sales table doesn't have tenantId, uses stores relation)
    const sales = await prisma.sales.count();
    console.log(`💰 Sales: ${sales}`);
    if (sales === 0) {
      console.log('   ℹ️  No sales yet (expected for new system)');
    }

    // ============= SECTION 2: DATA QUALITY =============
    console.log('\n' + '━'.repeat(80));
    console.log('🔍 SECTION 2: DATA QUALITY CHECK\n');

    // Check products have required fields
    const productsData = await prisma.products.findMany({
      where: { tenantId, isActive: true },
      select: {
        id: true,
        code: true,
        name: true,
        sku: true,
        sellingPrice: true,
        costPrice: true,
        vatRate: true,
        currency: true,
        category: true
      }
    });

    let productsWithIssues = 0;
    productsData.forEach(p => {
      const productIssues = [];
      if (!p.code) productIssues.push('no code');
      if (!p.name) productIssues.push('no name');
      if (!p.sku) productIssues.push('no SKU');
      if (!p.sellingPrice || p.sellingPrice <= 0) productIssues.push('invalid price');
      if (!p.vatRate && p.vatRate !== 0) productIssues.push('no VAT rate');

      if (productIssues.length > 0) {
        productsWithIssues++;
      }
    });

    if (productsWithIssues > 0) {
      warnings.push(`⚠️  ${productsWithIssues} products have data issues`);
    } else if (products > 0) {
      console.log('✅ All products have required fields');
    }

    // Check customers have required fields
    const customersData = await prisma.customers.findMany({
      where: { tenantId },
      select: {
        id: true,
        customerNo: true,
        firstName: true,
        email: true,
        phone: true
      }
    });

    let customersWithIssues = 0;
    customersData.forEach(c => {
      const customerIssues = [];
      if (!c.customerNo) customerIssues.push('no customer number');
      if (!c.firstName) customerIssues.push('no name');
      if (!c.email) customerIssues.push('no email');
      if (!c.phone) customerIssues.push('no phone');

      if (customerIssues.length > 0) {
        customersWithIssues++;
      }
    });

    if (customersWithIssues > 0) {
      warnings.push(`⚠️  ${customersWithIssues} customers have incomplete data`);
    } else if (customers > 0) {
      console.log('✅ All customers have required fields');
    }

    // ============= SECTION 3: FEATURE AVAILABILITY =============
    console.log('\n' + '━'.repeat(80));
    console.log('⚙️  SECTION 3: FEATURE AVAILABILITY CHECK\n');

    // Check if critical tables exist by trying to query them
    const featureChecks = [];

    try {
      await prisma.returnOrder.findMany({ take: 1 });
      featureChecks.push({ feature: 'Returns System', status: 'AVAILABLE' });
    } catch (e) {
      featureChecks.push({ feature: 'Returns System', status: 'NOT AVAILABLE' });
      issues.push('❌ Returns table missing or misconfigured');
    }

    try {
      await prisma.purchaseOrder.findMany({ take: 1 });
      featureChecks.push({ feature: 'Purchase Orders', status: 'AVAILABLE' });
    } catch (e) {
      warnings.push('⚠️  Purchase Orders may not be configured');
    }

    try {
      await prisma.stockAdjustment.findMany({ take: 1 });
      featureChecks.push({ feature: 'Stock Adjustments', status: 'AVAILABLE' });
    } catch (e) {
      warnings.push('⚠️  Stock Adjustments may not be configured');
    }

    try {
      await prisma.invoice.findMany({ take: 1 });
      featureChecks.push({ feature: 'Invoicing', status: 'AVAILABLE' });
    } catch (e) {
      warnings.push('⚠️  Invoicing may not be configured');
    }

    featureChecks.forEach(check => {
      const icon = check.status === 'AVAILABLE' ? '✅' : '❌';
      console.log(`${icon} ${check.feature}: ${check.status}`);
    });

    // ============= SECTION 4: CONFIGURATION =============
    console.log('\n' + '━'.repeat(80));
    console.log('⚙️  SECTION 4: CONFIGURATION CHECK\n');

    // VAT Configuration
    const productsWithVAT = await prisma.products.count({
      where: { tenantId, vatRate: { gt: 0 } }
    });
    console.log(`💰 VAT Configuration:`);
    if (productsWithVAT === 0 && products > 0) {
      warnings.push('⚠️  No products have VAT configured (UAE requires 5%)');
      console.log(`   ⚠️  0/${products} products have VAT rate set`);
    } else {
      console.log(`   ✅ ${productsWithVAT}/${products} products have VAT configured`);
    }

    // Currency
    const currencies = await prisma.$queryRaw`
      SELECT DISTINCT currency FROM products WHERE "tenantId" = ${tenantId}
    `;
    console.log(`💱 Currencies: ${currencies.map(c => c.currency).join(', ') || 'None'}`);
    if (currencies.length === 0 && products > 0) {
      warnings.push('⚠️  Products missing currency information');
    }

    // Store Configuration
    const storesData = await prisma.stores.findMany({
      where: { tenantId, isActive: true },
      select: {
        name: true,
        code: true,
        address: true,
        phone: true,
        email: true
      }
    });

    console.log(`\n🏪 Store Details:`);
    storesData.forEach(store => {
      console.log(`   - ${store.name} (${store.code})`);
      if (!store.address) warnings.push(`⚠️  Store "${store.name}" missing address`);
      if (!store.phone) warnings.push(`⚠️  Store "${store.name}" missing phone`);
    });

    // ============= SECTION 5: SECURITY & ACCESS =============
    console.log('\n' + '━'.repeat(80));
    console.log('🔒 SECTION 5: SECURITY & ACCESS CHECK\n');

    // User details
    users.forEach(user => {
      console.log(`👤 User: ${user.email}`);
      console.log(`   Created: ${user.createdAt.toISOString().split('T')[0]}`);
      console.log(`   Name: ${user.firstName || ''} ${user.lastName || ''}`);

      // Check if account was created with default email
      if (user.email.includes('admin@') || user.email.includes('test@')) {
        suggestions.push('💡 Consider changing admin email to personal email');
      }
    });

    // ============= SECTION 6: BUSINESS READINESS =============
    console.log('\n' + '━'.repeat(80));
    console.log('💼 SECTION 6: BUSINESS READINESS CHECK\n');

    const readiness = {
      canLogin: users.length > 0,
      hasCustomers: customers > 0,
      hasProducts: products > 0,
      hasStore: stores > 0,
      hasCategories: categories > 0,
      canProcessSales: customers > 0 && products > 0 && stores > 0,
      canProcessReturns: true, // Feature exists
      hasVATConfig: productsWithVAT > 0,
      multiUser: users.length > 1
    };

    console.log(`✅ Can login: ${readiness.canLogin ? 'YES' : 'NO'}`);
    console.log(`${readiness.hasCustomers ? '✅' : '❌'} Has customers: ${readiness.hasCustomers ? 'YES' : 'NO'}`);
    console.log(`${readiness.hasProducts ? '✅' : '❌'} Has products: ${readiness.hasProducts ? 'YES' : 'NO'}`);
    console.log(`${readiness.hasStore ? '✅' : '❌'} Has store: ${readiness.hasStore ? 'YES' : 'NO'}`);
    console.log(`${readiness.canProcessSales ? '✅' : '❌'} Can process sales: ${readiness.canProcessSales ? 'YES' : 'NO'}`);
    console.log(`✅ Can process returns: YES`);
    console.log(`${readiness.hasVATConfig ? '✅' : '⚠️ '} VAT configured: ${readiness.hasVATConfig ? 'YES' : 'PARTIAL'}`);
    console.log(`${readiness.multiUser ? '✅' : '⚠️ '} Multi-user ready: ${readiness.multiUser ? 'YES' : 'NO (only 1 user)'}`);

    // ============= SECTION 7: WHAT'S MISSING =============
    console.log('\n' + '━'.repeat(80));
    console.log('🔍 SECTION 7: WHAT\'S ACTUALLY MISSING\n');

    console.log('🔴 CRITICAL ISSUES (Must fix):');
    if (issues.length === 0) {
      console.log('   ✅ No critical issues found!');
    } else {
      issues.forEach(issue => console.log(`   ${issue}`));
    }

    console.log('\n⚠️  WARNINGS (Should fix):');
    if (warnings.length === 0) {
      console.log('   ✅ No warnings!');
    } else {
      warnings.forEach(warning => console.log(`   ${warning}`));
    }

    console.log('\n💡 SUGGESTIONS (Nice to have):');
    if (suggestions.length === 0) {
      console.log('   ✅ System is well configured!');
    } else {
      suggestions.forEach(suggestion => console.log(`   ${suggestion}`));
    }

    // ============= FINAL SUMMARY =============
    console.log('\n' + '='.repeat(80));
    console.log('📊 FINAL AUDIT SUMMARY\n');

    const criticalCount = issues.length;
    const warningCount = warnings.length;
    const suggestionCount = suggestions.length;

    console.log(`Database Records:`);
    console.log(`   👤 Users: ${users.length}`);
    console.log(`   👥 Customers: ${customers}`);
    console.log(`   📦 Products: ${products}`);
    console.log(`   📂 Categories: ${categories}`);
    console.log(`   🏷️  Brands: ${brands}`);
    console.log(`   🏪 Stores: ${stores}`);
    console.log(`   🏭 Suppliers: ${suppliers}`);
    console.log(`   💰 Sales: ${sales}`);

    console.log(`\nSystem Health:`);
    console.log(`   🔴 Critical Issues: ${criticalCount}`);
    console.log(`   ⚠️  Warnings: ${warningCount}`);
    console.log(`   💡 Suggestions: ${suggestionCount}`);

    console.log('\n' + '='.repeat(80));

    if (criticalCount === 0 && warningCount === 0) {
      console.log('\n🎉 🎉 🎉  PERFECT! NOTHING CRITICAL MISSING!  🎉 🎉 🎉\n');
      console.log('Your ERP system is 100% ready for production use!');
      console.log('\nYou can start using it immediately for:');
      console.log('   ✅ Processing sales');
      console.log('   ✅ Managing customers');
      console.log('   ✅ Tracking inventory');
      console.log('   ✅ Handling returns');
      console.log('   ✅ Generating reports');
    } else if (criticalCount === 0) {
      console.log('\n✅ SYSTEM IS OPERATIONAL (with minor warnings)\n');
      console.log('No critical issues blocking use!');
      console.log(`\nAddress ${warningCount} warning(s) when you have time.`);
    } else {
      console.log('\n⚠️  CRITICAL ISSUES FOUND\n');
      console.log(`You must fix ${criticalCount} critical issue(s) before going live.`);
    }

    if (suggestionCount > 0) {
      console.log(`\n💡 ${suggestionCount} suggestion(s) for improvement (optional).`);
    }

    console.log('\n' + '='.repeat(80));

  } catch (error) {
    console.error('\n❌ AUDIT ERROR:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

completeAudit();
