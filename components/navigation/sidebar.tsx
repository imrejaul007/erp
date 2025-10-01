'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  Home,
  CreditCard,
  Package,
  Beaker,
  Users,
  ShoppingCart,
  DollarSign,
  Building2,
  Globe,
  UserCheck,
  BarChart3,
  Settings,
  // Sales & POS Icons
  Monitor,
  UserPlus,
  Gift,
  RefreshCw,
  Receipt,
  // Inventory Icons
  Archive,
  Tags,
  ArrowRightLeft,
  Calendar,
  Barcode,
  // Production Icons
  Beaker as Flask,
  Plus,
  Crown,
  ClipboardCheck,
  Clock,
  TrendingUp,
  // CRM Icons
  Heart,
  History,
  MessageSquare,
  Send,
  // Purchasing Icons
  Truck,
  FileText,
  CreditCard as PaymentIcon,
  Award,
  // Finance Icons
  Calculator,
  BookOpen,
  Banknote,
  PiggyBank,
  FileSpreadsheet,
  // Multi-location Icons
  Store,
  MapPin,
  Activity,
  // E-commerce Icons
  ShoppingBag,
  Smartphone,
  Package2,
  // HR Icons
  CalendarClock,
  Shield,
  Wallet,
  Trophy,
  // Reports Icons
  PieChart,
  TrendingDown,
  Target,
  // Settings Icons
  Building,
  Percent,
  Lock,
  Languages,
  Coins,
  Zap,
  Database,
  // Additional Icons
  PlusCircle as Plus,
  Star as Crown
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  arabicLabel?: string;
  icon: any;
  href?: string;
  children?: NavigationItem[];
  roles?: string[];
}

