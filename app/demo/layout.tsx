'use client';

import React, { useState } from 'react';
import SidebarNavigation from '@/components/navigation/sidebar';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState<'hq-admin' | 'store-manager' | 'cashier' | 'accountant' | 'production-staff'>('hq-admin');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        <SidebarNavigation
          userRole={userRole}
          isCollapsed={false}
        />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden mr-2"
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Oud Palace ERP + POS System
              </h1>
            </div>

            {/* Role Switcher for Demo */}
            <div className="flex items-center gap-4">
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="hq-admin">HQ Admin</option>
                <option value="store-manager">Store Manager</option>
                <option value="cashier">Cashier</option>
                <option value="accountant">Accountant</option>
                <option value="production-staff">Production Staff</option>
              </select>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}