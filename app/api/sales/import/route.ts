import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-simple';
import { parseMarketplaceFile } from '@/lib/marketplace-parsers';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = (session.user as any).tenantId;
    const userId = session.user.id;

    if (!tenantId) {
      return NextResponse.json({ error: 'No tenant context' }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const marketplace = formData.get('marketplace') as string; // 'NOON', 'AMAZON', 'GENERIC'
    const storeId = formData.get('storeId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!marketplace) {
      return NextResponse.json({ error: 'Marketplace type is required' }, { status: 400 });
    }

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
    }

    // Read file content
    const fileContent = await file.text();

    // Parse file based on marketplace
    const parsedOrders = await parseMarketplaceFile(fileContent, marketplace, {
      tenantId,
      storeId,
      userId
    });

    return NextResponse.json({
      message: 'File parsed successfully',
      data: {
        marketplace,
        ordersCount: parsedOrders.length,
        orders: parsedOrders
      }
    });

  } catch (error: any) {
    console.error('POST /api/sales/import error:', error);
    return NextResponse.json(
      { error: 'Failed to import file', details: error.message },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
