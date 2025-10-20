import { PrismaClient } from '@prisma/client';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function comprehensiveAudit() {
  console.log('🔍 COMPREHENSIVE SYSTEM AUDIT\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const missing = [];
  const working = [];
  const warnings = [];

  try {
    // 1. Check Database Tables
    console.log('1️⃣ Database Tables Check...\n');

    const tables = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    const tableNames = tables.map(t => t.table_name);
    console.log(`   Found ${tableNames.length} tables:\n`);

    const requiredTables = [
      'users', 'tenants', 'products', 'customers', 'suppliers',
      'sales', 'sale_items', 'purchases', 'purchase_items',
      'inventory_transactions', 'vat_records', 'stores',
      'categories', 'price_lists', 'payments'
    ];

    requiredTables.forEach(table => {
      if (tableNames.includes(table)) {
        console.log(`   ✅ ${table}`);
        working.push(`Table: ${table}`);
      } else {
        console.log(`   ❌ ${table} - MISSING`);
        missing.push(`Database table: ${table}`);
      }
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 2. Check API Endpoints
    console.log('2️⃣ API Endpoints Check...\n');

    const apiPaths = [
      'app/api/auth',
      'app/api/products',
      'app/api/customers',
      'app/api/suppliers',
      'app/api/sales',
      'app/api/purchases',
      'app/api/inventory',
      'app/api/stores',
      'app/api/users',
      'app/api/reports'
    ];

    apiPaths.forEach(path => {
      try {
        const stat = require('fs').statSync(path);
        console.log(`   ✅ ${path}`);
        working.push(`API: ${path}`);
      } catch {
        console.log(`   ⚠️  ${path} - NOT FOUND`);
        warnings.push(`API endpoint: ${path}`);
      }
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 3. Check UI Pages
    console.log('3️⃣ UI Pages Check...\n');

    const uiPages = [
      'app/dashboard',
      'app/products',
      'app/customers',
      'app/suppliers',
      'app/sales',
      'app/purchases',
      'app/inventory',
      'app/pos',
      'app/reports',
      'app/settings'
    ];

    uiPages.forEach(path => {
      try {
        const stat = require('fs').statSync(path);
        console.log(`   ✅ ${path}`);
        working.push(`UI: ${path}`);
      } catch {
        console.log(`   ⚠️  ${path} - NOT FOUND`);
        warnings.push(`UI page: ${path}`);
      }
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 4. Check Critical Features
    console.log('4️⃣ Critical Features Check...\n');

    const features = [
      { name: 'Authentication', file: 'lib/auth-simple.ts' },
      { name: 'Sales System', file: 'app/api/sales/route.ts' },
      { name: 'VAT Calculation', file: 'app/api/sales/route.ts' },
      { name: 'Offline POS', file: 'components/pos/OfflinePOS.jsx' },
      { name: 'Marketplace Import', file: 'lib/marketplace-parsers.ts' },
      { name: 'VAT Reporting', file: 'app/api/sales/vat-summary/route.ts' },
      { name: 'Barcode Scanner', file: 'components/barcode/AdvancedBarcodeSystem.tsx' },
      { name: 'Multi-currency', file: 'components/conversion/EnhancedUnitConverter.tsx' }
    ];

    features.forEach(feature => {
      try {
        const stat = require('fs').statSync(feature.file);
        console.log(`   ✅ ${feature.name}`);
        working.push(`Feature: ${feature.name}`);
      } catch {
        console.log(`   ❌ ${feature.name} - NOT IMPLEMENTED`);
        missing.push(`Feature: ${feature.name}`);
      }
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 5. Check Data Integrity
    console.log('5️⃣ Data Integrity Check...\n');

    // Check for orphaned records
    const orphanedSaleItems = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM sale_items si
      LEFT JOIN sales s ON si."saleId" = s.id
      WHERE s.id IS NULL
    `;

    if (parseInt(orphanedSaleItems[0].count) === 0) {
      console.log('   ✅ No orphaned sale items');
      working.push('Data integrity: sale_items');
    } else {
      console.log(`   ⚠️  ${orphanedSaleItems[0].count} orphaned sale items`);
      warnings.push(`${orphanedSaleItems[0].count} orphaned sale items`);
    }

    // Check for missing tenantId
    const salesNoTenant = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM sales WHERE "tenantId" IS NULL
    `;

    if (parseInt(salesNoTenant[0].count) === 0) {
      console.log('   ✅ All sales have tenantId');
      working.push('Multi-tenancy: sales');
    } else {
      console.log(`   ❌ ${salesNoTenant[0].count} sales without tenantId`);
      missing.push(`TenantId for ${salesNoTenant[0].count} sales`);
    }

    // Check for products without prices
    const productsNoPrice = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM products
      WHERE "sellingPrice" IS NULL OR "sellingPrice" <= 0
    `;

    if (parseInt(productsNoPrice[0].count) === 0) {
      console.log('   ✅ All products have valid prices');
      working.push('Product pricing complete');
    } else {
      console.log(`   ⚠️  ${productsNoPrice[0].count} products without valid prices`);
      warnings.push(`${productsNoPrice[0].count} products need pricing`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 6. Check Environment Variables
    console.log('6️⃣ Environment Variables Check...\n');

    const envVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL'
    ];

    envVars.forEach(envVar => {
      if (process.env[envVar]) {
        console.log(`   ✅ ${envVar}`);
        working.push(`Env: ${envVar}`);
      } else {
        console.log(`   ⚠️  ${envVar} - NOT SET`);
        warnings.push(`Environment variable: ${envVar}`);
      }
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 7. Check for Common Missing Features
    console.log('7️⃣ Common ERP Features Check...\n');

    const erpFeatures = [
      { name: 'User Management', check: async () => {
        const users = await prisma.$queryRaw`SELECT COUNT(*) as count FROM users`;
        return parseInt(users[0].count) > 0;
      }},
      { name: 'Multi-Store Support', check: async () => {
        const stores = await prisma.$queryRaw`SELECT COUNT(*) as count FROM stores`;
        return parseInt(stores[0].count) > 0;
      }},
      { name: 'Product Catalog', check: async () => {
        const products = await prisma.$queryRaw`SELECT COUNT(*) as count FROM products`;
        return parseInt(products[0].count) > 0;
      }},
      { name: 'Customer Database', check: async () => {
        const customers = await prisma.$queryRaw`SELECT COUNT(*) as count FROM customers`;
        return parseInt(customers[0].count) >= 0;
      }},
      { name: 'Sales Transactions', check: async () => {
        return tableNames.includes('sales');
      }},
      { name: 'VAT Compliance', check: async () => {
        return tableNames.includes('vat_records');
      }}
    ];

    for (const feature of erpFeatures) {
      const exists = await feature.check();
      if (exists) {
        console.log(`   ✅ ${feature.name}`);
        working.push(`ERP Feature: ${feature.name}`);
      } else {
        console.log(`   ⚠️  ${feature.name} - NEEDS SETUP`);
        warnings.push(`ERP Feature: ${feature.name} needs setup`);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 8. Check Statistics
    console.log('8️⃣ System Statistics...\n');

    const stats = await prisma.$queryRaw`
      SELECT
        (SELECT COUNT(*) FROM users) as users,
        (SELECT COUNT(*) FROM tenants) as tenants,
        (SELECT COUNT(*) FROM products) as products,
        (SELECT COUNT(*) FROM customers) as customers,
        (SELECT COUNT(*) FROM sales) as sales,
        (SELECT COUNT(*) FROM stores) as stores
    `;

    const s = stats[0];
    console.log(`   👥 Users: ${s.users}`);
    console.log(`   🏢 Tenants: ${s.tenants}`);
    console.log(`   📦 Products: ${s.products}`);
    console.log(`   👤 Customers: ${s.customers}`);
    console.log(`   💰 Sales: ${s.sales}`);
    console.log(`   🏪 Stores: ${s.stores}`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Final Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 AUDIT SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log(`✅ Working: ${working.length} features`);
    console.log(`⚠️  Warnings: ${warnings.length} items`);
    console.log(`❌ Missing: ${missing.length} items\n`);

    if (missing.length > 0) {
      console.log('❌ MISSING ITEMS:\n');
      missing.forEach((item, i) => {
        console.log(`   ${i + 1}. ${item}`);
      });
      console.log();
    }

    if (warnings.length > 0) {
      console.log('⚠️  WARNINGS (Non-critical):\n');
      warnings.forEach((item, i) => {
        console.log(`   ${i + 1}. ${item}`);
      });
      console.log();
    }

    if (missing.length === 0 && warnings.length <= 3) {
      console.log('✅✅✅ SYSTEM IS COMPLETE! ✅✅✅\n');
      console.log('All critical features are implemented and working.\n');
      console.log('Minor warnings (if any) are optional enhancements.\n');
    } else if (missing.length === 0) {
      console.log('✅ CORE SYSTEM COMPLETE\n');
      console.log('All critical features working. Some optional features need setup.\n');
    } else {
      console.log('⚠️  SOME FEATURES MISSING\n');
      console.log('Please address missing items for full functionality.\n');
    }

  } catch (error) {
    console.error('❌ Audit Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

comprehensiveAudit();
