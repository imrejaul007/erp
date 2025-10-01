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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
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
  LocationInventory,
  Store,
  Product,
  InventoryStatus,
  InventoryFilters
} from '@/types/store';
import {
  Package,
  Search,
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  ArrowUpDown,
  Filter,
  RefreshCw,
  BarChart3,
  Building2,
  ShoppingCart,
  ArrowRight,
  Eye
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LocationInventoryViewProps {
  inventories: LocationInventory[];
  stores: Store[];
  products: Product[];
  onRefresh: () => void;
  onTransferRequest: (fromStoreId: string, toStoreId: string, productId: string, quantity: number) => void;
  isLoading?: boolean;
}

const getStatusColor = (status: InventoryStatus) => {
  switch (status) {
    case InventoryStatus.IN_STOCK:
      return 'bg-green-100 text-green-800 border-green-200';
    case InventoryStatus.LOW_STOCK:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case InventoryStatus.OUT_OF_STOCK:
      return 'bg-red-100 text-red-800 border-red-200';
    case InventoryStatus.OVERSTOCK:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case InventoryStatus.RESERVED:
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case InventoryStatus.ON_HOLD:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: InventoryStatus) => {
  switch (status) {
    case InventoryStatus.IN_STOCK:
      return <CheckCircle className="h-4 w-4" />;
    case InventoryStatus.LOW_STOCK:
      return <AlertCircle className="h-4 w-4" />;
    case InventoryStatus.OUT_OF_STOCK:
      return <AlertCircle className="h-4 w-4" />;
    case InventoryStatus.OVERSTOCK:
      return <TrendingUp className="h-4 w-4" />;
    case InventoryStatus.RESERVED:
      return <ShoppingCart className="h-4 w-4" />;
    case InventoryStatus.ON_HOLD:
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

export default function LocationInventoryView({
  inventories,
  stores,
  products,
  onRefresh,
  onTransferRequest,
  isLoading
}: LocationInventoryViewProps) {
  const router = useRouter();
  const [filteredInventories, setFilteredInventories] = useState<LocationInventory[]>(inventories);
  const [filters, setFilters] = useState<InventoryFilters>({});
  const [sortBy, setSortBy] = useState<string>('product.name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'store'>('table');
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  useEffect(() => {
    let filtered = [...inventories];

    // Apply filters
    if (filters.search) {
      filtered = filtered.filter(inventory =>
        inventory.product.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        inventory.product.sku.toLowerCase().includes(filters.search!.toLowerCase()) ||
        inventory.store.name.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.storeId) {
      filtered = filtered.filter(inventory => inventory.storeId === filters.storeId);
    }

    if (filters.productId) {
      filtered = filtered.filter(inventory => inventory.productId === filters.productId);
    }

    if (filters.status) {
      filtered = filtered.filter(inventory => inventory.status === filters.status);
    }

    if (filters.lowStock) {
      filtered = filtered.filter(inventory => inventory.status === InventoryStatus.LOW_STOCK);
    }

    if (filters.outOfStock) {
      filtered = filtered.filter(inventory => inventory.status === InventoryStatus.OUT_OF_STOCK);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a;
      let bValue: any = b;

      // Handle nested properties
      if (sortBy.includes('.')) {
        const keys = sortBy.split('.');
        aValue = keys.reduce((obj, key) => obj?.[key], a);
        bValue = keys.reduce((obj, key) => obj?.[key], b);
      } else {
        aValue = a[sortBy as keyof LocationInventory];
        bValue = b[sortBy as keyof LocationInventory];
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredInventories(filtered);
  }, [inventories, filters, sortBy, sortOrder]);

  const handleFilterChange = (key: keyof InventoryFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  const getInventoryByStore = () => {
    const storeInventories = new Map<string, LocationInventory[]>();

    filteredInventories.forEach(inventory => {
      const storeId = inventory.storeId;
      if (!storeInventories.has(storeId)) {
        storeInventories.set(storeId, []);
      }
      storeInventories.get(storeId)!.push(inventory);
    });

    return storeInventories;
  };

  const getInventoryByProduct = () => {
    const productInventories = new Map<string, LocationInventory[]>();

    filteredInventories.forEach(inventory => {
      const productId = inventory.productId;
      if (!productInventories.has(productId)) {
        productInventories.set(productId, []);
      }
      productInventories.get(productId)!.push(inventory);
    });

    return productInventories;
  };

  const calculateSummaryStats = () => {
    const totalValue = filteredInventories.reduce((sum, inv) =>
      sum + (inv.quantity * inv.averageCost), 0
    );
    const totalItems = filteredInventories.reduce((sum, inv) => sum + inv.quantity, 0);
    const lowStockCount = filteredInventories.filter(inv => inv.status === InventoryStatus.LOW_STOCK).length;
    const outOfStockCount = filteredInventories.filter(inv => inv.status === InventoryStatus.OUT_OF_STOCK).length;

    return { totalValue, totalItems, lowStockCount, outOfStockCount };
  };

  const { totalValue, totalItems, lowStockCount, outOfStockCount } = calculateSummaryStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Multi-Location Inventory</h1>
          <p className="text-muted-foreground">
            Monitor stock levels across all store locations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => router.push('/inventory/reports')}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Reports
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Across {stores.length} locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Individual units in stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">
              Require replenishment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground">
              Need immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products or stores..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={filters.storeId || ''}
              onValueChange={(value) => handleFilterChange('storeId', value || undefined)}
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

            <Select
              value={filters.productId || ''}
              onValueChange={(value) => handleFilterChange('productId', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Products</SelectItem>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      {product.name} ({product.sku})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.status || ''}
              onValueChange={(value) => handleFilterChange('status', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {Object.values(InventoryStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status)}
                      {status.replace('_', ' ')}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Table View
              </Button>
              <Button
                variant={viewMode === 'store' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('store')}
              >
                By Store
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Product Grid
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Showing {filteredInventories.length} inventory records
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content based on view mode */}
      {viewMode === 'table' && (
        <Card>
          <CardHeader>
            <CardTitle>Inventory Details</CardTitle>
            <CardDescription>
              Complete inventory information across all locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSortBy('product.name');
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      }}
                      className="h-auto p-0 font-medium"
                    >
                      Product <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSortBy('store.name');
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      }}
                      className="h-auto p-0 font-medium"
                    >
                      Store <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSortBy('quantity');
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      }}
                      className="h-auto p-0 font-medium"
                    >
                      Stock <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Reserved</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Last Movement</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventories.map((inventory) => (
                  <TableRow key={`${inventory.storeId}-${inventory.productId}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{inventory.product.name}</div>
                          <div className="text-sm text-muted-foreground">{inventory.product.sku}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{inventory.store.name}</div>
                          <div className="text-sm text-muted-foreground">{inventory.store.code}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{inventory.quantity}</span>
                    </TableCell>
                    <TableCell>
                      {inventory.reservedQuantity > 0 ? (
                        <span className="text-orange-600">{inventory.reservedQuantity}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-green-600">
                        {inventory.availableQuantity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(inventory.status)}>
                        {getStatusIcon(inventory.status)}
                        <span className="ml-1">{inventory.status.replace('_', ' ')}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {formatCurrency(inventory.quantity * inventory.averageCost)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {inventory.lastMovementDate ? (
                        <span className="text-sm">
                          {new Date(inventory.lastMovementDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Inventory Details</DialogTitle>
                            <DialogDescription>
                              {inventory.product.name} at {inventory.store.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Current Stock</label>
                                <p className="text-2xl font-bold">{inventory.quantity}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Available</label>
                                <p className="text-2xl font-bold text-green-600">{inventory.availableQuantity}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Min Level</label>
                                <p className="text-lg font-medium">{inventory.minLevel}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Max Level</label>
                                <p className="text-lg font-medium">{inventory.maxLevel}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Average Cost:</span>
                                <span className="font-medium">{formatCurrency(inventory.averageCost)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Value:</span>
                                <span className="font-medium">
                                  {formatCurrency(inventory.quantity * inventory.averageCost)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Last Count:</span>
                                <span className="font-medium">
                                  {inventory.lastCountDate
                                    ? new Date(inventory.lastCountDate).toLocaleDateString()
                                    : 'Never'
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredInventories.length === 0 && (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No inventory found</h3>
                <p className="text-muted-foreground">
                  {Object.keys(filters).length > 0
                    ? 'Try adjusting your filters or search criteria.'
                    : 'No inventory records match your criteria.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {viewMode === 'store' && (
        <div className="space-y-6">
          {Array.from(getInventoryByStore().entries()).map(([storeId, storeInventories]) => {
            const store = stores.find(s => s.id === storeId)!;
            const storeValue = storeInventories.reduce((sum, inv) =>
              sum + (inv.quantity * inv.averageCost), 0
            );
            const storeItems = storeInventories.reduce((sum, inv) => sum + inv.quantity, 0);
            const lowStockItems = storeInventories.filter(inv =>
              inv.status === InventoryStatus.LOW_STOCK
            ).length;

            return (
              <Card key={storeId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{store.name}</CardTitle>
                        <CardDescription>
                          {store.code} • {store.city}, {store.emirate}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{formatCurrency(storeValue)}</div>
                      <div className="text-sm text-muted-foreground">
                        {storeItems.toLocaleString()} items
                        {lowStockItems > 0 && (
                          <span className="text-yellow-600 ml-2">
                            • {lowStockItems} low stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {storeInventories.slice(0, 5).map((inventory) => (
                      <div
                        key={`${inventory.storeId}-${inventory.productId}`}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{inventory.product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {inventory.product.sku}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium">{inventory.availableQuantity}</div>
                            <div className="text-sm text-muted-foreground">available</div>
                          </div>
                          <Badge className={getStatusColor(inventory.status)}>
                            {inventory.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {storeInventories.length > 5 && (
                      <div className="text-center py-2">
                        <Button variant="outline" size="sm">
                          View All {storeInventories.length} Items
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {viewMode === 'grid' && (
        <div className="space-y-6">
          {Array.from(getInventoryByProduct().entries()).map(([productId, productInventories]) => {
            const product = products.find(p => p.id === productId)!;
            const totalStock = productInventories.reduce((sum, inv) => sum + inv.quantity, 0);
            const totalValue = productInventories.reduce((sum, inv) =>
              sum + (inv.quantity * inv.averageCost), 0
            );
            const lowStockStores = productInventories.filter(inv =>
              inv.status === InventoryStatus.LOW_STOCK
            ).length;

            return (
              <Card key={productId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{product.name}</CardTitle>
                        <CardDescription>
                          {product.sku} • Available at {productInventories.length} locations
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{totalStock.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(totalValue)}
                        {lowStockStores > 0 && (
                          <span className="text-yellow-600 ml-2">
                            • {lowStockStores} stores low stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {productInventories.map((inventory) => (
                      <div
                        key={`${inventory.storeId}-${inventory.productId}`}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{inventory.store.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {inventory.store.code}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="font-medium">{inventory.availableQuantity}</div>
                            <div className="text-xs text-muted-foreground">available</div>
                          </div>
                          <Badge variant="outline" className={getStatusColor(inventory.status)}>
                            {getStatusIcon(inventory.status)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}