const navigationStructure: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    arabicLabel: 'لوحة التحكم',
    icon: Home,
    href: '/dashboard',
    children: [
      { id: 'overview', label: 'Overview', icon: Home, href: '/dashboard' },
      { id: 'kpis', label: 'KPIs & Alerts', icon: Activity, href: '/dashboard/kpis' },
      { id: 'quick-actions', label: 'Quick Actions', icon: Zap, href: '/dashboard/quick-actions' }
    ]
  },
  {
    id: 'sales-pos',
    label: 'Sales & POS',
    arabicLabel: 'المبيعات ونقاط البيع',
    icon: CreditCard,
    children: [
      {
        id: 'pos-terminal',
        label: 'POS Terminal',
        icon: Monitor,
        href: '/pos/terminal',
        children: [
          { id: 'new-sale', label: 'New Sale', icon: CreditCard, href: '/pos/terminal' },
          { id: 'walk-in', label: 'Add Walk-in Customer', icon: UserPlus, href: '/pos/walk-in' },
          { id: 'new-customer', label: 'Add New Customer', icon: UserPlus, href: '/pos/new-customer' },
          { id: 'discount', label: 'Apply Discount / Loyalty', icon: Gift, href: '/pos/discount' },
          { id: 'multi-payment', label: 'Multi-Payment Options', icon: PaymentIcon, href: '/pos/payments' },
          { id: 'unit-conversion', label: 'Unit Conversion', icon: RefreshCw, href: '/pos/units' },
          { id: 'hold-bill', label: 'Hold / Resume Bill', icon: Clock, href: '/pos/hold' }
        ]
      },
      {
        id: 'sales-orders',
        label: 'Sales Orders',
        icon: Receipt,
        children: [
          { id: 'retail', label: 'Retail Orders', icon: ShoppingBag, href: '/sales/retail' },
          { id: 'wholesale', label: 'Wholesale Orders', icon: Package2, href: '/sales/wholesale' },
          { id: 'corporate', label: 'Corporate Orders', icon: Building, href: '/sales/corporate' }
        ]
      },
      { id: 'returns', label: 'Returns & Exchanges', icon: RefreshCw, href: '/sales/returns' },
      { id: 'gift-cards', label: 'Gift Cards & Vouchers', icon: Gift, href: '/sales/gift-cards' },
      { id: 'daily-closing', label: 'Daily Sales Closing', icon: Receipt, href: '/sales/closing' }
    ]
  },
  {
    id: 'inventory',
    label: 'Inventory Management',
    arabicLabel: 'إدارة المخزون',
    icon: Package,
    href: '/inventory',
    children: [
      { id: 'stock-dashboard', label: 'Stock Dashboard', icon: Archive, href: '/inventory' },
      {
        id: 'products',
        label: 'Products & Categories',
        icon: Tags,
        children: [
          { id: 'raw-materials', label: 'Raw Materials', icon: Beaker, href: '/inventory/raw-materials' },
          { id: 'semi-finished', label: 'Semi-Finished Goods', icon: Flask, href: '/inventory/semi-finished' },
          { id: 'finished-goods', label: 'Finished Goods', icon: Package, href: '/inventory/finished-goods' },
          { id: 'add-products', label: 'Add / Import Products', icon: Plus, href: '/inventory/add-products' }
        ]
      },
      {
        id: 'stock-ops',
        label: 'Stock Operations',
        icon: ArrowRightLeft,
        children: [
          { id: 'adjustments', label: 'Stock Adjustments', icon: RefreshCw, href: '/inventory/adjustments' },
          { id: 'bulk-order', label: 'Bulk Order Entry', icon: Package2, href: '/inventory/bulk-order' },
          { id: 'transfers', label: 'Stock Transfers', icon: ArrowRightLeft, href: '/inventory/transfers' }
        ]
      },
      { id: 'expiry', label: 'Expiry & Shelf Life', icon: Calendar, href: '/inventory/expiry' },
      {
        id: 'pricing',
        label: 'Pricing Management',
        icon: DollarSign,
        children: [
          { id: 'retail-price', label: 'Retail Price', icon: Tags, href: '/inventory/pricing/retail' },
          { id: 'wholesale-price', label: 'Wholesale Price', icon: Package2, href: '/inventory/pricing/wholesale' },
          { id: 'vip-price', label: 'VIP Price', icon: Crown, href: '/inventory/pricing/vip' },
          { id: 'location-price', label: 'Location-Based Price', icon: MapPin, href: '/inventory/pricing/location' }
        ]
      },
      { id: 'unit-setup', label: 'Unit Conversion Setup', icon: RefreshCw, href: '/inventory/units' },
      { id: 'barcode', label: 'Barcode / RFID Setup', icon: Barcode, href: '/inventory/barcode' }
    ]
  },
  {
    id: 'production',
    label: 'Production Management',
    arabicLabel: 'إدارة الإنتاج',
    icon: Beaker,
    href: '/production',
    children: [
      { id: 'recipes', label: 'Recipes / Formulas', icon: Flask, href: '/production/recipes' },
      {
        id: 'batch',
        label: 'Create Batch',
        icon: Beaker,
        children: [
          { id: 'assign-materials', label: 'Assign Raw Materials', icon: Package, href: '/production/batch/materials' },
          { id: 'wastage', label: 'Wastage Tracking', icon: TrendingDown, href: '/production/batch/wastage' }
        ]
      },
      { id: 'qc', label: 'Batch QC (Quality Control)', icon: ClipboardCheck, href: '/production/quality-control' },
      { id: 'scheduling', label: 'Production Scheduling', icon: Clock, href: '/production/scheduling' },
      { id: 'yield-report', label: 'Yield & Cost Report', icon: TrendingUp, href: '/production/yield-report' }
    ]
  },
  {
    id: 'crm',
    label: 'Customer Management (CRM)',
    arabicLabel: 'إدارة العملاء',
    icon: Users,
    href: '/crm',
    children: [
      { id: 'directory', label: 'Customer Directory', icon: Users, href: '/crm' },
      { id: 'add-customer', label: 'Add Customer', icon: UserPlus, href: '/crm/add-customer' },
      { id: 'loyalty', label: 'Loyalty & Rewards', icon: Heart, href: '/crm/loyalty-program' },
      { id: 'history', label: 'Purchase History', icon: History, href: '/crm/purchase-history' },
      {
        id: 'segments',
        label: 'Customer Segments',
        icon: Users,
        children: [
          { id: 'vip', label: 'VIP Customers', icon: Crown, href: '/crm/segments/vip' },
          { id: 'regular', label: 'Regular Customers', icon: Users, href: '/crm/segments/regular' },
          { id: 'tourist', label: 'Tourist Customers', icon: Globe, href: '/crm/segments/tourist' }
        ]
      },
      { id: 'corporate', label: 'Corporate Clients', icon: Building, href: '/crm/corporate' },
      { id: 'complaints', label: 'Complaints & Feedback', icon: MessageSquare, href: '/crm/complaints' },
      { id: 'campaigns', label: 'Promotions & Campaigns', icon: Send, href: '/crm/campaigns' }
    ]
  },
  {
    id: 'purchasing',
    label: 'Purchasing & Vendors',
    arabicLabel: 'المشتريات والموردين',
    icon: ShoppingCart,
    href: '/purchasing',
    children: [
      { id: 'vendors', label: 'Vendor Directory', icon: Building2, href: '/purchasing' },
      { id: 'create-po', label: 'Create Purchase Order', icon: FileText, href: '/purchasing/create-order' },
      { id: 'import-tracking', label: 'Import Order Tracking', icon: Truck, href: '/purchasing/import-tracking' },
      { id: 'invoices', label: 'Supplier Invoices & Bills', icon: Receipt, href: '/purchasing/invoices' },
      { id: 'vendor-payments', label: 'Payments to Vendors', icon: PaymentIcon, href: '/purchasing/payments' },
      { id: 'vendor-reports', label: 'Supplier Performance Reports', icon: Award, href: '/purchasing/reports' }
    ]
  },
  {
    id: 'finance',
    label: 'Finance & Accounting',
    arabicLabel: 'المالية والمحاسبة',
    icon: DollarSign,
    href: '/finance',
    children: [
      { id: 'finance-dashboard', label: 'Dashboard', icon: PieChart, href: '/finance' },
      { id: 'general-ledger', label: 'General Ledger', icon: BookOpen, href: '/finance/ledger' },
      { id: 'receivables', label: 'Accounts Receivable', icon: Banknote, href: '/finance/receivables' },
      { id: 'payables', label: 'Accounts Payable', icon: Receipt, href: '/finance/payables' },
      { id: 'multi-currency', label: 'Multi-Currency Ledger', icon: Coins, href: '/finance/multi-currency' },
      { id: 'bank-recon', label: 'Bank Reconciliation', icon: Calculator, href: '/finance/bank-reconciliation' },
      { id: 'vat', label: 'UAE VAT (Tax Reports)', icon: Percent, href: '/finance/vat' },
      { id: 'petty-cash', label: 'Petty Cash Management', icon: PiggyBank, href: '/finance/petty-cash' },
      {
        id: 'financial-reports',
        label: 'Financial Reports',
        icon: FileSpreadsheet,
        children: [
          { id: 'pnl', label: 'P&L Statement', icon: TrendingUp, href: '/finance/reports/pnl' },
          { id: 'balance-sheet', label: 'Balance Sheet', icon: FileSpreadsheet, href: '/finance/reports/balance-sheet' },
          { id: 'cash-flow', label: 'Cash Flow', icon: Banknote, href: '/finance/reports/cash-flow' }
        ]
      }
    ]
  },
  {
    id: 'multi-location',
    label: 'Multi-Location Management',
    arabicLabel: 'إدارة المواقع المتعددة',
    icon: Building2,
    href: '/multi-location',
    children: [
      { id: 'store-dashboard', label: 'Store Dashboard', icon: Store, href: '/multi-location' },
      { id: 'store-pricing', label: 'Store-Wise Pricing', icon: DollarSign, href: '/multi-location/pricing' },
      { id: 'transfer-requests', label: 'Transfer Requests & Approvals', icon: ArrowRightLeft, href: '/multi-location/transfers' },
      { id: 'branch-promotions', label: 'Branch Promotions', icon: Gift, href: '/multi-location/promotions' },
      { id: 'staff-performance', label: 'Store Staff Performance', icon: Trophy, href: '/multi-location/staff-performance' }
    ]
  },
  {
    id: 'ecommerce',
    label: 'E-commerce / Omni-channel',
    arabicLabel: 'التجارة الإلكترونية',
    icon: Globe,
    href: '/ecommerce',
    children: [
      { id: 'online-dashboard', label: 'Online Store Dashboard', icon: ShoppingBag, href: '/ecommerce' },
      { id: 'product-sync', label: 'Product Sync', icon: RefreshCw, href: '/ecommerce/product-sync' },
      { id: 'online-orders', label: 'Online Orders', icon: Package, href: '/ecommerce/orders' },
      { id: 'click-collect', label: 'Click & Collect Orders', icon: Store, href: '/ecommerce/click-collect' },
      { id: 'marketplace', label: 'Marketplace Integration', icon: Smartphone, href: '/ecommerce/marketplace' },
      { id: 'customer-portal', label: 'Customer Portal Setup', icon: Users, href: '/ecommerce/portal' }
    ]
  },
  {
    id: 'hr',
    label: 'HR & Staff',
    arabicLabel: 'الموارد البشرية',
    icon: UserCheck,
    href: '/hr',
    children: [
      { id: 'employees', label: 'Employee Directory', icon: Users, href: '/hr' },
      { id: 'attendance', label: 'Attendance & Shifts', icon: CalendarClock, href: '/hr/attendance' },
      { id: 'role-access', label: 'Role-Based Access', icon: Shield, href: '/hr/roles' },
      { id: 'payroll', label: 'Payroll & Salary', icon: Wallet, href: '/hr/payroll' },
      { id: 'commission', label: 'Sales Commission', icon: Trophy, href: '/hr/commission' },
      { id: 'hr-performance', label: 'Performance Analytics', icon: BarChart3, href: '/hr/performance' }
    ]
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    arabicLabel: 'التقارير والتحليلات',
    icon: BarChart3,
    href: '/reports',
    children: [
      { id: 'sales-reports', label: 'Sales Reports', icon: TrendingUp, href: '/reports/sales' },
      { id: 'inventory-reports', label: 'Inventory Reports', icon: Package, href: '/reports/inventory' },
      { id: 'stock-movement', label: 'Stock Movement & Valuation', icon: ArrowRightLeft, href: '/reports/stock-movement' },
      { id: 'wastage', label: 'Wastage & Shrinkage', icon: TrendingDown, href: '/reports/wastage' },
      { id: 'profitability', label: 'Profitability Analysis', icon: DollarSign, href: '/reports/profitability' },
      { id: 'customer-insights', label: 'Customer Insights', icon: Users, href: '/reports/customers' },
      { id: 'forecasting', label: 'Forecasting & Demand Planning', icon: Target, href: '/reports/forecasting' }
    ]
  },
  {
    id: 'settings',
    label: 'Settings & Admin',
    arabicLabel: 'الإعدادات والإدارة',
    icon: Settings,
    href: '/settings',
    children: [
      { id: 'company-profile', label: 'Company Profile', icon: Building, href: '/settings' },
      { id: 'tax-setup', label: 'Tax & VAT Setup', icon: Percent, href: '/settings/tax' },
      { id: 'user-permissions', label: 'User Roles & Permissions', icon: Lock, href: '/settings/permissions' },
      { id: 'language', label: 'Language', icon: Languages, href: '/settings/language' },
      { id: 'currency', label: 'Currency Setup', icon: Coins, href: '/settings/currency' },
      { id: 'loyalty-setup', label: 'Loyalty Program Setup', icon: Heart, href: '/settings/loyalty' },
      { id: 'integrations', label: 'Integrations', icon: Zap, href: '/settings/integrations' },
      { id: 'backup', label: 'Data Backup & Security', icon: Database, href: '/settings/backup' }
    ]
  }
];

