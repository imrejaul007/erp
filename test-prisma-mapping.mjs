import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error'],
});

async function testMapping() {
  try {
    console.log('Testing if Prisma can access the users with tenant...\n');

    // Try to query users (this will show us what column names Prisma is using)
    const users = await prisma.users.findMany({
      take: 1,
      select: {
        id: true,
        email: true,
        // Try to access tenant_id through Prisma
      }
    });

    console.log('✅ Successfully queried users:', users);

    // Now try to check the raw SQL to see what column name is used
    console.log('\n\nChecking what happens when we try tenant-related queries...');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nThis shows us the field name mismatch.');
  } finally {
    await prisma.$disconnect();
  }
}

testMapping();
