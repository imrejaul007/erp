'use client';

import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Calculator, Save, Eye, DollarSign, Scale, Layers, AlertTriangle, Copy, Download } from 'lucide-react';
import { Material, RecipeIngredient, Recipe } from '@/types/production';

interface RecipeBuilderProps {
  availableMaterials: Material[];
  initialRecipe?: Recipe;
  onSave: (recipe: Partial<Recipe>) => void;
  onCalculate: (ingredients: RecipeIngredient[]) => void;
}

interface IngredientFormData {
  materialId: string;
  quantity: number;
  unit: string;
  percentage?: number;
  isOptional: boolean;
  notes?: string;
  cost?: number;
  wastage?: number;
  phase?: 'Base' | 'Heart' | 'Top' | 'Modifier';
  substitutes?: string[];
  minQuantity?: number;
  maxQuantity?: number;
  criticality?: 'Low' | 'Medium' | 'High' | 'Critical';
}

const RecipeBuilder: React.FC<RecipeBuilderProps> = ({
  availableMaterials,
  initialRecipe,
  onSave,
  onCalculate
}) => {
  const [recipeName, setRecipeName] = useState(initialRecipe?.name || '');
  const [description, setDescription] = useState(initialRecipe?.description || '');
  const [category, setCategory] = useState(initialRecipe?.category || '');
  const [yieldQuantity, setYieldQuantity] = useState(initialRecipe?.yieldQuantity || 0);
  const [yieldUnit, setYieldUnit] = useState(initialRecipe?.yieldUnit || 'ml');
  const [instructions, setInstructions] = useState(initialRecipe?.instructions || '');
  const [notes, setNotes] = useState(initialRecipe?.notes || '');
  const [batchCost, setBatchCost] = useState(0);
  const [totalWastage, setTotalWastage] = useState(0);
  const [scalingFactor, setScalingFactor] = useState(1);
  const [showAdvancedBOM, setShowAdvancedBOM] = useState(false);
  const [bomVersion, setBomVersion] = useState('1.0');
  const [costBreakdown, setCostBreakdown] = useState<{[key: string]: number}>({});

  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(
    initialRecipe?.ingredients || []
  );
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);

  const categories = ['Perfume', 'Oud Oil', 'Attar', 'Incense', 'Soap', 'Cream'];
  const units = ['ml', 'grams', 'drops', 'pieces', 'liters', 'kg', 'tola', 'oz'];
  const phases = ['Base', 'Heart', 'Top', 'Modifier'];
  const criticalityLevels = ['Low', 'Medium', 'High', 'Critical'];

  // Handle drag and drop from materials to recipe
  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === 'materials' && destination.droppableId === 'recipe') {
      const material = availableMaterials.find(m => m.id === draggableId);
      if (material && !ingredients.find(ing => ing.materialId === material.id)) {
        const newIngredient: RecipeIngredient = {
          id: `temp-${Date.now()}`,
          recipeId: initialRecipe?.id || '',
          materialId: material.id,
          quantity: 1,
          unit: material.unitOfMeasure,
          percentage: 0,
          isOptional: false,
          notes: '',
          order: ingredients.length,
          material,
          cost: material.costPerUnit || 0,
          wastage: 0,
          phase: 'Base',
          substitutes: [],
          minQuantity: 0.1,
          maxQuantity: 1000,
          criticality: 'Medium'
        };
        setIngredients(prev => [...prev, newIngredient]);
      }
    }

    if (source.droppableId === 'recipe' && destination.droppableId === 'recipe') {
      const newIngredients = Array.from(ingredients);
      const [reorderedItem] = newIngredients.splice(source.index, 1);
      newIngredients.splice(destination.index, 0, reorderedItem);

      // Update order
      const updatedIngredients = newIngredients.map((ing, index) => ({
        ...ing,
        order: index
      }));

      setIngredients(updatedIngredients);
    }
  }, [ingredients, availableMaterials, initialRecipe?.id]);

  const updateIngredient = (id: string, field: keyof IngredientFormData, value: any) => {
    setIngredients(prev =>
      prev.map(ing =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    );
  };

  const removeIngredient = (id: string) => {
    setIngredients(prev => prev.filter(ing => ing.id !== id));
  };

  const addManualIngredient = () => {
    if (selectedMaterials.length === 0) return;

    const material = selectedMaterials[0];
    if (!ingredients.find(ing => ing.materialId === material.id)) {
      const newIngredient: RecipeIngredient = {
        id: `temp-${Date.now()}`,
        recipeId: initialRecipe?.id || '',
        materialId: material.id,
        quantity: 1,
        unit: material.unitOfMeasure,
        percentage: 0,
        isOptional: false,
        notes: '',
        order: ingredients.length,
        material,
        cost: material.costPerUnit || 0,
        wastage: 0,
        phase: 'Base',
        substitutes: [],
        minQuantity: 0.1,
        maxQuantity: 1000,
        criticality: 'Medium'
      };
      setIngredients(prev => [...prev, newIngredient]);
    }
  };

  const calculatePercentages = () => {
    const totalQuantity = ingredients.reduce((sum, ing) => sum + ing.quantity, 0);
    setIngredients(prev =>
      prev.map(ing => ({
        ...ing,
        percentage: totalQuantity > 0 ? (ing.quantity / totalQuantity) * 100 : 0
      }))
    );
  };

  const calculateBOMCosts = () => {
    let totalCost = 0;
    let totalWastageAmount = 0;
    const breakdown: {[key: string]: number} = {};

    ingredients.forEach(ing => {
      const scaledQuantity = ing.quantity * scalingFactor;
      const wastageAmount = scaledQuantity * (ing.wastage || 0) / 100;
      const effectiveQuantity = scaledQuantity + wastageAmount;
      const cost = effectiveQuantity * (ing.cost || ing.material?.costPerUnit || 0);

      totalCost += cost;
      totalWastageAmount += wastageAmount;
      breakdown[ing.material.name] = cost;
    });

    setBatchCost(totalCost);
    setTotalWastage(totalWastageAmount);
    setCostBreakdown(breakdown);
  };

  const scaleRecipe = (factor: number) => {
    setScalingFactor(factor);
    setIngredients(prev =>
      prev.map(ing => ({
        ...ing,
        quantity: (ing.quantity / scalingFactor) * factor
      }))
    );
  };

  const duplicateRecipe = () => {
    const duplicatedRecipe = {
      ...initialRecipe,
      id: undefined,
      name: `${recipeName} - Copy`,
      version: '1.0'
    };
    // Reset form with duplicated data
    setRecipeName(duplicatedRecipe.name);
  };

  const exportBOM = () => {
    const bomData = {
      recipe: {
        name: recipeName,
        version: bomVersion,
        category,
        yield: { quantity: yieldQuantity, unit: yieldUnit },
        scalingFactor
      },
      ingredients: ingredients.map(ing => ({
        name: ing.material.name,
        quantity: ing.quantity,
        unit: ing.unit,
        percentage: ing.percentage,
        cost: ing.cost,
        wastage: ing.wastage,
        phase: ing.phase,
        criticality: ing.criticality,
        isOptional: ing.isOptional
      })),
      totals: {
        cost: batchCost,
        wastage: totalWastage,
        ingredientCount: ingredients.length
      }
    };

    const blob = new Blob([JSON.stringify(bomData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BOM_${recipeName.replace(/\s+/g, '_')}_v${bomVersion}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const recipeData: Partial<Recipe> = {
      id: initialRecipe?.id,
      name: recipeName,
      description,
      category,
      yieldQuantity,
      yieldUnit,
      instructions,
      notes,
      ingredients
    };
    onSave(recipeData);
  };

  const handleCalculate = () => {
    calculatePercentages();
    calculateBOMCosts();
    onCalculate(ingredients);
  };

  React.useEffect(() => {
    calculateBOMCosts();
  }, [ingredients, scalingFactor]);

  return (
    <div className="space-y-6">
      {/* BOM Header with Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recipe & BOM Information</span>
            <div className="flex gap-2">
              <Badge variant={showAdvancedBOM ? 'default' : 'secondary'}>
                BOM v{bomVersion}
              </Badge>
              <Button
                onClick={() => setShowAdvancedBOM(!showAdvancedBOM)}
                variant="outline"
                size="sm"
              >
                <Layers className="w-4 h-4 mr-2" />
                {showAdvancedBOM ? 'Simple' : 'Advanced'} BOM
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="recipeName">Recipe Name *</Label>
              <Input
                id="recipeName"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="Enter recipe name"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bomVersion">BOM Version</Label>
              <Input
                id="bomVersion"
                value={bomVersion}
                onChange={(e) => setBomVersion(e.target.value)}
                placeholder="1.0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter recipe description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="yieldQuantity">Expected Yield</Label>
              <Input
                id="yieldQuantity"
                type="number"
                step="0.1"
                value={yieldQuantity}
                onChange={(e) => setYieldQuantity(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="yieldUnit">Yield Unit</Label>
              <Select value={yieldUnit} onValueChange={setYieldUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="scalingFactor">Scaling Factor</Label>
              <div className="flex gap-1">
                <Input
                  id="scalingFactor"
                  type="number"
                  step="0.1"
                  value={scalingFactor}
                  onChange={(e) => scaleRecipe(parseFloat(e.target.value) || 1)}
                  placeholder="1.0"
                />
                <Button
                  onClick={() => scaleRecipe(1)}
                  variant="outline"
                  size="sm"
                >
                  Reset
                </Button>
              </div>
            </div>
            <div>
              <Label>Batch Cost</Label>
              <div className="flex items-center gap-2 p-2 border rounded">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-600">
                  {batchCost.toFixed(2)} AED
                </span>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          {showAdvancedBOM && Object.keys(costBreakdown).length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Cost Breakdown by Material</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {Object.entries(costBreakdown).map(([material, cost]) => (
                  <div key={material} className="flex justify-between">
                    <span className="text-gray-600">{material}:</span>
                    <span className="font-medium">{cost.toFixed(2)} AED</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t flex justify-between font-medium">
                <span>Total Wastage:</span>
                <span className="text-orange-600">{totalWastage.toFixed(2)} units</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Materials */}
          <Card>
            <CardHeader>
              <CardTitle>Available Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <Droppable droppableId="materials" isDropDisabled>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2 min-h-[200px] max-h-[400px] overflow-y-auto"
                  >
                    {availableMaterials.map((material, index) => (
                      <Draggable
                        key={material.id}
                        draggableId={material.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 border rounded-lg cursor-grab active:cursor-grabbing ${
                              snapshot.isDragging ? 'shadow-lg bg-blue-50' : 'bg-white hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">{material.name}</h4>
                                <p className="text-sm text-gray-600">
                                  Stock: {material.currentStock} {material.unitOfMeasure}
                                </p>
                              </div>
                              <Badge variant="secondary">
                                ${material.costPerUnit}/{material.unitOfMeasure}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* Manual Add Section */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex gap-2">
                  <Select
                    value={selectedMaterials[0]?.id || ''}
                    onValueChange={(value) => {
                      const material = availableMaterials.find(m => m.id === value);
                      if (material) setSelectedMaterials([material]);
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select material to add" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMaterials
                        .filter(m => !ingredients.find(ing => ing.materialId === m.id))
                        .map(material => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addManualIngredient} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recipe Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recipe Ingredients
                <div className="flex gap-2">
                  <Button onClick={handleCalculate} size="sm" variant="outline">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Droppable droppableId="recipe">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[200px] p-4 border-2 border-dashed rounded-lg ${
                      snapshot.isDraggingOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    {ingredients.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        Drag materials here or use the dropdown above to add ingredients
                      </div>
                    )}

                    {ingredients.map((ingredient, index) => (
                      <Draggable
                        key={ingredient.id}
                        draggableId={ingredient.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`p-4 border rounded-lg ${
                              snapshot.isDragging ? 'shadow-lg bg-blue-50' : 'bg-white'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                {...provided.dragHandleProps}
                                className="mt-2 cursor-grab active:cursor-grabbing"
                              >
                                ⋮⋮
                              </div>

                              <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{ingredient.material.name}</h4>
                                  <Button
                                    onClick={() => removeIngredient(ingredient.id)}
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>

                                <div className={`grid gap-2 ${
                                  showAdvancedBOM ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2'
                                }`}>
                                  <div>
                                    <Label>Quantity</Label>
                                    <Input
                                      type="number"
                                      step="0.1"
                                      value={ingredient.quantity}
                                      onChange={(e) =>
                                        updateIngredient(
                                          ingredient.id,
                                          'quantity',
                                          parseFloat(e.target.value) || 0
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label>Unit</Label>
                                    <Select
                                      value={ingredient.unit}
                                      onValueChange={(value) =>
                                        updateIngredient(ingredient.id, 'unit', value)
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {units.map(unit => (
                                          <SelectItem key={unit} value={unit}>
                                            {unit}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  {showAdvancedBOM && (
                                    <>
                                      <div>
                                        <Label>Phase</Label>
                                        <Select
                                          value={ingredient.phase || 'Base'}
                                          onValueChange={(value) =>
                                            updateIngredient(ingredient.id, 'phase', value)
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {phases.map(phase => (
                                              <SelectItem key={phase} value={phase}>
                                                {phase}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label>Criticality</Label>
                                        <Select
                                          value={ingredient.criticality || 'Medium'}
                                          onValueChange={(value) =>
                                            updateIngredient(ingredient.id, 'criticality', value)
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {criticalityLevels.map(level => (
                                              <SelectItem key={level} value={level}>
                                                <div className="flex items-center gap-2">
                                                  {level === 'Critical' && <AlertTriangle className="w-3 h-3 text-red-500" />}
                                                  {level === 'High' && <AlertTriangle className="w-3 h-3 text-orange-500" />}
                                                  {level}
                                                </div>
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </>
                                  )}
                                </div>

                                {showAdvancedBOM && (
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    <div>
                                      <Label>Cost/Unit (AED)</Label>
                                      <Input
                                        type="number"
                                        step="0.01"
                                        value={ingredient.cost || 0}
                                        onChange={(e) =>
                                          updateIngredient(
                                            ingredient.id,
                                            'cost',
                                            parseFloat(e.target.value) || 0
                                          )
                                        }
                                        placeholder="0.00"
                                      />
                                    </div>
                                    <div>
                                      <Label>Wastage %</Label>
                                      <Input
                                        type="number"
                                        step="0.1"
                                        value={ingredient.wastage || 0}
                                        onChange={(e) =>
                                          updateIngredient(
                                            ingredient.id,
                                            'wastage',
                                            parseFloat(e.target.value) || 0
                                          )
                                        }
                                        placeholder="0"
                                      />
                                    </div>
                                    <div>
                                      <Label>Total Cost</Label>
                                      <div className="p-2 border rounded bg-gray-50 text-sm font-medium">
                                        {((ingredient.quantity * scalingFactor * (1 + (ingredient.wastage || 0) / 100)) * (ingredient.cost || 0)).toFixed(2)} AED
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div className="flex gap-4 text-sm text-gray-600">
                                  {ingredient.percentage !== undefined && (
                                    <span>Percentage: {ingredient.percentage.toFixed(2)}%</span>
                                  )}
                                  {showAdvancedBOM && ingredient.phase && (
                                    <Badge variant="outline" className="text-xs">
                                      {ingredient.phase}
                                    </Badge>
                                  )}
                                  {showAdvancedBOM && ingredient.criticality === 'Critical' && (
                                    <Badge variant="destructive" className="text-xs">
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      Critical
                                    </Badge>
                                  )}
                                </div>

                                <div>
                                  <Label>Notes (Optional)</Label>
                                  <Input
                                    value={ingredient.notes || ''}
                                    onChange={(e) =>
                                      updateIngredient(ingredient.id, 'notes', e.target.value)
                                    }
                                    placeholder="Add notes about this ingredient"
                                  />
                                </div>

                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`optional-${ingredient.id}`}
                                    checked={ingredient.isOptional}
                                    onChange={(e) =>
                                      updateIngredient(ingredient.id, 'isOptional', e.target.checked)
                                    }
                                  />
                                  <Label htmlFor={`optional-${ingredient.id}`}>
                                    Optional ingredient
                                  </Label>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
        </div>
      </DragDropContext>

      {/* Instructions and Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions & Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Step-by-step preparation instructions"
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes about this recipe"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button onClick={duplicateRecipe} variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
          <Button onClick={exportBOM} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export BOM
          </Button>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Recipe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeBuilder;