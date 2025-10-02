'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface KeyboardShortcutsProps {
  onScan?: () => void;
  onNewCustomer?: () => void;
  onPayment?: () => void;
  onClear?: () => void;
  onHold?: () => void;
}

export function KeyboardShortcuts({
  onScan,
  onNewCustomer,
  onPayment,
  onClear,
  onHold,
}: KeyboardShortcutsProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Ctrl/Cmd + shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'n':
            e.preventDefault();
            if (onNewCustomer) {
              onNewCustomer();
              toast.info('Opening new customer dialog');
            }
            break;
          case 's':
            e.preventDefault();
            if (onScan) {
              onScan();
              toast.info('Opening barcode scanner');
            }
            break;
          case 'h':
            e.preventDefault();
            if (onHold) {
              onHold();
              toast.info('Holding current transaction');
            }
            break;
          case 'k':
            e.preventDefault();
            if (onClear) {
              onClear();
              toast.info('Clearing cart');
            }
            break;
        }
      }

      // Function keys
      switch (e.key) {
        case 'F1':
          e.preventDefault();
          router.push('/pos');
          toast.info('Opening POS menu');
          break;
        case 'F2':
          e.preventDefault();
          router.push('/inventory');
          toast.info('Opening inventory');
          break;
        case 'F3':
          e.preventDefault();
          router.push('/crm');
          toast.info('Opening CRM');
          break;
        case 'F4':
          e.preventDefault();
          router.push('/purchasing');
          toast.info('Opening purchasing');
          break;
        case 'F9':
          e.preventDefault();
          if (onPayment) {
            onPayment();
            toast.success('Opening payment');
          }
          break;
        case 'F12':
          e.preventDefault();
          router.push('/reports');
          toast.info('Opening reports');
          break;
        case 'Escape':
          e.preventDefault();
          router.back();
          break;
      }

      // Number pad for quick item addition (ALT + number)
      if (e.altKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        toast.info(`Quick add item ${e.key}`);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router, onScan, onNewCustomer, onPayment, onClear, onHold]);

  return null;
}

export function KeyboardShortcutsHelp() {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <h4 className="font-semibold mb-2">Navigation</h4>
        <ul className="space-y-1 text-muted-foreground">
          <li><kbd className="px-2 py-1 bg-gray-100 rounded">F1</kbd> - POS Menu</li>
          <li><kbd className="px-2 py-1 bg-gray-100 rounded">F2</kbd> - Inventory</li>
          <li><kbd className="px-2 py-1 bg-gray-100 rounded">F3</kbd> - CRM</li>
          <li><kbd className="px-2 py-1 bg-gray-100 rounded">F4</kbd> - Purchasing</li>
          <li><kbd className="px-2 py-1 bg-gray-100 rounded">F12</kbd> - Reports</li>
          <li><kbd className="px-2 py-1 bg-gray-100 rounded">ESC</kbd> - Go Back</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Actions</h4>
        <ul className="space-y-1 text-muted-foreground">
          <li><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+N</kbd> - New Customer</li>
          <li><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+S</kbd> - Scan Barcode</li>
          <li><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+H</kbd> - Hold Transaction</li>
          <li><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+K</kbd> - Clear Cart</li>
          <li><kbd className="px-2 py-1 bg-gray-100 rounded">F9</kbd> - Process Payment</li>
          <li><kbd className="px-2 py-1 bg-gray-100 rounded">Alt+1-9</kbd> - Quick Add Item</li>
        </ul>
      </div>
    </div>
  );
}
