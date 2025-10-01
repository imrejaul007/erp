'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/use-ui';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'MANAGER', 'SALES', 'INVENTORY', 'USER'],
  },
  {
    title: 'Products',
    href: '/dashboard/products',
    icon: Package,
    roles: ['ADMIN', 'MANAGER', 'INVENTORY'],
  },
  {
    title: 'Orders',
    href: '/dashboard/orders',
    icon: ShoppingCart,
    roles: ['ADMIN', 'MANAGER', 'SALES'],
  },
  {
    title: 'Customers',
    href: '/dashboard/customers',
    icon: Users,
    roles: ['ADMIN', 'MANAGER', 'SALES'],
  },
  {
    title: 'Suppliers',
    href: '/dashboard/suppliers',
    icon: Truck,
    roles: ['ADMIN', 'MANAGER', 'INVENTORY'],
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['ADMIN', 'MANAGER'],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, isCollapsed, toggle, toggleCollapse } = useSidebar();
  const { user, hasAnyRole } = useAuth();

  // Filter navigation items based on user role
  const filteredNavigation = navigationItems.filter(item =>
    hasAnyRole(item.roles as any[])
  );

  if (!isOpen) return null;

  return (
    <>
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-full bg-white border-r border-oud-200/50 shadow-lg transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-oud-200/50">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-oud-500 to-oud-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif font-semibold luxury-text-gradient">
                Oud ERP
              </span>
            </Link>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="hover:bg-oud-100 hidden lg:flex"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-gradient-to-r from-oud-500 to-oud-600 text-white shadow-lg'
                    : 'text-oud-700 hover:bg-oud-100 hover:text-oud-800',
                  isCollapsed && 'justify-center'
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        {!isCollapsed && user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-oud-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-oud-500 to-oud-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user.name?.charAt(0) || user.email.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-oud-800 truncate">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-oud-500 capitalize">
                  {user.role.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}