'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Beaker,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  Droplets,
  Target
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Ingredient {
  materialId: string
  materialName?: string
  quantity: number
  unit: string
  percentage: number
}

interface BlendingRecipe {
  id: string
  recipeName: string
  recipeCode: string
  ingredients: Ingredient[]
  batchSize: number
  unit: string
  agingRequirement: number
  agingUnit: string
  status: 'ACTIVE' | 'INACTIVE' | 'TESTING'
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

interface Stats {
  totalRecipes: number
  activeRecipes: number
  testingRecipes: number
  avgIngredientsPerRecipe: number
}

export default function BlendingDashboard() {
  const [recipes, setRecipes] = useState<BlendingRecipe[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<BlendingRecipe | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    recipeName: '',
    batchSize: 0,
    unit: 'L',
    agingRequirement: 0,
    agingUnit: 'days',
    status: 'TESTING' as const,
    notes: '',
    ingredients: [{ materialId: '', quantity: 0, unit: 'L', percentage: 0 }]
  })

  useEffect(() => {
    fetchRecipes()
  }, [statusFilter])

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/blending?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setRecipes(data.recipes || [])
        if (data.stats) {
          setStats(data.stats)
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to fetch recipes'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to load blending recipes'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/blending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: `Recipe ${data.recipe.recipeName} created successfully`
        })
        setIsCreateDialogOpen(false)
        resetForm()
        fetchRecipes()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to create recipe'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to create recipe'
      })
    }
  }

  const handleUpdate = async () => {
    if (!selectedRecipe) return

    try {
      const response = await fetch(`/api/blending?recipeId=${selectedRecipe.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Recipe updated successfully"
        })
        setIsEditDialogOpen(false)
        setSelectedRecipe(null)
        resetForm()
        fetchRecipes()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to update recipe'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to update recipe'
      })
    }
  }

  const handleDelete = async (recipeId: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return

    try {
      const response = await fetch(`/api/blending?recipeId=${recipeId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Recipe deleted successfully"
        })
        fetchRecipes()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to delete recipe'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to delete recipe'
      })
    }
  }

  const openEditDialog = (recipe: BlendingRecipe) => {
    setSelectedRecipe(recipe)
    setFormData({
      recipeName: recipe.recipeName,
      batchSize: recipe.batchSize,
      unit: recipe.unit,
      agingRequirement: recipe.agingRequirement,
      agingUnit: recipe.agingUnit,
      status: recipe.status,
      notes: recipe.notes || '',
      ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [{ materialId: '', quantity: 0, unit: 'L', percentage: 0 }]
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      recipeName: '',
      batchSize: 0,
      unit: 'L',
      agingRequirement: 0,
      agingUnit: 'days',
      status: 'TESTING',
      notes: '',
      ingredients: [{ materialId: '', quantity: 0, unit: 'L', percentage: 0 }]
    })
  }

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { materialId: '', quantity: 0, unit: 'L', percentage: 0 }]
    })
  }

  const removeIngredient = (index: number) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index)
    setFormData({ ...formData, ingredients: newIngredients })
  }

  const updateIngredient = (index: number, field: string, value: any) => {
    const newIngredients = [...formData.ingredients]
    newIngredients[index] = { ...newIngredients[index], [field]: value }
    setFormData({ ...formData, ingredients: newIngredients })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any, icon: any }> = {
      ACTIVE: { variant: "default", icon: CheckCircle },
      INACTIVE: { variant: "secondary", icon: Clock },
      TESTING: { variant: "default", icon: Beaker }
    }

    const config = variants[status] || variants.TESTING
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  const filteredRecipes = recipes.filter(recipe =>
    recipe.recipeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.recipeCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Beaker className="h-8 w-8" />
            Blending Recipes
          </h1>
          <p className="text-muted-foreground">Manage perfume blending formulations and recipes</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              New Recipe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Blending Recipe</DialogTitle>
              <DialogDescription>Add a new perfume blending formulation</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipeName">Recipe Name *</Label>
                  <Input
                    id="recipeName"
                    value={formData.recipeName}
                    onChange={(e) => setFormData({...formData, recipeName: e.target.value})}
                    placeholder="e.g., Royal Oud Blend"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TESTING">Testing</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batchSize">Batch Size *</Label>
                  <Input
                    id="batchSize"
                    type="number"
                    value={formData.batchSize}
                    onChange={(e) => setFormData({...formData, batchSize: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Liters (L)</SelectItem>
                      <SelectItem value="ml">Milliliters (ml)</SelectItem>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="g">Grams (g)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agingRequirement">Aging (days)</Label>
                  <Input
                    id="agingRequirement"
                    type="number"
                    value={formData.agingRequirement}
                    onChange={(e) => setFormData({...formData, agingRequirement: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              {/* Ingredients */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Ingredients</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Ingredient
                  </Button>
                </div>
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 items-end">
                    <div className="col-span-2 space-y-1">
                      <Label className="text-xs">Material ID</Label>
                      <Input
                        placeholder="Material ID"
                        value={ingredient.materialId}
                        onChange={(e) => updateIngredient(index, 'materialId', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Quantity</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={ingredient.quantity}
                        onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">%</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={ingredient.percentage}
                        onChange={(e) => updateIngredient(index, 'percentage', parseFloat(e.target.value))}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                      disabled={formData.ingredients.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes about the recipe"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Create Recipe</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
              <Beaker className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRecipes}</div>
              <p className="text-xs text-muted-foreground">All formulations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Recipes</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeRecipes}</div>
              <p className="text-xs text-muted-foreground">Ready for production</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Testing Phase</CardTitle>
              <Beaker className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.testingRecipes}</div>
              <p className="text-xs text-muted-foreground">Under development</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Ingredients</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgIngredientsPerRecipe.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Per recipe</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by recipe name or code..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="TESTING">Testing</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={fetchRecipes}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Recipes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Blending Recipes</CardTitle>
          <CardDescription>Manage all perfume blending formulations</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipe Code</TableHead>
                  <TableHead>Recipe Name</TableHead>
                  <TableHead>Batch Size</TableHead>
                  <TableHead>Ingredients</TableHead>
                  <TableHead>Aging</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecipes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No recipes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecipes.map((recipe) => (
                    <TableRow key={recipe.id}>
                      <TableCell className="font-medium">{recipe.recipeCode}</TableCell>
                      <TableCell>{recipe.recipeName}</TableCell>
                      <TableCell>{recipe.batchSize} {recipe.unit}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{recipe.ingredients.length} items</Badge>
                      </TableCell>
                      <TableCell>{recipe.agingRequirement} {recipe.agingUnit}</TableCell>
                      <TableCell>{getStatusBadge(recipe.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(recipe)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(recipe.id)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blending Recipe</DialogTitle>
            <DialogDescription>Update recipe formulation and details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-recipeName">Recipe Name</Label>
                <Input
                  id="edit-recipeName"
                  value={formData.recipeName}
                  onChange={(e) => setFormData({...formData, recipeName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TESTING">Testing</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-batchSize">Batch Size</Label>
                <Input
                  id="edit-batchSize"
                  type="number"
                  value={formData.batchSize}
                  onChange={(e) => setFormData({...formData, batchSize: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-unit">Unit</Label>
                <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Liters (L)</SelectItem>
                    <SelectItem value="ml">Milliliters (ml)</SelectItem>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="g">Grams (g)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-agingRequirement">Aging (days)</Label>
                <Input
                  id="edit-agingRequirement"
                  type="number"
                  value={formData.agingRequirement}
                  onChange={(e) => setFormData({...formData, agingRequirement: parseInt(e.target.value)})}
                />
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Ingredients</Label>
                <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Ingredient
                </Button>
              </div>
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="grid grid-cols-5 gap-2 items-end">
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Material ID</Label>
                    <Input
                      placeholder="Material ID"
                      value={ingredient.materialId}
                      onChange={(e) => updateIngredient(index, 'materialId', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Quantity</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={ingredient.quantity}
                      onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">%</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={ingredient.percentage}
                      onChange={(e) => updateIngredient(index, 'percentage', parseFloat(e.target.value))}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                    disabled={formData.ingredients.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Update Recipe</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
