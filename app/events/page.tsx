'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Plus,
  Calendar,
  MapPin,
  Users,
  Package,
  TrendingUp,
  DollarSign,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EventsPage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('upcoming');

  const upcomingEvents = [
    {
      id: 1,
      name: 'Dubai Shopping Festival 2025',
      location: 'Dubai Mall',
      startDate: '2025-12-01',
      endDate: '2025-12-31',
      type: 'Exhibition',
      status: 'planned',
      staff: 4,
      expectedRevenue: 150000,
      allocatedStock: 200,
      leads: 0,
    },
    {
      id: 2,
      name: 'Riyadh Season Pop-up',
      location: 'Boulevard Riyadh City',
      startDate: '2025-11-15',
      endDate: '2025-11-30',
      type: 'Pop-up Store',
      status: 'confirmed',
      staff: 3,
      expectedRevenue: 80000,
      allocatedStock: 150,
      leads: 0,
    },
    {
      id: 3,
      name: 'Abu Dhabi F1 Weekend',
      location: 'Yas Marina Circuit',
      startDate: '2025-11-20',
      endDate: '2025-11-22',
      type: 'Event Booth',
      status: 'ready',
      staff: 2,
      expectedRevenue: 45000,
      allocatedStock: 80,
      leads: 0,
    },
  ];

  const activeEvents = [
    {
      id: 4,
      name: 'Expo City Dubai 2025',
      location: 'Expo City',
      startDate: '2025-10-01',
      endDate: '2025-10-15',
      type: 'Exhibition',
      status: 'active',
      staff: 5,
      currentRevenue: 42000,
      expectedRevenue: 120000,
      allocatedStock: 180,
      soldStock: 67,
      leads: 156,
      progress: 35,
    },
  ];

  const pastEvents = [
    {
      id: 5,
      name: 'Sharjah Heritage Days',
      location: 'Al Majaz Waterfront',
      startDate: '2025-09-10',
      endDate: '2025-09-20',
      type: 'Cultural Event',
      status: 'completed',
      staff: 3,
      revenue: 68000,
      allocatedStock: 120,
      soldStock: 98,
      leads: 234,
      returnedStock: 22,
    },
    {
      id: 6,
      name: 'Dubai World Trade Centre Expo',
      location: 'DWTC',
      startDate: '2025-08-15',
      endDate: '2025-08-18',
      type: 'Trade Show',
      status: 'completed',
      staff: 4,
      revenue: 95000,
      allocatedStock: 150,
      soldStock: 142,
      leads: 189,
      returnedStock: 8,
    },
  ];

  const stats = [
    {
      label: 'Upcoming Events',
      value: upcomingEvents.length,
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Active Now',
      value: activeEvents.length,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total Leads',
      value: '579',
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Event Revenue (YTD)',
      value: 'AED 163K',
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      planned: 'bg-gray-100 text-gray-800',
      confirmed: 'bg-blue-100 text-blue-800',
      ready: 'bg-purple-100 text-purple-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-oud-100 text-oud-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.planned;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calendar className="h-8 w-8 text-purple-600" />
              Events & Exhibitions
            </h1>
            <p className="text-muted-foreground">Manage pop-ups, exhibitions, and event booths</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="luxury">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Setup a new exhibition, pop-up store, or event booth
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
                <TabsTrigger value="logistics">Logistics</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="space-y-2">
                  <Label>Event Name</Label>
                  <Input placeholder="e.g., Dubai Shopping Festival 2025" />
                </div>
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <select className="w-full border rounded-md px-3 py-2">
                    <option>Exhibition</option>
                    <option>Pop-up Store</option>
                    <option>Event Booth</option>
                    <option>Trade Show</option>
                    <option>Cultural Event</option>
                    <option>Corporate Event</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input placeholder="e.g., Dubai Mall" />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <textarea
                    className="w-full border rounded-md px-3 py-2"
                    rows={2}
                    placeholder="Full address..."
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <Label>Expected Revenue (AED)</Label>
                  <Input type="number" placeholder="e.g., 150000" />
                </div>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-4">
                <div className="space-y-2">
                  <Label>Stock Allocation Method</Label>
                  <select className="w-full border rounded-md px-3 py-2">
                    <option>Manual Selection</option>
                    <option>Top Sellers</option>
                    <option>Seasonal Products</option>
                    <option>New Arrivals</option>
                    <option>Custom Mix</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Total Units to Allocate</Label>
                  <Input type="number" placeholder="e.g., 200" />
                </div>
                <div className="space-y-2">
                  <Label>Source Warehouse</Label>
                  <select className="w-full border rounded-md px-3 py-2">
                    <option>Main Warehouse - Dubai</option>
                    <option>Warehouse 2 - Abu Dhabi</option>
                    <option>Warehouse 3 - Sharjah</option>
                  </select>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Stock Transfer</p>
                  <p className="text-xs text-blue-700 mt-1">
                    A stock transfer will be created automatically when the event is confirmed
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="staff" className="space-y-4">
                <div className="space-y-2">
                  <Label>Event Manager</Label>
                  <select className="w-full border rounded-md px-3 py-2">
                    <option>Ahmed Al Maktoum</option>
                    <option>Fatima Hassan</option>
                    <option>Mohammed Ali</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Sales Staff (Select multiple)</Label>
                  <select multiple className="w-full border rounded-md px-3 py-2" size={4}>
                    <option>Khalid Ibrahim</option>
                    <option>Sarah Johnson</option>
                    <option>Aisha Mohammed</option>
                    <option>Omar Khalifa</option>
                    <option>Lisa Chen</option>
                  </select>
                  <p className="text-xs text-muted-foreground">Hold Ctrl/Cmd to select multiple</p>
                </div>
                <div className="space-y-2">
                  <Label>Daily Working Hours</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="time" defaultValue="10:00" />
                    <Input type="time" defaultValue="22:00" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="logistics" className="space-y-4">
                <div className="space-y-2">
                  <Label>Setup Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Teardown Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Transport Provider</Label>
                  <Input placeholder="e.g., DHL, Aramex, Internal" />
                </div>
                <div className="space-y-2">
                  <Label>Equipment Needed</Label>
                  <textarea
                    className="w-full border rounded-md px-3 py-2"
                    rows={3}
                    placeholder="POS system, display stands, packaging materials..."
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <Label>Special Notes</Label>
                  <textarea
                    className="w-full border rounded-md px-3 py-2"
                    rows={3}
                    placeholder="Any special requirements or notes..."
                  ></textarea>
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="luxury" className="flex-1">
                Create Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Events Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeEvents.length})</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        {/* Upcoming Events */}
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{event.name}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.startDate).toLocaleDateString()} -{' '}
                            {new Date(event.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Staff</p>
                      <p className="font-semibold">{event.staff}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Stock</p>
                      <p className="font-semibold">{event.allocatedStock} units</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Expected</p>
                      <p className="font-semibold">AED {event.expectedRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Leads</p>
                      <p className="font-semibold">{event.leads}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{event.type}</Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">Allocate Stock</Button>
                  <Button variant="outline" size="sm">Assign Staff</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Active Events */}
        <TabsContent value="active" className="space-y-4">
          {activeEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow border-green-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{event.name}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Ends {new Date(event.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 animate-pulse">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active Now
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{event.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${event.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Staff</p>
                    <p className="font-semibold">{event.staff}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stock Sold</p>
                    <p className="font-semibold">{event.soldStock}/{event.allocatedStock}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="font-semibold text-green-600">
                      AED {event.currentRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Target</p>
                    <p className="font-semibold">AED {event.expectedRevenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Leads</p>
                    <p className="font-semibold text-purple-600">{event.leads}</p>
                  </div>
                  <Badge variant="outline">{event.type}</Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="luxury" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    Live Dashboard
                  </Button>
                  <Button variant="outline" size="sm">Add Stock</Button>
                  <Button variant="outline" size="sm">Capture Lead</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Past Events */}
        <TabsContent value="past" className="space-y-4">
          {pastEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{event.name}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.startDate).toLocaleDateString()} -{' '}
                            {new Date(event.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-oud-100 text-oud-800">Completed</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Staff</p>
                    <p className="font-semibold">{event.staff}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stock Sold</p>
                    <p className="font-semibold">{event.soldStock}/{event.allocatedStock}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Returned</p>
                    <p className="font-semibold">{event.returnedStock} units</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="font-semibold text-green-600">
                      AED {event.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Leads</p>
                    <p className="font-semibold text-purple-600">{event.leads}</p>
                  </div>
                  <Badge variant="outline">{event.type}</Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View Report
                  </Button>
                  <Button variant="outline" size="sm">Export Data</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
