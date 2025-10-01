'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Store,
  StoreFilters,
  StoreType,
  StoreStatus,
  UAEEmirate
} from '@/types/store';
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Settings,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Store as StoreIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StoreListProps {
  stores: Store[];
  onRefresh: () => void;
  isLoading?: boolean;
}

const getStatusColor = (status: StoreStatus) => {
  switch (status) {
    case StoreStatus.ACTIVE:
      return 'bg-green-100 text-green-800 border-green-200';
    case StoreStatus.INACTIVE:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case StoreStatus.MAINTENANCE:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case StoreStatus.TEMPORARILY_CLOSED:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case StoreStatus.PERMANENTLY_CLOSED:
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getTypeIcon = (type: StoreType) => {
  switch (type) {
    case StoreType.FLAGSHIP:
      return <Building2 className="h-4 w-4" />;
    case StoreType.OUTLET:
      return <StoreIcon className="h-4 w-4" />;
    case StoreType.KIOSK:
      return <StoreIcon className="h-4 w-4" />;
    case StoreType.ONLINE:
      return <TrendingUp className="h-4 w-4" />;
    case StoreType.WAREHOUSE:
      return <Building2 className="h-4 w-4" />;
    case StoreType.DISTRIBUTION_CENTER:
      return <Building2 className="h-4 w-4" />;
    default:
      return <StoreIcon className="h-4 w-4" />;
  }
};

export default function StoreList({ stores, onRefresh, isLoading }: StoreListProps) {
  const router = useRouter();
  const [filteredStores, setFilteredStores] = useState<Store[]>(stores);
  const [filters, setFilters] = useState<StoreFilters>({});
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    let filtered = [...stores];

    // Apply filters
    if (filters.search) {
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        store.code.toLowerCase().includes(filters.search!.toLowerCase()) ||
        store.city.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(store => store.type === filters.type);
    }

    if (filters.status) {
      filtered = filtered.filter(store => store.status === filters.status);
    }

    if (filters.emirate) {
      filtered = filtered.filter(store => store.emirate === filters.emirate);
    }

    if (filters.city) {
      filtered = filtered.filter(store => store.city === filters.city);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Store];
      let bValue: any = b[sortBy as keyof Store];

      if (sortBy === 'metrics.totalSales') {
        aValue = a.metrics?.totalSales || 0;
        bValue = b.metrics?.totalSales || 0;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredStores(filtered);
  }, [stores, filters, sortBy, sortOrder]);

  const handleFilterChange = (key: keyof StoreFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Store Management</h1>
          <p className="text-muted-foreground">
            Manage your store locations and monitor performance across the UAE
          </p>
        </div>
        <Button onClick={() => router.push('/stores/add')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Store
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <StoreIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores.length}</div>
            <p className="text-xs text-muted-foreground">
              Across UAE Emirates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stores.filter(s => s.status === StoreStatus.ACTIVE).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                stores.reduce((sum, store) => sum + (store.metrics?.totalSales || 0), 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stores.reduce((sum, store) => sum + (store.metrics?.performanceScore || 0), 0) / stores.length || 0).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average across stores
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stores..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={filters.type || ''}
              onValueChange={(value) => handleFilterChange('type', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Store Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {Object.values(StoreType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.status || ''}
              onValueChange={(value) => handleFilterChange('status', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {Object.values(StoreStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.emirate || ''}
              onValueChange={(value) => handleFilterChange('emirate', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Emirate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Emirates</SelectItem>
                {Object.values(UAEEmirate).map((emirate) => (
                  <SelectItem key={emirate} value={emirate}>
                    {emirate.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Store Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stores ({filteredStores.length})</CardTitle>
          <CardDescription>
            Manage your store network across the UAE
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        {getTypeIcon(store.type)}
                      </div>
                      <div>
                        <div className="font-medium">{store.name}</div>
                        <div className="text-sm text-muted-foreground">{store.code}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {store.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{store.city}</div>
                        <div className="text-sm text-muted-foreground">
                          {store.emirate.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(store.status)}>
                      {store.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {store.manager ? (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{store.manager.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {store.manager.phone}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No manager assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {(store.metrics?.performanceScore || 0) >= 80 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">
                        {store.metrics?.performanceScore?.toFixed(1) || 0}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {formatCurrency(store.metrics?.totalSales || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {store.metrics?.monthlyRevenue ?
                        `${formatCurrency(store.metrics.monthlyRevenue)} this month` :
                        'No data'
                      }
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => router.push(`/stores/${store.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/stores/${store.id}/edit`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Store
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/stores/${store.id}/settings`)}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => router.push(`/stores/${store.id}/dashboard`)}
                        >
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Dashboard
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredStores.length === 0 && (
            <div className="text-center py-8">
              <StoreIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No stores found</h3>
              <p className="text-muted-foreground">
                {Object.keys(filters).length > 0
                  ? 'Try adjusting your filters or search criteria.'
                  : 'Get started by adding your first store.'
                }
              </p>
              {Object.keys(filters).length === 0 && (
                <Button
                  onClick={() => router.push('/stores/add')}
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Store
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}