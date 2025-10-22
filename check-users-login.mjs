import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function checkUsers() {
  try {
    console.log('🔍 Checking users table...\n');

    // Count users
    const userCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM users`;
    console.log(`👥 Total users: ${userCount[0].count}`);

    // Check for admin user
    const adminUsers = await prisma.$queryRaw`
      SELECT id, email, role, "isActive", "isVerified"
      FROM users
      WHERE email = 'admin@oudpalace.ae'
      LIMIT 1
    `;

    if (adminUsers.length > 0) {
      console.log('\n✅ Admin user EXISTS:');
      const user = adminUsers[0];
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Active: ${user.isActive}`);
      console.log(`  Verified: ${user.isVerified}`);
    } else {
      console.log('\n❌ Admin user NOT FOUND!');
      console.log('   Need to create: admin@oudpalace.ae');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
