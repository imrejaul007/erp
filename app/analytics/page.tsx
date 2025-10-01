'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardFilters, DrillDownData, ExportOptions } from '@/types/analytics';

// Import all dashboard components
import OwnerDashboard from '@/components/analytics/owner-dashboard';
import SalesAnalytics from '@/components/analytics/sales-analytics';
import InventoryIntelligence from '@/components/analytics/inventory-intelligence';
import PredictiveAnalytics from '@/components/analytics/predictive-analytics';
import FinancialIntelligence from '@/components/analytics/financial-intelligence';
import OperationalDashboard from '@/components/analytics/operational-dashboard';
import RealTimeMonitoring from '@/components/analytics/real-time-monitoring';
import InteractiveFeatures from '@/components/analytics/interactive-features';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: { start: new Date(), end: new Date() },
  });
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFiltersChange = (newFilters: DashboardFilters) => {
    setFilters(newFilters);
    // You could trigger data refresh here
    console.log('Filters changed:', newFilters);
  };

  const handleExport = async (options: ExportOptions) => {
    setIsLoading(true);
    try {
      // Mock export functionality
      console.log('Exporting with options:', options);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real implementation, you would:
      // 1. Send options to backend
      // 2. Generate report based on format
      // 3. Download file or show success message

      alert('Export completed successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrillDown = (data: DrillDownData) => {
    setDrillDownData(data);
    console.log('Drill down:', data);
  };

  const dashboardProps = {
    dateRange: filters.dateRange,
    stores: filters.stores,
    categories: filters.categories,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-oud-50 via-white to-oud-100/30">
      <div className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-oud-800 to-oud-600 bg-clip-text text-transparent">
            Business Intelligence Dashboard
          </h1>
          <p className="text-oud-600 text-lg">
            Comprehensive analytics and insights for your Perfume & Oud business
          </p>
        </div>

        {/* Interactive Features - Filters and Actions */}
        <InteractiveFeatures
          onFiltersChange={handleFiltersChange}
          onExport={handleExport}
          onDrillDown={handleDrillDown}
          isLoading={isLoading}
        />

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 p-1 h-12 bg-white/70 backdrop-blur-sm border border-oud-200 rounded-xl shadow-lg">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-oud-600 data-[state=active]:text-white transition-all duration-200"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="sales"
              className="data-[state=active]:bg-oud-600 data-[state=active]:text-white transition-all duration-200"
            >
              Sales
            </TabsTrigger>
            <TabsTrigger
              value="inventory"
              className="data-[state=active]:bg-oud-600 data-[state=active]:text-white transition-all duration-200"
            >
              Inventory
            </TabsTrigger>
            <TabsTrigger
              value="predictive"
              className="data-[state=active]:bg-oud-600 data-[state=active]:text-white transition-all duration-200"
            >
              Predictive
            </TabsTrigger>
            <TabsTrigger
              value="financial"
              className="data-[state=active]:bg-oud-600 data-[state=active]:text-white transition-all duration-200"
            >
              Financial
            </TabsTrigger>
            <TabsTrigger
              value="operational"
              className="data-[state=active]:bg-oud-600 data-[state=active]:text-white transition-all duration-200"
            >
              Operations
            </TabsTrigger>
            <TabsTrigger
              value="realtime"
              className="data-[state=active]:bg-oud-600 data-[state=active]:text-white transition-all duration-200"
            >
              Live
            </TabsTrigger>
          </TabsList>

          {/* Overview - Owner Dashboard */}
          <TabsContent value="overview" className="space-y-6">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-oud-200/50">
              <OwnerDashboard {...dashboardProps} realTime={true} />
            </div>
          </TabsContent>

          {/* Sales Analytics */}
          <TabsContent value="sales" className="space-y-6">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-oud-200/50">
              <SalesAnalytics
                dateRange={filters.dateRange}
                storeId={filters.stores?.[0]}
                category={filters.categories?.[0]}
              />
            </div>
          </TabsContent>

          {/* Inventory Intelligence */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-oud-200/50">
              <InventoryIntelligence
                category={filters.categories?.[0]}
                storeId={filters.stores?.[0]}
                dateRange={filters.dateRange}
              />
            </div>
          </TabsContent>

          {/* Predictive Analytics */}
          <TabsContent value="predictive" className="space-y-6">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-oud-200/50">
              <PredictiveAnalytics
                horizon={6}
                category={filters.categories?.[0]}
                confidence={80}
              />
            </div>
          </TabsContent>

          {/* Financial Intelligence */}
          <TabsContent value="financial" className="space-y-6">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-oud-200/50">
              <FinancialIntelligence
                period="monthly"
                storeId={filters.stores?.[0]}
                dateRange={filters.dateRange}
              />
            </div>
          </TabsContent>

          {/* Operational Dashboard */}
          <TabsContent value="operational" className="space-y-6">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-oud-200/50">
              <OperationalDashboard
                dateRange={filters.dateRange}
                productionLine="main"
                department="production"
              />
            </div>
          </TabsContent>

          {/* Real-time Monitoring */}
          <TabsContent value="realtime" className="space-y-6">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-oud-200/50">
              <RealTimeMonitoring
                wsUrl="ws://localhost:3001/ws"
                refreshInterval={5000}
                maxDataPoints={50}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Stats Footer */}
        <Card className="bg-gradient-to-r from-oud-600 to-oud-700 text-white shadow-xl border-0">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-sm opacity-90">Total Revenue (YTD)</p>
                <p className="text-2xl font-bold">AED 2.4M</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Active Products</p>
                <p className="text-2xl font-bold">1,245</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Customer Satisfaction</p>
                <p className="text-2xl font-bold">4.6/5.0</p>
              </div>
              <div>
                <p className="text-sm opacity-90">System Health</p>
                <p className="text-2xl font-bold">99.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-oud-600 border-t border-oud-200 pt-6">
          <p>
            Business Intelligence Dashboard powered by AI •
            Last updated: {new Date().toLocaleString()} •
            <span className="text-green-600">All systems operational</span>
          </p>
        </div>
      </div>
    </div>
  );
}