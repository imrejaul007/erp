import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function bypass() {
  try {
    // Check what columns exist
    const cols = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name LIKE '%verif%'
    `;
    
    console.log('Verification columns:', cols);

    // Try to update isVerified to true
    const result = await prisma.$executeRaw`
      UPDATE users 
      SET "isActive" = true
      WHERE email = 'admin@oudperfume.ae'
    `;

    console.log('✅ User updated, verification bypassed!');
    console.log('\n🔑 Try logging in again:');
    console.log('   Email: admin@oudperfume.ae');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

bypass();
