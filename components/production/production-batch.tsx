'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Plus,
  Calendar as CalendarIcon,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Edit,
  Trash2,
  Play,
  Pause,
  BarChart3,
  FileText
} from 'lucide-react';
import {
  ProductionBatch,
  Recipe,
  Material,
  ProductionStatus,
  CreateProductionBatchData,
  ProductionInput
} from '@/types/production';
import { format } from 'date-fns';

interface ProductionBatchProps {
  batches: ProductionBatch[];
  recipes: Recipe[];
  materials: Material[];
  onCreateBatch: (batchData: CreateProductionBatchData) => void;
  onUpdateBatch: (batchId: string, updates: Partial<ProductionBatch>) => void;
  onDeleteBatch: (batchId: string) => void;
  onStartBatch: (batchId: string) => void;
}

const ProductionBatchComponent: React.FC<ProductionBatchProps> = ({
  batches,
  recipes,
  materials,
  onCreateBatch,
  onUpdateBatch,
  onDeleteBatch,
  onStartBatch
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<ProductionBatch | null>(null);
  const [batchData, setBatchData] = useState<CreateProductionBatchData>({
    plannedQuantity: 0,
    unit: 'ml',
    startDate: new Date(),
    notes: ''
  });
  const [batchInputs, setBatchInputs] = useState<ProductionInput[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isCreateOpen) {
      setBatchData({
        plannedQuantity: 0,
        unit: 'ml',
        startDate: new Date(),
        notes: ''
      });
      setBatchInputs([]);
      setSelectedRecipe(null);
    }
  }, [isCreateOpen]);

  // Generate batch inputs from recipe
  useEffect(() => {
    if (selectedRecipe && batchData.plannedQuantity > 0) {
      const inputs: ProductionInput[] = selectedRecipe.ingredients.map(ingredient => ({
        id: `temp-${ingredient.id}`,
        batchId: '',
        materialId: ingredient.materialId,
        plannedQuantity: ingredient.quantity * (batchData.plannedQuantity / selectedRecipe.yieldQuantity),
        actualQuantity: undefined,
        unit: ingredient.unit,
        costPerUnit: ingredient.material.costPerUnit,
        totalCost: 0,
        notes: ingredient.notes,
        material: ingredient.material
      }));

      setBatchInputs(inputs);
    }
  }, [selectedRecipe, batchData.plannedQuantity]);

  // Calculate total cost
  const totalCost = batchInputs.reduce(
    (sum, input) => sum + (input.plannedQuantity * input.costPerUnit), 0
  );

  const handleCreateBatch = () => {
    if (!batchData.plannedQuantity || batchData.plannedQuantity <= 0) return;

    const batchDataWithInputs: CreateProductionBatchData = {
      ...batchData,
      recipeId: selectedRecipe?.id,
      inputs: batchInputs.map(input => ({
        materialId: input.materialId,
        plannedQuantity: input.plannedQuantity,
        actualQuantity: input.actualQuantity,
        unit: input.unit,
        costPerUnit: input.costPerUnit,
        notes: input.notes
      }))
    };

    onCreateBatch(batchDataWithInputs);
    setIsCreateOpen(false);
  };

  const updateBatchInput = (index: number, field: keyof ProductionInput, value: any) => {
    setBatchInputs(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };

      // Recalculate total cost
      if (field === 'plannedQuantity' || field === 'costPerUnit') {
        updated[index].totalCost = updated[index].plannedQuantity * updated[index].costPerUnit;
      }

      return updated;
    });
  };

  const getStatusBadge = (status: ProductionStatus) => {
    const variants = {
      [ProductionStatus.PLANNED]: { variant: 'outline' as const, label: 'Planned', icon: Calendar },
      [ProductionStatus.IN_PROGRESS]: { variant: 'default' as const, label: 'In Progress', icon: Clock },
      [ProductionStatus.AGING]: { variant: 'secondary' as const, label: 'Aging', icon: Clock },
      [ProductionStatus.COMPLETED]: { variant: 'default' as const, label: 'Completed', icon: CheckCircle },
      [ProductionStatus.CANCELLED]: { variant: 'destructive' as const, label: 'Cancelled', icon: AlertTriangle },
      [ProductionStatus.ON_HOLD]: { variant: 'secondary' as const, label: 'On Hold', icon: Pause }
    };

    const { variant, label, icon: Icon } = variants[status];
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  // Group batches by status for summary
  const batchesByStatus = batches.reduce((acc, batch) => {
    acc[batch.status] = (acc[batch.status] || 0) + 1;
    return acc;
  }, {} as Record<ProductionStatus, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Production Batches</h2>
          <p className="text-gray-600">Create and manage production batches</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create Production Batch</DialogTitle>
            </DialogHeader>
            <CreateBatchContent
              batchData={batchData}
              setBatchData={setBatchData}
              batchInputs={batchInputs}
              selectedRecipe={selectedRecipe}
              setSelectedRecipe={setSelectedRecipe}
              recipes={recipes}
              materials={materials}
              totalCost={totalCost}
              updateBatchInput={updateBatchInput}
              onSave={handleCreateBatch}
              onCancel={() => setIsCreateOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Batches</p>
                <p className="text-2xl font-bold">{batches.length}</p>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {Object.entries(ProductionStatus).map(([key, status]) => {
          const count = batchesByStatus[status] || 0;
          const colors = {
            [ProductionStatus.PLANNED]: 'text-blue-600',
            [ProductionStatus.IN_PROGRESS]: 'text-green-600',
            [ProductionStatus.AGING]: 'text-purple-600',
            [ProductionStatus.COMPLETED]: 'text-emerald-600',
            [ProductionStatus.CANCELLED]: 'text-red-600',
            [ProductionStatus.ON_HOLD]: 'text-yellow-600'
          };

          return (
            <Card key={status}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 capitalize">
                    {status.toLowerCase().replace('_', ' ')}
                  </p>
                  <p className={`text-2xl font-bold ${colors[status]}`}>{count}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Batch Management Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="aging">Aging</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All Batches</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <BatchTable
                batches={batches.filter(b =>
                  [ProductionStatus.PLANNED, ProductionStatus.IN_PROGRESS].includes(b.status)
                )}
                onUpdateBatch={onUpdateBatch}
                onDeleteBatch={onDeleteBatch}
                onStartBatch={onStartBatch}
                onViewDetails={setSelectedBatch}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>

            <TabsContent value="aging">
              <BatchTable
                batches={batches.filter(b => b.status === ProductionStatus.AGING)}
                onUpdateBatch={onUpdateBatch}
                onDeleteBatch={onDeleteBatch}
                onStartBatch={onStartBatch}
                onViewDetails={setSelectedBatch}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>

            <TabsContent value="completed">
              <BatchTable
                batches={batches.filter(b =>
                  [ProductionStatus.COMPLETED, ProductionStatus.CANCELLED].includes(b.status)
                )}
                onUpdateBatch={onUpdateBatch}
                onDeleteBatch={onDeleteBatch}
                onStartBatch={onStartBatch}
                onViewDetails={setSelectedBatch}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>

            <TabsContent value="all">
              <BatchTable
                batches={batches}
                onUpdateBatch={onUpdateBatch}
                onDeleteBatch={onDeleteBatch}
                onStartBatch={onStartBatch}
                onViewDetails={setSelectedBatch}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Batch Details Dialog */}
      {selectedBatch && (
        <Dialog open={!!selectedBatch} onOpenChange={() => setSelectedBatch(null)}>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>Batch Details - {selectedBatch.batchNumber}</DialogTitle>
            </DialogHeader>
            <BatchDetailsContent
              batch={selectedBatch}
              getStatusBadge={getStatusBadge}
              onUpdateBatch={onUpdateBatch}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Create Batch Content Component
interface CreateBatchContentProps {
  batchData: CreateProductionBatchData;
  setBatchData: (data: CreateProductionBatchData) => void;
  batchInputs: ProductionInput[];
  selectedRecipe: Recipe | null;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  recipes: Recipe[];
  materials: Material[];
  totalCost: number;
  updateBatchInput: (index: number, field: keyof ProductionInput, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

const CreateBatchContent: React.FC<CreateBatchContentProps> = ({
  batchData,
  setBatchData,
  batchInputs,
  selectedRecipe,
  setSelectedRecipe,
  recipes,
  materials,
  totalCost,
  updateBatchInput,
  onSave,
  onCancel
}) => {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Recipe (Optional)</Label>
          <Select
            value={selectedRecipe?.id || ''}
            onValueChange={(value) => {
              const recipe = recipes.find(r => r.id === value) || null;
              setSelectedRecipe(recipe);
              setBatchData(prev => ({ ...prev, recipeId: value || undefined }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select recipe" />
            </SelectTrigger>
            <SelectContent>
              {recipes.map(recipe => (
                <SelectItem key={recipe.id} value={recipe.id}>
                  {recipe.name} (Yield: {recipe.yieldQuantity} {recipe.yieldUnit})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Planned Quantity *</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.1"
              value={batchData.plannedQuantity}
              onChange={(e) =>
                setBatchData(prev => ({
                  ...prev,
                  plannedQuantity: parseFloat(e.target.value) || 0
                }))
              }
              placeholder="0"
            />
            <Select
              value={batchData.unit}
              onValueChange={(value) =>
                setBatchData(prev => ({ ...prev, unit: value }))
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ml">ml</SelectItem>
                <SelectItem value="liters">L</SelectItem>
                <SelectItem value="grams">g</SelectItem>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="pieces">pcs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Start Date */}
      <div>
        <Label>Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {batchData.startDate ? format(batchData.startDate, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={batchData.startDate}
              onSelect={(date) =>
                setBatchData(prev => ({ ...prev, startDate: date || new Date() }))
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Batch Inputs */}
      {batchInputs.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Material Requirements</h3>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Planned Qty</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Available Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batchInputs.map((input, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{input.material.name}</p>
                        <p className="text-sm text-gray-500">{input.material.sku}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.1"
                        value={input.plannedQuantity}
                        onChange={(e) =>
                          updateBatchInput(index, 'plannedQuantity', parseFloat(e.target.value) || 0)
                        }
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>{input.unit}</TableCell>
                    <TableCell>${input.costPerUnit.toFixed(2)}</TableCell>
                    <TableCell>${(input.plannedQuantity * input.costPerUnit).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={input.material.currentStock >= input.plannedQuantity ? "default" : "destructive"}
                      >
                        {input.material.currentStock} {input.material.unitOfMeasure}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="p-4 bg-gray-50 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Estimated Cost:</span>
                <span className="text-lg font-bold">${totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={batchData.notes}
          onChange={(e) =>
            setBatchData(prev => ({ ...prev, notes: e.target.value }))
          }
          placeholder="Add any notes about this batch..."
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={!batchData.plannedQuantity || batchData.plannedQuantity <= 0}
        >
          Create Batch
        </Button>
      </div>
    </div>
  );
};

// Batch Table Component
interface BatchTableProps {
  batches: ProductionBatch[];
  onUpdateBatch: (batchId: string, updates: Partial<ProductionBatch>) => void;
  onDeleteBatch: (batchId: string) => void;
  onStartBatch: (batchId: string) => void;
  onViewDetails: (batch: ProductionBatch) => void;
  getStatusBadge: (status: ProductionStatus) => React.ReactNode;
}

const BatchTable: React.FC<BatchTableProps> = ({
  batches,
  onUpdateBatch,
  onDeleteBatch,
  onStartBatch,
  onViewDetails,
  getStatusBadge
}) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Batch Number</TableHead>
            <TableHead>Recipe</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No batches found
              </TableCell>
            </TableRow>
          ) : (
            batches.map(batch => {
              const progress = batch.status === ProductionStatus.COMPLETED ? 100 :
                             batch.status === ProductionStatus.IN_PROGRESS ? 50 :
                             batch.status === ProductionStatus.AGING ? 75 : 0;

              return (
                <TableRow key={batch.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{batch.batchNumber}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(batch.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {batch.recipe ? (
                      <div>
                        <p className="font-medium">{batch.recipe.name}</p>
                        <p className="text-sm text-gray-600">{batch.recipe.category}</p>
                      </div>
                    ) : (
                      <span className="text-gray-500">No recipe</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{batch.plannedQuantity} {batch.unit}</p>
                      {batch.actualQuantity && (
                        <p className="text-sm text-gray-600">
                          Actual: {batch.actualQuantity} {batch.unit}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(batch.status)}</TableCell>
                  <TableCell>{format(new Date(batch.startDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="w-16" />
                      <span className="text-sm">{progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {batch.status === ProductionStatus.PLANNED && (
                        <Button size="sm" onClick={() => onStartBatch(batch.id)}>
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewDetails(batch)}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDeleteBatch(batch.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// Batch Details Content Component
interface BatchDetailsContentProps {
  batch: ProductionBatch;
  getStatusBadge: (status: ProductionStatus) => React.ReactNode;
  onUpdateBatch: (batchId: string, updates: Partial<ProductionBatch>) => void;
}

const BatchDetailsContent: React.FC<BatchDetailsContentProps> = ({
  batch,
  getStatusBadge,
  onUpdateBatch
}) => {
  return (
    <div className="space-y-6">
      {/* Batch Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-600">Status</p>
          {getStatusBadge(batch.status)}
        </div>
        <div>
          <p className="text-sm text-gray-600">Planned Quantity</p>
          <p className="font-semibold">{batch.plannedQuantity} {batch.unit}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Actual Quantity</p>
          <p className="font-semibold">
            {batch.actualQuantity ? `${batch.actualQuantity} ${batch.unit}` : 'TBD'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Started</p>
          <p className="font-semibold">{format(new Date(batch.startDate), 'PPP')}</p>
        </div>
      </div>

      {/* Recipe Information */}
      {batch.recipe && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Recipe: {batch.recipe.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="font-medium">{batch.recipe.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Version</p>
              <p className="font-medium">{batch.recipe.version}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Expected Yield</p>
              <p className="font-medium">{batch.recipe.yieldQuantity} {batch.recipe.yieldUnit}</p>
            </div>
          </div>
        </div>
      )}

      {/* Inputs and Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Inputs</h3>
          {batch.inputs.length === 0 ? (
            <p className="text-gray-500">No inputs recorded</p>
          ) : (
            <div className="space-y-2">
              {batch.inputs.map(input => (
                <div key={input.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{input.material.name}</p>
                    <p className="text-sm text-gray-600">
                      Planned: {input.plannedQuantity} {input.unit}
                      {input.actualQuantity && ` | Actual: ${input.actualQuantity} ${input.unit}`}
                    </p>
                  </div>
                  <p className="font-medium">${input.totalCost.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Outputs</h3>
          {batch.outputs.length === 0 ? (
            <p className="text-gray-500">No outputs recorded</p>
          ) : (
            <div className="space-y-2">
              {batch.outputs.map(output => (
                <div key={output.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{output.material.name}</p>
                    <p className="text-sm text-gray-600">{output.quantity} {output.unit}</p>
                  </div>
                  <p className="font-medium">${output.totalCost.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Aging Information */}
      {(batch.agingStartDate || batch.agingDays) && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Aging Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {batch.agingStartDate && (
              <div>
                <p className="text-sm text-gray-600">Aging Started</p>
                <p className="font-medium">{format(new Date(batch.agingStartDate), 'PPP')}</p>
              </div>
            )}
            {batch.agingDays && (
              <div>
                <p className="text-sm text-gray-600">Aging Period</p>
                <p className="font-medium">{batch.agingDays} days</p>
              </div>
            )}
            {batch.agingEndDate && (
              <div>
                <p className="text-sm text-gray-600">Expected Completion</p>
                <p className="font-medium">{format(new Date(batch.agingEndDate), 'PPP')}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {batch.notes && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Notes</h3>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p>{batch.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionBatchComponent;