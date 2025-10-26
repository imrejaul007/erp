import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function fixUserRole() {
  try {
    console.log('🔧 FIXING USER ROLE\n');
    console.log('='.repeat(80));

    // Find the admin user
    const adminUser = await prisma.users.findFirst({
      where: { email: 'admin@oudperfume.ae' }
    });

    if (!adminUser) {
      console.log('❌ Admin user not found!');
      return;
    }

    console.log(`✅ Found user: ${adminUser.email}`);

    // Check if OWNER role exists
    let ownerRole = await prisma.roles.findFirst({
      where: { name: 'OWNER' }
    });

    if (!ownerRole) {
      console.log('⚠️  OWNER role not found. Creating it...');
      ownerRole = await prisma.roles.create({
        data: {
          id: `role-${Date.now()}`,
          name: 'OWNER',
          description: 'System owner with full access',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      console.log(`✅ Created OWNER role`);
    } else {
      console.log(`✅ OWNER role exists`);
    }

    // Check if user already has this role
    const existingUserRole = await prisma.user_roles.findFirst({
      where: {
        userId: adminUser.id,
        roleId: ownerRole.id
      }
    });

    if (existingUserRole) {
      console.log('✅ User already has OWNER role');
    } else {
      console.log('⚠️  User does not have OWNER role. Assigning it...');
      await prisma.user_roles.create({
        data: {
          id: `user-role-${Date.now()}`,
          userId: adminUser.id,
          roleId: ownerRole.id
        }
      });
      console.log('✅ Assigned OWNER role to user');
    }

    // Verify
    const updatedUser = await prisma.users.findFirst({
      where: { id: adminUser.id },
      include: {
        user_roles: {
          include: {
            roles: true
          }
        }
      }
    });

    console.log('\n' + '='.repeat(80));
    console.log('\n✅ FIX COMPLETE!\n');
    console.log(`User: ${updatedUser.email}`);
    console.log(`Roles: ${updatedUser.user_roles.map(ur => ur.roles.name).join(', ')}`);
    console.log('\n📋 LOGIN CREDENTIALS:');
    console.log(`   Email: admin@oudperfume.ae`);
    console.log(`   Password: admin123`);
    console.log('\n🌐 LOGIN URL: http://localhost:3000/auth/signin\n');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

fixUserRole();
