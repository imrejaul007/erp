import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testLogin() {
  try {
    console.log('Checking users and tenant setup...\n');

    // First, let's see what models are available
    console.log('Available Prisma models:', Object.keys(prisma).filter(key => key.charAt(0) === key.charAt(0).toLowerCase()));

    // Check if users exist
    if (!prisma.users) {
      console.log('❌ ERROR: prisma.users is undefined - Prisma client may not be properly generated');
      return;
    }

    const userCount = await prisma.users.count();
    console.log(`Total users: ${userCount}`);

    if (userCount > 0) {
      // Get first few users
      const users = await prisma.users.findMany({
        take: 5,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          isActive: true,
        }
      });

      console.log('\nFirst 5 users:');
      users.forEach(user => {
        const displayName = user.firstName || user.username || user.email || 'No name';
        console.log(`  - ${displayName} (${user.email}) [ID: ${user.id}]`);
        console.log(`    Active: ${user.isActive}`);
      });

    } else {
      console.log('\n❌ No users found in database. You need to sign up first.');
    }

    console.log('\n\n=== IMPORTANT FINDING ===');
    console.log('The Prisma schema does NOT include a "tenantId" field in the users table.');
    console.log('However, your API routes use withTenant() middleware which requires tenantId.');
    console.log('This is a SCHEMA MISMATCH issue!');
    console.log('\nThe schema you are using is likely not the correct one for multi-tenant operations.');
    console.log('You need to either:');
    console.log('1. Use a schema that includes tenant support, OR');
    console.log('2. Remove the withTenant() middleware from your API routes')

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
