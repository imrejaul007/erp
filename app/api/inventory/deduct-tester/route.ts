import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, testerStock, updateType, reference } = body;

    // In production, this would:
    // 1. Validate the request
    // 2. Check if product exists
    // 3. Check if sufficient tester stock available
    // 4. Deduct from tester stock in database
    // 5. Log the transaction
    // 6. Check for low stock alerts

    // Simulated response
    const response = {
      success: true,
      productId,
      deductedQuantity: testerStock.deduct,
      unit: testerStock.unit,
      remainingStock: 0, // Would be fetched from database
      updateType,
      reference,
      timestamp: new Date().toISOString()
    };

    // Log for demo purposes
    console.log('Tester stock deduction:', response);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error deducting tester stock:', error);
    return NextResponse.json(
      { error: 'Failed to deduct tester stock' },
      { status: 500 }
    );
  }
}
