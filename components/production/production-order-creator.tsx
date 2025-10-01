'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, AlertTriangle, CheckCircle, Calculator, User, Package, Clock, Target } from 'lucide-react';
import { format } from 'date-fns';

interface ProductionOrderData {
  recipeId: string;
  recipeName: string;
  batchSize: number;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  operator: string;
  supervisor: string;
  scheduledDate: Date | null;
  expectedCompletion: Date | null;
  customerOrder?: string;
  salesOrder?: string;
  notes: string;
  requiredMaterials: Array<{
    material: string;
    required: number;
    available: number;
    unit: string;
    sufficient: boolean;
  }>;
}

const recipes = [
  {
    id: 'RCP-001',
    name: 'Royal Oud Premium - 30ml',
    nameArabic: 'العود الملكي الفاخر - ٣٠ مل',
    batchSize: 100,
    estimatedTime: 45, // days
    category: 'Finished Perfume',
    materials: [
      { material: 'Cambodian Oud Oil', required: 4.5, unit: 'ml', available: 125 },
      { material: 'Ethyl Alcohol 95%', required: 24, unit: 'ml', available: 500 },
      { material: 'Rose Otto', required: 0.9, unit: 'ml', available: 15 },
      { material: 'Fixative Base', required: 0.6, unit: 'ml', available: 50 }
    ]
  },
  {
    id: 'RCP-002',
    name: 'Oud Oil Distillation',
    nameArabic: 'تقطير زيت العود',
    batchSize: 1,
    estimatedTime: 95, // days
    category: 'Semi-Finished Oil',
    materials: [
      { material: 'Cambodian Oud Chips Premium', required: 2500, unit: 'gram', available: 5500 }
    ]
  },
  {
    id: 'RCP-003',
    name: 'Amber Essence Deluxe',
    nameArabic: 'جوهر العنبر الفاخر',
    batchSize: 50,
    estimatedTime: 21, // days
    category: 'Finished Perfume',
    materials: [
      { material: 'Amber Resin', required: 5, unit: 'gram', available: 100 },
      { material: 'Sandalwood Oil', required: 10, unit: 'ml', available: 75 },
      { material: 'Ethyl Alcohol 95%', required: 15, unit: 'ml', available: 500 }
    ]
  }
];

const operators = [
  { id: 'OP001', name: 'Ahmed Al-Rashid', nameArabic: 'أحمد الراشد', specialization: 'Distillation & Oils', experience: '8 years' },
  { id: 'OP002', name: 'Fatima Hassan', nameArabic: 'فاطمة حسن', specialization: 'Perfume Blending', experience: '5 years' },
  { id: 'OP003', name: 'Hassan Ali', nameArabic: 'حسن علي', specialization: 'Raw Material Processing', experience: '6 years' },
  { id: 'OP004', name: 'Mariam Saeed', nameArabic: 'مريم سعيد', specialization: 'Quality Control', experience: '4 years' },
  { id: 'OP005', name: 'Omar Khalil', nameArabic: 'عمر خليل', specialization: 'Packaging & Finishing', experience: '3 years' }
];

const supervisors = [
  { id: 'SUP001', name: 'Omar Saeed', nameArabic: 'عمر سعيد', department: 'Production Manager' },
  { id: 'SUP002', name: 'Aisha Mohammed', nameArabic: 'عائشة محمد', department: 'Quality Supervisor' },
  { id: 'SUP003', name: 'Khalid Rashid', nameArabic: 'خالد راشد', department: 'Technical Supervisor' }
];

