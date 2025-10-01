'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Beaker,
  Plus,
  Minus,
  Droplets,
  Scale,
  Calculator,
  CheckCircle,
  AlertTriangle,
  Eye,
  Trash2
} from 'lucide-react';

// Base oils and materials for custom mixing
const baseMaterials = [
  {
    id: 'OIL001',
    name: 'Oud Oil - Cambodian',
    nameArabic: 'عود كمبودي',
    category: 'Base Oil',
    pricePerMl: 850,
    stock: 50,
    concentration: 100,
    notes: ['Woody', 'Smoky', 'Animalic']
  },
  {
    id: 'OIL002',
    name: 'Rose Otto',
    nameArabic: 'زيت الورد',
    category: 'Floral Oil',
    pricePerMl: 450,
    stock: 30,
    concentration: 100,
    notes: ['Floral', 'Sweet', 'Romantic']
  },
  {
    id: 'OIL003',
    name: 'Sandalwood Oil',
    nameArabic: 'زيت الصندل',
    category: 'Base Oil',
    pricePerMl: 320,
    stock: 75,
    concentration: 100,
    notes: ['Woody', 'Creamy', 'Warm']
  },
  {
    id: 'OIL004',
    name: 'Amber Extract',
    nameArabic: 'خلاصة العنبر',
    category: 'Resin',
    pricePerMl: 280,
    stock: 40,
    concentration: 80,
    notes: ['Sweet', 'Warm', 'Animalic']
  },
  {
    id: 'OIL005',
    name: 'Jasmine Absolute',
    nameArabic: 'زيت الياسمين',
    category: 'Floral Oil',
    pricePerMl: 380,
    stock: 25,
    concentration: 100,
    notes: ['Floral', 'Intoxicating', 'Sweet']
  },
  {
    id: 'CARRIER001',
    name: 'Jojoba Oil',
    nameArabic: 'زيت الجوجوبا',
    category: 'Carrier Oil',
    pricePerMl: 8,
    stock: 500,
    concentration: 0,
    notes: ['Neutral', 'Carrier']
  }
];

// Pre-defined formulas
const predefinedFormulas = [
  {
    id: 'FORMULA001',
    name: 'Royal Blend',
    nameArabic: 'الخلطة الملكية',
    description: 'Traditional royal blend with oud and rose',
    ingredients: [
      { materialId: 'OIL001', percentage: 40, ml: 4.0 },
      { materialId: 'OIL002', percentage: 30, ml: 3.0 },
      { materialId: 'OIL003', percentage: 20, ml: 2.0 },
      { materialId: 'CARRIER001', percentage: 10, ml: 1.0 }
    ],
    totalMl: 10,
    estimatedPrice: 450
  },
  {
    id: 'FORMULA002',
    name: 'Floral Garden',
    nameArabic: 'حديقة الزهور',
    description: 'Light floral blend perfect for daily wear',
    ingredients: [
      { materialId: 'OIL002', percentage: 35, ml: 3.5 },
      { materialId: 'OIL005', percentage: 25, ml: 2.5 },
      { materialId: 'OIL004', percentage: 15, ml: 1.5 },
      { materialId: 'CARRIER001', percentage: 25, ml: 2.5 }
    ],
    totalMl: 10,
    estimatedPrice: 280
  }
];

interface CustomMixingProps {
  onAddToCart: (mixture: any) => void;
}

