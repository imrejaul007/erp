'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/use-ui';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Package,
  LayoutDashboard,
  ShoppingCart,
  Users,
  Truck,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Store,
  CreditCard,
  Factory,
  Flower2,
  Globe,
  Building2,
  UserSquare2,
  DollarSign,
  PackageSearch,
  TrendingUp,
  Droplet,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  title: string;
  href?: string;
  icon: any;
  roles: string[];
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['OWNER', 'MANAGER', 'ACCOUNTANT', 'SALES_STAFF', 'INVENTORY_STAFF', 'USER'],
  },
  {
    title: 'Sales & POS',
    icon: ShoppingCart,
    roles: ['OWNER', 'MANAGER', 'SALES_STAFF'],
    children: [
      { title: 'Walk-in Sales', href: '/pos/walk-in', icon: Users, roles: ['OWNER', 'MANAGER', 'SALES_STAFF'] },
      { title: 'Sales Overview', href: '/sales', icon: TrendingUp, roles: ['OWNER', 'MANAGER', 'SALES_STAFF'] },
      { title: 'Retail Sales', href: '/sales/retail', icon: Store, roles: ['OWNER', 'MANAGER', 'SALES_STAFF'] },
      { title: 'Wholesale', href: '/sales/wholesale', icon: Building2, roles: ['OWNER', 'MANAGER', 'SALES_STAFF'] },
      { title: 'Corporate Sales', href: '/sales/corporate', icon: Building2, roles: ['OWNER', 'MANAGER', 'SALES_STAFF'] },
      { title: 'Layaway Payments', href: '/sales/layaway', icon: CreditCard, roles: ['OWNER', 'MANAGER', 'SALES_STAFF'] },
      { title: 'Subscriptions', href: '/sales/subscriptions', icon: PackageSearch, roles: ['OWNER', 'MANAGER', 'SALES_STAFF'] },
      { title: 'POS Offline Mode', href: '/sales/pos-offline', icon: PackageSearch, roles: ['OWNER', 'MANAGER', 'SALES_STAFF'] },
      { title: 'Returns & Refunds', href: '/sales/returns', icon: PackageSearch, roles: ['OWNER', 'MANAGER', 'SALES_STAFF'] },
      { title: 'Gift Cards', href: '/sales/gift-cards', icon: CreditCard, roles: ['OWNER', 'MANAGER', 'SALES_STAFF'] },
      { title: 'Day Closing', href: '/sales/closing', icon: FileText, roles: ['OWNER', 'MANAGER', 'SALES_STAFF'] },
    ],
  },
  {
    title: 'Customers',
    icon: Users,
    roles: ['OWNER', 'MANAGER', 'SALES_STAFF'],
    children: [
      { title: 'All Customers', href: '/customers', icon: Users, roles: ['OWNER', 'MANAGER', 'SALES_STAFF'] },
      { title: 'VIP Customers', href: '/crm/segments/vip', icon: Users, roles: ['OWNER', 'MANAGER', 'SALES_STAFF'] },
      { title: 'Regular Customers', href: '/crm/segments/regular', icon: Users, roles: ['OWNER', 'MANAGER', 'SALES_STAFF'] },
      { title: 'Tourist Customers', href: '/crm/segments/tourist', icon: Users, roles: ['OWNER', 'MANAGER', 'SALES_STAFF'] },
      { title: 'Corporate', href: '/crm/corporate', icon: Building2, roles: ['OWNER', 'MANAGER', 'SALES_STAFF'] },
      { title: 'Loyalty Program', href: '/crm/loyalty-program', icon: TrendingUp, roles: ['OWNER', 'MANAGER'] },
      { title: 'Campaigns', href: '/crm/campaigns', icon: BarChart3, roles: ['OWNER', 'MANAGER'] },
      { title: 'Purchase History', href: '/crm/purchase-history', icon: FileText, roles: ['OWNER', 'MANAGER', 'SALES_STAFF'] },
      { title: 'Complaints', href: '/crm/complaints', icon: FileText, roles: ['OWNER', 'MANAGER', 'SALES_STAFF'] },
      { title: 'Comprehensive CRM', href: '/crm/comprehensive', icon: Users, roles: ['OWNER', 'MANAGER'] },
      { title: 'Events & Exhibitions', href: '/crm/events', icon: Users, roles: ['OWNER', 'MANAGER', 'SALES_STAFF'] },
      { title: 'Feedback & Surveys', href: '/crm/feedback', icon: FileText, roles: ['OWNER', 'MANAGER'] },
      { title: 'Customer Journey', href: '/crm/customer-journey', icon: TrendingUp, roles: ['OWNER', 'MANAGER'] },
      { title: 'Gift Registry', href: '/crm/gift-registry', icon: Users, roles: ['OWNER', 'MANAGER', 'SALES_STAFF'] },
    ],
  },
  {
    title: 'Sampling & Trials',
    href: '/sampling',
    icon: Droplet,
    roles: ['OWNER', 'MANAGER', 'SALES_STAFF'],
  },
  {
    title: 'Inventory',
    icon: Package,
    roles: ['OWNER', 'MANAGER', 'INVENTORY_STAFF'],
    children: [
      { title: 'Overview', href: '/inventory', icon: LayoutDashboard, roles: ['OWNER', 'MANAGER', 'INVENTORY_STAFF'] },
      { title: 'Raw Materials', href: '/inventory/raw-materials', icon: Package, roles: ['OWNER', 'MANAGER', 'INVENTORY_STAFF'] },
      { title: 'Semi-Finished', href: '/inventory/semi-finished', icon: Package, roles: ['OWNER', 'MANAGER', 'INVENTORY_STAFF'] },
      { title: 'Finished Goods', href: '/inventory/finished-goods', icon: Package, roles: ['OWNER', 'MANAGER', 'INVENTORY_STAFF'] },
      { title: 'Add Products', href: '/inventory/add-products', icon: Package, roles: ['OWNER', 'MANAGER', 'INVENTORY_STAFF'] },
      { title: 'Adjustments', href: '/inventory/adjustments', icon: FileText, roles: ['OWNER', 'MANAGER', 'INVENTORY_STAFF'] },
      { title: 'Transfers', href: '/inventory/transfers', icon: Truck, roles: ['OWNER', 'MANAGER', 'INVENTORY_STAFF'] },
      { title: 'Bulk Orders', href: '/inventory/bulk-order', icon: ShoppingCart, roles: ['OWNER', 'MANAGER', 'INVENTORY_STAFF'] },
      { title: 'Barcode System', href: '/inventory/barcode', icon: Package, roles: ['OWNER', 'MANAGER', 'INVENTORY_STAFF'] },
      { title: 'Unit Conversion', href: '/inventory/units', icon: Package, roles: ['OWNER', 'MANAGER', 'INVENTORY_STAFF'] },
      { title: 'Pricing', href: '/inventory/pricing', icon: DollarSign, roles: ['OWNER', 'MANAGER'] },
      { title: 'Expiry Tracking', href: '/inventory/expiry', icon: FileText, roles: ['OWNER', 'MANAGER', 'INVENTORY_STAFF'] },
      { title: 'Dead Stock Analysis', href: '/inventory/dead-stock', icon: Package, roles: ['OWNER', 'MANAGER', 'INVENTORY_STAFF'] },
      { title: 'Warehouse Bins', href: '/inventory/warehouse-bins', icon: Package, roles: ['OWNER', 'MANAGER', 'INVENTORY_STAFF'] },
      { title: 'Batch Recall', href: '/inventory/batch-recall', icon: FileText, roles: ['OWNER', 'MANAGER', 'INVENTORY_STAFF'] },
    ],
  },
  {
    title: 'Production',
    icon: Factory,
    roles: ['OWNER', 'MANAGER'],
    children: [
      { title: 'Tracking', href: '/production/tracking', icon: LayoutDashboard, roles: ['OWNER', 'MANAGER'] },
      { title: 'Batches', href: '/production/batches', icon: Factory, roles: ['OWNER', 'MANAGER'] },
      { title: 'Recipes', href: '/production/recipes', icon: FileText, roles: ['OWNER', 'MANAGER'] },
      { title: 'Quality Control', href: '/production/qc', icon: FileText, roles: ['OWNER', 'MANAGER'] },
      { title: 'Costing', href: '/production/costing', icon: DollarSign, roles: ['OWNER', 'MANAGER'] },
      { title: 'Wastage', href: '/production/wastage', icon: FileText, roles: ['OWNER', 'MANAGER'] },
      { title: 'R&D Experiments', href: '/production/rd-experiments', icon: Factory, roles: ['OWNER', 'MANAGER'] },
      { title: 'By-Products', href: '/production/by-products', icon: Package, roles: ['OWNER', 'MANAGER'] },
    ],
  },
  {
    title: 'Perfume & Oud',
    icon: Flower2,
    roles: ['OWNER', 'MANAGER'],
    children: [
      { title: 'Collection', href: '/perfume', icon: Flower2, roles: ['OWNER', 'MANAGER'] },
      { title: 'Oud Features', href: '/perfume/oud-features', icon: Flower2, roles: ['OWNER', 'MANAGER'] },
      { title: 'Distillation', href: '/perfume/distillation', icon: Factory, roles: ['OWNER', 'MANAGER'] },
      { title: 'Blending Lab', href: '/perfume/blending', icon: Factory, roles: ['OWNER', 'MANAGER'] },
      { title: 'Aging Programs', href: '/perfume/aging', icon: FileText, roles: ['OWNER', 'MANAGER'] },
      { title: 'Grading', href: '/perfume/grading', icon: BarChart3, roles: ['OWNER', 'MANAGER'] },
    ],
  },
  {
    title: 'Finance',
    icon: DollarSign,
    roles: ['OWNER', 'MANAGER', 'ACCOUNTANT'],
    children: [
      { title: 'Accounting', href: '/finance/accounting', icon: FileText, roles: ['OWNER', 'MANAGER', 'ACCOUNTANT'] },
      { title: 'Transactions', href: '/finance/transactions', icon: DollarSign, roles: ['OWNER', 'MANAGER', 'ACCOUNTANT'] },
      { title: 'Invoicing', href: '/finance/invoicing', icon: FileText, roles: ['OWNER', 'MANAGER', 'ACCOUNTANT'] },
      { title: 'Expenses', href: '/finance/expenses', icon: DollarSign, roles: ['OWNER', 'MANAGER', 'ACCOUNTANT'] },
      { title: 'VAT Management', href: '/finance/vat', icon: FileText, roles: ['OWNER', 'MANAGER', 'ACCOUNTANT'] },
      { title: 'Reports', href: '/finance/reports', icon: BarChart3, roles: ['OWNER', 'MANAGER', 'ACCOUNTANT'] },
      { title: 'Budgeting & Forecasting', href: '/finance/budgeting', icon: TrendingUp, roles: ['OWNER', 'MANAGER', 'ACCOUNTANT'] },
    ],
  },
  {
    title: 'Purchasing',
    icon: Truck,
    roles: ['OWNER', 'MANAGER', 'INVENTORY_STAFF'],
    children: [
      { title: 'Overview', href: '/purchasing', icon: LayoutDashboard, roles: ['OWNER', 'MANAGER', 'INVENTORY_STAFF'] },
      { title: 'Invoices', href: '/purchasing/invoices', icon: FileText, roles: ['OWNER', 'MANAGER', 'ACCOUNTANT'] },
      { title: 'Payments', href: '/purchasing/payments', icon: DollarSign, roles: ['OWNER', 'MANAGER', 'ACCOUNTANT'] },
      { title: 'Import Tracking', href: '/purchasing/import-tracking', icon: Truck, roles: ['OWNER', 'MANAGER'] },
      { title: 'Reports', href: '/purchasing/reports', icon: BarChart3, roles: ['OWNER', 'MANAGER'] },
      { title: 'Landed Cost Calculator', href: '/procurement/landed-cost', icon: DollarSign, roles: ['OWNER', 'MANAGER', 'INVENTORY_STAFF'] },
      { title: 'Supplier Ratings', href: '/procurement/supplier-ratings', icon: BarChart3, roles: ['OWNER', 'MANAGER'] },
    ],
  },
  {
    title: 'HR & Staff',
    icon: UserSquare2,
    roles: ['OWNER', 'MANAGER'],
    children: [
      { title: 'Staff List', href: '/hr/staff', icon: Users, roles: ['OWNER', 'MANAGER'] },
      { title: 'Attendance', href: '/hr/attendance', icon: FileText, roles: ['OWNER', 'MANAGER'] },
      { title: 'Payroll', href: '/hr/payroll', icon: DollarSign, roles: ['OWNER', 'MANAGER'] },
      { title: 'Performance', href: '/hr/performance', icon: BarChart3, roles: ['OWNER', 'MANAGER'] },
      { title: 'Scheduling', href: '/hr/scheduling', icon: FileText, roles: ['OWNER', 'MANAGER'] },
      { title: 'Leave Requests', href: '/hr/leave-requests', icon: FileText, roles: ['OWNER', 'MANAGER'] },
    ],
  },
  {
    title: 'E-commerce',
    icon: Globe,
    roles: ['OWNER', 'MANAGER'],
    children: [
      { title: 'Overview', href: '/ecommerce', icon: LayoutDashboard, roles: ['OWNER', 'MANAGER'] },
      { title: 'Online Orders', href: '/ecommerce/orders', icon: ShoppingCart, roles: ['OWNER', 'MANAGER'] },
      { title: 'Marketplace', href: '/ecommerce/marketplace', icon: Store, roles: ['OWNER', 'MANAGER'] },
      { title: 'Click & Collect', href: '/ecommerce/click-collect', icon: Package, roles: ['OWNER', 'MANAGER'] },
      { title: 'Product Sync', href: '/ecommerce/product-sync', icon: Package, roles: ['OWNER', 'MANAGER'] },
      { title: 'Omnichannel', href: '/ecommerce/omnichannel', icon: Globe, roles: ['OWNER', 'MANAGER'] },
    ],
  },
  {
    title: 'Multi-Location',
    icon: Building2,
    roles: ['OWNER', 'MANAGER'],
    children: [
      { title: 'Overview', href: '/multi-location', icon: LayoutDashboard, roles: ['OWNER', 'MANAGER'] },
      { title: 'Store Management', href: '/multi-location/management', icon: Store, roles: ['OWNER', 'MANAGER'] },
      { title: 'Staff Management', href: '/multi-location/staff', icon: Users, roles: ['OWNER', 'MANAGER'] },
      { title: 'Transfers', href: '/multi-location/transfers', icon: Truck, roles: ['OWNER', 'MANAGER'] },
      { title: 'Pricing', href: '/multi-location/pricing', icon: DollarSign, roles: ['OWNER', 'MANAGER'] },
      { title: 'Promotions', href: '/multi-location/promotions', icon: TrendingUp, roles: ['OWNER', 'MANAGER'] },
      { title: 'Staff Performance', href: '/multi-location/staff-performance', icon: BarChart3, roles: ['OWNER', 'MANAGER'] },
      { title: 'Analytics', href: '/multi-location/analytics', icon: BarChart3, roles: ['OWNER', 'MANAGER'] },
      { title: 'Settings', href: '/multi-location/settings', icon: Settings, roles: ['OWNER'] },
    ],
  },
  {
    title: 'Reports & Analytics',
    icon: BarChart3,
    roles: ['OWNER', 'MANAGER'],
    children: [
      { title: 'Analytics Dashboard', href: '/analytics', icon: LayoutDashboard, roles: ['OWNER', 'MANAGER'] },
      { title: 'Sales Reports', href: '/reports/sales', icon: TrendingUp, roles: ['OWNER', 'MANAGER'] },
      { title: 'Inventory Reports', href: '/reports/inventory', icon: Package, roles: ['OWNER', 'MANAGER'] },
      { title: 'Financial Reports', href: '/reports/financial', icon: DollarSign, roles: ['OWNER', 'MANAGER'] },
      { title: 'Customer Reports', href: '/reports/customer', icon: Users, roles: ['OWNER', 'MANAGER'] },
    ],
  },
  {
    title: 'Settings',
    icon: Settings,
    roles: ['OWNER', 'MANAGER'],
    children: [
      { title: 'General', href: '/settings', icon: Settings, roles: ['OWNER', 'MANAGER'] },
      { title: 'Permissions', href: '/settings/permissions', icon: UserSquare2, roles: ['OWNER'] },
      { title: 'Tax Settings', href: '/settings/tax', icon: FileText, roles: ['OWNER', 'MANAGER'] },
      { title: 'Currency', href: '/settings/currency', icon: DollarSign, roles: ['OWNER', 'MANAGER'] },
      { title: 'Language', href: '/settings/language', icon: Globe, roles: ['OWNER', 'MANAGER'] },
      { title: 'Loyalty Settings', href: '/settings/loyalty', icon: TrendingUp, roles: ['OWNER', 'MANAGER'] },
      { title: 'Theme', href: '/settings/theme', icon: Settings, roles: ['OWNER', 'MANAGER'] },
      { title: 'System', href: '/settings/system', icon: Settings, roles: ['OWNER'] },
    ],
  },
];

function NavSection({ item, isCollapsed, pathname, onNavigate }: {
  item: NavItem;
  isCollapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(
    item.children?.some(child => pathname.startsWith(child.href || '')) || false
  );

  if (item.href && !item.children) {
    const isActive = pathname === item.href ||
      (item.href !== '/dashboard' && pathname.startsWith(item.href));

    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn(
          'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          isActive
            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
            : 'text-gray-700 hover:bg-amber-50 hover:text-amber-900',
          isCollapsed && 'justify-center'
        )}
        title={isCollapsed ? item.title : undefined}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && <span>{item.title}</span>}
      </Link>
    );
  }

  if (item.children) {
    const hasActiveChild = item.children.some(child =>
      pathname === child.href || (child.href && pathname.startsWith(child.href))
    );

    return (
      <div>
        <button
          onClick={() => !isCollapsed && setIsOpen(!isOpen)}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            hasActiveChild
              ? 'bg-amber-100 text-amber-900'
              : 'text-gray-700 hover:bg-amber-50 hover:text-amber-900',
            isCollapsed && 'justify-center'
          )}
          title={isCollapsed ? item.title : undefined}
        >
          <div className="flex items-center space-x-3">
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>{item.title}</span>}
          </div>
          {!isCollapsed && item.children && (
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform',
                isOpen && 'transform rotate-180'
              )}
            />
          )}
        </button>

        {!isCollapsed && isOpen && item.children && (
          <div className="ml-6 mt-1 space-y-1 border-l-2 border-amber-200 pl-3">
            {item.children.map((child) => {
              const isActive = pathname === child.href ||
                (child.href && child.href !== '/' && pathname.startsWith(child.href));

              return (
                <Link
                  key={child.href}
                  href={child.href || '#'}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-colors',
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium'
                      : 'text-gray-600 hover:bg-amber-50 hover:text-amber-900'
                  )}
                >
                  <child.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{child.title}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return null;
}

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, isCollapsed, toggle, toggleCollapse } = useSidebar();
  const { user, hasAnyRole } = useAuth();

  // Filter navigation items based on user role
  const filteredNavigation = navigationItems.map(item => ({
    ...item,
    children: item.children?.filter(child =>
      hasAnyRole(child.roles as any[])
    ),
  })).filter(item =>
    hasAnyRole(item.roles as any[]) &&
    (!item.children || item.children.length > 0)
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 lg:hidden',
          isOpen ? 'block' : 'hidden'
        )}
        onClick={toggle}
      />

      <div
        className={cn(
          'fixed top-0 z-50 h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out',
          // Mobile: slide in/out from left
          isOpen ? 'left-0' : '-left-64 lg:left-0',
          // Desktop: always visible, just collapse/expand
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Oud ERP
              </span>
            </Link>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="hover:bg-amber-100 hidden lg:flex"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <nav className="p-4 space-y-1">
            {filteredNavigation.map((item) => (
              <NavSection
                key={item.title}
                item={item}
                isCollapsed={isCollapsed}
                pathname={pathname}
                onNavigate={toggle}
              />
            ))}
          </nav>
        </ScrollArea>

        {/* User Info */}
        {!isCollapsed && user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <Link href="/profile" className="flex items-center space-x-3 hover:bg-amber-50 rounded-lg p-2 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user.name?.charAt(0) || user.email.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.role.toLowerCase().replace('_', ' ')}
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
