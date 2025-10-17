import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixIndexes() {
  try {
    console.log('🔧 Creating Performance Indexes...\n');

    // Check existing indexes first
    const existingIndexes = await prisma.$queryRaw`
      SELECT tablename, indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND tablename IN ('sales', 'sale_items', 'vat_records')
    `;

    console.log('Existing indexes:');
    existingIndexes.forEach(idx => {
      console.log(`   ${idx.tablename}.${idx.indexname}`);
    });
    console.log();

    const indexesToCreate = [
      { table: 'sales', column: 'tenantId', name: 'idx_sales_tenant_id' },
      { table: 'sales', column: 'source', name: 'idx_sales_source' },
      { table: 'sales', column: 'marketplaceOrderId', name: 'idx_sales_marketplace_order' },
      { table: 'sales', column: 'storeId', name: 'idx_sales_store_id' },
      { table: 'sale_items', column: 'tenantId', name: 'idx_sale_items_tenant_id' },
      { table: 'sale_items', column: 'saleId', name: 'idx_sale_items_sale_id' },
      { table: 'sale_items', column: 'productId', name: 'idx_sale_items_product_id' },
      { table: 'vat_records', column: 'tenantId', name: 'idx_vat_records_tenant_id' },
      { table: 'vat_records', column: 'referenceId', name: 'idx_vat_records_reference_id' },
      { table: 'vat_records', column: 'period', name: 'idx_vat_records_period' }
    ];

    for (const index of indexesToCreate) {
      try {
        // Check if index already exists
        const exists = existingIndexes.some(ei =>
          ei.indexname === index.name ||
          ei.indexname.includes(index.column.toLowerCase())
        );

        if (exists) {
          console.log(`   ⏭️  ${index.name} already exists`);
          continue;
        }

        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "${index.name}"
          ON ${index.table} ("${index.column}")
        `);

        console.log(`   ✅ Created ${index.name}`);
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log(`   ⏭️  ${index.name} already exists`);
        } else {
          console.log(`   ⚠️  ${index.name}: ${err.message}`);
        }
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅  INDEXES CREATED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Verify indexes
    const newIndexes = await prisma.$queryRaw`
      SELECT tablename, indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND tablename IN ('sales', 'sale_items', 'vat_records')
      ORDER BY tablename, indexname
    `;

    console.log('All indexes after creation:');
    let currentTable = '';
    newIndexes.forEach(idx => {
      if (idx.tablename !== currentTable) {
        console.log(`\n📊 ${idx.tablename}:`);
        currentTable = idx.tablename;
      }
      console.log(`   • ${idx.indexname}`);
    });
    console.log();

  } catch (error) {
    console.error('\n❌ Error creating indexes:', error);
    console.error('Details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixIndexes();
