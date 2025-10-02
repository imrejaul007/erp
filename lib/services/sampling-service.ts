/**
 * Sampling Service
 * Handles sampling session creation and inventory integration with real backend APIs
 */

export interface TestedProduct {
  productId: string;
  productName: string;
  productCode: string;
  productType: string;
  quantityUsed: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
}

export interface SamplingSession {
  id?: string;
  customer: {
    id?: string;
    anonymous: boolean;
    name?: string;
    phone?: string;
    email?: string;
    type?: string;
  };
  testedProducts: TestedProduct[];
  totalTesterCost?: number;
  outcome: 'purchased' | 'not_purchased';
  saleAmount?: number;
  notPurchaseReason?: string;
  notes?: string;
  storeId: string;
  staffId: string;
  timestamp?: string;
}

export interface TesterRefill {
  productId: string;
  quantity: number;
  unit: string;
  sourceType: 'main_inventory' | 'purchase';
  costPerUnit?: number;
  refillBy: string;
  notes?: string;
}

/**
 * Create a new sampling session
 */
export async function createSamplingSession(sessionData: SamplingSession): Promise<any> {
  try {
    const response = await fetch('/api/sampling/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to create sampling session');
    }

    const result = await response.json();
    return result.session;
  } catch (error) {
    console.error('Error creating sampling session:', error);
    throw error;
  }
}

/**
 * Get sampling sessions with filters
 */
export async function getSamplingSessions(filters?: {
  startDate?: string;
  endDate?: string;
  status?: string;
  storeId?: string;
  staffId?: string;
}): Promise<any[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.storeId) params.append('storeId', filters.storeId);
    if (filters?.staffId) params.append('staffId', filters.staffId);

    const response = await fetch(`/api/sampling/sessions?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch sampling sessions');
    }

    const result = await response.json();
    return result.sessions;
  } catch (error) {
    console.error('Error fetching sampling sessions:', error);
    throw error;
  }
}

/**
 * Get analytics data
 */
export async function getAnalytics(filters?: {
  startDate?: string;
  endDate?: string;
  storeId?: string;
}): Promise<any> {
  try {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.storeId) params.append('storeId', filters.storeId);

    const response = await fetch(`/api/sampling/analytics?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
}

/**
 * Get tester stock
 */
export async function getTesterStock(filters?: {
  productId?: string;
  lowStockOnly?: boolean;
}): Promise<any> {
  try {
    const params = new URLSearchParams();
    if (filters?.productId) params.append('productId', filters.productId);
    if (filters?.lowStockOnly) params.append('lowStockOnly', 'true');

    const response = await fetch(`/api/inventory/tester-stock?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch tester stock');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tester stock:', error);
    throw error;
  }
}

/**
 * Refill tester stock
 */
export async function refillTesterStock(refill: TesterRefill): Promise<any> {
  try {
    const response = await fetch('/api/inventory/refill-tester', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(refill)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to refill tester stock');
    }

    return await response.json();
  } catch (error) {
    console.error('Error refilling tester stock:', error);
    throw error;
  }
}

/**
 * Update tester stock minimum level
 */
export async function updateTesterStockMinLevel(productId: string, minLevel: number): Promise<any> {
  try {
    const response = await fetch('/api/inventory/tester-stock', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, minLevel })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to update minimum level');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating tester stock minimum level:', error);
    throw error;
  }
}

/**
 * Get tester consumption report
 */
export async function getTesterConsumptionReport(
  startDate: string,
  endDate: string
): Promise<{
  totalSessions: number;
  totalTesterCost: number;
  totalRevenue: number;
  conversionRate: number;
  roi: number;
  productBreakdown: Array<{
    productId: string;
    productName: string;
    quantityUsed: number;
    cost: number;
    conversions: number;
  }>;
}> {
  const analytics = await getAnalytics({ startDate, endDate });

  return {
    totalSessions: analytics.overview.totalSessions,
    totalTesterCost: analytics.overview.totalTesterCost,
    totalRevenue: analytics.overview.totalRevenue,
    conversionRate: analytics.overview.conversionRate,
    roi: analytics.overview.roi,
    productBreakdown: analytics.productPopularity.map((p: any) => ({
      productId: p.productId,
      productName: p.productName,
      quantityUsed: p.totalQuantityUsed,
      cost: p.totalCost,
      conversions: p.conversions
    }))
  };
}

/**
 * Get lost sale analysis
 */
export async function getLostSaleAnalysis(
  startDate: string,
  endDate: string
): Promise<Array<{
  reason: string;
  count: number;
  percentage: number;
}>> {
  const analytics = await getAnalytics({ startDate, endDate });

  const total = Object.values(analytics.lostSaleReasons).reduce((sum: number, count: any) => sum + count, 0) as number;

  return Object.entries(analytics.lostSaleReasons).map(([reason, count]) => ({
    reason,
    count: count as number,
    percentage: total > 0 ? ((count as number) / total) * 100 : 0
  })).sort((a, b) => b.count - a.count);
}

/**
 * Get staff conversion performance
 */
export async function getStaffPerformance(
  startDate: string,
  endDate: string
): Promise<Array<{
  staffName: string;
  totalSessions: number;
  conversions: number;
  conversionRate: number;
  totalRevenue: number;
  avgSaleAmount: number;
}>> {
  const analytics = await getAnalytics({ startDate, endDate });

  return analytics.staffPerformance.map((staff: any) => ({
    staffName: staff.staffName,
    totalSessions: staff.totalSessions,
    conversions: staff.purchased,
    conversionRate: staff.conversionRate,
    totalRevenue: staff.totalRevenue,
    avgSaleAmount: staff.purchased > 0 ? staff.totalRevenue / staff.purchased : 0
  }));
}
