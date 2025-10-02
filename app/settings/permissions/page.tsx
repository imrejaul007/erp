'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users,
  Shield,
  Key,
  UserCheck,
  UserPlus,
  Settings,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Crown,
  Building,
  ShoppingCart,
  Package,
  BarChart3,
  CreditCard,
  FileText,
  Database,
  Globe,
  Plus,
  Edit,
  Trash2,
  Save,
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const PermissionsPage = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [searchTerm, setSearchTerm] = useState('');

  // User Roles
  const [userRoles, setUserRoles] = useState([
    {
      id: 'super-admin',
      name: 'Super Administrator',
      description: 'Full system access with all administrative privileges',
      level: 'system',
      userCount: 2,
      permissions: {
        system: ['all_access', 'user_management', 'system_settings', 'security_settings'],
        pos: ['all_operations', 'refunds', 'discounts', 'void_transactions'],
        inventory: ['full_access', 'stock_adjustments', 'transfers', 'audits'],
        financial: ['all_reports', 'accounting', 'tax_management', 'payment_settings'],
        customers: ['full_access', 'data_export', 'marketing', 'loyalty_management'],
        suppliers: ['full_access', 'purchase_orders', 'payments', 'contracts']
      },
      restrictions: [],
      status: 'active',
      lastModified: '2024-03-15',
      createdBy: 'System'
    },
    {
      id: 'store-manager',
      name: 'Store Manager',
      description: 'Store operations, staff management, and basic reporting',
      level: 'management',
      userCount: 8,
      permissions: {
        system: ['view_analytics', 'manage_staff'],
        pos: ['all_operations', 'limited_refunds', 'apply_discounts'],
        inventory: ['view_all', 'basic_adjustments', 'reorder_alerts'],
        financial: ['store_reports', 'daily_reports', 'sales_analytics'],
        customers: ['view_all', 'basic_management', 'loyalty_points'],
        suppliers: ['view_all', 'request_orders']
      },
      restrictions: ['cannot_modify_prices', 'approval_required_refunds_over_500'],
      status: 'active',
      lastModified: '2024-03-10',
      createdBy: 'Admin'
    },
    {
      id: 'sales-associate',
      name: 'Sales Associate',
      description: 'POS operations and customer service',
      level: 'operational',
      userCount: 24,
      permissions: {
        system: ['basic_dashboard'],
        pos: ['process_sales', 'accept_payments', 'basic_refunds'],
        inventory: ['view_stock', 'check_availability'],
        financial: ['daily_summary'],
        customers: ['view_profiles', 'update_contact', 'loyalty_redemption'],
        suppliers: ['view_basic_info']
      },
      restrictions: ['no_cash_drawer_access', 'manager_approval_large_discounts', 'no_price_override'],
      status: 'active',
      lastModified: '2024-03-08',
      createdBy: 'Manager'
    },
    {
      id: 'warehouse-staff',
      name: 'Warehouse Staff',
      description: 'Inventory management and stock operations',
      level: 'operational',
      userCount: 12,
      permissions: {
        system: ['basic_dashboard'],
        pos: ['view_only'],
        inventory: ['full_access', 'receive_stock', 'stock_transfers', 'cycle_counts'],
        financial: ['basic_reports'],
        customers: ['view_basic'],
        suppliers: ['receive_orders', 'update_delivery_status']
      },
      restrictions: ['no_pos_access', 'no_financial_data'],
      status: 'active',
      lastModified: '2024-03-05',
      createdBy: 'Manager'
    },
    {
      id: 'accountant',
      name: 'Accountant',
      description: 'Financial reporting and accounting functions',
      level: 'specialized',
      userCount: 3,
      permissions: {
        system: ['financial_dashboard'],
        pos: ['view_transactions'],
        inventory: ['view_costs', 'valuation_reports'],
        financial: ['all_reports', 'tax_reports', 'reconciliation', 'budget_management'],
        customers: ['payment_history'],
        suppliers: ['payment_management', 'cost_analysis']
      },
      restrictions: ['no_inventory_adjustments', 'read_only_customer_data'],
      status: 'active',
      lastModified: '2024-03-12',
      createdBy: 'Admin'
    }
  ]);

  // Active Users
  const [activeUsers, setActiveUsers] = useState([
    {
      id: 'user1',
      name: 'Ahmed Al Maktoum',
      email: 'ahmed@oudpalace.ae',
      role: 'super-admin',
      department: 'Management',
      lastLogin: '2024-03-15 14:30',
      status: 'active',
      permissions: ['all_access'],
      avatar: 'AM'
    },
    {
      id: 'user2',
      name: 'Fatima Hassan',
      email: 'fatima@oudpalace.ae',
      role: 'store-manager',
      department: 'Dubai Mall Store',
      lastLogin: '2024-03-15 09:15',
      status: 'active',
      permissions: ['store_management'],
      avatar: 'FH'
    },
    {
      id: 'user3',
      name: 'Mohammed Ali',
      email: 'mohammed@oudpalace.ae',
      role: 'sales-associate',
      department: 'Sales',
      lastLogin: '2024-03-15 16:45',
      status: 'active',
      permissions: ['pos_operations'],
      avatar: 'MA'
    },
    {
      id: 'user4',
      name: 'Aisha Rashid',
      email: 'aisha@oudpalace.ae',
      role: 'accountant',
      department: 'Finance',
      lastLogin: '2024-03-15 11:20',
      status: 'active',
      permissions: ['financial_reports'],
      avatar: 'AR'
    },
    {
      id: 'user5',
      name: 'Omar Khalil',
      email: 'omar@oudpalace.ae',
      role: 'warehouse-staff',
      department: 'Warehouse',
      lastLogin: '2024-03-15 08:00',
      status: 'active',
      permissions: ['inventory_management'],
      avatar: 'OK'
    }
  ]);

  // Permission modules
  const permissionModules = [
    {
      id: 'system',
      name: 'System Administration',
      icon: Settings,
      permissions: [
        { id: 'all_access', name: 'Full System Access', description: 'Complete administrative control' },
        { id: 'user_management', name: 'User Management', description: 'Create, edit, and delete users' },
        { id: 'system_settings', name: 'System Settings', description: 'Modify system configuration' },
        { id: 'security_settings', name: 'Security Settings', description: 'Manage security policies' },
        { id: 'view_analytics', name: 'View Analytics', description: 'Access system analytics' },
        { id: 'manage_staff', name: 'Manage Staff', description: 'Staff scheduling and management' }
      ]
    },
    {
      id: 'pos',
      name: 'Point of Sale',
      icon: ShoppingCart,
      permissions: [
        { id: 'all_operations', name: 'All POS Operations', description: 'Complete POS functionality' },
        { id: 'process_sales', name: 'Process Sales', description: 'Handle sales transactions' },
        { id: 'accept_payments', name: 'Accept Payments', description: 'Process payments' },
        { id: 'refunds', name: 'Process Refunds', description: 'Handle full refunds' },
        { id: 'limited_refunds', name: 'Limited Refunds', description: 'Refunds up to specific amount' },
        { id: 'basic_refunds', name: 'Basic Refunds', description: 'Small amount refunds only' },
        { id: 'discounts', name: 'Apply Discounts', description: 'Apply any discount amount' },
        { id: 'apply_discounts', name: 'Apply Standard Discounts', description: 'Apply predefined discounts' },
        { id: 'void_transactions', name: 'Void Transactions', description: 'Cancel transactions' }
      ]
    },
    {
      id: 'inventory',
      name: 'Inventory Management',
      icon: Package,
      permissions: [
        { id: 'full_access', name: 'Full Inventory Access', description: 'Complete inventory control' },
        { id: 'view_all', name: 'View All Inventory', description: 'View all inventory data' },
        { id: 'view_stock', name: 'View Stock Levels', description: 'Check stock availability' },
        { id: 'stock_adjustments', name: 'Stock Adjustments', description: 'Adjust inventory levels' },
        { id: 'basic_adjustments', name: 'Basic Adjustments', description: 'Limited stock adjustments' },
        { id: 'transfers', name: 'Stock Transfers', description: 'Transfer between locations' },
        { id: 'audits', name: 'Inventory Audits', description: 'Conduct inventory audits' },
        { id: 'receive_stock', name: 'Receive Stock', description: 'Process incoming inventory' },
        { id: 'cycle_counts', name: 'Cycle Counts', description: 'Perform cycle counting' }
      ]
    },
    {
      id: 'financial',
      name: 'Financial Management',
      icon: BarChart3,
      permissions: [
        { id: 'all_reports', name: 'All Financial Reports', description: 'Access all financial data' },
        { id: 'store_reports', name: 'Store Reports', description: 'Store-level financial reports' },
        { id: 'daily_reports', name: 'Daily Reports', description: 'Daily sales and cash reports' },
        { id: 'sales_analytics', name: 'Sales Analytics', description: 'Sales performance analytics' },
        { id: 'accounting', name: 'Accounting Functions', description: 'Full accounting access' },
        { id: 'tax_management', name: 'Tax Management', description: 'VAT and tax reporting' },
        { id: 'payment_settings', name: 'Payment Settings', description: 'Configure payment methods' }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'suspended': return <Lock className="h-4 w-4 text-orange-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'system': return 'bg-purple-100 text-purple-800';
      case 'management': return 'bg-blue-100 text-blue-800';
      case 'operational': return 'bg-green-100 text-green-800';
      case 'specialized': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'system': return <Crown className="h-4 w-4" />;
      case 'management': return <Building className="h-4 w-4" />;
      case 'operational': return <Users className="h-4 w-4" />;
      case 'specialized': return <Shield className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Settings
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Roles & Permissions</h1>
            <p className="text-gray-600">Manage user access, roles, and system permissions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Security Audit
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users, roles, or permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            User Roles
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Active Users
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* User Roles */}
        <TabsContent value="roles" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>User Roles</CardTitle>
                  <CardDescription>Define roles and their associated permissions</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userRoles.map((role) => (
                  <div key={role.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          {getLevelIcon(role.level)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{role.name}</h3>
                            <Badge className={getLevelColor(role.level)}>
                              {role.level}
                            </Badge>
                            <Badge className={getStatusColor(role.status)}>
                              {getStatusIcon(role.status)}
                              {role.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{role.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                            <div>
                              <span className="font-medium">Users:</span> {role.userCount}
                            </div>
                            <div>
                              <span className="font-medium">Last Modified:</span> {role.lastModified}
                            </div>
                            <div>
                              <span className="font-medium">Created By:</span> {role.createdBy}
                            </div>
                          </div>

                          {/* Permissions Summary */}
                          <div className="mt-4">
                            <div className="text-sm font-medium mb-2">Key Permissions:</div>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(role.permissions).map(([module, permissions]) => (
                                <Badge key={module} variant="secondary" className="text-xs">
                                  {module}: {permissions.length} permissions
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Restrictions */}
                          {role.restrictions.length > 0 && (
                            <div className="mt-3">
                              <div className="text-sm font-medium mb-2 text-orange-700">Restrictions:</div>
                              <div className="flex flex-wrap gap-2">
                                {role.restrictions.map((restriction, index) => (
                                  <Badge key={index} variant="outline" className="text-xs text-orange-700 border-orange-300">
                                    {restriction.replace(/_/g, ' ')}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <UserCheck className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Users */}
        <TabsContent value="users" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Active Users</CardTitle>
                  <CardDescription>Manage individual user accounts and their role assignments</CardDescription>
                </div>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeUsers.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{user.avatar}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{user.name}</h3>
                            <Badge className={getStatusColor(user.status)}>
                              {getStatusIcon(user.status)}
                              {user.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex gap-4 text-xs text-gray-500 mt-1">
                            <span>Role: {userRoles.find(r => r.id === user.role)?.name}</span>
                            <span>Department: {user.department}</span>
                            <span>Last Login: {user.lastLogin}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Lock className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions */}
        <TabsContent value="permissions" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Modules</CardTitle>
              <CardDescription>System permissions organized by functional modules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {permissionModules.map((module) => (
                  <div key={module.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <module.icon className="h-6 w-6 text-gray-600" />
                      </div>
                      <h3 className="text-lg font-semibold">{module.name}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {module.permissions.map((permission) => (
                        <div key={permission.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{permission.name}</h4>
                            <Switch defaultChecked={permission.id.includes('all_') || permission.id.includes('full_')} />
                          </div>
                          <p className="text-sm text-gray-600">{permission.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Policies</CardTitle>
              <CardDescription>Configure system security and access control policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="font-medium mb-4">Authentication Security</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Require Strong Passwords</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Two-Factor Authentication</label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Password Expiry (90 days)</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Account Lockout (5 failed attempts)</label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Session Management</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Automatic Session Timeout</label>
                    <Select defaultValue="8hours">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2hours">2 hours</SelectItem>
                        <SelectItem value="4hours">4 hours</SelectItem>
                        <SelectItem value="8hours">8 hours</SelectItem>
                        <SelectItem value="24hours">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Single Sign-On (SSO)</label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Remember Login</label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Access Control</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">IP Address Restrictions</label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Device Registration Required</label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Audit All User Actions</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Role-Based Menu Access</label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Monitoring</CardTitle>
              <CardDescription>Track security events and user activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Login Attempts</h4>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold">156</p>
                  <p className="text-sm text-gray-600">Today</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-medium">Failed Logins</h4>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold">3</p>
                  <p className="text-sm text-gray-600">Today</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Active Sessions</h4>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold">28</p>
                  <p className="text-sm text-gray-600">Current</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <h4 className="font-medium">Security Events</h4>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold">2</p>
                  <p className="text-sm text-gray-600">This week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PermissionsPage;