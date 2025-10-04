import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Creating Platform Admin...');

  try {
    // Check if platform admin already exists
    const existing = await prisma.platformAdmin.findUnique({
      where: { email: 'platform@oudperfume.ae' },
    });

    if (existing) {
      console.log('✅ Platform admin already exists');
      console.log('   Email:', existing.email);
      console.log('   Role:', existing.role);
      return;
    }

    // Create platform admin
    const hashedPassword = await bcrypt.hash('platform123', 10);

    const admin = await prisma.platformAdmin.create({
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

    console.log('✅ Platform admin created successfully!');
    console.log('');
    console.log('📋 Login Credentials:');
    console.log('   Email: platform@oudperfume.ae');
    console.log('   Password: platform123');
    console.log('   Role:', admin.role);
    console.log('');
    console.log('🔗 Login URL:');
    console.log('   https://oud-erp.onrender.com/platform/login');
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
  } catch (error: any) {
    console.error('❌ Error creating platform admin:', error.message);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
