import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// Validation schemas
const TransactionItemSchema = z.object({
  productId: z.string(),
  sku: z.string(),
  name: z.string(),
  arabicName: z.string().optional(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  discount: z.number().min(0).default(0),
  vatRate: z.number().min(0).default(5),
  vatAmount: z.number().min(0),
  totalPrice: z.number().min(0),
  category: z.string().optional(),
  brand: z.string().optional()
});

const PaymentDetailsSchema = z.object({
  method: z.enum(['cash', 'card', 'digital', 'bank_transfer', 'loyalty_points', 'cheque']),
  amountReceived: z.number().optional(),
  changeGiven: z.number().optional(),
  cardType: z.string().optional(),
  lastFourDigits: z.string().optional(),
  approvalCode: z.string().optional(),
  digitalWallet: z.string().optional(),
  transactionId: z.string().optional(),
  bankReference: z.string().optional(),
  bankName: z.string().optional(),
  pointsUsed: z.number().optional(),
  pointsValue: z.number().optional(),
  chequeNumber: z.string().optional(),
  chequeBank: z.string().optional()
});

const TransactionDataSchema = z.object({
  storeId: z.string(),
  cashierId: z.string(),
  customerId: z.string().optional(),
  items: z.array(TransactionItemSchema).min(1),
  subtotal: z.number().min(0),
  totalVat: z.number().min(0),
  grandTotal: z.number().min(0),
  currency: z.string().default('AED'),
  paymentMethod: z.string(),
  paymentDetails: PaymentDetailsSchema,
  promotionsApplied: z.array(z.any()).optional(),
  loyaltyPointsUsed: z.number().optional(),
  loyaltyPointsEarned: z.number().optional(),
  notes: z.string().optional()
});

export interface TransactionItem {
  productId: string;
  sku: string;
  name: string;
  arabicName?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  vatRate: number;
  vatAmount: number;
  totalPrice: number;
  category?: string;
  brand?: string;
}

export interface PaymentDetails {
  method: 'cash' | 'card' | 'digital' | 'bank_transfer' | 'loyalty_points' | 'cheque';
  amountReceived?: number;
  changeGiven?: number;
  cardType?: string;
  lastFourDigits?: string;
  approvalCode?: string;
  digitalWallet?: string;
  transactionId?: string;
  bankReference?: string;
  bankName?: string;
  pointsUsed?: number;
  pointsValue?: number;
  chequeNumber?: string;
  chequeBank?: string;
}

export interface TransactionData {
  storeId: string;
  cashierId: string;
  customerId?: string;
  items: TransactionItem[];
  subtotal: number;
  totalVat: number;
  grandTotal: number;
  currency: string;
  paymentMethod: string;
  paymentDetails: PaymentDetails;
  promotionsApplied?: any[];
  loyaltyPointsUsed?: number;
  loyaltyPointsEarned?: number;
  notes?: string;
}

export interface VATBreakdown {
  vatRate: number;
  taxableAmount: number;
  vatAmount: number;
}

// UAE VAT Compliance Helper
function calculateUAEVAT(items: TransactionItem[]): {
  totalVatAmount: number;
  vatBreakdown: VATBreakdown[];
  vatNumber: string;
} {
  const vatBreakdown: Map<number, { taxableAmount: number; vatAmount: number }> = new Map();

  items.forEach(item => {
    const itemTotal = item.quantity * item.unitPrice - item.discount;
    const vatRate = item.vatRate || 5; // UAE standard VAT rate
    const vatAmount = (itemTotal * vatRate) / 100;

    if (vatBreakdown.has(vatRate)) {
      const existing = vatBreakdown.get(vatRate)!;
      existing.taxableAmount += itemTotal;
      existing.vatAmount += vatAmount;
    } else {
      vatBreakdown.set(vatRate, {
        taxableAmount: itemTotal,
        vatAmount: vatAmount
      });
    }
  });

  const vatBreakdownArray: VATBreakdown[] = Array.from(vatBreakdown.entries()).map(([rate, data]) => ({
    vatRate: rate,
    taxableAmount: data.taxableAmount,
    vatAmount: data.vatAmount
  }));

  const totalVatAmount = vatBreakdownArray.reduce((sum, item) => sum + item.vatAmount, 0);

  return {
    totalVatAmount,
    vatBreakdown: vatBreakdownArray,
    vatNumber: 'TRN-100352966400003' // Example UAE VAT TRN
  };
}

// Generate ZATCA QR Code for UAE compliance
function generateZATCAQRCode(transaction: any): string {
  const seller = 'Oud Premium Store';
  const vatNumber = 'TRN-100352966400003';
  const timestamp = new Date().toISOString();
  const totalAmount = transaction.grandTotal.toFixed(2);
  const vatAmount = transaction.totalVat.toFixed(2);

  // ZATCA QR Code format (Base64 encoded)
  const qrData = JSON.stringify({
    seller,
    vatNumber,
    timestamp,
    totalAmount,
    vatAmount,
    receiptNumber: transaction.receiptNumber
  });

  return Buffer.from(qrData).toString('base64');
}

// Map payment method to Prisma enum
function mapPaymentMethod(method: string): any {
  const methodMap: Record<string, string> = {
    'cash': 'CASH',
    'card': 'CARD',
    'digital': 'DIGITAL_WALLET',
    'bank_transfer': 'BANK_TRANSFER',
    'loyalty_points': 'CASH', // Map to CASH for now
    'cheque': 'CHEQUE'
  };
  return methodMap[method] || 'CASH';
}

// GET - Fetch recent POS transactions
export const GET = withTenant(async (request, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const storeId = searchParams.get('storeId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = { tenantId };

    if (storeId) {
      where.storeId = storeId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [transactions, total] = await Promise.all([
      prisma.posTransaction.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  nameArabic: true,
                  sku: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.posTransaction.count({ where })
    ]);

    return apiResponse({
      transactions,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    return apiError('Internal server error', 500);
  }
});

// POST - Create new POS transaction
export const POST = withTenant(async (request, { tenantId, user }) => {
  try {
    const body = await request.json();
    const transactionData = TransactionDataSchema.parse(body);

    // Verify store exists and belongs to tenant
    const store = await prisma.store.findFirst({
      where: {
        id: transactionData.storeId,
        tenantId
      }
    });

    if (!store) {
      return apiError('Store not found', 404);
    }

    // Verify customer belongs to tenant if customerId is provided
    if (transactionData.customerId) {
      const customer = await prisma.customer.findFirst({
        where: {
          id: transactionData.customerId,
          tenantId
        }
      });

      if (!customer) {
        return apiError('Customer not found', 404);
      }
    }

    // Verify all products exist and have sufficient stock
    for (const item of transactionData.items) {
      const inventory = await prisma.storeInventory.findUnique({
        where: {
          storeId_productId: {
            storeId: transactionData.storeId,
            productId: item.productId
          }
        }
      });

      if (!inventory || inventory.quantity < item.quantity) {
        return apiError(
          `Insufficient stock for product ${item.name}. Available: ${inventory?.quantity || 0}, Requested: ${item.quantity}`,
          400
        );
      }
    }

    // Calculate VAT compliance data
    const vatData = calculateUAEVAT(transactionData.items);

    // Generate receipt number
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    const receiptNumber = `${store.code}-${timestamp}-${random}`;

    // Create transaction in database with items
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: receiptNumber,
          storeId: transactionData.storeId,
          customerId: transactionData.customerId,
          totalAmount: transactionData.subtotal,
          vatAmount: vatData.totalVatAmount,
          grandTotal: transactionData.grandTotal,
          status: 'COMPLETED',
          paymentStatus: 'PAID',
          notes: transactionData.notes,
          createdById: user.id,
          tenantId
        }
      });

      // Create order items
      await Promise.all(
        transactionData.items.map(item =>
          tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.totalPrice
            }
          })
        )
      );

      // Create payment record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          customerId: transactionData.customerId,
          amount: transactionData.grandTotal,
          method: mapPaymentMethod(transactionData.paymentDetails.method),
          status: 'COMPLETED',
          reference: transactionData.paymentDetails.transactionId || receiptNumber,
          notes: JSON.stringify(transactionData.paymentDetails),
          processedById: user.id,
          tenantId
        }
      });

      // Update inventory for each item
      await Promise.all(
        transactionData.items.map(item =>
          tx.storeInventory.update({
            where: {
              storeId_productId: {
                storeId: transactionData.storeId,
                productId: item.productId
              }
            },
            data: {
              quantity: { decrement: item.quantity }
            }
          })
        )
      );

      // Update customer loyalty points if applicable
      if (transactionData.customerId && transactionData.loyaltyPointsEarned) {
        await tx.loyaltyPointsTransaction.create({
          data: {
            customerId: transactionData.customerId,
            orderId: newOrder.id,
            points: transactionData.loyaltyPointsEarned,
            type: 'EARN',
            description: `Points earned from order ${receiptNumber}`,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year expiry
            tenantId
          }
        });
      }

      if (transactionData.customerId && transactionData.loyaltyPointsUsed) {
        await tx.loyaltyPointsTransaction.create({
          data: {
            customerId: transactionData.customerId,
            orderId: newOrder.id,
            points: -transactionData.loyaltyPointsUsed,
            type: 'REDEEM',
            description: `Points redeemed for order ${receiptNumber}`,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            tenantId
          }
        });
      }

      // Fetch complete order with relations
      return tx.order.findUnique({
        where: { id: newOrder.id },
        include: {
          items: {
            include: {
              product: true
            }
          },
          payments: true,
          customer: true,
          store: true
        }
      });
    });

    // Generate QR code for receipt
    const qrCode = generateZATCAQRCode({
      receiptNumber,
      grandTotal: transactionData.grandTotal,
      totalVat: vatData.totalVatAmount
    });

    // Prepare response
    const response = {
      success: true,
      transaction: {
        id: order!.id,
        receiptNumber: order!.orderNumber,
        transactionDate: order!.createdAt,
        grandTotal: Number(order!.grandTotal),
        currency: transactionData.currency,
        paymentMethod: transactionData.paymentMethod,
        qrCode: qrCode,
        vatBreakdown: vatData.vatBreakdown,
        items: order!.items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          totalPrice: Number(item.total)
        }))
      },
      receipt: {
        receiptNumber: order!.orderNumber,
        storeInfo: {
          name: order!.store.name,
          address: order!.store.address,
          phone: order!.store.phone,
          email: order!.store.email,
          vatNumber: vatData.vatNumber
        },
        transactionDate: order!.createdAt,
        cashier: transactionData.cashierId,
        customer: order!.customer ? {
          id: order!.customer.id,
          name: order!.customer.name,
          loyaltyPointsEarned: transactionData.loyaltyPointsEarned,
          loyaltyPointsUsed: transactionData.loyaltyPointsUsed
        } : null,
        items: transactionData.items,
        subtotal: transactionData.subtotal,
        totalVat: vatData.totalVatAmount,
        grandTotal: transactionData.grandTotal,
        paymentMethod: transactionData.paymentMethod,
        paymentDetails: transactionData.paymentDetails,
        vatBreakdown: vatData.vatBreakdown,
        qrCode: qrCode,
        promotions: transactionData.promotionsApplied || []
      }
    };

    return apiResponse(response, 201);

  } catch (error) {
    console.error('Transaction processing error:', error);
    return apiError(
      'Failed to process transaction: ' + (error instanceof Error ? error.message : 'Unknown error'),
      500
    );
  }
});
