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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package2,
  Calendar,
  MapPin,
  AlertTriangle,
  Clock,
  TrendingDown,
  TrendingUp,
  BarChart3,
  FileText,
  RefreshCw,
} from 'lucide-react'
import { format, differenceInDays, isAfter, isBefore } from 'date-fns'
import type { MaterialBatchWithMaterial, BatchFilters, BatchInfo } from '@/types/inventory'
import { GRADE_COLORS } from '@/types/inventory'

interface BatchTrackingProps {
  materialId?: string
  onSelectBatch?: (batch: MaterialBatchWithMaterial) => void
  onAddBatch?: () => void
  onEditBatch?: (batch: MaterialBatchWithMaterial) => void
  onDeleteBatch?: (batch: MaterialBatchWithMaterial) => void
  showActions?: boolean
  compact?: boolean
}

export function BatchTracking({
  materialId,
  onSelectBatch,
  onAddBatch,
  onEditBatch,
  onDeleteBatch,
  showActions = true,
  compact = false,
}: BatchTrackingProps) {
  const {
    batches,
    batchFilters,
    batchesLoading,
    selectedBatch,
    setBatchFilters,
    clearBatchFilters,
    selectBatch,
  } = useInventoryStore()

  const [searchTerm, setSearchTerm] = useState(batchFilters.search || '')
  const [showFilters, setShowFilters] = useState(false)

  // Filter batches
  const filteredBatches = useMemo(() => {
    let filtered = batches

    // Filter by material if specified
    if (materialId) {
      filtered = filtered.filter(batch => batch.materialId === materialId)
    }

    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(batch =>
        batch.batchNumber.toLowerCase().includes(search) ||
        batch.material.name.toLowerCase().includes(search) ||
        batch.origin?.toLowerCase().includes(search) ||
        batch.qualityNotes?.toLowerCase().includes(search)
      )
    }

    // Apply filters
    if (batchFilters.materialId && !materialId) {
      filtered = filtered.filter(batch => batch.materialId === batchFilters.materialId)
    }
    if (batchFilters.grade) {
      filtered = filtered.filter(batch => batch.grade === batchFilters.grade)
    }
    if (batchFilters.origin) {
      filtered = filtered.filter(batch => batch.origin === batchFilters.origin)
    }
    if (batchFilters.location) {
      filtered = filtered.filter(batch => batch.location === batchFilters.location)
    }
    if (batchFilters.expiryStatus) {
      const now = new Date()
      filtered = filtered.filter(batch => {
        if (!batch.expiryDate) return batchFilters.expiryStatus === 'FRESH'

        const expiryDate = new Date(batch.expiryDate)
        const daysUntilExpiry = differenceInDays(expiryDate, now)

        switch (batchFilters.expiryStatus) {
          case 'FRESH':
            return daysUntilExpiry > 30
          case 'EXPIRING_SOON':
            return daysUntilExpiry <= 30 && daysUntilExpiry > 0
          case 'EXPIRED':
            return daysUntilExpiry <= 0
          default:
            return true
        }
      })
    }

    // Apply sorting
    if (batchFilters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any

        switch (batchFilters.sortBy) {
          case 'receivedDate':
            aValue = new Date(a.receivedDate)
            bValue = new Date(b.receivedDate)
            break
          case 'expiryDate':
            aValue = a.expiryDate ? new Date(a.expiryDate) : new Date('9999-12-31')
            bValue = b.expiryDate ? new Date(b.expiryDate) : new Date('9999-12-31')
            break
          case 'quantity':
            aValue = a.currentStock
            bValue = b.currentStock
            break
          default:
            return 0
        }

        if (aValue < bValue) return batchFilters.sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return batchFilters.sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [batches, materialId, searchTerm, batchFilters])

  // Calculate batch info
  const getBatchInfo = (batch: MaterialBatchWithMaterial): BatchInfo => {
    const now = new Date()
    const expiryDate = batch.expiryDate ? new Date(batch.expiryDate) : null
    const daysUntilExpiry = expiryDate ? differenceInDays(expiryDate, now) : null

    return {
      id: batch.id,
      batchNumber: batch.batchNumber,
      materialName: batch.material.name,
      quantity: batch.quantity,
      currentStock: batch.currentStock,
      unit: batch.unit,
      grade: batch.grade,
      origin: batch.origin,
      receivedDate: new Date(batch.receivedDate),
      expiryDate,
      daysUntilExpiry,
      isExpired: batch.isExpired || (daysUntilExpiry !== null && daysUntilExpiry <= 0),
      location: batch.location,
    }
  }

  // Get expiry status
  const getExpiryStatus = (batchInfo: BatchInfo) => {
    if (batchInfo.isExpired) return { status: 'EXPIRED', color: 'destructive', label: 'Expired' }
    if (batchInfo.daysUntilExpiry !== null) {
      if (batchInfo.daysUntilExpiry <= 7) return { status: 'CRITICAL', color: 'destructive', label: `${batchInfo.daysUntilExpiry} days` }
      if (batchInfo.daysUntilExpiry <= 30) return { status: 'WARNING', color: 'warning', label: `${batchInfo.daysUntilExpiry} days` }
    }
    return { status: 'FRESH', color: 'default', label: 'Fresh' }
  }

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredBatches.length
    const expired = filteredBatches.filter(b => getBatchInfo(b).isExpired).length
    const expiringSoon = filteredBatches.filter(b => {
      const info = getBatchInfo(b)
      return !info.isExpired && info.daysUntilExpiry !== null && info.daysUntilExpiry <= 30
    }).length
    const totalValue = filteredBatches.reduce((sum, b) => sum + (b.currentStock * b.costPerUnit), 0)
    const totalStock = filteredBatches.reduce((sum, b) => sum + b.currentStock, 0)

    return { total, expired, expiringSoon, totalValue, totalStock }
  }, [filteredBatches])

  // Get unique values for filters
  const uniqueMaterials = useMemo(() => {
    return Array.from(new Set(batches.map(b => b.material))).filter(Boolean)
  }, [batches])

  const uniqueOrigins = useMemo(() => {
    return Array.from(new Set(batches.map(b => b.origin).filter(Boolean)))
  }, [batches])

  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(batches.map(b => b.location).filter(Boolean)))
  }, [batches])

  const uniqueGrades = useMemo(() => {
    return Array.from(new Set(batches.map(b => b.grade)))
  }, [batches])

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setBatchFilters({ search: value, page: 1 })
  }

  // Handle filter change
  const handleFilterChange = (key: keyof BatchFilters, value: any) => {
    setBatchFilters({ [key]: value, page: 1 })
  }

  // Handle sorting
  const handleSort = (sortBy: string) => {
    const newOrder = batchFilters.sortBy === sortBy && batchFilters.sortOrder === 'asc' ? 'desc' : 'asc'
    setBatchFilters({ sortBy, sortOrder: newOrder })
  }

  if (batchesLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading batches...</span>
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
          <h2 className="text-2xl font-bold tracking-tight">Batch Tracking</h2>
          <p className="text-muted-foreground">
            Track and manage material batches with quality and expiry information
          </p>
        </div>
        {showActions && (
          <Button onClick={onAddBatch}>
            <Plus className="h-4 w-4 mr-2" />
            Add Batch
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      {!compact && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
              <Package2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStock.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.expiringSoon}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expired</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.expired}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="batches" className="w-full">
        <TabsList>
          <TabsTrigger value="batches">All Batches</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>

        <TabsContent value="batches" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search batches..."
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
                  {(searchTerm || Object.keys(batchFilters).length > 4) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchTerm('')
                        clearBatchFilters()
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t">
                  {!materialId && (
                    <Select
                      value={batchFilters.materialId || ''}
                      onValueChange={(value) => handleFilterChange('materialId', value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Material" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Materials</SelectItem>
                        {uniqueMaterials.map((material) => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  <Select
                    value={batchFilters.grade || ''}
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
                    value={batchFilters.origin || ''}
                    onValueChange={(value) => handleFilterChange('origin', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Origin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Origins</SelectItem>
                      {uniqueOrigins.map((origin) => (
                        <SelectItem key={origin} value={origin}>
                          {origin}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={batchFilters.location || ''}
                    onValueChange={(value) => handleFilterChange('location', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Locations</SelectItem>
                      {uniqueLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={batchFilters.expiryStatus || ''}
                    onValueChange={(value) => handleFilterChange('expiryStatus', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Expiry Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Status</SelectItem>
                      <SelectItem value="FRESH">Fresh</SelectItem>
                      <SelectItem value="EXPIRING_SOON">Expiring Soon</SelectItem>
                      <SelectItem value="EXPIRED">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardHeader>

            <CardContent>
              {filteredBatches.length === 0 ? (
                <div className="text-center py-8">
                  <Package2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No batches found</p>
                  <p className="text-muted-foreground">
                    {searchTerm || Object.keys(batchFilters).length > 4
                      ? 'Try adjusting your search or filters'
                      : 'Get started by adding your first material batch'
                    }
                  </p>
                  {showActions && (
                    <Button onClick={onAddBatch} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Batch
                    </Button>
                  )}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('receivedDate')}
                        >
                          Batch Info
                          {batchFilters.sortBy === 'receivedDate' && (
                            batchFilters.sortOrder === 'asc' ? <TrendingUp className="inline h-3 w-3 ml-1" /> : <TrendingDown className="inline h-3 w-3 ml-1" />
                          )}
                        </TableHead>
                        {!materialId && <TableHead>Material</TableHead>}
                        <TableHead>Grade & Origin</TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('quantity')}
                        >
                          Stock
                          {batchFilters.sortBy === 'quantity' && (
                            batchFilters.sortOrder === 'asc' ? <TrendingUp className="inline h-3 w-3 ml-1" /> : <TrendingDown className="inline h-3 w-3 ml-1" />
                          )}
                        </TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('expiryDate')}
                        >
                          Expiry
                          {batchFilters.sortBy === 'expiryDate' && (
                            batchFilters.sortOrder === 'asc' ? <TrendingUp className="inline h-3 w-3 ml-1" /> : <TrendingDown className="inline h-3 w-3 ml-1" />
                          )}
                        </TableHead>
                        <TableHead>Location</TableHead>
                        {showActions && <TableHead className="w-16">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBatches.map((batch) => {
                        const batchInfo = getBatchInfo(batch)
                        const expiryStatus = getExpiryStatus(batchInfo)
                        const stockPercentage = (batchInfo.currentStock / batchInfo.quantity) * 100

                        return (
                          <TableRow
                            key={batch.id}
                            className={selectedBatch?.id === batch.id ? 'bg-muted/50' : ''}
                          >
                            <TableCell
                              className={onSelectBatch ? 'cursor-pointer hover:bg-muted/50' : ''}
                              onClick={() => {
                                selectBatch(batch)
                                onSelectBatch?.(batch)
                              }}
                            >
                              <div>
                                <div className="font-medium">{batch.batchNumber}</div>
                                <div className="text-sm text-muted-foreground">
                                  Received: {format(new Date(batch.receivedDate), 'MMM dd, yyyy')}
                                </div>
                                {batch.manufacturingDate && (
                                  <div className="text-xs text-muted-foreground">
                                    Mfg: {format(new Date(batch.manufacturingDate), 'MMM dd, yyyy')}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            {!materialId && (
                              <TableCell>
                                <div>
                                  <div className="font-medium">{batch.material.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {batch.material.category?.name}
                                  </div>
                                </div>
                              </TableCell>
                            )}
                            <TableCell>
                              <div className="space-y-1">
                                <Badge
                                  variant="outline"
                                  className={GRADE_COLORS[batch.grade as keyof typeof GRADE_COLORS]}
                                >
                                  {batch.grade}
                                </Badge>
                                {batch.origin && (
                                  <div className="text-xs text-muted-foreground flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {batch.origin}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm font-medium">
                                  {batchInfo.currentStock.toLocaleString()} / {batchInfo.quantity.toLocaleString()} {batch.unit}
                                </div>
                                <Progress value={stockPercentage} className="h-1" />
                                <div className="text-xs text-muted-foreground">
                                  {stockPercentage.toFixed(1)}% remaining
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div className="font-medium">
                                  ${(batchInfo.currentStock * batch.costPerUnit).toLocaleString()}
                                </div>
                                <div className="text-muted-foreground">
                                  @${batch.costPerUnit}/{batch.unit}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {batch.expiryDate ? (
                                <div className="space-y-1">
                                  <Badge
                                    variant={expiryStatus.color === 'destructive' ? 'destructive' : 'outline'}
                                    className={expiryStatus.color === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                                  >
                                    {expiryStatus.label}
                                  </Badge>
                                  <div className="text-xs text-muted-foreground">
                                    {format(new Date(batch.expiryDate), 'MMM dd, yyyy')}
                                  </div>
                                </div>
                              ) : (
                                <Badge variant="outline">No expiry</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {batch.location || 'Not set'}
                              </div>
                              {batch.storageConditions && (
                                <div className="text-xs text-muted-foreground">
                                  {batch.storageConditions}
                                </div>
                              )}
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
                                    <DropdownMenuItem onClick={() => onSelectBatch?.(batch)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onEditBatch?.(batch)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => onDeleteBatch?.(batch)}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring" className="space-y-4">
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Batches expiring within the next 30 days. Take action to use or dispose of these materials.
            </AlertDescription>
          </Alert>
          {/* Similar table structure but filtered for expiring batches */}
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Expired batches that should be reviewed for disposal or reprocessing.
            </AlertDescription>
          </Alert>
          {/* Similar table structure but filtered for expired batches */}
        </TabsContent>
      </Tabs>

      {/* Batch Details Dialog */}
      {selectedBatch && (
        <Dialog open={!!selectedBatch} onOpenChange={() => selectBatch(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package2 className="h-5 w-5" />
                Batch Details: {selectedBatch.batchNumber}
              </DialogTitle>
              <DialogDescription>
                Complete information about this material batch
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Material</h4>
                  <p className="text-lg font-medium">{selectedBatch.material.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedBatch.material.category?.name}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Quantity & Stock</h4>
                  <p className="text-lg font-medium">
                    {selectedBatch.currentStock.toLocaleString()} / {selectedBatch.quantity.toLocaleString()} {selectedBatch.unit}
                  </p>
                  <Progress
                    value={(selectedBatch.currentStock / selectedBatch.quantity) * 100}
                    className="h-2 mt-1"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Value</h4>
                  <p className="text-lg font-medium">
                    ${(selectedBatch.currentStock * selectedBatch.costPerUnit).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    @${selectedBatch.costPerUnit}/{selectedBatch.unit}
                  </p>
                </div>
              </div>

              {/* Quality & Dates */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Quality</h4>
                  <Badge
                    variant="outline"
                    className={GRADE_COLORS[selectedBatch.grade as keyof typeof GRADE_COLORS]}
                  >
                    {selectedBatch.grade}
                  </Badge>
                  {selectedBatch.origin && (
                    <p className="text-sm text-muted-foreground mt-1 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {selectedBatch.origin}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Important Dates</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2" />
                      Received: {format(new Date(selectedBatch.receivedDate), 'MMM dd, yyyy')}
                    </div>
                    {selectedBatch.manufacturingDate && (
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-2" />
                        Manufactured: {format(new Date(selectedBatch.manufacturingDate), 'MMM dd, yyyy')}
                      </div>
                    )}
                    {selectedBatch.expiryDate && (
                      <div className="flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-2" />
                        Expires: {format(new Date(selectedBatch.expiryDate), 'MMM dd, yyyy')}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Location & Storage</h4>
                  <p className="text-sm">{selectedBatch.location || 'Not specified'}</p>
                  {selectedBatch.storageConditions && (
                    <p className="text-xs text-muted-foreground">{selectedBatch.storageConditions}</p>
                  )}
                </div>
              </div>
            </div>

            {selectedBatch.qualityNotes && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Quality Notes</h4>
                <p className="text-sm bg-muted p-3 rounded">{selectedBatch.qualityNotes}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}