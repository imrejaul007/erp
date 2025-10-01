export interface KPI {
  id: string;
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  trend?: number[];
}

export interface SalesData {
  period: string;
  revenue: number;
  profit: number;
  orders: number;
  customers: number;
}

export interface ProductPerformance {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  profit: number;
  margin: number;
  trend: 'up' | 'down' | 'stable';
}

export interface InventoryHealth {
  totalItems: number;
  totalValue: number;
  turnoverRate: number;
  deadStock: number;
  agingItems: AgingItem[];
}

export interface AgingItem {
  id: string;
  name: string;
  category: string;
  daysInStock: number;
  quantity: number;
  value: number;
  status: 'good' | 'aging' | 'dead';
}

export interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  retentionRate: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
  churnRate: number;
}

export interface FinancialMetrics {
  revenue: number;
  profit: number;
  profitMargin: number;
  cashFlow: number;
  expenses: number;
  roi: number;
}

export interface SeasonalTrend {
  month: string;
  sales: number;
  forecast: number;
  category: string;
}

export interface PredictiveAnalytics {
  demandForecast: ForecastData[];
  stockOutPrediction: StockOutAlert[];
  seasonalRecommendations: SeasonalRecommendation[];
  priceOptimization: PriceOptimization[];
  churnPrediction: ChurnPrediction[];
}

export interface ForecastData {
  period: string;
  predicted: number;
  confidence: number;
  category: string;
}

export interface StockOutAlert {
  productId: string;
  productName: string;
  currentStock: number;
  dailyConsumption: number;
  daysRemaining: number;
  severity: 'low' | 'medium' | 'high';
}

export interface SeasonalRecommendation {
  season: string;
  category: string;
  recommendation: string;
  expectedImpact: number;
}

export interface PriceOptimization {
  productId: string;
  productName: string;
  currentPrice: number;
  suggestedPrice: number;
  expectedImpact: number;
  reasoning: string;
}

export interface ChurnPrediction {
  customerId: string;
  customerName: string;
  churnProbability: number;
  riskFactors: string[];
  recommendedActions: string[];
}

export interface SupplierPerformance {
  id: string;
  name: string;
  reliabilityScore: number;
  qualityScore: number;
  deliveryTime: number;
  costEfficiency: number;
  totalOrders: number;
  onTimeDelivery: number;
}

export interface ProductionMetrics {
  efficiency: number;
  qualityScore: number;
  wastagePercentage: number;
  yieldRate: number;
  cycleTime: number;
  defectRate: number;
}

export interface StorePerformance {
  storeId: string;
  storeName: string;
  revenue: number;
  profit: number;
  salesVolume: number;
  customerFootfall: number;
  conversionRate: number;
  averageTransactionValue: number;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  category?: string;
}

export interface DashboardFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  stores?: string[];
  categories?: string[];
  products?: string[];
  customers?: string[];
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  includeCharts: boolean;
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface AnalyticsDashboardProps {
  filters?: DashboardFilters;
  realTime?: boolean;
  refreshInterval?: number;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter' | 'heatmap' | 'gauge';
  data: any;
  options?: any;
  responsive?: boolean;
  maintainAspectRatio?: boolean;
}

export interface DrillDownData {
  level: number;
  breadcrumb: string[];
  data: any;
  canDrillDown: boolean;
}