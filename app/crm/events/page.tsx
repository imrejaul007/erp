'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  DollarSign,
  UserPlus,
  CheckCircle,
  Clock,
  Plus,
  Download,
  BarChart3,
  Phone,
  Mail,
  Tag,
} from 'lucide-react';

interface EventLead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  interest: string;
  priority: 'hot' | 'warm' | 'cold';
  notes: string;
  followUpDate?: string;
  converted: boolean;
  estimatedValue?: number;
}

interface Event {
  id: string;
  name: string;
  type: 'exhibition' | 'popup' | 'mall_kiosk' | 'festival' | 'private_event';
  location: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  staff: string[];
  budget: number;
  revenue: number;
  leads: EventLead[];
  conversions: number;
  footfall: number;
  samples: number;
  notes: string;
}

export default function EventsCRMPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  // Mock data
  const events: Event[] = [
    {
      id: '1',
      name: 'Dubai Shopping Festival 2024',
      type: 'exhibition',
      location: 'Dubai World Trade Centre',
      startDate: '2024-01-05',
      endDate: '2024-01-31',
      status: 'ongoing',
      staff: ['Ahmed Hassan', 'Fatima Al Mansouri', 'Mohammed Ali'],
      budget: 50000.0,
      revenue: 125000.0,
      leads: [
        {
          id: 'L1',
          name: 'Khalid Al Rashid',
          phone: '+971501234567',
          email: 'khalid@example.com',
          interest: 'Royal Oud Collection',
          priority: 'hot',
          notes: 'Looking for bulk purchase for wedding favors. Budget: AED 50,000',
          followUpDate: '2024-01-10',
          converted: false,
          estimatedValue: 50000,
        },
        {
          id: 'L2',
          name: 'Sarah Johnson',
          phone: '+971509876543',
          email: 'sarah.j@example.com',
          interest: 'Custom Perfume Blending',
          priority: 'warm',
          notes: 'Tourist. Interested in personalized fragrance. Budget: AED 2,000',
          followUpDate: '2024-01-12',
          converted: false,
          estimatedValue: 2000,
        },
        {
          id: 'L3',
          name: 'Ali Mahmoud',
          phone: '+971507654321',
          interest: 'Oud Chips',
          priority: 'hot',
          notes: 'Corporate client. Looking for regular supply.',
          converted: true,
          estimatedValue: 30000,
        },
      ],
      conversions: 1,
      footfall: 2500,
      samples: 450,
      notes: 'Excellent location. High foot traffic. Consider booking same spot next year.',
    },
    {
      id: '2',
      name: 'Abu Dhabi Mall Pop-up',
      type: 'popup',
      location: 'Yas Mall, Abu Dhabi',
      startDate: '2024-02-01',
      endDate: '2024-02-14',
      status: 'upcoming',
      staff: ['Fatima Al Mansouri', 'Omar Ahmed'],
      budget: 15000.0,
      revenue: 0,
      leads: [],
      conversions: 0,
      footfall: 0,
      samples: 0,
      notes: 'Valentine\'s Day special. Focus on romantic fragrances and gift sets.',
    },
    {
      id: '3',
      name: 'Sharjah Heritage Festival',
      type: 'festival',
      location: 'Sharjah Heritage Area',
      startDate: '2023-12-15',
      endDate: '2024-01-02',
      status: 'completed',
      staff: ['Mohammed Ali', 'Ahmed Hassan'],
      budget: 25000.0,
      revenue: 68000.0,
      leads: [
        {
          id: 'L4',
          name: 'Hassan Al Zarooni',
          phone: '+971503344556',
          interest: 'Traditional Oud Oil',
          priority: 'warm',
          notes: 'Regular customer potential.',
          converted: true,
          estimatedValue: 5000,
        },
        {
          id: 'L5',
          name: 'Mariam Abdullah',
          phone: '+971506677889',
          email: 'mariam@example.com',
          interest: 'Gift Sets',
          priority: 'cold',
          notes: 'Took samples. May follow up later.',
          converted: false,
        },
      ],
      conversions: 1,
      footfall: 1800,
      samples: 320,
      notes: 'Good ROI. Heritage theme aligned well with our brand. Recommend repeating.',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'hot':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'warm':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cold':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredEvents = events.filter((event) => {
    if (activeTab === 'all') return true;
    return event.status === activeTab;
  });

  const totalEvents = events.length;
  const totalRevenue = events.reduce((sum, e) => sum + e.revenue, 0);
  const totalLeads = events.reduce((sum, e) => sum + e.leads.length, 0);
  const totalConversions = events.reduce((sum, e) => sum + e.conversions, 0);
  const conversionRate =
    totalLeads > 0 ? ((totalConversions / totalLeads) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Event & Exhibition CRM
          </h1>
          <p className="text-gray-600 mt-2">
            Track exhibitions, capture leads, and analyze event ROI
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-gray-600 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">From all events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Captured</CardTitle>
            <UserPlus className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-gray-600 mt-1">{totalConversions} converted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{conversionRate}%</div>
            <p className="text-xs text-gray-600 mt-1">Lead to customer</p>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>All exhibitions, pop-ups, and events</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {filteredEvents.map((event) => {
                const roi =
                  event.budget > 0
                    ? (((event.revenue - event.budget) / event.budget) * 100).toFixed(0)
                    : '0';
                const hotLeads = event.leads.filter((l) => l.priority === 'hot').length;
                const warmLeads = event.leads.filter((l) => l.priority === 'warm').length;

                return (
                  <Card key={event.id} className="border-l-4 border-l-indigo-500">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{event.name}</h3>
                            <Badge className={getStatusColor(event.status)}>
                              {event.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{event.type.replace('_', ' ')}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(event.startDate).toLocaleDateString()} -{' '}
                              {new Date(event.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">ROI</p>
                          <p
                            className={`text-2xl font-bold ${
                              parseInt(roi) > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {parseInt(roi) > 0 ? '+' : ''}
                            {roi}%
                          </p>
                        </div>
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Revenue</p>
                          <p className="text-lg font-bold">AED {event.revenue.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Budget</p>
                          <p className="text-lg font-bold">AED {event.budget.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Footfall</p>
                          <p className="text-lg font-bold">{event.footfall.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Samples</p>
                          <p className="text-lg font-bold">{event.samples}</p>
                        </div>
                      </div>

                      {/* Staff */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Staff ({event.staff.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {event.staff.map((staff, idx) => (
                            <Badge key={idx} variant="outline">
                              {staff}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Leads Summary */}
                      {event.leads.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <UserPlus className="h-4 w-4" />
                              Leads ({event.leads.length})
                            </p>
                            <div className="flex gap-2">
                              {hotLeads > 0 && (
                                <Badge className={getPriorityColor('hot')}>
                                  {hotLeads} Hot
                                </Badge>
                              )}
                              {warmLeads > 0 && (
                                <Badge className={getPriorityColor('warm')}>
                                  {warmLeads} Warm
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            {event.leads.slice(0, 3).map((lead) => (
                              <div
                                key={lead.id}
                                className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-medium">{lead.name}</p>
                                      <Badge className={getPriorityColor(lead.priority)}>
                                        {lead.priority}
                                      </Badge>
                                      {lead.converted && (
                                        <Badge className="bg-green-100 text-green-800">
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                          Converted
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-600">
                                      <span className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {lead.phone}
                                      </span>
                                      {lead.email && (
                                        <span className="flex items-center gap-1">
                                          <Mail className="h-3 w-3" />
                                          {lead.email}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {lead.estimatedValue && (
                                    <div className="text-right">
                                      <p className="text-sm font-bold text-indigo-600">
                                        AED {lead.estimatedValue.toLocaleString()}
                                      </p>
                                      <p className="text-xs text-gray-600">Est. value</p>
                                    </div>
                                  )}
                                </div>
                                <div className="bg-white rounded p-2 mb-2">
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">Interest:</span> {lead.interest}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">Notes:</span> {lead.notes}
                                  </p>
                                </div>
                                {lead.followUpDate && !lead.converted && (
                                  <div className="flex items-center gap-2 text-xs text-amber-600">
                                    <Clock className="h-3 w-3" />
                                    Follow up on{' '}
                                    {new Date(lead.followUpDate).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            ))}
                            {event.leads.length > 3 && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() =>
                                  setSelectedEvent(
                                    selectedEvent === event.id ? null : event.id
                                  )
                                }
                              >
                                {selectedEvent === event.id
                                  ? 'Show Less'
                                  : `View All ${event.leads.length} Leads`}
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                        <p className="text-sm font-medium text-blue-900 mb-1">Event Notes</p>
                        <p className="text-sm text-blue-700">{event.notes}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {event.status === 'ongoing' && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-indigo-500 to-purple-600"
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Lead
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Analytics
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit Event
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredEvents.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>No events found in this category</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
