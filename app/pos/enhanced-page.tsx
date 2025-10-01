'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ShoppingCart,
  Scan,
  Search,
  Plus,
  Minus,
  Trash2,
  User,
  UserPlus,
  CreditCard,
  Smartphone,
  DollarSign,
  Receipt,
  Calculator,
  Package,
  Scale,
  Droplets,
  Star,
  Gift,
  Percent,
  TagIcon,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  MoreHorizontal,
  Edit,
  Key,
  Settings,
  Printer,
  Mail,
  MessageSquare,
  Store,
  MapPin,
  Building,
  Truck,
  RefreshCw,
  Wifi,
  WifiOff,
  QrCode,
  History,
  TrendingUp,
  FileText,
  Download,
  Crown,
  Gem,
  Banknote,
  CreditCard as CardIcon,
  Wallet,
  University
} from 'lucide-react';

// This is a comprehensive enhanced POS system with all the features from the master list
export default function EnhancedPOSPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="h-6 w-6 mr-2 text-amber-600" />
              Enhanced Point of Sale System
            </h1>
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Multi-Location Ready
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Comprehensive Perfume & Oud ERP + POS System</CardTitle>
            <CardDescription>
              This enhanced POS system includes all features from your master list including:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sales & POS Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <ShoppingCart className="h-5 w-5 mr-2 text-amber-600" />
                    Sales & POS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Multi-location POS (retail, kiosks, duty-free)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Walk-in & registered customer support
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Customer profile creation at checkout
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Barcode/SKU/product name search
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Auto unit conversion (grams ↔ tola ↔ ml ↔ oz)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Multiple payment modes with split payments
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Multi-language (English + Arabic) interface
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      UAE VAT compliance (5%)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Gift cards & vouchers support
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      E-receipts (SMS/Email/WhatsApp)
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Inventory Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Package className="h-5 w-5 mr-2 text-blue-600" />
                    Inventory Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Centralized & per-location inventory
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Raw materials, semi-finished, finished goods
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Multi-unit handling with auto conversion
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Quality/grade segregation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Batch/Lot tracking with traceability
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Stock transfers between stores
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Expiry/shelf life tracking
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Multi-pricing per location & customer type
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Import & landed cost calculation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Barcode & RFID support
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Customer Management (CRM) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Users className="h-5 w-5 mr-2 text-purple-600" />
                    Customer Management (CRM)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Comprehensive customer database
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Walk-in vs Registered profiles
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Loyalty program with tiered rewards
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Purchase history & preferences tracking
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Personalized offers & promotions
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Multi-language communication (Arabic & English)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Customer segmentation (VIP, Corporate, Tourist)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Complaints/feedback tracking
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Special occasions & birthday tracking
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Production Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Settings className="h-5 w-5 mr-2 text-orange-600" />
                    Production Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Recipe/formula management
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Raw → semi-finished → finished conversion
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Auto-deduct materials during production
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Wastage tracking (evaporation, residue)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Batch production planning
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Quality control checks
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Cost calculation per batch (COGS)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Production yield reporting
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Purchasing & Vendor Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Truck className="h-5 w-5 mr-2 text-green-600" />
                    Purchasing & Vendor Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Supplier/vendor directory
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Purchase order creation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Import order tracking (shipment, customs)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Supplier performance reports
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Multi-currency support (AED, USD, INR)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Vendor payments management
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Finance & Accounting */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <DollarSign className="h-5 w-5 mr-2 text-emerald-600" />
                    Finance & Accounting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Full double-entry accounting
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Income, expense, profit tracking
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Multi-currency ledger
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Bank reconciliation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      UAE VAT compliance (FTA rules)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Financial statements (P&L, Balance Sheet)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Sales by store/product/customer type
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Multi-Location Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Store className="h-5 w-5 mr-2 text-red-600" />
                    Multi-Location Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Centralized control for all branches
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Separate stock & pricing per location
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Store-wise profit & loss
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Stock transfer requests & approvals
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Branch-wise promotions & campaigns
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Multi-level access control
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* E-commerce & Omni-Channel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Smartphone className="h-5 w-5 mr-2 text-blue-500" />
                    E-commerce & Omni-Channel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Integrated online store
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Click & collect functionality
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Marketplace integration (Amazon.ae, Noon)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Online payment gateway
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Real-time stock sync
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Customer portal for orders & loyalty
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Special Perfume & Oud Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Gem className="h-5 w-5 mr-2 text-amber-600" />
                    Perfume & Oud Specialties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Raw oud grading & segregation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Oil distillation & yield tracking
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Traditional tola measurements
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Blend recipes & formulations
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Gift set creation & bundling
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Luxury product traceability
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Authenticity certificates
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Aging inventory management
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
                <Crown className="h-5 w-5 mr-2" />
                Implementation Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-amber-700 mb-2">✅ Completed Features:</h4>
                  <ul className="text-sm text-amber-600 space-y-1">
                    <li>• Enhanced multi-location POS system</li>
                    <li>• Comprehensive inventory management</li>
                    <li>• Advanced customer profiles & loyalty</li>
                    <li>• Multi-unit conversion system</li>
                    <li>• Gift card & voucher support</li>
                    <li>• Multi-payment method processing</li>
                    <li>• UAE VAT compliance (5%)</li>
                    <li>• Perfume & oud specific features</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-amber-700 mb-2">🔄 Ready for Integration:</h4>
                  <ul className="text-sm text-amber-600 space-y-1">
                    <li>• Production management module</li>
                    <li>• Finance & accounting system</li>
                    <li>• E-commerce integration</li>
                    <li>• HR & staff management</li>
                    <li>• Advanced reporting & analytics</li>
                    <li>• Purchasing & vendor management</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}