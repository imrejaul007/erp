import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSalesTables() {
  try {
    console.log('🔍 Checking sales-related tables...\n');

    // Check what tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    console.log('📊 Existing tables:');
    const tableNames = tables.map(t => t.table_name);
    tableNames.forEach(name => console.log(`   - ${name}`));

    // Check if orders table exists
    const hasOrders = tableNames.includes('orders');
    const hasOrderItems = tableNames.includes('order_items');
    const hasPayments = tableNames.includes('payments');

    console.log('\n📋 Sales-related tables status:');
    console.log(`   Orders table: ${hasOrders ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`   Order items table: ${hasOrderItems ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`   Payments table: ${hasPayments ? '✅ EXISTS' : '❌ MISSING'}`);

    if (hasOrders) {
      const orderColumns = await prisma.$queryRaw`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'orders'
        ORDER BY ordinal_position
      `;
      console.log('\n📦 Orders table structure:');
      console.table(orderColumns);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSalesTables();
