# 🚀 Implementation Guide - New Features

**Target**: Build 25 pages + 30 APIs for perfume & oud industry features
**Database**: ✅ Complete (61 models live in production)
**Status**: Ready for UI implementation

---

## 📋 QUICK START

All database models are ready. To implement any module:

1. Create API route in `/app/api/[module]/route.ts`
2. Create page in `/app/[section]/[module]/page.tsx`
3. Use existing patterns from current codebase
4. Test locally, then deploy

---

## 🎯 MODULE 1: SEGREGATION MANAGEMENT

### **API Routes to Create**

#### **1. Main CRUD API**: `/app/api/segregation/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - List all segregation batches
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const batches = await prisma.segregationBatch.findMany({
      where: {
        tenantId,
        ...(status && { status }),
      },
      include: {
        rawMaterial: true,
        outputs: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ batches });
  } catch (error) {
    console.error('Error fetching batches:', error);
    return NextResponse.json({ error: 'Failed to fetch batches' }, { status: 500 });
  }
}

// POST - Create new segregation batch
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    const body = await request.json();

    const {
      rawMaterialId,
      rawQuantity,
      rawCost,
      laborCost,
      overheadCost,
      segregationDate,
      outputs,
    } = body;

    // Calculate total cost
    const totalCost = parseFloat(rawCost) + parseFloat(laborCost || 0) + parseFloat(overheadCost || 0);

    // Generate batch number
    const count = await prisma.segregationBatch.count({ where: { tenantId } });
    const batchNumber = `SEG-${String(count + 1).padStart(4, '0')}`;

    // Create batch with outputs in transaction
    const batch = await prisma.$transaction(async (tx) => {
      const newBatch = await tx.segregationBatch.create({
        data: {
          batchNumber,
          rawMaterialId,
          rawQuantity: parseFloat(rawQuantity),
          rawCost: parseFloat(rawCost),
          laborCost: parseFloat(laborCost || 0),
          overheadCost: parseFloat(overheadCost || 0),
          totalCost,
          segregationDate: new Date(segregationDate),
          status: 'IN_PROGRESS',
          tenantId,
        },
      });

      // Create outputs if provided
      if (outputs && outputs.length > 0) {
        for (const output of outputs) {
          const unitCost = totalCost * (output.yieldPercentage / 100) / output.quantity;
          const profitMargin = output.sellingPrice - unitCost;

          await tx.segregationOutput.create({
            data: {
              batchId: newBatch.id,
              gradeName: output.gradeName,
              productId: output.productId,
              quantity: parseFloat(output.quantity),
              yieldPercentage: parseFloat(output.yieldPercentage),
              unitCost,
              sellingPrice: parseFloat(output.sellingPrice),
              profitMargin,
              tenantId,
            },
          });
        }
      }

      return newBatch;
    });

    return NextResponse.json({ batch }, { status: 201 });
  } catch (error) {
    console.error('Error creating batch:', error);
    return NextResponse.json({ error: 'Failed to create batch' }, { status: 500 });
  }
}
```

#### **2. Single Batch API**: `/app/api/segregation/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get single batch
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const batch = await prisma.segregationBatch.findUnique({
      where: { id: params.id },
      include: {
        rawMaterial: true,
        outputs: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    return NextResponse.json({ batch });
  } catch (error) {
    console.error('Error fetching batch:', error);
    return NextResponse.json({ error: 'Failed to fetch batch' }, { status: 500 });
  }
}

// PATCH - Update batch
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, wastageQty, wastagePercent, wastageCost, notes } = body;

    const batch = await prisma.segregationBatch.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(wastageQty && { wastageQty: parseFloat(wastageQty) }),
        ...(wastagePercent && { wastagePercent: parseFloat(wastagePercent) }),
        ...(wastageCost && { wastageCost: parseFloat(wastageCost) }),
        ...(notes && { notes }),
      },
    });

    return NextResponse.json({ batch });
  } catch (error) {
    console.error('Error updating batch:', error);
    return NextResponse.json({ error: 'Failed to update batch' }, { status: 500 });
  }
}
```

#### **3. Stats API**: `/app/api/segregation/stats/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId;

    const [totalBatches, activeBatches, completedBatches, totalOutputs] = await Promise.all([
      prisma.segregationBatch.count({ where: { tenantId } }),
      prisma.segregationBatch.count({ where: { tenantId, status: 'IN_PROGRESS' } }),
      prisma.segregationBatch.count({ where: { tenantId, status: 'COMPLETED' } }),
      prisma.segregationOutput.count({ where: { tenantId } }),
    ]);

    const avgYield = await prisma.segregationOutput.aggregate({
      where: { tenantId },
      _avg: { yieldPercentage: true },
    });

    return NextResponse.json({
      stats: {
        totalBatches,
        activeBatches,
        completedBatches,
        totalOutputs,
        avgYield: avgYield._avg.yieldPercentage || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
```

---

### **Pages to Create**

#### **1. Dashboard**: `/app/production/segregation/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, TrendingUp, Package, CheckCircle } from 'lucide-react';

export default function SegregationDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, batchesRes] = await Promise.all([
        fetch('/api/segregation/stats'),
        fetch('/api/segregation'),
      ]);

      const statsData = await statsRes.json();
      const batchesData = await batchesRes.json();

      setStats(statsData.stats);
      setBatches(batchesData.batches);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Segregation Management</h1>
          <p className="text-gray-600">Track raw material segregation into output grades</p>
        </div>
        <Button onClick={() => router.push('/production/segregation/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Batch
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBatches}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBatches}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedBatches}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Yield</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgYield.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Batches Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Batch #</th>
                  <th className="text-left p-2">Raw Material</th>
                  <th className="text-left p-2">Quantity</th>
                  <th className="text-left p-2">Outputs</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr key={batch.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{batch.batchNumber}</td>
                    <td className="p-2">{batch.rawMaterial.name}</td>
                    <td className="p-2">{batch.rawQuantity} kg</td>
                    <td className="p-2">{batch.outputs.length} grades</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          batch.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {batch.status}
                      </span>
                    </td>
                    <td className="p-2">
                      {new Date(batch.segregationDate).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/production/segregation/${batch.id}`)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

This pattern continues for all 25 pages. The key is:
- All use the same structure
- All fetch from `/api/[module]` endpoints
- All use existing UI components
- All follow multi-tenant pattern (tenantId in session)

---

## 🎯 ALL MODULES - QUICK REFERENCE

### **Module 2: Blending Recipes** (3 pages)
- `/app/production/recipes/page.tsx` - Recipe library
- `/app/production/recipes/create/page.tsx` - Create recipe
- `/app/production/recipes/[id]/page.tsx` - Recipe details
- API: `/app/api/recipes/route.ts`

### **Module 3: Distillation** (3 pages)
- `/app/production/distillation/page.tsx` - All batches
- `/app/production/distillation/new/page.tsx` - New batch
- `/app/production/distillation/[id]/page.tsx` - Batch + logs
- API: `/app/api/distillation/route.ts`

### **Module 4: Aging** (2 pages)
- `/app/production/aging/page.tsx` - All aging batches
- `/app/production/aging/[id]/page.tsx` - Batch details
- API: `/app/api/aging/route.ts`

### **Module 5: Feedback** (2 pages)
- `/app/crm/feedback/page.tsx` - All feedback
- `/app/analytics/rejection-reasons/page.tsx` - Analytics
- API: `/app/api/feedback/route.ts`

### **Module 6: Events** (4 pages)
- `/app/events/popup-locations/page.tsx` - All events
- `/app/events/popup-locations/create/page.tsx` - New event
- `/app/events/popup-locations/[id]/page.tsx` - Event details
- `/app/events/reports/page.tsx` - ROI reports
- API: `/app/api/events/route.ts`

### **Module 7: Multi-Country** (3 pages)
- `/app/settings/countries/page.tsx` - Countries
- `/app/settings/tax-rules/page.tsx` - Tax rules
- `/app/settings/exchange-rates/page.tsx` - Exchange rates
- API: `/app/api/countries/route.ts`, `/app/api/exchange-rates/route.ts`

### **Module 8: Leaderboard** (1 page)
- `/app/hr/leaderboard/page.tsx` - Staff rankings
- API: `/app/api/leaderboard/route.ts`

---

## 🔧 UTILITY FUNCTIONS

Create `/lib/segregation-utils.ts`:

```typescript
export function calculateYieldPercentage(outputQty: number, inputQty: number): number {
  return (outputQty / inputQty) * 100;
}

export function calculateUnitCost(
  totalCost: number,
  yieldPercent: number,
  quantity: number
): number {
  return (totalCost * (yieldPercent / 100)) / quantity;
}

export function calculateProfitMargin(sellingPrice: number, unitCost: number): number {
  return sellingPrice - unitCost;
}

export function generateBatchNumber(prefix: string, count: number): string {
  return `${prefix}-${String(count + 1).padStart(4, '0')}`;
}
```

---

## 📝 TESTING CHECKLIST

For each module:
- [ ] Create all API routes
- [ ] Create all pages
- [ ] Test CRUD operations
- [ ] Test multi-tenant isolation
- [ ] Test calculations (yields, costs, etc.)
- [ ] Test navigation
- [ ] Build without errors
- [ ] Deploy to production

---

## 🚀 DEPLOYMENT

After implementing each module:

```bash
# Test locally
npm run dev

# Build
npm run build

# If successful, commit & push
git add .
git commit -m "Add [Module Name] - [pages] pages + APIs"
git push

# Render auto-deploys
```

---

## 💡 TIPS

1. **Copy existing patterns**: Look at `/app/inventory/page.tsx` for table patterns
2. **Use existing components**: All UI components in `/components/ui/`
3. **Session handling**: All API routes check `getServerSession(authOptions)`
4. **Multi-tenancy**: Always filter by `tenantId` from session
5. **Error handling**: Use try-catch in all API routes
6. **Loading states**: Use `useState` for loading in all pages

---

## 📊 PROGRESS TRACKING

**Database**: ✅ Complete (61 models)
**APIs**: ❌ 0/30 routes created
**Pages**: ❌ 0/25 pages created
**Tests**: ❌ Not started
**Deployment**: ⏳ Ready for CI/CD

---

**This guide provides everything needed to implement all 25 pages systematically.**
