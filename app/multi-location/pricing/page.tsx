'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Percent,
  Eye,
  Edit,
  Save,
  X,
  Check,
  AlertCircle,
  Search,
  Filter,
  Download,
  Upload,
  Copy,
  BarChart3,
  Calendar,
  Clock,
  Globe,
  MapPin,
  Package,
  Tags,
  Users,
  Activity
} from 'lucide-react';

const PricingManagementPage = () => {
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPrice, setEditingPrice] = useState(null);
  const [priceUpdates, setPriceUpdates] = useState({});

  // UAE Store Locations
  const locations = [
    { id: 'all', name: 'All Locations', code: 'ALL' },
    { id: 'LOC-001', name: 'Dubai Mall Flagship', code: 'DXB-DM', type: 'flagship' },
    { id: 'LOC-002', name: 'Mall of Emirates', code: 'DXB-MOE', type: 'premium' },
    { id: 'LOC-003', name: 'Ibn Battuta Mall', code: 'DXB-IBN', type: 'standard' },
    { id: 'LOC-004', name: 'City Centre Mirdif', code: 'DXB-CCM', type: 'standard' },
    { id: 'LOC-005', name: 'Abu Dhabi Mall', code: 'AUH-ADM', type: 'premium' },
    { id: 'LOC-006', name: 'Sharjah City Centre', code: 'SHJ-SCC', type: 'standard' },
    { id: 'LOC-007', name: 'Al Ghurair Centre', code: 'DXB-AGC', type: 'standard' },
    { id: 'LOC-008', name: 'Yas Mall', code: 'AUH-YAS', type: 'premium' }
  ];

  // Sample pricing data
  const pricingData = [
    {
      id: 'PRD-001',
      name: 'Royal Oud Premium',
      sku: 'ROP-100ML',
      category: 'Premium Fragrances',
      baseCost: 150,
      prices: {
        'LOC-001': { retail: 550, wholesale: 450, margin: 72.7, lastUpdated: '2024-09-28' },
        'LOC-002': { retail: 520, wholesale: 430, margin: 71.2, lastUpdated: '2024-09-28' },
        'LOC-003': { retail: 480, wholesale: 400, margin: 68.8, lastUpdated: '2024-09-25' },
        'LOC-004': { retail: 460, wholesale: 380, margin: 67.4, lastUpdated: '2024-09-25' },
        'LOC-005': { retail: 530, wholesale: 440, margin: 71.7, lastUpdated: '2024-09-27' },
        'LOC-006': { retail: 450, wholesale: 370, margin: 66.7, lastUpdated: '2024-09-20' },
        'LOC-007': { retail: 470, wholesale: 390, margin: 68.1, lastUpdated: '2024-09-24' },
        'LOC-008': { retail: 510, wholesale: 420, margin: 70.6, lastUpdated: '2024-09-26' }
      },
      avgPrice: 496.25,
      priceVariance: 13.2,
      status: 'active'
    },
    {
      id: 'PRD-002',
      name: 'Jasmine Essence',
      sku: 'JE-50ML',
      category: 'Floral Collection',
      baseCost: 80,
      prices: {
        'LOC-001': { retail: 280, wholesale: 230, margin: 71.4, lastUpdated: '2024-09-29' },
        'LOC-002': { retail: 270, wholesale: 220, margin: 70.4, lastUpdated: '2024-09-29' },
        'LOC-003': { retail: 250, wholesale: 200, margin: 68.0, lastUpdated: '2024-09-26' },
        'LOC-004': { retail: 240, wholesale: 190, margin: 66.7, lastUpdated: '2024-09-26' },
        'LOC-005': { retail: 275, wholesale: 225, margin: 70.9, lastUpdated: '2024-09-28' },
        'LOC-006': { retail: 230, wholesale: 180, margin: 65.2, lastUpdated: '2024-09-22' },
        'LOC-007': { retail: 245, wholesale: 195, margin: 67.3, lastUpdated: '2024-09-25' },
        'LOC-008': { retail: 265, wholesale: 215, margin: 69.8, lastUpdated: '2024-09-27' }
      },
      avgPrice: 256.25,
      priceVariance: 8.7,
      status: 'active'
    },
    {
      id: 'PRD-003',
      name: 'Saffron Gold',
      sku: 'SG-75ML',
      category: 'Luxury Line',
      baseCost: 200,
      prices: {
        'LOC-001': { retail: 750, wholesale: 600, margin: 73.3, lastUpdated: '2024-09-30' },
        'LOC-002': { retail: 720, wholesale: 580, margin: 72.2, lastUpdated: '2024-09-30' },
        'LOC-003': { retail: 680, wholesale: 550, margin: 70.6, lastUpdated: '2024-09-28' },
        'LOC-004': { retail: 650, wholesale: 520, margin: 69.2, lastUpdated: '2024-09-28' },
        'LOC-005': { retail: 730, wholesale: 590, margin: 72.6, lastUpdated: '2024-09-29' },
        'LOC-006': { retail: 620, wholesale: 500, margin: 67.7, lastUpdated: '2024-09-24' },
        'LOC-007': { retail: 660, wholesale: 530, margin: 69.7, lastUpdated: '2024-09-27' },
        'LOC-008': { retail: 700, wholesale: 570, margin: 71.4, lastUpdated: '2024-09-28' }
      },
      avgPrice: 688.75,
      priceVariance: 7.9,
      status: 'active'
    },
    {
      id: 'PRD-004',
      name: 'Rose Attar',
      sku: 'RA-30ML',
      category: 'Traditional Attars',
      baseCost: 120,
      prices: {
        'LOC-001': { retail: 420, wholesale: 350, margin: 71.4, lastUpdated: '2024-09-29' },
        'LOC-002': { retail: 400, wholesale: 330, margin: 70.0, lastUpdated: '2024-09-29' },
        'LOC-003': { retail: 380, wholesale: 310, margin: 68.4, lastUpdated: '2024-09-27' },
        'LOC-004': { retail: 360, wholesale: 290, margin: 66.7, lastUpdated: '2024-09-27' },
        'LOC-005': { retail: 410, wholesale: 340, margin: 70.7, lastUpdated: '2024-09-28' },
        'LOC-006': { retail: 340, wholesale: 270, margin: 64.7, lastUpdated: '2024-09-23' },
        'LOC-007': { retail: 370, wholesale: 300, margin: 67.6, lastUpdated: '2024-09-26' },
        'LOC-008': { retail: 390, wholesale: 320, margin: 69.2, lastUpdated: '2024-09-27' }
      },
      avgPrice: 383.75,
      priceVariance: 9.4,
      status: 'active'
    }
  ];

  // Pricing analytics
  const pricingAnalytics = {
    totalProducts: pricingData.length,
    avgMargin: 69.8,
    priceConsistency: 91.3,
    revenueImpact: 15.2,
    pendingUpdates: 3,
    lastSyncDate: '2024-09-30T10:30:00'
  };

  const getLocationTypeColor = (type) => {
    switch (type) {
      case 'flagship': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'standard': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMarginColor = (margin) => {
    if (margin >= 70) return 'text-green-600';
    if (margin >= 65) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getVarianceColor = (variance) => {
    if (variance <= 5) return 'text-green-600';
    if (variance <= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredProducts = pricingData.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePriceEdit = (productId, locationId, priceType) => {
    setEditingPrice({ productId, locationId, priceType });
  };

  const handlePriceSave = (productId, locationId, priceType, newValue) => {
    setPriceUpdates(prev => ({
      ...prev,
      [`${productId}-${locationId}-${priceType}`]: newValue
    }));
    setEditingPrice(null);
  };

  const handleBulkPriceUpdate = () => {
    // Handle bulk price update logic
    console.log('Bulk update:', priceUpdates);
  };

  const renderPriceCell = (product, location, priceType) => {
    const currentPrice = product.prices[location.id]?.[priceType] || 0;
    const isEditing = editingPrice?.productId === product.id &&
                     editingPrice?.locationId === location.id &&
                     editingPrice?.priceType === priceType;

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            defaultValue={currentPrice}
            className="w-20 h-8"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handlePriceSave(product.id, location.id, priceType, e.target.value);
              }
              if (e.key === 'Escape') {
                setEditingPrice(null);
              }
            }}
            autoFocus
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditingPrice(null)}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    return (
      <div
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
        onClick={() => handlePriceEdit(product.id, location.id, priceType)}
      >
        <span>AED {currentPrice}</span>
        <Edit className="h-3 w-3 opacity-0 group-hover:opacity-100" />
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store-wise Pricing Management</h1>
          <p className="text-gray-600">Centralized pricing control across all UAE locations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-xl sm:text-2xl font-bold">{pricingAnalytics.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Margin</p>
                <p className="text-xl sm:text-2xl font-bold">{pricingAnalytics.avgMargin}%</p>
              </div>
              <Percent className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Price Consistency</p>
                <p className="text-xl sm:text-2xl font-bold">{pricingAnalytics.priceConsistency}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue Impact</p>
                <p className="text-xl sm:text-2xl font-bold">+{pricingAnalytics.revenueImpact}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Updates</p>
                <p className="text-xl sm:text-2xl font-bold">{pricingAnalytics.pendingUpdates}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products, SKU, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      <div className="flex items-center gap-2">
                        {location.id !== 'all' && (
                          <Badge className={getLocationTypeColor(location.type)}>
                            {location.type}
                          </Badge>
                        )}
                        {location.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Management Tabs */}
      <Tabs defaultValue="matrix" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="matrix">Pricing Matrix</TabsTrigger>
          <TabsTrigger value="comparison">Price Comparison</TabsTrigger>
          <TabsTrigger value="rules">Pricing Rules</TabsTrigger>
          <TabsTrigger value="history">Price History</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Pricing Matrix</CardTitle>
              <CardDescription>
                Manage retail and wholesale prices across all store locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Product</th>
                      <th className="text-left p-2 font-medium">Base Cost</th>
                      {locations.filter(loc => loc.id !== 'all' && (selectedLocation === 'all' || selectedLocation === loc.id)).map(location => (
                        <th key={location.id} className="text-center p-2 font-medium">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xs">{location.code}</span>
                            <Badge className={getLocationTypeColor(location.type)}>
                              {location.type}
                            </Badge>
                          </div>
                        </th>
                      ))}
                      <th className="text-center p-2 font-medium">Avg Price</th>
                      <th className="text-center p-2 font-medium">Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50 group">
                        <td className="p-2">
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.sku}</div>
                            <div className="text-xs text-gray-400">{product.category}</div>
                          </div>
                        </td>
                        <td className="p-2">
                          <span className="font-medium">AED {product.baseCost}</span>
                        </td>
                        {locations.filter(loc => loc.id !== 'all' && (selectedLocation === 'all' || selectedLocation === loc.id)).map(location => (
                          <td key={location.id} className="p-2 text-center">
                            {product.prices[location.id] ? (
                              <div className="space-y-1">
                                <div className="flex flex-col gap-1">
                                  <div className="text-sm">
                                    {renderPriceCell(product, location, 'retail')}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    W: AED {product.prices[location.id].wholesale}
                                  </div>
                                  <div className={`text-xs ${getMarginColor(product.prices[location.id].margin)}`}>
                                    {product.prices[location.id].margin}% margin
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">Not set</span>
                            )}
                          </td>
                        ))}
                        <td className="p-2 text-center">
                          <span className="font-medium">AED {product.avgPrice}</span>
                        </td>
                        <td className="p-2 text-center">
                          <span className={getVarianceColor(product.priceVariance)}>
                            {product.priceVariance}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {Object.keys(priceUpdates).length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium">You have {Object.keys(priceUpdates).length} pending price updates</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setPriceUpdates({})}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleBulkPriceUpdate}>
                        Apply Changes
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Comparison Analysis</CardTitle>
              <CardDescription>
                Compare pricing strategies across different store locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.sku} • {product.category}</p>
                      </div>
                      <Badge variant="outline">Base Cost: AED {product.baseCost}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {Object.entries(product.prices).map(([locationId, pricing]) => {
                        const location = locations.find(loc => loc.id === locationId);
                        return (
                          <div key={locationId} className="border rounded p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="font-medium text-sm">{location?.name}</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-500">Retail:</span>
                                <span className="text-sm font-medium">AED {pricing.retail}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-500">Wholesale:</span>
                                <span className="text-sm">AED {pricing.wholesale}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-500">Margin:</span>
                                <span className={`text-sm ${getMarginColor(pricing.margin)}`}>
                                  {pricing.margin}%
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Rules & Automation</CardTitle>
              <CardDescription>
                Set up automated pricing rules and approval workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Location-based Pricing Rules</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>Flagship stores: +15% premium on all luxury items</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>Standard stores: Base pricing for all categories</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>Wholesale minimum: 20% margin requirement</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Approval Workflows</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>Price changes {'>'} 10%: Requires manager approval</span>
                      <Badge className="bg-blue-100 text-blue-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>Bulk updates: Requires regional manager approval</span>
                      <Badge className="bg-blue-100 text-blue-800">Enabled</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Change History</CardTitle>
              <CardDescription>
                Track all pricing changes and their impact across locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Royal Oud Premium - Dubai Mall</span>
                      <span className="text-sm text-gray-500 ml-2">Price increased from AED 520 to AED 550</span>
                    </div>
                    <div className="text-sm text-gray-500">2024-09-28 14:30</div>
                  </div>
                  <div className="text-sm text-gray-600">By: Ahmed Al-Rashid (Store Manager)</div>
                </div>

                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Bulk Update - All Premium Locations</span>
                      <span className="text-sm text-gray-500 ml-2">15 products updated</span>
                    </div>
                    <div className="text-sm text-gray-500">2024-09-27 09:15</div>
                  </div>
                  <div className="text-sm text-gray-600">By: Sarah Al-Maktoum (Regional Manager)</div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Saffron Gold - Multiple locations</span>
                      <span className="text-sm text-gray-500 ml-2">Seasonal pricing adjustment</span>
                    </div>
                    <div className="text-sm text-gray-500">2024-09-25 16:45</div>
                  </div>
                  <div className="text-sm text-gray-600">By: System Automation</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PricingManagementPage;