'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Factory,
  Users,
  User,
  Building,
  DollarSign,
  Store,
  Globe,
  UserCheck,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Truck,
  Heart,
  Gift,
  Target,
  Award,
  Shield,
  Bell,
  Mail,
  Phone,
  Printer,
  QrCode,
  Smartphone,
  Monitor,
  Tablet,
  Languages,
  Calculator,
  PieChart,
  TrendingUp,
  Filter,
  Search,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Edit,
  Plus,
  Minus,
  Save,
  X,
  Check,
  Archive,
  MessageSquare,
  Trash2,
  Copy,
  Share,
  Lock,
  Unlock,
  Key,
  Database,
  Cloud,
  TrendingDown,
  Wifi,
  WifiOff,
  Bluetooth,
  Usb,
  HardDrive,
  Cpu,
  Memory,
  Battery,
  Power,
  Sun,
  Moon,
  Star,
  Crown,
  Diamond,
  Gem,
  Sparkles,
  Zap,
  Lightning,
  Flame,
  Snowflake,
  Droplets,
  Wind,
  Mountain,
  Tree,
  Leaf,
  Flower,
  Coffee,
  Pizza,
  Apple,
  Banana,
  Cherry,
  Grape,
  Orange,
  Strawberry,
  Car,
  Bike,
  Bus,
  Train,
  Plane,
  Rocket,
  Ship,
  Anchor,
  Compass,
  Map,
  Navigation,
  Route,
  Flag,
  Bookmark,
  Tag,
  Tags,
  Hash,
  AtSign,
  Percent,
  AlarmClock,
  Timer,
  Stopwatch,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  CalendarMinus,
  CalendarClock,
  CalendarHeart,
  Briefcase,
  Suitcase,
  Backpack,
  ShoppingBag,
  Handbag,
  Wallet,
  CreditCard as PaymentCard,
  Banknote,
  Coins,
  Receipt,
  Invoice,
  FileSpreadsheet,
  FileBarChart,
  FilePieChart,
  FileLineChart,
  ChartArea,
  ChartBar,
  ChartColumn,
  ChartLine,
  ChartPie,
  ChartScatter,
  ChartSpline
} from 'lucide-react';

// Complete navigation structure for Perfume & Oud ERP + POS
const navigationStructure = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    url: '/dashboard',
    description: 'Main overview and KPIs',
    subPages: [
      { title: 'Overview', url: '/dashboard', icon: Eye, description: 'Sales, stock, profit, orders today' },
      { title: 'KPIs Dashboard', url: '/dashboard/kpis', icon: Target, description: 'Fast-moving items, low stock alerts, customer visits' },
      { title: 'Location Performance', url: '/dashboard/locations', icon: MapPin, description: 'Store vs store performance comparison' },
      { title: 'Quick Actions', url: '/dashboard/quick-actions', icon: Zap, description: 'Create invoice, add stock, start production shortcuts' },
      { title: 'Real-time Alerts', url: '/dashboard/alerts', icon: Bell, description: 'System notifications and critical alerts' },
      { title: 'Today\'s Summary', url: '/dashboard/today', icon: Calendar, description: 'Daily performance summary' }
    ]
  },
  {
    id: 'sales-pos',
    title: 'Sales & POS',
    icon: ShoppingCart,
    url: '/pos',
    description: 'Point of sale and sales management',
    subPages: [
      { title: 'POS Terminal', url: '/pos/terminal', icon: Monitor, description: 'Multi-language POS (English/Arabic)' },
      { title: 'New Sale', url: '/pos/new-sale', icon: Plus, description: 'Scan barcode, search product, create invoice' },
      { title: 'Customer Management', url: '/pos/customers', icon: Users, description: 'Add new customer, walk-in sales' },
      { title: 'Unit Conversion', url: '/pos/conversion', icon: Calculator, description: 'Grams ↔ tola ↔ ml converter' },
      { title: 'Discounts & Loyalty', url: '/pos/discounts', icon: Percent, description: 'Apply discounts and loyalty rewards' },
      { title: 'Payment Options', url: '/pos/payments', icon: CreditCard, description: 'Cash, card, digital payments' },
      { title: 'Invoice Management', url: '/pos/invoices', icon: FileText, description: 'Print/Email/WhatsApp invoices' },
      { title: 'Returns & Exchange', url: '/pos/returns', icon: RefreshCw, description: 'Process returns and exchanges' },
      { title: 'Hold & Resume', url: '/pos/hold', icon: Clock, description: 'Hold and resume transactions' },
      { title: 'Corporate Orders', url: '/pos/corporate', icon: Building, description: 'B2B and wholesale orders' },
      { title: 'Gift Cards', url: '/pos/gift-cards', icon: Gift, description: 'Issue and redeem gift cards' },
      { title: 'Sales Reports', url: '/pos/reports', icon: BarChart3, description: 'Daily, weekly, monthly sales reports' }
    ]
  },
  {
    id: 'inventory',
    title: 'Inventory Management',
    icon: Package,
    url: '/inventory',
    description: 'Stock management and control',
    subPages: [
      { title: 'Stock Dashboard', url: '/inventory/dashboard', icon: BarChart3, description: 'By location, by product overview' },
      { title: 'Product Catalog', url: '/inventory/products', icon: Package, description: 'Raw, semi-finished, finished goods' },
      { title: 'Add New Product', url: '/inventory/add-product', icon: Plus, description: 'Single product entry' },
      { title: 'Bulk Upload', url: '/inventory/bulk-upload', icon: Upload, description: 'Import products via CSV/Excel' },
      { title: 'Stock Adjustments', url: '/inventory/adjustments', icon: Edit, description: 'Manual stock corrections' },
      { title: 'Unit Conversion Setup', url: '/inventory/units', icon: Calculator, description: 'Configure measurement units' },
      { title: 'Stock Transfers', url: '/inventory/transfers', icon: Truck, description: 'Inter-store transfers' },
      { title: 'Low Stock Alerts', url: '/inventory/alerts', icon: Bell, description: 'Reorder notifications' },
      { title: 'Expiry Tracking', url: '/inventory/expiry', icon: Calendar, description: 'Shelf life monitoring' },
      { title: 'Price Management', url: '/inventory/pricing', icon: DollarSign, description: 'Retail, wholesale, VIP pricing' },
      { title: 'Barcode Management', url: '/inventory/barcodes', icon: QrCode, description: 'Generate and manage barcodes' },
      { title: 'Import Costs', url: '/inventory/import-costs', icon: Plane, description: 'Track import and duty costs' },
      { title: 'Comprehensive View', url: '/inventory/comprehensive', icon: Eye, description: 'Advanced inventory dashboard' }
    ]
  },
  {
    id: 'production',
    title: 'Production Management',
    icon: Factory,
    url: '/production',
    description: 'Manufacturing and batch management',
    subPages: [
      { title: 'Production Dashboard', url: '/production/dashboard', icon: BarChart3, description: 'Production overview and metrics' },
      { title: 'Recipe Management', url: '/production/recipes', icon: FileText, description: 'Formula and recipe database' },
      { title: 'Create New Batch', url: '/production/new-batch', icon: Plus, description: 'Start new production batch' },
      { title: 'Raw Materials', url: '/production/raw-materials', icon: Package, description: 'Manage raw material inventory' },
      { title: 'Semi-finished Goods', url: '/production/semi-finished', icon: Factory, description: 'Work-in-progress tracking' },
      { title: 'Finished Products', url: '/production/finished', icon: Check, description: 'Completed product management' },
      { title: 'Wastage Tracking', url: '/production/wastage', icon: Trash2, description: 'Track and minimize waste' },
      { title: 'Quality Control', url: '/production/quality', icon: Award, description: 'Batch quality assurance' },
      { title: 'Yield Reports', url: '/production/yield', icon: TrendingUp, description: 'Production efficiency analysis' },
      { title: 'Production Schedule', url: '/production/schedule', icon: Calendar, description: 'Plan and schedule production' },
      { title: 'Equipment Management', url: '/production/equipment', icon: Settings, description: 'Production equipment tracking' },
      { title: 'Management View', url: '/production/management', icon: Eye, description: 'Advanced production management' }
    ]
  },
  {
    id: 'crm',
    title: 'Customer Management (CRM)',
    icon: Users,
    url: '/crm',
    description: 'Customer relationship management',
    subPages: [
      { title: 'Customer Directory', url: '/crm/directory', icon: Users, description: 'Search by name, mobile, nationality' },
      { title: 'Customer Profiles', url: '/crm/profiles', icon: User, description: 'Walk-in vs registered customers' },
      { title: 'Loyalty & Rewards', url: '/crm/loyalty', icon: Heart, description: 'Points and rewards tracking' },
      { title: 'Purchase History', url: '/crm/history', icon: Clock, description: 'Customer transaction history' },
      { title: 'Customer Segmentation', url: '/crm/segmentation', icon: Target, description: 'VIP, Regular, Tourist categories' },
      { title: 'Corporate Clients', url: '/crm/corporate', icon: Building, description: 'B2B and wholesale management' },
      { title: 'Feedback Management', url: '/crm/feedback', icon: MessageSquare, description: 'Reviews and complaints log' },
      { title: 'Marketing Campaigns', url: '/crm/campaigns', icon: Mail, description: 'SMS, Email, WhatsApp promotions' },
      { title: 'Customer Analytics', url: '/crm/analytics', icon: BarChart3, description: 'Customer behavior insights' },
      { title: 'Communication Log', url: '/crm/communications', icon: Phone, description: 'All customer interactions' },
      { title: 'Comprehensive CRM', url: '/crm/comprehensive', icon: Eye, description: 'Advanced CRM dashboard' }
    ]
  },
  {
    id: 'purchasing',
    title: 'Purchasing & Vendors',
    icon: Building,
    url: '/purchasing',
    description: 'Supplier and procurement management',
    subPages: [
      { title: 'Vendor Directory', url: '/purchasing/vendors', icon: Building, description: 'Suppliers and manufacturers database' },
      { title: 'Purchase Orders', url: '/purchasing/orders', icon: FileText, description: 'Create and manage POs' },
      { title: 'Import Tracking', url: '/purchasing/imports', icon: Plane, description: 'Shipment, customs, duty tracking' },
      { title: 'Supplier Invoices', url: '/purchasing/invoices', icon: Receipt, description: 'Vendor bill management' },
      { title: 'Payments', url: '/purchasing/payments', icon: CreditCard, description: 'Supplier payment tracking' },
      { title: 'Performance Reports', url: '/purchasing/performance', icon: BarChart3, description: 'Vendor performance analysis' },
      { title: 'Multi-Currency', url: '/purchasing/currency', icon: DollarSign, description: 'Foreign exchange management' },
      { title: 'Contracts', url: '/purchasing/contracts', icon: FileText, description: 'Supplier agreement management' },
      { title: 'Quality Assessment', url: '/purchasing/quality', icon: Award, description: 'Supplier quality ratings' },
      { title: 'Cost Analysis', url: '/purchasing/cost-analysis', icon: Calculator, description: 'Procurement cost breakdown' },
      { title: 'Vendor Management', url: '/purchasing/vendor-management', icon: Eye, description: 'Advanced vendor management' }
    ]
  },
  {
    id: 'finance',
    title: 'Finance & Accounting',
    icon: DollarSign,
    url: '/finance',
    description: 'Financial management and compliance',
    subPages: [
      { title: 'Financial Dashboard', url: '/finance/dashboard', icon: BarChart3, description: 'Sales, expenses, profit overview' },
      { title: 'General Ledger', url: '/finance/ledger', icon: FileText, description: 'Chart of accounts management' },
      { title: 'Accounts Receivable', url: '/finance/receivables', icon: TrendingUp, description: 'Customer payment tracking' },
      { title: 'Accounts Payable', url: '/finance/payables', icon: TrendingDown, description: 'Vendor bill management' },
      { title: 'Multi-Currency Ledger', url: '/finance/multi-currency', icon: DollarSign, description: 'Foreign currency accounting' },
      { title: 'Bank Reconciliation', url: '/finance/bank-reconciliation', icon: Building, description: 'Match bank statements' },
      { title: 'UAE VAT Compliance', url: '/finance/vat', icon: Percent, description: '5% VAT calculations and filing' },
      { title: 'Tax Reports', url: '/finance/tax-reports', icon: FileText, description: 'FTA ready tax reports' },
      { title: 'P&L Statement', url: '/finance/profit-loss', icon: TrendingUp, description: 'Profit and loss reporting' },
      { title: 'Balance Sheet', url: '/finance/balance-sheet', icon: Scale, description: 'Financial position statement' },
      { title: 'Cash Flow', url: '/finance/cash-flow', icon: Droplets, description: 'Cash flow analysis' },
      { title: 'Petty Cash', url: '/finance/petty-cash', icon: Wallet, description: 'Small expense management' },
      { title: 'Budgeting', url: '/finance/budgeting', icon: Target, description: 'Budget planning and tracking' },
      { title: 'Cost Centers', url: '/finance/cost-centers', icon: Building, description: 'Department cost allocation' },
      { title: 'Accounting Module', url: '/finance/accounting', icon: Eye, description: 'Comprehensive accounting view' }
    ]
  },
  {
    id: 'multi-location',
    title: 'Multi-Location Management',
    icon: Store,
    url: '/multi-location',
    description: 'Multi-store operations management',
    subPages: [
      { title: 'Store Dashboard', url: '/multi-location/dashboard', icon: BarChart3, description: 'Sales, inventory, staff per store' },
      { title: 'Location Pricing', url: '/multi-location/pricing', icon: DollarSign, description: 'Store-specific pricing rules' },
      { title: 'Transfer Requests', url: '/multi-location/transfers', icon: Truck, description: 'Inter-store inventory transfers' },
      { title: 'Centralized Control', url: '/multi-location/control', icon: Settings, description: 'Central management console' },
      { title: 'Store Promotions', url: '/multi-location/promotions', icon: Gift, description: 'Location-specific campaigns' },
      { title: 'Performance Analytics', url: '/multi-location/analytics', icon: BarChart3, description: 'Store comparison and KPIs' },
      { title: 'Staff Allocation', url: '/multi-location/staff', icon: Users, description: 'Staff assignment across stores' },
      { title: 'Inventory Distribution', url: '/multi-location/distribution', icon: Package, description: 'Stock allocation strategies' },
      { title: 'Store Configuration', url: '/multi-location/configuration', icon: Settings, description: 'Individual store settings' },
      { title: 'Regional Management', url: '/multi-location/regions', icon: MapPin, description: 'Geographical area management' },
      { title: 'Management System', url: '/multi-location/management', icon: Eye, description: 'Advanced multi-location view' }
    ]
  },
  {
    id: 'ecommerce',
    title: 'E-commerce & Omni-channel',
    icon: Globe,
    url: '/ecommerce',
    description: 'Online sales and channel integration',
    subPages: [
      { title: 'Online Store Integration', url: '/ecommerce/integration', icon: Globe, description: 'Website and app connectivity' },
      { title: 'Product Sync', url: '/ecommerce/sync', icon: RefreshCw, description: 'ERP ↔ Online store synchronization' },
      { title: 'Click & Collect', url: '/ecommerce/click-collect', icon: ShoppingCart, description: 'Online order, store pickup' },
      { title: 'Marketplace Integration', url: '/ecommerce/marketplaces', icon: Store, description: 'Amazon.ae, Noon connections' },
      { title: 'Customer Portal', url: '/ecommerce/portal', icon: Users, description: 'Customer account management' },
      { title: 'Online Payments', url: '/ecommerce/payments', icon: CreditCard, description: 'Payment gateway integration' },
      { title: 'Order Management', url: '/ecommerce/orders', icon: Package, description: 'Online order processing' },
      { title: 'Channel Analytics', url: '/ecommerce/analytics', icon: BarChart3, description: 'Multi-channel performance' },
      { title: 'Social Commerce', url: '/ecommerce/social', icon: Heart, description: 'Instagram, Facebook shop integration' },
      { title: 'WhatsApp Business', url: '/ecommerce/whatsapp', icon: Phone, description: 'WhatsApp catalog and ordering' },
      { title: 'Omni-channel View', url: '/ecommerce/omnichannel', icon: Eye, description: 'Unified channel management' }
    ]
  },
  {
    id: 'hr',
    title: 'HR & Staff Management',
    icon: UserCheck,
    url: '/hr',
    description: 'Human resources and staff management',
    subPages: [
      { title: 'Employee Directory', url: '/hr/directory', icon: Users, description: 'Staff database and profiles' },
      { title: 'Attendance Tracking', url: '/hr/attendance', icon: Clock, description: 'Time tracking and schedules' },
      { title: 'Role-Based Access', url: '/hr/roles', icon: Shield, description: 'User permissions and security' },
      { title: 'Payroll Management', url: '/hr/payroll', icon: DollarSign, description: 'Salary and wage processing' },
      { title: 'Commission Tracking', url: '/hr/commissions', icon: TrendingUp, description: 'Sales performance incentives' },
      { title: 'Performance Reports', url: '/hr/performance', icon: BarChart3, description: 'Employee KPI tracking' },
      { title: 'Training & Development', url: '/hr/training', icon: BookOpen, description: 'Staff skill development' },
      { title: 'Leave Management', url: '/hr/leave', icon: Calendar, description: 'Vacation and sick leave tracking' },
      { title: 'Employee Benefits', url: '/hr/benefits', icon: Heart, description: 'Insurance and benefit management' },
      { title: 'Recruitment', url: '/hr/recruitment', icon: UserPlus, description: 'Hiring and onboarding process' },
      { title: 'Staff Management', url: '/hr/staff-management', icon: Eye, description: 'Comprehensive HR dashboard' }
    ]
  },
  {
    id: 'reports',
    title: 'Reports & Analytics',
    icon: BarChart3,
    url: '/reports',
    description: 'Business intelligence and reporting',
    subPages: [
      { title: 'Sales Reports', url: '/reports/sales', icon: TrendingUp, description: 'Daily, monthly, seasonal sales' },
      { title: 'Inventory Valuation', url: '/reports/inventory-valuation', icon: Package, description: 'Stock value analysis' },
      { title: 'Stock Movement', url: '/reports/stock-movement', icon: Truck, description: 'Inventory flow tracking' },
      { title: 'Wastage Reports', url: '/reports/wastage', icon: Trash2, description: 'Loss and waste analysis' },
      { title: 'Profit Margins', url: '/reports/margins', icon: Percent, description: 'Product and store profitability' },
      { title: 'Customer Insights', url: '/reports/customer-insights', icon: Users, description: 'Customer behavior analytics' },
      { title: 'Forecasting', url: '/reports/forecasting', icon: TrendingUp, description: 'Demand planning and predictions' },
      { title: 'Financial Reports', url: '/reports/financial', icon: DollarSign, description: 'Comprehensive financial analysis' },
      { title: 'Operational Reports', url: '/reports/operational', icon: Settings, description: 'Process efficiency metrics' },
      { title: 'Custom Reports', url: '/reports/custom', icon: FileText, description: 'Build your own reports' },
      { title: 'Executive Dashboard', url: '/reports/executive', icon: Crown, description: 'C-level decision support' },
      { title: 'Analytics Dashboard', url: '/reports/analytics', icon: Eye, description: 'Advanced analytics view' }
    ]
  },
  {
    id: 'perfume-oud',
    title: 'Perfume & Oud Specialist',
    icon: Gem,
    url: '/perfume',
    description: 'Specialized features for perfume & oud business',
    subPages: [
      { title: 'Product Grading', url: '/perfume/grading', icon: Star, description: 'Quality assessment and classification' },
      { title: 'Distillation Tracking', url: '/perfume/distillation', icon: Droplets, description: 'Traditional distillation process monitoring' },
      { title: 'Aging Management', url: '/perfume/aging', icon: Clock, description: 'Product maturation tracking' },
      { title: 'Cultural Integration', url: '/perfume/cultural', icon: Heart, description: 'UAE cultural occasions and traditions' },
      { title: 'Seasonal Recommendations', url: '/perfume/seasonal', icon: Sun, description: 'Climate-specific product suggestions' },
      { title: 'Aromatherapy Benefits', url: '/perfume/aromatherapy', icon: Leaf, description: 'Therapeutic properties database' },
      { title: 'Heritage Documentation', url: '/perfume/heritage', icon: Crown, description: 'Traditional methods preservation' },
      { title: 'Master Distillers', url: '/perfume/distillers', icon: Award, description: 'Craftsman profiles and expertise' },
      { title: 'Origin Tracking', url: '/perfume/origins', icon: MapPin, description: 'Source material provenance' },
      { title: 'Certification Management', url: '/perfume/certifications', icon: Shield, description: 'Quality and authenticity certificates' },
      { title: 'Oud Features', url: '/perfume/oud-features', icon: Eye, description: 'Comprehensive oud management' }
    ]
  },
  {
    id: 'settings',
    title: 'Settings & Administration',
    icon: Settings,
    url: '/settings',
    description: 'System configuration and administration',
    subPages: [
      { title: 'Company Profile', url: '/settings/company', icon: Building, description: 'Business information and branding' },
      { title: 'Tax Settings', url: '/settings/tax', icon: Percent, description: 'VAT rules and tax configuration' },
      { title: 'User Management', url: '/settings/users', icon: Users, description: 'User accounts and permissions' },
      { title: 'Role Permissions', url: '/settings/permissions', icon: Shield, description: 'Access control matrix' },
      { title: 'Language Preferences', url: '/settings/language', icon: Languages, description: 'English/Arabic interface' },
      { title: 'Currency Setup', url: '/settings/currency', icon: DollarSign, description: 'Multi-currency configuration' },
      { title: 'Unit Conversion', url: '/settings/units', icon: Calculator, description: 'Measurement unit definitions' },
      { title: 'Loyalty Program', url: '/settings/loyalty', icon: Heart, description: 'Rewards program configuration' },
      { title: 'Integration Settings', url: '/settings/integrations', icon: Link, description: 'API and external service setup' },
      { title: 'Payment Gateways', url: '/settings/payment-gateways', icon: CreditCard, description: 'Payment processor configuration' },
      { title: 'SMS/WhatsApp APIs', url: '/settings/communication', icon: Phone, description: 'Communication service setup' },
      { title: 'Backup & Security', url: '/settings/security', icon: Shield, description: 'Data protection and backup' },
      { title: 'System Preferences', url: '/settings/system', icon: Settings, description: 'General system configuration' },
      { title: 'Audit Logs', url: '/settings/audit', icon: FileText, description: 'System activity tracking' },
      { title: 'Database Management', url: '/settings/database', icon: Database, description: 'Data maintenance and optimization' }
    ]
  }
];

