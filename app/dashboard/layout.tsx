'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useSidebar } from '@/hooks/use-ui';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth();
  const { isOpen, isCollapsed } = useSidebar();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-oud-50 to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-oud-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          isOpen
            ? isCollapsed
              ? 'lg:ml-16'
              : 'lg:ml-64'
            : 'ml-0'
        )}
      >
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/50"
          onClick={() => {
            // Close sidebar on mobile when clicking overlay
          }}
        />
      )}
    </div>
  );
}