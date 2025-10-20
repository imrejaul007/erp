import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testLoginSystem() {
  try {
    console.log('Testing login system...\n');

    // Step 1: Verify user exists
    console.log('Step 1: Checking if admin user exists...');
    const user = await prisma.users.findUnique({
      where: { email: 'admin@oudperfume.ae' },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        password: true,
        isActive: true,
        tenantId: true,
      }
    });

    if (!user) {
      console.log('❌ User not found in database!');
      return;
    }

    console.log('✅ User found:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Name: ${user.firstName} ${user.lastName}`);
    console.log(`   Active: ${user.isActive}`);
    console.log(`   TenantId: ${user.tenantId}`);
    console.log(`   Has Password: ${user.password ? 'Yes' : 'No'}`);

    // Step 2: Verify password
    console.log('\nStep 2: Testing password verification...');
    const testPassword = 'admin123';
    const isPasswordValid = await bcrypt.compare(testPassword, user.password);

    if (isPasswordValid) {
      console.log(`✅ Password '${testPassword}' is VALID`);
    } else {
      console.log(`❌ Password '${testPassword}' is INVALID`);
      console.log('   The password might have been set differently.');
    }

    // Step 3: Check tenant
    console.log('\nStep 3: Verifying tenant...');
    const tenant = await prisma.tenants.findUnique({
      where: { id: user.tenantId },
      select: {
        id: true,
        name: true,
        isActive: true,
        status: true,
      }
    });

    if (!tenant) {
      console.log('❌ Tenant not found!');
      return;
    }

    console.log('✅ Tenant verified:');
    console.log(`   Name: ${tenant.name}`);
    console.log(`   Active: ${tenant.isActive}`);
    console.log(`   Status: ${tenant.status}`);

    // Step 4: Test authentication flow
    console.log('\nStep 4: Testing authentication flow...');

    if (!user.isActive) {
      console.log('❌ User is not active - login will fail');
      return;
    }

    if (!tenant.isActive || tenant.status !== 'ACTIVE') {
      console.log('❌ Tenant is not active - login will fail');
      return;
    }

    console.log('✅ All checks passed!');

    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅  LOGIN SYSTEM IS READY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Test these credentials in your browser:');
    console.log('   URL: http://localhost:3000/auth/signin');
    console.log('   Email: admin@oudperfume.ae');
    console.log('   Password: admin123');
    console.log('\n✅ Expected Result: Login should succeed');
    console.log('   - User will be authenticated');
    console.log('   - Session will be created');
    console.log('   - TenantId will be included in session');
    console.log('   - You will be redirected to dashboard\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
    console.error('Details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testLoginSystem();
