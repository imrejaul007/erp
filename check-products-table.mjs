import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProductsTable() {
  try {
    console.log('Checking products table columns...\n');

    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'products'
      ORDER BY ordinal_position
    `;

    console.log('Actual columns in products table:');
    columns.forEach(col => {
      console.log(`  ${col.column_name} (${col.data_type})`);
    });

    console.log('\n\nColumns that need to be renamed to camelCase:');
    const needsRename = columns.filter(col => col.column_name.includes('_'));
    needsRename.forEach(col => {
      const camelCase = col.column_name.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      console.log(`  ${col.column_name} → ${camelCase}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProductsTable();
