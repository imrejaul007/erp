import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create default tenant
  console.log('📝 Creating default tenant...');
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'oud-perfume-erp' },
    update: {},
    create: {
      name: 'Oud & Perfume ERP',
      nameArabic: 'نظام إدارة العود والعطور',
      slug: 'oud-perfume-erp',
      businessType: 'RETAIL',
      ownerName: 'Admin User',
      ownerEmail: 'admin@oudperfume.ae',
      ownerPhone: '+971501234567',
      address: 'Dubai, UAE',
      emirate: 'Dubai',
      city: 'Dubai',
      plan: 'ENTERPRISE',
      status: 'ACTIVE',
      features: {
        pos: true,
        production: true,
        events: true,
        warehouse: true,
        reports: true,
      },
    },
  });
  console.log('✅ Tenant created:', tenant.name);

  // 2. Create admin user
  console.log('📝 Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@oudperfume.ae' },
    update: {},
    create: {
      email: 'admin@oudperfume.ae',
      name: 'Admin User',
      password: hashedPassword,
      phone: '+971501234567',
      role: 'SUPER_ADMIN',
      isActive: true,
      tenantId: tenant.id,
    },
  });
  console.log('✅ Admin user created');
  console.log('   Email: admin@oudperfume.ae');
  console.log('   Password: admin123');

  // 3. Create default category
  console.log('📝 Creating default category...');
  const category = await prisma.category.upsert({
    where: {
      name_tenantId: {
        name: 'Perfumes',
        tenantId: tenant.id
      }
    },
    update: {},
    create: {
      name: 'Perfumes',
      nameAr: 'العطور',
      description: 'Luxury perfumes and fragrances',
      tenantId: tenant.id,
    },
  });
  console.log('✅ Default category created');

  console.log('\n✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
