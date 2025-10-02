'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import {
  Building2,
  Users,
  TrendingUp,
  ShoppingBag,
  Calendar,
  FileText,
  CreditCard,
  Percent,
  Target,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Search,
  Filter,
  Plus,
  Eye,
  Send,
  Edit,
  Download,
  Settings,
  Gift,
  UserPlus,
  Briefcase,
  Award,
  Package,
  Truck,
  Calculator,
  BarChart3,
  PieChart,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import { CustomerType } from '@/types/crm';

interface CorporateClient {
  id: string;
  code: string;
  companyName: string;
  companyNameArabic?: string;
  tradeLicense: string;
  vatNumber: string;
  taxId?: string;
  industry: string;
  businessType: 'RETAIL' | 'HOSPITALITY' | 'CORPORATE_GIFTS' | 'EVENTS' | 'WHOLESALE' | 'GOVERNMENT';
  establishedYear: number;
  employeeCount: string;
  annualRevenue?: string;

  // Primary Contact
  primaryContactName: string;
  primaryContactTitle: string;
  primaryContactEmail: string;
  primaryContactPhone: string;

  // Address
  address: string;
  addressArabic?: string;
  emirate: string;
  city: string;
  postalCode?: string;

  // Business Details
  totalLifetimeValue: number;
  currentBalance: number;
  creditLimit: number;
  paymentTerms: string;
  preferredPaymentMethod: string;
  lastOrderDate?: string;
  totalOrders: number;
  averageOrderValue: number;

  // Account Status
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL';
  creditStatus: 'APPROVED' | 'PENDING' | 'REJECTED' | 'REVIEW_REQUIRED';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';

  // Contracts & Agreements
  hasVolumeDiscount: boolean;
  volumeDiscountPercent?: number;
  contractStartDate?: string;
  contractEndDate?: string;

  // Additional Info
  specialRequirements: string[];
  preferredCategories: string[];
  seasonalPatterns: string[];
  relationshipManager?: string;
  tags: string[];
  notes?: string;

  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CorporateContact {
  id: string;
  corporateClientId: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  role: 'PRIMARY' | 'FINANCE' | 'PROCUREMENT' | 'OPERATIONS' | 'DECISION_MAKER';
  isPrimary: boolean;
  isActive: boolean;
}

interface CorporateStats {
  totalClients: number;
  activeClients: number;
  totalRevenue: number;
  averageContractValue: number;
  averageOrderValue: number;
  totalOutstanding: number;
  overduePay: number;
  pendingApprovals: number;
  industryBreakdown: Array<{
    industry: string;
    count: number;
    revenue: number;
    percentage: number;
  }>;
  businessTypeDistribution: Array<{
    type: string;
    count: number;
    revenue: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    newClients: number;
    revenue: number;
    orders: number;
  }>;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
}

interface VolumeDiscount {
  id: string;
  corporateClientId: string;
  tier: string;
  minimumOrderValue: number;
  discountPercent: number;
  validFrom: string;
  validUntil?: string;
  isActive: boolean;
}

interface CorporateProposal {
  id: string;
  corporateClientId: string;
  proposalNumber: string;
  title: string;
  description: string;
  totalValue: number;
  discountOffered: number;
  status: 'DRAFT' | 'SENT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  createdDate: string;
  validUntil: string;
  contactPersonId: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    discountPercent: number;
    totalPrice: number;
  }>;
}

const BUSINESS_TYPES = [
  { value: 'RETAIL', label: 'Retail Business', icon: ShoppingBag },
  { value: 'HOSPITALITY', label: 'Hotels & Hospitality', icon: Building2 },
  { value: 'CORPORATE_GIFTS', label: 'Corporate Gifts', icon: Gift },
  { value: 'EVENTS', label: 'Events & Weddings', icon: Calendar },
  { value: 'WHOLESALE', label: 'Wholesale Distribution', icon: Truck },
  { value: 'GOVERNMENT', label: 'Government Entities', icon: Briefcase }
];

const PAYMENT_TERMS = [
  'Net 30',
  'Net 60',
  'Net 90',
  'Payment on Delivery',
  '2/10 Net 30',
  '1% 15 Net 30',
  'Advance Payment'
];

