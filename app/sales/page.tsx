'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Plus, Search, Filter, ShoppingCart, CreditCard, Receipt, TrendingUp, DollarSign, Users, Package, Calendar,
  ArrowLeft} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { DatePicker } from '@/components/ui/date-picker';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

// Mock data for products
const products = [
  {
    id: 'PRD001',
    name: 'Royal Oud Premium',
    category: 'Oud',
    price: 450.00,
    stock: 25,
    image: '/api/placeholder/100/100',
  },
  {
    id: 'PRD002',
    name: 'Amber Essence Deluxe',
    category: 'Amber',
    price: 320.00,
    stock: 18,
    image: '/api/placeholder/100/100',
  },
  {
    id: 'PRD003',
    name: 'Rose Garden Collection',
    category: 'Rose',
    price: 280.00,
    stock: 32,
    image: '/api/placeholder/100/100',
  },
  {
    id: 'PRD004',
    name: 'Sandalwood Serenity',
    category: 'Sandalwood',
    price: 380.00,
    stock: 15,
    image: '/api/placeholder/100/100',
  },
  {
    id: 'PRD005',
    name: 'Musk Al-Haramain',
    category: 'Musk',
    price: 220.00,
    stock: 40,
    image: '/api/placeholder/100/100',
  },
  {
    id: 'PRD006',
    name: 'Jasmine Night',
    category: 'Floral',
    price: 195.00,
    stock: 28,
    image: '/api/placeholder/100/100',
  },
];

// Mock data for recent orders
const recentOrders = [
  {
    id: 'ORD-2024-001',
    customer: 'Ahmed Al-Mansouri',
    items: 3,
    total: 1250.00,
    status: 'Completed',
    date: '2024-09-30',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'ORD-2024-002',
    customer: 'Fatima Hassan',
    items: 1,
    total: 450.00,
    status: 'Processing',
    date: '2024-09-30',
    paymentMethod: 'Cash',
  },
  {
    id: 'ORD-2024-003',
    customer: 'Mohammed Saeed',
    items: 2,
    total: 760.00,
    status: 'Shipped',
    date: '2024-09-29',
    paymentMethod: 'Bank Transfer',
  },
];

const customers: ComboboxOption[] = [
  { label: 'Ahmed Al-Mansouri', value: 'customer1' },
  { label: 'Fatima Hassan', value: 'customer2' },
  { label: 'Mohammed Saeed', value: 'customer3' },
  { label: 'Aisha Al-Zahra', value: 'customer4' },
  { label: 'Omar Al-Rashid', value: 'customer5' },
];

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
  }).format(amount);
};

const calculateVAT = (amount: number): number => {
  return amount * 0.05; // 5% UAE VAT
};

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'Completed': 'secondary',
    'Processing': 'default',
    'Shipped': 'outline',
    'Cancelled': 'destructive',
  };
  return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
};

export default function SalesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<Array<{ product: typeof products[0], quantity: number }>>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);
  const [isPOSMode, setIsPOSMode] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category.toLowerCase())))];

  const addToCart = (product: typeof products[0]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const vatAmount = calculateVAT(subtotal);
  const total = subtotal + vatAmount;

  const processOrder = () => {
    // Here you would process the order
    console.log('Processing order:', { cart, customer: selectedCustomer, total });
    setCart([]);
    setSelectedCustomer('');
    setIsNewOrderDialogOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="h-8 w-8 text-oud-600" />
            Sales Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Point of Sale, Order Management & Sales Analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isPOSMode ? 'default' : 'outline'}
            onClick={() => setIsPOSMode(!isPOSMode)}
            className="gap-2"
          >
            <CreditCard className="h-4 w-4" />
            {isPOSMode ? 'Exit POS' : 'POS Mode'}
          </Button>
          <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-oud-600 hover:bg-oud-700">
                <Plus className="h-4 w-4" />
                New Order
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(2460.00)}</div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              3 pending processing
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">
              8 new this week
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-oud-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">
              Across 6 categories
            </p>
          </CardContent>
        </Card>
      </div>

      {isPOSMode ? (
        /* POS Interface */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Product Selection */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Products</CardTitle>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => addToCart(product)}
                    >
                      <CardContent className="p-4">
                        <div className="w-full h-24 bg-gradient-to-br from-oud-100 to-amber-100 rounded-md mb-3 flex items-center justify-center">
                          <Package className="h-8 w-8 text-oud-600" />
                        </div>
                        <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-oud-600">{formatCurrency(product.price)}</span>
                          <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart & Checkout */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Order</CardTitle>
                <CardDescription>
                  Select customer and review items
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Customer</Label>
                  <Combobox
                    options={customers}
                    value={selectedCustomer}
                    onValueChange={setSelectedCustomer}
                    placeholder="Select customer..."
                    className="w-full"
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No items in cart
                    </p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(item.product.price)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>VAT (5%):</span>
                        <span>{formatCurrency(vatAmount)}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span className="text-oud-600">{formatCurrency(total)}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-oud-600 hover:bg-oud-700"
                      onClick={processOrder}
                      disabled={cart.length === 0 || !selectedCustomer}
                    >
                      Process Payment
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Regular Sales Management */
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            <TabsTrigger value="products">Product Catalog</TabsTrigger>
            <TabsTrigger value="analytics">Sales Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Manage and track customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell className="font-medium text-oud-600">
                            {formatCurrency(order.total)}
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{order.paymentMethod}</TableCell>
                          <TableCell>{order.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Catalog</CardTitle>
                <CardDescription>
                  Manage product inventory and pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Card key={product.id}>
                      <CardContent className="p-4">
                        <div className="w-full h-32 bg-gradient-to-br from-oud-100 to-amber-100 rounded-md mb-4 flex items-center justify-center">
                          <Package className="h-12 w-12 text-oud-600" />
                        </div>
                        <h3 className="font-semibold mb-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-lg font-bold text-oud-600">
                            {formatCurrency(product.price)}
                          </span>
                          <Badge variant={product.stock > 10 ? 'secondary' : 'destructive'}>
                            Stock: {product.stock}
                          </Badge>
                        </div>
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => addToCart(product)}
                        >
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Trends</CardTitle>
                  <CardDescription>
                    Monthly sales performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-oud-50 to-amber-50 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-oud-600 mx-auto mb-2" />
                      <p className="text-muted-foreground">Sales chart visualization</p>
                      <p className="text-sm text-muted-foreground">(Chart component would go here)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>
                    Best performing products this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.slice(0, 5).map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-oud-100 rounded-full flex items-center justify-center text-sm font-medium text-oud-600">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{Math.floor(Math.random() * 20) + 5} sold</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(product.price * (Math.floor(Math.random() * 20) + 5))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}