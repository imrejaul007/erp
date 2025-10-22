import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function seed() {
  try {
    console.log('🌱 Seeding categories and brands...');

    // Get first tenant
    const tenants = await prisma.$queryRaw`SELECT id FROM tenants LIMIT 1`;

    if (tenants.length === 0) {
      console.log('❌ No tenant found in database!');
      return;
    }

    const tenantId = tenants[0].id;
    console.log('✅ Found tenant:', tenantId);

    // Create categories
    const categories = [
      ['Finished Perfumes', 'العطور الجاهزة', 'Ready-to-sell perfume products'],
      ['Oud Wood', 'خشب العود', 'Raw oud wood materials'],
      ['Essential Oils', 'الزيوت الأساسية', 'Essential oils and extracts'],
      ['Packaging Materials', 'مواد التعبئة', 'Bottles, boxes, and packaging'],
      ['Raw Materials', 'المواد الخام', 'Other raw materials'],
    ];

    let catCount = 0;
    for (const [name, nameArabic, desc] of categories) {
      const catId = 'clc' + Date.now() + Math.random().toString(36).substr(2, 9);
      try {
        await prisma.$executeRaw`
          INSERT INTO categories (id, name, "nameArabic", description, "isActive", "tenantId", "createdAt")
          VALUES (${catId}, ${name}, ${nameArabic}, ${desc}, true, ${tenantId}, NOW())
          ON CONFLICT DO NOTHING
        `;
        catCount++;
      } catch (e) {
        console.log('Category exists:', name);
      }
    }
    console.log(`✅ Created ${catCount} categories`);

    // Create brands
    const brands = [
      ['Oud Palace', 'قصر العود', 'Premium oud perfumes'],
      ['Royal Collection', 'المجموعة الملكية', 'Luxury perfume collection'],
      ['Arabian Nights', 'ليالي العرب', 'Traditional Arabian fragrances'],
    ];

    let brandCount = 0;
    for (const [name, nameArabic, desc] of brands) {
      const brandId = 'clb' + Date.now() + Math.random().toString(36).substr(2, 9);
      try {
        await prisma.$executeRaw`
          INSERT INTO brands (id, name, "nameArabic", description, "isActive", "tenantId", "createdAt")
          VALUES (${brandId}, ${name}, ${nameArabic}, ${desc}, true, ${tenantId}, NOW())
          ON CONFLICT DO NOTHING
        `;
        brandCount++;
      } catch (e) {
        console.log('Brand exists:', name);
      }
    }
    console.log(`✅ Created ${brandCount} brands`);

    console.log('\n🎉 Categories and brands seeded successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
