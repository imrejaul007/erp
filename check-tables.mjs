import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTables() {
  try {
    console.log('Checking if required tables exist...\n');

    // Check if tenants table exists
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('tenants', 'Tenant')
    `;

    console.log('Found tables:', tables);

    if (tables.length === 0) {
      console.log('\n❌ No tenants table found');
      console.log('   Need to create tenants table first');
    } else {
      console.log('\n✅ Tenants table exists');

      // Check structure
      const columns = await prisma.$queryRaw`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = ${tables[0].table_name}
        ORDER BY ordinal_position
      `;

      console.log('\nTenants table columns:');
      columns.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();
