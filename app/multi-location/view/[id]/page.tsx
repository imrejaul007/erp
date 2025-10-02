'use client';

import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Edit,
  Calendar,
  User,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function ViewLocationPage() {
  const router = useRouter();
  const params = useParams();
  const locationId = params.id as string;

  // Mock data - in production this would be fetched based on locationId
  const location = {
    id: locationId,
    name: 'Dubai Mall Flagship',
    nameArabic: 'فرع دبي مول الرئيسي',
    type: 'flagship',
    status: 'active',
    manager: 'Ahmed Al-Rashid',
    managerPhone: '+971-50-123-4567',
    managerEmail: 'ahmed@oudpalace.ae',
    address: 'Dubai Mall, Ground Floor, Unit GF-123',
    emirate: 'Dubai',
    city: 'Dubai',
    phone: '+971-4-123-4567',
    email: 'dubaimall@oudpalace.ae',
    openingTime: '09:00',
    closingTime: '22:00',
    openedDate: '2023-01-15',
    targetRevenue: 800000,
    maxStaff: 12,
    notes: 'Flagship store with premium customer experience. High foot traffic area.',

    // Performance metrics
    currentRevenue: 850000,
    performance: 106.3,
    growth: 12.5,
    currentStaff: 12,
    inventoryCount: 2450,
    footfall: 15600,
    conversionRate: 8.2,
    avgTransaction: 3450,

    // Recent activity
    lastUpdate: '2024-10-01 14:30',
    alerts: 0,
  };

  const recentSales = [
    { id: 'INV-2024-156', date: '2024-10-01 14:25', customer: 'Walk-in Customer', amount: 4850, status: 'completed' },
    { id: 'INV-2024-155', date: '2024-10-01 13:45', customer: 'Fatima Al-Zahra', amount: 3200, status: 'completed' },
    { id: 'INV-2024-154', date: '2024-10-01 12:30', customer: 'Mohammed Hassan', amount: 2750, status: 'completed' },
    { id: 'INV-2024-153', date: '2024-10-01 11:15', customer: 'Walk-in Customer', amount: 5400, status: 'completed' },
  ];

  const staffMembers = [
    { id: 'EMP-001', name: 'Ahmed Al-Rashid', position: 'Store Manager', status: 'active', shift: 'Morning' },
    { id: 'EMP-003', name: 'Mohammed Hassan', position: 'Sales Associate', status: 'active', shift: 'Morning' },
    { id: 'EMP-007', name: 'Omar Abdullah', position: 'Inventory Manager', status: 'active', shift: 'Evening' },
    { id: 'EMP-010', name: 'Sara Ahmed', position: 'Sales Associate', status: 'active', shift: 'Evening' },
  ];

  const lowStockItems = [
    { id: 'PRD-001', name: 'Royal Oud 50ml', currentStock: 8, minStock: 15, status: 'low' },
    { id: 'PRD-004', name: 'Amber Noir 100ml', currentStock: 5, minStock: 10, status: 'critical' },
    { id: 'PRD-008', name: 'Musk Essence 30ml', currentStock: 12, minStock: 20, status: 'low' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'flagship': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'standard': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            {location.name}
          </h1>
          <p className="text-muted-foreground">{location.nameArabic}</p>
        </div>
        <Button onClick={() => router.push(`/multi-location/edit/${locationId}`)} className="bg-blue-600 hover:bg-blue-700">
          <Edit className="h-4 w-4 mr-2" />
          Edit Location
        </Button>
      </div>

      {/* Location Info Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Location Details</CardTitle>
              <CardDescription>Store information and contact details</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className={getTypeColor(location.type)}>{location.type}</Badge>
              <Badge className={getStatusColor(location.status)}>{location.status}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Address</div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <div>{location.address}</div>
                    <div className="text-sm text-gray-600">{location.city}, {location.emirate}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Contact</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{location.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{location.email}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Operating Hours</div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{location.openingTime} - {location.closingTime}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Store Manager</div>
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <div>{location.manager}</div>
                    <div className="text-sm text-gray-600">{location.managerPhone}</div>
                    <div className="text-sm text-gray-600">{location.managerEmail}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Opened Date</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{location.openedDate}</span>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Capacity</div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>{location.currentStaff} / {location.maxStaff} Staff</span>
                </div>
              </div>
            </div>
          </div>

          {location.notes && (
            <div className="mt-6 pt-6 border-t">
              <div className="text-sm font-medium text-gray-600 mb-1">Notes</div>
              <p className="text-gray-700">{location.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">AED {(location.currentRevenue / 1000).toFixed(0)}K</div>
            <Progress value={location.performance} className="h-2 mt-2" />
            <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3" />
              {location.performance}% of target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">+{location.growth}%</div>
            <p className="text-xs text-muted-foreground mt-2">vs last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Footfall</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{location.footfall?.toLocaleString() || "0"}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {location.conversionRate}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">AED {location.avgTransaction}</div>
            <p className="text-xs text-muted-foreground mt-2">per customer</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed information */}
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sales">Recent Sales</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>Latest transactions from this location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">{sale.id}</div>
                        <div className="text-sm text-gray-600">{sale.customer}</div>
                        <div className="text-xs text-gray-500">{sale.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">AED {sale.amount?.toLocaleString() || "0"}</div>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {sale.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Current Staff</CardTitle>
              <CardDescription>Staff members assigned to this location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {staffMembers.map((staff) => (
                  <div key={staff.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{staff.name}</div>
                        <div className="text-sm text-gray-600">{staff.position}</div>
                        <div className="text-xs text-gray-500">{staff.id}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800 mb-1">{staff.status}</Badge>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {staff.shift}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alerts</CardTitle>
              <CardDescription>Items that need restocking</CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockItems.length > 0 ? (
                <div className="space-y-3">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.id}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {item.currentStock} / {item.minStock}
                        </div>
                        <Badge className={getStockStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>All items are well stocked</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
