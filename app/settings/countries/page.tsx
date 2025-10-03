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
  Globe,
  Building,
  Percent,
  Package,
  MapPin,
  Edit,
  Eye,
  FileText,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CountriesPage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const countries = [
    {
      id: 1,
      name: 'United Arab Emirates',
      code: 'AE',
      flag: '🇦🇪',
      currency: 'AED',
      taxRate: 5,
      taxType: 'VAT',
      stores: 8,
      warehouses: 2,
      isActive: true,
      compliance: ['IFRA', 'Dubai Municipality', 'ESMA'],
    },
    {
      id: 2,
      name: 'Saudi Arabia',
      code: 'SA',
      flag: '🇸🇦',
      currency: 'SAR',
      taxRate: 15,
      taxType: 'VAT',
      stores: 5,
      warehouses: 1,
      isActive: true,
      compliance: ['SFDA', 'SASO', 'IFRA'],
    },
    {
      id: 3,
      name: 'India',
      code: 'IN',
      flag: '🇮🇳',
      currency: 'INR',
      taxRate: 18,
      taxType: 'GST',
      stores: 3,
      warehouses: 1,
      isActive: true,
      compliance: ['FSSAI', 'BIS', 'Drugs & Cosmetics Act'],
    },
    {
      id: 4,
      name: 'United Kingdom',
      code: 'GB',
      flag: '🇬🇧',
      currency: 'GBP',
      taxRate: 20,
      taxType: 'VAT',
      stores: 2,
      warehouses: 1,
      isActive: true,
      compliance: ['UKCA', 'Trading Standards', 'IFRA'],
    },
    {
      id: 5,
      name: 'United States',
      code: 'US',
      flag: '🇺🇸',
      currency: 'USD',
      taxRate: 0,
      taxType: 'State Tax',
      stores: 1,
      warehouses: 1,
      isActive: false,
      compliance: ['FDA', 'IFRA', 'CPSC'],
    },
  ];

  const stats = [
    {
      label: 'Active Countries',
      value: '4',
      icon: Globe,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Total Stores',
      value: '19',
      icon: Building,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Warehouses',
      value: '6',
      icon: Package,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: 'Tax Jurisdictions',
      value: '5',
      icon: Percent,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

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
              <Globe className="h-8 w-8 text-blue-600" />
              Country Profiles
            </h1>
            <p className="text-muted-foreground">Manage country-specific operations and compliance</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="luxury">
              <Plus className="h-4 w-4 mr-2" />
              Add Country
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Country Profile</DialogTitle>
              <DialogDescription>
                Configure country-specific settings, taxation, and compliance
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="tax">Taxation</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="logistics">Logistics</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Country Name</Label>
                    <Input placeholder="e.g., United Arab Emirates" />
                  </div>
                  <div className="space-y-2">
                    <Label>Country Code (ISO)</Label>
                    <Input placeholder="e.g., AE" maxLength={2} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <select className="w-full border rounded-md px-3 py-2">
                      <option>AED - UAE Dirham</option>
                      <option>SAR - Saudi Riyal</option>
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                      <option>GBP - British Pound</option>
                      <option>INR - Indian Rupee</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <select className="w-full border rounded-md px-3 py-2">
                      <option>English</option>
                      <option>Arabic</option>
                      <option>French</option>
                      <option>Hindi</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Active</Label>
                  <Switch defaultChecked />
                </div>
              </TabsContent>

              <TabsContent value="tax" className="space-y-4">
                <div className="space-y-2">
                  <Label>Tax System</Label>
                  <select className="w-full border rounded-md px-3 py-2">
                    <option>VAT (Value Added Tax)</option>
                    <option>GST (Goods and Services Tax)</option>
                    <option>Sales Tax</option>
                    <option>No Tax</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Standard Tax Rate (%)</Label>
                  <Input type="number" step="0.01" placeholder="e.g., 5" />
                </div>
                <div className="space-y-2">
                  <Label>Reduced Tax Rate (%) - Optional</Label>
                  <Input type="number" step="0.01" placeholder="e.g., 0" />
                </div>
                <div className="space-y-2">
                  <Label>Tax Number Format</Label>
                  <Input placeholder="e.g., TRN-XXXXXXXXXXXX" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Tax on Luxury Goods</Label>
                    <p className="text-xs text-muted-foreground">Additional tax on premium perfumes</p>
                  </div>
                  <Input type="number" className="w-24" placeholder="0" />
                </div>
              </TabsContent>

              <TabsContent value="compliance" className="space-y-4">
                <div className="space-y-2">
                  <Label>Compliance Standards</Label>
                  <Input placeholder="e.g., IFRA, FDA, REACH" />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of required standards
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Required Certifications</Label>
                  <textarea
                    className="w-full border rounded-md px-3 py-2"
                    rows={3}
                    placeholder="List required certifications..."
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <Label>Restricted Ingredients</Label>
                  <textarea
                    className="w-full border rounded-md px-3 py-2"
                    rows={3}
                    placeholder="List banned or restricted ingredients for this country..."
                  ></textarea>
                </div>
                <div className="flex items-center justify-between">
                  <Label>IFRA Compliance Required</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Safety Data Sheets Required</Label>
                  <Switch defaultChecked />
                </div>
              </TabsContent>

              <TabsContent value="logistics" className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Shipping Method</Label>
                  <select className="w-full border rounded-md px-3 py-2">
                    <option>Standard Ground</option>
                    <option>Express Air</option>
                    <option>International Courier</option>
                    <option>Local Delivery</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Customs HS Code Prefix</Label>
                  <Input placeholder="e.g., 3303" />
                </div>
                <div className="space-y-2">
                  <Label>Import Duty Rate (%)</Label>
                  <Input type="number" step="0.01" placeholder="e.g., 5" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Alcohol-based Perfumes Restricted</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Oud Products Require Special Permit</Label>
                  <Switch />
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="luxury" className="flex-1">
                Add Country
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

      {/* Countries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {countries.map((country) => (
          <Card key={country.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{country.flag}</div>
                  <div>
                    <CardTitle className="text-xl">{country.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="h-3 w-3" />
                      Code: {country.code}
                    </CardDescription>
                  </div>
                </div>
                {country.isActive ? (
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                ) : (
                  <Badge variant="outline">Inactive</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Financial Info */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Currency</p>
                  <p className="font-semibold">{country.currency}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{country.taxType}</p>
                  <p className="font-semibold">{country.taxRate}%</p>
                </div>
              </div>

              {/* Operations */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Stores</p>
                    <p className="font-semibold">{country.stores}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Warehouses</p>
                    <p className="font-semibold">{country.warehouses}</p>
                  </div>
                </div>
              </div>

              {/* Compliance */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Compliance Standards</p>
                <div className="flex flex-wrap gap-1">
                  {country.compliance.map((standard, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      {standard}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" size="sm">
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
