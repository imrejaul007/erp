'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ImportSalesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [marketplace, setMarketplace] = useState('NOON');
  const [storeId, setStoreId] = useState('');
  const [importResult, setImportResult] = useState<any>(null);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const res = await fetch('/api/stores');
      if (res.ok) {
        const data = await res.json();
        setStores(data.data || []);
        if (data.data && data.data.length > 0) {
          setStoreId(data.data[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load stores:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !storeId) {
      alert('Please select a file and store');
      return;
    }

    setLoading(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('marketplace', marketplace);
      formData.append('storeId', storeId);

      const res = await fetch('/api/sales/import', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const result = await res.json();
        setImportResult(result);
        alert(`Success! Imported ${result.data.ordersCount} orders from ${result.data.marketplace}`);
      } else {
        const error = await res.json();
        alert(`Error: ${error.details || error.error || 'Failed to import'}`);
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Import Sales from Marketplace</h1>
        <p className="text-gray-600">Upload sales export files from Noon, Amazon, or other marketplaces</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        {/* Marketplace Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Marketplace *</label>
          <select
            value={marketplace}
            onChange={(e) => setMarketplace(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="NOON">Noon.com</option>
            <option value="AMAZON">Amazon</option>
            <option value="GENERIC">Generic CSV</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Select the marketplace where you exported the sales data from
          </p>
        </div>

        {/* Store Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Store *</label>
          <select
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select Store</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            The store where these sales will be recorded
          </p>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Upload File *</label>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="w-full p-3 border rounded-lg"
          />
          {selectedFile && (
            <p className="text-sm text-green-600 mt-2">
              ✓ Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Supported formats: CSV, Excel (.xlsx, .xls)
          </p>
        </div>

        {/* Expected Format Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Expected CSV Format for {marketplace}:</h3>
          {marketplace === 'NOON' && (
            <div className="text-sm space-y-1">
              <p>• Order ID, Order Date, SKU, Product Name, Quantity, Unit Price, VAT</p>
              <p className="text-gray-600 italic">Example: ORD123, 2025-01-15, SKU001, Product Name, 2, 100.00, 10.00</p>
            </div>
          )}
          {marketplace === 'AMAZON' && (
            <div className="text-sm space-y-1">
              <p>• amazon-order-id, purchase-date, sku, product-name, quantity, item-price, item-tax</p>
              <p className="text-gray-600 italic">Example: 123-4567890-1234567, 2025-01-15, SKU001, Product, 1, 100.00, 5.00</p>
            </div>
          )}
          {marketplace === 'GENERIC' && (
            <div className="text-sm space-y-1">
              <p>• Flexible format. Commonly expected columns:</p>
              <p>• order_id, order_date, product_name, quantity, unit_price, vat_amount</p>
              <p className="text-gray-600 italic">The parser will try to match common column names automatically</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/sales')}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={loading || !selectedFile || !storeId}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Importing...' : 'Import Sales'}
          </button>
        </div>
      </div>

      {/* Import Result */}
      {importResult && (
        <div className="mt-6 bg-green-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-green-800 mb-4">✓ Import Successful!</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Marketplace:</strong> {importResult.data.marketplace}</p>
            <p><strong>Orders Imported:</strong> {importResult.data.ordersCount}</p>
            {importResult.data.orders && importResult.data.orders.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold mb-2">Imported Orders:</p>
                <ul className="space-y-1 max-h-60 overflow-y-auto">
                  {importResult.data.orders.map((order: any, index: number) => (
                    <li key={index} className="bg-white p-2 rounded">
                      {order.saleNo} - {order.marketplaceOrderId} - {order.totalAmount} AED ({order.itemsCount} items)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="mt-4">
            <button
              onClick={() => router.push('/sales')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              View Sales List
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold mb-3">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>Export your sales data from the marketplace (Noon, Amazon, etc.)</li>
          <li>Select the correct marketplace from the dropdown above</li>
          <li>Choose the store where sales will be recorded</li>
          <li>Upload the CSV file</li>
          <li>Click "Import Sales" to process the file</li>
          <li>The system will automatically:
            <ul className="list-disc list-inside ml-6 mt-1">
              <li>Calculate VAT for each item</li>
              <li>Create customer records if email is provided</li>
              <li>Create product records for new items</li>
              <li>Generate VAT records for reporting</li>
              <li>Track marketplace order IDs to prevent duplicates</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
}
