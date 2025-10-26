import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function checkLogin() {
  try {
    console.log('🔐 CHECKING LOGIN SYSTEM\n');
    console.log('='.repeat(80));

    // Check if users table exists
    console.log('\n1️⃣ Checking users table...');
    const userCount = await prisma.users.count();
    console.log(`   ✅ Found ${userCount} users in database`);

    // List all users
    console.log('\n2️⃣ Listing all users:');
    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        isActive: true,
        tenantId: true,
        user_roles: {
          include: {
            roles: true
          }
        }
      }
    });

    if (users.length === 0) {
      console.log('   ❌ NO USERS FOUND!');
      console.log('   ⚠️  You need to create a user first!');
      console.log('\n💡 Creating default admin user...\n');

      // Get tenant
      const tenant = await prisma.tenants.findFirst();
      if (!tenant) {
        console.log('   ❌ No tenant found! Creating default tenant...');
        const newTenant = await prisma.tenants.create({
          data: {
            id: `tenant-${Date.now()}`,
            name: 'Oud Perfume Store',
            companyName: 'Oud Perfume LLC',
            email: 'admin@oudperfume.ae',
            phone: '+971501234567',
            country: 'AE',
            currency: 'AED',
            timezone: 'Asia/Dubai',
            language: 'en',
            status: 'ACTIVE',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        console.log(`   ✅ Created tenant: ${newTenant.name}`);
      }

      const finalTenant = await prisma.tenants.findFirst();

      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = await prisma.users.create({
        data: {
          id: `user-${Date.now()}`,
          email: 'admin@oudperfume.ae',
          username: 'admin',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
          isActive: true,
          tenantId: finalTenant.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      console.log('   ✅ Created admin user:');
      console.log(`      Email: ${adminUser.email}`);
      console.log(`      Password: admin123`);

    } else {
      users.forEach((user, index) => {
        console.log(`\n   User ${index + 1}:`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Username: ${user.username || 'N/A'}`);
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        const roles = user.user_roles.map(ur => ur.roles.name).join(', ') || 'No role assigned';
        console.log(`   Roles: ${roles}`);
        console.log(`   Active: ${user.isActive ? '✅ Yes' : '❌ No'}`);
        console.log(`   Tenant ID: ${user.tenantId || 'N/A'}`);
      });
    }

    // Test login with default credentials
    console.log('\n3️⃣ Testing login with default credentials...');
    const testEmail = 'admin@oudperfume.ae';
    const testPassword = 'admin123';

    const user = await prisma.users.findFirst({
      where: { email: testEmail }
    });

    if (!user) {
      console.log(`   ❌ User ${testEmail} not found`);
      console.log('   💡 Try using one of the emails listed above');
    } else {
      console.log(`   ✅ User found: ${user.email}`);

      // Check if user is active
      if (!user.isActive) {
        console.log('   ❌ User is INACTIVE!');
        console.log('   💡 Activating user...');
        await prisma.users.update({
          where: { id: user.id },
          data: { isActive: true, updatedAt: new Date() }
        });
        console.log('   ✅ User activated');
      }

      // Check password
      const passwordMatch = await bcrypt.compare(testPassword, user.password);
      if (passwordMatch) {
        console.log('   ✅ Password is CORRECT!');
        console.log('\n✅ LOGIN SHOULD WORK!');
        console.log('\n📋 USE THESE CREDENTIALS:');
        console.log(`   Email: ${testEmail}`);
        console.log(`   Password: ${testPassword}`);
      } else {
        console.log('   ❌ Password is INCORRECT!');
        console.log('   💡 Resetting password to: admin123');
        const newHash = await bcrypt.hash('admin123', 10);
        await prisma.users.update({
          where: { id: user.id },
          data: { password: newHash, updatedAt: new Date() }
        });
        console.log('   ✅ Password reset complete');
        console.log('\n✅ TRY LOGIN AGAIN WITH:');
        console.log(`   Email: ${testEmail}`);
        console.log(`   Password: admin123`);
      }

      // Check tenant
      if (!user.tenantId) {
        console.log('\n   ⚠️  User has no tenant!');
        const tenant = await prisma.tenants.findFirst();
        if (tenant) {
          console.log('   💡 Assigning user to tenant...');
          await prisma.users.update({
            where: { id: user.id },
            data: { tenantId: tenant.id, updatedAt: new Date() }
          });
          console.log('   ✅ Tenant assigned');
        }
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n🎉 CHECK COMPLETE!\n');

    const finalUsers = await prisma.users.findMany({
      where: { isActive: true },
      select: {
        email: true,
        user_roles: {
          include: {
            roles: true
          }
        }
      }
    });

    console.log('📋 AVAILABLE LOGIN CREDENTIALS:\n');
    finalUsers.forEach((u, i) => {
      const roles = u.user_roles.map(ur => ur.roles.name).join(', ') || 'No role';
      console.log(`${i + 1}. Email: ${u.email}`);
      console.log(`   Password: admin123 (default)`);
      console.log(`   Roles: ${roles}\n`);
    });

    console.log('🌐 LOGIN URL: http://localhost:3000/auth/signin\n');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nStack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

checkLogin();
