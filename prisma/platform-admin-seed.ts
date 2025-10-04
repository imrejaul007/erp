import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Seeding Platform Admin...');

  // Create platform admin (you!)
  const hashedPassword = await bcrypt.hash('platform123', 10); // CHANGE THIS PASSWORD!

  const platformAdmin = await prisma.platformAdmin.upsert({
    where: { email: 'platform@oudperfume.ae' },
    update: {},
    create: {
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

  console.log('✅ Platform Admin created:');
  console.log('   Email:', platformAdmin.email);
  console.log('   Password: platform123');
  console.log('   Role:', platformAdmin.role);
  console.log('');
  console.log('🔗 Login URL: http://localhost:3000/platform/login');
  console.log('');
  console.log('⚠️  IMPORTANT: Change the default password after first login!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
