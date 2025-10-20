import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkExistingSales() {
  try {
    console.log('🔍 Checking existing sales structure...\n');

    // Check sales table structure
    const salesColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'sales'
      ORDER BY ordinal_position
    `;

    console.log('📊 Sales table structure:');
    console.table(salesColumns);

    // Check sale_items table structure
    const saleItemsColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'sale_items'
      ORDER BY ordinal_position
    `;

    console.log('\n📦 Sale_items table structure:');
    console.table(saleItemsColumns);

    // Check vat_records table structure
    const vatColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'vat_records'
      ORDER BY ordinal_position
    `;

    console.log('\n💰 VAT_records table structure:');
    console.table(vatColumns);

    // Count existing sales
    const salesCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM sales
    `;

    console.log(`\n📈 Existing sales count: ${salesCount[0].count}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkExistingSales();
