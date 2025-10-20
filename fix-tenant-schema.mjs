import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixTenantSchema() {
  try {
    console.log('Starting database schema fix for multi-tenancy...\n');

    // Step 1: Create tenants table
    console.log('Step 1: Creating tenants table...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS tenants (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        domain TEXT,
        is_active BOOLEAN NOT NULL DEFAULT true,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        plan TEXT NOT NULL DEFAULT 'FREE',
        settings JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    console.log('✅ Tenants table created');

    // Step 2: Create default tenant
    console.log('\nStep 2: Creating default tenant...');
    const tenantId = 'default-tenant-' + Date.now();
    await prisma.$executeRaw`
      INSERT INTO tenants (id, name, slug, is_active, status)
      VALUES (${tenantId}, 'Default Organization', 'default-org', true, 'ACTIVE')
      ON CONFLICT (slug) DO NOTHING
    `;

    // Get the tenant ID (in case it already existed)
    const tenant = await prisma.$queryRaw`
      SELECT id FROM tenants WHERE slug = 'default-org' LIMIT 1
    `;
    const actualTenantId = tenant[0]?.id || tenantId;
    console.log(`✅ Default tenant created/found: ${actualTenantId}`);

    // Step 3: Add tenant_id column to users table
    console.log('\nStep 3: Adding tenant_id column to users table...');
    try {
      await prisma.$executeRaw`
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS tenant_id TEXT
      `;
      console.log('✅ Column added to users table');
    } catch (error) {
      console.log('⚠️  Column may already exist:', error.message);
    }

    // Step 4: Update existing users with tenant_id
    console.log('\nStep 4: Assigning tenant to existing users...');
    const updateResult = await prisma.$executeRaw`
      UPDATE users
      SET tenant_id = ${actualTenantId}
      WHERE tenant_id IS NULL
    `;
    console.log(`✅ Updated ${updateResult} users with tenant_id`);

    // Step 5: Make tenant_id NOT NULL and add foreign key
    console.log('\nStep 5: Adding constraints...');
    try {
      await prisma.$executeRaw`
        ALTER TABLE users
        ALTER COLUMN tenant_id SET NOT NULL
      `;
      console.log('✅ Made tenant_id NOT NULL');
    } catch (error) {
      console.log('⚠️  Constraint may already exist:', error.message);
    }

    try {
      await prisma.$executeRaw`
        ALTER TABLE users
        ADD CONSTRAINT IF NOT EXISTS fk_users_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
      `;
      console.log('✅ Added foreign key constraint');
    } catch (error) {
      console.log('⚠️  Foreign key may already exist:', error.message);
    }

    // Step 6: Add tenant_id to other critical tables
    console.log('\nStep 6: Adding tenant_id to other tables...');
    const tables = [
      'products',
      'customers',
      'suppliers',
      'stores',
      'categories',
      'brands'
    ];

    for (const table of tables) {
      try {
        // Check if table exists
        const tableExists = await prisma.$queryRaw`
          SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = ${table}
          ) as exists
        `;

        if (tableExists[0]?.exists) {
          console.log(`  Processing ${table}...`);

          // Add column
          await prisma.$executeRawUnsafe(`
            ALTER TABLE ${table}
            ADD COLUMN IF NOT EXISTS tenant_id TEXT
          `);

          // Update existing records
          await prisma.$executeRawUnsafe(`
            UPDATE ${table}
            SET tenant_id = '${actualTenantId}'
            WHERE tenant_id IS NULL
          `);

          // Make NOT NULL
          await prisma.$executeRawUnsafe(`
            ALTER TABLE ${table}
            ALTER COLUMN tenant_id SET NOT NULL
          `);

          // Add foreign key
          await prisma.$executeRawUnsafe(`
            ALTER TABLE ${table}
            ADD CONSTRAINT fk_${table}_tenant
            FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
          `);

          console.log(`  ✅ ${table} updated`);
        } else {
          console.log(`  ⚠️  ${table} does not exist, skipping`);
        }
      } catch (error) {
        console.log(`  ⚠️  Error with ${table}:`, error.message);
      }
    }

    console.log('\n✅ Database schema fix completed successfully!');
    console.log('\nYou can now save data. All users and records are assigned to the default tenant.');

  } catch (error) {
    console.error('\n❌ Error during schema fix:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixTenantSchema();
