import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixColumnNames() {
  try {
    console.log('Renaming tenant_id to tenantId to match database naming convention...\n');

    // Rename in users table
    console.log('Renaming in users table...');
    await prisma.$executeRaw`
      ALTER TABLE users
      RENAME COLUMN tenant_id TO "tenantId"
    `;
    console.log('✅ users.tenant_id → users.tenantId');

    // Rename in products table
    console.log('\nRenaming in products table...');
    try {
      await prisma.$executeRaw`
        ALTER TABLE products
        RENAME COLUMN tenant_id TO "tenantId"
      `;
      console.log('✅ products.tenant_id → products.tenantId');
    } catch (e) {
      console.log('⚠️  products:', e.message);
    }

    // Rename in customers table
    console.log('\nRenaming in customers table...');
    try {
      await prisma.$executeRaw`
        ALTER TABLE customers
        RENAME COLUMN tenant_id TO "tenantId"
      `;
      console.log('✅ customers.tenant_id → customers.tenantId');
    } catch (e) {
      console.log('⚠️  customers:', e.message);
    }

    // Rename in suppliers table
    console.log('\nRenaming in suppliers table...');
    try {
      await prisma.$executeRaw`
        ALTER TABLE suppliers
        RENAME COLUMN tenant_id TO "tenantId"
      `;
      console.log('✅ suppliers.tenant_id → suppliers.tenantId');
    } catch (e) {
      console.log('⚠️  suppliers:', e.message);
    }

    // Rename in stores table
    console.log('\nRenaming in stores table...');
    try {
      await prisma.$executeRaw`
        ALTER TABLE stores
        RENAME COLUMN tenant_id TO "tenantId"
      `;
      console.log('✅ stores.tenant_id → stores.tenantId');
    } catch (e) {
      console.log('⚠️  stores:', e.message);
    }

    // Rename in tenants table
    console.log('\nRenaming in tenants table...');
    try {
      await prisma.$executeRaw`
        ALTER TABLE tenants
        RENAME COLUMN is_active TO "isActive"
      `;
      console.log('✅ tenants.is_active → tenants.isActive');

      await prisma.$executeRaw`
        ALTER TABLE tenants
        RENAME COLUMN created_at TO "createdAt"
      `;
      console.log('✅ tenants.created_at → tenants.createdAt');

      await prisma.$executeRaw`
        ALTER TABLE tenants
        RENAME COLUMN updated_at TO "updatedAt"
      `;
      console.log('✅ tenants.updated_at → tenants.updatedAt');
    } catch (e) {
      console.log('⚠️  tenants:', e.message);
    }

    console.log('\n✅ Column names fixed! Now regenerating Prisma client...');

  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixColumnNames();
