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
  Flame,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  Zap,
  Activity,
  TrendingUp,
  Droplets
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface DistillationProcess {
  id: string
  processNumber: string
  rawMaterialId: string
  rawMaterial?: {
    id: string
    name: string
    sku: string
  }
  startDate: Date
  endDate: Date | null
  temperature: number
  pressure: number
  expectedYield: number
  actualYield: number | null
  yieldPercentage: number | null
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

interface Stats {
  totalProcesses: number
  activeProcesses: number
  completedProcesses: number
  avgYieldPercentage: number
  totalOutput: number
}

export default function DistillationDashboard() {
  const [processes, setProcesses] = useState<DistillationProcess[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedProcess, setSelectedProcess] = useState<DistillationProcess | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    rawMaterialId: '',
    temperature: 0,
    pressure: 0,
    expectedYield: 0,
    actualYield: 0,
    status: 'PENDING' as const,
    notes: ''
  })

  useEffect(() => {
    fetchProcesses()
  }, [statusFilter])

  const fetchProcesses = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/distillation?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setProcesses(data.processes || [])
        if (data.stats) {
          setStats(data.stats)
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to fetch processes'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to load distillation processes'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/distillation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: `Process ${data.process.processNumber} created successfully`
        })
        setIsCreateDialogOpen(false)
        resetForm()
        fetchProcesses()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to create process'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to create process'
      })
    }
  }

  const handleUpdate = async () => {
    if (!selectedProcess) return

    try {
      const response = await fetch(`/api/distillation?processId=${selectedProcess.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Process updated successfully"
        })
        setIsEditDialogOpen(false)
        setSelectedProcess(null)
        resetForm()
        fetchProcesses()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to update process'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to update process'
      })
    }
  }

  const handleDelete = async (processId: string) => {
    if (!confirm('Are you sure you want to delete this process?')) return

    try {
      const response = await fetch(`/api/distillation?processId=${processId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Process deleted successfully"
        })
        fetchProcesses()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to delete process'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to delete process'
      })
    }
  }

  const openEditDialog = (process: DistillationProcess) => {
    setSelectedProcess(process)
    setFormData({
      rawMaterialId: process.rawMaterialId,
      temperature: process.temperature,
      pressure: process.pressure,
      expectedYield: process.expectedYield,
      actualYield: process.actualYield || 0,
      status: process.status,
      notes: process.notes || ''
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      rawMaterialId: '',
      temperature: 0,
      pressure: 0,
      expectedYield: 0,
      actualYield: 0,
      status: 'PENDING',
      notes: ''
    })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any, icon: any }> = {
      PENDING: { variant: "secondary", icon: Clock },
      IN_PROGRESS: { variant: "default", icon: Zap },
      COMPLETED: { variant: "default", icon: CheckCircle },
      FAILED: { variant: "destructive", icon: Activity }
    }

    const config = variants[status] || variants.PENDING
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const filteredProcesses = processes.filter(process =>
    process.processNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (process.rawMaterial?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Flame className="h-8 w-8" />
            Distillation Processes
          </h1>
          <p className="text-muted-foreground">Track and monitor distillation operations</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              New Process
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Distillation Process</DialogTitle>
              <DialogDescription>Start a new distillation batch</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rawMaterialId">Raw Material ID *</Label>
                  <Input
                    id="rawMaterialId"
                    value={formData.rawMaterialId}
                    onChange={(e) => setFormData({...formData, rawMaterialId: e.target.value})}
                    placeholder="Enter raw material ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    value={formData.temperature}
                    onChange={(e) => setFormData({...formData, temperature: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pressure">Pressure (bar)</Label>
                  <Input
                    id="pressure"
                    type="number"
                    value={formData.pressure}
                    onChange={(e) => setFormData({...formData, pressure: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expectedYield">Expected Yield (L)</Label>
                  <Input
                    id="expectedYield"
                    type="number"
                    value={formData.expectedYield}
                    onChange={(e) => setFormData({...formData, expectedYield: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actualYield">Actual Yield (L)</Label>
                  <Input
                    id="actualYield"
                    type="number"
                    value={formData.actualYield}
                    onChange={(e) => setFormData({...formData, actualYield: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Process notes and observations"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Create Process</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Processes</CardTitle>
              <Flame className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProcesses}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedProcesses}</div>
              <p className="text-xs text-muted-foreground">Total: {stats.totalProcesses}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Yield %</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgYieldPercentage.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Efficiency metric</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Output</CardTitle>
              <Droplets className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOutput.toFixed(1)}L</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by process number or material..."
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
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={fetchProcesses}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Processes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Distillation Processes</CardTitle>
          <CardDescription>Monitor all distillation operations</CardDescription>
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
                  <TableHead>Process #</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Temp/Pressure</TableHead>
                  <TableHead>Expected</TableHead>
                  <TableHead>Actual</TableHead>
                  <TableHead>Yield %</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcesses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No processes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProcesses.map((process) => (
                    <TableRow key={process.id}>
                      <TableCell className="font-medium">{process.processNumber}</TableCell>
                      <TableCell>{process.rawMaterial?.name || process.rawMaterialId}</TableCell>
                      <TableCell className="text-sm">
                        {process.temperature}°C / {process.pressure} bar
                      </TableCell>
                      <TableCell>{process.expectedYield}L</TableCell>
                      <TableCell className="font-semibold">
                        {process.actualYield ? `${process.actualYield}L` : '-'}
                      </TableCell>
                      <TableCell>
                        {process.yieldPercentage ? (
                          <Badge variant={process.yieldPercentage >= 80 ? "default" : "secondary"}>
                            {process.yieldPercentage.toFixed(1)}%
                          </Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(process.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(process)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(process.id)}>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Distillation Process</DialogTitle>
            <DialogDescription>Update process parameters and yield data</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-temperature">Temperature (°C)</Label>
                <Input
                  id="edit-temperature"
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => setFormData({...formData, temperature: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-pressure">Pressure (bar)</Label>
                <Input
                  id="edit-pressure"
                  type="number"
                  value={formData.pressure}
                  onChange={(e) => setFormData({...formData, pressure: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-expectedYield">Expected Yield (L)</Label>
                <Input
                  id="edit-expectedYield"
                  type="number"
                  value={formData.expectedYield}
                  onChange={(e) => setFormData({...formData, expectedYield: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-actualYield">Actual Yield (L)</Label>
                <Input
                  id="edit-actualYield"
                  type="number"
                  value={formData.actualYield}
                  onChange={(e) => setFormData({...formData, actualYield: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Process notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Update Process</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
