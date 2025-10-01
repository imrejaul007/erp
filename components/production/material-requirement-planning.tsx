'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  Package,
  Calendar,
  Download,
  RefreshCw,
  ShoppingCart
} from 'lucide-react';
import { BOM, Material, ProductionBatch } from '@/types/production';

interface MaterialRequirement {
  materialId: string;
  materialName: string;
  materialSku: string;
  requiredQuantity: number;
  availableStock: number;
  shortfall: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
  supplier: string | null;
  leadTime: number | null;
  status: 'sufficient' | 'low' | 'critical';
}

interface MRPProps {
  boms: BOM[];
  materials: Material[];
  productionPlan: ProductionBatch[];
  onGeneratePurchaseOrder: (requirements: MaterialRequirement[]) => void;
}

const MaterialRequirementPlanning: React.FC<MRPProps> = ({
  boms,
  materials,
  productionPlan,
  onGeneratePurchaseOrder
}) => {
  const [planningHorizon, setPlanningHorizon] = useState(30); // days
  const [safetyStock, setSafetyStock] = useState(10); // percentage
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);

  // Calculate material requirements based on BOMs and production plan
  const materialRequirements: MaterialRequirement[] = useMemo(() => {
    const requirements = new Map<string, MaterialRequirement>();

    // Process each BOM in the production plan
    productionPlan.forEach(batch => {
      if (!batch.recipeId) return;

      const bom = boms.find(b => b.recipeId === batch.recipeId && b.isActive);
      if (!bom) return;

      bom.items.forEach(item => {
        const requiredQty = item.quantity * (batch.plannedQuantity / 1); // Assuming 1:1 ratio
        const existing = requirements.get(item.materialId);

        if (existing) {
          existing.requiredQuantity += requiredQty;
        } else {
          const material = materials.find(m => m.id === item.materialId);
          if (!material) return;

          const shortfall = Math.max(0, requiredQty - material.currentStock);
          const status = getStockStatus(material.currentStock, requiredQty, material.minimumStock);

          requirements.set(item.materialId, {
            materialId: item.materialId,
            materialName: material.name,
            materialSku: material.sku,
            requiredQuantity: requiredQty,
            availableStock: material.currentStock,
            shortfall,
            unit: item.unit,
            costPerUnit: item.unitCost,
            totalCost: requiredQty * item.unitCost,
            supplier: material.supplier,
            leadTime: null, // Would need supplier data
            status
          });
        }
      });
    });

    // Apply safety stock calculations
    requirements.forEach((req) => {
      const safetyQty = req.requiredQuantity * (safetyStock / 100);
      req.requiredQuantity += safetyQty;
      req.shortfall = Math.max(0, req.requiredQuantity - req.availableStock);
      req.totalCost = req.requiredQuantity * req.costPerUnit;
    });

    return Array.from(requirements.values()).sort((a, b) =>
      a.status === 'critical' ? -1 : b.status === 'critical' ? 1 : 0
    );
  }, [boms, materials, productionPlan, safetyStock]);

  const getStockStatus = (available: number, required: number, minimum: number): 'sufficient' | 'low' | 'critical' => {
    if (available >= required) return 'sufficient';
    if (available >= minimum) return 'low';
    return 'critical';
  };

  const getStatusBadge = (status: 'sufficient' | 'low' | 'critical') => {
    const variants = {
      sufficient: { variant: 'default' as const, label: 'Sufficient' },
      low: { variant: 'secondary' as const, label: 'Low Stock' },
      critical: { variant: 'destructive' as const, label: 'Critical' }
    };
    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  // Summary calculations
  const summary = useMemo(() => {
    const total = materialRequirements.length;
    const critical = materialRequirements.filter(r => r.status === 'critical').length;
    const low = materialRequirements.filter(r => r.status === 'low').length;
    const sufficient = materialRequirements.filter(r => r.status === 'sufficient').length;
    const totalCost = materialRequirements.reduce((sum, r) => sum + r.totalCost, 0);
    const purchaseCost = materialRequirements
      .filter(r => r.shortfall > 0)
      .reduce((sum, r) => sum + (r.shortfall * r.costPerUnit), 0);

    return { total, critical, low, sufficient, totalCost, purchaseCost };
  }, [materialRequirements]);

  const handleSelectRequirement = (materialId: string) => {
    setSelectedRequirements(prev =>
      prev.includes(materialId)
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const handleSelectAll = () => {
    const shortfallRequirements = materialRequirements
      .filter(r => r.shortfall > 0)
      .map(r => r.materialId);
    setSelectedRequirements(shortfallRequirements);
  };

  const generatePurchaseOrder = () => {
    const selectedReqs = materialRequirements.filter(r =>
      selectedRequirements.includes(r.materialId) && r.shortfall > 0
    );
    onGeneratePurchaseOrder(selectedReqs);
  };

  const exportToCSV = () => {
    const headers = [
      'Material Name', 'SKU', 'Required Qty', 'Available Stock',
      'Shortfall', 'Unit', 'Unit Cost', 'Total Cost', 'Status', 'Supplier'
    ];
    const csvData = [
      headers.join(','),
      ...materialRequirements.map(req => [
        `"${req.materialName}"`,
        `"${req.materialSku}"`,
        req.requiredQuantity,
        req.availableStock,
        req.shortfall,
        `"${req.unit}"`,
        req.costPerUnit.toFixed(2),
        req.totalCost.toFixed(2),
        req.status,
        `"${req.supplier || 'N/A'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `material-requirements-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Material Requirement Planning</h2>
          <p className="text-gray-600">
            Based on {productionPlan.length} planned batches over {planningHorizon} days
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Planning Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="planningHorizon">Planning Horizon (Days)</Label>
              <Input
                id="planningHorizon"
                type="number"
                min="1"
                max="365"
                value={planningHorizon}
                onChange={(e) => setPlanningHorizon(parseInt(e.target.value) || 30)}
              />
            </div>
            <div>
              <Label htmlFor="safetyStock">Safety Stock (%)</Label>
              <Input
                id="safetyStock"
                type="number"
                min="0"
                max="100"
                value={safetyStock}
                onChange={(e) => setSafetyStock(parseInt(e.target.value) || 10)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Materials</p>
                <p className="text-2xl font-bold">{summary.total}</p>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-red-600">{summary.critical}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.low}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sufficient</p>
                <p className="text-2xl font-bold text-green-600">{summary.sufficient}</p>
              </div>
              <Package className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-xl font-bold">${summary.totalCost.toFixed(0)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-600">Purchase Needed</p>
              <p className="text-xl font-bold">${summary.purchaseCost.toFixed(0)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requirements Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Material Requirements</span>
            <div className="flex gap-2">
              {selectedRequirements.length > 0 && (
                <Button onClick={generatePurchaseOrder}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Create PO ({selectedRequirements.length})
                </Button>
              )}
              <Button variant="outline" onClick={handleSelectAll}>
                Select Shortfall Items
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({summary.total})</TabsTrigger>
              <TabsTrigger value="critical">Critical ({summary.critical})</TabsTrigger>
              <TabsTrigger value="low">Low Stock ({summary.low})</TabsTrigger>
              <TabsTrigger value="sufficient">Sufficient ({summary.sufficient})</TabsTrigger>
            </TabsList>

            {(['all', 'critical', 'low', 'sufficient'] as const).map(status => (
              <TabsContent key={status} value={status}>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            checked={selectedRequirements.length > 0}
                            onChange={handleSelectAll}
                            className="w-4 h-4"
                          />
                        </TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead>Required</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Shortfall</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Unit Cost</TableHead>
                        <TableHead>Total Cost</TableHead>
                        <TableHead>Supplier</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materialRequirements
                        .filter(req => status === 'all' || req.status === status)
                        .map(req => (
                          <TableRow key={req.materialId}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedRequirements.includes(req.materialId)}
                                onChange={() => handleSelectRequirement(req.materialId)}
                                disabled={req.shortfall === 0}
                                className="w-4 h-4"
                              />
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{req.materialName}</p>
                                <p className="text-sm text-gray-500">{req.materialSku}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {req.requiredQuantity.toFixed(2)} {req.unit}
                                <Progress
                                  value={Math.min(100, (req.availableStock / req.requiredQuantity) * 100)}
                                  className="w-16 h-2"
                                />
                              </div>
                            </TableCell>
                            <TableCell>{req.availableStock} {req.unit}</TableCell>
                            <TableCell>
                              {req.shortfall > 0 ? (
                                <span className="text-red-600 font-medium">
                                  {req.shortfall.toFixed(2)} {req.unit}
                                </span>
                              ) : (
                                <span className="text-green-600">-</span>
                              )}
                            </TableCell>
                            <TableCell>{getStatusBadge(req.status)}</TableCell>
                            <TableCell>${req.costPerUnit.toFixed(2)}</TableCell>
                            <TableCell>${req.totalCost.toFixed(2)}</TableCell>
                            <TableCell>{req.supplier || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Critical Items Alert */}
      {summary.critical > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Critical Stock Alert:</strong> {summary.critical} material(s) are critically low and may block production.
            Immediate procurement action required.
          </AlertDescription>
        </Alert>
      )}

      {/* Production Plan Impact */}
      {productionPlan.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Production Plan Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productionPlan.map(batch => {
                const bom = boms.find(b => b.recipeId === batch.recipeId && b.isActive);
                const canProduce = bom ? bom.items.every(item => {
                  const material = materials.find(m => m.id === item.materialId);
                  return material && material.currentStock >= (item.quantity * batch.plannedQuantity);
                }) : false;

                return (
                  <div key={batch.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{batch.batchNumber}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {batch.plannedQuantity} {batch.unit} |
                        Start: {new Date(batch.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={canProduce ? "default" : "destructive"}>
                      {canProduce ? "Ready" : "Blocked"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MaterialRequirementPlanning;