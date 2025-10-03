import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function test() {
  try {
    console.log('Testing database connection...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'NOT SET')
    
    const customers = await prisma.customer.findMany({
      take: 5
    })
    
    console.log(`✓ Successfully connected to database`)
    console.log(`✓ Found ${customers.length} customers`)
    customers.forEach(c => {
      console.log(`  - ${c.name} (${c.email || 'no email'})`)
    })
    
    // Test creating a customer
    const testCustomer = await prisma.customer.create({
      data: {
        name: 'API Test Customer',
        email: 'apitest@example.com',
        phone: '+971501234567',
        customerType: 'INDIVIDUAL',
        tenantId: (await prisma.tenant.findFirst()).id,
        createdById: (await prisma.user.findFirst()).id
      }
    })
    
    console.log(`✓ Successfully created test customer: ${testCustomer.name}`)
    
    // Delete test customer
    await prisma.customer.delete({ where: { id: testCustomer.id } })
    console.log(`✓ Successfully deleted test customer`)
    
  } catch (error) {
    console.error('✗ Error:', error.message)
    console.error('Stack:', error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

test()
