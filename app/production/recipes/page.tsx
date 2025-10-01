'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Beaker, FileText, Copy, Edit, Trash2, Clock, Users, AlertCircle, CheckCircle, Star, Archive, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

// Mock data for recipes
const recipes = [
  {
    id: 'RCP-001',
    name: 'Royal Oud Premium',
    category: 'Oud',
    type: 'Essential Oil',
    version: '2.1',
    status: 'Active',
    complexity: 'Advanced',
    yield: 100,
    batchTime: '8 hours',
    agingTime: '30 days',
    cost: 2850,
    currency: 'AED',
    createdBy: 'Master Perfumer Ali',
    createdDate: '2024-01-15',
    lastModified: '2024-09-20',
    usageCount: 15,
    rating: 4.8,
    ingredients: [
      { name: 'Cambodian Oud Oil', quantity: 15, unit: 'ml', cost: 2000, grade: 'Premium' },
      { name: 'Damask Rose Water', quantity: 5, unit: 'ml', cost: 150, grade: 'A+' },
      { name: 'Sandalwood Extract', quantity: 10, unit: 'ml', cost: 300, grade: 'Premium' },
      { name: 'Jojoba Carrier Oil', quantity: 70, unit: 'ml', cost: 200, grade: 'Organic' },
      { name: 'Natural Vitamin E', quantity: 2, unit: 'ml', cost: 50, grade: 'Food Grade' },
    ],
    instructions: [
      'Prepare distillation chamber at 65°C',
      'Heat carrier oil to 60°C in temperature-controlled vessel',
      'Add oud oil slowly while maintaining continuous stirring (200 RPM)',
      'Incorporate rose water gradually over 15 minutes',
      'Add sandalwood extract and vitamin E',
      'Cool to room temperature over 2 hours',
      'Filter through fine mesh and transfer to aging vessels',
      'Store in temperature-controlled environment (18-22°C)',
    ],
    qualityChecks: [
      'Aroma intensity test',
      'Color consistency check',
      'Viscosity measurement',
      'pH level verification',
      'Contamination screening',
    ],
    notes: 'Traditional Cambodian distillation method. Requires 30-day aging process for optimal scent development.',
    tags: ['Premium', 'Traditional', 'Aging Required', 'Export Quality'],
  },
  {
    id: 'RCP-002',
    name: 'Amber Essence Deluxe',
    category: 'Amber',
    type: 'Resin Extract',
    version: '1.8',
    status: 'Active',
    complexity: 'Intermediate',
    yield: 80,
    batchTime: '6 hours',
    agingTime: '14 days',
    cost: 1800,
    currency: 'AED',
    createdBy: 'Perfumer Fatima',
    createdDate: '2024-02-10',
    lastModified: '2024-09-15',
    usageCount: 22,
    rating: 4.5,
    ingredients: [
      { name: 'Baltic Amber Resin', quantity: 25, unit: 'g', cost: 800, grade: 'Premium' },
      { name: 'Sweet Almond Oil', quantity: 75, unit: 'ml', cost: 120, grade: 'Cold Pressed' },
      { name: 'Benzoin Extract', quantity: 5, unit: 'ml', cost: 200, grade: 'Pure' },
      { name: 'Vanilla Oleoresin', quantity: 3, unit: 'ml', cost: 150, grade: 'Madagascar' },
    ],
    instructions: [
      'Crush amber resin to fine powder using mortar and pestle',
      'Heat almond oil to 50°C in double boiler',
      'Add amber powder gradually while stirring',
      'Maintain temperature for 4 hours with occasional stirring',
      'Add benzoin and vanilla extracts',
      'Cool and filter through cheesecloth',
      'Age in dark glass containers for 14 days',
    ],
    qualityChecks: [
      'Resin dissolution check',
      'Clarity assessment',
      'Scent profile evaluation',
      'Stability test',
    ],
    notes: 'Requires careful temperature control. Amber must be completely dissolved for optimal quality.',
    tags: ['Intermediate', 'Resin Based', 'UAE Traditional'],
  },
  {
    id: 'RCP-003',
    name: 'Desert Rose Attar',
    category: 'Rose',
    type: 'Attar',
    version: '3.0',
    status: 'Under Review',
    complexity: 'Expert',
    yield: 50,
    batchTime: '12 hours',
    agingTime: '60 days',
    cost: 4200,
    currency: 'AED',
    createdBy: 'Master Ahmad',
    createdDate: '2024-03-05',
    lastModified: '2024-09-25',
    usageCount: 8,
    rating: 4.9,
    ingredients: [
      { name: 'Taif Rose Petals', quantity: 500, unit: 'g', cost: 2000, grade: 'Hand Picked' },
      { name: 'Sandalwood Oil Base', quantity: 30, unit: 'ml', cost: 1500, grade: 'Mysore' },
      { name: 'Pure Water', quantity: 2000, unit: 'ml', cost: 10, grade: 'Distilled' },
    ],
    instructions: [
      'Prepare traditional copper still (deg)',
      'Layer rose petals in distillation chamber',
      'Add distilled water and seal properly',
      'Heat gradually to 100°C over 2 hours',
      'Maintain distillation for 8-10 hours',
      'Collect hydrosol and essential oil separately',
      'Mix with sandalwood base in traditional ratio',
      'Age in buried clay pots for 60 days',
    ],
    qualityChecks: [
      'Rose essence concentration',
      'Traditional aroma profile',
      'Oil separation quality',
      'Aging vessel inspection',
      'Final blend assessment',
    ],
    notes: 'Traditional Arabic attar method. Requires experienced perfumer supervision. Clay pot aging is crucial.',
    tags: ['Expert Level', 'Traditional Arabic', 'Long Aging', 'Handcrafted'],
  },
];

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: React.ReactNode } } = {
    'Active': { variant: 'default', icon: <CheckCircle className="w-3 h-3 mr-1" /> },
    'Under Review': { variant: 'outline', icon: <AlertCircle className="w-3 h-3 mr-1" /> },
    'Draft': { variant: 'secondary', icon: <FileText className="w-3 h-3 mr-1" /> },
    'Archived': { variant: 'destructive', icon: <Archive className="w-3 h-3 mr-1" /> },
  };
  const config = variants[status] || { variant: 'outline', icon: null };
  return (
    <Badge variant={config.variant} className="flex items-center">
      {config.icon}
      {status}
    </Badge>
  );
};

