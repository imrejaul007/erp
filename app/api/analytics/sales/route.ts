import { NextRequest, NextResponse } from 'next/server';
import { SalesData, ProductPerformance, SeasonalTrend, StorePerformance } from '@/types/analytics';

// Mock sales data
const mockSalesData: SalesData[] = [
  { period: '2024-01', revenue: 98500, profit: 29550, orders: 145, customers: 89 },
  { period: '2024-02', revenue: 105200, profit: 31560, orders: 156, customers: 95 },
  { period: '2024-03', revenue: 118750, profit: 35625, orders: 178, customers: 108 },
  { period: '2024-04', revenue: 125300, profit: 37590, orders: 189, customers: 115 },
  { period: '2024-05', revenue: 132800, profit: 39840, orders: 198, customers: 122 },
  { period: '2024-06', revenue: 145230, profit: 43569, orders: 215, customers: 135 },
];

const mockProductPerformance: ProductPerformance[] = [
  {
    id: 'prod_001',
    name: 'Royal Oud Collection',
    category: 'Premium Oud',
    sales: 2450,
    revenue: 147000,
    profit: 44100,
    margin: 30,
    trend: 'up',
  },
  {
    id: 'prod_002',
    name: 'Rose & Amber Perfume',
    category: 'Floral',
    sales: 1850,
    revenue: 92500,
    profit: 25900,
    margin: 28,
    trend: 'up',
  },
  {
    id: 'prod_003',
    name: 'Sandalwood Essence',
    category: 'Wood',
    sales: 1200,
    revenue: 72000,
    profit: 18000,
    margin: 25,
    trend: 'stable',
  },
  {
    id: 'prod_004',
    name: 'Jasmine Night Fragrance',
    category: 'Floral',
    sales: 980,
    revenue: 58800,
    profit: 14700,
    margin: 25,
    trend: 'down',
  },
  {
    id: 'prod_005',
    name: 'Musk Al-Mahal',
    category: 'Musk',
    sales: 1450,
    revenue: 87000,
    profit: 21750,
    margin: 25,
    trend: 'up',
  },
];

const mockSeasonalTrends: SeasonalTrend[] = [
  { month: 'Jan', sales: 98500, forecast: 102000, category: 'Overall' },
  { month: 'Feb', sales: 105200, forecast: 108000, category: 'Overall' },
  { month: 'Mar', sales: 118750, forecast: 115000, category: 'Overall' },
  { month: 'Apr', sales: 125300, forecast: 128000, category: 'Overall' },
  { month: 'May', sales: 132800, forecast: 135000, category: 'Overall' },
  { month: 'Jun', sales: 145230, forecast: 142000, category: 'Overall' },
  { month: 'Jul', sales: 0, forecast: 155000, category: 'Overall' },
  { month: 'Aug', sales: 0, forecast: 162000, category: 'Overall' },
  { month: 'Sep', sales: 0, forecast: 158000, category: 'Overall' },
  { month: 'Oct', sales: 0, forecast: 148000, category: 'Overall' },
  { month: 'Nov', sales: 0, forecast: 168000, category: 'Overall' },
  { month: 'Dec', sales: 0, forecast: 185000, category: 'Overall' },
];

const mockStorePerformance: StorePerformance[] = [
  {
    storeId: 'store_001',
    storeName: 'Dubai Mall Branch',
    revenue: 58500,
    profit: 17550,
    salesVolume: 850,
    customerFootfall: 1250,
    conversionRate: 68,
    averageTransactionValue: 68.82,
  },
  {
    storeId: 'store_002',
    storeName: 'Abu Dhabi Branch',
    revenue: 42300,
    profit: 12690,
    salesVolume: 620,
    customerFootfall: 950,
    conversionRate: 65.3,
    averageTransactionValue: 68.23,
  },
  {
    storeId: 'store_003',
    storeName: 'Sharjah Branch',
    revenue: 35800,
    profit: 10740,
    salesVolume: 485,
    customerFootfall: 720,
    conversionRate: 67.4,
    averageTransactionValue: 73.81,
  },
  {
    storeId: 'store_004',
    storeName: 'Online Store',
    revenue: 8630,
    profit: 2589,
    salesVolume: 125,
    customerFootfall: 1500,
    conversionRate: 8.3,
    averageTransactionValue: 69.04,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const dateRange = searchParams.get('dateRange');
    const storeId = searchParams.get('storeId');
    const category = searchParams.get('category');

    let responseData: any = {};

    switch (type) {
      case 'overview':
        responseData = {
          salesData: mockSalesData,
          totalRevenue: mockSalesData.reduce((sum, data) => sum + data.revenue, 0),
          totalOrders: mockSalesData.reduce((sum, data) => sum + data.orders, 0),
          averageOrderValue: mockSalesData.reduce((sum, data) => sum + data.revenue, 0) /
                            mockSalesData.reduce((sum, data) => sum + data.orders, 0),
        };
        break;

      case 'products':
        responseData = {
          products: mockProductPerformance.filter(product =>
            !category || product.category === category
          ),
          topPerformers: mockProductPerformance
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5),
        };
        break;

      case 'seasonal':
        responseData = {
          trends: mockSeasonalTrends,
          peakSeason: 'December',
          lowestSeason: 'January',
        };
        break;

      case 'stores':
        responseData = {
          stores: mockStorePerformance.filter(store =>
            !storeId || store.storeId === storeId
          ),
          topPerformingStore: mockStorePerformance[0],
        };
        break;

      case 'staff':
        // Mock staff performance data
        responseData = {
          staffPerformance: [
            { id: 'staff_001', name: 'Ahmad Hassan', sales: 45200, orders: 152, conversion: 72.5 },
            { id: 'staff_002', name: 'Fatima Ali', sales: 38900, orders: 134, conversion: 68.2 },
            { id: 'staff_003', name: 'Mohamed Omar', sales: 35600, orders: 128, conversion: 65.8 },
          ],
        };
        break;

      default:
        responseData = {
          salesData: mockSalesData,
          products: mockProductPerformance,
          trends: mockSeasonalTrends,
          stores: mockStorePerformance,
        };
    }

    return NextResponse.json({
      ...responseData,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales analytics' },
      { status: 500 }
    );
  }
}