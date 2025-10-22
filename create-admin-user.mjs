import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function createAdminUser() {
  try {
    console.log('🔍 Checking for existing admin user...\n');

    // Check if admin exists
    const existing = await prisma.$queryRaw`
      SELECT id, email, username FROM users WHERE email = 'admin@oudpalace.ae' OR username = 'admin' LIMIT 1
    `;

    // Get tenant
    const tenants = await prisma.$queryRaw`SELECT id FROM tenants LIMIT 1`;

    if (tenants.length === 0) {
      console.log('❌ No tenant found! Cannot create user.');
      return;
    }

    const tenantId = tenants[0].id;
    console.log(`✅ Found tenant: ${tenantId}\n`);

    // Hash password
    const hashedPassword = await hash('admin123', 12);
    console.log('✅ Password hashed\n');

    if (existing.length > 0) {
      console.log('⚠️  User already exists, updating password...\n');

      // Update existing user's password
      await prisma.$executeRaw`
        UPDATE users
        SET password = ${hashedPassword},
            "updatedAt" = NOW()
        WHERE id = ${existing[0].id}
      `;

      console.log('🎉 Password updated successfully!\n');
      console.log('📋 Login credentials:');
      console.log(`   Email: ${existing[0].email || existing[0].username}`);
      console.log('   Password: admin123');
      console.log('\n✅ You can now login!');
      return;
    }

    // Create admin user with correct schema
    const userId = 'clu' + Date.now() + Math.random().toString(36).substr(2, 9);

    await prisma.$executeRaw`
      INSERT INTO users (
        id,
        email,
        username,
        password,
        "firstName",
        "lastName",
        "isActive",
        "tenantId",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${userId},
        'admin@oudpalace.ae',
        'admin',
        ${hashedPassword},
        'Admin',
        'User',
        true,
        ${tenantId},
        NOW(),
        NOW()
      )
    `;

    console.log('🎉 Admin user created successfully!\n');
    console.log('📋 Login credentials:');
    console.log('   Email: admin@oudpalace.ae');
    console.log('   Password: admin123');
    console.log('\n✅ You can now login!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
