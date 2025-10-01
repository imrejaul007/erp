import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const supplierSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  nameAr: z.string().optional(),
  type: z.enum(['LOCAL', 'REGIONAL', 'INTERNATIONAL', 'MANUFACTURER', 'DISTRIBUTOR', 'AGENT']),
  category: z.string().min(1),
  contactPerson: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().min(1),
  postalCode: z.string().optional(),
  vatNumber: z.string().optional(),
  tradeNumber: z.string().optional(),
  licenseNumber: z.string().optional(),
  establishedYear: z.number().optional(),
  paymentTerms: z.string().optional(),
  creditLimit: z.number().default(0),
  currency: z.string().default('AED'),
  discountPercent: z.number().default(0),
  certifications: z.array(z.string()).optional(),
  complianceStatus: z.enum(['PENDING', 'APPROVED', 'CONDITIONAL', 'REJECTED', 'EXPIRED']).default('PENDING'),
  leadTime: z.number().default(0),
  minOrderValue: z.number().default(0),
  isPreferred: z.boolean().default(false),
  isActive: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''
    const complianceStatus = searchParams.get('complianceStatus') || ''
    const isPreferred = searchParams.get('isPreferred')

    const skip = (page - 1) * limit

    const where: any = {
      isActive: true
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (type) {
      where.type = type
    }

    if (complianceStatus) {
      where.complianceStatus = complianceStatus
    }

    if (isPreferred !== null) {
      where.isPreferred = isPreferred === 'true'
    }

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { isPreferred: 'desc' },
          { performanceScore: 'desc' },
          { name: 'asc' }
        ],
        include: {
          supplierProducts: {
            include: {
              rawMaterial: true,
              product: true
            }
          },
          evaluations: {
            orderBy: { evaluationDate: 'desc' },
            take: 1
          },
          purchaseOrders: {
            where: {
              status: { in: ['APPROVED', 'SENT', 'ACKNOWLEDGED'] }
            },
            select: { id: true }
          }
        }
      }),
      prisma.supplier.count({ where })
    ])

    // Calculate performance metrics
    const suppliersWithMetrics = await Promise.all(
      suppliers.map(async (supplier) => {
        const orders = await prisma.purchaseOrder.findMany({
          where: { supplierId: supplier.id },
          select: {
            deliveryDate: true,
            expectedDate: true,
            status: true
          }
        })

        const completedOrders = orders.filter(o => o.status === 'COMPLETED')
        const onTimeOrders = completedOrders.filter(o =>
          o.deliveryDate && o.expectedDate &&
          new Date(o.deliveryDate) <= new Date(o.expectedDate)
        )

        const onTimeDeliveryRate = completedOrders.length > 0
          ? Math.round((onTimeOrders.length / completedOrders.length) * 100)
          : 0

        return {
          ...supplier,
          totalOrders: orders.length,
          onTimeDeliveries: onTimeOrders.length,
          onTimeDeliveryRate,
          activePurchaseOrders: supplier.purchaseOrders.length
        }
      })
    )

    return NextResponse.json({
      suppliers: suppliersWithMetrics,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = supplierSchema.parse(body)

    // Check if supplier code already exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { code: validatedData.code }
    })

    if (existingSupplier) {
      return NextResponse.json(
        { error: 'Supplier code already exists' },
        { status: 400 }
      )
    }

    const supplier = await prisma.supplier.create({
      data: {
        ...validatedData,
        certifications: validatedData.certifications || []
      }
    })

    return NextResponse.json(supplier, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating supplier:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}