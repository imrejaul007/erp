'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  discountPercent: number;
}

export default function NewSalePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    storeId: '',
    customerId: '',
    paymentMethod: 'CASH',
    paymentStatus: 'COMPLETED',
    notes: ''
  });

  const [items, setItems] = useState<SaleItem[]>([
    { productId: '', productName: '', quantity: 1, unitPrice: 0, vatRate: 5, discountPercent: 0 }
  ]);

  // Load data
  useEffect(() => {
    loadStores();
    loadProducts();
    loadCustomers();
  }, []);

  const loadStores = async () => {
    try {
      const res = await fetch('/api/stores');
      if (res.ok) {
        const data = await res.json();
        setStores(data.data || []);
        if (data.data && data.data.length > 0) {
          setFormData(prev => ({ ...prev, storeId: data.data[0].id }));
        }
      }
    } catch (error) {
      console.error('Failed to load stores:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=1000');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const loadCustomers = async () => {
    try {
      const res = await fetch('/api/customers?limit=1000');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  };

  const addItem = () => {
    setItems([...items, { productId: '', productName: '', quantity: 1, unitPrice: 0, vatRate: 5, discountPercent: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof SaleItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // If product changed, update price
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].productName = product.name;
        newItems[index].unitPrice = parseFloat(product.sellingPrice || 0);
        newItems[index].vatRate = parseFloat(product.vatRate || 5);
      }
    }

    setItems(newItems);
  };

  const calculateItemTotal = (item: SaleItem) => {
    const subtotal = item.quantity * item.unitPrice;
    const discount = subtotal * (item.discountPercent / 100);
    const afterDiscount = subtotal - discount;
    const vat = afterDiscount * (item.vatRate / 100);
    return afterDiscount + vat;
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalVat = 0;

    items.forEach(item => {
      const itemSubtotal = item.quantity * item.unitPrice;
      const discount = itemSubtotal * (item.discountPercent / 100);
      const afterDiscount = itemSubtotal - discount;
      const vat = afterDiscount * (item.vatRate / 100);

      subtotal += itemSubtotal;
      totalDiscount += discount;
      totalVat += vat;
    });

    const grandTotal = subtotal - totalDiscount + totalVat;

    return { subtotal, totalDiscount, totalVat, grandTotal };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          vatRate: item.vatRate,
          discountPercent: item.discountPercent,
          unit: 'PIECE'
        })),
        source: 'MANUAL'
      };

      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        alert(`Sale created successfully! Sale No: ${result.data.saleNo}`);
        router.push('/sales');
      } else {
        const error = await res.json();
        alert(`Error: ${error.error || 'Failed to create sale'}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to create sale');
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Sale</h1>
        <p className="text-gray-600">Create a new sale with automatic VAT calculation</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Information */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold mb-4">Sale Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Store *</label>
              <select
                value={formData.storeId}
                onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Store</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Customer (Optional)</label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Walk-in Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CREDIT">Credit</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 border rounded"
              rows={2}
              placeholder="Optional notes..."
            />
          </div>
        </div>

        {/* Items */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              + Add Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Product</th>
                  <th className="p-2 text-left">Qty</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-left">Discount %</th>
                  <th className="p-2 text-left">VAT %</th>
                  <th className="p-2 text-left">Total</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">
                      <select
                        value={item.productId}
                        onChange={(e) => updateItem(index, 'productId', e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                      >
                        <option value="">Select Product</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} - {product.sellingPrice} AED
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-20 p-2 border rounded"
                        required
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-24 p-2 border rounded"
                        required
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={item.discountPercent}
                        onChange={(e) => updateItem(index, 'discountPercent', parseFloat(e.target.value) || 0)}
                        className="w-20 p-2 border rounded"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={item.vatRate}
                        onChange={(e) => updateItem(index, 'vatRate', parseFloat(e.target.value) || 5)}
                        className="w-20 p-2 border rounded"
                      />
                    </td>
                    <td className="p-2 font-semibold">
                      {calculateItemTotal(item).toFixed(2)} AED
                    </td>
                    <td className="p-2">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="space-y-2 max-w-md ml-auto">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{totals.subtotal.toFixed(2)} AED</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Discount:</span>
              <span>-{totals.totalDiscount.toFixed(2)} AED</span>
            </div>
            <div className="flex justify-between text-blue-600">
              <span>VAT:</span>
              <span>+{totals.totalVat.toFixed(2)} AED</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-2">
              <span>Grand Total:</span>
              <span>{totals.grandTotal.toFixed(2)} AED</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || items.length === 0 || !formData.storeId}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Sale'}
          </button>
        </div>
      </form>
    </div>
  );
}