export default function CorporateClientManagementPage() {
  const [corporateClients, setCorporateClients] = useState<CorporateClient[]>([]);
  const [contacts, setContacts] = useState<CorporateContact[]>([]);
  const [stats, setStats] = useState<CorporateStats | null>(null);
  const [proposals, setProposals] = useState<CorporateProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<CorporateClient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [showAddClient, setShowAddClient] = useState(false);
  const [showCreateProposal, setShowCreateProposal] = useState(false);

  useEffect(() => {
    fetchCorporateData();
  }, []);

  const fetchCorporateData = async () => {
    try {
      setLoading(true);
      const [clientsRes, contactsRes, statsRes, proposalsRes] = await Promise.all([
        fetch('/api/crm/corporate/clients'),
        fetch('/api/crm/corporate/contacts'),
        fetch('/api/crm/corporate/stats'),
        fetch('/api/crm/corporate/proposals')
      ]);

      if (clientsRes.ok) {
        const clientsData = await clientsRes.json();
        setCorporateClients(clientsData.clients || []);
      }

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContacts(contactsData.contacts || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (proposalsRes.ok) {
        const proposalsData = await proposalsRes.json();
        setProposals(proposalsData.proposals || []);
      }
    } catch (error) {
      console.error('Error fetching corporate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = corporateClients.filter(client => {
    const matchesSearch = client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.primaryContactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || client.industry === industryFilter;
    const matchesStatus = statusFilter === 'all' || client.accountStatus === statusFilter;
    const matchesRisk = riskFilter === 'all' || client.riskLevel === riskFilter;

    return matchesSearch && matchesIndustry && matchesStatus && matchesRisk;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-AE').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'default';
      case 'PENDING_APPROVAL': return 'secondary';
      case 'SUSPENDED': return 'destructive';
      case 'INACTIVE': return 'outline';
      default: return 'outline';
    }
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'default';
      case 'MEDIUM': return 'secondary';
      case 'HIGH': return 'destructive';
      default: return 'outline';
    }
  };

  const getCreditStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-green-600';
      case 'PENDING': return 'text-yellow-600';
      case 'REJECTED': return 'text-red-600';
      case 'REVIEW_REQUIRED': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getBusinessTypeIcon = (type: string) => {
    const businessType = BUSINESS_TYPES.find(bt => bt.value === type);
    if (businessType) {
      const IconComponent = businessType.icon;
      return <IconComponent className="w-4 h-4" />;
    }
    return <Building2 className="w-4 h-4" />;
  };

  if (loading || !stats) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Corporate Client Management</h1>
            <p className="text-gray-600 mt-1">Manage B2B relationships and enterprise accounts</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchCorporateData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => setShowCreateProposal(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Create Proposal
          </Button>
          <Button onClick={() => setShowAddClient(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Corporate Client
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalClients)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeClients} active accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Avg contract: {formatCurrency(stats.averageContractValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalOutstanding)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.overduePay)} overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Industry & Business Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Industry Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.industryBreakdown.slice(0, 6).map((industry, index) => (
                <div key={industry.industry} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-indigo-600">#{index + 1}</span>
                    </div>
                    <span className="font-medium">{industry.industry}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{industry.count} clients</div>
                    <div className="text-sm text-gray-600">{formatCurrency(industry.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Business Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.businessTypeDistribution.map((type) => (
                <div key={type.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getBusinessTypeIcon(type.type)}
                    <span>{type.type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32">
                      <Progress
                        value={(type.count / stats.totalClients) * 100}
                        className="h-2"
                      />
                    </div>
                    <span className="text-sm font-medium">{type.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Risk Assessment Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg border-green-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.riskDistribution.low}</div>
              <div className="text-sm text-gray-600">Low Risk Clients</div>
              <div className="mt-2">
                <Progress
                  value={(stats.riskDistribution.low / stats.totalClients) * 100}
                  className="h-2"
                />
              </div>
            </div>

            <div className="text-center p-6 border rounded-lg border-yellow-200">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-yellow-600">{stats.riskDistribution.medium}</div>
              <div className="text-sm text-gray-600">Medium Risk Clients</div>
              <div className="mt-2">
                <Progress
                  value={(stats.riskDistribution.medium / stats.totalClients) * 100}
                  className="h-2"
                />
              </div>
            </div>

            <div className="text-center p-6 border rounded-lg border-red-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">{stats.riskDistribution.high}</div>
              <div className="text-sm text-gray-600">High Risk Clients</div>
              <div className="mt-2">
                <Progress
                  value={(stats.riskDistribution.high / stats.totalClients) * 100}
                  className="h-2"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="clients" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="clients">Corporate Clients</TabsTrigger>
          <TabsTrigger value="proposals">Proposals & Quotes</TabsTrigger>
          <TabsTrigger value="contracts">Contracts & Terms</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        {/* Corporate Clients Tab */}
        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Corporate Client Directory
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search clients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={industryFilter} onValueChange={setIndustryFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      {stats.industryBreakdown.map((industry) => (
                        <SelectItem key={industry.industry} value={industry.industry}>
                          {industry.industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="PENDING_APPROVAL">Pending</SelectItem>
                      <SelectItem value="SUSPENDED">Suspended</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Credit Status</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.slice(0, 10).map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={`/companies/${client.id}.jpg`} />
                            <AvatarFallback className="bg-indigo-100 text-indigo-600">
                              {client.companyName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{client.companyName}</div>
                            {client.companyNameArabic && (
                              <div className="text-sm text-gray-600" dir="rtl">
                                {client.companyNameArabic}
                              </div>
                            )}
                            <div className="text-xs text-gray-500">{client.code}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{client.primaryContactName}</div>
                          <div className="text-sm text-gray-600">{client.primaryContactTitle}</div>
                          <div className="text-xs text-gray-500">{client.primaryContactEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getBusinessTypeIcon(client.businessType)}
                          <span className="text-sm">{client.industry}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold">{formatCurrency(client.totalLifetimeValue)}</div>
                          <div className="text-sm text-gray-600">
                            {client.totalOrders} orders
                          </div>
                          {client.hasVolumeDiscount && (
                            <Badge variant="secondary" className="text-xs">
                              {client.volumeDiscountPercent}% discount
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${getCreditStatusColor(client.creditStatus)}`}>
                          {client.creditStatus}
                        </div>
                        <div className="text-sm text-gray-600">
                          Limit: {formatCurrency(client.creditLimit)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRiskBadgeVariant(client.riskLevel)}>
                          {client.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedClient(client)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
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

        {/* Proposals & Quotes Tab */}
        <TabsContent value="proposals" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Proposals & Quotations
                </CardTitle>
                <Button onClick={() => setShowCreateProposal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Proposal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <Card key={proposal.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-semibold text-lg">{proposal.title}</h3>
                            <Badge
                              variant={
                                proposal.status === 'APPROVED' ? 'default' :
                                proposal.status === 'SENT' ? 'secondary' :
                                proposal.status === 'UNDER_REVIEW' ? 'outline' :
                                proposal.status === 'REJECTED' ? 'destructive' : 'outline'
                              }
                            >
                              {proposal.status.replace('_', ' ')}
                            </Badge>
                            <span className="text-sm text-gray-600">#{proposal.proposalNumber}</span>
                          </div>
                          <p className="text-gray-600 mb-4">{proposal.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <div className="text-sm text-gray-600">Total Value</div>
                              <div className="font-semibold">{formatCurrency(proposal.totalValue)}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Discount</div>
                              <div className="font-semibold text-green-600">
                                {formatCurrency(proposal.discountOffered)}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Created</div>
                              <div className="font-semibold">{formatDate(proposal.createdDate)}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Valid Until</div>
                              <div className="font-semibold">{formatDate(proposal.validUntil)}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline">
                            <Send className="w-3 h-3 mr-1" />
                            Send
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contracts & Terms Tab */}
        <TabsContent value="contracts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Volume Discount Tiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Bronze Tier</div>
                      <div className="text-sm text-gray-600">Orders above AED 10,000</div>
                    </div>
                    <Badge variant="outline">5% discount</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Silver Tier</div>
                      <div className="text-sm text-gray-600">Orders above AED 25,000</div>
                    </div>
                    <Badge variant="outline">8% discount</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Gold Tier</div>
                      <div className="text-sm text-gray-600">Orders above AED 50,000</div>
                    </div>
                    <Badge variant="outline">12% discount</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Platinum Tier</div>
                      <div className="text-sm text-gray-600">Orders above AED 100,000</div>
                    </div>
                    <Badge variant="outline">15% discount</Badge>
                  </div>
                </div>
                <Button className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Tiers
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Terms Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {PAYMENT_TERMS.map((term, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{term}</div>
                        <div className="text-sm text-gray-600">
                          {term === 'Net 30' && 'Payment due within 30 days'}
                          {term === 'Net 60' && 'Payment due within 60 days'}
                          {term === 'Net 90' && 'Payment due within 90 days'}
                          {term === 'Payment on Delivery' && 'Payment required upon delivery'}
                          {term === '2/10 Net 30' && '2% discount if paid within 10 days'}
                          {term === '1% 15 Net 30' && '1% discount if paid within 15 days'}
                          {term === 'Advance Payment' && 'Full payment required in advance'}
                        </div>
                      </div>
                      <Switch defaultChecked={index < 4} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Monthly Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.monthlyTrends.map((month) => (
                  <div key={month.month} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-sm font-medium">{month.month}</div>
                      <div className="w-32">
                        <Progress
                          value={(month.revenue / Math.max(...stats.monthlyTrends.map(m => m.revenue))) * 100}
                          className="h-3"
                        />
                      </div>
                    </div>
                    <div className="flex gap-8 text-sm">
                      <div>
                        <div className="text-gray-600">New Clients</div>
                        <div className="font-semibold">{month.newClients}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Revenue</div>
                        <div className="font-semibold">{formatCurrency(month.revenue)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Orders</div>
                        <div className="font-semibold">{month.orders}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Client Profile Dialog */}
      {selectedClient && (
        <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {selectedClient.companyName} - Corporate Profile
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Company Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Total Value</Label>
                  <div className="text-xl font-bold text-indigo-600">
                    {formatCurrency(selectedClient.totalLifetimeValue)}
                  </div>
                </div>
                <div>
                  <Label>Credit Limit</Label>
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(selectedClient.creditLimit)}
                  </div>
                </div>
                <div>
                  <Label>Current Balance</Label>
                  <div className="text-xl font-bold text-orange-600">
                    {formatCurrency(selectedClient.currentBalance)}
                  </div>
                </div>
                <div>
                  <Label>Total Orders</Label>
                  <div className="text-xl font-bold">{selectedClient.totalOrders}</div>
                </div>
              </div>

              <Separator />

              {/* Company Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-lg">Company Information</Label>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trade License:</span>
                      <span className="font-medium">{selectedClient.tradeLicense}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">VAT Number:</span>
                      <span className="font-medium">{selectedClient.vatNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industry:</span>
                      <span className="font-medium">{selectedClient.industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Business Type:</span>
                      <span className="font-medium">{selectedClient.businessType.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Established:</span>
                      <span className="font-medium">{selectedClient.establishedYear}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-lg">Primary Contact</Label>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedClient.primaryContactName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Title:</span>
                      <span className="font-medium">{selectedClient.primaryContactTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedClient.primaryContactEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedClient.primaryContactPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Terms */}
              <div>
                <Label className="text-lg">Payment & Credit Information</Label>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Payment Terms</div>
                    <div className="font-semibold">{selectedClient.paymentTerms}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Payment Method</div>
                    <div className="font-semibold">{selectedClient.preferredPaymentMethod}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Credit Status</div>
                    <div className={`font-semibold ${getCreditStatusColor(selectedClient.creditStatus)}`}>
                      {selectedClient.creditStatus}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Risk Level</div>
                    <Badge variant={getRiskBadgeVariant(selectedClient.riskLevel)}>
                      {selectedClient.riskLevel}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Volume Discount */}
              {selectedClient.hasVolumeDiscount && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-purple-800">Volume Discount Active</span>
                  </div>
                  <div className="text-sm text-purple-700">
                    {selectedClient.volumeDiscountPercent}% discount applies to qualifying orders
                  </div>
                </div>
              )}

              {/* Special Requirements */}
              {selectedClient.specialRequirements.length > 0 && (
                <div>
                  <Label className="text-lg">Special Requirements</Label>
                  <div className="mt-3 space-y-2">
                    {selectedClient.specialRequirements.map((requirement, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        {requirement}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Proposal
                </Button>
                <Button variant="outline" className="flex-1">
                  <Calculator className="w-4 h-4 mr-2" />
                  Generate Quote
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}