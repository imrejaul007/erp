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
  Calendar,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  TrendingUp,
  Users,
  Package
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface PopupEvent {
  id: string
  eventName: string
  eventType: string
  location: string
  startDate: Date
  endDate: Date
  setupCost: number
  rentCost: number
  staffCost: number
  marketingCost: number
  totalCost: number
  revenue: number
  roi: number
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

interface Stats {
  totalEvents: number
  activeEvents: number
  completedEvents: number
  avgRoi: number
  totalRevenue: number
  totalCosts: number
}

export default function EventsDashboard() {
  const [events, setEvents] = useState<PopupEvent[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<PopupEvent | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'Pop-up Store',
    location: '',
    startDate: '',
    endDate: '',
    setupCost: 0,
    rentCost: 0,
    staffCost: 0,
    marketingCost: 0,
    revenue: 0,
    status: 'PLANNED' as const,
    notes: ''
  })

  useEffect(() => {
    fetchEvents()
    fetchStats()
  }, [statusFilter])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/events?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setEvents(data.events || [])
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to fetch events'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to load events'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/events/stats')
      const data = await response.json()

      if (response.ok) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: `Event ${data.event.eventName} created successfully`
        })
        setIsCreateDialogOpen(false)
        resetForm()
        fetchEvents()
        fetchStats()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to create event'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to create event'
      })
    }
  }

  const handleUpdate = async () => {
    if (!selectedEvent) return

    try {
      const response = await fetch(`/api/events/${selectedEvent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event updated successfully"
        })
        setIsEditDialogOpen(false)
        setSelectedEvent(null)
        resetForm()
        fetchEvents()
        fetchStats()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to update event'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to update event'
      })
    }
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event deleted successfully"
        })
        fetchEvents()
        fetchStats()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to delete event'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to delete event'
      })
    }
  }

  const openEditDialog = (event: PopupEvent) => {
    setSelectedEvent(event)
    setFormData({
      eventName: event.eventName,
      eventType: event.eventType,
      location: event.location,
      startDate: new Date(event.startDate).toISOString().split('T')[0],
      endDate: new Date(event.endDate).toISOString().split('T')[0],
      setupCost: event.setupCost,
      rentCost: event.rentCost,
      staffCost: event.staffCost,
      marketingCost: event.marketingCost,
      revenue: event.revenue,
      status: event.status,
      notes: event.notes || ''
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      eventName: '',
      eventType: 'Pop-up Store',
      location: '',
      startDate: '',
      endDate: '',
      setupCost: 0,
      rentCost: 0,
      staffCost: 0,
      marketingCost: 0,
      revenue: 0,
      status: 'PLANNED',
      notes: ''
    })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      PLANNED: "secondary",
      ACTIVE: "default",
      COMPLETED: "default",
      CANCELLED: "destructive"
    }

    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
  }

  const getRoiBadge = (roi: number) => {
    if (roi >= 50) return <Badge variant="default" className="bg-green-600">{roi.toFixed(1)}%</Badge>
    if (roi >= 20) return <Badge variant="default">{roi.toFixed(1)}%</Badge>
    if (roi >= 0) return <Badge variant="secondary">{roi.toFixed(1)}%</Badge>
    return <Badge variant="destructive">{roi.toFixed(1)}%</Badge>
  }

  const filteredEvents = events.filter(event =>
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.eventType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Pop-up Events
          </h1>
          <p className="text-muted-foreground">Manage exhibitions, pop-ups, and event booths</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Pop-up Event</DialogTitle>
              <DialogDescription>Plan a new exhibition or event booth</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventName">Event Name *</Label>
                  <Input
                    id="eventName"
                    value={formData.eventName}
                    onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                    placeholder="e.g., Dubai Shopping Festival"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type</Label>
                  <Select value={formData.eventType} onValueChange={(value) => setFormData({...formData, eventType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pop-up Store">Pop-up Store</SelectItem>
                      <SelectItem value="Exhibition">Exhibition</SelectItem>
                      <SelectItem value="Trade Show">Trade Show</SelectItem>
                      <SelectItem value="Festival">Festival</SelectItem>
                      <SelectItem value="Mall Kiosk">Mall Kiosk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g., Dubai Mall"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="setupCost">Setup Cost</Label>
                  <Input
                    id="setupCost"
                    type="number"
                    value={formData.setupCost}
                    onChange={(e) => setFormData({...formData, setupCost: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rentCost">Rent Cost</Label>
                  <Input
                    id="rentCost"
                    type="number"
                    value={formData.rentCost}
                    onChange={(e) => setFormData({...formData, rentCost: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="staffCost">Staff Cost</Label>
                  <Input
                    id="staffCost"
                    type="number"
                    value={formData.staffCost}
                    onChange={(e) => setFormData({...formData, staffCost: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketingCost">Marketing Cost</Label>
                  <Input
                    id="marketingCost"
                    type="number"
                    value={formData.marketingCost}
                    onChange={(e) => setFormData({...formData, marketingCost: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="revenue">Revenue</Label>
                  <Input
                    id="revenue"
                    type="number"
                    value={formData.revenue}
                    onChange={(e) => setFormData({...formData, revenue: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PLANNED">Planned</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Event notes and details"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Create Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">{stats.activeEvents} active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All events</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg ROI</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgRoi.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Return on investment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Package className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedEvents}</div>
              <p className="text-xs text-muted-foreground">Finished events</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by event name, location, or type..."
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
            <SelectItem value="PLANNED">Planned</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={fetchEvents}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pop-up Events</CardTitle>
          <CardDescription>Track all exhibitions and event booths</CardDescription>
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
                  <TableHead>Event Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>ROI</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No events found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.eventName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{event.eventType}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>${event.totalCost.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold text-green-600">${event.revenue.toLocaleString()}</TableCell>
                      <TableCell>{getRoiBadge(event.roi)}</TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(event)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Pop-up Event</DialogTitle>
            <DialogDescription>Update event details and costs</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-eventName">Event Name</Label>
                <Input
                  id="edit-eventName"
                  value={formData.eventName}
                  onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-eventType">Event Type</Label>
                <Select value={formData.eventType} onValueChange={(value) => setFormData({...formData, eventType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pop-up Store">Pop-up Store</SelectItem>
                    <SelectItem value="Exhibition">Exhibition</SelectItem>
                    <SelectItem value="Trade Show">Trade Show</SelectItem>
                    <SelectItem value="Festival">Festival</SelectItem>
                    <SelectItem value="Mall Kiosk">Mall Kiosk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-setupCost">Setup Cost</Label>
                <Input
                  id="edit-setupCost"
                  type="number"
                  value={formData.setupCost}
                  onChange={(e) => setFormData({...formData, setupCost: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-rentCost">Rent Cost</Label>
                <Input
                  id="edit-rentCost"
                  type="number"
                  value={formData.rentCost}
                  onChange={(e) => setFormData({...formData, rentCost: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-staffCost">Staff Cost</Label>
                <Input
                  id="edit-staffCost"
                  type="number"
                  value={formData.staffCost}
                  onChange={(e) => setFormData({...formData, staffCost: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-marketingCost">Marketing Cost</Label>
                <Input
                  id="edit-marketingCost"
                  type="number"
                  value={formData.marketingCost}
                  onChange={(e) => setFormData({...formData, marketingCost: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-revenue">Revenue</Label>
                <Input
                  id="edit-revenue"
                  type="number"
                  value={formData.revenue}
                  onChange={(e) => setFormData({...formData, revenue: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLANNED">Planned</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Event notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Update Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
