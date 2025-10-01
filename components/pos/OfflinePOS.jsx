import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  WifiOff,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  RefreshCw,
  Database,
  ShoppingCart,
  CreditCard,
  User,
  Package,
  Sync,
  CloudOff,
  HardDrive,
  Signal,
  Battery,
  AlertCircle,
  Info,
  Settings
} from 'lucide-react';

// Import existing POS components
import TouchOptimizedPOS from './TouchOptimizedPOS';
import VATCompliantReceipt from './VATCompliantReceipt';

const OfflinePOS = ({
  storeId,
  cashierId,
  onConnectionRestored,
  onOfflineTransaction,
  enableOfflineMode = true
}) => {
  // Network state
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [lastOnlineTime, setLastOnlineTime] = useState(new Date());
  const [reconnectionAttempts, setReconnectionAttempts] = useState(0);
  const [autoSync, setAutoSync] = useState(true);

  // Offline data state
  const [offlineTransactions, setOfflineTransactions] = useState([]);
  const [cachedProducts, setCachedProducts] = useState([]);
  const [cachedCustomers, setCachedCustomers] = useState([]);
  const [cachedPricing, setCachedPricing] = useState({});
  const [offlineInventory, setOfflineInventory] = useState({});
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // UI state
  const [showOfflineWarning, setShowOfflineWarning] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'syncing', 'success', 'error'
  const [syncProgress, setSyncProgress] = useState(0);
  const [storageUsed, setStorageUsed] = useState(0);
  const [offlineCapacityMB, setOfflineCapacityMB] = useState(50);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Configuration
  const [offlineConfig, setOfflineConfig] = useState({
    maxTransactions: 1000,
    maxProducts: 5000,
    maxCustomers: 2000,
    autoSyncInterval: 30000, // 30 seconds
    dataRetentionDays: 7,
    enableOfflineReceipts: true,
    enableOfflineInventoryTracking: true,
    enableOfflineCustomerLookup: true,
    fallbackPricing: 'last_known'
  });

  // Refs
  const syncIntervalRef = useRef(null);
  const connectionCheckRef = useRef(null);
  const dbRef = useRef(null);

  // Initialize offline capabilities
  useEffect(() => {
    initializeOfflineDB();
    setupNetworkMonitoring();
    loadCachedData();
    startPeriodicSync();

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      if (connectionCheckRef.current) {
        clearInterval(connectionCheckRef.current);
      }
    };
  }, []);

  // Network monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setReconnectionAttempts(0);
      setShowOfflineWarning(false);
      if (pendingSyncCount > 0 && autoSync) {
        synchronizeData();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastOnlineTime(new Date());
      setShowOfflineWarning(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingSyncCount, autoSync]);

  // Initialize IndexedDB for offline storage
  const initializeOfflineDB = async () => {
    try {
      const request = indexedDB.open('OudPMS_Offline', 1);

      request.onerror = () => {
        console.error('Failed to open offline database');
      };

      request.onsuccess = (event) => {
        dbRef.current = event.target.result;
        console.log('Offline database initialized');
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores
        if (!db.objectStoreNames.contains('transactions')) {
          const transactionStore = db.createObjectStore('transactions', { keyPath: 'id' });
          transactionStore.createIndex('timestamp', 'timestamp');
          transactionStore.createIndex('synced', 'synced');
        }

        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', { keyPath: 'id' });
          productStore.createIndex('sku', 'sku', { unique: true });
          productStore.createIndex('category', 'category');
        }

        if (!db.objectStoreNames.contains('customers')) {
          const customerStore = db.createObjectStore('customers', { keyPath: 'id' });
          customerStore.createIndex('phone', 'phone');
          customerStore.createIndex('email', 'email');
        }

        if (!db.objectStoreNames.contains('inventory')) {
          db.createObjectStore('inventory', { keyPath: 'sku' });
        }

        if (!db.objectStoreNames.contains('pricing')) {
          db.createObjectStore('pricing', { keyPath: 'productId' });
        }

        dbRef.current = db;
      };
    } catch (error) {
      console.error('Error initializing offline database:', error);
    }
  };

  // Setup network quality monitoring
  const setupNetworkMonitoring = () => {
    // Check connection quality periodically
    connectionCheckRef.current = setInterval(async () => {
      if (isOnline) {
        try {
          const start = Date.now();
          await fetch('/api/health', {
            method: 'HEAD',
            cache: 'no-cache'
          });
          const latency = Date.now() - start;

          if (latency < 200) {
            setConnectionQuality('excellent');
          } else if (latency < 500) {
            setConnectionQuality('good');
          } else if (latency < 1000) {
            setConnectionQuality('fair');
          } else {
            setConnectionQuality('poor');
          }
        } catch (error) {
          setConnectionQuality('poor');
          // If health check fails but we think we're online, we're probably in limited connectivity
          if (isOnline) {
            setReconnectionAttempts(prev => prev + 1);
          }
        }
      }
    }, 10000); // Check every 10 seconds
  };

  // Load cached data from IndexedDB
  const loadCachedData = async () => {
    if (!dbRef.current) return;

    try {
      // Load products
      const productTransaction = dbRef.current.transaction(['products'], 'readonly');
      const productStore = productTransaction.objectStore('products');
      const products = await getAllFromStore(productStore);
      setCachedProducts(products);

      // Load customers
      const customerTransaction = dbRef.current.transaction(['customers'], 'readonly');
      const customerStore = customerTransaction.objectStore('customers');
      const customers = await getAllFromStore(customerStore);
      setCachedCustomers(customers);

      // Load pending transactions
      const transactionTransaction = dbRef.current.transaction(['transactions'], 'readonly');
      const transactionStore = transactionTransaction.objectStore('transactions');
      const syncedIndex = transactionStore.index('synced');
      const pendingTransactions = await getAllFromIndex(syncedIndex, false);
      setOfflineTransactions(pendingTransactions);
      setPendingSyncCount(pendingTransactions.length);

      // Calculate storage usage
      calculateStorageUsage();

    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  };

  // Helper function to get all records from store
  const getAllFromStore = (store) => {
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  // Helper function to get all records from index
  const getAllFromIndex = (index, keyValue) => {
    return new Promise((resolve, reject) => {
      const request = index.getAll(keyValue);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  // Calculate storage usage
  const calculateStorageUsage = async () => {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const usedMB = (estimate.usage || 0) / (1024 * 1024);
        setStorageUsed(Math.round(usedMB * 100) / 100);
      }
    } catch (error) {
      console.error('Error calculating storage usage:', error);
    }
  };

  // Start periodic sync when online
  const startPeriodicSync = () => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }

    syncIntervalRef.current = setInterval(() => {
      if (isOnline && autoSync && pendingSyncCount > 0) {
        synchronizeData();
      }
    }, offlineConfig.autoSyncInterval);
  };

  // Save transaction offline
  const saveOfflineTransaction = async (transactionData) => {
    if (!dbRef.current) return false;

    try {
      const transaction = dbRef.current.transaction(['transactions'], 'readwrite');
      const store = transaction.objectStore('transactions');

      const offlineTransaction = {
        ...transactionData,
        id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        synced: false,
        offline: true,
        retry_count: 0
      };

      await new Promise((resolve, reject) => {
        const request = store.add(offlineTransaction);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      setOfflineTransactions(prev => [...prev, offlineTransaction]);
      setPendingSyncCount(prev => prev + 1);

      // Update offline inventory
      if (offlineConfig.enableOfflineInventoryTracking) {
        await updateOfflineInventory(transactionData.items);
      }

      onOfflineTransaction?.(offlineTransaction);
      return true;

    } catch (error) {
      console.error('Error saving offline transaction:', error);
      return false;
    }
  };

  // Update offline inventory tracking
  const updateOfflineInventory = async (items) => {
    if (!dbRef.current) return;

    try {
      const transaction = dbRef.current.transaction(['inventory'], 'readwrite');
      const store = transaction.objectStore('inventory');

      for (const item of items) {
        const currentInventory = await new Promise((resolve) => {
          const request = store.get(item.sku);
          request.onsuccess = () => resolve(request.result || { sku: item.sku, quantity: 0, reservedOffline: 0 });
        });

        currentInventory.reservedOffline = (currentInventory.reservedOffline || 0) + item.quantity;
        currentInventory.lastUpdated = new Date().toISOString();

        await new Promise((resolve, reject) => {
          const request = store.put(currentInventory);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }

      // Update local state
      const updatedInventory = { ...offlineInventory };
      items.forEach(item => {
        if (updatedInventory[item.sku]) {
          updatedInventory[item.sku].reservedOffline += item.quantity;
        }
      });
      setOfflineInventory(updatedInventory);

    } catch (error) {
      console.error('Error updating offline inventory:', error);
    }
  };

  // Synchronize offline data with server
  const synchronizeData = async () => {
    if (!isOnline || syncStatus === 'syncing') return;

    setSyncStatus('syncing');
    setSyncProgress(0);

    try {
      const pendingTransactions = offlineTransactions.filter(t => !t.synced);
      const totalTransactions = pendingTransactions.length;

      if (totalTransactions === 0) {
        setSyncStatus('success');
        setTimeout(() => setSyncStatus('idle'), 2000);
        return;
      }

      let syncedCount = 0;
      const failedTransactions = [];

      for (const transaction of pendingTransactions) {
        try {
          // Attempt to sync transaction
          const response = await fetch('/api/sales/pos/transaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...transaction,
              offlineTransaction: true,
              originalTimestamp: transaction.timestamp
            })
          });

          if (response.ok) {
            // Mark as synced in IndexedDB
            await markTransactionSynced(transaction.id);
            syncedCount++;
          } else {
            failedTransactions.push(transaction);
            // Increment retry count
            await incrementRetryCount(transaction.id);
          }

        } catch (error) {
          console.error('Error syncing transaction:', transaction.id, error);
          failedTransactions.push(transaction);
          await incrementRetryCount(transaction.id);
        }

        setSyncProgress((syncedCount / totalTransactions) * 100);
      }

      // Update state
      setOfflineTransactions(prev => prev.filter(t => !t.synced));
      setPendingSyncCount(failedTransactions.length);
      setLastSyncTime(new Date());

      if (failedTransactions.length === 0) {
        setSyncStatus('success');
        // Clear offline inventory reservations
        await clearOfflineInventoryReservations();
      } else {
        setSyncStatus('error');
        console.warn(`${failedTransactions.length} transactions failed to sync`);
      }

      setTimeout(() => setSyncStatus('idle'), 3000);

    } catch (error) {
      console.error('Synchronization error:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  // Mark transaction as synced in IndexedDB
  const markTransactionSynced = async (transactionId) => {
    if (!dbRef.current) return;

    const transaction = dbRef.current.transaction(['transactions'], 'readwrite');
    const store = transaction.objectStore('transactions');

    return new Promise((resolve, reject) => {
      const getRequest = store.get(transactionId);
      getRequest.onsuccess = () => {
        const record = getRequest.result;
        if (record) {
          record.synced = true;
          record.syncedAt = new Date().toISOString();
          const putRequest = store.put(record);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  };

  // Increment retry count for failed transaction
  const incrementRetryCount = async (transactionId) => {
    if (!dbRef.current) return;

    const transaction = dbRef.current.transaction(['transactions'], 'readwrite');
    const store = transaction.objectStore('transactions');

    return new Promise((resolve) => {
      const getRequest = store.get(transactionId);
      getRequest.onsuccess = () => {
        const record = getRequest.result;
        if (record) {
          record.retry_count = (record.retry_count || 0) + 1;
          record.lastRetry = new Date().toISOString();
          store.put(record);
        }
        resolve();
      };
    });
  };

  // Clear offline inventory reservations after successful sync
  const clearOfflineInventoryReservations = async () => {
    if (!dbRef.current) return;

    try {
      const transaction = dbRef.current.transaction(['inventory'], 'readwrite');
      const store = transaction.objectStore('inventory');
      const allInventory = await getAllFromStore(store);

      for (const item of allInventory) {
        if (item.reservedOffline > 0) {
          item.reservedOffline = 0;
          item.lastCleared = new Date().toISOString();
          await new Promise((resolve) => {
            const request = store.put(item);
            request.onsuccess = () => resolve();
          });
        }
      }

      setOfflineInventory({});

    } catch (error) {
      console.error('Error clearing offline inventory reservations:', error);
    }
  };

  // Cache product data for offline use
  const cacheProductData = async (products) => {
    if (!dbRef.current) return;

    try {
      const transaction = dbRef.current.transaction(['products'], 'readwrite');
      const store = transaction.objectStore('products');

      for (const product of products) {
        await new Promise((resolve, reject) => {
          const request = store.put({
            ...product,
            cachedAt: new Date().toISOString()
          });
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }

      setCachedProducts(products);

    } catch (error) {
      console.error('Error caching product data:', error);
    }
  };

  // Get offline product by SKU
  const getOfflineProduct = useCallback((sku) => {
    return cachedProducts.find(product => product.sku === sku);
  }, [cachedProducts]);

  // Check if product is available offline (considering inventory)
  const isProductAvailableOffline = useCallback((sku, quantity = 1) => {
    const product = getOfflineProduct(sku);
    if (!product) return false;

    if (offlineConfig.enableOfflineInventoryTracking) {
      const inventoryItem = offlineInventory[sku];
      const availableQuantity = (product.stock?.quantity || 0) - (inventoryItem?.reservedOffline || 0);
      return availableQuantity >= quantity;
    }

    return true; // If inventory tracking is disabled, assume available
  }, [getOfflineProduct, offlineInventory, offlineConfig.enableOfflineInventoryTracking]);

  // Offline status component
  const OfflineStatusBar = () => (
    <div className={`px-4 py-2 flex items-center justify-between text-sm ${
      isOnline
        ? 'bg-green-100 text-green-800 border-green-200'
        : 'bg-red-100 text-red-800 border-red-200'
    } border-b`}>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          {isOnline ? (
            <Wifi className="w-4 h-4" />
          ) : (
            <WifiOff className="w-4 h-4" />
          )}
          <span className="font-medium">
            {isOnline ? 'Online' : 'Offline Mode'}
          </span>
        </div>

        {isOnline && (
          <div className="flex items-center space-x-1">
            <Signal className="w-4 h-4" />
            <span className="capitalize">{connectionQuality}</span>
          </div>
        )}

        {!isOnline && (
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Since {lastOnlineTime.toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {pendingSyncCount > 0 && (
          <div className="flex items-center space-x-1">
            <Database className="w-4 h-4" />
            <span>{pendingSyncCount} pending</span>
          </div>
        )}

        {syncStatus === 'syncing' && (
          <div className="flex items-center space-x-1">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Syncing... {Math.round(syncProgress)}%</span>
          </div>
        )}

        {isOnline && pendingSyncCount > 0 && syncStatus === 'idle' && (
          <button
            onClick={synchronizeData}
            className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
          >
            <Sync className="w-3 h-3" />
            <span>Sync Now</span>
          </button>
        )}
      </div>
    </div>
  );

  // Offline warning modal
  const OfflineWarningModal = () => (
    showOfflineWarning && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <div className="flex items-center space-x-3 mb-4">
            <CloudOff className="w-8 h-8 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Connection Lost
            </h3>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-gray-600">
              You're now in offline mode. You can continue processing transactions, and they will be synchronized when connection is restored.
            </p>

            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Available Offline:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• {cachedProducts.length} products cached</li>
                <li>• {cachedCustomers.length} customers cached</li>
                <li>• VAT-compliant receipts</li>
                <li>• Transaction processing</li>
                <li>• Inventory tracking</li>
              </ul>
            </div>

            {storageUsed > 0 && (
              <div className="text-xs text-gray-500">
                Storage used: {storageUsed}MB / {offlineCapacityMB}MB
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowOfflineWarning(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
            >
              Continue Offline
            </button>
            <button
              onClick={() => {
                setShowOfflineWarning(false);
                // Attempt to reconnect
                window.location.reload();
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Try Reconnect
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Enhanced POS with offline capabilities
  const OfflineEnhancedPOS = (props) => {
    const enhancedProps = {
      ...props,
      isOffline: !isOnline,
      offlineProducts: cachedProducts,
      offlineCustomers: cachedCustomers,
      onTransactionComplete: async (transactionData) => {
        if (isOnline) {
          // Try online first
          try {
            const response = await fetch('/api/sales/pos/transaction', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(transactionData)
            });

            if (response.ok) {
              return await response.json();
            }
          } catch (error) {
            console.error('Online transaction failed, saving offline:', error);
          }
        }

        // Save offline
        const success = await saveOfflineTransaction(transactionData);
        if (success) {
          return {
            success: true,
            transaction: {
              ...transactionData,
              offline: true,
              receiptNumber: `OFF-${Date.now()}`,
              qrCode: 'offline_transaction'
            },
            offline: true
          };
        } else {
          throw new Error('Failed to save offline transaction');
        }
      },
      getProductBySKU: (sku) => {
        if (isOnline) {
          // Try online API first
          return fetch(`/api/products/barcode/${sku}`)
            .then(response => response.ok ? response.json() : null)
            .catch(() => getOfflineProduct(sku));
        } else {
          return Promise.resolve(getOfflineProduct(sku));
        }
      },
      isProductAvailable: isProductAvailableOffline
    };

    return <TouchOptimizedPOS {...enhancedProps} />;
  };

  return (
    <div className="h-screen flex flex-col">
      <OfflineStatusBar />

      <div className="flex-1">
        <OfflineEnhancedPOS
          storeId={storeId}
          cashierId={cashierId}
          enableOfflineMode={enableOfflineMode}
        />
      </div>

      <OfflineWarningModal />

      {/* Sync status notification */}
      {syncStatus !== 'idle' && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-40 ${
          syncStatus === 'syncing' ? 'bg-blue-100 text-blue-800' :
          syncStatus === 'success' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          <div className="flex items-center space-x-2">
            {syncStatus === 'syncing' && <RefreshCw className="w-5 h-5 animate-spin" />}
            {syncStatus === 'success' && <CheckCircle className="w-5 h-5" />}
            {syncStatus === 'error' && <AlertTriangle className="w-5 h-5" />}
            <span className="font-medium">
              {syncStatus === 'syncing' && `Syncing... ${Math.round(syncProgress)}%`}
              {syncStatus === 'success' && 'Sync completed successfully'}
              {syncStatus === 'error' && 'Sync failed - will retry automatically'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflinePOS;