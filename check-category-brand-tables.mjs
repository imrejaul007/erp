import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const result = await prisma.$queryRaw`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name IN ('categories', 'brands', 'products', 'Category', 'Brand', 'Product')
  ORDER BY table_name
`;

console.log('Tables found:', result);

// Also check prisma client properties
console.log('\nChecking Prisma client for category/brand access:');
console.log('prisma.categories:', typeof prisma.categories);
console.log('prisma.brands:', typeof prisma.brands);
console.log('prisma.category:', typeof prisma.category);
console.log('prisma.brand:', typeof prisma.brand);

await prisma.$disconnect();
