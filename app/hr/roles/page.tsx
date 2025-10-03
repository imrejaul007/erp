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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Shield,
  Users,
  Key,
  Lock,
  Unlock,
  Plus,
  Edit,
  Eye,
  Trash2,
  Settings,
  UserCheck,
  UserX,
  Crown,
  Star,
  Building,
  MapPin,
  Calendar,
  Clock,
  Activity,
  FileText,
  Database,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Copy,
  ChevronRight,
  Zap,
  Globe,
  Smartphone,
  ArrowLeft} from 'lucide-react';

const RolesPage = () => {
  const [selectedRole, setSelectedRole] = useState('all');
  const [showAddRoleDialog, setShowAddRoleDialog] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState(null);

  // Sample roles data
  const roleMetrics = {
    totalRoles: 8,
    activeRoles: 7,
    customRoles: 5,
    usersWithRoles: 42,
    pendingAssignments: 3
  };

  const roles = [
    {
      id: 'role001',
      name: 'Store Manager',
      nameArabic: 'مدير المتجر',
      description: 'Full store management access including inventory, sales, and staff management',
      descriptionArabic: 'إدارة كاملة للمتجر تشمل المخزون والمبيعات وإدارة الموظفين',
      type: 'predefined',
      color: '#3B82F6',
      usersCount: 8,
      isActive: true,
      permissions: {
        inventory: ['read', 'write', 'delete'],
        sales: ['read', 'write', 'delete'],
        hr: ['read', 'write'],
        reports: ['read', 'write'],
        settings: ['read']
      },
      locations: ['Dubai Mall Store', 'Abu Dhabi Mall Store'],
      createdAt: '2024-01-15',
      lastModified: '2024-01-20'
    },
    {
      id: 'role002',
      name: 'Sales Associate',
      nameArabic: 'مندوب مبيعات',
      description: 'Basic sales operations and customer service',
      descriptionArabic: 'عمليات المبيعات الأساسية وخدمة العملاء',
      type: 'predefined',
      color: '#10B981',
      usersCount: 22,
      isActive: true,
      permissions: {
        inventory: ['read'],
        sales: ['read', 'write'],
        hr: [],
        reports: ['read'],
        settings: []
      },
      locations: ['All Locations'],
      createdAt: '2024-01-15',
      lastModified: '2024-01-18'
    },
    {
      id: 'role003',
      name: 'Assistant Manager',
      nameArabic: 'مساعد مدير',
      description: 'Supports store operations with limited administrative access',
      descriptionArabic: 'يدعم عمليات المتجر مع وصول إداري محدود',
      type: 'custom',
      color: '#F59E0B',
      usersCount: 6,
      isActive: true,
      permissions: {
        inventory: ['read', 'write'],
        sales: ['read', 'write'],
        hr: ['read'],
        reports: ['read'],
        settings: []
      },
      locations: ['Dubai Mall Store', 'Sharjah City Centre'],
      createdAt: '2024-01-16',
      lastModified: '2024-01-22'
    },
    {
      id: 'role004',
      name: 'HR Manager',
      nameArabic: 'مدير الموارد البشرية',
      description: 'Complete HR management including payroll and compliance',
      descriptionArabic: 'إدارة كاملة للموارد البشرية تشمل الرواتب والامتثال',
      type: 'predefined',
      color: '#8B5CF6',
      usersCount: 2,
      isActive: true,
      permissions: {
        inventory: [],
        sales: ['read'],
        hr: ['read', 'write', 'delete'],
        reports: ['read', 'write'],
        settings: ['read']
      },
      locations: ['Head Office'],
      createdAt: '2024-01-15',
      lastModified: '2024-01-25'
    },
    {
      id: 'role005',
      name: 'Inventory Controller',
      nameArabic: 'مراقب المخزون',
      description: 'Specialized inventory management and tracking',
      descriptionArabic: 'إدارة وتتبع متخصص للمخزون',
      type: 'custom',
      color: '#EF4444',
      usersCount: 3,
      isActive: true,
      permissions: {
        inventory: ['read', 'write', 'delete'],
        sales: ['read'],
        hr: [],
        reports: ['read'],
        settings: []
      },
      locations: ['Warehouse', 'Dubai Mall Store'],
      createdAt: '2024-01-17',
      lastModified: '2024-01-23'
    }
  ];

  const permissions = {
    inventory: {
      name: 'Inventory Management',
      nameArabic: 'إدارة المخزون',
      actions: [
        { id: 'inventory_read', name: 'View Inventory', nameArabic: 'عرض المخزون' },
        { id: 'inventory_write', name: 'Add/Edit Products', nameArabic: 'إضافة/تعديل المنتجات' },
        { id: 'inventory_delete', name: 'Delete Products', nameArabic: 'حذف المنتجات' },
        { id: 'inventory_transfer', name: 'Transfer Stock', nameArabic: 'نقل المخزون' },
        { id: 'inventory_adjust', name: 'Stock Adjustments', nameArabic: 'تعديلات المخزون' }
      ]
    },
    sales: {
      name: 'Sales & POS',
      nameArabic: 'المبيعات ونقاط البيع',
      actions: [
        { id: 'sales_read', name: 'View Sales', nameArabic: 'عرض المبيعات' },
        { id: 'sales_write', name: 'Process Sales', nameArabic: 'معالجة المبيعات' },
        { id: 'sales_refund', name: 'Process Refunds', nameArabic: 'معالجة المرتجعات' },
        { id: 'sales_discount', name: 'Apply Discounts', nameArabic: 'تطبيق الخصومات' },
        { id: 'sales_void', name: 'Void Transactions', nameArabic: 'إلغاء المعاملات' }
      ]
    },
    hr: {
      name: 'Human Resources',
      nameArabic: 'الموارد البشرية',
      actions: [
        { id: 'hr_read', name: 'View Employee Data', nameArabic: 'عرض بيانات الموظفين' },
        { id: 'hr_write', name: 'Manage Employees', nameArabic: 'إدارة الموظفين' },
        { id: 'hr_payroll', name: 'Manage Payroll', nameArabic: 'إدارة الرواتب' },
        { id: 'hr_attendance', name: 'Track Attendance', nameArabic: 'تتبع الحضور' },
        { id: 'hr_performance', name: 'Performance Reviews', nameArabic: 'تقييمات الأداء' }
      ]
    },
    reports: {
      name: 'Reports & Analytics',
      nameArabic: 'التقارير والتحليلات',
      actions: [
        { id: 'reports_read', name: 'View Reports', nameArabic: 'عرض التقارير' },
        { id: 'reports_export', name: 'Export Reports', nameArabic: 'تصدير التقارير' },
        { id: 'reports_schedule', name: 'Schedule Reports', nameArabic: 'جدولة التقارير' },
        { id: 'reports_analytics', name: 'Advanced Analytics', nameArabic: 'تحليلات متقدمة' }
      ]
    },
    settings: {
      name: 'System Settings',
      nameArabic: 'إعدادات النظام',
      actions: [
        { id: 'settings_read', name: 'View Settings', nameArabic: 'عرض الإعدادات' },
        { id: 'settings_write', name: 'Modify Settings', nameArabic: 'تعديل الإعدادات' },
        { id: 'settings_user_mgmt', name: 'User Management', nameArabic: 'إدارة المستخدمين' },
        { id: 'settings_system', name: 'System Configuration', nameArabic: 'تكوين النظام' }
      ]
    }
  };

  const userRoleAssignments = [
    {
      id: 'assign001',
      userId: 'EMP001',
      userName: 'Ahmed Al-Rashid',
      userNameArabic: 'أحمد الراشد',
      email: 'ahmed.rashid@oudpalace.ae',
      roleId: 'role001',
      roleName: 'Store Manager',
      location: 'Dubai Mall Store',
      assignedDate: '2024-01-15',
      assignedBy: 'HR001',
      isActive: true,
      expiryDate: null
    },
    {
      id: 'assign002',
      userId: 'EMP002',
      userName: 'Fatima Al-Zahra',
      userNameArabic: 'فاطمة الزهراء',
      email: 'fatima.zahra@oudpalace.ae',
      roleId: 'role002',
      roleName: 'Sales Associate',
      location: 'Abu Dhabi Mall Store',
      assignedDate: '2024-01-20',
      assignedBy: 'HR001',
      isActive: true,
      expiryDate: null
    },
    {
      id: 'assign003',
      userId: 'EMP003',
      userName: 'Omar Hassan',
      userNameArabic: 'عمر حسن',
      email: 'omar.hassan@oudpalace.ae',
      roleId: 'role003',
      roleName: 'Assistant Manager',
      location: 'Sharjah City Centre',
      assignedDate: '2024-01-18',
      assignedBy: 'HR001',
      isActive: true,
      expiryDate: '2024-12-31'
    }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'predefined': return 'bg-blue-100 text-blue-800';
      case 'custom': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPermissionLevel = (permissions) => {
    const totalActions = Object.values(permissions).flat().length;
    if (totalActions >= 15) return { level: 'Full Access', color: 'text-red-600' };
    if (totalActions >= 10) return { level: 'High Access', color: 'text-orange-600' };
    if (totalActions >= 5) return { level: 'Medium Access', color: 'text-yellow-600' };
    return { level: 'Limited Access', color: 'text-green-600' };
  };

  const handleEditRole = (role) => {
    setSelectedRoleForEdit(role);
    setShowPermissionsDialog(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold text-gray-900">Role-Based Access Control</h1>
          <p className="text-gray-600">Manage user roles and permissions across all locations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Roles
          </Button>
          <Dialog open={showAddRoleDialog} onOpenChange={setShowAddRoleDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Define a new role with specific permissions and access levels
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roleName">Role Name (English)</Label>
                    <Input id="roleName" placeholder="e.g., Assistant Manager" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roleNameArabic">Role Name (Arabic)</Label>
                    <Input id="roleNameArabic" placeholder="e.g., مساعد مدير" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (English)</Label>
                  <Textarea id="description" placeholder="Role description and responsibilities..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionArabic">Description (Arabic)</Label>
                  <Textarea id="descriptionArabic" placeholder="وصف الدور والمسؤوليات..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleColor">Role Color</Label>
                  <Input type="color" id="roleColor" defaultValue="#3B82F6" />
                </div>
                <div className="space-y-2">
                  <Label>Applicable Locations</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="dubai_mall" />
                      <Label htmlFor="dubai_mall">Dubai Mall Store</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="abu_dhabi" />
                      <Label htmlFor="abu_dhabi">Abu Dhabi Mall Store</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sharjah" />
                      <Label htmlFor="sharjah">Sharjah City Centre</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="head_office" />
                      <Label htmlFor="head_office">Head Office</Label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddRoleDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    setShowAddRoleDialog(false);
                    setShowPermissionsDialog(true);
                  }}>
                    Continue to Permissions
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Roles</p>
                <p className="text-xl sm:text-2xl font-bold">{roleMetrics.totalRoles}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Roles</p>
                <p className="text-xl sm:text-2xl font-bold">{roleMetrics.activeRoles}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Custom Roles</p>
                <p className="text-xl sm:text-2xl font-bold">{roleMetrics.customRoles}</p>
              </div>
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Users with Roles</p>
                <p className="text-xl sm:text-2xl font-bold">{roleMetrics.usersWithRoles}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-xl sm:text-2xl font-bold">{roleMetrics.pendingAssignments}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="roles" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="roles">Role Management</TabsTrigger>
          <TabsTrigger value="assignments">User Assignments</TabsTrigger>
          <TabsTrigger value="permissions">Permission Matrix</TabsTrigger>
        </TabsList>

        {/* Role Management Tab */}
        <TabsContent value="roles" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>System Roles</CardTitle>
                  <CardDescription>Manage roles and their access levels</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="predefined">Predefined Roles</SelectItem>
                      <SelectItem value="custom">Custom Roles</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
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
              <div className="space-y-4">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${role.color}20` }}
                      >
                        <Shield className="h-5 w-5" style={{ color: role.color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{role.name}</div>
                          <Badge className={getTypeColor(role.type)}>
                            {role.type}
                          </Badge>
                          {!role.isActive && (
                            <Badge variant="outline" className="text-red-600">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{role.nameArabic}</div>
                        <div className="text-sm text-gray-600">{role.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="text-center">
                        <div className="font-medium">{role.usersCount}</div>
                        <div className="text-xs text-gray-500">Users</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-medium ${getPermissionLevel(role.permissions).color}`}>
                          {getPermissionLevel(role.permissions).level}
                        </div>
                        <div className="text-xs text-gray-500">Access Level</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm">{role.locations.length}</div>
                        <div className="text-xs text-gray-500">Locations</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditRole(role)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Role Assignments</CardTitle>
                  <CardDescription>Manage user role assignments and permissions</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Assigned Date</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userRoleAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{assignment.userName}</div>
                            <div className="text-sm text-gray-500">{assignment.userNameArabic}</div>
                            <div className="text-xs text-gray-400">{assignment.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{assignment.roleName}</div>
                        <div className="text-sm text-gray-500">{assignment.roleId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{assignment.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{assignment.assignedDate}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {assignment.expiryDate || 'No expiry'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={assignment.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {assignment.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <XCircle className="h-4 w-4" />
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

        {/* Permission Matrix Tab */}
        <TabsContent value="permissions" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>Overview of permissions across all roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {Object.entries(permissions).map(([moduleKey, module]) => (
                  <div key={moduleKey} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-lg">{module.name}</div>
                      <div className="text-gray-500">({module.nameArabic})</div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/3">Permission</TableHead>
                            {roles.slice(0, 4).map((role) => (
                              <TableHead key={role.id} className="text-center">
                                <div className="flex flex-col items-center">
                                  <div className="font-medium">{role.name}</div>
                                  <div className="text-xs text-gray-500">{role.nameArabic}</div>
                                </div>
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {module.actions.map((action) => (
                            <TableRow key={action.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{action.name}</div>
                                  <div className="text-sm text-gray-500">{action.nameArabic}</div>
                                </div>
                              </TableCell>
                              {roles.slice(0, 4).map((role) => (
                                <TableCell key={role.id} className="text-center">
                                  {role.permissions[moduleKey] && role.permissions[moduleKey].length > 0 ? (
                                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Permissions Dialog */}
      <Dialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Configure Permissions
              {selectedRoleForEdit && ` - ${selectedRoleForEdit.name}`}
            </DialogTitle>
            <DialogDescription>
              Select the permissions and access levels for this role
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-6">
            {Object.entries(permissions).map(([moduleKey, module]) => (
              <div key={moduleKey} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-lg">{module.name}</div>
                  <div className="text-gray-500">({module.nameArabic})</div>
                </div>
                <div className="grid grid-cols-2 gap-3 pl-4">
                  {module.actions.map((action) => (
                    <div key={action.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={action.id}
                        defaultChecked={
                          selectedRoleForEdit?.permissions[moduleKey]?.includes(action.id.split('_')[1])
                        }
                      />
                      <Label htmlFor={action.id} className="text-sm">
                        <div>{action.name}</div>
                        <div className="text-xs text-gray-500">{action.nameArabic}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPermissionsDialog(false)}>
              Cancel
            </Button>
            <Button>Save Permissions</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RolesPage;