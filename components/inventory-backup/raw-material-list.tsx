'use client'

import React, { useState, useMemo } from 'react'
import { useInventoryStore } from '@/store/inventory-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Download,
  Upload,
  BarChart3,
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { MaterialWithBatches, MaterialFilters } from '@/types/inventory'
import { STOCK_STATUS_COLORS, GRADE_COLORS } from '@/types/inventory'

interface RawMaterialListProps {
  onSelectMaterial?: (material: MaterialWithBatches) => void
  onAddMaterial?: () => void
  onEditMaterial?: (material: MaterialWithBatches) => void
  onDeleteMaterial?: (material: MaterialWithBatches) => void
  onBulkAction?: (action: string, materialIds: string[]) => void
  showActions?: boolean
  selectable?: boolean
  compact?: boolean
}

export function RawMaterialList({
  onSelectMaterial,
  onAddMaterial,
  onEditMaterial,
  onDeleteMaterial,
  onBulkAction,
  showActions = true,
  selectable = false,
  compact = false,
}: RawMaterialListProps) {
  const {
    materials,
    materialFilters,
    materialsLoading,
    materialsPagination,
    bulkSelection,
    setMaterialFilters,
    clearMaterialFilters,
    setBulkSelection,
    addToBulkSelection,
    removeFromBulkSelection,
    clearBulkSelection,
    selectMaterial,
  } = useInventoryStore()

  const [searchTerm, setSearchTerm] = useState(materialFilters.search || '')
  const [showFilters, setShowFilters] = useState(false)

  // Calculate stock status
  const getStockStatus = (material: MaterialWithBatches) => {
    if (material.currentStock <= 0) return 'OUT_OF_STOCK'
    if (material.currentStock <= material.reorderLevel) return 'LOW'
    if (material.maxStockLevel && material.currentStock >= material.maxStockLevel) return 'OVERSTOCK'
    return 'NORMAL'
  }

  // Filter materials based on search and filters
  const filteredMaterials = useMemo(() => {
    let filtered = materials

    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(material =>
        material.name.toLowerCase().includes(search) ||
        material.sku.toLowerCase().includes(search) ||
        material.description?.toLowerCase().includes(search) ||
        material.supplier?.toLowerCase().includes(search)
      )
    }

    // Apply filters
    if (materialFilters.categoryId) {
      filtered = filtered.filter(material => material.categoryId === materialFilters.categoryId)
    }
    if (materialFilters.grade) {
      filtered = filtered.filter(material => material.grade === materialFilters.grade)
    }
    if (materialFilters.supplier) {
      filtered = filtered.filter(material => material.supplier === materialFilters.supplier)
    }
    if (materialFilters.stockStatus) {
      filtered = filtered.filter(material => getStockStatus(material) === materialFilters.stockStatus)
    }

    // Apply sorting
    if (materialFilters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any

        switch (materialFilters.sortBy) {
          case 'name':
            aValue = a.name
            bValue = b.name
            break
          case 'stock':
            aValue = a.currentStock
            bValue = b.currentStock
            break
          case 'lastUpdated':
            aValue = new Date(a.updatedAt)
            bValue = new Date(b.updatedAt)
            break
          case 'cost':
            aValue = a.costPerUnit
            bValue = b.costPerUnit
            break
          default:
            return 0
        }

        if (aValue < bValue) return materialFilters.sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return materialFilters.sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [materials, searchTerm, materialFilters])

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setMaterialFilters({ search: value, page: 1 })
  }

  // Handle filter change
  const handleFilterChange = (key: keyof MaterialFilters, value: any) => {
    setMaterialFilters({ [key]: value, page: 1 })
  }

  // Handle sorting
  const handleSort = (sortBy: string) => {
    const newOrder = materialFilters.sortBy === sortBy && materialFilters.sortOrder === 'asc' ? 'desc' : 'asc'
    setMaterialFilters({ sortBy, sortOrder: newOrder })
  }

  // Handle row selection
  const handleRowSelect = (materialId: string, selected: boolean) => {
    if (selected) {
      addToBulkSelection(materialId)
    } else {
      removeFromBulkSelection(materialId)
    }
  }

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setBulkSelection(filteredMaterials.map(m => m.id))
    } else {
      clearBulkSelection()
    }
  }

  // Get unique values for filters
  const uniqueCategories = useMemo(() => {
    const categories = materials.map(m => m.category).filter(Boolean)
    return Array.from(new Set(categories.map(c => c.name))).map(name =>
      categories.find(c => c.name === name)!
    )
  }, [materials])

  const uniqueSuppliers = useMemo(() => {
    return Array.from(new Set(materials.map(m => m.supplier).filter(Boolean)))
  }, [materials])

  const uniqueGrades = useMemo(() => {
    return Array.from(new Set(materials.map(m => m.grade)))
  }, [materials])

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredMaterials.length
    const outOfStock = filteredMaterials.filter(m => getStockStatus(m) === 'OUT_OF_STOCK').length
    const lowStock = filteredMaterials.filter(m => getStockStatus(m) === 'LOW').length
    const totalValue = filteredMaterials.reduce((sum, m) => sum + (m.currentStock * m.costPerUnit), 0)

    return { total, outOfStock, lowStock, totalValue }
  }, [filteredMaterials])

  if (materialsLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading materials...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Raw Materials</h2>
          <p className="text-muted-foreground">
            Manage your inventory of raw materials, oils, and ingredients
          </p>
        </div>
        {showActions && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={onAddMaterial}>
              <Plus className="h-4 w-4 mr-2" />
              Add Material
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      {!compact && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.outOfStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <TrendingDown className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.lowStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              {(searchTerm || Object.keys(materialFilters).length > 4) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('')
                    clearMaterialFilters()
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
            {bulkSelection.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {bulkSelection.length} selected
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm">
                      Bulk Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onBulkAction?.('export', bulkSelection)}>
                      Export Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onBulkAction?.('update', bulkSelection)}>
                      Bulk Update
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onBulkAction?.('delete', bulkSelection)}
                    >
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
              <Select
                value={materialFilters.categoryId || ''}
                onValueChange={(value) => handleFilterChange('categoryId', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={materialFilters.grade || ''}
                onValueChange={(value) => handleFilterChange('grade', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Grades</SelectItem>
                  {uniqueGrades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={materialFilters.supplier || ''}
                onValueChange={(value) => handleFilterChange('supplier', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Suppliers</SelectItem>
                  {uniqueSuppliers.map((supplier) => (
                    <SelectItem key={supplier} value={supplier}>
                      {supplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={materialFilters.stockStatus || ''}
                onValueChange={(value) => handleFilterChange('stockStatus', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="LOW">Low Stock</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                  <SelectItem value="OVERSTOCK">Overstock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No materials found</p>
              <p className="text-muted-foreground">
                {searchTerm || Object.keys(materialFilters).length > 4
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first raw material'
                }
              </p>
              {showActions && (
                <Button onClick={onAddMaterial} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {selectable && (
                      <TableHead className="w-12">
                        <Checkbox
                          checked={bulkSelection.length === filteredMaterials.length && filteredMaterials.length > 0}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                    )}
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('name')}
                    >
                      Material
                      {materialFilters.sortBy === 'name' && (
                        materialFilters.sortOrder === 'asc' ? <TrendingUp className="inline h-3 w-3 ml-1" /> : <TrendingDown className="inline h-3 w-3 ml-1" />
                      )}
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('stock')}
                    >
                      Stock
                      {materialFilters.sortBy === 'stock' && (
                        materialFilters.sortOrder === 'asc' ? <TrendingUp className="inline h-3 w-3 ml-1" /> : <TrendingDown className="inline h-3 w-3 ml-1" />
                      )}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 text-right"
                      onClick={() => handleSort('cost')}
                    >
                      Cost/Unit
                      {materialFilters.sortBy === 'cost' && (
                        materialFilters.sortOrder === 'asc' ? <TrendingUp className="inline h-3 w-3 ml-1" /> : <TrendingDown className="inline h-3 w-3 ml-1" />
                      )}
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Supplier</TableHead>
                    {showActions && <TableHead className="w-16">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => {
                    const stockStatus = getStockStatus(material)
                    const isSelected = bulkSelection.includes(material.id)

                    return (
                      <TableRow
                        key={material.id}
                        className={isSelected ? 'bg-muted/50' : ''}
                      >
                        {selectable && (
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleRowSelect(material.id, !!checked)}
                              aria-label={`Select ${material.name}`}
                            />
                          </TableCell>
                        )}
                        <TableCell
                          className={onSelectMaterial ? 'cursor-pointer hover:bg-muted/50' : ''}
                          onClick={() => {
                            selectMaterial(material)
                            onSelectMaterial?.(material)
                          }}
                        >
                          <div>
                            <div className="font-medium">{material.name}</div>
                            <div className="text-sm text-muted-foreground">
                              SKU: {material.sku}
                            </div>
                            {material.batches.length > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {material.batches.length} batch(es)
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {material.category?.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={GRADE_COLORS[material.grade as keyof typeof GRADE_COLORS]}
                          >
                            {material.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="text-sm">
                                  {material.currentStock.toLocaleString()} {material.unitOfMeasure}
                                  {material.reorderLevel && material.currentStock <= material.reorderLevel && (
                                    <AlertTriangle className="inline h-3 w-3 ml-1 text-warning" />
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-xs">
                                  <div>Available: {material.availableStock || material.currentStock}</div>
                                  {material.reservedStock > 0 && (
                                    <div>Reserved: {material.reservedStock}</div>
                                  )}
                                  <div>Reorder Level: {material.reorderLevel}</div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-right">
                          ${material.costPerUnit.toLocaleString()}
                          <div className="text-xs text-muted-foreground">
                            /{material.unitOfMeasure}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={STOCK_STATUS_COLORS[stockStatus as keyof typeof STOCK_STATUS_COLORS]}
                          >
                            {stockStatus.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {material.supplier || 'N/A'}
                          </div>
                        </TableCell>
                        {showActions && (
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => onSelectMaterial?.(material)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onEditMaterial?.(material)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => onDeleteMaterial?.(material)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {materialsPagination.pages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {((materialsPagination.page - 1) * materialsPagination.limit) + 1} to{' '}
                {Math.min(materialsPagination.page * materialsPagination.limit, materialsPagination.total)} of{' '}
                {materialsPagination.total} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange('page', materialsPagination.page - 1)}
                  disabled={materialsPagination.page === 1}
                >
                  Previous
                </Button>
                <div className="text-sm">
                  Page {materialsPagination.page} of {materialsPagination.pages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange('page', materialsPagination.page + 1)}
                  disabled={materialsPagination.page === materialsPagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Low stock alert */}
      {stats.lowStock > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have {stats.lowStock} material(s) with low stock levels.
            <Button variant="link" className="p-0 h-auto font-normal"
              onClick={() => handleFilterChange('stockStatus', 'LOW')}>
              View low stock items
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}