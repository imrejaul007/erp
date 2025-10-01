'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  StockDistribution as StockDistributionType,
  StockLocation,
  ReorderSuggestion,
  Product,
  Store,
  ReorderPriority
} from '@/types/store';
import {
  Package,
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart3,
  PieChart,
  RefreshCw,
  ArrowRight,
  Building2,
  MapPin,
  Calendar,
  ShoppingCart,
  Zap
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell
} from 'recharts';

interface StockDistributionProps {
  distributions: StockDistributionType[];
  stores: Store[];
  onRefresh: () => void;
  onCreateTransfer: (fromStoreId: string, toStoreId: string, productId: string, quantity: number) => void;
  onCreateReorderRequest: (suggestion: ReorderSuggestion) => void;
  isLoading?: boolean;
}

const getPriorityColor = (priority: ReorderPriority) => {
  switch (priority) {
    case ReorderPriority.LOW:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case ReorderPriority.MEDIUM:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case ReorderPriority.HIGH:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case ReorderPriority.CRITICAL:
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export default function StockDistribution({
  distributions,
  stores,
  onRefresh,
  onCreateTransfer,
  onCreateReorderRequest,
  isLoading
}: StockDistributionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<StockDistributionType | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
  const [filteredDistributions, setFilteredDistributions] = useState<StockDistributionType[]>(distributions);

  useEffect(() => {
    let filtered = [...distributions];

    if (searchQuery) {
      filtered = filtered.filter(dist =>
        dist.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStoreId) {
      filtered = filtered.filter(dist =>
        dist.locations.some(loc => loc.storeId === selectedStoreId)
      );
    }

    setFilteredDistributions(filtered);
  }, [distributions, searchQuery, selectedStoreId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  const getStockHealthColor = (location: StockLocation) => {
    const stockRatio = location.quantity / (location.quantity + 50); // Assuming ideal stock level
    if (stockRatio > 0.8) return 'text-green-600';
    if (stockRatio > 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const calculateDistributionBalance = (distribution: StockDistributionType) => {
    if (distribution.locations.length === 0) return 100;

    const avgStock = distribution.totalStock / distribution.locations.length;
    const variance = distribution.locations.reduce((acc, loc) => {
      return acc + Math.pow(loc.quantity - avgStock, 2);
    }, 0) / distribution.locations.length;

    const coefficient = Math.sqrt(variance) / avgStock;
    return Math.max(0, 100 - coefficient * 100);
  };

  const getChartData = (distribution: StockDistributionType) => {
    return distribution.locations.map(location => {
      const store = stores.find(s => s.id === location.storeId);
      return {
        name: store?.code || location.storeName,
        stock: location.quantity,
        available: location.availableQuantity,
        value: location.stockValue
      };
    });
  };

  const getPieData = (distribution: StockDistributionType) => {
    return distribution.locations.map((location, index) => {
      const store = stores.find(s => s.id === location.storeId);
      return {
        name: store?.code || location.storeName,
        value: location.quantity,
        color: COLORS[index % COLORS.length]
      };
    });
  };

  const getAllReorderSuggestions = () => {
    return distributions.flatMap(dist => dist.reorderSuggestions);
  };

  const criticalSuggestions = getAllReorderSuggestions().filter(s => s.priority === ReorderPriority.CRITICAL);
  const totalSuggestions = getAllReorderSuggestions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Distribution Analysis</h1>
          <p className="text-muted-foreground">
            Analyze inventory distribution across all locations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            List View
          </Button>
          <Button
            variant={viewMode === 'chart' ? 'default' : 'outline'}
            onClick={() => setViewMode('chart')}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Chart View
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{distributions.length}</div>
            <p className="text-xs text-muted-foreground">
              Distributed across locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                distributions.reduce((sum, dist) =>
                  sum + dist.locations.reduce((locSum, loc) => locSum + loc.stockValue, 0), 0
                )
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reorder Suggestions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuggestions.length}</div>
            <p className="text-xs text-muted-foreground">
              {criticalSuggestions.length} critical
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Distribution Balance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(distributions.reduce((sum, dist) => sum + calculateDistributionBalance(dist), 0) / distributions.length || 0).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Balance score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={selectedStoreId}
              onValueChange={setSelectedStoreId}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Stores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {store.name} ({store.code})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedStoreId('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Critical Reorder Suggestions */}
      {criticalSuggestions.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Critical Reorder Suggestions
            </CardTitle>
            <CardDescription className="text-red-700">
              These items require immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalSuggestions.slice(0, 3).map((suggestion) => (
                <div key={`${suggestion.storeId}-${suggestion.productId}`} className="flex items-center justify-between p-3 bg-white border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium">{suggestion.productName}</div>
                      <div className="text-sm text-muted-foreground">
                        {suggestion.storeName} • Current: {suggestion.currentStock}
                      </div>
                      <div className="text-sm text-red-700">{suggestion.reason}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-medium">Suggested: {suggestion.suggestedQuantity}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(suggestion.estimatedCost)}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onCreateReorderRequest(suggestion)}
                    >
                      Order Now
                    </Button>
                  </div>
                </div>
              ))}
              {criticalSuggestions.length > 3 && (
                <div className="text-center">
                  <Button variant="outline" size="sm">
                    View All {criticalSuggestions.length} Critical Items
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stock Distribution List/Chart */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredDistributions.map((distribution) => {
            const balanceScore = calculateDistributionBalance(distribution);
            return (
              <Card key={distribution.productId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{distribution.productName}</CardTitle>
                        <CardDescription>
                          Total Stock: {distribution.totalStock.toLocaleString()} •
                          {distribution.locations.length} locations •
                          Balance: {balanceScore.toFixed(1)}%
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {distribution.reorderSuggestions.length > 0 && (
                        <Badge variant="outline" className="text-orange-600">
                          {distribution.reorderSuggestions.length} suggestions
                        </Badge>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>{distribution.productName} - Stock Distribution</DialogTitle>
                            <DialogDescription>
                              Detailed view of stock levels across all locations
                            </DialogDescription>
                          </DialogHeader>
                          <Tabs defaultValue="chart">
                            <TabsList>
                              <TabsTrigger value="chart">Chart View</TabsTrigger>
                              <TabsTrigger value="table">Table View</TabsTrigger>
                              <TabsTrigger value="suggestions">Reorder Suggestions</TabsTrigger>
                            </TabsList>
                            <TabsContent value="chart" className="space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <h4 className="font-medium mb-4">Stock Levels by Location</h4>
                                  <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={getChartData(distribution)}>
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="name" />
                                      <YAxis />
                                      <Tooltip />
                                      <Bar dataKey="stock" fill="#8884d8" />
                                      <Bar dataKey="available" fill="#82ca9d" />
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-4">Stock Distribution</h4>
                                  <ResponsiveContainer width="100%" height={200}>
                                    <RechartsPieChart>
                                      <Tooltip />
                                      <RechartsPieChart
                                        data={getPieData(distribution)}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                      >
                                        {getPieData(distribution).map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                      </RechartsPieChart>
                                    </RechartsPieChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="table">
                              <div className="space-y-4">
                                {distribution.locations.map((location) => {
                                  const store = stores.find(s => s.id === location.storeId);
                                  return (
                                    <div key={location.storeId} className="flex items-center justify-between p-3 border rounded-lg">
                                      <div className="flex items-center gap-3">
                                        <Building2 className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                          <div className="font-medium">{location.storeName}</div>
                                          <div className="text-sm text-muted-foreground">
                                            {store?.city}, {store?.emirate}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-3 gap-4 text-right">
                                        <div>
                                          <div className="font-medium">{location.quantity}</div>
                                          <div className="text-xs text-muted-foreground">Total</div>
                                        </div>
                                        <div>
                                          <div className={`font-medium ${getStockHealthColor(location)}`}>
                                            {location.availableQuantity}
                                          </div>
                                          <div className="text-xs text-muted-foreground">Available</div>
                                        </div>
                                        <div>
                                          <div className="font-medium">{formatCurrency(location.stockValue)}</div>
                                          <div className="text-xs text-muted-foreground">Value</div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </TabsContent>
                            <TabsContent value="suggestions">
                              {distribution.reorderSuggestions.length > 0 ? (
                                <div className="space-y-3">
                                  {distribution.reorderSuggestions.map((suggestion) => (
                                    <div key={`${suggestion.storeId}-${suggestion.productId}`} className="flex items-center justify-between p-3 border rounded-lg">
                                      <div className="flex items-center gap-3">
                                        <Badge className={getPriorityColor(suggestion.priority)}>
                                          {suggestion.priority}
                                        </Badge>
                                        <div>
                                          <div className="font-medium">{suggestion.storeName}</div>
                                          <div className="text-sm text-muted-foreground">
                                            Current: {suggestion.currentStock} • {suggestion.reason}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="text-right">
                                          <div className="font-medium">+{suggestion.suggestedQuantity}</div>
                                          <div className="text-sm text-muted-foreground">
                                            {formatCurrency(suggestion.estimatedCost)}
                                          </div>
                                        </div>
                                        <Button
                                          size="sm"
                                          onClick={() => onCreateReorderRequest(suggestion)}
                                        >
                                          Order
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                                  <h3 className="mt-4 text-lg font-semibold">No Reorder Suggestions</h3>
                                  <p className="text-muted-foreground">
                                    Stock levels are optimal across all locations
                                  </p>
                                </div>
                              )}
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span>Distribution Balance</span>
                      <span className="font-medium">{balanceScore.toFixed(1)}%</span>
                    </div>
                    <Progress value={balanceScore} className="h-2" />

                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                      {distribution.locations.slice(0, 6).map((location) => (
                        <div key={location.storeId} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{location.storeName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${getStockHealthColor(location)}`}>
                              {location.availableQuantity}
                            </span>
                            <span className="text-xs text-muted-foreground">/{location.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {distribution.locations.length > 6 && (
                      <div className="text-center">
                        <Button variant="outline" size="sm">
                          View All {distribution.locations.length} Locations
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredDistributions.slice(0, 4).map((distribution) => (
            <Card key={distribution.productId}>
              <CardHeader>
                <CardTitle className="text-lg">{distribution.productName}</CardTitle>
                <CardDescription>
                  Stock distribution across {distribution.locations.length} locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getChartData(distribution)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="available" fill="#82ca9d" name="Available" />
                    <Bar dataKey="stock" fill="#8884d8" name="Total Stock" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredDistributions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No distributions found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedStoreId
                ? 'Try adjusting your filters to see more results.'
                : 'No stock distribution data available.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}