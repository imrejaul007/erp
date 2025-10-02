'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, TrendingDown, Download, DollarSign, Package, AlertTriangle, Target } from 'lucide-react';

export default function InventoryAnalyticsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Analytics</h1>
          <p className="text-muted-foreground">Analyze inventory performance and trends</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="thisMonth">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="thisQuarter">This Quarter</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => router.push('/reports/inventory')}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stock Turnover</p>
                <p className="text-2xl font-bold">4.2x</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  +12% vs last month
                </div>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Days on Hand</p>
                <p className="text-2xl font-bold">87</p>
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <TrendingDown className="h-3 w-3" />
                  -8 days
                </div>
              </div>
              <Package className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stock Accuracy</p>
                <p className="text-2xl font-bold">96.5%</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  +2.1%
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Carrying Cost</p>
                <p className="text-2xl font-bold">AED 12.5K</p>
                <div className="flex items-center gap-1 text-xs text-yellow-600">
                  <AlertTriangle className="h-3 w-3" />
                  High
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
            <CardDescription>Best performing products by turnover</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Royal Oud Perfume 50ml', turnover: 8.5, value: 'AED 280K' },
                { name: 'Premium Cambodian Oud', turnover: 7.2, value: 'AED 195K' },
                { name: 'Rose Essential Oil', turnover: 6.8, value: 'AED 156K' },
                { name: 'Amber Extract Premium', turnover: 5.9, value: 'AED 134K' },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">{item.value}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={(item.turnover / 10) * 100} className="h-2" />
                    <span className="text-xs font-medium">{item.turnover}x</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Slow Moving Items</CardTitle>
            <CardDescription>Products requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Vintage Musk Collection', daysOnHand: 285, value: 'AED 45K' },
                { name: 'Limited Edition Gift Set', daysOnHand: 198, value: 'AED 32K' },
                { name: 'Traditional Bakhoor Box', daysOnHand: 165, value: 'AED 28K' },
                { name: 'Crystal Decanters', daysOnHand: 142, value: 'AED 18K' },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.name}</span>
                    <Badge variant="outline" className="text-orange-600">
                      {item.daysOnHand} days
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Stock value: {item.value}</span>
                    <Button variant="link" size="sm" className="h-auto p-0">
                      View details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Value by Category</CardTitle>
          <CardDescription>Distribution of stock value across product categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { category: 'Raw Materials', value: 650000, percentage: 52 },
              { category: 'Finished Products', value: 420000, percentage: 33.6 },
              { category: 'Packaging', value: 125000, percentage: 10 },
              { category: 'Semi-Finished', value: 45000, percentage: 3.6 },
              { category: 'Accessories', value: 10000, percentage: 0.8 },
            ].map((cat) => (
              <div key={cat.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{cat.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">AED {(cat.value / 1000).toFixed(0)}K</span>
                    <Badge variant="secondary">{cat.percentage}%</Badge>
                  </div>
                </div>
                <Progress value={cat.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
