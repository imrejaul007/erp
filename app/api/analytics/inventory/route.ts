import { NextRequest, NextResponse } from 'next/server';
import { InventoryHealth, AgingItem, SupplierPerformance } from '@/types/analytics';

// Mock inventory data
const mockInventoryHealth: InventoryHealth = {
  totalItems: 1245,
  totalValue: 485320,
  turnoverRate: 4.2,
  deadStock: 15,
  agingItems: [
    {
      id: 'inv_001',
      name: 'Royal Oud - 50ml',
      category: 'Premium Oud',
      daysInStock: 45,
      quantity: 25,
      value: 12500,
      status: 'good',
    },
    {
      id: 'inv_002',
      name: 'Rose Attar - 12ml',
      category: 'Floral',
      daysInStock: 120,
      quantity: 8,
      value: 2400,
      status: 'aging',
    },
    {
      id: 'inv_003',
      name: 'Vintage Musk',
      category: 'Musk',
      daysInStock: 180,
      quantity: 3,
      value: 1800,
      status: 'dead',
    },
    {
      id: 'inv_004',
      name: 'Amber Perfume - 30ml',
      category: 'Amber',
      daysInStock: 95,
      quantity: 12,
      value: 3600,
      status: 'aging',
    },
  ],
};

const mockTurnoverAnalysis = [
  { category: 'Premium Oud', turnoverRate: 6.2, averageDaysToSell: 58 },
  { category: 'Floral', turnoverRate: 4.8, averageDaysToSell: 76 },
  { category: 'Wood', turnoverRate: 3.9, averageDaysToSell: 94 },
  { category: 'Musk', turnoverRate: 3.2, averageDaysToSell: 114 },
  { category: 'Amber', turnoverRate: 2.8, averageDaysToSell: 130 },
];

const mockWastageAnalysis = [
  {
    period: '2024-01',
    totalWastage: 2.3,
    rawMaterialWaste: 1.8,
    expiredStock: 0.5,
    totalValue: 4500,
  },
  {
    period: '2024-02',
    totalWastage: 1.9,
    rawMaterialWaste: 1.4,
    expiredStock: 0.5,
    totalValue: 3800,
  },
  {
    period: '2024-03',
    totalWastage: 2.1,
    rawMaterialWaste: 1.6,
    expiredStock: 0.5,
    totalValue: 4200,
  },
  {
    period: '2024-04',
    totalWastage: 1.7,
    rawMaterialWaste: 1.2,
    expiredStock: 0.5,
    totalValue: 3400,
  },
  {
    period: '2024-05',
    totalWastage: 1.5,
    rawMaterialWaste: 1.0,
    expiredStock: 0.5,
    totalValue: 3000,
  },
  {
    period: '2024-06',
    totalWastage: 1.8,
    rawMaterialWaste: 1.3,
    expiredStock: 0.5,
    totalValue: 3600,
  },
];

const mockReorderPoints = [
  {
    productId: 'prod_001',
    productName: 'Royal Oud - 50ml',
    currentStock: 15,
    reorderPoint: 20,
    recommendedOrder: 50,
    leadTime: 14,
    status: 'reorder_needed',
  },
  {
    productId: 'prod_002',
    productName: 'Rose Attar - 12ml',
    currentStock: 5,
    reorderPoint: 10,
    recommendedOrder: 30,
    leadTime: 7,
    status: 'urgent_reorder',
  },
  {
    productId: 'prod_003',
    productName: 'Sandalwood Essence',
    currentStock: 25,
    reorderPoint: 15,
    recommendedOrder: 0,
    leadTime: 10,
    status: 'sufficient',
  },
];

const mockSupplierPerformance: SupplierPerformance[] = [
  {
    id: 'sup_001',
    name: 'Arabian Essence Co.',
    reliabilityScore: 94.5,
    qualityScore: 96.2,
    deliveryTime: 12.5,
    costEfficiency: 88.7,
    totalOrders: 45,
    onTimeDelivery: 42,
  },
  {
    id: 'sup_002',
    name: 'Premium Oud Suppliers',
    reliabilityScore: 91.2,
    qualityScore: 94.8,
    deliveryTime: 15.2,
    costEfficiency: 85.3,
    totalOrders: 38,
    onTimeDelivery: 35,
  },
  {
    id: 'sup_003',
    name: 'Rose Garden Extracts',
    reliabilityScore: 89.8,
    qualityScore: 92.1,
    deliveryTime: 18.7,
    costEfficiency: 82.9,
    totalOrders: 42,
    onTimeDelivery: 37,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const storeId = searchParams.get('storeId');

    let responseData: any = {};

    switch (type) {
      case 'health':
        responseData = {
          health: mockInventoryHealth,
          summary: {
            healthScore: 85.3,
            improvementAreas: ['Reduce aging inventory', 'Optimize reorder points'],
          },
        };
        break;

      case 'turnover':
        responseData = {
          analysis: mockTurnoverAnalysis.filter(item =>
            !category || item.category === category
          ),
          overallTurnover: 4.18,
          benchmarkTurnover: 5.0,
        };
        break;

      case 'aging':
        responseData = {
          agingItems: mockInventoryHealth.agingItems.filter(item =>
            !category || item.category === category
          ),
          summary: {
            totalAgingValue: mockInventoryHealth.agingItems
              .filter(item => item.status === 'aging')
              .reduce((sum, item) => sum + item.value, 0),
            totalDeadValue: mockInventoryHealth.agingItems
              .filter(item => item.status === 'dead')
              .reduce((sum, item) => sum + item.value, 0),
          },
        };
        break;

      case 'wastage':
        responseData = {
          wastageData: mockWastageAnalysis,
          totalWastageValue: mockWastageAnalysis.reduce((sum, item) => sum + item.totalValue, 0),
          averageWastageRate: mockWastageAnalysis.reduce((sum, item) => sum + item.totalWastage, 0) / mockWastageAnalysis.length,
        };
        break;

      case 'reorder':
        responseData = {
          reorderPoints: mockReorderPoints,
          urgentReorders: mockReorderPoints.filter(item => item.status === 'urgent_reorder'),
          recommendedOrders: mockReorderPoints.filter(item => item.status === 'reorder_needed'),
        };
        break;

      case 'suppliers':
        responseData = {
          suppliers: mockSupplierPerformance,
          topPerformer: mockSupplierPerformance[0],
          averageReliability: mockSupplierPerformance.reduce((sum, sup) => sum + sup.reliabilityScore, 0) / mockSupplierPerformance.length,
        };
        break;

      default:
        responseData = {
          health: mockInventoryHealth,
          turnover: mockTurnoverAnalysis,
          wastage: mockWastageAnalysis,
          reorderPoints: mockReorderPoints,
          suppliers: mockSupplierPerformance,
        };
    }

    return NextResponse.json({
      ...responseData,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching inventory analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory analytics' },
      { status: 500 }
    );
  }
}