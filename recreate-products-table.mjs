import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function recreateProductsTable() {
  try {
    console.log('Recreating products table with correct structure...\n');

    // Drop existing products table
    console.log('Step 1: Dropping old products table...');
    await prisma.$executeRaw`DROP TABLE IF EXISTS products CASCADE`;
    console.log('✅ Old products table dropped');

    // Now run prisma db push to recreate it
    console.log('\nStep 2: Prisma will recreate the products table with correct structure...');
    console.log('Please run: npx prisma db push --accept-data-loss');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

recreateProductsTable();
