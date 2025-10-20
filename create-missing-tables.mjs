import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createMissingTables() {
  try {
    console.log('Creating missing tables...\n');

    // Create categories table
    console.log('Creating categories table...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        "nameArabic" TEXT,
        description TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "tenantId" TEXT NOT NULL,
        FOREIGN KEY ("tenantId") REFERENCES tenants(id) ON DELETE CASCADE
      )
    `;
    console.log('✅ Categories table created');

    // Create index
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "categories_tenantId_idx" ON categories("tenantId")
    `;

    // Create brands table
    console.log('\nCreating brands table...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS brands (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        "nameArabic" TEXT,
        description TEXT,
        "logoUrl" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "tenantId" TEXT NOT NULL,
        FOREIGN KEY ("tenantId") REFERENCES tenants(id) ON DELETE CASCADE
      )
    `;
    console.log('✅ Brands table created');

    // Create index
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "brands_tenantId_idx" ON brands("tenantId")
    `;

    console.log('\n✅ All missing tables created successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMissingTables();
