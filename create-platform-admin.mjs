import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function main() {
  console.log('🔧 Creating Platform Admin...\n');

  const hashedPassword = await bcrypt.hash('platform123', 10);

  try {
    // Try to find existing
    let admin = await prisma.platformAdmin.findUnique({
      where: { email: 'platform@oudperfume.ae' },
    });

    if (admin) {
      console.log('✅ Platform admin already exists!');
    } else {
      // Create new
      admin = await prisma.platformAdmin.create({
        data: {
          email: 'platform@oudperfume.ae',
          password: hashedPassword,
          name: 'Platform Administrator',
          phone: '+971-50-0000000',
          role: 'PLATFORM_OWNER',
          isActive: true,
          canManageTenants: true,
          canManageBilling: true,
          canViewAnalytics: true,
          canAccessAllData: true,
        },
      });

      console.log('✅ Platform Admin created successfully!');
    }

    console.log('\n📋 Login Credentials:');
    console.log('   Email: platform@oudperfume.ae');
    console.log('   Password: platform123');
    console.log('   Role:', admin.role);
    console.log('\n🔗 Login URLs:');
    console.log('   Local: http://localhost:3000/platform/login');
    console.log('   Production: https://oud-erp.onrender.com/platform/login');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
