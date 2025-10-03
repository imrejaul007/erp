'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  Calculator,
  Calendar,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  FileText,
  Download,
  Upload,
  Plus,
  Edit,
  Eye,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Banknote,
  Receipt,
  Wallet,
  PieChart,
  BarChart3,
  Target,
  Award,
  Shield,
  Globe,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Activity,
  ArrowLeft} from 'lucide-react';

const PayrollPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showPayrollDialog, setShowPayrollDialog] = useState(false);
  const [showDeductionDialog, setShowDeductionDialog] = useState(false);

  // Sample payroll data with UAE compliance
  const payrollMetrics = {
    totalPayroll: 487500,
    totalEmployees: 45,
    totalDeductions: 52800,
    totalBenefits: 38200,
    avgSalary: 10833,
    overtimePay: 15600,
    trends: {
      payroll: +3.2,
      deductions: -1.8,
      overtime: +12.4
    }
  };

  const payrollData = [
    {
      id: 'PAY001',
      employeeId: 'EMP001',
      employeeName: 'Ahmed Al-Rashid',
      employeeNameArabic: 'أحمد الراشد',
      emiratesId: '784-1990-1234567-1',
      position: 'Store Manager',
      location: 'Dubai Mall Store',
      period: '2024-01',
      basicSalary: 15000,
      housingAllowance: 3000,
      transportAllowance: 1000,
      commission: 2500,
      overtime: 800,
      totalEarnings: 22300,
      // Deductions
      socialInsurance: 750, // 5% of basic salary
      healthInsurance: 450,
      taxDeduction: 0, // UAE has no income tax
      loanDeduction: 500,
      totalDeductions: 1700,
      netSalary: 20600,
      paymentMethod: 'bank_transfer',
      bankAccount: 'ADCB-****-1234',
      paymentDate: '2024-01-30',
      status: 'paid',
      currency: 'AED',
      // UAE Compliance
      endOfServiceBenefit: 18750, // Calculated based on tenure
      gratuity: 2500,
      workDays: 22,
      absentDays: 0,
      lateDays: 1,
      overtimeHours: 10
    },
    {
      id: 'PAY002',
      employeeId: 'EMP002',
      employeeName: 'Fatima Al-Zahra',
      employeeNameArabic: 'فاطمة الزهراء',
      emiratesId: '784-1995-2345678-2',
      position: 'Sales Associate',
      location: 'Abu Dhabi Mall Store',
      period: '2024-01',
      basicSalary: 8500,
      housingAllowance: 1700,
      transportAllowance: 800,
      commission: 1200,
      overtime: 350,
      totalEarnings: 12550,
      socialInsurance: 425,
      healthInsurance: 255,
      taxDeduction: 0,
      loanDeduction: 0,
      totalDeductions: 680,
      netSalary: 11870,
      paymentMethod: 'bank_transfer',
      bankAccount: 'ENBD-****-5678',
      paymentDate: '2024-01-30',
      status: 'paid',
      currency: 'AED',
      endOfServiceBenefit: 8500,
      gratuity: 1000,
      workDays: 22,
      absentDays: 0,
      lateDays: 0,
      overtimeHours: 5
    },
    {
      id: 'PAY003',
      employeeId: 'EMP003',
      employeeName: 'Omar Hassan',
      employeeNameArabic: 'عمر حسن',
      emiratesId: '784-1988-3456789-3',
      position: 'Assistant Manager',
      location: 'Sharjah City Centre',
      period: '2024-01',
      basicSalary: 12000,
      housingAllowance: 2400,
      transportAllowance: 900,
      commission: 1800,
      overtime: 600,
      totalEarnings: 17700,
      socialInsurance: 600,
      healthInsurance: 360,
      taxDeduction: 0,
      loanDeduction: 800,
      totalDeductions: 1760,
      netSalary: 15940,
      paymentMethod: 'bank_transfer',
      bankAccount: 'FAB-****-9012',
      paymentDate: '2024-01-30',
      status: 'pending',
      currency: 'AED',
      endOfServiceBenefit: 14000,
      gratuity: 1800,
      workDays: 21,
      absentDays: 1,
      lateDays: 2,
      overtimeHours: 8
    }
  ];

  const salaryStructures = [
    {
      id: 'struct001',
      name: 'Store Manager Package',
      nameArabic: 'حزمة مدير المتجر',
      level: 'Manager',
      basicSalary: { min: 12000, max: 18000 },
      housingAllowance: 20, // percentage of basic
      transportAllowance: 1000,
      commissionRate: 2.5, // percentage of sales
      benefits: ['Health Insurance', 'End of Service Benefit', 'Annual Leave', 'Sick Leave'],
      locations: ['Dubai Mall Store', 'Abu Dhabi Mall Store'],
      effectiveFrom: '2024-01-01',
      isActive: true
    },
    {
      id: 'struct002',
      name: 'Sales Associate Package',
      nameArabic: 'حزمة مندوب المبيعات',
      level: 'Associate',
      basicSalary: { min: 7000, max: 10000 },
      housingAllowance: 20,
      transportAllowance: 800,
      commissionRate: 1.5,
      benefits: ['Health Insurance', 'End of Service Benefit', 'Annual Leave'],
      locations: ['All Locations'],
      effectiveFrom: '2024-01-01',
      isActive: true
    },
    {
      id: 'struct003',
      name: 'Assistant Manager Package',
      nameArabic: 'حزمة مساعد المدير',
      level: 'Assistant Manager',
      basicSalary: { min: 10000, max: 14000 },
      housingAllowance: 20,
      transportAllowance: 900,
      commissionRate: 2.0,
      benefits: ['Health Insurance', 'End of Service Benefit', 'Annual Leave', 'Performance Bonus'],
      locations: ['All Locations'],
      effectiveFrom: '2024-01-01',
      isActive: true
    }
  ];

  const deductions = [
    {
      id: 'ded001',
      name: 'Social Insurance',
      nameArabic: 'التأمين الاجتماعي',
      type: 'mandatory',
      calculation: 'percentage',
      value: 5,
      baseAmount: 'basic_salary',
      description: 'UAE Social Insurance contribution',
      isActive: true
    },
    {
      id: 'ded002',
      name: 'Health Insurance',
      nameArabic: 'التأمين الصحي',
      type: 'mandatory',
      calculation: 'percentage',
      value: 3,
      baseAmount: 'basic_salary',
      description: 'Employee health insurance contribution',
      isActive: true
    },
    {
      id: 'ded003',
      name: 'Personal Loan',
      nameArabic: 'قرض شخصي',
      type: 'voluntary',
      calculation: 'fixed',
      value: 500,
      baseAmount: null,
      description: 'Monthly loan repayment',
      isActive: true
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'mandatory': return 'bg-red-100 text-red-800';
      case 'voluntary': return 'bg-blue-100 text-blue-800';
      case 'benefit': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const calculateEndOfServiceBenefit = (basicSalary, yearsOfService) => {
    // UAE End of Service calculation
    if (yearsOfService < 1) return 0;
    if (yearsOfService <= 5) {
      return (basicSalary * 21 * yearsOfService) / 365; // 21 days per year for first 5 years
    } else {
      const first5Years = (basicSalary * 21 * 5) / 365;
      const remainingYears = yearsOfService - 5;
      const remaining = (basicSalary * 30 * remainingYears) / 365; // 30 days per year after 5 years
      return first5Years + remaining;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold text-gray-900">Payroll & Salary Management</h1>
          <p className="text-gray-600">UAE labor law compliant payroll processing and salary management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Payroll
          </Button>
          <Dialog open={showPayrollDialog} onOpenChange={setShowPayrollDialog}>
            <DialogTrigger asChild>
              <Button>
                <Calculator className="h-4 w-4 mr-2" />
                Process Payroll
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Process Monthly Payroll</DialogTitle>
                <DialogDescription>
                  Calculate and process payroll for the selected period and location
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payrollMonth">Payroll Month</Label>
                    <Input type="month" id="payrollMonth" defaultValue="2024-02" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payrollLocation">Location</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="dubai_mall">Dubai Mall Store</SelectItem>
                        <SelectItem value="abu_dhabi">Abu Dhabi Mall Store</SelectItem>
                        <SelectItem value="sharjah">Sharjah City Centre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cutoffDate">Attendance Cutoff Date</Label>
                  <Input type="date" id="cutoffDate" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentDate">Payment Date</Label>
                  <Input type="date" id="paymentDate" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="includeOvertimeSync" />
                  <Label htmlFor="includeOvertimeSync">Include overtime from attendance system</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="autoDeductions" />
                  <Label htmlFor="autoDeductions">Apply automatic deductions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="eosCalculation" />
                  <Label htmlFor="eosCalculation">Update End of Service calculations</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowPayrollDialog(false)}>
                    Cancel
                  </Button>
                  <Button>Process Payroll</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payroll</p>
                <p className="text-xl sm:text-2xl font-bold">AED {payrollMetrics.totalPayroll?.toLocaleString() || "0"}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(payrollMetrics.trends.payroll)}`}>
                  {getTrendIcon(payrollMetrics.trends.payroll)}
                  {Math.abs(payrollMetrics.trends.payroll)}% vs last month
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Salary</p>
                <p className="text-xl sm:text-2xl font-bold">AED {payrollMetrics.avgSalary?.toLocaleString() || "0"}</p>
                <p className="text-xs text-blue-600">{payrollMetrics.totalEmployees} employees</p>
              </div>
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deductions</p>
                <p className="text-xl sm:text-2xl font-bold">AED {payrollMetrics.totalDeductions?.toLocaleString() || "0"}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(payrollMetrics.trends.deductions)}`}>
                  {getTrendIcon(payrollMetrics.trends.deductions)}
                  {Math.abs(payrollMetrics.trends.deductions)}% vs last month
                </div>
              </div>
              <Receipt className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overtime Pay</p>
                <p className="text-xl sm:text-2xl font-bold">AED {payrollMetrics.overtimePay?.toLocaleString() || "0"}</p>
                <div className={`text-xs flex items-center gap-1 ${getTrendColor(payrollMetrics.trends.overtime)}`}>
                  {getTrendIcon(payrollMetrics.trends.overtime)}
                  {Math.abs(payrollMetrics.trends.overtime)}% vs last month
                </div>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payroll" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="payroll">Current Payroll</TabsTrigger>
          <TabsTrigger value="structures">Salary Structures</TabsTrigger>
          <TabsTrigger value="deductions">Deductions & Benefits</TabsTrigger>
          <TabsTrigger value="reports">Reports & Compliance</TabsTrigger>
        </TabsList>

        {/* Current Payroll Tab */}
        <TabsContent value="payroll" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>January 2024 Payroll</CardTitle>
                  <CardDescription>Monthly payroll processing with UAE compliance</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current Month</SelectItem>
                      <SelectItem value="previous">Previous Month</SelectItem>
                      <SelectItem value="2024-01">January 2024</SelectItem>
                      <SelectItem value="2023-12">December 2023</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Allowances</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{record.employeeName}</div>
                            <div className="text-sm text-gray-500">{record.employeeNameArabic}</div>
                            <div className="text-xs text-gray-400">{record.employeeId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{record.position}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {record.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">AED {record.basicSalary?.toLocaleString() || "0"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Housing: AED {record.housingAllowance?.toLocaleString() || "0"}</div>
                          <div>Transport: AED {record.transportAllowance?.toLocaleString() || "0"}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-green-600">
                          AED {record.commission?.toLocaleString() || "0"}
                        </div>
                        <div className="text-xs text-gray-500">
                          + AED {record.overtime} OT
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-red-600">
                          AED {record.totalDeductions?.toLocaleString() || "0"}
                        </div>
                        <div className="text-xs text-gray-500">
                          SI + HI + Others
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-green-600">
                          AED {record.netSalary?.toLocaleString() || "0"}
                        </div>
                        <div className="text-xs text-gray-500">{record.currency}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Salary Structures Tab */}
        <TabsContent value="structures" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Salary Structures</CardTitle>
                  <CardDescription>Define salary components and packages for different positions</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Structure
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salaryStructures.map((structure) => (
                  <div key={structure.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Banknote className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">{structure.name}</div>
                        <div className="text-sm text-gray-500">{structure.nameArabic}</div>
                        <div className="text-sm text-gray-600">
                          Level: {structure.level} • Effective from: {structure.effectiveFrom}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="text-center">
                        <div className="font-medium">
                          AED {structure.basicSalary.min?.toLocaleString() || "0"} - {structure.basicSalary.max?.toLocaleString() || "0"}
                        </div>
                        <div className="text-xs text-gray-500">Basic Salary Range</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{structure.housingAllowance}%</div>
                        <div className="text-xs text-gray-500">Housing</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{structure.commissionRate}%</div>
                        <div className="text-xs text-gray-500">Commission</div>
                      </div>
                      <div className="text-center">
                        <Badge variant={structure.isActive ? "default" : "secondary"}>
                          {structure.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deductions & Benefits Tab */}
        <TabsContent value="deductions" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Deductions & Benefits</CardTitle>
                  <CardDescription>Manage salary deductions and employee benefits</CardDescription>
                </div>
                <Dialog open={showDeductionDialog} onOpenChange={setShowDeductionDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Deduction
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Deduction</DialogTitle>
                      <DialogDescription>
                        Configure a new deduction or benefit item
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="deductionName">Deduction Name (English)</Label>
                        <Input id="deductionName" placeholder="e.g., Personal Loan" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deductionNameArabic">Deduction Name (Arabic)</Label>
                        <Input id="deductionNameArabic" placeholder="e.g., قرض شخصي" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deductionType">Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mandatory">Mandatory</SelectItem>
                            <SelectItem value="voluntary">Voluntary</SelectItem>
                            <SelectItem value="benefit">Benefit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="calculation">Calculation Method</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="value">Value</Label>
                        <Input type="number" id="value" placeholder="5 or 500" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Description of the deduction..." />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowDeductionDialog(false)}>
                          Cancel
                        </Button>
                        <Button>Add Deduction</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deduction Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Calculation</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deductions.map((deduction) => (
                    <TableRow key={deduction.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{deduction.name}</div>
                          <div className="text-sm text-gray-500">{deduction.nameArabic}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(deduction.type)}>
                          {deduction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {deduction.calculation === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {deduction.calculation === 'percentage' ? `${deduction.value}%` : `AED ${deduction.value}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">{deduction.description}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={deduction.isActive ? "default" : "secondary"}>
                          {deduction.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports & Compliance Tab */}
        <TabsContent value="reports" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Summary</CardTitle>
                <CardDescription>Monthly payroll breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Basic Salaries</span>
                    <div className="text-right">
                      <div className="font-medium">AED 402,500</div>
                      <Progress value={82} className="w-16 h-2" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Allowances</span>
                    <div className="text-right">
                      <div className="font-medium">AED 69,400</div>
                      <Progress value={14} className="w-16 h-2" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Commission</span>
                    <div className="text-right">
                      <div className="font-medium">AED 15,600</div>
                      <Progress value={3} className="w-16 h-2" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Overtime</span>
                    <div className="text-right">
                      <div className="font-medium">AED 4,800</div>
                      <Progress value={1} className="w-16 h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>UAE Compliance Status</CardTitle>
                <CardDescription>Labor law compliance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">End of Service Benefits</div>
                        <div className="text-sm text-gray-500">Calculated and reserved</div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Social Insurance</div>
                        <div className="text-sm text-gray-500">5% deducted properly</div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Overtime Calculations</div>
                        <div className="text-sm text-gray-500">1.25x rate applied</div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payroll Reports</CardTitle>
              <CardDescription>Generate and download payroll reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">Payslips</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs">Payroll Summary</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <Shield className="h-5 w-5" />
                  <span className="text-xs">Compliance Report</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <Target className="h-5 w-5" />
                  <span className="text-xs">EOS Report</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <CreditCard className="h-5 w-5" />
                  <span className="text-xs">Deductions Report</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <Calendar className="h-5 w-5" />
                  <span className="text-xs">Monthly Report</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <PieChart className="h-5 w-5" />
                  <span className="text-xs">Cost Analysis</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <Award className="h-5 w-5" />
                  <span className="text-xs">Commission Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayrollPage;