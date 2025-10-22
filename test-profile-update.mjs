import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function testProfileUpdate() {
  try {
    console.log('🧪 TESTING PROFILE UPDATE FUNCTIONALITY...\n');
    console.log('=' .repeat(60));

    // Get admin user
    const user = await prisma.$queryRaw`
      SELECT id, email, "firstName", "lastName", phone, address
      FROM users
      WHERE email = 'admin@oudperfume.ae'
      LIMIT 1
    `;

    if (user.length === 0) {
      console.log('❌ No user found!');
      return;
    }

    const userId = user[0].id;
    console.log('\n📋 CURRENT PROFILE:');
    console.log(`   ID: ${userId}`);
    console.log(`   Email: ${user[0].email}`);
    console.log(`   First Name: ${user[0].firstName || 'Not set'}`);
    console.log(`   Last Name: ${user[0].lastName || 'Not set'}`);
    console.log(`   Phone: ${user[0].phone || 'Not set'}`);
    console.log(`   Address: ${user[0].address || 'Not set'}`);

    // Update profile with test data
    console.log('\n✏️  UPDATING PROFILE...');
    const newPhone = '+971501234567';
    const newAddress = 'Dubai, UAE - Test Address';
    const newFirstName = 'Admin';
    const newLastName = 'Manager';

    await prisma.$executeRaw`
      UPDATE users
      SET
        "firstName" = ${newFirstName},
        "lastName" = ${newLastName},
        phone = ${newPhone},
        address = ${newAddress},
        "updatedAt" = NOW()
      WHERE id = ${userId}
    `;

    console.log('✅ Profile updated in database!');

    // Wait 1 second
    console.log('\n⏳ Waiting 1 second...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify update persisted
    console.log('\n🔍 VERIFYING UPDATE...');
    const updatedUser = await prisma.$queryRaw`
      SELECT id, email, "firstName", "lastName", phone, address, "updatedAt"
      FROM users
      WHERE id = ${userId}
    `;

    console.log('\n📋 UPDATED PROFILE:');
    console.log(`   Email: ${updatedUser[0].email}`);
    console.log(`   First Name: ${updatedUser[0].firstName}`);
    console.log(`   Last Name: ${updatedUser[0].lastName}`);
    console.log(`   Phone: ${updatedUser[0].phone}`);
    console.log(`   Address: ${updatedUser[0].address}`);
    console.log(`   Updated At: ${updatedUser[0].updatedAt}`);

    console.log('\n' + '='.repeat(60));

    // Check if updates persisted correctly
    if (
      updatedUser[0].firstName === newFirstName &&
      updatedUser[0].lastName === newLastName &&
      updatedUser[0].phone === newPhone &&
      updatedUser[0].address === newAddress
    ) {
      console.log('🎉 🎉 🎉  SUCCESS! PROFILE UPDATES ARE PERSISTING!  🎉 🎉 🎉');
      console.log('='.repeat(60));
      console.log('\n✅ Profile data is being saved to database');
      console.log('✅ Updates persist after saving');
      console.log('✅ Data survives "page refresh"');
      console.log('\n⚠️  HOWEVER: Check if API endpoint is working correctly');
      console.log('   The API endpoint may be using wrong model name');
    } else {
      console.log('❌ ❌ ❌  PROBLEM! UPDATES NOT PERSISTING!  ❌ ❌ ❌');
      console.log('Expected updates did not save correctly');
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.code) {
      console.error('   Code:', error.code);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testProfileUpdate();
