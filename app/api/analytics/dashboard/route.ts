import { NextRequest, NextResponse } from 'next/server';
import { KPI, FinancialMetrics, CustomerMetrics } from '@/types/analytics';

// Mock data - replace with actual database queries
const mockKPIs: KPI[] = [
  {
    id: 'revenue',
    title: 'Total Revenue',
    value: 145230,
    change: '+12.5%',
    changeType: 'positive',
    icon: 'DollarSign',
    trend: [120000, 125000, 132000, 138000, 142000, 145230],
  },
  {
    id: 'orders',
    title: 'Total Orders',
    value: 1856,
    change: '+8.2%',
    changeType: 'positive',
    icon: 'ShoppingCart',
    trend: [1650, 1720, 1780, 1820, 1840, 1856],
  },
  {
    id: 'customers',
    title: 'Active Customers',
    value: 2341,
    change: '+23.1%',
    changeType: 'positive',
    icon: 'Users',
    trend: [1900, 2000, 2100, 2200, 2300, 2341],
  },
  {
    id: 'profit',
    title: 'Net Profit',
    value: 45230,
    change: '+15.3%',
    changeType: 'positive',
    icon: 'TrendingUp',
    trend: [38000, 39500, 41000, 42500, 44000, 45230],
  },
];

const mockFinancialMetrics: FinancialMetrics = {
  revenue: 145230,
  profit: 45230,
  profitMargin: 31.1,
  cashFlow: 52000,
  expenses: 100000,
  roi: 18.5,
};

const mockCustomerMetrics: CustomerMetrics = {
  totalCustomers: 2341,
  newCustomers: 187,
  retentionRate: 85.6,
  averageOrderValue: 78.25,
  customerLifetimeValue: 425.50,
  churnRate: 3.2,
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange');
    const stores = searchParams.get('stores')?.split(',');

    // Here you would fetch real data from your database based on filters
    // For now, returning mock data

    const dashboardData = {
      kpis: mockKPIs,
      financialMetrics: mockFinancialMetrics,
      customerMetrics: mockCustomerMetrics,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const filters = await request.json();

    // Apply filters and return filtered data
    // This is where you'd implement the actual filtering logic

    return NextResponse.json({ message: 'Filters applied successfully' });
  } catch (error) {
    console.error('Error applying filters:', error);
    return NextResponse.json(
      { error: 'Failed to apply filters' },
      { status: 500 }
    );
  }
}