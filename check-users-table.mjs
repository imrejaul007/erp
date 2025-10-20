import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsersTable() {
  try {
    console.log('Checking actual database schema for users table...\n');

    // Get columns from users table
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'users'
      ORDER BY ordinal_position
    `;

    console.log('Columns in users table:');
    columns.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    console.log('\nChecking if tenantId/tenant_id exists...');
    const hasTenantId = columns.some(col =>
      col.column_name === 'tenantId' || col.column_name === 'tenant_id'
    );

    if (hasTenantId) {
      console.log('✅ Tenant column EXISTS in database');

      // Check if users have tenantId values
      const usersWithTenant = await prisma.$queryRaw`
        SELECT COUNT(*) as count
        FROM users
        WHERE tenant_id IS NOT NULL
      `;

      const usersWithoutTenant = await prisma.$queryRaw`
        SELECT COUNT(*) as count
        FROM users
        WHERE tenant_id IS NULL
      `;

      console.log(`\nUsers with tenant: ${usersWithTenant[0].count}`);
      console.log(`Users without tenant: ${usersWithoutTenant[0].count}`);

      if (Number(usersWithoutTenant[0].count) > 0) {
        console.log('\n❌ PROBLEM: Some users do not have a tenant_id!');
        console.log('   These users cannot save data because the API requires tenant context.');
      } else {
        console.log('\n✅ All users have tenant_id assigned');
      }
    } else {
      console.log('❌ Tenant column DOES NOT exist in database');
      console.log('   But your Prisma schema expects it. Schema-Database mismatch!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsersTable();
