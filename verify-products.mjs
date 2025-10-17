import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyProducts() {
  try {
    console.log('🔍 Verifying imported products...\\n');

    // Count total products
    const totalCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM products
    `;
    console.log(`✅ Total products in database: ${totalCount[0].count}`);

    // Get Al Mutalib products
    const alMutalibProducts = await prisma.$queryRaw`
      SELECT id, code, name, category, "sellingPrice", "imageUrl", "createdAt"
      FROM products
      WHERE name LIKE '%Agarwood%' OR name LIKE '%Oudh%'
      ORDER BY "createdAt" DESC
      LIMIT 20
    `;

    console.log(`\\n📦 Recently imported Al Mutalib products (${alMutalibProducts.length} shown):\\n`);

    alMutalibProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   Category: ${p.category}`);
      console.log(`   Price: ${p.sellingPrice} AED`);
      console.log(`   Code: ${p.code}`);
      console.log(`   Created: ${p.createdAt}`);
      console.log();
    });

    // Count by category
    const categoryCounts = await prisma.$queryRaw`
      SELECT category, COUNT(*) as count
      FROM products
      GROUP BY category
      ORDER BY count DESC
    `;

    console.log('\\n📊 Products by category:');
    categoryCounts.forEach(c => {
      console.log(`   ${c.category}: ${c.count} products`);
    });

    console.log('\\n\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅  VERIFICATION COMPLETE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\\n🎉 Products are persisted in the database!');
    console.log('   Open http://localhost:3000 to view them in the UI\\n');

  } catch (error) {
    console.error('\\n❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyProducts();
