'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, CreditCard, TrendingUp, TrendingDown, Eye, RefreshCw } from 'lucide-react';

export default function BankAccountsPage() {
  const router = useRouter();

  const accounts = [
    {
      id: '1',
      name: 'Business Current Account',
      bank: 'Emirates NBD',
      accountNumber: '****7890',
      currency: 'AED',
      balance: 125450.50,
      type: 'Current',
      status: 'Active',
      lastSync: '2024-10-01 14:30',
    },
    {
      id: '2',
      name: 'Savings Account',
      bank: 'Dubai Islamic Bank',
      accountNumber: '****4321',
      currency: 'AED',
      balance: 50000.00,
      type: 'Savings',
      status: 'Active',
      lastSync: '2024-10-01 14:25',
    },
    {
      id: '3',
      name: 'USD Business Account',
      bank: 'ADCB',
      accountNumber: '****9876',
      currency: 'USD',
      balance: 15230.75,
      type: 'Current',
      status: 'Active',
      lastSync: '2024-10-01 14:20',
    },
  ];

  const recentTransactions = [
    {
      id: 'TXN-001',
      date: '2024-10-01',
      description: 'Customer Payment - INV-2024-156',
      type: 'Credit',
      amount: 2850.00,
      balance: 125450.50,
    },
    {
      id: 'TXN-002',
      date: '2024-09-30',
      description: 'Supplier Payment - Al-Taiba Supplies',
      type: 'Debit',
      amount: 1200.00,
      balance: 122600.50,
    },
    {
      id: 'TXN-003',
      date: '2024-09-29',
      description: 'Rent Payment - October',
      type: 'Debit',
      amount: 8000.00,
      balance: 123800.50,
    },
  ];

  const totalBalance = accounts.reduce((sum, acc) => {
    if (acc.currency === 'AED') return sum + acc.balance;
    return sum + acc.balance * 3.67; // Convert USD to AED (approximate)
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-amber-600" />
            Bank Accounts
          </h1>
          <p className="text-muted-foreground">Manage business bank accounts and transactions</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-amber-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {totalBalance.toLocaleString('en-AE', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.filter(a => a.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {new Set(accounts.map(a => a.bank)).size} banks
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Last Synced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today</div>
            <p className="text-xs text-muted-foreground mt-1">
              14:30 PM
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Bank Accounts</CardTitle>
              <CardDescription>All connected business bank accounts</CardDescription>
            </div>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>{account.bank}</TableCell>
                  <TableCell>{account.accountNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{account.type}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {account.currency} {account.balance.toLocaleString('en-AE', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">{account.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{account.lastSync}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest transactions from Business Current Account</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell>{txn.date}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{txn.description}</div>
                      <div className="text-sm text-gray-500">{txn.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {txn.type === 'Credit' ? (
                      <Badge className="bg-green-100 text-green-800">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Credit
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        Debit
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {txn.type === 'Credit' ? '+' : '-'}AED {txn.amount.toLocaleString('en-AE', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    AED {txn.balance.toLocaleString('en-AE', { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