// Role-based access configuration
const roleAccess = {
  'hq-admin': ['*'], // Full access
  'store-manager': [
    'dashboard',
    'sales-pos',
    'inventory',
    'crm',
    'multi-location',
    'reports'
  ],
  'cashier': [
    'dashboard',
    'sales-pos.pos-terminal',
    'sales-pos.returns',
    'sales-pos.gift-cards',
    'sales-pos.daily-closing'
  ],
  'accountant': [
    'dashboard',
    'finance',
    'reports.sales-reports',
    'reports.profitability',
    'settings.tax-setup'
  ],
  'production-staff': [
    'dashboard',
    'production',
    'inventory.raw-materials',
    'inventory.semi-finished'
  ]
};

interface SidebarProps {
  userRole?: keyof typeof roleAccess;
  isCollapsed?: boolean;
}

const SidebarNavigation: React.FC<SidebarProps> = ({
  userRole = 'hq-admin',
  isCollapsed = false
}) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Check if user has access to a specific item
  const hasAccess = (itemId: string): boolean => {
    const userAccess = roleAccess[userRole];
    if (userAccess.includes('*')) return true;

    return userAccess.some(access => {
      if (access === itemId) return true;
      if (access.startsWith(itemId + '.')) return true;
      if (itemId.startsWith(access + '.')) return true;
      return false;
    });
  };

  // Toggle expanded state
  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // Check if path is active
  const isActive = (href?: string): boolean => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Render navigation item
  const renderNavItem = (item: NavigationItem, level: number = 0, parentId?: string) => {
    const itemId = parentId ? `${parentId}.${item.id}` : item.id;

    // Check access permissions
    if (!hasAccess(itemId)) return null;

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(itemId);
    const isCurrentActive = isActive(item.href);
    const Icon = item.icon;

    const itemContent = (
      <div
        className={`
          flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer
          transition-colors duration-200
          ${isCurrentActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}
          ${level > 0 ? 'ml-' + (level * 4) : ''}
        `}
        onClick={() => {
          if (hasChildren) {
            toggleExpanded(itemId);
          }
        }}
      >
        <div className="flex items-center space-x-3">
          {Icon && <Icon className="h-5 w-5" />}
          {!isCollapsed && (
            <span className="text-sm font-medium">
              {item.label}
            </span>
          )}
        </div>
        {hasChildren && !isCollapsed && (
          <div className="ml-auto">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        )}
      </div>
    );

    return (
      <div key={itemId}>
        {item.href && !hasChildren ? (
          <Link href={item.href}>
            {itemContent}
          </Link>
        ) : (
          itemContent
        )}

        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1">
            {item.children!.map(child =>
              renderNavItem(child, level + 1, itemId)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`
      h-full bg-white border-r border-gray-200
      transition-all duration-300
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Logo/Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
            O
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-gray-900">Oud Palace</h2>
              <p className="text-xs text-gray-500">ERP + POS System</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <div className="overflow-y-auto h-[calc(100vh-80px)] p-4 space-y-1">
        {navigationStructure.map(item => renderNavItem(item))}
      </div>

      {/* User Role Badge */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="text-xs text-gray-500">Logged in as</div>
            <div className="text-sm font-medium text-gray-900 capitalize">
              {userRole.replace('-', ' ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarNavigation;