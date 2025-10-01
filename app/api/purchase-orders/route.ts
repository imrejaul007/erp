import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const purchaseOrderItemSchema = z.object({
  rawMaterialId: z.string().optional(),
  productId: z.string().optional(),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  unitPrice: z.number().positive(),
  discountPercent: z.number().min(0).max(100).default(0),
  discountAmount: z.number().min(0).default(0),
  vatRate: z.number().min(0).default(5),
  vatAmount: z.number().min(0).default(0),
  totalAmount: z.number().positive(),
  specifications: z.string().optional(),
  notes: z.string().optional()
})

const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1),
  storeId: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  type: z.enum(['REGULAR', 'URGENT', 'BLANKET', 'CONTRACT']).default('REGULAR'),
  requestedDate: z.string().transform((str) => new Date(str)),
  expectedDate: z.string().transform((str) => new Date(str)).optional(),
  subtotal: z.number().min(0).default(0),
  discountAmount: z.number().min(0).default(0),
  vatAmount: z.number().min(0).default(0),
  shippingCost: z.number().min(0).default(0),
  totalAmount: z.number().positive(),
  currency: z.string().default('AED'),
  paymentTerms: z.string().optional(),
  deliveryTerms: z.string().optional(),
  notes: z.string().optional(),
  internalNotes: z.string().optional(),
  items: z.array(purchaseOrderItemSchema).min(1)
})

// Generate PO number
async function generatePONumber(): Promise<string> {
  const year = new Date().getFullYear()
  const count = await prisma.purchaseOrder.count({
    where: {
      poNumber: {
        startsWith: `PO-${year}-`
      }
    }
  })
  return `PO-${year}-${String(count + 1).padStart(3, '0')}`
}

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
    const status = searchParams.get('status') || ''
    const priority = searchParams.get('priority') || ''
    const supplierId = searchParams.get('supplierId') || ''

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { poNumber: { contains: search, mode: 'insensitive' } },
        {
          supplier: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { code: { contains: search, mode: 'insensitive' } }
            ]
          }
        },
        {
          requestedBy: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } }
            ]
          }
        }
      ]
    }

    if (status) {
      where.status = status
    }

    if (priority) {
      where.priority = priority
    }

    if (supplierId) {
      where.supplierId = supplierId
    }

    const [purchaseOrders, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { priority: 'desc' },
          { orderDate: 'desc' }
        ],
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
              code: true,
              country: true,
              leadTime: true,
              rating: true
            }
          },
          requestedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          approvedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          store: {
            select: {
              id: true,
              name: true,
              code: true
            }
          },
          items: {
            include: {
              rawMaterial: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                  category: true
                }
              },
              product: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                  category: true
                }
              }
            }
          },
          receipts: {
            select: {
              id: true,
              receiptNo: true,
              status: true,
              receiptDate: true
            }
          },
          shipments: {
            select: {
              id: true,
              shipmentNo: true,
              status: true,
              trackingNumber: true
            }
          }
        }
      }),
      prisma.purchaseOrder.count({ where })
    ])

    // Calculate additional metrics
    const enrichedPOs = purchaseOrders.map(po => ({
      ...po,
      itemCount: po.items.length,
      receivedItemsCount: po.receipts.filter(r => r.status === 'ACCEPTED').length,
      shipmentsCount: po.shipments.length,
      isOverdue: po.expectedDate && new Date() > new Date(po.expectedDate) && !['COMPLETED', 'CANCELLED'].includes(po.status)
    }))

    return NextResponse.json({
      purchaseOrders: enrichedPOs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching purchase orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = purchaseOrderSchema.parse(body)

    // Validate supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { id: validatedData.supplierId }
    })

    if (!supplier) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      )
    }

    // Validate store if provided
    if (validatedData.storeId) {
      const store = await prisma.store.findUnique({
        where: { id: validatedData.storeId }
      })

      if (!store) {
        return NextResponse.json(
          { error: 'Store not found' },
          { status: 404 }
        )
      }
    }

    // Validate raw materials and products in items
    for (const item of validatedData.items) {
      if (item.rawMaterialId) {
        const rawMaterial = await prisma.rawMaterial.findUnique({
          where: { id: item.rawMaterialId }
        })
        if (!rawMaterial) {
          return NextResponse.json(
            { error: `Raw material not found: ${item.rawMaterialId}` },
            { status: 404 }
          )
        }
      }

      if (item.productId) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        })
        if (!product) {
          return NextResponse.json(
            { error: `Product not found: ${item.productId}` },
            { status: 404 }
          )
        }
      }

      if (!item.rawMaterialId && !item.productId) {
        return NextResponse.json(
          { error: 'Each item must have either rawMaterialId or productId' },
          { status: 400 }
        )
      }
    }

    const poNumber = await generatePONumber()

    // Calculate pending quantity for each item
    const itemsWithPendingQty = validatedData.items.map(item => ({
      ...item,
      pendingQty: item.quantity,
      receivedQty: 0
    }))

    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        poNumber,
        supplierId: validatedData.supplierId,
        requestedById: session.user.id,
        storeId: validatedData.storeId,
        priority: validatedData.priority,
        type: validatedData.type,
        requestedDate: validatedData.requestedDate,
        expectedDate: validatedData.expectedDate,
        subtotal: validatedData.subtotal,
        discountAmount: validatedData.discountAmount,
        vatAmount: validatedData.vatAmount,
        shippingCost: validatedData.shippingCost,
        totalAmount: validatedData.totalAmount,
        currency: validatedData.currency,
        paymentTerms: validatedData.paymentTerms,
        deliveryTerms: validatedData.deliveryTerms,
        notes: validatedData.notes,
        internalNotes: validatedData.internalNotes,
        items: {
          create: itemsWithPendingQty
        }
      },
      include: {
        supplier: true,
        requestedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        store: true,
        items: {
          include: {
            rawMaterial: true,
            product: true
          }
        }
      }
    })

    return NextResponse.json(purchaseOrder, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating purchase order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}