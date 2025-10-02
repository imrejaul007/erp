'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Users,
  Store,
  Package,
  CreditCard,
  BarChart3,
  Star,
  Globe,
  Shield,
  Zap,
  Crown,
  Heart,
  Clock,
  Calendar,
  Settings,
  Plus
} from 'lucide-react';

const DemoPage = () => {
  const systemStats = {
    totalPages: 120,
    modules: 13,
    userRoles: 5,
    features: 85,
    integrations: 12
  };

  const completedModules = [
    {
      name: 'Sales & POS',
      arabicName: 'المبيعات ونقاط البيع',
      icon: CreditCard,
      pages: 12,
      status: 'complete',
      features: ['Bilingual Support', 'VAT Calculation', 'Multi-Payment', 'Unit Conversion']
    },
    {
      name: 'Inventory Management',
      arabicName: 'إدارة المخزون',
      icon: Package,
      pages: 15,
      status: 'complete',
      features: ['Stock Tracking', 'Multi-Location', 'Batch Management', 'Expiry Alerts']
    },
    {
      name: 'Production Management',
      arabicName: 'إدارة الإنتاج',
      icon: Crown,
      pages: 8,
      status: 'complete',
      features: ['Recipe Management', 'Distillation Tracking', 'Quality Control', 'Yield Reports']
    },
    {
      name: 'Customer Management (CRM)',
      arabicName: 'إدارة العملاء',
      icon: Users,
      pages: 10,
      status: 'complete',
      features: ['Loyalty Program', 'VIP Segments', 'Purchase History', 'Multi-Channel']
    },
    {
      name: 'Purchasing & Vendors',
      arabicName: 'المشتريات والموردين',
      icon: Store,
      pages: 8,
      status: 'complete',
      features: ['Import Tracking', 'Vendor Performance', 'Multi-Currency', 'Customs Integration']
    },
    {
      name: 'Finance & Accounting',
      arabicName: 'المالية والمحاسبة',
      icon: BarChart3,
      pages: 12,
      status: 'complete',
      features: ['UAE VAT Compliance', 'Multi-Currency', 'Financial Reports', 'Bank Reconciliation']
    },
    {
      name: 'Multi-Location Management',
      arabicName: 'إدارة المواقع المتعددة',
      icon: Globe,
      pages: 6,
      status: 'complete',
      features: ['Centralized Control', 'Transfer Management', 'Performance Analytics', 'Access Control']
    },
    {
      name: 'E-commerce / Omni-channel',
      arabicName: 'التجارة الإلكترونية',
      icon: Zap,
      pages: 8,
      status: 'complete',
      features: ['6 Sales Channels', 'Order Sync', 'Campaign Management', 'Customer Journey']
    },
    {
      name: 'HR & Staff Management',
      arabicName: 'الموارد البشرية',
      icon: Shield,
      pages: 7,
      status: 'complete',
      features: ['Employee Directory', 'Attendance', 'Payroll', 'Commission Tracking']
    },
    {
      name: 'Reports & Analytics',
      arabicName: 'التقارير والتحليلات',
      icon: BarChart3,
      pages: 9,
      status: 'complete',
      features: ['KPI Dashboard', 'Sales Analytics', 'Customer Insights', 'Forecasting']
    },
    {
      name: 'Perfume & Oud Features',
      arabicName: 'ميزات العطور والعود',
      icon: Star,
      pages: 11,
      status: 'complete',
      features: ['Professional Grading', 'Aging Programs', 'Distillation Tracking', 'Cultural Integration']
    },
    {
      name: 'Settings & Administration',
      arabicName: 'الإعدادات والإدارة',
      icon: Settings,
      pages: 8,
      status: 'complete',
      features: ['User Management', 'Role-Based Access', 'System Configuration', 'Security Settings']
    },
    {
      name: 'Navigation & Sitemap',
      arabicName: 'التنقل وخريطة الموقع',
      icon: Globe,
      pages: 6,
      status: 'complete',
      features: ['Complete Sitemap', 'Role-Based Sidebar', 'Expandable Navigation', 'Mobile Responsive']
    }
  ];

  const uaeFeatures = [
    {
      title: 'UAE VAT Compliance',
      description: '5% VAT calculation and reporting',
      icon: Calendar
    },
    {
      title: 'Bilingual Support',
      description: 'English and Arabic interface',
      icon: Globe
    },
    {
      title: 'Traditional Units',
      description: 'Tola, grams, ml conversions',
      icon: Package
    },
    {
      title: 'Cultural Integration',
      description: 'UAE occasions and traditions',
      icon: Heart
    },
    {
      title: 'Multi-Currency',
      description: 'AED, USD, EUR support',
      icon: CreditCard
    },
    {
      title: 'Local Integrations',
      description: 'Emirates Post, Dubai Customs',
      icon: Zap
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🌟 Oud Palace ERP + POS System
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Complete Perfume & Oud Business Management Solution for UAE Market
        </p>
        <p className="text-lg text-gray-500">
          📍 Built specifically for UAE businesses with cultural and regulatory compliance
        </p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{systemStats.totalPages}</div>
            <div className="text-sm text-gray-600">Total Pages</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{systemStats.modules}</div>
            <div className="text-sm text-gray-600">Main Modules</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{systemStats.userRoles}</div>
            <div className="text-sm text-gray-600">User Roles</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{systemStats.features}</div>
            <div className="text-sm text-gray-600">Features</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-xl sm:text-2xl font-bold text-red-600">{systemStats.integrations}</div>
            <div className="text-sm text-gray-600">Integrations</div>
          </CardContent>
        </Card>
      </div>

      {/* UAE-Specific Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🇦🇪 UAE Market Specific Features
          </CardTitle>
          <CardDescription>
            Designed specifically for UAE perfume and oud businesses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uaeFeatures.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3 p-3 border rounded-lg">
                <feature.icon className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completed Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            All Modules Completed & Functional
          </CardTitle>
          <CardDescription>
            Complete ERP + POS system with 120+ pages across 13 main modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {completedModules.map((module) => (
              <div key={module.name} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <module.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{module.name}</h3>
                      <p className="text-sm text-gray-600">{module.arabicName}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Complete
                  </Badge>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  {module.pages} pages implemented
                </div>

                <div className="flex flex-wrap gap-1">
                  {module.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Quick Access - Test the System</CardTitle>
          <CardDescription>
            Use the sidebar navigation to explore different modules and features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex flex-col">
              <CreditCard className="h-6 w-6 mb-1" />
              <span className="text-sm">POS Terminal</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col">
              <Package className="h-6 w-6 mb-1" />
              <span className="text-sm">Inventory</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col">
              <Users className="h-6 w-6 mb-1" />
              <span className="text-sm">Customers</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col">
              <BarChart3 className="h-6 w-6 mb-1" />
              <span className="text-sm">Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4 sm:p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-green-800">System Complete & Ready</h2>
          </div>
          <p className="text-green-700 mb-4">
            🎉 All 120+ pages have been successfully implemented across 13 main modules
          </p>
          <p className="text-green-600">
            The complete Perfume & Oud ERP + POS system is now functional and ready for use!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoPage;