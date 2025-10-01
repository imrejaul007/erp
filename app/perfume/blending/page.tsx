'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  ChefHat,
  Palette,
  Beaker,
  TestTube,
  FlaskConical,
  Droplets,
  Scale,
  Target,
  Star,
  Award,
  Crown,
  Diamond,
  Eye,
  Nose,
  Heart,
  Clock,
  Timer,
  Thermometer,
  Wind,
  Layers,
  Plus,
  Minus,
  Edit,
  Save,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Zap,
  Sparkles,
  TrendingUp,
  BarChart3,
  PieChart,
  Settings,
  User,
  Users,
  Calendar,
  Package,
  Building,
  MapPin,
  Flower2,
  TreePine,
  Leaf,
  Sun,
  Moon,
  Cloud,
  Mountain,
  Waves,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

const BlendingLaboratoryPage = () => {
  const [activeFormula, setActiveFormula] = useState(null);
  const [isNewFormulaDialogOpen, setIsNewFormulaDialogOpen] = useState(false);
  const [isBlendingStationOpen, setIsBlendingStationOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [formulaComponents, setFormulaComponents] = useState([]);

  // Base ingredients library
  const ingredientLibrary = [
    {
      id: 'CAM001',
      name: 'Royal Cambodian Oud',
      arabicName: 'عود كمبودي ملكي',
      type: 'base_oud',
      category: 'Premium Oud',
      grade: 'Super A+',
      strength: 95,
      longevity: 12,
      sillage: 'Heavy',
      price: 2500,
      stock: 125,
      unit: 'ml',
      notes: {
        top: ['Animalic', 'Barnyard', 'Smoky'],
        middle: ['Honey', 'Leather', 'Dried Fruits'],
        base: ['Deep Wood', 'Resinous', 'Creamy']
      },
      blendingProperties: {
        dominance: 'High',
        compatibility: ['Rose', 'Sandalwood', 'Amber'],
        maxPercentage: 30,
        minPercentage: 5
      },
      origin: 'Cambodia'
    },
    {
      id: 'TAF002',
      name: 'Taif Rose Attar',
      arabicName: 'عطر ورد طائفي',
      type: 'floral_attar',
      category: 'Rose Attar',
      grade: 'A+',
      strength: 85,
      longevity: 8,
      sillage: 'Moderate',
      price: 850,
      stock: 280,
      unit: 'ml',
      notes: {
        top: ['Fresh Rose', 'Green Leaves'],
        middle: ['Damask Rose', 'Honey'],
        base: ['Sandalwood', 'Musk', 'Amber']
      },
      blendingProperties: {
        dominance: 'Medium',
        compatibility: ['Oud', 'Sandalwood', 'Jasmine'],
        maxPercentage: 40,
        minPercentage: 10
      },
      origin: 'Saudi Arabia'
    },
    {
      id: 'SAN003',
      name: 'Mysore Sandalwood',
      arabicName: 'صندل مايسور',
      type: 'woody_base',
      category: 'Sandalwood',
      grade: 'A+',
      strength: 70,
      longevity: 10,
      sillage: 'Moderate',
      price: 1200,
      stock: 150,
      unit: 'ml',
      notes: {
        top: ['Creamy', 'Milky', 'Sweet'],
        middle: ['Woody', 'Balsamic', 'Smooth'],
        base: ['Creamy Wood', 'Vanilla', 'Soft']
      },
      blendingProperties: {
        dominance: 'Low',
        compatibility: ['Rose', 'Oud', 'Amber', 'Musk'],
        maxPercentage: 50,
        minPercentage: 15
      },
      origin: 'India'
    },
    {
      id: 'AMB004',
      name: 'Golden Amber',
      arabicName: 'عنبر ذهبي',
      type: 'resinous_base',
      category: 'Amber',
      grade: 'A',
      strength: 60,
      longevity: 9,
      sillage: 'Close',
      price: 650,
      stock: 320,
      unit: 'ml',
      notes: {
        top: ['Sweet', 'Warm', 'Resinous'],
        middle: ['Honey', 'Vanilla', 'Benzoin'],
        base: ['Labdanum', 'Vanilla', 'Powdery']
      },
      blendingProperties: {
        dominance: 'Low',
        compatibility: ['Oud', 'Rose', 'Sandalwood', 'Vanilla'],
        maxPercentage: 35,
        minPercentage: 5
      },
      origin: 'Traditional'
    },
    {
      id: 'MUS005',
      name: 'White Musk',
      arabicName: 'مسك أبيض',
      type: 'animal_musk',
      category: 'Musk',
      grade: 'A',
      strength: 50,
      longevity: 6,
      sillage: 'Close',
      price: 180,
      stock: 450,
      unit: 'ml',
      notes: {
        top: ['Clean', 'Fresh', 'Soft'],
        middle: ['Powdery', 'Cotton', 'Skin-like'],
        base: ['Warm', 'Comforting', 'Subtle']
      },
      blendingProperties: {
        dominance: 'Very Low',
        compatibility: ['All ingredients'],
        maxPercentage: 25,
        minPercentage: 3
      },
      origin: 'Traditional'
    },
    {
      id: 'JAS006',
      name: 'Arabian Jasmine',
      arabicName: 'ياسمين عربي',
      type: 'floral_essence',
      category: 'Jasmine',
      grade: 'A+',
      strength: 80,
      longevity: 7,
      sillage: 'Moderate',
      price: 950,
      stock: 190,
      unit: 'ml',
      notes: {
        top: ['White Flowers', 'Green', 'Fresh'],
        middle: ['Jasmine', 'Indolic', 'Creamy'],
        base: ['Soft Floral', 'Powdery', 'Sweet']
      },
      blendingProperties: {
        dominance: 'Medium',
        compatibility: ['Rose', 'Sandalwood', 'Amber'],
        maxPercentage: 30,
        minPercentage: 8
      },
      origin: 'Arabian Peninsula'
    }
  ];

  // Existing formulas
  const blendFormulas = [
    {
      id: 'BLEND001',
      name: 'Sultan\'s Signature',
      arabicName: 'توقيع السلطان',
      category: 'Luxury Blend',
      description: 'Premium blend for special occasions and royal gatherings',
      status: 'active',
      created: '2024-01-15',
      creator: 'Master Blender Ahmad',
      batchSize: 100,
      yield: 95,
      cost: 1850,
      sellPrice: 4500,
      margin: 143,
      popularity: 92,
      components: [
        { ingredientId: 'CAM001', name: 'Royal Cambodian Oud', percentage: 25, amount: 25, cost: 625 },
        { ingredientId: 'TAF002', name: 'Taif Rose Attar', percentage: 30, amount: 30, cost: 255 },
        { ingredientId: 'SAN003', name: 'Mysore Sandalwood', percentage: 35, amount: 35, cost: 420 },
        { ingredientId: 'AMB004', name: 'Golden Amber', percentage: 8, amount: 8, cost: 52 },
        { ingredientId: 'MUS005', name: 'White Musk', percentage: 2, amount: 2, cost: 3.6 }
      ],
      profile: {
        strength: 88,
        longevity: 10,
        sillage: 'Heavy',
        season: 'All Seasons',
        occasion: 'Special Events'
      },
      notes: {
        top: ['Rose', 'Fresh', 'Floral'],
        middle: ['Oud', 'Sandalwood', 'Honey'],
        base: ['Deep Wood', 'Amber', 'Musk']
      },
      reviews: 28,
      rating: 4.8
    },
    {
      id: 'BLEND002',
      name: 'Desert Rose',
      arabicName: 'وردة الصحراء',
      category: 'Floral Blend',
      description: 'Delicate rose blend perfect for daily wear',
      status: 'active',
      created: '2024-01-20',
      creator: 'Master Blender Fatima',
      batchSize: 150,
      yield: 145,
      cost: 890,
      sellPrice: 2200,
      margin: 147,
      popularity: 89,
      components: [
        { ingredientId: 'TAF002', name: 'Taif Rose Attar', percentage: 45, amount: 67.5, cost: 573.75 },
        { ingredientId: 'SAN003', name: 'Mysore Sandalwood', percentage: 35, amount: 52.5, cost: 630 },
        { ingredientId: 'JAS006', name: 'Arabian Jasmine', percentage: 15, amount: 22.5, cost: 213.75 },
        { ingredientId: 'MUS005', name: 'White Musk', percentage: 5, amount: 7.5, cost: 13.5 }
      ],
      profile: {
        strength: 75,
        longevity: 8,
        sillage: 'Moderate',
        season: 'Spring/Summer',
        occasion: 'Daily Wear'
      },
      notes: {
        top: ['Rose', 'Jasmine', 'Fresh'],
        middle: ['Rose', 'Floral', 'Creamy'],
        base: ['Sandalwood', 'Musk', 'Soft']
      },
      reviews: 45,
      rating: 4.6
    },
    {
      id: 'BLEND003',
      name: 'Oud Royale',
      arabicName: 'عود ملكي',
      category: 'Oud Blend',
      description: 'Intense oud blend for connoisseurs',
      status: 'development',
      created: '2024-02-01',
      creator: 'Master Blender Ahmad',
      batchSize: 50,
      yield: 48,
      cost: 2200,
      sellPrice: 5500,
      margin: 150,
      popularity: 85,
      components: [
        { ingredientId: 'CAM001', name: 'Royal Cambodian Oud', percentage: 40, amount: 20, cost: 500 },
        { ingredientId: 'SAN003', name: 'Mysore Sandalwood', percentage: 30, amount: 15, cost: 180 },
        { ingredientId: 'AMB004', name: 'Golden Amber', percentage: 25, amount: 12.5, cost: 81.25 },
        { ingredientId: 'MUS005', name: 'White Musk', percentage: 5, amount: 2.5, cost: 4.5 }
      ],
      profile: {
        strength: 95,
        longevity: 12,
        sillage: 'Very Heavy',
        season: 'Winter',
        occasion: 'Evening/Special'
      },
      notes: {
        top: ['Oud', 'Animalic', 'Intense'],
        middle: ['Deep Oud', 'Wood', 'Resinous'],
        base: ['Sandalwood', 'Amber', 'Lasting']
      },
      reviews: 12,
      rating: 4.9
    }
  ];

  // Master blenders
  const masterBlenders = [
    {
      id: 'MB001',
      name: 'Master Blender Ahmad Al-Khalil',
      title: 'Senior Perfume Composer',
      experience: '25 years',
      specialization: 'Luxury Oud Blends',
      signature: 'Royal Collection Series',
      activeFormulas: 8,
      totalFormulas: 156,
      successRate: 94,
      averageRating: 4.7,
      expertise: ['Oud Blending', 'Complex Compositions', 'Cultural Authenticity']
    },
    {
      id: 'MB002',
      name: 'Master Blender Fatima Al-Zahra',
      title: 'Floral Composition Expert',
      experience: '20 years',
      specialization: 'Floral & Delicate Blends',
      signature: 'Garden of Paradise Series',
      activeFormulas: 12,
      totalFormulas: 134,
      successRate: 91,
      averageRating: 4.6,
      expertise: ['Rose Compositions', 'Floral Harmony', 'Daily Wear Formulas']
    },
    {
      id: 'MB003',
      name: 'Innovation Specialist Sarah Chen',
      title: 'Modern Blend Developer',
      experience: '15 years',
      specialization: 'Contemporary & Fusion Blends',
      signature: 'East Meets West Collection',
      activeFormulas: 6,
      totalFormulas: 89,
      successRate: 88,
      averageRating: 4.5,
      expertise: ['Modern Techniques', 'Cross-Cultural Blends', 'Innovation']
    }
  ];

  // Blending equipment
  const blendingEquipment = [
    {
      id: 'EQ001',
      name: 'Precision Scale Model PS-2000',
      type: 'Digital Scale',
      capacity: '2000g',
      precision: '0.01g',
      status: 'operational',
      lastCalibration: '2024-01-15',
      nextCalibration: '2024-04-15'
    },
    {
      id: 'EQ002',
      name: 'Temperature Controlled Mixing Chamber',
      type: 'Mixing Equipment',
      capacity: '500ml',
      tempRange: '15-30°C',
      status: 'operational',
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-04-20'
    },
    {
      id: 'EQ003',
      name: 'Ultrasonic Homogenizer UH-100',
      type: 'Homogenizer',
      capacity: '100ml',
      frequency: '40kHz',
      status: 'operational',
      lastService: '2024-01-10',
      nextService: '2024-07-10'
    }
  ];

  const calculateBlendCost = (components) => {
    return components.reduce((total, comp) => total + comp.cost, 0);
  };

  const calculateTotalPercentage = (components) => {
    return components.reduce((total, comp) => total + comp.percentage, 0);
  };

  const getIngredientById = (id) => {
    return ingredientLibrary.find(ing => ing.id === id);
  };

  const getBlendStrength = (components) => {
    let weightedStrength = 0;
    components.forEach(comp => {
      const ingredient = getIngredientById(comp.ingredientId);
      if (ingredient) {
        weightedStrength += (ingredient.strength * comp.percentage) / 100;
      }
    });
    return Math.round(weightedStrength);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'development': return 'bg-blue-100 text-blue-800';
      case 'testing': return 'bg-yellow-100 text-yellow-800';
      case 'discontinued': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Luxury Blend': return <Crown className="h-4 w-4" />;
      case 'Floral Blend': return <Flower2 className="h-4 w-4" />;
      case 'Oud Blend': return <TreePine className="h-4 w-4" />;
      case 'Modern Blend': return <Sparkles className="h-4 w-4" />;
      default: return <Beaker className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Custom Blending Laboratory</h1>
          <p className="text-gray-600">Professional perfume and attar composition workspace</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Inventory
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Formulas
          </Button>
          <Dialog open={isBlendingStationOpen} onOpenChange={setIsBlendingStationOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ChefHat className="h-4 w-4 mr-2" />
                Blending Station
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Professional Blending Station</DialogTitle>
                <DialogDescription>
                  Create and test new fragrance compositions
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-3 gap-6">
                {/* Ingredient Library */}
                <div className="space-y-4">
                  <h3 className="font-medium">Ingredient Library</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {ingredientLibrary.map((ingredient) => (
                      <div key={ingredient.id} className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium text-sm">{ingredient.name}</div>
                            <div className="text-xs text-gray-500">{ingredient.arabicName}</div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {ingredient.grade}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          Stock: {ingredient.stock}{ingredient.unit} • AED {ingredient.price}/{ingredient.unit}
                        </div>
                        <div className="text-xs">
                          <div>Strength: {ingredient.strength}% • Longevity: {ingredient.longevity}h</div>
                        </div>
                        <Button
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => {
                            const newComponent = {
                              ingredientId: ingredient.id,
                              name: ingredient.name,
                              percentage: 10,
                              amount: 10,
                              cost: (ingredient.price * 10) / 100
                            };
                            setFormulaComponents([...formulaComponents, newComponent]);
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add to Formula
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formula Builder */}
                <div className="space-y-4">
                  <h3 className="font-medium">Formula Composition</h3>
                  <div className="space-y-3">
                    {formulaComponents.map((component, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium text-sm">{component.name}</div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newComponents = formulaComponents.filter((_, i) => i !== index);
                              setFormulaComponents(newComponents);
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Percentage</span>
                            <span>{component.percentage}%</span>
                          </div>
                          <Slider
                            value={[component.percentage]}
                            onValueChange={(value) => {
                              const newComponents = [...formulaComponents];
                              newComponents[index].percentage = value[0];
                              const ingredient = getIngredientById(component.ingredientId);
                              newComponents[index].cost = (ingredient.price * value[0]) / 100;
                              setFormulaComponents(newComponents);
                            }}
                            max={50}
                            step={1}
                            className="w-full"
                          />
                          <div className="text-xs text-gray-500">
                            Cost: AED {component.cost.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}

                    {formulaComponents.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        Add ingredients from the library to start creating your formula
                      </div>
                    )}
                  </div>

                  {/* Formula Summary */}
                  {formulaComponents.length > 0 && (
                    <div className="border rounded-lg p-3 bg-blue-50">
                      <h4 className="font-medium text-blue-800 mb-2">Formula Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Total Percentage:</span>
                          <span className={calculateTotalPercentage(formulaComponents) === 100 ? 'text-green-600' : 'text-red-600'}>
                            {calculateTotalPercentage(formulaComponents)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Cost:</span>
                          <span>AED {calculateBlendCost(formulaComponents).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Strength:</span>
                          <span>{getBlendStrength(formulaComponents)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Blending Notes */}
                <div className="space-y-4">
                  <h3 className="font-medium">Blending Notes & Settings</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Formula Name</Label>
                      <Input placeholder="Enter formula name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Arabic Name</Label>
                      <Input placeholder="Enter Arabic name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="luxury">Luxury Blend</SelectItem>
                          <SelectItem value="floral">Floral Blend</SelectItem>
                          <SelectItem value="oud">Oud Blend</SelectItem>
                          <SelectItem value="modern">Modern Blend</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Batch Size (ml)</Label>
                      <Input type="number" placeholder="100" />
                    </div>
                    <div className="space-y-2">
                      <Label>Blending Temperature (°C)</Label>
                      <Input type="number" placeholder="22" />
                    </div>
                    <div className="space-y-2">
                      <Label>Maturation Time (days)</Label>
                      <Input type="number" placeholder="30" />
                    </div>
                    <div className="space-y-2">
                      <Label>Blending Notes</Label>
                      <Textarea placeholder="Add notes about the blending process, expected characteristics, etc." />
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-2">Blending Guidelines</h4>
                    <ul className="text-xs text-amber-700 space-y-1">
                      <li>• Total percentage must equal 100%</li>
                      <li>• Allow 30-60 days for proper maturation</li>
                      <li>• Test small batches before full production</li>
                      <li>• Document all adjustments and observations</li>
                    </ul>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBlendingStationOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsBlendingStationOpen(false)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Formula
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isNewFormulaDialogOpen} onOpenChange={setIsNewFormulaDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Formula
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Blend Formula</DialogTitle>
                <DialogDescription>
                  Start a new fragrance composition project
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Formula Name</Label>
                  <Input placeholder="Enter unique formula name" />
                </div>
                <div className="space-y-2">
                  <Label>Arabic Name</Label>
                  <Input placeholder="Arabic translation" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="luxury">Luxury Blend</SelectItem>
                      <SelectItem value="floral">Floral Blend</SelectItem>
                      <SelectItem value="oud">Oud Blend</SelectItem>
                      <SelectItem value="modern">Modern Blend</SelectItem>
                      <SelectItem value="traditional">Traditional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Master Blender</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blender" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterBlenders.map(blender => (
                        <SelectItem key={blender.id} value={blender.id}>
                          {blender.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target Market</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="luxury">Luxury Market</SelectItem>
                      <SelectItem value="premium">Premium Segment</SelectItem>
                      <SelectItem value="mass">Mass Market</SelectItem>
                      <SelectItem value="niche">Niche Collectors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target Price (AED)</Label>
                  <Input type="number" placeholder="Target selling price" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Brief description of the intended fragrance profile and characteristics" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewFormulaDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsNewFormulaDialogOpen(false)}>
                  Create Formula
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Formulas</p>
                <p className="text-2xl font-bold">{blendFormulas.filter(f => f.status === 'active').length}</p>
                <p className="text-xs text-green-600">Ready for production</p>
              </div>
              <ChefHat className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">4.7</p>
                <p className="text-xs text-purple-600">Customer satisfaction</p>
              </div>
              <Star className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">91%</p>
                <p className="text-xs text-green-600">Formula acceptance</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingredients</p>
                <p className="text-2xl font-bold">{ingredientLibrary.length}</p>
                <p className="text-xs text-orange-600">In library</p>
              </div>
              <Beaker className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="formulas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="formulas">Formulas</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="blenders">Master Blenders</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Formulas Tab */}
        <TabsContent value="formulas" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {blendFormulas.map((formula) => (
              <Card key={formula.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getCategoryIcon(formula.category)}
                        {formula.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500">{formula.arabicName}</p>
                      <p className="text-xs text-gray-500">{formula.id}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(formula.status)}>
                        {formula.status}
                      </Badge>
                      <div className="text-sm font-medium mt-1">
                        {formula.reviews} reviews
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < Math.floor(formula.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-xs ml-1">{formula.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Description */}
                  <p className="text-sm text-gray-600">{formula.description}</p>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Creator:</span>
                      <span className="ml-1 font-medium">{formula.creator}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <span className="ml-1 font-medium">{formula.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Batch Size:</span>
                      <span className="ml-1 font-medium">{formula.batchSize}ml</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Yield:</span>
                      <span className="ml-1 font-medium">{formula.yield}ml</span>
                    </div>
                  </div>

                  {/* Profile */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Strength:</span>
                        <span className="ml-1 font-medium">{formula.profile.strength}%</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Longevity:</span>
                        <span className="ml-1 font-medium">{formula.profile.longevity}h</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Sillage:</span>
                        <span className="ml-1 font-medium">{formula.profile.sillage}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Season:</span>
                        <span className="ml-1 font-medium">{formula.profile.season}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fragrance Notes */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Fragrance Profile:</div>
                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="font-medium">Top:</span>
                        <span className="ml-2">{formula.notes.top.join(', ')}</span>
                      </div>
                      <div>
                        <span className="font-medium">Middle:</span>
                        <span className="ml-2">{formula.notes.middle.join(', ')}</span>
                      </div>
                      <div>
                        <span className="font-medium">Base:</span>
                        <span className="ml-2">{formula.notes.base.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Components */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Main Components:</div>
                    <div className="space-y-1">
                      {formula.components.slice(0, 3).map((component, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span>{component.name}</span>
                          <span>{component.percentage}%</span>
                        </div>
                      ))}
                      {formula.components.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{formula.components.length - 3} more ingredients
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cost & Margin */}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-blue-600">AED {formula.cost}</div>
                        <div className="text-blue-600">Cost</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-blue-600">AED {formula.sellPrice}</div>
                        <div className="text-blue-600">Price</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-blue-600">{formula.margin}%</div>
                        <div className="text-blue-600">Margin</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Modify
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-1" />
                      Clone
                    </Button>
                    {formula.status === 'active' && (
                      <Button variant="outline" size="sm">
                        <Package className="h-4 w-4 mr-1" />
                        Produce
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Ingredients Tab */}
        <TabsContent value="ingredients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ingredient Library</CardTitle>
              <CardDescription>Available ingredients for blending and their properties</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ingredient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Strength</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Blending Properties</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredientLibrary.map((ingredient) => (
                    <TableRow key={ingredient.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ingredient.name}</div>
                          <div className="text-sm text-gray-500">{ingredient.arabicName}</div>
                          <div className="text-xs text-gray-500">{ingredient.origin}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{ingredient.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={ingredient.grade === 'Super A+' ? 'bg-purple-100 text-purple-800' :
                                        ingredient.grade === 'A+' ? 'bg-blue-100 text-blue-800' :
                                        'bg-green-100 text-green-800'}>
                          {ingredient.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>{ingredient.strength}%</TableCell>
                      <TableCell>
                        <div className="font-medium">{ingredient.stock} {ingredient.unit}</div>
                        <div className="text-xs text-gray-500">
                          Longevity: {ingredient.longevity}h
                        </div>
                      </TableCell>
                      <TableCell>
                        AED {ingredient.price}/{ingredient.unit}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Max: {ingredient.blendingProperties.maxPercentage}%</div>
                          <div>Min: {ingredient.blendingProperties.minPercentage}%</div>
                          <div className="text-xs text-gray-500">
                            {ingredient.blendingProperties.dominance} dominance
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Master Blenders Tab */}
        <TabsContent value="blenders" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {masterBlenders.map((blender) => (
              <Card key={blender.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{blender.name}</CardTitle>
                      <p className="text-sm text-gray-500">{blender.title}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Experience:</span>
                      <div className="font-medium">{blender.experience}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Success Rate:</span>
                      <div className="font-medium">{blender.successRate}%</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Active:</span>
                      <div className="font-medium">{blender.activeFormulas} formulas</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <div className="font-medium">{blender.totalFormulas} formulas</div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-2 p-3 bg-yellow-50 rounded-lg">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-yellow-600">{blender.averageRating}</span>
                    <span className="text-yellow-600">Average Rating</span>
                  </div>

                  {/* Specialization */}
                  <div>
                    <div className="font-medium text-sm mb-1">Specialization:</div>
                    <p className="text-sm text-gray-600">{blender.specialization}</p>
                  </div>

                  {/* Expertise */}
                  <div>
                    <div className="font-medium text-sm mb-2">Expertise:</div>
                    <div className="flex flex-wrap gap-1">
                      {blender.expertise.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Signature Collection */}
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-sm text-purple-800">Signature Collection</div>
                    <div className="text-sm text-purple-600">{blender.signature}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Performance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blendingEquipment.map((equipment) => (
              <Card key={equipment.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{equipment.name}</CardTitle>
                  <CardDescription>{equipment.type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Equipment Specs */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Capacity:</span>
                      <div className="font-medium">{equipment.capacity}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <Badge className="ml-1" variant={equipment.status === 'operational' ? 'default' : 'destructive'}>
                        {equipment.status}
                      </Badge>
                    </div>
                    {equipment.precision && (
                      <div>
                        <span className="text-gray-500">Precision:</span>
                        <div className="font-medium">{equipment.precision}</div>
                      </div>
                    )}
                    {equipment.tempRange && (
                      <div>
                        <span className="text-gray-500">Temp Range:</span>
                        <div className="font-medium">{equipment.tempRange}</div>
                      </div>
                    )}
                    {equipment.frequency && (
                      <div>
                        <span className="text-gray-500">Frequency:</span>
                        <div className="font-medium">{equipment.frequency}</div>
                      </div>
                    )}
                  </div>

                  {/* Maintenance Schedule */}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-sm text-blue-800 mb-2">Maintenance Schedule</div>
                    <div className="space-y-1 text-sm">
                      {equipment.lastCalibration && (
                        <div className="flex justify-between">
                          <span>Last Calibration:</span>
                          <span>{equipment.lastCalibration}</span>
                        </div>
                      )}
                      {equipment.nextCalibration && (
                        <div className="flex justify-between">
                          <span>Next Calibration:</span>
                          <span>{equipment.nextCalibration}</span>
                        </div>
                      )}
                      {equipment.lastMaintenance && (
                        <div className="flex justify-between">
                          <span>Last Maintenance:</span>
                          <span>{equipment.lastMaintenance}</span>
                        </div>
                      )}
                      {equipment.nextMaintenance && (
                        <div className="flex justify-between">
                          <span>Next Maintenance:</span>
                          <span>{equipment.nextMaintenance}</span>
                        </div>
                      )}
                      {equipment.lastService && (
                        <div className="flex justify-between">
                          <span>Last Service:</span>
                          <span>{equipment.lastService}</span>
                        </div>
                      )}
                      {equipment.nextService && (
                        <div className="flex justify-between">
                          <span>Next Service:</span>
                          <span>{equipment.nextService}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formula Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Formula Performance</CardTitle>
                <CardDescription>Success rates and market acceptance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-bold text-green-600">91%</div>
                      <div className="text-sm text-green-600">Success Rate</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-bold text-blue-600">4.7</div>
                      <div className="text-sm text-blue-600">Avg Rating</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="font-bold text-purple-600">85</div>
                      <div className="text-sm text-purple-600">Total Reviews</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Luxury Blends:</span>
                      <span>1 formula (94% success)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Floral Blends:</span>
                      <span>1 formula (89% success)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Oud Blends:</span>
                      <span>1 formula (85% success)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Cost & Profitability</CardTitle>
                <CardDescription>Financial performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-bold text-blue-600">AED 1,580</div>
                      <div className="text-sm text-blue-600">Avg Cost</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-bold text-green-600">147%</div>
                      <div className="text-sm text-green-600">Avg Margin</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Ingredient Costs:</span>
                      <span>68% of total</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Labor Costs:</span>
                      <span>22% of total</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Equipment/Overhead:</span>
                      <span>10% of total</span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-lg">
                    <div className="font-medium text-amber-800 mb-1">Cost Optimization Tips</div>
                    <ul className="text-xs text-amber-700 space-y-1">
                      <li>• Consider ingredient substitutions for mass market</li>
                      <li>• Batch size optimization can reduce per-unit costs</li>
                      <li>• Premium positioning justifies current margins</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Reports & Export</CardTitle>
              <CardDescription>Generate detailed analytics and reports</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="justify-start">
                <Download className="h-4 w-4 mr-2" />
                Formula Catalog
              </Button>
              <Button variant="outline" className="justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Performance Report
              </Button>
              <Button variant="outline" className="justify-start">
                <PieChart className="h-4 w-4 mr-2" />
                Cost Analysis
              </Button>
              <Button variant="outline" className="justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trend Analysis
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlendingLaboratoryPage;