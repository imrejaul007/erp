'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Calendar, ChefHat, Beaker, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
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
import { DatePicker } from '@/components/ui/date-picker';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

// Mock data for production batches
const productionBatches = [
  {
    id: 'PB001',
    product: 'Royal Oud Premium',
    recipe: 'RCP-001',
    quantity: 100,
    unit: 'bottles',
    status: 'In Progress',
    progress: 75,
    startDate: '2024-09-25',
    expectedCompletion: '2024-10-02',
    operator: 'Ahmed Al-Rashid',
    priority: 'High',
    qualityCheck: 'Pending',
  },
  {
    id: 'PB002',
    product: 'Amber Essence Deluxe',
    recipe: 'RCP-002',
    quantity: 50,
    unit: 'bottles',
    status: 'Completed',
    progress: 100,
    startDate: '2024-09-20',
    expectedCompletion: '2024-09-28',
    operator: 'Fatima Hassan',
    priority: 'Medium',
    qualityCheck: 'Passed',
  },
  {
    id: 'PB003',
    product: 'Sandalwood Collection',
    recipe: 'RCP-003',
    quantity: 75,
    unit: 'bottles',
    status: 'Planning',
    progress: 0,
    startDate: '2024-10-05',
    expectedCompletion: '2024-10-12',
    operator: 'Mohammed Saeed',
    priority: 'Low',
    qualityCheck: 'Not Started',
  },
];

// Mock recipes data
const recipes = [
  {
    id: 'RCP-001',
    name: 'Royal Oud Premium',
    category: 'Oud',
    version: '1.2',
    ingredients: [
      { name: 'Oud Oil', quantity: 15, unit: 'ml' },
      { name: 'Rose Water', quantity: 5, unit: 'ml' },
      { name: 'Sandalwood Extract', quantity: 10, unit: 'ml' },
      { name: 'Carrier Oil', quantity: 70, unit: 'ml' },
    ],
    instructions: [
      'Heat carrier oil to 60°C',
      'Add oud oil slowly while stirring',
      'Incorporate rose water gradually',
      'Add sandalwood extract',
      'Cool to room temperature',
      'Filter and bottle',
    ],
    yield: 100,
    batchTime: '4 hours',
    status: 'Active',
  },
  {
    id: 'RCP-002',
    name: 'Amber Essence Deluxe',
    category: 'Amber',
    version: '2.0',
    ingredients: [
      { name: 'Amber Resin', quantity: 20, unit: 'g' },
      { name: 'Jojoba Oil', quantity: 80, unit: 'ml' },
      { name: 'Vitamin E', quantity: 2, unit: 'ml' },
    ],
    yield: 50,
    batchTime: '6 hours',
    status: 'Active',
  },
];

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'Planning': 'outline',
    'In Progress': 'default',
    'Completed': 'secondary',
    'On Hold': 'destructive',
  };
  return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
};

const getPriorityBadge = (priority: string) => {
  const colors: { [key: string]: string } = {
    'High': 'bg-red-500 text-white',
    'Medium': 'bg-yellow-500 text-white',
    'Low': 'bg-green-500 text-white',
  };
  return <Badge className={colors[priority] || 'bg-gray-500 text-white'}>{priority}</Badge>;
};

const getQualityBadge = (status: string) => {
  const variants: { [key: string]: React.ReactNode } = {
    'Passed': <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Passed</Badge>,
    'Failed': <Badge className="bg-red-500 text-white"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>,
    'Pending': <Badge className="bg-yellow-500 text-white"><AlertTriangle className="w-3 h-3 mr-1" />Pending</Badge>,
    'Not Started': <Badge variant="outline">Not Started</Badge>,
  };
  return variants[status] || <Badge variant="outline">{status}</Badge>;
};

export default function ProductionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isNewBatchDialogOpen, setIsNewBatchDialogOpen] = useState(false);
  const [isNewRecipeDialogOpen, setIsNewRecipeDialogOpen] = useState(false);

  const filteredBatches = productionBatches.filter(batch => {
    const matchesSearch = batch.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || batch.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-oud-600" />
            Production Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage recipes, production batches, and quality control
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isNewRecipeDialogOpen} onOpenChange={setIsNewRecipeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Beaker className="h-4 w-4" />
                New Recipe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Recipe</DialogTitle>
                <DialogDescription>
                  Add a new recipe for production batches
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
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
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipe-description">Description</Label>
                  <Textarea id="recipe-description" placeholder="Recipe description and notes" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsNewRecipeDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsNewRecipeDialogOpen(false)}>
                    Create Recipe
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isNewBatchDialogOpen} onOpenChange={setIsNewBatchDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-oud-600 hover:bg-oud-700">
                <Plus className="h-4 w-4" />
                New Production Batch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Production Batch</DialogTitle>
                <DialogDescription>
                  Schedule a new production batch using existing recipes
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batch-recipe">Select Recipe</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose recipe" />
                      </SelectTrigger>
                      <SelectContent>
                        {recipes.map((recipe) => (
                          <SelectItem key={recipe.id} value={recipe.id}>
                            {recipe.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch-quantity">Quantity</Label>
                    <Input id="batch-quantity" type="number" placeholder="100" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <DatePicker
                      date={selectedDate}
                      setDate={setSelectedDate}
                      placeholder="Select start date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch-priority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batch-operator">Assigned Operator</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ahmed">Ahmed Al-Rashid</SelectItem>
                      <SelectItem value="fatima">Fatima Hassan</SelectItem>
                      <SelectItem value="mohammed">Mohammed Saeed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsNewBatchDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsNewBatchDialogOpen(false)}>
                    Create Batch
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Currently in production
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Batches finished today
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Awaiting quality check
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-oud-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Recipes</CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recipes.length}</div>
            <p className="text-xs text-muted-foreground">
              Available for production
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="batches" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="batches">Production Batches</TabsTrigger>
          <TabsTrigger value="recipes">Recipe Management</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
        </TabsList>

        <TabsContent value="batches" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Production Batches</CardTitle>
              <CardDescription>
                Monitor and manage all production batches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search batches..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Batches Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Quality</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBatches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">{batch.id}</TableCell>
                        <TableCell>{batch.product}</TableCell>
                        <TableCell>{batch.quantity} {batch.unit}</TableCell>
                        <TableCell>{getStatusBadge(batch.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={batch.progress} className="w-16" />
                            <span className="text-sm text-muted-foreground">
                              {batch.progress}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getPriorityBadge(batch.priority)}</TableCell>
                        <TableCell>{batch.operator}</TableCell>
                        <TableCell>{getQualityBadge(batch.qualityCheck)}</TableCell>
                        <TableCell>{batch.expectedCompletion}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recipes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recipe Library</CardTitle>
              <CardDescription>
                Manage production recipes and formulations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {recipes.map((recipe) => (
                  <Card key={recipe.id} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{recipe.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {recipe.id} • Version {recipe.version} • {recipe.category}
                        </p>
                      </div>
                      <Badge variant={recipe.status === 'Active' ? 'default' : 'secondary'}>
                        {recipe.status}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Ingredients</h4>
                        <div className="space-y-1 text-sm">
                          {recipe.ingredients.map((ingredient, index) => (
                            <div key={index} className="flex justify-between">
                              <span>{ingredient.name}</span>
                              <span className="text-muted-foreground">
                                {ingredient.quantity} {ingredient.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {recipe.instructions && (
                        <div>
                          <h4 className="font-medium mb-2">Instructions</h4>
                          <ol className="space-y-1 text-sm list-decimal list-inside text-muted-foreground">
                            {recipe.instructions.map((step, index) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Yield: {recipe.yield} units</span>
                      <span>Batch Time: {recipe.batchTime}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control Dashboard</CardTitle>
              <CardDescription>
                Monitor quality checks and testing results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {productionBatches
                  .filter(batch => batch.qualityCheck !== 'Not Started')
                  .map((batch) => (
                    <Card key={batch.id} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{batch.product}</h3>
                          <p className="text-sm text-muted-foreground">
                            Batch {batch.id} • {batch.quantity} {batch.unit}
                          </p>
                        </div>
                        {getQualityBadge(batch.qualityCheck)}
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Production Date:</span>
                          <p className="text-muted-foreground">{batch.startDate}</p>
                        </div>
                        <div>
                          <span className="font-medium">Operator:</span>
                          <p className="text-muted-foreground">{batch.operator}</p>
                        </div>
                        <div>
                          <span className="font-medium">Recipe:</span>
                          <p className="text-muted-foreground">{batch.recipe}</p>
                        </div>
                      </div>

                      {batch.qualityCheck === 'Pending' && (
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}