export default function CustomMixing({ onAddToCart }: CustomMixingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormula, setSelectedFormula] = useState<any>(null);
  const [customIngredients, setCustomIngredients] = useState<any[]>([]);
  const [targetVolume, setTargetVolume] = useState(10);
  const [targetUnit, setTargetUnit] = useState('ml');
  const [mixtureName, setMixtureName] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Convert units for target volume
  const getVolumeInMl = () => {
    switch (targetUnit) {
      case 'tola': return targetVolume * 11.66;
      case 'oz': return targetVolume * 29.57;
      default: return targetVolume;
    }
  };

  // Add ingredient to custom mixture
  const addIngredient = () => {
    setCustomIngredients([...customIngredients, {
      materialId: '',
      percentage: 0,
      ml: 0,
      notes: ''
    }]);
  };

  // Update ingredient
  const updateIngredient = (index: number, field: string, value: any) => {
    const updated = customIngredients.map((ingredient, i) => {
      if (i === index) {
        const newIngredient = { ...ingredient, [field]: value };

        // Auto-calculate ml based on percentage
        if (field === 'percentage') {
          newIngredient.ml = (value / 100) * getVolumeInMl();
        }

        return newIngredient;
      }
      return ingredient;
    });
    setCustomIngredients(updated);
  };

  // Remove ingredient
  const removeIngredient = (index: number) => {
    setCustomIngredients(customIngredients.filter((_, i) => i !== index));
  };

  // Load predefined formula
  const loadFormula = (formula: any) => {
    setSelectedFormula(formula);
    setMixtureName(formula.name);

    // Scale ingredients to target volume
    const scaleFactor = getVolumeInMl() / formula.totalMl;
    const scaledIngredients = formula.ingredients.map((ingredient: any) => ({
      ...ingredient,
      ml: ingredient.ml * scaleFactor
    }));

    setCustomIngredients(scaledIngredients);
  };

  // Calculate totals
  const calculateTotals = () => {
    const totalPercentage = customIngredients.reduce((sum, ing) => sum + (ing.percentage || 0), 0);
    const totalMl = customIngredients.reduce((sum, ing) => sum + (ing.ml || 0), 0);
    const totalCost = customIngredients.reduce((sum, ing) => {
      const material = baseMaterials.find(m => m.id === ing.materialId);
      return sum + (material ? material.pricePerMl * (ing.ml || 0) : 0);
    }, 0);

    return { totalPercentage, totalMl, totalCost };
  };

  // Check if mixture is valid
  const isValidMixture = () => {
    const totals = calculateTotals();
    return (
      customIngredients.length > 0 &&
      Math.abs(totals.totalPercentage - 100) < 1 &&
      totals.totalMl > 0 &&
      mixtureName.trim() !== '' &&
      customIngredients.every(ing => ing.materialId && ing.percentage > 0)
    );
  };

  // Add mixture to cart
  const addMixtureToCart = () => {
    const totals = calculateTotals();

    const mixture = {
      id: `MIX-${Date.now()}`,
      name: mixtureName,
      type: 'Custom Mixture',
      ingredients: customIngredients.map(ing => {
        const material = baseMaterials.find(m => m.id === ing.materialId);
        return {
          ...ing,
          material: material,
          cost: material ? material.pricePerMl * ing.ml : 0
        };
      }),
      volume: totals.totalMl,
      unit: 'ml',
      totalCost: totals.totalCost,
      customerNotes,
      createdAt: new Date().toISOString()
    };

    onAddToCart(mixture);

    // Reset form
    setCustomIngredients([]);
    setMixtureName('');
    setCustomerNotes('');
    setSelectedFormula(null);
    setIsOpen(false);
  };

  const totals = calculateTotals();
  const isValid = isValidMixture();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Beaker className="h-4 w-4 mr-2" />
          Custom Mixing
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Beaker className="h-5 w-5 mr-2 text-amber-600" />
            Custom Perfume Mixing
          </DialogTitle>
          <DialogDescription>
            Create custom perfume blends using our premium oils and materials
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Formulas and Controls */}
          <div className="space-y-4">
            {/* Target Volume */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Target Volume</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={targetVolume}
                    onChange={(e) => setTargetVolume(parseFloat(e.target.value) || 0)}
                    placeholder="Volume"
                    className="flex-1"
                  />
                  <Select value={targetUnit} onValueChange={setTargetUnit}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="tola">tola</SelectItem>
                      <SelectItem value="oz">oz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-gray-500">
                  = {getVolumeInMl().toFixed(2)} ml
                </p>
              </CardContent>
            </Card>

            {/* Predefined Formulas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quick Formulas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {predefinedFormulas.map((formula) => (
                  <Button
                    key={formula.id}
                    variant={selectedFormula?.id === formula.id ? "default" : "outline"}
                    onClick={() => loadFormula(formula)}
                    className="w-full justify-start text-left h-auto p-3"
                  >
                    <div>
                      <div className="font-medium text-sm">{formula.name}</div>
                      <div className="text-xs text-gray-600">{formula.nameArabic}</div>
                      <div className="text-xs text-gray-500 mt-1">{formula.description}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Mixture Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Mixture Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Mixture Name</Label>
                  <Input
                    value={mixtureName}
                    onChange={(e) => setMixtureName(e.target.value)}
                    placeholder="Enter custom name"
                  />
                </div>
                <div>
                  <Label className="text-xs">Customer Notes</Label>
                  <Input
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Special instructions"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Panel - Ingredients */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Ingredients</CardTitle>
                  <Button onClick={addIngredient} size="sm">
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {customIngredients.map((ingredient, index) => (
                    <Card key={index} className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Material</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeIngredient(index)}
                            className="h-6 w-6 p-0 text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <Select
                          value={ingredient.materialId}
                          onValueChange={(value) => updateIngredient(index, 'materialId', value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                          <SelectContent>
                            {baseMaterials.map((material) => (
                              <SelectItem key={material.id} value={material.id}>
                                <div>
                                  <div className="font-medium">{material.name}</div>
                                  <div className="text-xs text-gray-600">
                                    AED {material.pricePerMl}/ml • {material.stock}ml stock
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Percentage</Label>
                            <Input
                              type="number"
                              value={ingredient.percentage}
                              onChange={(e) => updateIngredient(index, 'percentage', parseFloat(e.target.value) || 0)}
                              placeholder="%"
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Amount (ml)</Label>
                            <Input
                              type="number"
                              value={ingredient.ml.toFixed(2)}
                              readOnly
                              className="h-8 bg-gray-50"
                            />
                          </div>
                        </div>

                        {ingredient.materialId && (
                          <div className="text-xs text-gray-600">
                            {(() => {
                              const material = baseMaterials.find(m => m.id === ingredient.materialId);
                              return material ? (
                                <div>
                                  <div>Cost: AED {(material.pricePerMl * ingredient.ml).toFixed(2)}</div>
                                  <div>Notes: {material.notes.join(', ')}</div>
                                </div>
                              ) : null;
                            })()}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}

                  {customIngredients.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Droplets className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No ingredients added</p>
                      <p className="text-xs">Add materials to create your blend</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Summary and Validation */}
          <div className="space-y-4">
            {/* Totals */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Mixture Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Percentage:</span>
                    <span className={totals.totalPercentage === 100 ? 'text-green-600' : 'text-red-600'}>
                      {totals.totalPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Volume:</span>
                    <span>{totals.totalMl.toFixed(2)} ml</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Material Cost:</span>
                    <span>AED {totals.totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labor Charge:</span>
                    <span>AED {(totals.totalCost * 0.3).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Final Price:</span>
                    <span className="text-amber-600">AED {(totals.totalCost * 1.3).toFixed(2)}</span>
                  </div>
                </div>

                {/* Validation Status */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {Math.abs(totals.totalPercentage - 100) < 1 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-xs">
                      Percentage: {Math.abs(totals.totalPercentage - 100) < 1 ? 'Valid' : 'Invalid'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {customIngredients.length > 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-xs">
                      Ingredients: {customIngredients.length > 0 ? 'Added' : 'None'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {mixtureName.trim() ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-xs">
                      Name: {mixtureName.trim() ? 'Set' : 'Required'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stock Check */}
            {customIngredients.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Stock Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {customIngredients.map((ingredient, index) => {
                      const material = baseMaterials.find(m => m.id === ingredient.materialId);
                      if (!material) return null;

                      const hasStock = material.stock >= ingredient.ml;

                      return (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className="truncate">{material.name}</span>
                          <div className="flex items-center space-x-1">
                            {hasStock ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-3 w-3 text-red-600" />
                            )}
                            <span>{ingredient.ml.toFixed(1)}/{material.stock}ml</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <Button
                onClick={addMixtureToCart}
                disabled={!isValid}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Cart - AED {(totals.totalCost * 1.3).toFixed(2)}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}