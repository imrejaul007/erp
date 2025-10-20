import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testConnection() {
  try {
    console.log('Testing database connection...');

    // Test basic query
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful!');

    // Get database version
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('Database version:', result);

    // Test if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
      LIMIT 10
    `;
    console.log('First 10 tables:', tables);

  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
