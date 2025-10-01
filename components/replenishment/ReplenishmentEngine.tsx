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
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  ReplenishmentRule,
  ReplenishmentAlert,
  ReplenishmentAlertType,
  AlertPriority,
  Store,
  Product,
  SeasonalAdjustment
} from '@/types/store';
import {
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
  ShoppingCart,
  Package,
  Activity,
  Calendar,
  BarChart3,
  Play,
  Pause,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface ReplenishmentEngineProps {
  rules: ReplenishmentRule[];
  alerts: ReplenishmentAlert[];
  stores: Store[];
  products: Product[];
  onCreateRule: (rule: Omit<ReplenishmentRule, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdateRule: (ruleId: string, updates: Partial<ReplenishmentRule>) => Promise<void>;
  onDeleteRule: (ruleId: string) => Promise<void>;
  onResolveAlert: (alertId: string) => Promise<void>;
  onCreatePurchaseOrder: (alertId: string) => Promise<void>;
  onToggleEngine: (enabled: boolean) => Promise<void>;
  isEngineEnabled: boolean;
  isLoading?: boolean;
}

const getAlertPriorityColor = (priority: AlertPriority) => {
  switch (priority) {
    case AlertPriority.LOW:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case AlertPriority.MEDIUM:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case AlertPriority.HIGH:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case AlertPriority.CRITICAL:
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getAlertTypeIcon = (type: ReplenishmentAlertType) => {
  switch (type) {
    case ReplenishmentAlertType.LOW_STOCK:
      return <AlertTriangle className="h-4 w-4" />;
    case ReplenishmentAlertType.OUT_OF_STOCK:
      return <AlertTriangle className="h-4 w-4" />;
    case ReplenishmentAlertType.OVERSTOCK:
      return <TrendingUp className="h-4 w-4" />;
    case ReplenishmentAlertType.SEASONAL_ADJUSTMENT:
      return <Calendar className="h-4 w-4" />;
    case ReplenishmentAlertType.DEMAND_SPIKE:
      return <TrendingUp className="h-4 w-4" />;
    case ReplenishmentAlertType.SLOW_MOVING:
      return <TrendingDown className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

export default function ReplenishmentEngine({
  rules,
  alerts,
  stores,
  products,
  onCreateRule,
  onUpdateRule,
  onDeleteRule,
  onResolveAlert,
  onCreatePurchaseOrder,
  onToggleEngine,
  isEngineEnabled,
  isLoading
}: ReplenishmentEngineProps) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedAlert, setSelectedAlert] = useState<ReplenishmentAlert | null>(null);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [engineStatus, setEngineStatus] = useState<'running' | 'stopped' | 'processing'>('stopped');

  useEffect(() => {
    setEngineStatus(isEngineEnabled ? 'running' : 'stopped');
  }, [isEngineEnabled]);

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

  const getAlertStats = () => {
    const criticalAlerts = alerts.filter(a => a.priority === AlertPriority.CRITICAL && !a.isResolved).length;
    const highAlerts = alerts.filter(a => a.priority === AlertPriority.HIGH && !a.isResolved).length;
    const totalUnresolved = alerts.filter(a => !a.isResolved).length;
    const resolvedToday = alerts.filter(a =>
      a.isResolved &&
      a.resolvedAt &&
      new Date(a.resolvedAt).toDateString() === new Date().toDateString()
    ).length;

    return { criticalAlerts, highAlerts, totalUnresolved, resolvedToday };
  };

  const getRuleStats = () => {
    const activeRules = rules.filter(r => r.isActive).length;
    const autoApproveRules = rules.filter(r => r.isActive && r.autoApprove).length;
    const storeSpecificRules = rules.filter(r => r.storeId).length;
    const productSpecificRules = rules.filter(r => r.productId).length;

    return { activeRules, autoApproveRules, storeSpecificRules, productSpecificRules };
  };

  const { criticalAlerts, highAlerts, totalUnresolved, resolvedToday } = getAlertStats();
  const { activeRules, autoApproveRules, storeSpecificRules, productSpecificRules } = getRuleStats();

  const handleToggleEngine = async () => {
    try {
      setEngineStatus('processing');
      await onToggleEngine(!isEngineEnabled);
      toast.success(`Replenishment engine ${!isEngineEnabled ? 'started' : 'stopped'}`);
    } catch (error) {
      toast.error('Failed to toggle replenishment engine');
      setEngineStatus(isEngineEnabled ? 'running' : 'stopped');
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      await onResolveAlert(alertId);
      toast.success('Alert resolved');
    } catch (error) {
      toast.error('Failed to resolve alert');
    }
  };

  const handleCreatePurchaseOrder = async (alertId: string) => {
    try {
      await onCreatePurchaseOrder(alertId);
      toast.success('Purchase order created');
    } catch (error) {
      toast.error('Failed to create purchase order');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Auto-Replenishment Engine</h1>
          <p className="text-muted-foreground">
            Automated inventory replenishment based on sales trends and stock levels
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              engineStatus === 'running' ? 'bg-green-500 animate-pulse' :
              engineStatus === 'processing' ? 'bg-yellow-500 animate-pulse' :
              'bg-red-500'
            }`} />
            <span className="text-sm capitalize">{engineStatus}</span>
          </div>
          <Switch
            checked={isEngineEnabled}
            onCheckedChange={handleToggleEngine}
            disabled={engineStatus === 'processing'}
          />
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">
            Alerts {totalUnresolved > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">{totalUnresolved}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Engine Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Engine Status
              </CardTitle>
              <CardDescription>
                Current status and performance of the auto-replenishment engine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    engineStatus === 'running' ? 'text-green-600' :
                    engineStatus === 'processing' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {engineStatus === 'running' ? 'Running' :
                     engineStatus === 'processing' ? 'Processing' :
                     'Stopped'
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">Engine Status</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{activeRules}</div>
                  <p className="text-sm text-muted-foreground">Active Rules</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{totalUnresolved}</div>
                  <p className="text-sm text-muted-foreground">Pending Alerts</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{resolvedToday}</div>
                  <p className="text-sm text-muted-foreground">Resolved Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical Alerts */}
          {criticalAlerts > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Alerts
                </CardTitle>
                <CardDescription className="text-red-700">
                  These items require immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts
                    .filter(a => a.priority === AlertPriority.CRITICAL && !a.isResolved)
                    .slice(0, 3)
                    .map((alert) => {
                      const product = getProduct(alert.productId);
                      const store = getStore(alert.storeId);
                      return (
                        <div key={alert.id} className="flex items-center justify-between p-3 bg-white border border-red-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                              {getAlertTypeIcon(alert.alertType)}
                            </div>
                            <div>
                              <div className="font-medium">{product?.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {store?.name} • Current: {alert.currentStock} • Suggested: {alert.suggestedOrder}
                              </div>
                              <div className="text-sm text-red-700">{alert.message}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleCreatePurchaseOrder(alert.id)}
                            >
                              Order Now
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResolveAlert(alert.id)}
                            >
                              Resolve
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Performance Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Auto-Approve Rules</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{autoApproveRules}</div>
                <p className="text-xs text-muted-foreground">
                  {activeRules > 0 ? ((autoApproveRules / activeRules) * 100).toFixed(1) : 0}% of active rules
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Store-Specific Rules</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{storeSpecificRules}</div>
                <p className="text-xs text-muted-foreground">
                  Tailored to individual stores
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Product Rules</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productSpecificRules}</div>
                <p className="text-xs text-muted-foreground">
                  Product-specific configurations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">94.2%</div>
                <p className="text-xs text-muted-foreground">
                  Successful replenishments
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Replenishment Alerts</CardTitle>
                  <CardDescription>
                    System-generated alerts requiring attention
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Refresh alerts
                      toast.info('Refreshing alerts...');
                    }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Alert Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Suggested Order</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts
                    .filter(a => !a.isResolved)
                    .map((alert) => {
                      const product = getProduct(alert.productId);
                      const store = getStore(alert.storeId);
                      return (
                        <TableRow key={alert.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Package className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">{product?.name}</div>
                                <div className="text-sm text-muted-foreground">{product?.sku}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {store && (
                              <div>
                                <div className="font-medium">{store.name}</div>
                                <div className="text-sm text-muted-foreground">{store.code}</div>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getAlertTypeIcon(alert.alertType)}
                              <span>{alert.alertType.replace('_', ' ')}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getAlertPriorityColor(alert.priority)}>
                              {alert.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{alert.currentStock}</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-green-600">{alert.suggestedOrder}</span>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(alert.createdAt).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedAlert(alert)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Alert Details</DialogTitle>
                                    <DialogDescription>
                                      {alert.alertType.replace('_', ' ')} - {alert.priority}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Product</label>
                                        <p className="font-medium">{product?.name}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Store</label>
                                        <p className="font-medium">{store?.name}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Current Stock</label>
                                        <p className="text-2xl font-bold">{alert.currentStock}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Suggested Order</label>
                                        <p className="text-2xl font-bold text-green-600">{alert.suggestedOrder}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Message</label>
                                      <p className="mt-1 p-3 bg-muted rounded text-sm">{alert.message}</p>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => handleResolveAlert(alert.id)}
                                    >
                                      Resolve Alert
                                    </Button>
                                    <Button
                                      onClick={() => handleCreatePurchaseOrder(alert.id)}
                                    >
                                      Create Order
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <Button
                                size="sm"
                                onClick={() => handleCreatePurchaseOrder(alert.id)}
                              >
                                <ShoppingCart className="h-4 w-4" />
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Resolve Alert</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to resolve this alert? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleResolveAlert(alert.id)}
                                    >
                                      Resolve
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>

              {alerts.filter(a => !a.isResolved).length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                  <h3 className="mt-4 text-lg font-semibold">No pending alerts</h3>
                  <p className="text-muted-foreground">
                    All replenishment alerts have been resolved
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Replenishment Rules</CardTitle>
                  <CardDescription>
                    Configure automated replenishment rules for stores and products
                  </CardDescription>
                </div>
                <Button onClick={() => setIsRuleDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scope</TableHead>
                    <TableHead>Min Level</TableHead>
                    <TableHead>Max Level</TableHead>
                    <TableHead>Reorder Qty</TableHead>
                    <TableHead>Lead Time</TableHead>
                    <TableHead>Auto Approve</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => {
                    const store = rule.storeId ? getStore(rule.storeId) : null;
                    const product = rule.productId ? getProduct(rule.productId) : null;

                    return (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <div>
                            {store && (
                              <div className="font-medium">{store.name}</div>
                            )}
                            {product && (
                              <div className="font-medium">{product.name}</div>
                            )}
                            {!store && !product && (
                              <div className="font-medium">Global Rule</div>
                            )}
                            <div className="text-sm text-muted-foreground">
                              {store && product ? 'Store + Product' :
                               store ? 'Store-wide' :
                               product ? 'Product-specific' :
                               'Global'
                              }
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{rule.minLevel}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{rule.maxLevel}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{rule.reorderQuantity}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{rule.leadTimeDays} days</span>
                        </TableCell>
                        <TableCell>
                          <Switch checked={rule.autoApprove} disabled />
                        </TableCell>
                        <TableCell>
                          <Badge variant={rule.isActive ? "default" : "secondary"}>
                            {rule.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Edit rule logic
                                toast.info('Edit rule functionality coming soon');
                              }}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Rule</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this replenishment rule? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => onDeleteRule(rule.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {rules.length === 0 && (
                <div className="text-center py-8">
                  <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No replenishment rules</h3>
                  <p className="text-muted-foreground">
                    Create rules to automate inventory replenishment
                  </p>
                  <Button className="mt-3" onClick={() => setIsRuleDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Rule
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Replenishment Analytics</CardTitle>
              <CardDescription>
                Performance metrics and insights for the auto-replenishment system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">94.2%</div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <Progress value={94.2} className="mt-2 h-2" />
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">2.3</div>
                    <p className="text-sm text-muted-foreground">Avg Days to Fulfill</p>
                    <div className="text-xs text-green-600 mt-1">↓ 0.5 days vs last month</div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{formatCurrency(127500)}</div>
                    <p className="text-sm text-muted-foreground">Monthly Savings</p>
                    <div className="text-xs text-green-600 mt-1">↑ 12% vs manual process</div>
                  </div>
                </Card>
              </div>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  Detailed analytics and reporting features coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}