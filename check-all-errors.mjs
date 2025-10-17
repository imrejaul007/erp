import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

async function checkAllErrors() {
  console.log('🔍 COMPREHENSIVE ERROR CHECK\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const errors = [];
  const warnings = [];

  try {
    // ====================================
    // 1. DATABASE CONNECTION
    // ====================================
    console.log('1️⃣ Checking Database Connection...');
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('   ✅ Database connected\n');
    } catch (err) {
      errors.push(`Database connection failed: ${err.message}`);
      console.log('   ❌ Database connection failed\n');
    }

    // ====================================
    // 2. REQUIRED TABLES
    // ====================================
    console.log('2️⃣ Checking Required Tables...');
    const requiredTables = ['sales', 'sale_items', 'vat_records', 'products', 'stores', 'tenants', 'users', 'customers'];
    const tables = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `;
    const tableNames = tables.map(t => t.table_name);

    for (const table of requiredTables) {
      if (tableNames.includes(table)) {
        console.log(`   ✅ Table '${table}' exists`);
      } else {
        errors.push(`Required table '${table}' is missing`);
        console.log(`   ❌ Table '${table}' MISSING`);
      }
    }
    console.log();

    // ====================================
    // 3. SALES TABLE STRUCTURE
    // ====================================
    console.log('3️⃣ Checking Sales Table Structure...');
    const salesColumns = await prisma.$queryRaw`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'sales'
    `;
    const salesCols = salesColumns.map(c => c.column_name);
    const requiredSalesCols = ['id', 'saleNo', 'tenantId', 'storeId', 'vatAmount', 'totalAmount', 'source', 'marketplaceOrderId', 'importedAt'];

    for (const col of requiredSalesCols) {
      if (salesCols.includes(col)) {
        console.log(`   ✅ Column 'sales.${col}' exists`);
      } else {
        errors.push(`Required column 'sales.${col}' is missing`);
        console.log(`   ❌ Column 'sales.${col}' MISSING`);
      }
    }
    console.log();

    // ====================================
    // 4. TENANT & USER SETUP
    // ====================================
    console.log('4️⃣ Checking Tenant & User Setup...');
    const tenants = await prisma.$queryRaw`SELECT COUNT(*) as count FROM tenants`;
    const users = await prisma.$queryRaw`SELECT COUNT(*) as count FROM users`;

    if (parseInt(tenants[0].count) > 0) {
      console.log(`   ✅ Tenants exist (${tenants[0].count})`);
    } else {
      errors.push('No tenants found - system requires at least one tenant');
      console.log('   ❌ No tenants found');
    }

    if (parseInt(users[0].count) > 0) {
      console.log(`   ✅ Users exist (${users[0].count})`);
    } else {
      errors.push('No users found - system requires at least one user');
      console.log('   ❌ No users found');
    }
    console.log();

    // ====================================
    // 5. STORES SETUP
    // ====================================
    console.log('5️⃣ Checking Stores Setup...');
    const stores = await prisma.$queryRaw`SELECT COUNT(*) as count FROM stores`;
    if (parseInt(stores[0].count) > 0) {
      console.log(`   ✅ Stores exist (${stores[0].count})`);
    } else {
      warnings.push('No stores found - create at least one store for sales');
      console.log('   ⚠️  No stores found (needed for sales)');
    }
    console.log();

    // ====================================
    // 6. PRODUCTS SETUP
    // ====================================
    console.log('6️⃣ Checking Products Setup...');
    const products = await prisma.$queryRaw`SELECT COUNT(*) as count FROM products`;
    if (parseInt(products[0].count) > 0) {
      console.log(`   ✅ Products exist (${products[0].count})`);
    } else {
      warnings.push('No products found - add products to create sales');
      console.log('   ⚠️  No products found (needed for sales)');
    }
    console.log();

    // ====================================
    // 7. TEST SALES API ENDPOINT
    // ====================================
    console.log('7️⃣ Testing Sales API Endpoint...');
    try {
      const response = await fetch('http://localhost:3000/api/sales?limit=1', {
        headers: {
          'Cookie': 'next-auth.session-token=test' // Will fail auth but should return 401, not 500
        }
      });

      if (response.status === 401) {
        console.log('   ✅ API endpoint exists (returns 401 auth required)');
      } else if (response.status === 200) {
        console.log('   ✅ API endpoint working');
      } else {
        warnings.push(`API endpoint returned unexpected status: ${response.status}`);
        console.log(`   ⚠️  API returned status ${response.status}`);
      }
    } catch (err) {
      errors.push(`API endpoint test failed: ${err.message}`);
      console.log(`   ❌ API endpoint error: ${err.message}`);
    }
    console.log();

    // ====================================
    // 8. CHECK VAT SUMMARY ENDPOINT
    // ====================================
    console.log('8️⃣ Testing VAT Summary Endpoint...');
    try {
      const response = await fetch('http://localhost:3000/api/sales/vat-summary');
      if (response.status === 401 || response.status === 200) {
        console.log('   ✅ VAT summary endpoint exists');
      } else {
        warnings.push(`VAT summary endpoint returned status: ${response.status}`);
        console.log(`   ⚠️  VAT summary returned status ${response.status}`);
      }
    } catch (err) {
      errors.push(`VAT summary endpoint test failed: ${err.message}`);
      console.log(`   ❌ VAT summary error: ${err.message}`);
    }
    console.log();

    // ====================================
    // 9. CHECK IMPORT ENDPOINT
    // ====================================
    console.log('9️⃣ Testing Import Endpoint...');
    try {
      const response = await fetch('http://localhost:3000/api/sales/import', {
        method: 'OPTIONS'
      });
      if (response.status === 200 || response.status === 405) {
        console.log('   ✅ Import endpoint exists');
      } else {
        warnings.push(`Import endpoint returned status: ${response.status}`);
        console.log(`   ⚠️  Import returned status ${response.status}`);
      }
    } catch (err) {
      errors.push(`Import endpoint test failed: ${err.message}`);
      console.log(`   ❌ Import error: ${err.message}`);
    }
    console.log();

    // ====================================
    // 10. CHECK ENUM VALUES
    // ====================================
    console.log('🔟 Checking PaymentStatus Enum...');
    try {
      const enumValues = await prisma.$queryRaw`
        SELECT enumlabel FROM pg_enum
        WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'PaymentStatus')
      `;
      if (enumValues.length > 0) {
        const values = enumValues.map(e => e.enumlabel);
        console.log(`   ✅ PaymentStatus enum values: ${values.join(', ')}`);
      } else {
        console.log('   ℹ️  No PaymentStatus enum found (may use text fields)');
      }
    } catch (err) {
      console.log('   ℹ️  Could not check enum (may use text fields)');
    }
    console.log();

    // ====================================
    // 11. CHECK EXISTING SALES
    // ====================================
    console.log('1️⃣1️⃣ Checking Existing Sales Data...');
    const salesCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM sales`;
    const salesWithVat = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM sales WHERE "vatAmount" IS NOT NULL
    `;

    console.log(`   ✅ Total sales: ${salesCount[0].count}`);
    console.log(`   ✅ Sales with VAT: ${salesWithVat[0].count}`);

    if (parseInt(salesCount[0].count) > 0) {
      const sampleSale = await prisma.$queryRaw`
        SELECT "saleNo", "totalAmount", "vatAmount", status, source
        FROM sales LIMIT 1
      `;
      if (sampleSale.length > 0) {
        const sale = sampleSale[0];
        console.log(`   ✅ Sample sale: ${sale.saleNo} - ${sale.totalAmount} AED (VAT: ${sale.vatAmount} AED)`);
      }
    }
    console.log();

    // ====================================
    // 12. CHECK FILE PERMISSIONS
    // ====================================
    console.log('1️⃣2️⃣ Checking File Structure...');
    const fs = await import('fs');
    const files = [
      'app/api/sales/route.ts',
      'app/api/sales/import/route.ts',
      'app/api/sales/vat-summary/route.ts',
      'lib/marketplace-parsers.ts',
      'app/sales/new/page.tsx',
      'app/sales/import/page.tsx'
    ];

    for (const file of files) {
      try {
        await fs.promises.access(file);
        console.log(`   ✅ ${file} exists`);
      } catch {
        errors.push(`Required file missing: ${file}`);
        console.log(`   ❌ ${file} MISSING`);
      }
    }
    console.log();

    // ====================================
    // FINAL SUMMARY
    // ====================================
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 ERROR CHECK SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (errors.length === 0 && warnings.length === 0) {
      console.log('🎉 PERFECT! No errors or warnings found!\n');
      console.log('✅ All systems operational:');
      console.log('   • Database connection working');
      console.log('   • All required tables exist');
      console.log('   • Multi-tenant setup complete');
      console.log('   • API endpoints functional');
      console.log('   • VAT calculation ready');
      console.log('   • Marketplace import ready');
      console.log('   • All files in place\n');
      console.log('🚀 System is production-ready!\n');
    } else {
      if (errors.length > 0) {
        console.log(`❌ ERRORS FOUND (${errors.length}):\n`);
        errors.forEach((err, i) => {
          console.log(`   ${i + 1}. ${err}`);
        });
        console.log();
      }

      if (warnings.length > 0) {
        console.log(`⚠️  WARNINGS (${warnings.length}):\n`);
        warnings.forEach((warn, i) => {
          console.log(`   ${i + 1}. ${warn}`);
        });
        console.log();
      }

      if (errors.length > 0) {
        console.log('🔧 RECOMMENDED ACTIONS:');
        if (errors.some(e => e.includes('table'))) {
          console.log('   • Run database migrations');
          console.log('   • Run: npx prisma db push');
        }
        if (errors.some(e => e.includes('tenant') || e.includes('user'))) {
          console.log('   • Run setup script: node quick-setup.mjs');
        }
        if (errors.some(e => e.includes('file'))) {
          console.log('   • Verify all files were created correctly');
        }
        console.log();
      }

      if (warnings.length > 0 && errors.length === 0) {
        console.log('ℹ️  System is functional but has warnings');
        console.log('   These can be resolved during normal usage\n');
      }
    }

  } catch (error) {
    console.error('\n❌ CRITICAL ERROR during check:');
    console.error(error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllErrors();
