import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Plus,
  Search,
  Filter,
  TrendingDown,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';

export default function InventoryPage() {
  // Mock data for demonstration
  const mockInventory = [
    {
      id: 1,
      name: "Royal Oud Oil",
      nameArabic: "زيت العود الملكي",
      sku: "ROU-001",
      category: "Oud Oil",
      stock: 45,
      unit: "ml",
      status: "In Stock",
      grade: "Royal",
      origin: "Cambodia"
    },
    {
      id: 2,
      name: "Rose Attar",
      nameArabic: "عطر الورد",
      sku: "RAT-002",
      category: "Attar",
      stock: 8,
      unit: "ml",
      status: "Low Stock",
      grade: "Premium",
      origin: "India"
    },
    {
      id: 3,
      name: "Saffron Powder",
      nameArabic: "بودرة الزعفران",
      sku: "SAF-003",
      category: "Spice",
      stock: 0,
      unit: "gram",
      status: "Out of Stock",
      grade: "Super",
      origin: "Kashmir"
    }
  ];

  const stats = [
    {
      title: "Total Items",
      value: "1,234",
      change: "+12%",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Low Stock Items",
      value: "23",
      change: "+5%",
      icon: TrendingDown,
      color: "text-orange-600"
    },
    {
      title: "Out of Stock",
      value: "7",
      change: "-2",
      icon: AlertTriangle,
      color: "text-red-600"
    },
    {
      title: "Total Value",
      value: "AED 45,231",
      change: "+15%",
      icon: BarChart3,
      color: "text-green-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">
            Manage your perfume, oud, and raw material inventory
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-amber-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Inventory List */}
      <Card className="border-amber-100">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-amber-600" />
            Current Inventory
          </CardTitle>
          <CardDescription>
            Track your perfume materials and products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockInventory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg border border-amber-100 hover:bg-amber-50/50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.nameArabic}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500">SKU: {item.sku}</span>
                    <span className="text-xs text-gray-500">Category: {item.category}</span>
                    <span className="text-xs text-gray-500">Origin: {item.origin}</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">{item.stock} {item.unit}</p>
                  <Badge
                    className={`mt-1 ${
                      item.status === 'In Stock'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'Low Stock'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="text-center">
                  <Badge className="bg-amber-100 text-amber-800">
                    {item.grade}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}