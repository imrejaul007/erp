import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const result = await prisma.$queryRaw`
  SELECT column_name
  FROM information_schema.columns
  WHERE table_name = 'stores'
  ORDER BY ordinal_position
`;

console.log('Stores columns:', result.map(r => r.column_name).join(', '));

const stores = await prisma.$queryRaw`SELECT id, name FROM stores LIMIT 1`;
console.log('Existing stores:', stores.length);
if (stores.length > 0) {
  console.log('Store:', stores[0]);
}

await prisma.$disconnect();
