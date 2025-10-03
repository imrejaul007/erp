'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Warehouse,
  MapPin,
  Package,
  Search,
  Plus,
  Barcode,
  Navigation,
  Grid3x3,
  QrCode,
  Download,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BinLocation {
  id: string;
  code: string;
  warehouse: string;
  aisle: string;
  rack: string;
  shelf: string;
  bin: string;
  capacity: number;
  occupied: number;
  products: {
    sku: string;
    name: string;
    quantity: number;
  }[];
  status: 'available' | 'full' | 'reserved';
}

export default function WarehouseBinsPage() {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedWarehouse, setSelectedWarehouse] = useState('warehouse-1');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const binLocations: BinLocation[] = [
    {
      id: '1',
      code: 'WH1-A1-R2-S3-B1',
      warehouse: 'Main Warehouse',
      aisle: 'A1',
      rack: 'R2',
      shelf: 'S3',
      bin: 'B1',
      capacity: 100,
      occupied: 75,
      products: [
        { sku: 'PERF-ROYAL-50ML', name: 'Royal Oud Perfume 50ml', quantity: 45 },
        { sku: 'PERF-ROSE-30ML', name: 'Rose Attar 30ml', quantity: 30 },
      ],
      status: 'available',
    },
    {
      id: '2',
      code: 'WH1-A1-R2-S3-B2',
      warehouse: 'Main Warehouse',
      aisle: 'A1',
      rack: 'R2',
      shelf: 'S3',
      bin: 'B2',
      capacity: 100,
      occupied: 100,
      products: [
        { sku: 'OUD-CHIPS-PREM-100G', name: 'Premium Oud Chips 100g', quantity: 100 },
      ],
      status: 'full',
    },
    {
      id: '3',
      code: 'WH1-A2-R1-S2-B4',
      warehouse: 'Main Warehouse',
      aisle: 'A2',
      rack: 'R1',
      shelf: 'S2',
      bin: 'B4',
      capacity: 150,
      occupied: 60,
      products: [
        { sku: 'BOTTLE-GLASS-50ML', name: 'Glass Bottle 50ml', quantity: 60 },
      ],
      status: 'available',
    },
    {
      id: '4',
      code: 'WH1-A2-R3-S1-B3',
      warehouse: 'Main Warehouse',
      aisle: 'A2',
      rack: 'R3',
      shelf: 'S1',
      bin: 'B3',
      capacity: 80,
      occupied: 0,
      products: [],
      status: 'available',
    },
    {
      id: '5',
      code: 'WH1-B1-R1-S4-B2',
      warehouse: 'Main Warehouse',
      aisle: 'B1',
      rack: 'R1',
      shelf: 'S4',
      bin: 'B2',
      capacity: 120,
      occupied: 120,
      products: [
        { sku: 'MUSK-OIL-PURE', name: 'Pure Musk Oil 500ml', quantity: 120 },
      ],
      status: 'reserved',
    },
  ];

  const warehouses = [
    { id: 'warehouse-1', name: 'Main Warehouse', location: 'Dubai' },
    { id: 'warehouse-2', name: 'Store 1', location: 'Abu Dhabi' },
    { id: 'warehouse-3', name: 'Store 2', location: 'Sharjah' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'full':
        return 'bg-red-100 text-red-800';
      case 'reserved':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-amber-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const filteredBins = binLocations.filter((bin) =>
    searchQuery
      ? bin.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bin.products.some((p) =>
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true
  );

  const totalBins = binLocations.length;
  const availableBins = binLocations.filter((b) => b.status === 'available').length;
  const fullBins = binLocations.filter((b) => b.status === 'full').length;
  const totalCapacity = binLocations.reduce((sum, b) => sum + b.capacity, 0);
  const totalOccupied = binLocations.reduce((sum, b) => sum + b.occupied, 0);
  const utilizationRate = ((totalOccupied / totalCapacity) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Warehouse Bin Locations
          </h1>
          <p className="text-gray-600 mt-2">
            3D warehouse mapping and bin-level inventory tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Map
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Bin Location
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bins</CardTitle>
            <Grid3x3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBins}</div>
            <p className="text-xs text-gray-600 mt-1">{availableBins} available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
            <Warehouse className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{utilizationRate}%</div>
            <p className="text-xs text-gray-600 mt-1">
              {totalOccupied} / {totalCapacity} capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Full Bins</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{fullBins}</div>
            <p className="text-xs text-gray-600 mt-1">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warehouses</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouses.length}</div>
            <p className="text-xs text-gray-600 mt-1">Active locations</p>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse Selector and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label>Select Warehouse</Label>
              <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select warehouse..." />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((wh) => (
                    <SelectItem key={wh.id} value={wh.id}>
                      {wh.name} - {wh.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Search Bin or Product</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by bin code, SKU, or product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Bin Locations</CardTitle>
          <CardDescription>Detailed bin-level inventory tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="picker">Pick List</TabsTrigger>
            </TabsList>

            {/* Map View */}
            <TabsContent value="map" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredBins.map((bin) => {
                  const occupancyPercentage = (bin.occupied / bin.capacity) * 100;
                  return (
                    <Card
                      key={bin.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer border-2"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            <span className="font-mono text-sm font-bold">{bin.code}</span>
                          </div>
                          <Badge className={getStatusColor(bin.status)}>
                            {bin.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-3">
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Aisle:</span> {bin.aisle} |{' '}
                            <span className="font-medium">Rack:</span> {bin.rack}
                          </div>
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Shelf:</span> {bin.shelf} |{' '}
                            <span className="font-medium">Bin:</span> {bin.bin}
                          </div>
                        </div>

                        {/* Occupancy Bar */}
                        <div className="space-y-1 mb-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Occupancy</span>
                            <span className="font-medium">{occupancyPercentage.toFixed(0)}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getOccupancyColor(occupancyPercentage)}`}
                              style={{ width: `${occupancyPercentage}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-600">
                            {bin.occupied} / {bin.capacity} units
                          </div>
                        </div>

                        {/* Products */}
                        {bin.products.length > 0 ? (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-700 mb-1">
                              Products ({bin.products.length})
                            </p>
                            {bin.products.slice(0, 2).map((product, idx) => (
                              <div
                                key={idx}
                                className="text-xs bg-gray-50 p-2 rounded border border-gray-200"
                              >
                                <p className="font-medium truncate">{product.name}</p>
                                <p className="text-gray-600">
                                  {product.sku} - {product.quantity} units
                                </p>
                              </div>
                            ))}
                            {bin.products.length > 2 && (
                              <p className="text-xs text-blue-600 font-medium">
                                +{bin.products.length - 2} more
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-2">
                            <Package className="h-6 w-6 text-gray-300 mx-auto mb-1" />
                            <p className="text-xs text-gray-500">Empty bin</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredBins.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>No bin locations found</p>
                </div>
              )}
            </TabsContent>

            {/* List View */}
            <TabsContent value="list" className="space-y-4 mt-4">
              {filteredBins.map((bin) => (
                <Card key={bin.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-mono font-bold">{bin.code}</h3>
                          <Badge className={getStatusColor(bin.status)}>
                            {bin.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{bin.warehouse}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Occupancy</p>
                        <p className="text-2xl font-bold">
                          {((bin.occupied / bin.capacity) * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Aisle</p>
                        <p className="font-semibold">{bin.aisle}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rack</p>
                        <p className="font-semibold">{bin.rack}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Shelf</p>
                        <p className="font-semibold">{bin.shelf}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Bin</p>
                        <p className="font-semibold">{bin.bin}</p>
                      </div>
                    </div>

                    {bin.products.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Stored Products</p>
                        <div className="grid gap-2">
                          {bin.products.map((product, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-600">{product.sku}</p>
                              </div>
                              <Badge variant="outline">{product.quantity} units</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600">
                        <Navigation className="mr-2 h-4 w-4" />
                        Navigate
                      </Button>
                      <Button size="sm" variant="outline">
                        <QrCode className="mr-2 h-4 w-4" />
                        Print Label
                      </Button>
                      <Button size="sm" variant="outline">
                        <Package className="mr-2 h-4 w-4" />
                        Adjust Stock
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Pick List */}
            <TabsContent value="picker" className="space-y-4 mt-4">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Barcode className="h-5 w-5" />
                    Pick List Optimizer
                  </CardTitle>
                  <CardDescription>
                    Optimized route for picking multiple products
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {filteredBins
                    .filter((b) => b.products.length > 0)
                    .map((bin, idx) => (
                      <div
                        key={bin.id}
                        className="flex items-center gap-4 p-4 bg-white rounded-lg border border-blue-200"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-mono font-bold">{bin.code}</p>
                          <p className="text-sm text-gray-600">
                            {bin.products.length} product{bin.products.length > 1 ? 's' : ''}
                          </p>
                        </div>
                        <Navigation className="h-5 w-5 text-blue-600" />
                      </div>
                    ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
