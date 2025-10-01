'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Receipt,
  Calculator,
  FileText,
  Building,
  Globe,
  AlertCircle,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Save,
  Settings,
  ArrowLeft,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

const TaxSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');

  // UAE VAT Configuration
  const [vatSettings, setVatSettings] = useState({
    isVatEnabled: true,
    defaultVatRate: 5,
    vatRegistrationNumber: 'TRN-100123456789',
    vatRegistrationDate: '2018-01-01',
    companyName: 'Oud Palace UAE LLC',
    companyAddress: 'Dubai, United Arab Emirates',
    companyPhone: '+971-4-1234567',
    companyEmail: 'admin@oudpalace.ae',
    vatPeriod: 'quarterly',
    nextVatReturn: '2024-04-30',
    vatReturnMethod: 'electronic'
  });

  // Tax Categories for Products
  const [taxCategories, setTaxCategories] = useState([
    {
      id: 'standard',
      name: 'Standard Rate',
      rate: 5,
      description: 'Standard VAT rate for most goods and services',
      code: 'STD',
      applicableItems: ['Perfumes', 'Oud', 'Cosmetics', 'Accessories'],
      isDefault: true,
      status: 'active'
    },
    {
      id: 'zero',
      name: 'Zero Rate',
      rate: 0,
      description: 'Zero-rated supplies (exports, medical supplies)',
      code: 'ZER',
      applicableItems: ['Export Sales', 'Medical Products'],
      isDefault: false,
      status: 'active'
    },
    {
      id: 'exempt',
      name: 'Exempt',
      rate: 0,
      description: 'VAT-exempt supplies (financial services, education)',
      code: 'EXE',
      applicableItems: ['Training Services', 'Financial Services'],
      isDefault: false,
      status: 'active'
    }
  ]);

  // Tax Reports
  const [taxReports, setTaxReports] = useState([
    {
      id: 'q1-2024',
      period: 'Q1 2024',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      status: 'submitted',
      totalSales: 850000,
      totalVat: 42500,
      submissionDate: '2024-04-15',
      returnNumber: 'VAT-001-2024'
    },
    {
      id: 'q4-2023',
      period: 'Q4 2023',
      startDate: '2023-10-01',
      endDate: '2023-12-31',
      status: 'submitted',
      totalSales: 920000,
      totalVat: 46000,
      submissionDate: '2024-01-15',
      returnNumber: 'VAT-004-2023'
    },
    {
      id: 'q2-2024',
      period: 'Q2 2024',
      startDate: '2024-04-01',
      endDate: '2024-06-30',
      status: 'draft',
      totalSales: 0,
      totalVat: 0,
      submissionDate: null,
      returnNumber: null
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'submitted': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'draft': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'overdue': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Settings
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tax & VAT Settings</h1>
            <p className="text-gray-600">Configure VAT rates, tax categories, and compliance settings for UAE</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Tax Data
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Tax Status Alert */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">VAT Registration Active</p>
              <p className="text-sm text-green-700">
                Your business is registered for VAT with TRN: {vatSettings.vatRegistrationNumber}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General VAT
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Tax Categories
          </TabsTrigger>
          <TabsTrigger value="returns" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            VAT Returns
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Compliance
          </TabsTrigger>
        </TabsList>

        {/* General VAT Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>VAT Registration Details</CardTitle>
              <CardDescription>UAE VAT registration information and basic settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vatEnabled">VAT Enabled</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch
                      id="vatEnabled"
                      checked={vatSettings.isVatEnabled}
                      onCheckedChange={(checked) =>
                        setVatSettings(prev => ({...prev, isVatEnabled: checked}))
                      }
                    />
                    <Label htmlFor="vatEnabled" className="text-sm text-gray-600">
                      Enable VAT calculations
                    </Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="defaultRate">Default VAT Rate (%)</Label>
                  <Input
                    id="defaultRate"
                    type="number"
                    value={vatSettings.defaultVatRate}
                    onChange={(e) =>
                      setVatSettings(prev => ({...prev, defaultVatRate: parseFloat(e.target.value)}))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="vatNumber">VAT Registration Number (TRN)</Label>
                  <Input
                    id="vatNumber"
                    value={vatSettings.vatRegistrationNumber}
                    onChange={(e) =>
                      setVatSettings(prev => ({...prev, vatRegistrationNumber: e.target.value}))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="registrationDate">Registration Date</Label>
                  <Input
                    id="registrationDate"
                    type="date"
                    value={vatSettings.vatRegistrationDate}
                    onChange={(e) =>
                      setVatSettings(prev => ({...prev, vatRegistrationDate: e.target.value}))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Business details for VAT returns and invoices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Legal Company Name</Label>
                  <Input
                    id="companyName"
                    value={vatSettings.companyName}
                    onChange={(e) =>
                      setVatSettings(prev => ({...prev, companyName: e.target.value}))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="companyEmail">Email Address</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={vatSettings.companyEmail}
                    onChange={(e) =>
                      setVatSettings(prev => ({...prev, companyEmail: e.target.value}))
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="companyAddress">Business Address</Label>
                  <Textarea
                    id="companyAddress"
                    value={vatSettings.companyAddress}
                    onChange={(e) =>
                      setVatSettings(prev => ({...prev, companyAddress: e.target.value}))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="companyPhone">Phone Number</Label>
                  <Input
                    id="companyPhone"
                    value={vatSettings.companyPhone}
                    onChange={(e) =>
                      setVatSettings(prev => ({...prev, companyPhone: e.target.value}))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="vatPeriod">VAT Return Period</Label>
                  <Select
                    value={vatSettings.vatPeriod}
                    onValueChange={(value) =>
                      setVatSettings(prev => ({...prev, vatPeriod: value}))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Categories */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Tax Categories</CardTitle>
                  <CardDescription>Configure different VAT rates for product categories</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxCategories.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Calculator className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{category.name}</h3>
                            <Badge className={getStatusColor(category.status)}>
                              {category.rate}% VAT
                            </Badge>
                            {category.isDefault && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{category.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Code: {category.code} | Applied to: {category.applicableItems.join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VAT Returns */}
        <TabsContent value="returns" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>VAT Returns</CardTitle>
                  <CardDescription>Manage VAT return submissions and compliance</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync FTA
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Return
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FileText className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{report.period}</h3>
                            <Badge className={getStatusColor(report.status)}>
                              {getStatusIcon(report.status)}
                              {report.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {report.startDate} to {report.endDate}
                          </p>
                          <div className="flex gap-4 text-xs text-gray-500 mt-1">
                            <span>Sales: AED {report.totalSales.toLocaleString()}</span>
                            <span>VAT: AED {report.totalVat.toLocaleString()}</span>
                            {report.submissionDate && (
                              <span>Submitted: {report.submissionDate}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next VAT Return Due</CardTitle>
              <CardDescription>Upcoming VAT return deadline and preparation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">
                    Q2 2024 VAT Return Due: {vatSettings.nextVatReturn}
                  </p>
                  <p className="text-sm text-yellow-700">
                    Ensure all transactions are recorded and reviewed before submission
                  </p>
                </div>
                <Button className="ml-auto">
                  Prepare Return
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>UAE VAT Compliance</CardTitle>
              <CardDescription>Federal Tax Authority (FTA) compliance and regulations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Invoice Requirements</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Include VAT Registration Number on Invoices</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Show VAT Amount Separately</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Include Tax Point (Supply Date)</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Sequential Invoice Numbering</label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Record Keeping</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Maintain Digital Records</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">5-Year Record Retention</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Audit Trail Logging</label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">FTA Integration</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Electronic VAT Return Submission</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Real-time Reporting (Future)</label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">E-Invoicing Integration</label>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>Current compliance status and requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">VAT Registration</h4>
                  </div>
                  <p className="text-sm text-gray-600">Valid and up to date</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Invoice Format</h4>
                  </div>
                  <p className="text-sm text-gray-600">Complies with FTA requirements</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-medium">E-Invoicing</h4>
                  </div>
                  <p className="text-sm text-gray-600">Preparation required for 2024</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Record Keeping</h4>
                  </div>
                  <p className="text-sm text-gray-600">Digital records maintained</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxSettingsPage;