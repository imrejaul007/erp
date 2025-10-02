'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Receipt } from 'lucide-react';
import { toast } from 'sonner';

export default function AddTransactionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: 'income',
    category: '',
    description: '',
    amount: '',
    vatRate: '5',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    reference: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate VAT amount
    const amount = parseFloat(formData.amount);
    const vatRate = parseFloat(formData.vatRate);
    const vatAmount = (amount * vatRate) / 100;
    const totalAmount = amount + vatAmount;

    toast.success(`Transaction recorded: AED ${totalAmount.toFixed(2)} (including VAT)`);
    router.push('/finance');
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const incomeCategories = [
    'Sales Revenue',
    'Service Income',
    'Interest Income',
    'Other Income',
  ];

  const expenseCategories = [
    'Inventory Purchase',
    'Raw Materials',
    'Payroll',
    'Rent',
    'Utilities',
    'Marketing',
    'Operating Expenses',
    'Other Expenses',
  ];

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Receipt className="h-8 w-8 text-amber-600" />
            Add Transaction
          </h1>
          <p className="text-muted-foreground">Record a new income or expense transaction</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
            <CardDescription>Enter the details of the financial transaction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transaction Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Transaction Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter transaction description"
                  required
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (AED) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              {/* VAT Rate */}
              <div className="space-y-2">
                <Label htmlFor="vatRate">VAT Rate (%)</Label>
                <Select value={formData.vatRate} onValueChange={(value) => handleChange('vatRate', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0% (Exempt)</SelectItem>
                    <SelectItem value="5">5% (Standard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Transaction Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => handleChange('paymentMethod', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reference Number */}
              <div className="space-y-2">
                <Label htmlFor="reference">Reference Number</Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => handleChange('reference', e.target.value)}
                  placeholder="Optional reference number"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Additional notes or comments"
                  rows={3}
                />
              </div>
            </div>

            {/* Summary */}
            {formData.amount && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Transaction Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">AED {parseFloat(formData.amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT ({formData.vatRate}%):</span>
                    <span className="font-medium">
                      AED {((parseFloat(formData.amount) * parseFloat(formData.vatRate)) / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-amber-300 pt-2">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-lg">
                      AED {(parseFloat(formData.amount) + (parseFloat(formData.amount) * parseFloat(formData.vatRate)) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                <Save className="h-4 w-4 mr-2" />
                Save Transaction
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
