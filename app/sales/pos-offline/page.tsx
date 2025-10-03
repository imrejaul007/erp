'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  WifiOff,
  Wifi,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Package,
  DollarSign,
  ShoppingCart,
  Upload,
  Download,
  Database,
  ArrowLeft} from 'lucide-react';

interface OfflineTransaction {
  id: string;
  orderNumber: string;
  customer: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  paymentMethod: string;
  timestamp: string;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed';
  receiptPrinted: boolean;
}

export default function POSOfflinePage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [isSyncing, setIsSyncing] = useState(false);

  // Mock data
  const [offlineTransactions, setOfflineTransactions] = useState<OfflineTransaction[]>([
    {
      id: '1',
      orderNumber: 'OFF-001',
      customer: 'Ahmed Al Mansoori',
      items: [
        { name: 'Royal Oud 50ml', quantity: 1, price: 450 },
        { name: 'Incense Sticks', quantity: 2, price: 50 },
      ],
      total: 550,
      paymentMethod: 'Cash',
      timestamp: '2024-01-20T14:30:00',
      syncStatus: 'pending',
      receiptPrinted: true,
    },
    {
      id: '2',
      orderNumber: 'OFF-002',
      customer: 'Fatima Hassan',
      items: [
        { name: 'Attar Oil 30ml', quantity: 1, price: 280 },
      ],
      total: 280,
      paymentMethod: 'Card',
      timestamp: '2024-01-20T15:15:00',
      syncStatus: 'synced',
      receiptPrinted: true,
    },
    {
      id: '3',
      orderNumber: 'OFF-003',
      customer: 'Mohammed Ali',
      items: [
        { name: 'Oud Chips 100g', quantity: 2, price: 180 },
        { name: 'Burner', quantity: 1, price: 120 },
      ],
      total: 480,
      paymentMethod: 'Cash',
      timestamp: '2024-01-20T16:00:00',
      syncStatus: 'pending',
      receiptPrinted: true,
    },
  ]);

  // Simulate network status
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly toggle online/offline for demo
      const randomOnline = Math.random() > 0.3;
      setIsOnline(randomOnline);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const pendingTransactions = offlineTransactions.filter((t) => t.syncStatus === 'pending');
  const syncedTransactions = offlineTransactions.filter((t) => t.syncStatus === 'synced');
  const failedTransactions = offlineTransactions.filter((t) => t.syncStatus === 'failed');
  const totalPendingValue = pendingTransactions.reduce((sum, t) => sum + t.total, 0);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setOfflineTransactions((prev) =>
        prev.map((t) =>
          t.syncStatus === 'pending' ? { ...t, syncStatus: 'synced' } : t
        )
      );
      setLastSyncTime(new Date());
      setIsSyncing(false);
    }, 2000);
  };

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'syncing':
        return 'bg-blue-100 text-blue-800';
      case 'synced':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'synced':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-600 to-zinc-600 bg-clip-text text-transparent">
            POS Offline Mode
          </h1>
          <p className="text-gray-600 mt-2">
            Process sales offline and sync when connection returns
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSyncAll}
            disabled={!isOnline || pendingTransactions.length === 0 || isSyncing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync All
          </Button>
        </div>
      </div>

      {/* Network Status Banner */}
      <Card
        className={`border-2 ${
          isOnline
            ? 'bg-green-50 border-green-500'
            : 'bg-red-50 border-red-500'
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isOnline ? (
                <Wifi className="h-8 w-8 text-green-600" />
              ) : (
                <WifiOff className="h-8 w-8 text-red-600" />
              )}
              <div>
                <h3
                  className={`text-lg font-bold ${
                    isOnline ? 'text-green-900' : 'text-red-900'
                  }`}
                >
                  {isOnline ? 'Online' : 'Offline Mode'}
                </h3>
                <p
                  className={`text-sm ${
                    isOnline ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {isOnline
                    ? 'Connected to server. Auto-sync enabled.'
                    : 'No internet connection. Transactions will be queued for sync.'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Last Sync</p>
              <p className="font-medium">{lastSyncTime.toLocaleTimeString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Sync</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingTransactions.length}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              AED {totalPendingValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Synced</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {syncedTransactions.length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Uploaded to server</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {failedTransactions.length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Local Storage</CardTitle>
            <Database className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 MB</div>
            <p className="text-xs text-gray-600 mt-1">Used of 50 MB</p>
          </CardContent>
        </Card>
      </div>

      {/* Offline Capabilities */}
      <Card>
        <CardHeader>
          <CardTitle>Offline Capabilities</CardTitle>
          <CardDescription>Features available without internet connection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <ShoppingCart className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Create Orders</p>
                <p className="text-sm text-green-700">
                  Process sales with locally cached product catalog
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Package className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Print Receipts</p>
                <p className="text-sm text-blue-700">
                  Generate and print receipts offline
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Database className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-purple-900">Local Storage</p>
                <p className="text-sm text-purple-700">
                  IndexedDB stores transactions until sync
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offline Transactions Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Sync Queue</CardTitle>
          <CardDescription>
            Transactions waiting to be synchronized
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {offlineTransactions.map((transaction) => (
            <Card
              key={transaction.id}
              className={`border-l-4 ${
                transaction.syncStatus === 'pending'
                  ? 'border-l-yellow-500'
                  : transaction.syncStatus === 'synced'
                  ? 'border-l-green-500'
                  : transaction.syncStatus === 'failed'
                  ? 'border-l-red-500'
                  : 'border-l-blue-500'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{transaction.orderNumber}</h3>
                      <Badge className={getSyncStatusColor(transaction.syncStatus)}>
                        <span className="flex items-center gap-1">
                          {getSyncStatusIcon(transaction.syncStatus)}
                          {transaction.syncStatus.toUpperCase()}
                        </span>
                      </Badge>
                      {transaction.receiptPrinted && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Receipt Printed
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{transaction.customer}</span>
                      <span>{new Date(transaction.timestamp).toLocaleString()}</span>
                      <span>{transaction.paymentMethod}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold">AED {transaction.total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Items ({transaction.items.length})
                  </p>
                  <div className="space-y-2">
                    {transaction.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-600 ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-medium">
                          AED {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {transaction.syncStatus === 'pending' && isOnline && (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-indigo-600"
                      onClick={() => {
                        setOfflineTransactions((prev) =>
                          prev.map((t) =>
                            t.id === transaction.id ? { ...t, syncStatus: 'syncing' } : t
                          )
                        );
                        setTimeout(() => {
                          setOfflineTransactions((prev) =>
                            prev.map((t) =>
                              t.id === transaction.id ? { ...t, syncStatus: 'synced' } : t
                            )
                          );
                        }, 1500);
                      }}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Sync Now
                    </Button>
                  )}
                  {transaction.syncStatus === 'failed' && (
                    <Button size="sm" variant="outline" className="border-red-500 text-red-700">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry Sync
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    View Receipt
                  </Button>
                  <Button size="sm" variant="outline">
                    Reprint
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {offlineTransactions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>No offline transactions in queue</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Offline mode configuration and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Auto-Sync</span>
                <Badge className="bg-green-100 text-green-800">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Conflict Resolution</span>
                <Badge className="bg-blue-100 text-blue-800">Server Wins</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Sync Interval</span>
                <Badge variant="outline">Every 5 minutes</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Local Products Cached</span>
                <Badge variant="outline">1,245 items</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Receipt Printer</span>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Last Cache Update</span>
                <Badge variant="outline">{lastSyncTime.toLocaleString()}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {!isOnline && pendingTransactions.length > 0 && (
        <Card className="bg-amber-50 border-amber-500 border-2">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">Offline - Sync Pending</p>
                <p className="text-sm text-amber-700">
                  You have {pendingTransactions.length} transaction(s) worth AED{' '}
                  {totalPendingValue.toLocaleString()} waiting to sync. They will be automatically
                  uploaded when internet connection is restored.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
