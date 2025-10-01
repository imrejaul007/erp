'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  MinusCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Undo2,
  Settings,
  History,
  Package
} from 'lucide-react';
import { ProductionBatch, Material, StockMovement, StockMovementType } from '@/types/production';

interface DeductionItem {
  materialId: string;
  materialName: string;
  plannedQuantity: number;
  actualQuantity: number;
  unit: string;
  currentStock: number;
  deductedQuantity: number;
  status: 'pending' | 'completed' | 'insufficient' | 'error';
}

interface AutoDeductionProps {
  productionBatch: ProductionBatch;
  materials: Material[];
  stockMovements: StockMovement[];
  onDeductStock: (deductions: DeductionItem[]) => Promise<void>;
  onReverseDeduction: (batchId: string) => Promise<void>;
  autoDeductionEnabled?: boolean;
  onToggleAutoDeduction?: (enabled: boolean) => void;
}

const AutoDeduction: React.FC<AutoDeductionProps> = ({
  productionBatch,
  materials,
  stockMovements,
  onDeductStock,
  onReverseDeduction,
  autoDeductionEnabled = true,
  onToggleAutoDeduction
}) => {
  const [deductionItems, setDeductionItems] = useState<DeductionItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Calculate deduction items from production batch inputs
  useEffect(() => {
    if (productionBatch.inputs) {
      const items: DeductionItem[] = productionBatch.inputs.map(input => {
        const material = materials.find(m => m.id === input.materialId);
        const plannedQty = input.plannedQuantity;
        const actualQty = input.actualQuantity || plannedQty;

        return {
          materialId: input.materialId,
          materialName: material?.name || 'Unknown Material',
          plannedQuantity: plannedQty,
          actualQuantity: actualQty,
          unit: input.unit,
          currentStock: material?.currentStock || 0,
          deductedQuantity: 0,
          status: material && material.currentStock >= actualQty ? 'pending' : 'insufficient'
        };
      });

      setDeductionItems(items);
    }
  }, [productionBatch, materials]);

  // Check if batch already has deductions
  const hasDeductions = stockMovements.some(
    movement => movement.reference === productionBatch.batchNumber &&
               movement.type === StockMovementType.PRODUCTION_OUT
  );

  // Handle stock deduction
  const handleDeductStock = async () => {
    setIsProcessing(true);
    try {
      const validItems = deductionItems.filter(item => item.status !== 'insufficient');
      const updatedItems = validItems.map(item => ({
        ...item,
        deductedQuantity: item.actualQuantity,
        status: 'completed' as const
      }));

      await onDeductStock(updatedItems);
      setDeductionItems(prev => prev.map(item =>
        validItems.find(valid => valid.materialId === item.materialId) || item
      ));
    } catch (error) {
      console.error('Deduction failed:', error);
      // Update status to error for failed items
      setDeductionItems(prev => prev.map(item => ({ ...item, status: 'error' })));
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle reverse deduction
  const handleReverseDeduction = async () => {
    if (!hasDeductions) return;

    setIsProcessing(true);
    try {
      await onReverseDeduction(productionBatch.id);
      // Reset deduction items
      setDeductionItems(prev => prev.map(item => ({
        ...item,
        deductedQuantity: 0,
        status: item.currentStock >= item.actualQuantity ? 'pending' : 'insufficient'
      })));
    } catch (error) {
      console.error('Reverse deduction failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status: DeductionItem['status']) => {
    const variants = {
      pending: { variant: 'outline' as const, label: 'Pending', icon: Clock },
      completed: { variant: 'default' as const, label: 'Completed', icon: CheckCircle },
      insufficient: { variant: 'destructive' as const, label: 'Insufficient Stock', icon: AlertTriangle },
      error: { variant: 'destructive' as const, label: 'Error', icon: AlertTriangle }
    };

    const { variant, label, icon: Icon } = variants[status];
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  // Calculate totals
  const totalItems = deductionItems.length;
  const completedItems = deductionItems.filter(item => item.status === 'completed').length;
  const insufficientItems = deductionItems.filter(item => item.status === 'insufficient').length;
  const pendingItems = deductionItems.filter(item => item.status === 'pending').length;

  // Filter stock movements for this batch
  const batchMovements = stockMovements.filter(
    movement => movement.reference === productionBatch.batchNumber
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Automatic Stock Deduction</h3>
          <p className="text-gray-600">Batch: {productionBatch.batchNumber}</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showHistory} onOpenChange={setShowHistory}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Stock Movement History</DialogTitle>
              </DialogHeader>
              <div className="max-h-96 overflow-y-auto">
                {batchMovements.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No stock movements recorded</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {batchMovements.map(movement => (
                        <TableRow key={movement.id}>
                          <TableCell>{new Date(movement.createdAt).toLocaleString()}</TableCell>
                          <TableCell>{movement.material.name}</TableCell>
                          <TableCell>
                            <Badge variant={movement.type === StockMovementType.OUT ? "destructive" : "default"}>
                              {movement.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{movement.quantity} {movement.material.unitOfMeasure}</TableCell>
                          <TableCell>{movement.notes || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Auto Deduction Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoDeduction">Enable Auto Deduction</Label>
                  <Switch
                    id="autoDeduction"
                    checked={autoDeductionEnabled}
                    onCheckedChange={onToggleAutoDeduction}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  When enabled, stock will be automatically deducted when production starts.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedItems}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-blue-600">{pendingItems}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Issues</p>
                <p className="text-2xl font-bold text-red-600">{insufficientItems}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {insufficientItems > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {insufficientItems} material(s) have insufficient stock for deduction.
            Production may be delayed or quality may be affected.
          </AlertDescription>
        </Alert>
      )}

      {autoDeductionEnabled && pendingItems > 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Auto deduction is enabled. Stock will be automatically deducted when production starts.
          </AlertDescription>
        </Alert>
      )}

      {/* Deduction Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Materials to Deduct
            <div className="flex gap-2">
              {hasDeductions && (
                <Button
                  variant="outline"
                  onClick={handleReverseDeduction}
                  disabled={isProcessing}
                >
                  <Undo2 className="w-4 h-4 mr-2" />
                  Reverse
                </Button>
              )}
              {pendingItems > 0 && (
                <Button
                  onClick={handleDeductStock}
                  disabled={isProcessing || insufficientItems === totalItems}
                >
                  <MinusCircle className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Deduct Stock'}
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Planned Qty</TableHead>
                  <TableHead>Actual Qty</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Deducted</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deductionItems.map(item => {
                  const stockPercentage = item.currentStock > 0
                    ? Math.min(100, (item.currentStock / item.actualQuantity) * 100)
                    : 0;

                  return (
                    <TableRow key={item.materialId}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.materialName}</p>
                          <p className="text-sm text-gray-500">ID: {item.materialId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.plannedQuantity} {item.unit}</TableCell>
                      <TableCell>{item.actualQuantity} {item.unit}</TableCell>
                      <TableCell>{item.currentStock} {item.unit}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={stockPercentage} className="w-16" />
                          <span className="text-sm">
                            {stockPercentage.toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.deductedQuantity > 0 ? (
                          <span className="text-green-600 font-medium">
                            {item.deductedQuantity} {item.unit}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {deductionItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No materials to deduct</p>
              <p className="text-sm">Production inputs will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Summary */}
      {totalItems > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Deduction Progress</span>
                <span className="text-sm text-gray-600">
                  {completedItems} of {totalItems} completed
                </span>
              </div>
              <Progress value={(completedItems / totalItems) * 100} className="w-full" />
              {insufficientItems > 0 && (
                <p className="text-sm text-red-600">
                  {insufficientItems} item(s) blocked due to insufficient stock
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AutoDeduction;