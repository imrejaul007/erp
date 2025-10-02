'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Beaker, Plus, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function StartBatchPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    productName: '',
    batchNumber: `BATCH-${Date.now()}`,
    targetQuantity: '',
    unit: 'ml',
    startDate: new Date().toISOString().split('T')[0],
    estimatedCompletion: '',
    notes: '',
  });

  const [materials, setMaterials] = useState([
    { id: 1, name: '', quantity: '', unit: 'ml', cost: '' }
  ]);

  const availableMaterials = [
    { id: 'MAT-001', name: 'Oud Wood - Grade A', stock: 250, unit: 'kg' },
    { id: 'MAT-002', name: 'Rose Extract', stock: 150, unit: 'ml' },
    { id: 'MAT-003', name: 'Sandalwood Oil', stock: 300, unit: 'ml' },
    { id: 'MAT-004', name: 'Amber Essence', stock: 200, unit: 'ml' },
    { id: 'MAT-005', name: 'Musk Powder', stock: 100, unit: 'gram' },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addMaterial = () => {
    setMaterials([...materials, { id: Date.now(), name: '', quantity: '', unit: 'ml', cost: '' }]);
  };

  const removeMaterial = (id: number) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const updateMaterial = (id: number, field: string, value: string) => {
    setMaterials(materials.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Production batch created successfully!');
    router.push('/production');
  };

  const calculateTotalCost = () => {
    return materials.reduce((sum, m) => sum + (parseFloat(m.cost) || 0), 0);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Beaker className="h-8 w-8 text-purple-600" />
            Start Production Batch
          </h1>
          <p className="text-muted-foreground">Create a new production batch with materials</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Batch Details */}
        <Card>
          <CardHeader>
            <CardTitle>Batch Information</CardTitle>
            <CardDescription>Basic details about the production batch</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => handleChange('productName', e.target.value)}
                  placeholder="Royal Oud Premium"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="batchNumber">Batch Number</Label>
                <Input
                  id="batchNumber"
                  value={formData.batchNumber}
                  onChange={(e) => handleChange('batchNumber', e.target.value)}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetQuantity">Target Quantity *</Label>
                <div className="flex gap-2">
                  <Input
                    id="targetQuantity"
                    type="number"
                    value={formData.targetQuantity}
                    onChange={(e) => handleChange('targetQuantity', e.target.value)}
                    placeholder="1000"
                    required
                    className="flex-1"
                  />
                  <Select value={formData.unit} onValueChange={(value) => handleChange('unit', value)}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="gram">gram</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="liter">liter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedCompletion">Estimated Completion</Label>
                <Input
                  id="estimatedCompletion"
                  type="date"
                  value={formData.estimatedCompletion}
                  onChange={(e) => handleChange('estimatedCompletion', e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Additional batch information..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Materials */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Raw Materials</CardTitle>
                <CardDescription>Select and specify materials for this batch</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addMaterial}>
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {materials.map((material, index) => (
                <div key={material.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold">Material #{index + 1}</h3>
                    {materials.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMaterial(material.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Material Name</Label>
                      <Select
                        value={material.name}
                        onValueChange={(value) => updateMaterial(material.id, 'name', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableMaterials.map((mat) => (
                            <SelectItem key={mat.id} value={mat.name}>
                              {mat.name} (Stock: {mat.stock} {mat.unit})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={material.quantity}
                          onChange={(e) => updateMaterial(material.id, 'quantity', e.target.value)}
                          placeholder="100"
                          className="flex-1"
                        />
                        <Select
                          value={material.unit}
                          onValueChange={(value) => updateMaterial(material.id, 'unit', value)}
                        >
                          <SelectTrigger className="w-[80px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ml">ml</SelectItem>
                            <SelectItem value="gram">g</SelectItem>
                            <SelectItem value="kg">kg</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Cost (AED)</Label>
                      <Input
                        type="number"
                        value={material.cost}
                        onChange={(e) => updateMaterial(material.id, 'cost', e.target.value)}
                        placeholder="850"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Cost Summary */}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Total Material Cost</span>
                  <span className="text-2xl font-bold text-green-600">
                    AED {calculateTotalCost().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning */}
        <Card className="mt-6 bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Production Notes</h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Ensure all materials are available before starting production</li>
                  <li>• Quality control checks will be required at key stages</li>
                  <li>• Document any wastage or deviations from the plan</li>
                  <li>• Batch will be automatically assigned to production queue</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
            <Save className="h-4 w-4 mr-2" />
            Start Production Batch
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
