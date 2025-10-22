import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function checkLiveData() {
  try {
    console.log('🌐 CHECKING LIVE RENDER DATABASE...\n');
    console.log('Database: oud_perfume_erp');
    console.log('Host: dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com');
    console.log('=' .repeat(60));

    // Tenants
    const tenants = await prisma.$queryRaw`SELECT COUNT(*) as count FROM tenants`;
    console.log(`\n✅ Tenants: ${tenants[0].count}`);

    // Users
    const users = await prisma.$queryRaw`SELECT COUNT(*) as count FROM users`;
    console.log(`✅ Users: ${users[0].count}`);
    
    const userList = await prisma.$queryRaw`SELECT email FROM users LIMIT 3`;
    userList.forEach(u => console.log(`   - ${u.email}`));

    // Categories
    const categories = await prisma.$queryRaw`SELECT COUNT(*) as count FROM categories`;
    console.log(`\n✅ Categories: ${categories[0].count}`);
    
    const catList = await prisma.$queryRaw`SELECT name FROM categories LIMIT 5`;
    catList.forEach(c => console.log(`   - ${c.name}`));

    // Brands
    const brands = await prisma.$queryRaw`SELECT COUNT(*) as count FROM brands`;
    console.log(`\n✅ Brands: ${brands[0].count}`);
    
    const brandList = await prisma.$queryRaw`SELECT name FROM brands LIMIT 5`;
    brandList.forEach(b => console.log(`   - ${b.name}`));

    // Products
    const products = await prisma.$queryRaw`SELECT COUNT(*) as count FROM products`;
    console.log(`\n✅ Products: ${products[0].count}`);
    
    if (products[0].count > 0) {
      const prodList = await prisma.$queryRaw`SELECT name, sku, "sellingPrice" FROM products ORDER BY "createdAt" DESC LIMIT 5`;
      prodList.forEach(p => console.log(`   - ${p.name} (${p.sku}) - AED ${p.sellingPrice}`));
    }

    // Sales
    const sales = await prisma.$queryRaw`SELECT COUNT(*) as count FROM sales`;
    console.log(`\n✅ Sales: ${sales[0].count}`);

    // Customers
    const customers = await prisma.$queryRaw`SELECT COUNT(*) as count FROM customers`;
    console.log(`✅ Customers: ${customers[0].count}`);

    // Stores
    const stores = await prisma.$queryRaw`SELECT COUNT(*) as count FROM stores`;
    console.log(`✅ Stores: ${stores[0].count}`);

    console.log('\n' + '='.repeat(60));
    console.log('🌐 THIS IS YOUR LIVE PRODUCTION DATA');
    console.log('🌐 Accessible at: https://oud-erp.onrender.com');
    console.log('=' .repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkLiveData();
