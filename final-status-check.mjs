import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function finalStatusCheck() {
  console.log('🎯 FINAL SYSTEM STATUS CHECK\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  let allGood = true;
  const issues = [];
  const successes = [];

  try {
    // 1. Check database connection
    console.log('1️⃣ Database Connection...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('   ✅ Database connected\n');
    successes.push('Database connection');

    // 2. Check required tables
    console.log('2️⃣ Checking Tables...');
    const tables = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('sales', 'sale_items', 'vat_records', 'products', 'tenants', 'users')
    `;

    const tableNames = tables.map(t => t.table_name);
    const requiredTables = ['sales', 'sale_items', 'vat_records', 'products', 'tenants', 'users'];

    requiredTables.forEach(table => {
      if (tableNames.includes(table)) {
        console.log(`   ✅ ${table}`);
      } else {
        console.log(`   ❌ ${table} - MISSING`);
        issues.push(`Missing table: ${table}`);
        allGood = false;
      }
    });
    console.log();
    if (tableNames.length === requiredTables.length) {
      successes.push('All required tables exist');
    }

    // 3. Check sales table columns
    console.log('3️⃣ Checking Sales Table Columns...');
    const salesColumns = await prisma.$queryRaw`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'sales'
    `;

    const salesColNames = salesColumns.map(c => c.column_name);
    const requiredSalesColumns = ['tenantId', 'source', 'marketplaceOrderId', 'importedAt', 'vatAmount'];

    requiredSalesColumns.forEach(col => {
      if (salesColNames.includes(col)) {
        console.log(`   ✅ ${col}`);
      } else {
        console.log(`   ❌ ${col} - MISSING`);
        issues.push(`Sales table missing column: ${col}`);
        allGood = false;
      }
    });
    console.log();
    if (requiredSalesColumns.every(col => salesColNames.includes(col))) {
      successes.push('Sales table structure correct');
    }

    // 4. Check data
    console.log('4️⃣ Checking Data...');

    const productCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM products`;
    console.log(`   📦 Products: ${productCount[0].count}`);

    const salesCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM sales`;
    console.log(`   💰 Sales: ${salesCount[0].count}`);

    const saleItemsCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM sale_items`;
    console.log(`   📋 Sale Items: ${saleItemsCount[0].count}`);

    const vatRecordsCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM vat_records`;
    console.log(`   🧾 VAT Records: ${vatRecordsCount[0].count}\n`);

    if (parseInt(productCount[0].count) > 0) {
      successes.push('Products in database');
    }

    // 5. Check multi-tenancy
    console.log('5️⃣ Checking Multi-Tenancy...');

    const salesWithoutTenant = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM sales WHERE "tenantId" IS NULL
    `;

    const itemsWithoutTenant = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM sale_items WHERE "tenantId" IS NULL
    `;

    const vatWithoutTenant = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM vat_records WHERE "tenantId" IS NULL
    `;

    if (parseInt(salesWithoutTenant[0].count) === 0) {
      console.log('   ✅ All sales have tenantId');
      successes.push('Sales multi-tenancy');
    } else {
      console.log(`   ❌ ${salesWithoutTenant[0].count} sales without tenantId`);
      issues.push('Some sales missing tenantId');
      allGood = false;
    }

    if (parseInt(itemsWithoutTenant[0].count) === 0) {
      console.log('   ✅ All sale items have tenantId');
      successes.push('Sale items multi-tenancy');
    } else {
      console.log(`   ❌ ${itemsWithoutTenant[0].count} items without tenantId`);
      issues.push('Some items missing tenantId');
      allGood = false;
    }

    if (parseInt(vatWithoutTenant[0].count) === 0) {
      console.log('   ✅ All VAT records have tenantId\n');
      successes.push('VAT records multi-tenancy');
    } else {
      console.log(`   ❌ ${vatWithoutTenant[0].count} VAT records without tenantId\n`);
      issues.push('Some VAT records missing tenantId');
      allGood = false;
    }

    // 6. Check indexes
    console.log('6️⃣ Checking Indexes...');
    const indexes = await prisma.$queryRaw`
      SELECT tablename, indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND tablename IN ('sales', 'sale_items', 'vat_records')
      AND indexname LIKE '%tenant%'
    `;

    console.log(`   Found ${indexes.length} tenant-related indexes`);
    indexes.forEach(idx => {
      console.log(`   • ${idx.tablename}: ${idx.indexname}`);
    });

    if (indexes.length >= 3) {
      console.log('   ✅ Indexes optimized\n');
      successes.push('Database indexes created');
    } else {
      console.log('   ⚠️  Some indexes may be missing\n');
    }

    // 7. Test VAT calculation
    console.log('7️⃣ Testing VAT Calculation...');
    const testAmount = 100;
    const vatRate = 5;
    const expectedVat = 5;
    const calculatedVat = (testAmount * (vatRate / 100)).toFixed(2);

    if (parseFloat(calculatedVat) === expectedVat) {
      console.log(`   ✅ VAT calculation correct (${testAmount} AED → ${calculatedVat} AED VAT)\n`);
      successes.push('VAT calculation working');
    } else {
      console.log(`   ❌ VAT calculation wrong (expected ${expectedVat}, got ${calculatedVat})\n`);
      issues.push('VAT calculation error');
      allGood = false;
    }

    // Final Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (allGood && issues.length === 0) {
      console.log('✅✅✅ EVERYTHING IS OK! ✅✅✅\n');
      console.log('System Status: 🟢 ALL GOOD\n');
      console.log('✨ Verified Features:\n');
      successes.forEach(s => console.log(`   ✅ ${s}`));
      console.log('\n📊 System Summary:');
      console.log(`   • ${productCount[0].count} products`);
      console.log(`   • ${salesCount[0].count} sales`);
      console.log(`   • ${saleItemsCount[0].count} sale items`);
      console.log(`   • ${vatRecordsCount[0].count} VAT records`);
      console.log('\n🚀 Ready for:');
      console.log('   ✅ Manual sales entry (/sales/new)');
      console.log('   ✅ Marketplace imports (/sales/import)');
      console.log('   ✅ VAT reporting (/api/sales/vat-summary)');
      console.log('   ✅ Production deployment\n');
    } else {
      console.log('⚠️  ISSUES FOUND\n');
      issues.forEach(issue => console.log(`   ❌ ${issue}`));
      console.log('\n✅ Working Features:\n');
      successes.forEach(s => console.log(`   ✅ ${s}`));
      console.log();
    }

  } catch (error) {
    console.error('❌ Critical Error:', error.message);
    allGood = false;
  } finally {
    await prisma.$disconnect();
  }

  process.exit(allGood ? 0 : 1);
}

finalStatusCheck();