const SitemapNavigationStructure = () => {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const totalPages = navigationStructure.reduce((total, module) => total + module.subPages.length + 1, 0);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          🗂️ Perfume & Oud ERP + POS
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700">
          Complete Sitemap & Navigation Structure
        </h2>
        <div className="flex justify-center gap-4">
          <Badge variant="outline" className="text-lg py-2 px-4">
            {navigationStructure.length} Main Modules
          </Badge>
          <Badge variant="outline" className="text-lg py-2 px-4">
            {totalPages} Total Pages
          </Badge>
          <Badge variant="outline" className="text-lg py-2 px-4">
            UAE Localized
          </Badge>
        </div>
        <p className="text-gray-600 max-w-4xl mx-auto">
          Comprehensive modular dashboard system with navigation for HQ, stores, finance, production, and CRM.
          Fully localized for UAE market with Arabic support, cultural integration, and VAT compliance.
        </p>
      </div>

      {/* Navigation Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            🌍 Main Navigation (Top Level Modules)
          </CardTitle>
          <CardDescription>
            Primary navigation structure accessible from the main dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {navigationStructure.map((module) => (
              <div key={module.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                <module.icon className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-sm">{module.title}</div>
                  <div className="text-xs text-gray-500">{module.subPages.length} pages</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Module Structure */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">📌 Detailed Pages & Sub-Pages</h2>

        {navigationStructure.map((module, index) => (
          <Card key={module.id} className="overflow-hidden">
            <Collapsible>
              <CollapsibleTrigger
                className="w-full"
                onClick={() => toggleModule(module.id)}
              >
                <CardHeader className="hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                      <module.icon className="h-6 w-6 text-blue-600" />
                      <div className="text-left">
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {module.subPages.length} pages
                      </Badge>
                      {expandedModules.includes(module.id) ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Main Module Page */}
                    <div className="flex items-start gap-3 p-3 border rounded-lg bg-blue-50 border-blue-200">
                      <module.icon className="h-5 w-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-blue-900">
                          {module.title} (Main)
                        </div>
                        <div className="text-xs text-blue-700">
                          {module.description}
                        </div>
                        <div className="text-xs text-blue-600 mt-1 font-mono">
                          {module.url}
                        </div>
                      </div>
                    </div>

                    {/* Sub Pages */}
                    {module.subPages.map((subPage) => (
                      <div key={subPage.url} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                        <subPage.icon className="h-4 w-4 text-gray-600 mt-1" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{subPage.title}</div>
                          <div className="text-xs text-gray-600">{subPage.description}</div>
                          <div className="text-xs text-gray-500 mt-1 font-mono">
                            {subPage.url}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* System Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>📊 System Overview & Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{navigationStructure.length}</div>
              <div className="text-sm text-gray-600">Main Modules</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {navigationStructure.reduce((total, module) => total + module.subPages.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Sub-Pages</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{totalPages}</div>
              <div className="text-sm text-gray-600">Total Functional Pages</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-gray-600">UAE Localized</div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h4 className="font-semibold">✅ Key Features & Capabilities:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Bilingual Interface (English/Arabic)</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm">UAE VAT Compliance (5%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Multi-Unit Conversion (grams ↔ tola ↔ ml)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Multi-Location Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Omni-Channel Integration</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Gem className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Specialized Perfume & Oud Features</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-green-600" />
                  <span className="text-sm">UAE Cultural Integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Premium Product Grading System</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Traditional Distillation Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Advanced Analytics & Reporting</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">🎯 Navigation Architecture:</h4>
            <p className="text-sm text-gray-700">
              The navigation will be implemented as a <strong>modular left-side menu</strong> with collapsible sub-sections,
              responsive design for mobile/tablet access, role-based visibility, and quick-action shortcuts.
              Each module maintains its own sub-navigation with breadcrumb trails for easy navigation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SitemapNavigationStructure;