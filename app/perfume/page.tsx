'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Droplets,
  Star,
  Calendar,
  Thermometer,
  Beaker,
  Crown,
  Leaf,
  Mountain,
  Eye,
  Edit,
  Plus,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  Package,
  Clock,
  MapPin,
  Award,
  ChefHat,
  Sparkles,
  Heart,
  Moon,
  Sun,
  Flower2,
  Trees
} from 'lucide-react';

const PerfumePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');

  // Sample perfume data
  const perfumeMetrics = {
    totalProducts: 287,
    premiumOuds: 45,
    averageGrade: 4.2,
    agingProducts: 23,
    trends: {
      products: +8.5,
      grade: +0.3,
      aging: +12.7,
      sales: +15.2
    }
  };

  const featuredPerfumes = [
    {
      id: 'OUD-001',
      name: 'Royal Cambodian Oud',
      arabicName: 'عود كمبودي ملكي',
      category: 'Premium Oud',
      grade: 'Super A+',
      origin: 'Cambodia',
      age: '15 years',
      price: 2500,
      stock: 12,
      distillationDate: '2009-03-15',
      notes: ['Woody', 'Sweet', 'Honey', 'Barnyard'],
      strength: 95,
      longevity: 12,
      projection: 'Heavy',
      occasion: 'Special Events'
    },
    {
      id: 'ATT-002',
      name: 'Taif Rose Attar',
      arabicName: 'عطر ورد طائفي',
      category: 'Rose Attar',
      grade: 'A+',
      origin: 'Taif, Saudi Arabia',
      age: '3 years',
      price: 850,
      stock: 28,
      distillationDate: '2021-04-20',
      notes: ['Rose', 'Floral', 'Sweet', 'Fresh'],
      strength: 85,
      longevity: 8,
      projection: 'Moderate',
      occasion: 'Daily Wear'
    },
    {
      id: 'OUD-003',
      name: 'Hindi Black Oud',
      arabicName: 'عود هندي أسود',
      category: 'Hindi Oud',
      grade: 'A+',
      origin: 'Assam, India',
      age: '8 years',
      price: 1200,
      stock: 18,
      distillationDate: '2016-07-10',
      notes: ['Animalic', 'Leather', 'Smoky', 'Medicinal'],
      strength: 90,
      longevity: 10,
      projection: 'Heavy',
      occasion: 'Evening'
    },
    {
      id: 'MIS-004',
      name: 'Musk Tahara',
      arabicName: 'مسك طهارة',
      category: 'Musk',
      grade: 'A',
      origin: 'Traditional',
      age: 'Fresh',
      price: 120,
      stock: 85,
      distillationDate: '2024-01-15',
      notes: ['Clean', 'Soft', 'Powdery', 'White Musk'],
      strength: 60,
      longevity: 6,
      projection: 'Close',
      occasion: 'Religious'
    }
  ];

  const productCategories = [
    {
      name: 'Premium Oud',
      count: 45,
      averagePrice: 1800,
      topGrade: 'Super A+',
      icon: Crown,
      color: 'text-purple-600'
    },
    {
      name: 'Rose Attar',
      count: 38,
      averagePrice: 650,
      topGrade: 'A+',
      icon: Flower2,
      color: 'text-pink-600'
    },
    {
      name: 'Hindi Oud',
      count: 32,
      averagePrice: 950,
      topGrade: 'A+',
      icon: Mountain,
      color: 'text-orange-600'
    },
    {
      name: 'Traditional Attars',
      count: 67,
      averagePrice: 280,
      topGrade: 'A',
      icon: Droplets,
      color: 'text-blue-600'
    },
    {
      name: 'Musk Collection',
      count: 42,
      averagePrice: 150,
      topGrade: 'A',
      icon: Heart,
      color: 'text-green-600'
    },
    {
      name: 'Floral Essences',
      count: 63,
      averagePrice: 420,
      topGrade: 'A+',
      icon: Trees,
      color: 'text-emerald-600'
    }
  ];

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'Super A+': return 'bg-purple-100 text-purple-800';
      case 'A+': return 'bg-blue-100 text-blue-800';
      case 'A': return 'bg-green-100 text-green-800';
      case 'B+': return 'bg-yellow-100 text-yellow-800';
      case 'B': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOccasionIcon = (occasion) => {
    switch (occasion) {
      case 'Special Events': return Crown;
      case 'Daily Wear': return Sun;
      case 'Evening': return Moon;
      case 'Religious': return Heart;
      default: return Sparkles;
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Perfume & Oud Collection</h1>
          <p className="text-gray-600">Manage premium fragrances, traditional attars, and oud collection</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-xl sm:text-2xl font-bold">{perfumeMetrics.totalProducts}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(perfumeMetrics.trends.products)}`}>
                  {getTrendIcon(perfumeMetrics.trends.products)}
                  {Math.abs(perfumeMetrics.trends.products)}% vs last month
                </div>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Premium Ouds</p>
                <p className="text-xl sm:text-2xl font-bold">{perfumeMetrics.premiumOuds}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(perfumeMetrics.trends.grade)}`}>
                  {getTrendIcon(perfumeMetrics.trends.grade)}
                  Grade improvement
                </div>
              </div>
              <Crown className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Grade</p>
                <p className="text-xl sm:text-2xl font-bold">{perfumeMetrics.averageGrade}/5</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < perfumeMetrics.averageGrade ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aging Programs</p>
                <p className="text-xl sm:text-2xl font-bold">{perfumeMetrics.agingProducts}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(perfumeMetrics.trends.aging)}`}>
                  {getTrendIcon(perfumeMetrics.trends.aging)}
                  {Math.abs(perfumeMetrics.trends.aging)}% new entries
                </div>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Product Categories</CardTitle>
          <CardDescription>Overview of fragrance categories and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productCategories.map((category) => (
              <div key={category.name} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <category.icon className={`h-8 w-8 ${category.color}`} />
                  <Badge className={getGradeColor(category.topGrade)}>
                    {category.topGrade}
                  </Badge>
                </div>
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>{category.count} products</div>
                  <div>Avg: AED {category.averagePrice?.toLocaleString() || "0"}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured Products */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Premium Collection</CardTitle>
              <CardDescription>Showcase of finest perfumes and oud products</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="premium">Premium Oud</SelectItem>
                  <SelectItem value="rose">Rose Attar</SelectItem>
                  <SelectItem value="hindi">Hindi Oud</SelectItem>
                  <SelectItem value="musk">Musk</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="super">Super A+</SelectItem>
                  <SelectItem value="aplus">A+</SelectItem>
                  <SelectItem value="a">A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Grade & Origin</TableHead>
                <TableHead>Age & Price</TableHead>
                <TableHead>Characteristics</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {featuredPerfumes.map((product) => {
                const OccasionIcon = getOccasionIcon(product.occasion);
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.arabicName}</div>
                        <div className="text-xs text-gray-500 mt-1">{product.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge className={getGradeColor(product.grade)} size="sm">
                          {product.grade}
                        </Badge>
                        <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {product.origin}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">AED {product.price?.toLocaleString() || "0"}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {product.age}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">Strength:</span> {product.strength}%
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Longevity:</span> {product.longevity}h
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <OccasionIcon className="h-3 w-3" />
                          {product.occasion}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{product.stock}</div>
                        <div className="text-xs text-gray-500">units</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6 text-center">
            <Beaker className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-medium mb-2">Distillation Tracking</h3>
            <p className="text-sm text-gray-600">Monitor distillation processes and batches</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6 text-center">
            <Thermometer className="h-12 w-12 mx-auto mb-4 text-orange-600" />
            <h3 className="font-medium mb-2">Aging Programs</h3>
            <p className="text-sm text-gray-600">Manage long-term aging and maturation</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6 text-center">
            <Award className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h3 className="font-medium mb-2">Quality Grading</h3>
            <p className="text-sm text-gray-600">Professional grading and certification</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6 text-center">
            <ChefHat className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="font-medium mb-2">Blending Lab</h3>
            <p className="text-sm text-gray-600">Create custom blends and formulations</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerfumePage;