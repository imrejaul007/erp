'use client';

import { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Filter,
  DollarSign,
  Package,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Building,
  FileSpreadsheet,
  FileImage,
  Activity,
  BarChart3,
  LineChart,
  Truck,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-picker';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
  }).format(amount);
};

const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-AE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function StockMovementReportsPage() {
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to?: Date | undefined}>({
    from: undefined,
    to: undefined,
  });
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedMovementType, setSelectedMovementType] = useState('all');

  // Mock data for stock movement analytics
  const movementOverview = {
    totalTransactions: 2847,
    totalValueIn: 1850000.00,
    totalValueOut: 1425000.00,
    netMovement: 425000.00,
    averageTransactionValue: 1156.80,
    inboundTransactions: 1285,
    outboundTransactions: 1562,
    transferTransactions: 185
  };

  const movementsByType = [
    {
      type: 'Sales',
      transactions: 1247,
      value: 962500.00,
      percentage: 42.5,
      trend: 'up',
      growth: 15.8,
      icon: ShoppingCart
    },
    {
      type: 'Purchase Receipts',
      transactions: 485,
      value: 1235000.00,
      percentage: 20.5,
      trend: 'up',
      growth: 8.7,
      icon: Truck
    },
    {
      type: 'Inter-location Transfer',
      transactions: 315,
      value: 187500.00,
      percentage: 13.2,
      trend: 'down',
      growth: -3.2,
      icon: RefreshCw
    },
    {
      type: 'Returns',
      transactions: 178,
      value: 89000.00,
      percentage: 7.5,
      trend: 'up',
      growth: 22.1,
      icon: ArrowDown
    },
    {
      type: 'Adjustments',
      transactions: 125,
      value: 62500.00,
      percentage: 5.2,
      trend: 'down',
      growth: -8.4,
      icon: RefreshCw
    },
    {
      type: 'Production Output',
      transactions: 497,
      value: 615000.00,
      percentage: 21.1,
      trend: 'up',
      growth: 18.9,
      icon: Package
    }
  ];

  const recentTransactions = [
    {
      id: 'TXN-2024-10-0847',
      date: '2024-10-01T14:30:00',
      type: 'Sale',
      product: 'Royal Oud Premium 50ml',
      quantity: -15,
      unitValue: 450.00,
      totalValue: -6750.00,
      location: 'Dubai Mall',
      reference: 'INV-2024-5892',
      status: 'completed'
    },
    {
      id: 'TXN-2024-10-0846',
      date: '2024-10-01T13:45:00',
      type: 'Purchase Receipt',
      product: 'Amber Essence Deluxe 30ml',
      quantity: 50,
      unitValue: 180.00,
      totalValue: 9000.00,
      location: 'Warehouse',
      reference: 'PO-2024-1247',
      status: 'completed'
    },
    {
      id: 'TXN-2024-10-0845',
      date: '2024-10-01T12:20:00',
      type: 'Transfer Out',
      product: 'Rose Garden Collection Set',
      quantity: -25,
      unitValue: 320.00,
      totalValue: -8000.00,
      location: 'Warehouse',
      reference: 'TRF-2024-0589',
      status: 'in-transit'
    },
    {
      id: 'TXN-2024-10-0844',
      date: '2024-10-01T11:15:00',
      type: 'Production',
      product: 'Sandalwood Serenity 25ml',
      quantity: 100,
      unitValue: 95.00,
      totalValue: 9500.00,
      location: 'Production Facility',
      reference: 'PROD-2024-0847',
      status: 'completed'
    },
    {
      id: 'TXN-2024-10-0843',
      date: '2024-10-01T10:30:00',
      type: 'Adjustment',
      product: 'Musk Al-Haramain 100ml',
      quantity: -5,
      unitValue: 225.00,
      totalValue: -1125.00,
      location: 'City Walk',
      reference: 'ADJ-2024-0152',
      status: 'completed'
    }
  ];

  const locationMovements = [
    {
      location: 'Dubai Mall',
      inbound: { transactions: 485, value: 487500 },
      outbound: { transactions: 625, value: 562500 },
      net: { transactions: -140, value: -75000 },
      turnover: 4.8
    },
    {
      location: 'Mall of Emirates',
      inbound: { transactions: 365, value: 365000 },
      outbound: { transactions: 470, value: 423000 },
      net: { transactions: -105, value: -58000 },
      turnover: 4.2
    },
    {
      location: 'City Walk',
      inbound: { transactions: 245, value: 245000 },
      outbound: { transactions: 312, value: 280800 },
      net: { transactions: -67, value: -35800 },
      turnover: 3.9
    },
    {
      location: 'Warehouse',
      inbound: { transactions: 890, value: 1245000 },
      outbound: { transactions: 155, value: 158700 },
      net: { transactions: 735, value: 1086300 },
      turnover: 2.1
    }
  ];

  const valuationImpact = [
    {
      period: 'Oct 1-7',
      openingValue: 2850000,
      inbound: 387500,
      outbound: -425000,
      adjustments: -12500,
      closingValue: 2800000,
      variance: -50000
    },
    {
      period: 'Sep 24-30',
      openingValue: 2875000,
      inbound: 425000,
      outbound: -437500,
      adjustments: -12500,
      closingValue: 2850000,
      variance: -25000
    },
    {
      period: 'Sep 17-23',
      openingValue: 2825000,
      inbound: 462500,
      outbound: -400000,
      adjustments: -12500,
      closingValue: 2875000,
      variance: 50000
    },
    {
      period: 'Sep 10-16',
      openingValue: 2790000,
      inbound: 375000,
      outbound: -325000,
      adjustments: -15000,
      closingValue: 2825000,
      variance: 35000
    }
  ];

  const movementAnalytics = useMemo(() => {
    const totalIn = movementOverview.totalValueIn;
    const totalOut = movementOverview.totalValueOut;
    const netFlow = totalIn - totalOut;
    const velocityRatio = totalOut / totalIn;

    return {
      netFlow,
      velocityRatio,
      inboundRate: (movementOverview.inboundTransactions / movementOverview.totalTransactions) * 100,
      outboundRate: (movementOverview.outboundTransactions / movementOverview.totalTransactions) * 100,
      transferRate: (movementOverview.transferTransactions / movementOverview.totalTransactions) * 100
    };
  }, [movementOverview]);

  const getMovementIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'sale': return ShoppingCart;
      case 'purchase receipt': return Truck;
      case 'transfer out':
      case 'transfer in': return RefreshCw;
      case 'production': return Package;
      case 'adjustment': return RefreshCw;
      case 'return': return ArrowDown;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in-transit': return 'text-yellow-600 bg-yellow-50';
      case 'pending': return 'text-blue-600 bg-blue-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    alert(`Exporting stock movement report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <ArrowUpDown className="h-8 w-8 text-oud-600" />
            Stock Movement & Valuation Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Track inventory movements, transfers, and valuation changes across all locations
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[160px]">
              <Building className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="dubai-mall">Dubai Mall</SelectItem>
              <SelectItem value="mall-emirates">Mall of Emirates</SelectItem>
              <SelectItem value="city-walk">City Walk</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedMovementType} onValueChange={setSelectedMovementType}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="purchases">Purchases</SelectItem>
              <SelectItem value="transfers">Transfers</SelectItem>
              <SelectItem value="adjustments">Adjustments</SelectItem>
              <SelectItem value="production">Production</SelectItem>
            </SelectContent>
          </Select>

          <DateRangePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
            placeholder="Select period"
          />

          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportReport('pdf')}
              className="gap-1"
            >
              <FileImage className="h-4 w-4" />
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportReport('excel')}
              className="gap-1"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Key Movement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inbound Value</CardTitle>
            <ArrowUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(movementOverview.totalValueIn)}
            </div>
            <p className="text-xs text-muted-foreground">
              {movementOverview.inboundTransactions.toLocaleString()} transactions
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              {movementAnalytics.inboundRate.toFixed(1)}% of total movements
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outbound Value</CardTitle>
            <ArrowDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(movementOverview.totalValueOut)}
            </div>
            <p className="text-xs text-muted-foreground">
              {movementOverview.outboundTransactions.toLocaleString()} transactions
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              {movementAnalytics.outboundRate.toFixed(1)}% of total movements
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Movement</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${movementOverview.netMovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(Math.abs(movementOverview.netMovement))}
            </div>
            <p className="text-xs text-muted-foreground">
              Net {movementOverview.netMovement >= 0 ? 'increase' : 'decrease'}
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              Velocity: {(movementAnalytics.velocityRatio * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-oud-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transaction Value</CardTitle>
            <DollarSign className="h-4 w-4 text-oud-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oud-600">
              {formatCurrency(movementOverview.averageTransactionValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {movementOverview.totalTransactions.toLocaleString()} total transactions
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              {movementOverview.transferTransactions} inter-location transfers
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Movement Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="types">Movement Types</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="valuation">Valuation Impact</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Movement Flow Summary</CardTitle>
                <CardDescription>
                  Overview of inventory movement patterns and flow direction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                      <ArrowUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(movementOverview.totalValueIn)}
                      </div>
                      <p className="text-sm text-muted-foreground">Inbound Value</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-red-50 to-red-100">
                      <ArrowDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-red-600">
                        {formatCurrency(movementOverview.totalValueOut)}
                      </div>
                      <p className="text-sm text-muted-foreground">Outbound Value</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Inbound Transactions</span>
                      <span className="text-oud-600 font-bold">{movementOverview.inboundTransactions}</span>
                    </div>
                    <Progress value={movementAnalytics.inboundRate} className="w-full" />

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Outbound Transactions</span>
                      <span className="text-oud-600 font-bold">{movementOverview.outboundTransactions}</span>
                    </div>
                    <Progress value={movementAnalytics.outboundRate} className="w-full" />

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Transfer Transactions</span>
                      <span className="text-oud-600 font-bold">{movementOverview.transferTransactions}</span>
                    </div>
                    <Progress value={movementAnalytics.transferRate} className="w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Movement Velocity</CardTitle>
                <CardDescription>
                  Stock movement speed and inventory turnover metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-oud-50 to-amber-50 rounded-lg">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-oud-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">Movement velocity chart</p>
                    <p className="text-sm text-muted-foreground">(Interactive chart will be displayed here)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Movement Insight:</strong> Current stock velocity is {(movementAnalytics.velocityRatio * 100).toFixed(1)}%,
              indicating {movementAnalytics.velocityRatio > 0.8 ? 'healthy' : 'slow'} inventory turnover.
              Net movement of {formatCurrency(Math.abs(movementOverview.netMovement))} shows
              {movementOverview.netMovement >= 0 ? 'inventory buildup' : 'inventory depletion'}.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Movement Types Analysis</CardTitle>
              <CardDescription>
                Breakdown of stock movements by transaction type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {movementsByType.map((movement) => {
                  const IconComponent = movement.icon;
                  return (
                    <Card key={movement.type} className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-oud-100 rounded-full flex items-center justify-center">
                            <IconComponent className="h-5 w-5 text-oud-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{movement.type}</h3>
                            <p className="text-sm text-muted-foreground">{movement.transactions} transactions</p>
                          </div>
                        </div>
                        {movement.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Value</span>
                          <span className="font-bold text-oud-600">{formatCurrency(movement.value)}</span>
                        </div>
                        <Progress value={movement.percentage} className="w-full" />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{movement.percentage}% of total</span>
                          <Badge variant={movement.growth >= 0 ? "default" : "destructive"}>
                            {formatPercentage(movement.growth)}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Location Movement Analysis</CardTitle>
              <CardDescription>
                Stock movement performance across all locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location</TableHead>
                      <TableHead>Inbound</TableHead>
                      <TableHead>Outbound</TableHead>
                      <TableHead>Net Movement</TableHead>
                      <TableHead>Turnover Rate</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locationMovements.map((location) => (
                      <TableRow key={location.location}>
                        <TableCell className="font-medium">{location.location}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-bold text-green-600">{formatCurrency(location.inbound.value)}</div>
                            <div className="text-sm text-muted-foreground">{location.inbound.transactions} txn</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-bold text-red-600">{formatCurrency(location.outbound.value)}</div>
                            <div className="text-sm text-muted-foreground">{location.outbound.transactions} txn</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className={`font-bold ${location.net.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(Math.abs(location.net.value))}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {location.net.transactions >= 0 ? '+' : ''}{location.net.transactions} txn
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{location.turnover}x</span>
                            <Progress value={(location.turnover / 5) * 100} className="w-16 h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={location.turnover >= 4 ? "default" : "secondary"}>
                            {location.turnover >= 4 ? 'Active' : 'Moderate'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Movements</CardTitle>
              <CardDescription>
                Latest inventory transactions across all locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Value</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => {
                      const IconComponent = getMovementIcon(transaction.type);
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{formatDate(transaction.date)}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(transaction.date).toLocaleTimeString('en-AE', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4 text-muted-foreground" />
                              <span>{transaction.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{transaction.product}</TableCell>
                          <TableCell>
                            <div className={`font-bold ${transaction.quantity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.quantity >= 0 ? '+' : ''}{transaction.quantity}
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(transaction.unitValue)}</TableCell>
                          <TableCell>
                            <div className={`font-bold ${transaction.totalValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(Math.abs(transaction.totalValue))}
                            </div>
                          </TableCell>
                          <TableCell>{transaction.location}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="valuation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Valuation Impact Analysis</CardTitle>
              <CardDescription>
                How stock movements affect inventory valuation over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Opening Value</TableHead>
                      <TableHead>Inbound Value</TableHead>
                      <TableHead>Outbound Value</TableHead>
                      <TableHead>Adjustments</TableHead>
                      <TableHead>Closing Value</TableHead>
                      <TableHead>Net Variance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {valuationImpact.map((period) => (
                      <TableRow key={period.period}>
                        <TableCell className="font-medium">{period.period}</TableCell>
                        <TableCell className="font-bold">{formatCurrency(period.openingValue)}</TableCell>
                        <TableCell className="text-green-600 font-bold">
                          +{formatCurrency(period.inbound)}
                        </TableCell>
                        <TableCell className="text-red-600 font-bold">
                          {formatCurrency(period.outbound)}
                        </TableCell>
                        <TableCell className="text-orange-600 font-bold">
                          {formatCurrency(period.adjustments)}
                        </TableCell>
                        <TableCell className="font-bold text-oud-600">
                          {formatCurrency(period.closingValue)}
                        </TableCell>
                        <TableCell>
                          <div className={`font-bold ${period.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(Math.abs(period.variance))}
                          </div>
                          <Badge variant={period.variance >= 0 ? "default" : "destructive"}>
                            {formatPercentage((period.variance / period.openingValue) * 100)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 border-2 border-green-200 bg-green-50">
                  <div className="text-center">
                    <ArrowUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-green-600">
                      {formatCurrency(1460000)}
                    </div>
                    <p className="text-sm font-medium">Total Inbound Impact</p>
                    <p className="text-xs text-muted-foreground">Last 4 periods</p>
                  </div>
                </Card>

                <Card className="p-4 border-2 border-red-200 bg-red-50">
                  <div className="text-center">
                    <ArrowDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-red-600">
                      {formatCurrency(1587500)}
                    </div>
                    <p className="text-sm font-medium">Total Outbound Impact</p>
                    <p className="text-xs text-muted-foreground">Last 4 periods</p>
                  </div>
                </Card>

                <Card className="p-4 border-2 border-oud-200 bg-oud-50">
                  <div className="text-center">
                    <Activity className="h-8 w-8 text-oud-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-oud-600">
                      {formatCurrency(127500)}
                    </div>
                    <p className="text-sm font-medium">Net Valuation Change</p>
                    <p className="text-xs text-muted-foreground">Cumulative impact</p>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Movement Trends Analysis</CardTitle>
              <CardDescription>
                Historical trends and patterns in stock movements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-gradient-to-br from-oud-50 to-amber-50 rounded-lg mb-6">
                <div className="text-center">
                  <LineChart className="h-12 w-12 text-oud-600 mx-auto mb-2" />
                  <p className="text-muted-foreground">Stock movement trends chart</p>
                  <p className="text-sm text-muted-foreground">(Interactive trend analysis will be displayed here)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Key Trends Identified</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Sales movements increased 15.8% this period</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Production output up 18.9% year-over-year</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Inter-location transfers down 3.2%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Average transaction processing time: 2.4 hours</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Movement Velocity by Category</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Oud Products</span>
                      <div className="flex items-center gap-2">
                        <Progress value={85} className="w-16 h-2" />
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Amber Products</span>
                      <div className="flex items-center gap-2">
                        <Progress value={72} className="w-16 h-2" />
                        <span className="text-sm font-medium">72%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Rose Products</span>
                      <div className="flex items-center gap-2">
                        <Progress value={68} className="w-16 h-2" />
                        <span className="text-sm font-medium">68%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sandalwood Products</span>
                      <div className="flex items-center gap-2">
                        <Progress value={45} className="w-16 h-2" />
                        <span className="text-sm font-medium">45%</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}