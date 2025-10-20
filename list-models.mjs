import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

console.log('Available Prisma models:');
const models = Object.keys(prisma).filter(key => {
  return key.charAt(0) === key.charAt(0).toLowerCase() &&
         !key.startsWith('$') &&
         !key.startsWith('_');
});

models.forEach(model => console.log(`  - ${model}`));

await prisma.$disconnect();
