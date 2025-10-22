import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

try {
  const tables = await prisma.$queryRaw`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  `;

  console.log('Tables in database:', tables.length);
  console.log('\nLooking for categories/brands:');
  const tableNames = tables.map(t => t.tablename);
  console.log('Has categories table:', tableNames.includes('categories'));
  console.log('Has brands table:', tableNames.includes('brands'));

  console.log('\nAll tables:');
  tableNames.forEach(name => console.log('  -', name));

} catch (error) {
  console.error('Error:', error.message);
} finally {
  await prisma.$disconnect();
}
