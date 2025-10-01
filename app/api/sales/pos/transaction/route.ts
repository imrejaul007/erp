import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

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
  receiptNumber?: string;
  transactionDate?: Date;
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

// Generate QR Code data for UAE ZATCA compliance
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

// Generate receipt number
function generateReceiptNumber(storeId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${storeId}-${timestamp}-${random}`;
}

// Update inventory after successful transaction
async function updateInventory(items: TransactionItem[]): Promise<void> {
  // In a real implementation, this would update the inventory database
  for (const item of items) {
    try {
      // Mock inventory update - in real implementation, call inventory API
      console.log(`Updating inventory for ${item.sku}: -${item.quantity}`);

      // await fetch('/api/inventory/update', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     sku: item.sku,
      //     quantity: -item.quantity,
      //     operation: 'sale',
      //     reference: transaction.receiptNumber
      //   })
      // });
    } catch (error) {
      console.error(`Failed to update inventory for ${item.sku}:`, error);
    }
  }
}

// Update customer loyalty points
async function updateCustomerLoyalty(customerId: string, pointsEarned: number, pointsUsed: number, totalSpent: number): Promise<void> {
  try {
    // Mock loyalty update - in real implementation, call loyalty API
    console.log(`Updating loyalty for customer ${customerId}: +${pointsEarned} points, -${pointsUsed} points, +${totalSpent} spent`);

    // await fetch('/api/crm/loyalty/update', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     customerId,
    //     pointsEarned,
    //     pointsUsed,
    //     totalSpent,
    //     transactionDate: new Date()
    //   })
    // });
  } catch (error) {
    console.error(`Failed to update customer loyalty:`, error);
  }
}

// Validate transaction data
function validateTransaction(data: TransactionData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!data.storeId) errors.push('Store ID is required');
  if (!data.cashierId) errors.push('Cashier ID is required');
  if (!data.items || data.items.length === 0) errors.push('At least one item is required');
  if (!data.paymentMethod) errors.push('Payment method is required');
  if (data.grandTotal <= 0) errors.push('Grand total must be greater than 0');

  // Validate items
  data.items?.forEach((item, index) => {
    if (!item.sku) errors.push(`Item ${index + 1}: SKU is required`);
    if (!item.name) errors.push(`Item ${index + 1}: Name is required`);
    if (item.quantity <= 0) errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
    if (item.unitPrice < 0) errors.push(`Item ${index + 1}: Unit price cannot be negative`);
  });

  // Validate payment details based on method
  const paymentDetails = data.paymentDetails;
  switch (data.paymentMethod) {
    case 'cash':
      if (!paymentDetails.amountReceived || paymentDetails.amountReceived < data.grandTotal) {
        errors.push('Cash payment: Amount received must be at least the grand total');
      }
      break;
    case 'card':
      if (!paymentDetails.lastFourDigits) {
        errors.push('Card payment: Last four digits are required');
      }
      break;
    case 'loyalty_points':
      if (!paymentDetails.pointsUsed || paymentDetails.pointsUsed <= 0) {
        errors.push('Loyalty payment: Points used must be greater than 0');
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export async function POST(request: NextRequest) {
  try {
    const transactionData: TransactionData = await request.json();

    // Validate transaction data
    const validation = validateTransaction(transactionData);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Generate receipt number and transaction ID
    const receiptNumber = generateReceiptNumber(transactionData.storeId);
    const transactionId = uuidv4();
    const transactionDate = new Date();

    // Calculate UAE VAT compliance data
    const vatData = calculateUAEVAT(transactionData.items);

    // Create the complete transaction object
    const transaction = {
      id: transactionId,
      receiptNumber,
      storeId: transactionData.storeId,
      cashierId: transactionData.cashierId,
      customerId: transactionData.customerId,
      items: transactionData.items,
      subtotal: transactionData.subtotal,
      totalVat: vatData.totalVatAmount,
      grandTotal: transactionData.grandTotal,
      currency: transactionData.currency || 'AED',
      paymentMethod: transactionData.paymentMethod,
      paymentDetails: transactionData.paymentDetails,
      promotionsApplied: transactionData.promotionsApplied || [],
      loyaltyPointsUsed: transactionData.loyaltyPointsUsed || 0,
      loyaltyPointsEarned: transactionData.loyaltyPointsEarned || 0,
      notes: transactionData.notes,
      transactionDate,
      vatBreakdown: vatData.vatBreakdown,
      vatNumber: vatData.vatNumber,
      qrCode: '',
      status: 'completed',
      channel: 'pos',
      metadata: {
        userAgent: request.headers.get('user-agent'),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        deviceInfo: {
          type: 'pos_terminal',
          timestamp: transactionDate.toISOString()
        }
      }
    };

    // Generate ZATCA compliant QR code
    transaction.qrCode = generateZATCAQRCode(transaction);

    // Save transaction to database (mock implementation)
    // In a real application, this would save to your database
    console.log('Saving transaction to database:', transaction);

    // Update inventory
    await updateInventory(transactionData.items);

    // Update customer loyalty if applicable
    if (transactionData.customerId && (transactionData.loyaltyPointsEarned || transactionData.loyaltyPointsUsed)) {
      await updateCustomerLoyalty(
        transactionData.customerId,
        transactionData.loyaltyPointsEarned || 0,
        transactionData.loyaltyPointsUsed || 0,
        transactionData.grandTotal
      );
    }

    // Prepare response
    const response = {
      success: true,
      transaction: {
        id: transaction.id,
        receiptNumber: transaction.receiptNumber,
        transactionDate: transaction.transactionDate,
        grandTotal: transaction.grandTotal,
        currency: transaction.currency,
        paymentMethod: transaction.paymentMethod,
        qrCode: transaction.qrCode,
        vatBreakdown: transaction.vatBreakdown,
        items: transaction.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice
        }))
      },
      receipt: {
        receiptNumber: transaction.receiptNumber,
        storeInfo: {
          name: 'Oud Premium Store',
          address: 'Dubai Mall, Ground Floor',
          phone: '+971 4 123 4567',
          email: 'info@oudpremium.ae',
          vatNumber: vatData.vatNumber
        },
        transactionDate: transaction.transactionDate,
        cashier: transaction.cashierId,
        customer: transactionData.customerId ? {
          id: transactionData.customerId,
          loyaltyPointsEarned: transaction.loyaltyPointsEarned,
          loyaltyPointsUsed: transaction.loyaltyPointsUsed
        } : null,
        items: transaction.items,
        subtotal: transaction.subtotal,
        totalVat: transaction.totalVat,
        grandTotal: transaction.grandTotal,
        paymentMethod: transaction.paymentMethod,
        paymentDetails: transaction.paymentDetails,
        vatBreakdown: transaction.vatBreakdown,
        qrCode: transaction.qrCode,
        promotions: transaction.promotionsApplied
      }
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Transaction processing error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process transaction',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for retrieving transaction history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    const cashierId = searchParams.get('cashierId');
    const date = searchParams.get('date');
    const receiptNumber = searchParams.get('receiptNumber');
    const customerId = searchParams.get('customerId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Mock transaction history - in real implementation, query database
    const mockTransactions = [
      {
        id: '1',
        receiptNumber: `${storeId}-${Date.now()}-ABCD`,
        transactionDate: new Date(),
        customerId: 'cust_001',
        cashierId: cashierId || 'cashier_001',
        grandTotal: 750.50,
        currency: 'AED',
        paymentMethod: 'card',
        status: 'completed',
        itemCount: 3
      }
    ];

    // Apply filters (mock implementation)
    let filteredTransactions = mockTransactions;

    if (receiptNumber) {
      filteredTransactions = filteredTransactions.filter(t =>
        t.receiptNumber.toLowerCase().includes(receiptNumber.toLowerCase())
      );
    }

    if (customerId) {
      filteredTransactions = filteredTransactions.filter(t => t.customerId === customerId);
    }

    if (date) {
      const filterDate = new Date(date);
      filteredTransactions = filteredTransactions.filter(t =>
        t.transactionDate.toDateString() === filterDate.toDateString()
      );
    }

    // Pagination
    const total = filteredTransactions.length;
    const transactions = filteredTransactions.slice(offset, offset + limit);

    return NextResponse.json({
      transactions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error retrieving transactions:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve transactions' },
      { status: 500 }
    );
  }
}