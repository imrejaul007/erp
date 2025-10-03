import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  console.log('🌱 Starting database seed...');

  // Check if data already exists
  const existingBranding = await prisma.branding.findFirst();
  const existingUser = await prisma.users.findFirst();
  const existingStore = await prisma.stores.findFirst();

  if (existingBranding && existingUser && existingStore) {
    console.log('✅ Database already seeded with:');
    console.log(`   - Branding: ${existingBranding.companyName}`);
    console.log(`   - User: ${existingUser.email}`);
    console.log(`   - Store: ${existingStore.name}`);
    console.log('\n✅ Database seed check completed - no changes needed!');
    return;
  }

  // If no data exists, create minimal seed data
  console.log('📝 Creating seed data...');

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.users.create({
      data: {
        email: 'admin@oudperfume.ae',
        username: 'admin',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        phone: '+971501234567',
        isActive: true,
        language: 'en',
        timezone: 'Asia/Dubai',
      },
    });
    console.log('✅ Admin user created');
  }

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
