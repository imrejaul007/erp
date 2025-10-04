import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function testDatabaseWrite() {
  try {
    console.log('🔍 Testing database write...\n');
    
    // Get tenant
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      console.log('❌ No tenant found');
      return;
    }
    console.log('✓ Found tenant:', tenant.name);
    
    // Get user
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('❌ No user found');
      return;
    }
    console.log('✓ Found user:', user.email);
    
    // Get category
    const category = await prisma.category.findFirst();
    if (!category) {
      console.log('❌ No category found');
      return;
    }
    console.log('✓ Found category:', category.name);
    
    // Try to create a product
    console.log('\n📝 Creating test product...');
    const testProduct = await prisma.product.create({
      data: {
        name: 'Test Product ' + new Date().toISOString(),
        sku: 'TEST-' + Date.now(),
        price: 100,
        cost: 50,
        stock: 10,
        categoryId: category.id,
        tenantId: tenant.id,
        createdById: user.id
      }
    });
    console.log('✓ Product created:', testProduct.id, testProduct.name);
    
    // Verify it exists
    console.log('\n🔍 Verifying product in database...');
    const savedProduct = await prisma.product.findUnique({
      where: { id: testProduct.id }
    });
    
    if (savedProduct) {
      console.log('✅ SUCCESS! Product persisted:', savedProduct.name);
      
      // Clean up
      await prisma.product.delete({ where: { id: testProduct.id } });
      console.log('✓ Test product cleaned up');
    } else {
      console.log('❌ FAILED! Product not found after creation');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseWrite();