const getComplexityBadge = (complexity: string) => {
  const colors: { [key: string]: string } = {
    'Beginner': 'bg-green-500 text-white',
    'Intermediate': 'bg-yellow-500 text-white',
    'Advanced': 'bg-orange-500 text-white',
    'Expert': 'bg-red-500 text-white',
  };
  return <Badge className={colors[complexity] || 'bg-gray-500 text-white'}>{complexity}</Badge>;
};

export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isNewRecipeDialogOpen, setIsNewRecipeDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<typeof recipes[0] | null>(null);
  const [isViewRecipeDialogOpen, setIsViewRecipeDialogOpen] = useState(false);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || recipe.category.toLowerCase() === filterCategory.toLowerCase();
    const matchesStatus = filterStatus === 'all' || recipe.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleViewRecipe = (recipe: typeof recipes[0]) => {
    setSelectedRecipe(recipe);
    setIsViewRecipeDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Beaker className="h-8 w-8 text-oud-600" />
            Recipe Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Create, manage, and version control production recipes and formulations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Copy className="h-4 w-4" />
            Import Recipe
          </Button>
          <Dialog open={isNewRecipeDialogOpen} onOpenChange={setIsNewRecipeDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-oud-600 hover:bg-oud-700">
                <Plus className="h-4 w-4" />
                New Recipe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Recipe</DialogTitle>
                <DialogDescription>
                  Create a new production recipe with detailed ingredients and instructions
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipe-name">Recipe Name</Label>
                      <Input id="recipe-name" placeholder="Enter recipe name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipe-category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oud">Oud</SelectItem>
                          <SelectItem value="amber">Amber</SelectItem>
                          <SelectItem value="rose">Rose</SelectItem>
                          <SelectItem value="musk">Musk</SelectItem>
                          <SelectItem value="attar">Attar</SelectItem>
                          <SelectItem value="blend">Blend</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipe-type">Product Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oil">Essential Oil</SelectItem>
                          <SelectItem value="attar">Attar</SelectItem>
                          <SelectItem value="perfume">Perfume</SelectItem>
                          <SelectItem value="extract">Extract</SelectItem>
                          <SelectItem value="resin">Resin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipe-complexity">Complexity Level</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select complexity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yield">Expected Yield</Label>
                      <Input id="yield" type="number" placeholder="100" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="batch-time">Batch Time</Label>
                      <Input id="batch-time" placeholder="e.g., 8 hours" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aging-time">Aging Time</Label>
                      <Input id="aging-time" placeholder="e.g., 30 days" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Ingredients Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Ingredients</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Ingredient
                    </Button>
                  </div>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-5 gap-2 text-sm font-medium text-muted-foreground">
                      <span>Ingredient Name</span>
                      <span>Quantity</span>
                      <span>Unit</span>
                      <span>Grade</span>
                      <span>Actions</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      <Input placeholder="Ingredient name" />
                      <Input type="number" placeholder="Amount" />
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="g">g</SelectItem>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="drops">drops</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder="Grade/Quality" />
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Instructions Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Production Instructions</h3>
                  <Textarea
                    placeholder="Enter detailed step-by-step production instructions..."
                    className="min-h-32"
                  />
                </div>

                <Separator />

                {/* Quality Control & Notes */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Quality Control Checks</h3>
                    <Textarea
                      placeholder="List quality control checkpoints..."
                      className="min-h-24"
                    />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Notes & Remarks</h3>
                    <Textarea
                      placeholder="Additional notes, tips, or warnings..."
                      className="min-h-24"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsNewRecipeDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="outline">
                    Save as Draft
                  </Button>
                  <Button onClick={() => setIsNewRecipeDialogOpen(false)} className="bg-oud-600 hover:bg-oud-700">
                    Create Recipe
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Recipes</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recipes.filter(r => r.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">
              Ready for production
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recipes.filter(r => r.status === 'Under Review').length}</div>
            <p className="text-xs text-muted-foreground">
              Pending approval
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expert Level</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recipes.filter(r => r.complexity === 'Expert').length}</div>
            <p className="text-xs text-muted-foreground">
              Master crafted recipes
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-oud-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(recipes.reduce((acc, r) => acc + r.rating, 0) / recipes.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Recipe quality score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Recipe Library</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recipe Library</CardTitle>
              <CardDescription>
                Manage all production recipes and formulations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search recipes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="oud">Oud</SelectItem>
                    <SelectItem value="amber">Amber</SelectItem>
                    <SelectItem value="rose">Rose</SelectItem>
                    <SelectItem value="musk">Musk</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="under review">Under Review</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Recipes Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipe</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Complexity</TableHead>
                      <TableHead>Yield</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecipes.map((recipe) => (
                      <TableRow key={recipe.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{recipe.name}</div>
                            <div className="text-sm text-muted-foreground">{recipe.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{recipe.category}</TableCell>
                        <TableCell>v{recipe.version}</TableCell>
                        <TableCell>{getStatusBadge(recipe.status)}</TableCell>
                        <TableCell>{getComplexityBadge(recipe.complexity)}</TableCell>
                        <TableCell>{recipe.yield} units</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{recipe.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{recipe.usageCount} times</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewRecipe(recipe)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4">
            {['Oud', 'Amber', 'Rose', 'Musk'].map((category) => {
              const categoryRecipes = recipes.filter(r => r.category === category);
              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{category} Recipes</span>
                      <Badge variant="outline">{categoryRecipes.length} recipes</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {categoryRecipes.map((recipe) => (
                        <div key={recipe.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-medium">{recipe.name}</div>
                              <div className="text-sm text-muted-foreground">
                                v{recipe.version} • {recipe.batchTime} • {recipe.yield} units
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getComplexityBadge(recipe.complexity)}
                            {getStatusBadge(recipe.status)}
                            <Button variant="outline" size="sm" onClick={() => handleViewRecipe(recipe)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recipe Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recipes.map((recipe) => (
                    <div key={recipe.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{recipe.name}</div>
                        <div className="text-sm text-muted-foreground">{recipe.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{recipe.usageCount} times</div>
                        <div className="text-sm text-muted-foreground">
                          AED {recipe.cost.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recipes.map((recipe) => (
                    <div key={recipe.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{recipe.name}</div>
                        <div className="text-sm text-muted-foreground">{recipe.complexity}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= recipe.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{recipe.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recipe Details Dialog */}
      <Dialog open={isViewRecipeDialogOpen} onOpenChange={setIsViewRecipeDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-oud-600" />
                  {selectedRecipe.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedRecipe.id} • Version {selectedRecipe.version} • {selectedRecipe.category}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Recipe Header Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedRecipe.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Complexity</Label>
                    <div className="mt-1">{getComplexityBadge(selectedRecipe.complexity)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Yield</Label>
                    <p className="text-sm mt-1">{selectedRecipe.yield} units</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Cost</Label>
                    <p className="text-sm mt-1">{selectedRecipe.currency} {selectedRecipe.cost.toLocaleString()}</p>
                  </div>
                </div>

                <Separator />

                {/* Ingredients */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ingredient</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Cost (AED)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedRecipe.ingredients.map((ingredient, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{ingredient.name}</TableCell>
                            <TableCell>{ingredient.quantity} {ingredient.unit}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{ingredient.grade}</Badge>
                            </TableCell>
                            <TableCell>{ingredient.cost.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <Separator />

                {/* Instructions */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Production Instructions</h3>
                  <ol className="space-y-2">
                    {selectedRecipe.instructions.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <Badge variant="outline" className="min-w-[24px] h-6 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <Separator />

                {/* Quality Checks & Notes */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Quality Control Checks</h3>
                    <ul className="space-y-2">
                      {selectedRecipe.qualityChecks.map((check, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {check}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Notes & Remarks</h3>
                    <p className="text-sm text-muted-foreground">{selectedRecipe.notes}</p>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedRecipe.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Recipe Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Label className="font-medium">Created By</Label>
                    <p className="text-muted-foreground">{selectedRecipe.createdBy}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Created Date</Label>
                    <p className="text-muted-foreground">{selectedRecipe.createdDate}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Last Modified</Label>
                    <p className="text-muted-foreground">{selectedRecipe.lastModified}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Usage Count</Label>
                    <p className="text-muted-foreground">{selectedRecipe.usageCount} times</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Recipe
                  </Button>
                  <Button className="bg-oud-600 hover:bg-oud-700">
                    Use in Production
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}