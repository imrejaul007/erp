'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  Plus,
  Minus,
  Search,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Package,
  DollarSign,
  Calculator,
  FileText,
  Save,
  Send,
  Eye,
  AlertTriangle,
  CheckCircle,
  X,
  ShoppingCart,
  Truck,
  Plane,
  Ship,
  ClipboardList,
  CreditCard,
  Percent
} from 'lucide-react';
import { format } from 'date-fns';

const CreatePurchaseOrderPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [orderItems, setOrderItems] = useState([
    { id: 1, product: '', description: '', qty: 1, unit: 'pieces', unitPrice: 0, total: 0 }
  ]);
  const [showVendorDialog, setShowVendorDialog] = useState(false);
  const [currency, setCurrency] = useState('AED');
  const [shippingMethod, setShippingMethod] = useState('sea');
  const [paymentTerms, setPaymentTerms] = useState('net30');

  // Sample vendor data
  const vendors = [
    {
      id: 1,
      name: 'Al-Rashid Oud Suppliers',
      country: 'UAE',
      city: 'Dubai',
      rating: 4.8,
      email: 'orders@alrashidoud.ae',
      phone: '+971-4-123-4567',
      specialties: ['Premium Oud', 'Attar', 'Rose Oil'],
      paymentTerms: ['Net 30', 'Net 60', 'COD'],
      currency: ['AED', 'USD']
    },
    {
      id: 2,
      name: 'Taif Rose Company',
      country: 'Saudi Arabia',
      city: 'Taif',
      rating: 4.6,
      email: 'export@taifrose.sa',
      phone: '+966-12-987-6543',
      specialties: ['Taif Rose', 'Rose Water', 'Rose Oil'],
      paymentTerms: ['Net 45', 'LC', 'Wire Transfer'],
      currency: ['SAR', 'USD']
    },
    {
      id: 3,
      name: 'Cambodian Oud Direct',
      country: 'Cambodia',
      city: 'Phnom Penh',
      rating: 4.9,
      email: 'sales@cambodianoud.com',
      phone: '+855-23-456-789',
      specialties: ['Wild Oud', 'Plantation Oud', 'Oud Chips'],
      paymentTerms: ['Wire Transfer', 'LC'],
      currency: ['USD', 'KHR']
    },
    {
      id: 4,
      name: 'Mumbai Attar House',
      country: 'India',
      city: 'Mumbai',
      rating: 4.4,
      email: 'export@mumbaiattars.in',
      phone: '+91-22-1234-5678',
      specialties: ['Traditional Attars', 'Floral Oils', 'Musk'],
      paymentTerms: ['Net 30', 'Advance Payment'],
      currency: ['INR', 'USD']
    }
  ];

  // Sample products
  const products = [
    { id: 1, name: 'Premium Cambodian Oud Oil', category: 'Oud Oil', unit: 'ml' },
    { id: 2, name: 'Taif Rose Oil', category: 'Floral Oil', unit: 'ml' },
    { id: 3, name: 'Sandalwood Attar', category: 'Attar', unit: 'ml' },
    { id: 4, name: 'Oud Wood Chips Grade A', category: 'Oud Wood', unit: 'grams' },
    { id: 5, name: 'Rose Water Premium', category: 'Hydrosol', unit: 'liters' },
    { id: 6, name: 'White Musk Oil', category: 'Musk', unit: 'ml' }
  ];

  const updateOrderItem = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index][field] = value;

    // Calculate total for the item
    if (field === 'qty' || field === 'unitPrice') {
      updatedItems[index].total = updatedItems[index].qty * updatedItems[index].unitPrice;
    }

    setOrderItems(updatedItems);
  };

  const addOrderItem = () => {
    const newItem = {
      id: orderItems.length + 1,
      product: '',
      description: '',
      qty: 1,
      unit: 'pieces',
      unitPrice: 0,
      total: 0
    };
    setOrderItems([...orderItems, newItem]);
  };

  const removeOrderItem = (index) => {
    if (orderItems.length > 1) {
      const updatedItems = orderItems.filter((_, i) => i !== index);
      setOrderItems(updatedItems);
    }
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.05; // 5% UAE VAT
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const getShippingIcon = (method) => {
    switch (method) {
      case 'air': return <Plane className="h-4 w-4" />;
      case 'sea': return <Ship className="h-4 w-4" />;
      case 'land': return <Truck className="h-4 w-4" />;
      default: return <Truck className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Purchase Order</h1>
          <p className="text-gray-600">Create new purchase orders for international suppliers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Send Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="orderNumber">Purchase Order Number</Label>
                  <Input
                    id="orderNumber"
                    value="PO-2024-004"
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label>Order Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Vendor Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedVendor ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">No vendor selected</p>
                  <Dialog open={showVendorDialog} onOpenChange={setShowVendorDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Search className="h-4 w-4 mr-2" />
                        Select Vendor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Select Vendor</DialogTitle>
                        <DialogDescription>
                          Choose from your registered international suppliers
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Search className="h-4 w-4 text-gray-400" />
                          <Input placeholder="Search vendors..." className="flex-1" />
                        </div>
                        <div className="grid gap-4 max-h-96 overflow-y-auto">
                          {vendors.map((vendor) => (
                            <Card key={vendor.id} className="cursor-pointer hover:bg-gray-50" onClick={() => {
                              setSelectedVendor(vendor);
                              setShowVendorDialog(false);
                            }}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h3 className="font-medium">{vendor.name}</h3>
                                      <Badge variant="outline" className="text-xs">
                                        {vendor.rating} ⭐
                                      </Badge>
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {vendor.city}, {vendor.country}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        {vendor.email}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {vendor.phone}
                                      </div>
                                    </div>
                                    <div className="flex gap-1 mt-2">
                                      {vendor.specialties.slice(0, 3).map((specialty, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {specialty}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-lg">{selectedVendor.name}</h3>
                        <Badge variant="outline">
                          {selectedVendor.rating} ⭐
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedVendor(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{selectedVendor.city}, {selectedVendor.country}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{selectedVendor.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{selectedVendor.phone}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-gray-600">Specialties:</span>
                            <div className="flex gap-1 mt-1">
                              {selectedVendor.specialties.map((specialty, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Select
                            value={item.product}
                            onValueChange={(value) => updateOrderItem(index, 'product', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.name}>
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) => updateOrderItem(index, 'description', e.target.value)}
                            placeholder="Item description"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.qty}
                            onChange={(e) => updateOrderItem(index, 'qty', parseFloat(e.target.value) || 0)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.unit}
                            onValueChange={(value) => updateOrderItem(index, 'unit', value)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ml">ml</SelectItem>
                              <SelectItem value="grams">grams</SelectItem>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="liters">liters</SelectItem>
                              <SelectItem value="pieces">pieces</SelectItem>
                              <SelectItem value="bottles">bottles</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateOrderItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-28"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {currency} {item.total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOrderItem(index)}
                            disabled={orderItems.length === 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-between items-center">
                  <Button onClick={addOrderItem} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>

                  <div className="text-right space-y-2">
                    <div className="flex justify-between items-center min-w-64">
                      <span>Subtotal:</span>
                      <span className="font-medium">{currency} {calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>VAT (5%):</span>
                      <span className="font-medium">{currency} {calculateTax().toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span>{currency} {calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping & Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="shipping" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                  <TabsTrigger value="customs">Customs</TabsTrigger>
                </TabsList>

                <TabsContent value="shipping" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shippingMethod">Shipping Method</Label>
                      <Select value={shippingMethod} onValueChange={setShippingMethod}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sea">
                            <div className="flex items-center gap-2">
                              <Ship className="h-4 w-4" />
                              Sea Freight (15-30 days)
                            </div>
                          </SelectItem>
                          <SelectItem value="air">
                            <div className="flex items-center gap-2">
                              <Plane className="h-4 w-4" />
                              Air Freight (3-7 days)
                            </div>
                          </SelectItem>
                          <SelectItem value="land">
                            <div className="flex items-center gap-2">
                              <Truck className="h-4 w-4" />
                              Land Transport (5-14 days)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="incoterms">Incoterms</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select incoterms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fob">FOB - Free on Board</SelectItem>
                          <SelectItem value="cif">CIF - Cost, Insurance, Freight</SelectItem>
                          <SelectItem value="exw">EXW - Ex Works</SelectItem>
                          <SelectItem value="dap">DAP - Delivered at Place</SelectItem>
                          <SelectItem value="ddp">DDP - Delivered Duty Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                    <Textarea
                      id="deliveryAddress"
                      placeholder="Enter delivery address in UAE..."
                      defaultValue="Oud Palace Trading LLC&#10;Al Ras Area, Deira&#10;Dubai, UAE"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="payment" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="paymentTerms">Payment Terms</Label>
                      <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="advance">100% Advance Payment</SelectItem>
                          <SelectItem value="net30">Net 30 Days</SelectItem>
                          <SelectItem value="net45">Net 45 Days</SelectItem>
                          <SelectItem value="net60">Net 60 Days</SelectItem>
                          <SelectItem value="lc">Letter of Credit</SelectItem>
                          <SelectItem value="cod">Cash on Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wire">Wire Transfer</SelectItem>
                          <SelectItem value="lc">Letter of Credit</SelectItem>
                          <SelectItem value="cash">Cash Payment</SelectItem>
                          <SelectItem value="check">Company Check</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="customs" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hsCode">HS Code</Label>
                      <Input
                        id="hsCode"
                        placeholder="Enter HS code for customs"
                        defaultValue="3301.90"
                      />
                    </div>
                    <div>
                      <Label htmlFor="originCountry">Country of Origin</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ae">United Arab Emirates</SelectItem>
                          <SelectItem value="sa">Saudi Arabia</SelectItem>
                          <SelectItem value="kh">Cambodia</SelectItem>
                          <SelectItem value="in">India</SelectItem>
                          <SelectItem value="om">Oman</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customsNotes">Customs Documentation Notes</Label>
                    <Textarea
                      id="customsNotes"
                      placeholder="Special customs requirements or documentation notes..."
                      defaultValue="Requires Certificate of Origin and CITES permit for oud products. All perfume oils must have ingredient declaration for UAE customs."
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>{orderItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{currency} {calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (5%):</span>
                  <span>{currency} {calculateTax().toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{currency} {calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {getShippingIcon(shippingMethod)}
                  <span className="capitalize">{shippingMethod} shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CreditCard className="h-4 w-4" />
                  <span className="capitalize">{paymentTerms.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <ClipboardList className="h-4 w-4 mr-2" />
                Copy from Template
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Import from Excel
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Convert from Quote
              </Button>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Important Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>UAE import regulations require proper documentation for all perfume products</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>CITES permits required for natural oud imports</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>All orders are subject to Dubai Customs approval</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Payment confirmation required before shipment</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrderPage;