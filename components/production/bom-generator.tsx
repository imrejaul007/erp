'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  FileText,
  Plus,
  Save,
  Calculator,
  AlertTriangle,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { Recipe, BOM, BOMItem } from '@/types/production';

interface BOMGeneratorProps {
  recipe: Recipe;
  existingBOMs: BOM[];
  onGenerateBOM: (bomData: Partial<BOM>) => void;
  onUpdateBOM: (bomId: string, bomData: Partial<BOM>) => void;
  onDeleteBOM: (bomId: string) => void;
}

const BOMGenerator: React.FC<BOMGeneratorProps> = ({
  recipe,
  existingBOMs,
  onGenerateBOM,
  onUpdateBOM,
  onDeleteBOM
}) => {
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [bomName, setBomName] = useState(`${recipe.name} - BOM`);
  const [bomVersion, setBomVersion] = useState('1.0');
  const [batchQuantity, setBatchQuantity] = useState(1);
  const [generatedItems, setGeneratedItems] = useState<BOMItem[]>([]);
  const [selectedBOM, setSelectedBOM] = useState<BOM | null>(null);
  const [isViewBOMOpen, setIsViewBOMOpen] = useState(false);

  // Generate BOM items from recipe
  const generateBOMItems = () => {
    const items: BOMItem[] = recipe.ingredients.map((ingredient, index) => {
      const quantity = ingredient.quantity * batchQuantity;
      const unitCost = ingredient.material.costPerUnit;
      const totalCost = quantity * unitCost;

      return {
        id: `temp-${index}`,
        bomId: '',
        materialId: ingredient.materialId,
        quantity,
        unit: ingredient.unit,
        unitCost,
        totalCost,
        notes: ingredient.notes,
        material: ingredient.material
      };
    });

    setGeneratedItems(items);
  };

  // Calculate total BOM cost
  const calculateTotalCost = (items: BOMItem[]) => {
    return items.reduce((sum, item) => sum + item.totalCost, 0);
  };

  // Handle BOM generation
  const handleGenerateBOM = () => {
    if (!bomName.trim() || !bomVersion.trim() || generatedItems.length === 0) {
      return;
    }

    const bomData: Partial<BOM> = {
      recipeId: recipe.id,
      name: bomName,
      version: bomVersion,
      isActive: true,
      totalCost: calculateTotalCost(generatedItems),
      items: generatedItems.map(item => ({
        ...item,
        id: undefined // Let the backend generate new IDs
      }))
    };

    onGenerateBOM(bomData);
    setIsGenerateOpen(false);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setBomName(`${recipe.name} - BOM`);
    setBomVersion('1.0');
    setBatchQuantity(1);
    setGeneratedItems([]);
  };

  // Update BOM item
  const updateBOMItem = (index: number, field: keyof BOMItem, value: any) => {
    setGeneratedItems(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };

      // Recalculate total cost if quantity or unit cost changed
      if (field === 'quantity' || field === 'unitCost') {
        updated[index].totalCost = updated[index].quantity * updated[index].unitCost;
      }

      return updated;
    });
  };

  // Export BOM to CSV
  const exportBOMToCSV = (bom: BOM) => {
    const headers = ['Material Name', 'SKU', 'Quantity', 'Unit', 'Unit Cost', 'Total Cost', 'Notes'];
    const csvData = [
      headers.join(','),
      ...bom.items.map(item =>
        [
          `"${item.material.name}"`,
          `"${item.material.sku}"`,
          item.quantity,
          `"${item.unit}"`,
          item.unitCost.toFixed(2),
          item.totalCost.toFixed(2),
          `"${item.notes || ''}"`
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bom.name.replace(/\s+/g, '_')}_BOM.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Check material availability
  const checkAvailability = (items: BOMItem[]) => {
    return items.filter(item =>
      item.material.currentStock < item.quantity
    );
  };

  const activeBOM = existingBOMs.find(bom => bom.isActive);
  const unavailableItems = generatedItems.length > 0 ? checkAvailability(generatedItems) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Bill of Materials</h2>
          <p className="text-gray-600">Recipe: {recipe.name}</p>
        </div>
        <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
          <DialogTrigger asChild>
            <Button onClick={generateBOMItems}>
              <Plus className="w-4 h-4 mr-2" />
              Generate BOM
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Generate Bill of Materials</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* BOM Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bomName">BOM Name</Label>
                  <Input
                    id="bomName"
                    value={bomName}
                    onChange={(e) => setBomName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="bomVersion">Version</Label>
                  <Input
                    id="bomVersion"
                    value={bomVersion}
                    onChange={(e) => setBomVersion(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="batchQuantity">Batch Quantity</Label>
                  <Input
                    id="batchQuantity"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={batchQuantity}
                    onChange={(e) => {
                      setBatchQuantity(parseFloat(e.target.value) || 1);
                      generateBOMItems();
                    }}
                  />
                </div>
              </div>

              {/* Availability Issues */}
              {unavailableItems.length > 0 && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {unavailableItems.length} material(s) have insufficient stock for this BOM.
                  </AlertDescription>
                </Alert>
              )}

              {/* Generated Items */}
              <div>
                <h3 className="text-lg font-semibold mb-3">BOM Items</h3>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Unit Cost</TableHead>
                        <TableHead>Total Cost</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {generatedItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.material.name}</p>
                              <p className="text-sm text-gray-500">{item.material.sku}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateBOMItem(index, 'quantity', parseFloat(e.target.value) || 0)
                              }
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.unitCost}
                              onChange={(e) =>
                                updateBOMItem(index, 'unitCost', parseFloat(e.target.value) || 0)
                              }
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>${item.totalCost.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={item.material.currentStock >= item.quantity ? "default" : "destructive"}
                            >
                              {item.material.currentStock} {item.material.unitOfMeasure}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.notes || ''}
                              onChange={(e) =>
                                updateBOMItem(index, 'notes', e.target.value)
                              }
                              placeholder="Add notes"
                              className="w-32"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div className="text-lg font-semibold">
                    Total BOM Cost: ${calculateTotalCost(generatedItems).toFixed(2)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsGenerateOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleGenerateBOM}>
                      <Save className="w-4 h-4 mr-2" />
                      Save BOM
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active BOM Card */}
      {activeBOM && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Active BOM: {activeBOM.name}
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Version</p>
                <p className="font-semibold">{activeBOM.version}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Items</p>
                <p className="font-semibold">{activeBOM.items.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="font-semibold">${activeBOM.totalCost.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedBOM(activeBOM);
                    setIsViewBOMOpen(true);
                  }}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => exportBOMToCSV(activeBOM)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* BOM History */}
      <Card>
        <CardHeader>
          <CardTitle>BOM History</CardTitle>
        </CardHeader>
        <CardContent>
          {existingBOMs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No BOMs generated yet</p>
              <p className="text-sm">Generate a BOM from your recipe to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {existingBOMs
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map(bom => (
                  <div key={bom.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{bom.name}</h3>
                          {bom.isActive ? (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>Version: {bom.version}</div>
                          <div>Items: {bom.items.length}</div>
                          <div>Cost: ${bom.totalCost.toFixed(2)}</div>
                          <div>
                            Created: {new Date(bom.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBOM(bom);
                            setIsViewBOMOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => exportBOMToCSV(bom)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {!bom.isActive && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDeleteBOM(bom.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* BOM Viewer Dialog */}
      {selectedBOM && (
        <Dialog open={isViewBOMOpen} onOpenChange={setIsViewBOMOpen}>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>{selectedBOM.name} - Version {selectedBOM.version}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium">Total Cost</p>
                  <p className="text-lg">${selectedBOM.totalCost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-medium">Items</p>
                  <p className="text-lg">{selectedBOM.items.length}</p>
                </div>
                <div>
                  <p className="font-medium">Status</p>
                  <Badge className={selectedBOM.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {selectedBOM.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium">Created</p>
                  <p>{new Date(selectedBOM.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Unit Cost</TableHead>
                      <TableHead>Total Cost</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedBOM.items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.material.name}</TableCell>
                        <TableCell>{item.material.sku}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>${item.unitCost.toFixed(2)}</TableCell>
                        <TableCell>${item.totalCost.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={item.material.currentStock >= item.quantity ? "default" : "destructive"}
                          >
                            {item.material.currentStock} {item.material.unitOfMeasure}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.notes || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BOMGenerator;