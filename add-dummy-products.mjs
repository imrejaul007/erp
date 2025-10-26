import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function addDummyProducts() {
  try {
    console.log('🛍️  ADDING 5 DUMMY PRODUCTS\n');
    console.log('='.repeat(80));

    // Get tenant
    const tenant = await prisma.tenants.findFirst();
    if (!tenant) {
      console.log('❌ No tenant found!');
      return;
    }

    // Check how many products exist
    const existingCount = await prisma.products.count();
    console.log(`\n📊 Current products in database: ${existingCount}`);

    const products = [
      {
        id: `prod-${Date.now()}-1`,
        code: 'OUD-001',
        name: 'Royal Oud Intense',
        nameAr: 'عود ملكي مكثف',
        category: 'Oud Perfumes',
        subcategory: 'Premium Oud',
        baseUnit: 'bottle',
        costPrice: 150,
        sellingPrice: 299,
        currency: 'AED',
        vatRate: 5,
        minStockLevel: 5,
        maxStockLevel: 50,
        shelfLife: 1095, // 3 years in days
        barcode: '6281234567001',
        sku: 'OUD-001-50ML',
        imageUrl: null,
        isActive: true,
        tenantId: tenant.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: `prod-${Date.now()}-2`,
        code: 'MUSK-002',
        name: 'White Musk Classic',
        nameAr: 'مسك أبيض كلاسيكي',
        category: 'Musk Perfumes',
        subcategory: 'White Musk',
        baseUnit: 'bottle',
        costPrice: 80,
        sellingPrice: 159,
        currency: 'AED',
        vatRate: 5,
        minStockLevel: 10,
        maxStockLevel: 100,
        shelfLife: 1095,
        barcode: '6281234567002',
        sku: 'MUSK-002-30ML',
        imageUrl: null,
        isActive: true,
        tenantId: tenant.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: `prod-${Date.now()}-3`,
        code: 'ARAB-003',
        name: 'Arabian Nights',
        nameAr: 'ليالي عربية',
        category: 'Oriental Perfumes',
        subcategory: 'Unisex',
        baseUnit: 'bottle',
        costPrice: 120,
        sellingPrice: 249,
        currency: 'AED',
        vatRate: 5,
        minStockLevel: 8,
        maxStockLevel: 60,
        shelfLife: 1095,
        barcode: '6281234567003',
        sku: 'ARAB-003-100ML',
        imageUrl: null,
        isActive: true,
        tenantId: tenant.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: `prod-${Date.now()}-4`,
        code: 'ROSE-004',
        name: 'Rose Garden',
        nameAr: 'حديقة الورد',
        category: 'Floral Perfumes',
        subcategory: 'Rose',
        baseUnit: 'bottle',
        costPrice: 60,
        sellingPrice: 129,
        currency: 'AED',
        vatRate: 5,
        minStockLevel: 15,
        maxStockLevel: 120,
        shelfLife: 730, // 2 years
        barcode: '6281234567004',
        sku: 'ROSE-004-50ML',
        imageUrl: null,
        isActive: true,
        tenantId: tenant.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: `prod-${Date.now()}-5`,
        code: 'AMBER-005',
        name: 'Golden Amber',
        nameAr: 'عنبر ذهبي',
        category: 'Amber Perfumes',
        subcategory: 'Warm Amber',
        baseUnit: 'bottle',
        costPrice: 100,
        sellingPrice: 199,
        currency: 'AED',
        vatRate: 5,
        minStockLevel: 10,
        maxStockLevel: 80,
        shelfLife: 1095,
        barcode: '6281234567005',
        sku: 'AMBER-005-75ML',
        imageUrl: null,
        isActive: true,
        tenantId: tenant.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    console.log('\n📦 Adding products...\n');

    let added = 0;
    let skipped = 0;

    for (const productData of products) {
      // Check if product already exists
      const existing = await prisma.products.findFirst({
        where: {
          OR: [
            { code: productData.code },
            { sku: productData.sku }
          ]
        }
      });

      if (existing) {
        console.log(`   ⚠️  Skipped: ${productData.name} (code ${productData.code} already exists)`);
        skipped++;
        continue;
      }

      const product = await prisma.products.create({
        data: productData
      });

      console.log(`   ✅ Added: ${product.name}`);
      console.log(`      Code: ${product.code}`);
      console.log(`      Category: ${product.category}`);
      console.log(`      Price: ${product.sellingPrice} ${product.currency}`);
      console.log(`      SKU: ${product.sku}\n`);
      added++;
    }

    console.log('='.repeat(80));
    console.log(`\n✅ COMPLETE!\n`);
    console.log(`   Products added: ${added}`);
    console.log(`   Products skipped (already exist): ${skipped}`);
    console.log(`   Total products now: ${existingCount + added}`);
    console.log('\n🌐 View products: http://localhost:3000/inventory/products\n');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

addDummyProducts();
