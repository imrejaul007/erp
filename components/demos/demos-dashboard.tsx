'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Plus,
  RefreshCw,
  Presentation,
  Calendar,
  MapPin,
  User,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Demo {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  scheduledDate: string
  scheduledTime: string
  location: string
  perfumes: string[]
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  notes?: string
  outcome?: string
  salesAmount?: number
  assignedTo: string
  createdAt: string
}

export default function DemosDashboard() {
  const [demos, setDemos] = useState<Demo[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    scheduledDate: '',
    scheduledTime: '',
    location: '',
    perfumes: '',
    assignedTo: '',
    notes: ''
  })

  useEffect(() => {
    fetchDemos()
  }, [])

  const fetchDemos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/demos')
      const data = await response.json()

      if (response.ok) {
        setDemos(data.demos || [])
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to fetch demos'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to load demos'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddDemo = async () => {
    try {
      const response = await fetch('/api/demos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          perfumes: formData.perfumes.split(',').map(p => p.trim())
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Demo scheduled successfully"
        })
        setIsAddDialogOpen(false)
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          scheduledDate: '',
          scheduledTime: '',
          location: '',
          perfumes: '',
          assignedTo: '',
          notes: ''
        })
        fetchDemos()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to schedule demo'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to schedule demo'
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "success" | "warning", icon: React.ReactNode }> = {
      scheduled: { variant: 'warning', icon: <Clock className="h-3 w-3" /> },
      completed: { variant: 'success', icon: <CheckCircle className="h-3 w-3" /> },
      cancelled: { variant: 'default', icon: <XCircle className="h-3 w-3" /> },
      'no-show': { variant: 'secondary', icon: <XCircle className="h-3 w-3" /> }
    }
    const config = variants[status] || variants.scheduled
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    )
  }

  const stats = {
    total: demos.length,
    scheduled: demos.filter(d => d.status === 'scheduled').length,
    completed: demos.filter(d => d.status === 'completed').length,
    cancelled: demos.filter(d => d.status === 'cancelled').length
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Presentation className="h-8 w-8 text-blue-600" />
            Demos Management
          </h1>
          <p className="text-muted-foreground">Schedule and track customer perfume demonstrations</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Demo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Schedule New Demo</DialogTitle>
                <DialogDescription>Book a perfume demonstration for a customer</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Customer Name</Label>
                    <Input
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      placeholder="customer@example.com"
                    />
                  </div>
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="+971 XX XXX XXXX"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Store/branch location"
                  />
                </div>
                <div>
                  <Label>Perfumes (comma-separated)</Label>
                  <Input
                    value={formData.perfumes}
                    onChange={(e) => setFormData({ ...formData, perfumes: e.target.value })}
                    placeholder="Perfume 1, Perfume 2, Perfume 3"
                  />
                </div>
                <div>
                  <Label>Assigned To</Label>
                  <Input
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    placeholder="Sales person name"
                  />
                </div>
                <div>
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes"
                  />
                </div>
                <Button onClick={handleAddDemo} className="w-full">
                  Schedule Demo
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="icon" onClick={fetchDemos}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Demos</CardTitle>
            <Presentation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.scheduled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Demos Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Demos</CardTitle>
          <CardDescription>Manage customer demonstrations</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-12 w-12 animate-spin text-muted-foreground" />
            </div>
          ) : demos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Presentation className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>No demos scheduled</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Perfumes</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demos.map((demo) => (
                  <TableRow key={demo.id}>
                    <TableCell className="font-medium">{demo.customerName}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{demo.customerEmail}</div>
                        <div className="text-muted-foreground">{demo.customerPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(demo.scheduledDate).toLocaleDateString()}
                        <Clock className="h-3 w-3 ml-2" />
                        {demo.scheduledTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {demo.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {demo.assignedTo}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {demo.perfumes.slice(0, 2).map((perfume, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {perfume}
                          </Badge>
                        ))}
                        {demo.perfumes.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{demo.perfumes.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(demo.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
