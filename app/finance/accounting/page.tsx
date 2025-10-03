'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Calculator,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Building,
  Receipt,
  FileText,
  PieChart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Settings,
  Target,
  Zap,
  Archive,
  Percent,
  DollarSign,
  CreditCard,
  Banknote,
  University,
  Shield,
  Award,
  Calendar as CalendarIcon,
  Users,
  Package,
  Truck,
  Store,
  Globe,
  Mail,
  Phone,
  MapPin,
  Flag,
  BookOpen,
  PlusCircle,
  MinusCircle,
  RotateCcw,
  Save,
  Send,
  Printer,
  ExternalLink,
  CheckSquare,
  XCircle,
  Info,
  Warning,
  ArrowLeft} from 'lucide-react';

// UAE VAT Configuration
const uaeVATConfig = {
  standardRate: 5, // 5% UAE VAT
  zeroRated: ['Healthcare', 'Education', 'Financial Services'],
  exempt: ['Residential Property Sales', 'Certain Gold & Silver'],
  registrationThreshold: 375000, // AED per year
  voluntaryThreshold: 187500, // AED per year
  taxPeriods: {
    monthly: 'Monthly Returns',
    quarterly: 'Quarterly Returns (for smaller businesses)'
  },
  dueDates: {
    monthly: '28th of following month',
    quarterly: '28th of following quarter'
  },
  penalties: {
    lateSubmission: 1000, // AED
    latePayment: '5% of unpaid VAT',
    incorrectReturn: 3000 // AED
  }
};

// Chart of Accounts for Perfume & Oud Business
const chartOfAccounts = [
  // Assets (1000-1999)
  {
    code: '1000',
    name: 'Current Assets',
    nameArabic: 'الأصول المتداولة',
    type: 'Asset',
    category: 'Current Assets',
    children: [
      { code: '1100', name: 'Cash & Bank', nameArabic: 'النقد والبنك', type: 'Asset' },
      { code: '1110', name: 'Cash on Hand', nameArabic: 'النقد في الصندوق', type: 'Asset' },
      { code: '1120', name: 'Emirates NBD - Current Account', nameArabic: 'بنك الإمارات دبي الوطني - الحساب الجاري', type: 'Asset' },
      { code: '1130', name: 'ADCB - Savings Account', nameArabic: 'بنك أبوظبي التجاري - حساب التوفير', type: 'Asset' },
      { code: '1200', name: 'Accounts Receivable', nameArabic: 'العملاء', type: 'Asset' },
      { code: '1210', name: 'Trade Debtors', nameArabic: 'المدينون التجاريون', type: 'Asset' },
      { code: '1220', name: 'Other Receivables', nameArabic: 'المدينون الآخرون', type: 'Asset' },
      { code: '1300', name: 'Inventory', nameArabic: 'المخزون', type: 'Asset' },
      { code: '1310', name: 'Raw Materials - Oud', nameArabic: 'المواد الخام - العود', type: 'Asset' },
      { code: '1320', name: 'Raw Materials - Rose & Florals', nameArabic: 'المواد الخام - الورد والزهور', type: 'Asset' },
      { code: '1330', name: 'Semi-Finished Goods', nameArabic: 'البضائع نصف المصنعة', type: 'Asset' },
      { code: '1340', name: 'Finished Goods - Perfumes', nameArabic: 'البضائع الجاهزة - العطور', type: 'Asset' },
      { code: '1350', name: 'Packaging Materials', nameArabic: 'مواد التعبئة والتغليف', type: 'Asset' },
      { code: '1400', name: 'Prepaid Expenses', nameArabic: 'المصروفات المدفوعة مقدماً', type: 'Asset' },
      { code: '1500', name: 'VAT Recoverable', nameArabic: 'ضريبة القيمة المضافة القابلة للاسترداد', type: 'Asset' }
    ]
  },
  // Fixed Assets (1500-1999)
  {
    code: '1600',
    name: 'Fixed Assets',
    nameArabic: 'الأصول الثابتة',
    type: 'Asset',
    category: 'Fixed Assets',
    children: [
      { code: '1610', name: 'Production Equipment', nameArabic: 'معدات الإنتاج', type: 'Asset' },
      { code: '1620', name: 'Distillation Equipment', nameArabic: 'معدات التقطير', type: 'Asset' },
      { code: '1630', name: 'Store Fixtures & Fittings', nameArabic: 'تجهيزات المتاجر', type: 'Asset' },
      { code: '1640', name: 'Vehicles', nameArabic: 'المركبات', type: 'Asset' },
      { code: '1650', name: 'Computer Equipment', nameArabic: 'معدات الحاسوب', type: 'Asset' },
      { code: '1660', name: 'Accumulated Depreciation', nameArabic: 'مجمع الإهلاك', type: 'Asset' }
    ]
  },
  // Liabilities (2000-2999)
  {
    code: '2000',
    name: 'Current Liabilities',
    nameArabic: 'الخصوم المتداولة',
    type: 'Liability',
    category: 'Current Liabilities',
    children: [
      { code: '2100', name: 'Accounts Payable', nameArabic: 'الدائنون', type: 'Liability' },
      { code: '2110', name: 'Trade Creditors', nameArabic: 'الدائنون التجاريون', type: 'Liability' },
      { code: '2120', name: 'Other Payables', nameArabic: 'الدائنون الآخرون', type: 'Liability' },
      { code: '2200', name: 'VAT Payable', nameArabic: 'ضريبة القيمة المضافة المستحقة', type: 'Liability' },
      { code: '2210', name: 'Output VAT', nameArabic: 'ضريبة القيمة المضافة على المبيعات', type: 'Liability' },
      { code: '2220', name: 'Input VAT', nameArabic: 'ضريبة القيمة المضافة على المشتريات', type: 'Liability' },
      { code: '2300', name: 'Accrued Expenses', nameArabic: 'المصروفات المستحقة', type: 'Liability' },
      { code: '2400', name: 'Short-term Loans', nameArabic: 'القروض قصيرة الأجل', type: 'Liability' }
    ]
  },
  // Long-term Liabilities (2500-2999)
  {
    code: '2500',
    name: 'Long-term Liabilities',
    nameArabic: 'الخصوم طويلة الأجل',
    type: 'Liability',
    category: 'Long-term Liabilities',
    children: [
      { code: '2510', name: 'Bank Loans', nameArabic: 'القروض البنكية', type: 'Liability' },
      { code: '2520', name: 'Equipment Finance', nameArabic: 'تمويل المعدات', type: 'Liability' }
    ]
  },
  // Equity (3000-3999)
  {
    code: '3000',
    name: 'Equity',
    nameArabic: 'حقوق الملكية',
    type: 'Equity',
    category: 'Equity',
    children: [
      { code: '3100', name: 'Share Capital', nameArabic: 'رأس المال', type: 'Equity' },
      { code: '3200', name: 'Retained Earnings', nameArabic: 'الأرباح المحتجزة', type: 'Equity' },
      { code: '3300', name: 'Current Year Earnings', nameArabic: 'أرباح السنة الجارية', type: 'Equity' }
    ]
  },
  // Revenue (4000-4999)
  {
    code: '4000',
    name: 'Revenue',
    nameArabic: 'الإيرادات',
    type: 'Revenue',
    category: 'Sales Revenue',
    children: [
      { code: '4100', name: 'Sales - Oud Products', nameArabic: 'مبيعات - منتجات العود', type: 'Revenue' },
      { code: '4110', name: 'Sales - Premium Oud', nameArabic: 'مبيعات - العود الفاخر', type: 'Revenue' },
      { code: '4120', name: 'Sales - Standard Oud', nameArabic: 'مبيعات - العود العادي', type: 'Revenue' },
      { code: '4200', name: 'Sales - Attars', nameArabic: 'مبيعات - العطور', type: 'Revenue' },
      { code: '4210', name: 'Sales - Rose Attars', nameArabic: 'مبيعات - عطر الورد', type: 'Revenue' },
      { code: '4220', name: 'Sales - Floral Attars', nameArabic: 'مبيعات - العطور الزهرية', type: 'Revenue' },
      { code: '4300', name: 'Sales - Gift Sets', nameArabic: 'مبيعات - طقم الهدايا', type: 'Revenue' },
      { code: '4400', name: 'Sales - Accessories', nameArabic: 'مبيعات - الإكسسوارات', type: 'Revenue' },
      { code: '4500', name: 'Other Revenue', nameArabic: 'إيرادات أخرى', type: 'Revenue' }
    ]
  },
  // Cost of Goods Sold (5000-5999)
  {
    code: '5000',
    name: 'Cost of Goods Sold',
    nameArabic: 'تكلفة البضاعة المباعة',
    type: 'Expense',
    category: 'Cost of Sales',
    children: [
      { code: '5100', name: 'Raw Material Costs', nameArabic: 'تكلفة المواد الخام', type: 'Expense' },
      { code: '5110', name: 'Oud Raw Materials', nameArabic: 'المواد الخام للعود', type: 'Expense' },
      { code: '5120', name: 'Rose & Floral Materials', nameArabic: 'مواد الورد والزهور', type: 'Expense' },
      { code: '5200', name: 'Production Costs', nameArabic: 'تكاليف الإنتاج', type: 'Expense' },
      { code: '5210', name: 'Direct Labor', nameArabic: 'العمالة المباشرة', type: 'Expense' },
      { code: '5220', name: 'Production Overheads', nameArabic: 'المصروفات الإنتاجية العامة', type: 'Expense' },
      { code: '5300', name: 'Packaging Costs', nameArabic: 'تكاليف التعبئة والتغليف', type: 'Expense' }
    ]
  },
  // Operating Expenses (6000-6999)
  {
    code: '6000',
    name: 'Operating Expenses',
    nameArabic: 'المصروفات التشغيلية',
    type: 'Expense',
    category: 'Operating Expenses',
    children: [
      { code: '6100', name: 'Selling Expenses', nameArabic: 'مصروفات البيع', type: 'Expense' },
      { code: '6110', name: 'Sales Staff Salaries', nameArabic: 'رواتب موظفي المبيعات', type: 'Expense' },
      { code: '6120', name: 'Marketing & Advertising', nameArabic: 'التسويق والإعلان', type: 'Expense' },
      { code: '6130', name: 'Store Rent', nameArabic: 'إيجار المتاجر', type: 'Expense' },
      { code: '6200', name: 'Administrative Expenses', nameArabic: 'المصروفات الإدارية', type: 'Expense' },
      { code: '6210', name: 'Office Rent', nameArabic: 'إيجار المكتب', type: 'Expense' },
      { code: '6220', name: 'Admin Staff Salaries', nameArabic: 'رواتب الموظفين الإداريين', type: 'Expense' },
      { code: '6230', name: 'Utilities', nameArabic: 'المرافق', type: 'Expense' },
      { code: '6240', name: 'Professional Fees', nameArabic: 'الأتعاب المهنية', type: 'Expense' },
      { code: '6250', name: 'Insurance', nameArabic: 'التأمين', type: 'Expense' },
      { code: '6260', name: 'Depreciation', nameArabic: 'الإهلاك', type: 'Expense' }
    ]
  }
];

// Sample financial transactions
const financialTransactions = [
  {
    id: 'TXN001',
    date: '2024-01-22',
    reference: 'INV-2024-001',
    description: 'Sale to Ahmed Al-Rashid - Premium Oud Collection',
    descriptionArabic: 'بيع لأحمد الراشد - مجموعة العود الفاخر',
    type: 'Sales Invoice',
    customer: 'Ahmed Al-Rashid',
    amount: 1250.00,
    vatAmount: 59.52,
    totalAmount: 1309.52,
    currency: 'AED',
    status: 'Paid',
    paymentMethod: 'Credit Card',
    journalEntries: [
      { account: '1120', accountName: 'Emirates NBD - Current Account', debit: 1309.52, credit: 0 },
      { account: '4110', accountName: 'Sales - Premium Oud', debit: 0, credit: 1250.00 },
      { account: '2210', accountName: 'Output VAT', debit: 0, credit: 59.52 }
    ]
  },
  {
    id: 'TXN002',
    date: '2024-01-20',
    reference: 'PO-2024-001',
    description: 'Purchase from Asia Oud Trading - Raw Materials',
    descriptionArabic: 'شراء من شركة آسيا للعود - مواد خام',
    type: 'Purchase Invoice',
    vendor: 'Asia Oud Trading LLC',
    amount: 25000.00,
    vatAmount: 1250.00,
    totalAmount: 26250.00,
    currency: 'AED',
    status: 'Pending Payment',
    paymentTerms: 'Net 30',
    journalEntries: [
      { account: '5110', accountName: 'Oud Raw Materials', debit: 25000.00, credit: 0 },
      { account: '1500', accountName: 'VAT Recoverable', debit: 1250.00, credit: 0 },
      { account: '2110', accountName: 'Trade Creditors', debit: 0, credit: 26250.00 }
    ]
  },
  {
    id: 'TXN003',
    date: '2024-01-18',
    reference: 'JE-2024-001',
    description: 'Monthly Store Rent Payment - Mall of Emirates',
    descriptionArabic: 'دفع إيجار شهري - مول الإمارات',
    type: 'Journal Entry',
    amount: 15000.00,
    vatAmount: 750.00,
    totalAmount: 15750.00,
    currency: 'AED',
    status: 'Posted',
    journalEntries: [
      { account: '6130', accountName: 'Store Rent', debit: 15000.00, credit: 0 },
      { account: '1500', accountName: 'VAT Recoverable', debit: 750.00, credit: 0 },
      { account: '1120', accountName: 'Emirates NBD - Current Account', debit: 0, credit: 15750.00 }
    ]
  },
  {
    id: 'TXN004',
    date: '2024-01-15',
    reference: 'SAL-2024-002',
    description: 'Corporate Sale - Emirates Airlines Gift Sets',
    descriptionArabic: 'بيع للشركات - طقم هدايا طيران الإمارات',
    type: 'Sales Invoice',
    customer: 'Emirates Airlines',
    amount: 48000.00,
    vatAmount: 2400.00,
    totalAmount: 50400.00,
    currency: 'AED',
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    journalEntries: [
      { account: '1120', accountName: 'Emirates NBD - Current Account', debit: 50400.00, credit: 0 },
      { account: '4300', accountName: 'Sales - Gift Sets', debit: 0, credit: 48000.00 },
      { account: '2210', accountName: 'Output VAT', debit: 0, credit: 2400.00 }
    ]
  }
];

// VAT Return data
const vatReturns = [
  {
    id: 'VAT-2024-01',
    period: 'January 2024',
    periodArabic: 'يناير 2024',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    dueDate: '2024-02-28',
    status: 'Draft',
    totalSales: 125000.00,
    taxableSales: 125000.00,
    zeroRatedSales: 0.00,
    exemptSales: 0.00,
    outputVAT: 6250.00,
    totalPurchases: 85000.00,
    taxablePurchases: 85000.00,
    inputVAT: 4250.00,
    vatPayable: 2000.00,
    adjustments: 0.00,
    finalVATDue: 2000.00,
    breakdown: {
      standardRateSales: { amount: 125000.00, vat: 6250.00, rate: 5 },
      standardRatePurchases: { amount: 85000.00, vat: 4250.00, rate: 5 }
    }
  },
  {
    id: 'VAT-2023-12',
    period: 'December 2023',
    periodArabic: 'ديسمبر 2023',
    startDate: '2023-12-01',
    endDate: '2023-12-31',
    dueDate: '2024-01-28',
    status: 'Submitted',
    totalSales: 185000.00,
    taxableSales: 185000.00,
    zeroRatedSales: 0.00,
    exemptSales: 0.00,
    outputVAT: 9250.00,
    totalPurchases: 95000.00,
    taxablePurchases: 95000.00,
    inputVAT: 4750.00,
    vatPayable: 4500.00,
    adjustments: 0.00,
    finalVATDue: 4500.00,
    submissionDate: '2024-01-25',
    paymentDate: '2024-01-26',
    breakdown: {
      standardRateSales: { amount: 185000.00, vat: 9250.00, rate: 5 },
      standardRatePurchases: { amount: 95000.00, vat: 4750.00, rate: 5 }
    }
  }
];

// Financial reports data
const financialReports = {
  profitLoss: {
    period: 'January 2024',
    revenue: {
      salesOudProducts: 85000,
      salesAttars: 35000,
      salesGiftSets: 25000,
      salesAccessories: 8000,
      otherRevenue: 2000,
      totalRevenue: 155000
    },
    costOfSales: {
      rawMaterials: 45000,
      productionCosts: 18000,
      packagingCosts: 5000,
      totalCOGS: 68000
    },
    grossProfit: 87000,
    operatingExpenses: {
      salesExpenses: 25000,
      adminExpenses: 18000,
      marketingExpenses: 12000,
      totalOpEx: 55000
    },
    netProfit: 32000,
    profitMargin: 20.6
  },
  balanceSheet: {
    asOfDate: '2024-01-31',
    assets: {
      currentAssets: {
        cashAndBank: 125000,
        accountsReceivable: 45000,
        inventory: 285000,
        prepaidExpenses: 15000,
        vatRecoverable: 25000,
        totalCurrentAssets: 495000
      },
      fixedAssets: {
        equipment: 185000,
        accumulatedDepreciation: -45000,
        totalFixedAssets: 140000
      },
      totalAssets: 635000
    },
    liabilities: {
      currentLiabilities: {
        accountsPayable: 85000,
        vatPayable: 15000,
        accruedExpenses: 25000,
        totalCurrentLiabilities: 125000
      },
      longTermLiabilities: {
        bankLoans: 150000,
        totalLongTermLiabilities: 150000
      },
      totalLiabilities: 275000
    },
    equity: {
      shareCapital: 200000,
      retainedEarnings: 128000,
      currentYearEarnings: 32000,
      totalEquity: 360000
    }
  }
};

export default function FinanceAccountingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [selectedVATReturn, setSelectedVATReturn] = useState<any>(null);
  const [isNewTransactionDialogOpen, setIsNewTransactionDialogOpen] = useState(false);
  const [isJournalEntryDialogOpen, setIsJournalEntryDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('current_month');

  // Calculate financial statistics
  const calculateFinancialStats = () => {
    const totalRevenue = financialTransactions
      .filter(t => t.type === 'Sales Invoice' && t.status === 'Paid')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = financialTransactions
      .filter(t => t.type === 'Purchase Invoice' || t.type === 'Journal Entry')
      .reduce((sum, t) => sum + t.amount, 0);

    const vatCollected = financialTransactions
      .filter(t => t.type === 'Sales Invoice')
      .reduce((sum, t) => sum + t.vatAmount, 0);

    const vatPaid = financialTransactions
      .filter(t => t.type === 'Purchase Invoice' || t.type === 'Journal Entry')
      .reduce((sum, t) => sum + t.vatAmount, 0);

    const pendingInvoices = financialTransactions
      .filter(t => t.status === 'Pending Payment')
      .reduce((sum, t) => sum + t.totalAmount, 0);

    return {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      vatCollected,
      vatPaid,
      vatDue: vatCollected - vatPaid,
      pendingInvoices
    };
  };

  const stats = calculateFinancialStats();

  // Get status color for badges
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'posted':
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'pending payment':
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter transactions
  const getFilteredTransactions = () => {
    return financialTransactions.filter(transaction => {
      const matchesSearch = searchTerm === '' ||
        transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.descriptionArabic.includes(searchTerm);

      const matchesType = transactionTypeFilter === 'all' || transaction.type === transactionTypeFilter;
      const matchesStatus = statusFilter === 'all' || transaction.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  };

  // Render transaction card
  const renderTransactionCard = (transaction: any) => (
    <Card key={transaction.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedTransaction(transaction)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-sm">{transaction.reference}</h3>
              <Badge variant="outline" className="text-xs">
                {transaction.type}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mb-1">{transaction.description}</p>
            <p className="text-xs text-gray-500">{transaction.descriptionArabic}</p>
          </div>
          <div className="text-right">
            <Badge className={getStatusColor(transaction.status)} variant="secondary">
              {transaction.status}
            </Badge>
            <p className="text-xs text-gray-500 mt-1">{transaction.date}</p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">{transaction.currency} {transaction.amount?.toLocaleString() || "0"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">VAT:</span>
            <span className="font-medium">{transaction.currency} {transaction.vatAmount?.toLocaleString() || "0"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total:</span>
            <span className="font-medium text-green-600">{transaction.currency} {transaction.totalAmount?.toLocaleString() || "0"}</span>
          </div>
          {(transaction.customer || transaction.vendor) && (
            <div className="flex justify-between">
              <span className="text-gray-600">{transaction.customer ? 'Customer' : 'Vendor'}:</span>
              <span className="font-medium">{transaction.customer || transaction.vendor}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-3 pt-2 border-t">
          <span className="text-xs text-gray-500">{transaction.paymentMethod || transaction.paymentTerms}</span>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Eye className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Edit className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Printer className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                <Calculator className="h-6 w-6 mr-2 text-green-600" />
                Finance & Accounting
              </h1>
              <Badge className="bg-green-100 text-green-800">
                <Shield className="h-3 w-3 mr-1" />
                UAE VAT Compliant
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-1" />
              Reports
            </Button>
            <Dialog open={isNewTransactionDialogOpen} onOpenChange={setIsNewTransactionDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-1" />
                  New Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Transaction</DialogTitle>
                  <DialogDescription>
                    Record a new financial transaction with VAT calculation
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Transaction Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales_invoice">Sales Invoice</SelectItem>
                          <SelectItem value="purchase_invoice">Purchase Invoice</SelectItem>
                          <SelectItem value="receipt">Receipt</SelectItem>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="journal_entry">Journal Entry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div>
                    <Label>Reference Number</Label>
                    <Input placeholder="Auto-generated" disabled />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input placeholder="Transaction description" />
                  </div>
                  <div>
                    <Label>Description (Arabic)</Label>
                    <Input placeholder="وصف المعاملة" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Amount (Excl. VAT)</Label>
                      <Input type="number" step="0.01" placeholder="0.00" />
                    </div>
                    <div>
                      <Label>VAT Rate (%)</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="5%" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5% (Standard Rate)</SelectItem>
                          <SelectItem value="0">0% (Zero Rated)</SelectItem>
                          <SelectItem value="exempt">Exempt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>VAT Amount</Label>
                      <Input type="number" step="0.01" placeholder="0.00" disabled />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsNewTransactionDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsNewTransactionDialogOpen(false)}>
                      Create Transaction
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Financial Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">AED {stats.totalRevenue?.toLocaleString() || "0"}</p>
                  <p className="text-xs text-gray-500">this month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Net Profit</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">AED {stats.netProfit?.toLocaleString() || "0"}</p>
                  <p className="text-xs text-gray-500">{((stats.netProfit / stats.totalRevenue) * 100).toFixed(1)}% margin</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">VAT Due</p>
                  <p className="text-xl sm:text-2xl font-bold text-amber-600">AED {stats.vatDue?.toLocaleString() || "0"}</p>
                  <p className="text-xs text-gray-500">net payable</p>
                </div>
                <Receipt className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Invoices</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">AED {stats.pendingInvoices?.toLocaleString() || "0"}</p>
                  <p className="text-xs text-gray-500">outstanding</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="vat">VAT Returns</TabsTrigger>
            <TabsTrigger value="reports">Financial Reports</TabsTrigger>
            <TabsTrigger value="accounts">Chart of Accounts</TabsTrigger>
            <TabsTrigger value="compliance">UAE Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Revenue Breakdown - January 2024
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(financialReports.profitLoss.revenue).filter(([key]) => key !== 'totalRevenue').map(([key, value]) => {
                      const percentage = ((value as number) / financialReports.profitLoss.revenue.totalRevenue * 100).toFixed(1);
                      return (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">AED {(value as number)?.toLocaleString() || "0"}</span>
                            <span className="text-xs text-gray-500">({percentage}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Profit & Loss Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Revenue:</span>
                      <span className="font-bold text-green-600">AED {financialReports.profitLoss.revenue.totalRevenue?.toLocaleString() || "0"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cost of Goods Sold:</span>
                      <span className="font-medium text-red-600">AED {financialReports.profitLoss.costOfSales.totalCOGS?.toLocaleString() || "0"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Gross Profit:</span>
                      <span className="font-bold text-blue-600">AED {financialReports.profitLoss.grossProfit?.toLocaleString() || "0"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Operating Expenses:</span>
                      <span className="font-medium text-orange-600">AED {financialReports.profitLoss.operatingExpenses.totalOpEx?.toLocaleString() || "0"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Net Profit:</span>
                      <span className="font-bold text-green-600">AED {financialReports.profitLoss.netProfit?.toLocaleString() || "0"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Profit Margin:</span>
                      <span className="font-medium">{financialReports.profitLoss.profitMargin}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    VAT Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">VAT Collected (Output VAT):</span>
                      <span className="font-medium text-green-600">AED {stats.vatCollected?.toLocaleString() || "0"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">VAT Paid (Input VAT):</span>
                      <span className="font-medium text-blue-600">AED {stats.vatPaid?.toLocaleString() || "0"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Net VAT Due:</span>
                      <span className="font-bold text-amber-600">AED {stats.vatDue?.toLocaleString() || "0"}</span>
                    </div>
                    <div className="mt-4 p-3 bg-amber-50 rounded">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">Next VAT Return Due</span>
                      </div>
                      <p className="text-sm text-amber-700 mt-1">February 28, 2024</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Cash Flow Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cash & Bank Balance:</span>
                      <span className="font-bold text-green-600">AED {financialReports.balanceSheet.assets.currentAssets.cashAndBank?.toLocaleString() || "0"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Accounts Receivable:</span>
                      <span className="font-medium">AED {financialReports.balanceSheet.assets.currentAssets.accountsReceivable?.toLocaleString() || "0"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Accounts Payable:</span>
                      <span className="font-medium text-red-600">AED {financialReports.balanceSheet.liabilities.currentLiabilities.accountsPayable?.toLocaleString() || "0"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pending Invoices:</span>
                      <span className="font-medium text-orange-600">AED {stats.pendingInvoices?.toLocaleString() || "0"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="mt-6">
            {/* Filters and Search */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={transactionTypeFilter} onValueChange={setTransactionTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Sales Invoice">Sales Invoice</SelectItem>
                      <SelectItem value="Purchase Invoice">Purchase Invoice</SelectItem>
                      <SelectItem value="Journal Entry">Journal Entry</SelectItem>
                      <SelectItem value="Receipt">Receipt</SelectItem>
                      <SelectItem value="Payment">Payment</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending payment">Pending Payment</SelectItem>
                      <SelectItem value="posted">Posted</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={isJournalEntryDialogOpen} onOpenChange={setIsJournalEntryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Journal Entry
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Create Journal Entry</DialogTitle>
                        <DialogDescription>
                          Create a manual journal entry with debit and credit accounts
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Date</Label>
                            <Input type="date" />
                          </div>
                          <div>
                            <Label>Reference</Label>
                            <Input placeholder="JE-2024-XXX" />
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input placeholder="Journal entry description" />
                        </div>
                        <div>
                          <Label>Description (Arabic)</Label>
                          <Input placeholder="وصف قيد اليومية" />
                        </div>

                        <div className="border rounded p-4">
                          <h4 className="font-medium mb-3">Journal Entry Lines</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Account</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Debit</TableHead>
                                <TableHead>Credit</TableHead>
                                <TableHead>Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  <Select>
                                    <SelectTrigger className="w-32">
                                      <SelectValue placeholder="Account" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {chartOfAccounts.flatMap(category =>
                                        category.children?.map(account => (
                                          <SelectItem key={account.code} value={account.code}>
                                            {account.code} - {account.name}
                                          </SelectItem>
                                        )) || []
                                      )}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <Input placeholder="Line description" />
                                </TableCell>
                                <TableCell>
                                  <Input type="number" step="0.01" placeholder="0.00" />
                                </TableCell>
                                <TableCell>
                                  <Input type="number" step="0.01" placeholder="0.00" />
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                          <Button variant="outline" size="sm" className="mt-2">
                            <Plus className="h-4 w-4 mr-1" />
                            Add Line
                          </Button>

                          <div className="mt-4 p-3 bg-gray-50 rounded">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Total Debits:</span>
                                <p className="font-medium">AED 0.00</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Total Credits:</span>
                                <p className="font-medium">AED 0.00</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Difference:</span>
                                <p className="font-medium text-red-600">AED 0.00</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsJournalEntryDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setIsJournalEntryDialogOpen(false)}>
                            Post Journal Entry
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredTransactions().map(renderTransactionCard)}
            </div>
          </TabsContent>

          <TabsContent value="vat" className="mt-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">UAE VAT Returns</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  Prepare VAT Return
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    VAT Compliance Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-medium text-green-800">VAT Registered</h4>
                      <p className="text-sm text-green-600">TRN: 123456789012345</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded">
                      <CalendarIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-medium text-blue-800">Current Period</h4>
                      <p className="text-sm text-blue-600">January 2024 (Monthly)</p>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded">
                      <Clock className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                      <h4 className="font-medium text-amber-800">Next Due Date</h4>
                      <p className="text-sm text-amber-600">February 28, 2024</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {vatReturns.map(vatReturn => (
                  <Card key={vatReturn.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedVATReturn(vatReturn)}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{vatReturn.period}</CardTitle>
                        <Badge className={getStatusColor(vatReturn.status)} variant="secondary">
                          {vatReturn.status}
                        </Badge>
                      </div>
                      <CardDescription>{vatReturn.periodArabic}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Total Sales:</span>
                            <p className="font-medium">AED {vatReturn.totalSales?.toLocaleString() || "0"}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Output VAT:</span>
                            <p className="font-medium">AED {vatReturn.outputVAT?.toLocaleString() || "0"}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Total Purchases:</span>
                            <p className="font-medium">AED {vatReturn.totalPurchases?.toLocaleString() || "0"}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Input VAT:</span>
                            <p className="font-medium">AED {vatReturn.inputVAT?.toLocaleString() || "0"}</p>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Final VAT Due:</span>
                          <span className="font-bold text-amber-600">AED {vatReturn.finalVATDue?.toLocaleString() || "0"}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Due Date:</span>
                          <span className="font-medium">{vatReturn.dueDate}</span>
                        </div>
                        {vatReturn.submissionDate && (
                          <div className="flex justify-between items-center text-sm text-green-600">
                            <span>Submitted:</span>
                            <span className="font-medium">{vatReturn.submissionDate}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Financial Reports</h3>
                <div className="flex space-x-2">
                  <Select defaultValue="current_month">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current_month">Current Month</SelectItem>
                      <SelectItem value="last_month">Last Month</SelectItem>
                      <SelectItem value="quarter">Current Quarter</SelectItem>
                      <SelectItem value="year">Current Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Export PDF
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profit & Loss Statement</CardTitle>
                    <CardDescription>January 2024</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="font-medium text-green-600">REVENUE</div>
                      {Object.entries(financialReports.profitLoss.revenue).filter(([key]) => key !== 'totalRevenue').map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm pl-4">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span>AED {(value as number)?.toLocaleString() || "0"}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>Total Revenue</span>
                        <span className="text-green-600">AED {financialReports.profitLoss.revenue.totalRevenue?.toLocaleString() || "0"}</span>
                      </div>

                      <div className="font-medium text-red-600 mt-4">COST OF GOODS SOLD</div>
                      {Object.entries(financialReports.profitLoss.costOfSales).filter(([key]) => key !== 'totalCOGS').map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm pl-4">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span>AED {(value as number)?.toLocaleString() || "0"}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>Total COGS</span>
                        <span className="text-red-600">AED {financialReports.profitLoss.costOfSales.totalCOGS?.toLocaleString() || "0"}</span>
                      </div>

                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>GROSS PROFIT</span>
                        <span className="text-blue-600">AED {financialReports.profitLoss.grossProfit?.toLocaleString() || "0"}</span>
                      </div>

                      <div className="font-medium text-orange-600 mt-4">OPERATING EXPENSES</div>
                      {Object.entries(financialReports.profitLoss.operatingExpenses).filter(([key]) => key !== 'totalOpEx').map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm pl-4">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span>AED {(value as number)?.toLocaleString() || "0"}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>Total Operating Expenses</span>
                        <span className="text-orange-600">AED {financialReports.profitLoss.operatingExpenses.totalOpEx?.toLocaleString() || "0"}</span>
                      </div>

                      <div className="flex justify-between font-bold text-xl border-t-2 border-gray-300 pt-3">
                        <span>NET PROFIT</span>
                        <span className="text-green-600">AED {financialReports.profitLoss.netProfit?.toLocaleString() || "0"}</span>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        Profit Margin: {financialReports.profitLoss.profitMargin}%
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Balance Sheet</CardTitle>
                    <CardDescription>As of January 31, 2024</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="font-medium text-blue-600">ASSETS</div>

                      <div className="font-medium text-sm pl-2">Current Assets</div>
                      {Object.entries(financialReports.balanceSheet.assets.currentAssets).filter(([key]) => key !== 'totalCurrentAssets').map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm pl-4">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span>AED {(value as number)?.toLocaleString() || "0"}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-medium border-t pt-1 pl-2">
                        <span>Total Current Assets</span>
                        <span>AED {financialReports.balanceSheet.assets.currentAssets.totalCurrentAssets?.toLocaleString() || "0"}</span>
                      </div>

                      <div className="font-medium text-sm pl-2">Fixed Assets</div>
                      {Object.entries(financialReports.balanceSheet.assets.fixedAssets).filter(([key]) => key !== 'totalFixedAssets').map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm pl-4">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span>AED {(value as number)?.toLocaleString() || "0"}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-medium border-t pt-1 pl-2">
                        <span>Total Fixed Assets</span>
                        <span>AED {financialReports.balanceSheet.assets.fixedAssets.totalFixedAssets?.toLocaleString() || "0"}</span>
                      </div>

                      <div className="flex justify-between font-bold border-t-2 pt-2">
                        <span>TOTAL ASSETS</span>
                        <span className="text-blue-600">AED {financialReports.balanceSheet.assets.totalAssets?.toLocaleString() || "0"}</span>
                      </div>

                      <div className="font-medium text-red-600 mt-4">LIABILITIES</div>

                      <div className="font-medium text-sm pl-2">Current Liabilities</div>
                      {Object.entries(financialReports.balanceSheet.liabilities.currentLiabilities).filter(([key]) => key !== 'totalCurrentLiabilities').map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm pl-4">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span>AED {(value as number)?.toLocaleString() || "0"}</span>
                        </div>
                      ))}

                      <div className="font-medium text-sm pl-2">Long-term Liabilities</div>
                      {Object.entries(financialReports.balanceSheet.liabilities.longTermLiabilities).filter(([key]) => key !== 'totalLongTermLiabilities').map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm pl-4">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span>AED {(value as number)?.toLocaleString() || "0"}</span>
                        </div>
                      ))}

                      <div className="flex justify-between font-bold border-t pt-2">
                        <span>TOTAL LIABILITIES</span>
                        <span className="text-red-600">AED {financialReports.balanceSheet.liabilities.totalLiabilities?.toLocaleString() || "0"}</span>
                      </div>

                      <div className="font-medium text-green-600 mt-4">EQUITY</div>
                      {Object.entries(financialReports.balanceSheet.equity).filter(([key]) => key !== 'totalEquity').map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm pl-4">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span>AED {(value as number)?.toLocaleString() || "0"}</span>
                        </div>
                      ))}

                      <div className="flex justify-between font-bold border-t-2 border-gray-300 pt-3">
                        <span>TOTAL EQUITY</span>
                        <span className="text-green-600">AED {financialReports.balanceSheet.equity.totalEquity?.toLocaleString() || "0"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accounts" className="mt-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Chart of Accounts</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Account
                </Button>
              </div>

              <div className="space-y-4">
                {chartOfAccounts.map(category => (
                  <Card key={category.code}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{category.code} - {category.name}</span>
                        <Badge variant="outline">{category.type}</Badge>
                      </CardTitle>
                      <CardDescription>{category.nameArabic}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {category.children?.map(account => (
                          <div key={account.code} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div className="flex-1">
                              <span className="font-medium text-sm">{account.code} - {account.name}</span>
                              <p className="text-xs text-gray-600">{account.nameArabic}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="text-xs">
                                {account.type}
                              </Badge>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="mt-6">
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Flag className="h-5 w-5 mr-2" />
                    UAE VAT Compliance Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">VAT Registration Requirements</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Mandatory Registration Threshold:</span>
                          <span className="font-medium">AED {uaeVATConfig.registrationThreshold?.toLocaleString() || "0"}/year</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Voluntary Registration Threshold:</span>
                          <span className="font-medium">AED {uaeVATConfig.voluntaryThreshold?.toLocaleString() || "0"}/year</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Standard VAT Rate:</span>
                          <span className="font-medium">{uaeVATConfig.standardRate}%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Filing Requirements</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Monthly Returns Due:</span>
                          <span className="font-medium">{uaeVATConfig.dueDates.monthly}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quarterly Returns Due:</span>
                          <span className="font-medium">{uaeVATConfig.dueDates.quarterly}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Late Submission Penalty:</span>
                          <span className="font-medium text-red-600">AED {uaeVATConfig.penalties.lateSubmission}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Late Payment Penalty:</span>
                          <span className="font-medium text-red-600">{uaeVATConfig.penalties.latePayment}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Standard Rated (5%)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>• All perfume and fragrance sales</div>
                      <div>• Oud and attar products</div>
                      <div>• Cosmetics and beauty products</div>
                      <div>• Packaging materials</div>
                      <div>• Equipment and machinery</div>
                      <div>• Professional services</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Zero Rated (0%)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {uaeVATConfig.zeroRated.map((item, index) => (
                        <div key={index}>• {item}</div>
                      ))}
                      <div>• Exports outside UAE</div>
                      <div>• International transport</div>
                      <div>• Qualifying food items</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Exempt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {uaeVATConfig.exempt.map((item, index) => (
                        <div key={index}>• {item}</div>
                      ))}
                      <div>• Local passenger transport</div>
                      <div>• Bare land sales</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>VAT Compliance Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">✓ Completed</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>VAT registration obtained</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>TRN displayed on invoices</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>VAT-compliant invoice format</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Separate VAT accounting</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Record keeping system in place</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-amber-600">⚠ Ongoing Requirements</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-amber-600" />
                          <span>Submit monthly VAT returns by 28th</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-amber-600" />
                          <span>Pay VAT due within deadline</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-amber-600" />
                          <span>Maintain VAT records for 5 years</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-amber-600" />
                          <span>Update business changes with FTA</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-amber-600" />
                          <span>Annual VAT audit readiness</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Transaction Detail Dialog */}
      {selectedTransaction && (
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Receipt className="h-5 w-5 mr-2" />
                {selectedTransaction.reference} - Transaction Details
              </DialogTitle>
              <DialogDescription>
                {selectedTransaction.type} • {selectedTransaction.date}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h4 className="font-semibold mb-3">Transaction Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Reference:</span>
                    <span className="font-medium">{selectedTransaction.reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium">{selectedTransaction.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{selectedTransaction.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className={getStatusColor(selectedTransaction.status)} variant="secondary">
                      {selectedTransaction.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Description:</span>
                    <span className="font-medium">{selectedTransaction.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Description (Arabic):</span>
                    <span className="font-medium">{selectedTransaction.descriptionArabic}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Financial Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Amount (Excl. VAT):</span>
                    <span className="font-medium">{selectedTransaction.currency} {selectedTransaction.amount?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT Amount:</span>
                    <span className="font-medium">{selectedTransaction.currency} {selectedTransaction.vatAmount?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-bold text-green-600">{selectedTransaction.currency} {selectedTransaction.totalAmount?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Currency:</span>
                    <span className="font-medium">{selectedTransaction.currency}</span>
                  </div>
                  {selectedTransaction.customer && (
                    <div className="flex justify-between">
                      <span>Customer:</span>
                      <span className="font-medium">{selectedTransaction.customer}</span>
                    </div>
                  )}
                  {selectedTransaction.vendor && (
                    <div className="flex justify-between">
                      <span>Vendor:</span>
                      <span className="font-medium">{selectedTransaction.vendor}</span>
                    </div>
                  )}
                  {selectedTransaction.paymentMethod && (
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span className="font-medium">{selectedTransaction.paymentMethod}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Journal Entries</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Code</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Debit</TableHead>
                    <TableHead>Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedTransaction.journalEntries.map((entry: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{entry.account}</TableCell>
                      <TableCell>{entry.accountName}</TableCell>
                      <TableCell>{entry.debit > 0 ? `AED ${entry.debit?.toLocaleString() || "0"}` : '-'}</TableCell>
                      <TableCell>{entry.credit > 0 ? `AED ${entry.credit?.toLocaleString() || "0"}` : '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setSelectedTransaction(null)}>
                Close
              </Button>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button>
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* VAT Return Detail Dialog */}
      {selectedVATReturn && (
        <Dialog open={!!selectedVATReturn} onOpenChange={() => setSelectedVATReturn(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                UAE VAT Return - {selectedVATReturn.period}
              </DialogTitle>
              <DialogDescription>
                {selectedVATReturn.periodArabic} • {selectedVATReturn.startDate} to {selectedVATReturn.endDate}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Return Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Return ID:</span>
                      <span className="font-medium">{selectedVATReturn.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Period:</span>
                      <span className="font-medium">{selectedVATReturn.period}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Due Date:</span>
                      <span className="font-medium">{selectedVATReturn.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className={getStatusColor(selectedVATReturn.status)} variant="secondary">
                        {selectedVATReturn.status}
                      </Badge>
                    </div>
                    {selectedVATReturn.submissionDate && (
                      <div className="flex justify-between">
                        <span>Submission Date:</span>
                        <span className="font-medium text-green-600">{selectedVATReturn.submissionDate}</span>
                      </div>
                    )}
                    {selectedVATReturn.paymentDate && (
                      <div className="flex justify-between">
                        <span>Payment Date:</span>
                        <span className="font-medium text-green-600">{selectedVATReturn.paymentDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">VAT Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Output VAT Collected:</span>
                      <span className="font-medium">AED {selectedVATReturn.outputVAT?.toLocaleString() || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Input VAT Paid:</span>
                      <span className="font-medium">AED {selectedVATReturn.inputVAT?.toLocaleString() || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Adjustments:</span>
                      <span className="font-medium">AED {selectedVATReturn.adjustments?.toLocaleString() || "0"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-medium">Final VAT Due:</span>
                      <span className="font-bold text-amber-600">AED {selectedVATReturn.finalVATDue?.toLocaleString() || "0"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Detailed Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h5 className="font-medium mb-2 text-green-600">Sales (Output VAT)</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Sales:</span>
                        <span className="font-medium">AED {selectedVATReturn.totalSales?.toLocaleString() || "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxable Sales ({selectedVATReturn.breakdown.standardRateSales.rate}%):</span>
                        <span className="font-medium">AED {selectedVATReturn.breakdown.standardRateSales.amount?.toLocaleString() || "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zero Rated Sales:</span>
                        <span className="font-medium">AED {selectedVATReturn.zeroRatedSales?.toLocaleString() || "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Exempt Sales:</span>
                        <span className="font-medium">AED {selectedVATReturn.exemptSales?.toLocaleString() || "0"}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Output VAT:</span>
                        <span className="font-bold text-green-600">AED {selectedVATReturn.outputVAT?.toLocaleString() || "0"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2 text-blue-600">Purchases (Input VAT)</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Purchases:</span>
                        <span className="font-medium">AED {selectedVATReturn.totalPurchases?.toLocaleString() || "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxable Purchases ({selectedVATReturn.breakdown.standardRatePurchases.rate}%):</span>
                        <span className="font-medium">AED {selectedVATReturn.breakdown.standardRatePurchases.amount?.toLocaleString() || "0"}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Input VAT:</span>
                        <span className="font-bold text-blue-600">AED {selectedVATReturn.inputVAT?.toLocaleString() || "0"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setSelectedVATReturn(null)}>
                Close
              </Button>
              {selectedVATReturn.status === 'Draft' && (
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Return
                </Button>
              )}
              <Button>
                <Download className="h-4 w-4 mr-1" />
                Download PDF
              </Button>
              {selectedVATReturn.status === 'Draft' && (
                <Button className="bg-green-600 hover:bg-green-700">
                  <Send className="h-4 w-4 mr-1" />
                  Submit to FTA
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}