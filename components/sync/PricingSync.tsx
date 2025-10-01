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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  PricingSync as PricingSyncType,
  StorePrice,
  Product,
  Store
} from '@/types/store';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Zap,
  Search,
  Building2,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Settings,
  Plus,
  Minus
} from 'lucide-react';
import { toast } from 'sonner';

interface PricingSyncProps {
  pricingSync: PricingSyncType[];
  products: Product[];
  stores: Store[];
  onUpdatePricing: (productId: string, basePrice: number, storeAdjustments: StorePrice[]) => Promise<void>;
  onSyncPrices: (productIds: string[]) => Promise<void>;
  onToggleAutoSync: (productId: string, enabled: boolean) => Promise<void>;
  isLoading?: boolean;
}

interface PriceUpdateForm {
  productId: string;
  basePrice: number;
  storeAdjustments: StorePrice[];
  effectiveDate: Date;
}

export default function PricingSync({
  pricingSync,
  products,
  stores,
  onUpdatePricing,
  onSyncPrices,
  onToggleAutoSync,
  isLoading
}: PricingSyncProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [filteredSync, setFilteredSync] = useState<PricingSyncType[]>(pricingSync);
  const [selectedPricing, setSelectedPricing] = useState<PricingSyncType | null>(null);
  const [priceUpdateForm, setPriceUpdateForm] = useState<PriceUpdateForm>({
    productId: '',
    basePrice: 0,
    storeAdjustments: [],
    effectiveDate: new Date()
  });
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  useEffect(() => {
    let filtered = [...pricingSync];

    if (searchQuery) {
      const productIds = products
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(p => p.id);
      filtered = filtered.filter(ps => productIds.includes(ps.productId));
    }

    if (selectedStore) {
      filtered = filtered.filter(ps =>
        ps.storeAdjustments.some(adj => adj.storeId === selectedStore)
      );
    }

    setFilteredSync(filtered);
  }, [pricingSync, products, searchQuery, selectedStore]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  const getProduct = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const getStore = (storeId: string) => {
    return stores.find(s => s.id === storeId);
  };

  const calculateAdjustedPrice = (basePrice: number, adjustment: number) => {
    return basePrice + (basePrice * adjustment / 100);
  };

  const getPriceVarianceColor = (variance: number) => {
    if (Math.abs(variance) > 20) return 'text-red-600';
    if (Math.abs(variance) > 10) return 'text-orange-600';
    if (Math.abs(variance) > 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  const openUpdateDialog = (pricing?: PricingSyncType) => {
    if (pricing) {
      const product = getProduct(pricing.productId);
      setPriceUpdateForm({
        productId: pricing.productId,
        basePrice: pricing.basePrice,
        storeAdjustments: [...pricing.storeAdjustments],
        effectiveDate: new Date(pricing.effectiveDate)
      });
    } else {
      setPriceUpdateForm({
        productId: '',
        basePrice: 0,
        storeAdjustments: stores.map(store => ({
          storeId: store.id,
          price: 0,
          adjustmentPercentage: 0,
          reason: ''
        })),
        effectiveDate: new Date()
      });
    }
    setIsUpdateDialogOpen(true);
  };

  const handlePriceUpdate = async () => {
    try {
      await onUpdatePricing(
        priceUpdateForm.productId,
        priceUpdateForm.basePrice,
        priceUpdateForm.storeAdjustments
      );
      toast.success('Prices updated successfully');
      setIsUpdateDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update prices');
      console.error(error);
    }
  };

  const handleStoreAdjustmentChange = (storeId: string, field: keyof StorePrice, value: any) => {
    setPriceUpdateForm(prev => ({
      ...prev,
      storeAdjustments: prev.storeAdjustments.map(adj =>
        adj.storeId === storeId ? { ...adj, [field]: value } : adj
      )
    }));
  };

  const handleBulkSync = async () => {
    const productIds = filteredSync.map(ps => ps.productId);
    try {
      await onSyncPrices(productIds);
      toast.success(`Syncing prices for ${productIds.length} products`);
    } catch (error) {
      toast.error('Failed to sync prices');
      console.error(error);
    }
  };

  const getPricingStats = () => {
    const totalProducts = filteredSync.length;
    const recentlyUpdated = filteredSync.filter(ps =>
      new Date(ps.syncedAt).getTime() > Date.now() - 24 * 60 * 60 * 1000
    ).length;
    const hasVariance = filteredSync.filter(ps =>
      ps.storeAdjustments.some(adj => Math.abs(adj.adjustmentPercentage) > 10)
    ).length;

    return { totalProducts, recentlyUpdated, hasVariance };
  };

  const { totalProducts, recentlyUpdated, hasVariance } = getPricingStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Price Synchronization</h1>
          <p className="text-muted-foreground">
            Manage and synchronize pricing across all store locations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => openUpdateDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Update Prices
          </Button>
          <Button onClick={handleBulkSync} disabled={filteredSync.length === 0}>
            <Zap className="mr-2 h-4 w-4" />
            Sync All
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products with Pricing</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Across {stores.length} stores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recently Updated</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{recentlyUpdated}</div>
            <p className="text-xs text-muted-foreground">
              In the last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price Variance</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{hasVariance}</div>
            <p className="text-xs text-muted-foreground">
              Products with >10% variance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Base Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                filteredSync.reduce((sum, ps) => sum + ps.basePrice, 0) / filteredSync.length || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all products
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
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

            <Select value={selectedStore} onValueChange={setSelectedStore}>
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
                setSelectedStore('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Pricing</CardTitle>
          <CardDescription>
            Current pricing and store-specific adjustments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>Store Prices</TableHead>
                <TableHead>Price Range</TableHead>
                <TableHead>Last Synced</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSync.map((pricing) => {
                const product = getProduct(pricing.productId);
                if (!product) return null;

                const prices = pricing.storeAdjustments.map(adj =>
                  calculateAdjustedPrice(pricing.basePrice, adj.adjustmentPercentage)
                );
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);
                const priceVariance = ((maxPrice - minPrice) / pricing.basePrice) * 100;

                return (
                  <TableRow key={pricing.productId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.sku}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(pricing.basePrice)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {pricing.storeAdjustments.slice(0, 3).map((adjustment) => {
                          const store = getStore(adjustment.storeId);
                          const adjustedPrice = calculateAdjustedPrice(pricing.basePrice, adjustment.adjustmentPercentage);
                          return (
                            <Badge key={adjustment.storeId} variant="outline" className="text-xs">
                              {store?.code}: {formatCurrency(adjustedPrice)}
                            </Badge>
                          );
                        })}
                        {pricing.storeAdjustments.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{pricing.storeAdjustments.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
                        </div>
                        <div className={`text-sm ${getPriceVarianceColor(priceVariance)}`}>
                          {priceVariance > 0 ? '+' : ''}{priceVariance.toFixed(1)}% variance
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(pricing.syncedAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(pricing.syncedAt).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPricing(pricing)}
                            >
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Pricing Details - {product.name}</DialogTitle>
                              <DialogDescription>
                                Store-specific pricing information and adjustments
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                  <div className="text-2xl font-bold">{formatCurrency(pricing.basePrice)}</div>
                                  <p className="text-sm text-muted-foreground">Base Price</p>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold">{formatCurrency(minPrice)}</div>
                                  <p className="text-sm text-muted-foreground">Lowest Price</p>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold">{formatCurrency(maxPrice)}</div>
                                  <p className="text-sm text-muted-foreground">Highest Price</p>
                                </div>
                              </div>

                              <Separator />

                              <div className="space-y-3">
                                <h4 className="font-medium">Store Pricing</h4>
                                {pricing.storeAdjustments.map((adjustment) => {
                                  const store = getStore(adjustment.storeId);
                                  const adjustedPrice = calculateAdjustedPrice(pricing.basePrice, adjustment.adjustmentPercentage);
                                  return (
                                    <div key={adjustment.storeId} className="flex items-center justify-between p-3 border rounded-lg">
                                      <div className="flex items-center gap-3">
                                        <Building2 className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                          <div className="font-medium">{store?.name || 'Unknown Store'}</div>
                                          <div className="text-sm text-muted-foreground">
                                            {store?.code} • {store?.city}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-medium">{formatCurrency(adjustedPrice)}</div>
                                        <div className={`text-sm ${getPriceVarianceColor(adjustment.adjustmentPercentage)}`}>
                                          {adjustment.adjustmentPercentage > 0 ? '+' : ''}
                                          {adjustment.adjustmentPercentage}%
                                        </div>
                                        {adjustment.reason && (
                                          <div className="text-xs text-muted-foreground mt-1">
                                            {adjustment.reason}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openUpdateDialog(pricing)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => onSyncPrices([pricing.productId])}
                        >
                          <Zap className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredSync.length === 0 && (
            <div className="text-center py-8">
              <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No pricing data</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedStore
                  ? 'Try adjusting your filters to see more results.'
                  : 'Set up pricing for your products to get started.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Update Product Pricing</DialogTitle>
            <DialogDescription>
              Set base price and store-specific adjustments
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Product</Label>
                <Select
                  value={priceUpdateForm.productId}
                  onValueChange={(value) =>
                    setPriceUpdateForm(prev => ({ ...prev, productId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Base Price (AED)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={priceUpdateForm.basePrice}
                  onChange={(e) =>
                    setPriceUpdateForm(prev => ({
                      ...prev,
                      basePrice: parseFloat(e.target.value) || 0
                    }))
                  }
                />
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-4">Store-Specific Adjustments</h4>
              <div className="space-y-3">
                {priceUpdateForm.storeAdjustments.map((adjustment) => {
                  const store = getStore(adjustment.storeId);
                  const adjustedPrice = calculateAdjustedPrice(
                    priceUpdateForm.basePrice,
                    adjustment.adjustmentPercentage
                  );

                  return (
                    <div key={adjustment.storeId} className="grid grid-cols-4 gap-4 items-center p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{store?.name}</div>
                          <div className="text-sm text-muted-foreground">{store?.code}</div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">Adjustment %</Label>
                        <Input
                          type="number"
                          min="-50"
                          max="100"
                          step="0.1"
                          value={adjustment.adjustmentPercentage}
                          onChange={(e) =>
                            handleStoreAdjustmentChange(
                              adjustment.storeId,
                              'adjustmentPercentage',
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Final Price</Label>
                        <div className="text-lg font-medium">{formatCurrency(adjustedPrice)}</div>
                      </div>

                      <div>
                        <Label className="text-xs">Reason</Label>
                        <Input
                          placeholder="Optional reason"
                          value={adjustment.reason || ''}
                          onChange={(e) =>
                            handleStoreAdjustmentChange(
                              adjustment.storeId,
                              'reason',
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpdateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePriceUpdate}
              disabled={!priceUpdateForm.productId || priceUpdateForm.basePrice <= 0}
            >
              Update Pricing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}