export function ProductionOrderCreator() {
  const [isOpen, setIsOpen] = useState(false);
  const [orderData, setOrderData] = useState<ProductionOrderData>({
    recipeId: '',
    recipeName: '',
    batchSize: 1,
    priority: 'Medium',
    operator: '',
    supervisor: '',
    scheduledDate: null,
    expectedCompletion: null,
    notes: '',
    requiredMaterials: []
  });

  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  const handleRecipeChange = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
      setSelectedRecipe(recipe);
      setOrderData(prev => ({
        ...prev,
        recipeId,
        recipeName: recipe.name,
        batchSize: recipe.batchSize,
        requiredMaterials: recipe.materials.map(material => ({
          ...material,
          sufficient: material.available >= material.required
        }))
      }));

      // Calculate expected completion
      if (orderData.scheduledDate) {
        const completion = new Date(orderData.scheduledDate);
        completion.setDate(completion.getDate() + recipe.estimatedTime);
        setOrderData(prev => ({ ...prev, expectedCompletion: completion }));
      }
    }
  };

  const handleScheduledDateChange = (date: Date | null) => {
    setOrderData(prev => ({ ...prev, scheduledDate: date }));

    if (date && selectedRecipe) {
      const completion = new Date(date);
      completion.setDate(completion.getDate() + selectedRecipe.estimatedTime);
      setOrderData(prev => ({ ...prev, expectedCompletion: completion }));
    }
  };

  const calculateMaterialRequirements = () => {
    if (!selectedRecipe) return;

    const scalingFactor = orderData.batchSize / selectedRecipe.batchSize;
    const scaledMaterials = selectedRecipe.materials.map(material => ({
      ...material,
      required: material.required * scalingFactor,
      sufficient: material.available >= (material.required * scalingFactor)
    }));

    setOrderData(prev => ({ ...prev, requiredMaterials: scaledMaterials }));
  };

  const canCreateOrder = () => {
    return orderData.recipeId &&
           orderData.operator &&
           orderData.supervisor &&
           orderData.scheduledDate &&
           orderData.requiredMaterials.every(material => material.sufficient);
  };

  const createProductionOrder = () => {
    if (!canCreateOrder()) return;

    // Generate batch number
    const today = new Date();
    const batchNumber = `${selectedRecipe?.category === 'Finished Perfume' ? 'FP' :
                         selectedRecipe?.category === 'Semi-Finished Oil' ? 'SF' : 'RM'}-${
                         String(today.getFullYear()).slice(-2)}${
                         String(today.getMonth() + 1).padStart(2, '0')}-${
                         String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

    // Here you would normally save to database
    console.log('Creating production order:', {
      ...orderData,
      batchNumber,
      status: 'Scheduled',
      createdAt: new Date(),
      createdBy: 'Current User'
    });

    setIsOpen(false);
    // Reset form
    setOrderData({
      recipeId: '',
      recipeName: '',
      batchSize: 1,
      priority: 'Medium',
      operator: '',
      supervisor: '',
      scheduledDate: null,
      expectedCompletion: null,
      notes: '',
      requiredMaterials: []
    });
    setSelectedRecipe(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Production Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-amber-600" />
            Create New Production Order
          </DialogTitle>
          <DialogDescription>
            Schedule production with automatic material validation and resource allocation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipe Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recipe & Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Recipe</Label>
                  <Select value={orderData.recipeId} onValueChange={handleRecipeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {recipes.map((recipe) => (
                        <SelectItem key={recipe.id} value={recipe.id}>
                          <div>
                            <div className="font-medium">{recipe.name}</div>
                            <div className="text-sm text-gray-500">{recipe.nameArabic}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Batch Size</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      value={orderData.batchSize}
                      onChange={(e) => setOrderData(prev => ({ ...prev, batchSize: Number(e.target.value) }))}
                      placeholder="Quantity"
                    />
                    <Button variant="outline" onClick={calculateMaterialRequirements}>
                      <Calculator className="h-4 w-4" />
                    </Button>
                  </div>
                  {selectedRecipe && (
                    <div className="text-sm text-gray-500 mt-1">
                      Standard batch: {selectedRecipe.batchSize} units
                    </div>
                  )}
                </div>
              </div>

              {selectedRecipe && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <div className="font-medium">{selectedRecipe.category}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Estimated Time:</span>
                      <div className="font-medium">{selectedRecipe.estimatedTime} days</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Standard Batch:</span>
                      <div className="font-medium">{selectedRecipe.batchSize} units</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Material Requirements */}
          {orderData.requiredMaterials.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-amber-600" />
                  Material Requirements Check
                </CardTitle>
                <CardDescription>
                  Verify material availability before scheduling production
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderData.requiredMaterials.map((material, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{material.material}</div>
                        <div className="text-sm text-gray-600">
                          Required: {material.required} {material.unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">
                            Available: {material.available} {material.unit}
                          </span>
                          {material.sufficient ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <Badge className={material.sufficient ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {material.sufficient ? 'Sufficient' : 'Insufficient'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {!orderData.requiredMaterials.every(m => m.sufficient) && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-800">Material Shortage Detected</span>
                    </div>
                    <div className="text-sm text-red-700 mt-1">
                      Please ensure sufficient materials are available before scheduling production.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Scheduling & Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                Scheduling & Resource Assignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Priority Level</Label>
                  <Select value={orderData.priority} onValueChange={(value: any) => setOrderData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low Priority</SelectItem>
                      <SelectItem value="Medium">Medium Priority</SelectItem>
                      <SelectItem value="High">High Priority</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2">
                    <Badge className={getPriorityColor(orderData.priority)}>
                      {orderData.priority} Priority
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label>Scheduled Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {orderData.scheduledDate ? format(orderData.scheduledDate, 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={orderData.scheduledDate || undefined}
                        onSelect={handleScheduledDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Assigned Operator</Label>
                  <Select value={orderData.operator} onValueChange={(value) => setOrderData(prev => ({ ...prev, operator: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((operator) => (
                        <SelectItem key={operator.id} value={operator.name}>
                          <div>
                            <div className="font-medium">{operator.name}</div>
                            <div className="text-sm text-gray-500">
                              {operator.specialization} • {operator.experience}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Supervisor</Label>
                  <Select value={orderData.supervisor} onValueChange={(value) => setOrderData(prev => ({ ...prev, supervisor: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      {supervisors.map((supervisor) => (
                        <SelectItem key={supervisor.id} value={supervisor.name}>
                          <div>
                            <div className="font-medium">{supervisor.name}</div>
                            <div className="text-sm text-gray-500">{supervisor.department}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {orderData.expectedCompletion && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Expected Completion</span>
                  </div>
                  <div className="text-sm text-blue-700 mt-1">
                    {format(orderData.expectedCompletion, 'EEEE, MMMM do, yyyy')}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Customer Order (Optional)</Label>
                  <Input
                    value={orderData.customerOrder || ''}
                    onChange={(e) => setOrderData(prev => ({ ...prev, customerOrder: e.target.value }))}
                    placeholder="Customer order reference"
                  />
                </div>
                <div>
                  <Label>Sales Order (Optional)</Label>
                  <Input
                    value={orderData.salesOrder || ''}
                    onChange={(e) => setOrderData(prev => ({ ...prev, salesOrder: e.target.value }))}
                    placeholder="Sales order reference"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label>Production Notes</Label>
                <Textarea
                  value={orderData.notes}
                  onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Special instructions, quality requirements, or other notes..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={createProductionOrder}
              disabled={!canCreateOrder()}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Create Production Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}