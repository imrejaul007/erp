import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const models = Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$'));

console.log('Has categories:', models.includes('categories'));
console.log('Has brands:', models.includes('brands'));
console.log('Has tenants:', models.includes('tenants'));
console.log('Has users:', models.includes('users'));
console.log('\nTotal models:', models.length);
console.log('\nAll models:', models.sort().join(', '));

await prisma.$disconnect();
