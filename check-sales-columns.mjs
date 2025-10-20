import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkColumns() {
  try {
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'sales'
      ORDER BY ordinal_position
    `;

    console.log('📋 Sales table columns:\n');
    columns.forEach(c => {
      console.log(`  • ${c.column_name} (${c.data_type})`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check for missing columns
    const requiredColumns = ['source', 'marketplaceOrderId', 'importedAt', 'tenantId'];
    const existingColumnNames = columns.map(c => c.column_name);

    console.log('✅ Checking required columns:\n');

    requiredColumns.forEach(col => {
      if (existingColumnNames.includes(col)) {
        console.log(`  ✅ ${col} - EXISTS`);
      } else {
        console.log(`  ❌ ${col} - MISSING`);
      }
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkColumns();
