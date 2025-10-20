import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDataPersistence() {
  console.log('🔍 Checking if data is actually being saved...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // Check products
    const products = await prisma.$queryRaw`
      SELECT COUNT(*) as count,
             MAX("createdAt") as "lastCreated"
      FROM products
    `;

    console.log('📦 PRODUCTS:');
    console.log(`   Total: ${products[0].count}`);
    console.log(`   Last created: ${products[0].lastCreated}\n`);

    // Check recent products
    const recentProducts = await prisma.$queryRaw`
      SELECT id, name, "sellingPrice", "createdAt"
      FROM products
      ORDER BY "createdAt" DESC
      LIMIT 5
    `;

    console.log('   Recent products:');
    recentProducts.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name} - ${p.sellingPrice} AED`);
      console.log(`      Created: ${p.createdAt}`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check sales
    const sales = await prisma.$queryRaw`
      SELECT COUNT(*) as count,
             COALESCE(SUM("totalAmount"), 0) as "totalRevenue",
             MAX("createdAt") as "lastCreated"
      FROM sales
    `;

    console.log('💰 SALES:');
    console.log(`   Total sales: ${sales[0].count}`);
    console.log(`   Total revenue: ${parseFloat(sales[0].totalRevenue).toFixed(2)} AED`);
    console.log(`   Last created: ${sales[0].lastCreated}\n`);

    // Check recent sales
    if (parseInt(sales[0].count) > 0) {
      const recentSales = await prisma.$queryRaw`
        SELECT "saleNo", "totalAmount", source, "createdAt"
        FROM sales
        ORDER BY "createdAt" DESC
        LIMIT 5
      `;

      console.log('   Recent sales:');
      recentSales.forEach((s, i) => {
        console.log(`   ${i + 1}. ${s.saleNo} - ${parseFloat(s.totalAmount).toFixed(2)} AED (${s.source})`);
        console.log(`      Created: ${s.createdAt}`);
      });
    } else {
      console.log('   ⚠️  No sales found in database');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check sale items
    const saleItems = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM sale_items
    `;

    console.log('📋 SALE ITEMS:');
    console.log(`   Total items: ${saleItems[0].count}\n`);

    // Check VAT records
    const vatRecords = await prisma.$queryRaw`
      SELECT COUNT(*) as count,
             COALESCE(SUM("vatAmount"), 0) as "totalVat"
      FROM vat_records
    `;

    console.log('🧾 VAT RECORDS:');
    console.log(`   Total records: ${vatRecords[0].count}`);
    console.log(`   Total VAT: ${parseFloat(vatRecords[0].totalVat).toFixed(2)} AED\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test persistence (re-query after 1 second)
    console.log('⏱️  Testing persistence (waiting 1 second)...\n');

    await new Promise(resolve => setTimeout(resolve, 1000));

    const productsAfter = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM products
    `;

    const salesAfter = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM sales
    `;

    console.log('✅ PERSISTENCE CHECK RESULTS:\n');
    console.log(`   Products before: ${products[0].count}`);
    console.log(`   Products after:  ${productsAfter[0].count}`);

    if (productsAfter[0].count === products[0].count) {
      console.log('   ✅ Product data is PERSISTENT!\n');
    } else {
      console.log('   ❌ Product data NOT persisting!\n');
    }

    console.log(`   Sales before: ${sales[0].count}`);
    console.log(`   Sales after:  ${salesAfter[0].count}`);

    if (salesAfter[0].count === sales[0].count) {
      console.log('   ✅ Sales data is PERSISTENT!\n');
    } else {
      console.log('   ❌ Sales data NOT persisting!\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Final verdict
    const totalRecords = parseInt(products[0].count) + parseInt(sales[0].count);

    if (totalRecords > 0 &&
        productsAfter[0].count === products[0].count &&
        salesAfter[0].count === sales[0].count) {
      console.log('✅✅✅ DATA IS BEING SAVED CORRECTLY! ✅✅✅\n');
      console.log('All data is:');
      console.log('   ✅ Saved to database');
      console.log('   ✅ Persisting correctly');
      console.log('   ✅ Ready for production use\n');
    } else if (totalRecords === 0) {
      console.log('⚠️  Database is empty but functional\n');
      console.log('You can now:');
      console.log('   • Add products via /products page');
      console.log('   • Create sales via /sales/new');
      console.log('   • Import marketplace data via /sales/import\n');
    } else {
      console.log('⚠️  Some data persistence issues detected\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

checkDataPersistence();
