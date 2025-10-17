import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupSalesMultiTenant() {
  try {
    console.log('🚀 Setting up multi-tenant support for sales tables...\n');

    // Get default tenant
    const tenant = await prisma.$queryRaw`
      SELECT id, name FROM tenants LIMIT 1
    `;

    if (tenant.length === 0) {
      console.log('❌ No tenant found. Please create a tenant first.');
      return;
    }

    const tenantId = tenant[0].id;
    console.log(`✅ Using tenant: ${tenant[0].name} (${tenantId})\n`);

    // Step 1: Add tenantId to sales table
    console.log('Step 1: Adding tenantId to sales table...');
    try {
      await prisma.$executeRaw`
        ALTER TABLE sales ADD COLUMN IF NOT EXISTS "tenantId" TEXT
      `;
      console.log('   ✅ Column added');
    } catch (e) {
      console.log('   ⏭️  Column already exists');
    }

    // Set default tenantId for existing sales
    await prisma.$executeRaw`
      UPDATE sales SET "tenantId" = ${tenantId} WHERE "tenantId" IS NULL
    `;
    console.log('   ✅ Set default tenantId for existing sales');

    // Make tenantId NOT NULL
    await prisma.$executeRaw`
      ALTER TABLE sales ALTER COLUMN "tenantId" SET NOT NULL
    `;
    console.log('   ✅ Made tenantId required');

    // Step 2: Add tenantId to sale_items table
    console.log('\nStep 2: Adding tenantId to sale_items table...');
    try {
      await prisma.$executeRaw`
        ALTER TABLE sale_items ADD COLUMN IF NOT EXISTS "tenantId" TEXT
      `;
      console.log('   ✅ Column added');
    } catch (e) {
      console.log('   ⏭️  Column already exists');
    }

    await prisma.$executeRaw`
      UPDATE sale_items SET "tenantId" = ${tenantId} WHERE "tenantId" IS NULL
    `;
    console.log('   ✅ Set default tenantId for existing sale items');

    await prisma.$executeRaw`
      ALTER TABLE sale_items ALTER COLUMN "tenantId" SET NOT NULL
    `;
    console.log('   ✅ Made tenantId required');

    // Step 3: Add tenantId to vat_records table
    console.log('\nStep 3: Adding tenantId to vat_records table...');
    try {
      await prisma.$executeRaw`
        ALTER TABLE vat_records ADD COLUMN IF NOT EXISTS "tenantId" TEXT
      `;
      console.log('   ✅ Column added');
    } catch (e) {
      console.log('   ⏭️  Column already exists');
    }

    await prisma.$executeRaw`
      UPDATE vat_records SET "tenantId" = ${tenantId} WHERE "tenantId" IS NULL
    `;
    console.log('   ✅ Set default tenantId for existing VAT records');

    await prisma.$executeRaw`
      ALTER TABLE vat_records ALTER COLUMN "tenantId" SET NOT NULL
    `;
    console.log('   ✅ Made tenantId required');

    // Step 4: Add marketplace source tracking
    console.log('\nStep 4: Adding marketplace tracking fields...');

    try {
      await prisma.$executeRaw`
        ALTER TABLE sales ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'MANUAL'
      `;
      console.log('   ✅ Added source column to sales');
    } catch (e) {
      console.log('   ⏭️  Source column already exists');
    }

    try {
      await prisma.$executeRaw`
        ALTER TABLE sales ADD COLUMN IF NOT EXISTS "marketplaceOrderId" TEXT
      `;
      console.log('   ✅ Added marketplaceOrderId column');
    } catch (e) {
      console.log('   ⏭️  marketplaceOrderId already exists');
    }

    try {
      await prisma.$executeRaw`
        ALTER TABLE sales ADD COLUMN IF NOT EXISTS "importedAt" TIMESTAMP
      `;
      console.log('   ✅ Added importedAt column');
    } catch (e) {
      console.log('   ⏭️  importedAt already exists');
    }

    // Step 5: Create indexes for performance
    console.log('\nStep 5: Creating indexes...');

    try {
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_sales_tenant ON sales("tenantId")
      `;
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_sales_source ON sales(source)
      `;
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_sales_marketplace_order ON sales("marketplaceOrderId")
      `;
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_sale_items_tenant ON sale_items("tenantId")
      `;
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_vat_records_tenant ON vat_records("tenantId")
      `;
      console.log('   ✅ All indexes created');
    } catch (e) {
      console.log('   ⚠️  Some indexes may already exist:', e.message);
    }

    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅  SALES TABLES SETUP COMPLETE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ Sales tables now support:');
    console.log('   - Multi-tenancy (tenantId)');
    console.log('   - VAT calculation (vatAmount, vatRate)');
    console.log('   - Marketplace tracking (source, marketplaceOrderId)');
    console.log('   - Import tracking (importedAt)\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    console.error('Details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

setupSalesMultiTenant();
