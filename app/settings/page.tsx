'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  User,
  Shield,
  Globe,
  Bell,
  Palette,
  Database,
  CreditCard,
  Building,
  Users,
  Lock,
  Key,
  Mail,
  Smartphone,
  Monitor,
  Cloud,
  Archive,
  Download,
  Upload,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  Plus,
  Save,
  RefreshCw,
  ArrowRight,
  Sparkles,
  ArrowLeft} from 'lucide-react';

const SettingsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [saveStatus, setSaveStatus] = useState('');

  // Sample settings data with state management
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'Oud Palace UAE',
    businessType: 'Perfume & Oud Retail',
    taxNumber: 'TRN-100123456789',
    currency: 'AED',
    timezone: 'Asia/Dubai',
    language: 'English',
    secondaryLanguage: 'Arabic',
    vatRate: 5,
    fiscalYearStart: 'January'
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('generalSettings');
    if (savedSettings) {
      try {
        setGeneralSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  const handleGeneralSettingChange = (field: string, value: any) => {
    setGeneralSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('generalSettings', JSON.stringify(generalSettings));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (e) {
      console.error('Failed to save settings:', e);
      setSaveStatus('error');
    }
  };

  const systemSettings = {
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: '7 years',
    auditLogs: true,
    performanceMonitoring: true,
    errorReporting: true,
    maintenanceMode: false
  };

  const userRoles = [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full system access',
      users: 3,
      permissions: ['all_modules', 'user_management', 'system_settings'],
      status: 'active'
    },
    {
      id: 'manager',
      name: 'Store Manager',
      description: 'Store operations and staff management',
      users: 8,
      permissions: ['pos', 'inventory', 'reports', 'staff_management'],
      status: 'active'
    },
    {
      id: 'sales',
      name: 'Sales Associate',
      description: 'POS and customer service',
      users: 24,
      permissions: ['pos', 'customers', 'basic_inventory'],
      status: 'active'
    },
    {
      id: 'warehouse',
      name: 'Warehouse Staff',
      description: 'Inventory and stock management',
      users: 12,
      permissions: ['inventory', 'purchasing', 'transfers'],
      status: 'active'
    }
  ];

  const notifications = {
    lowStock: true,
    newOrders: true,
    paymentReceived: true,
    staffAbsence: true,
    systemAlerts: true,
    reportGenerated: false,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false
  };

  const integrations = [
    {
      name: 'WhatsApp Business',
      description: 'Customer communication and order updates',
      status: 'connected',
      lastSync: '2 minutes ago',
      icon: Smartphone
    },
    {
      name: 'UAE Payment Gateway',
      description: 'Credit card and digital payments',
      status: 'connected',
      lastSync: '1 hour ago',
      icon: CreditCard
    },
    {
      name: 'Emirates Post',
      description: 'Shipping and delivery tracking',
      status: 'connected',
      lastSync: '30 minutes ago',
      icon: Archive
    },
    {
      name: 'Dubai Customs',
      description: 'Import/export documentation',
      status: 'pending',
      lastSync: 'Never',
      icon: Globe
    },
    {
      name: 'Google Analytics',
      description: 'E-commerce tracking and insights',
      status: 'disconnected',
      lastSync: '3 days ago',
      icon: Monitor
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'disconnected': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings & Administration</h1>
            <p className="text-gray-600">Configure system settings, user management, and integrations</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Settings
          </Button>
          <Button onClick={handleSaveSettings} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users & Roles</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Basic company details and business configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Company Name</label>
                  <Input
                    value={generalSettings.companyName}
                    onChange={(e) => handleGeneralSettingChange('companyName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Business Type</label>
                  <Input
                    value={generalSettings.businessType}
                    onChange={(e) => handleGeneralSettingChange('businessType', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tax Registration Number</label>
                  <Input
                    value={generalSettings.taxNumber}
                    onChange={(e) => handleGeneralSettingChange('taxNumber', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">VAT Rate (%)</label>
                  <Input
                    type="number"
                    value={generalSettings.vatRate}
                    onChange={(e) => handleGeneralSettingChange('vatRate', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Primary Currency</label>
                  <Select
                    value={generalSettings.currency}
                    onValueChange={(value) => handleGeneralSettingChange('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Timezone</label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) => handleGeneralSettingChange('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Dubai">Asia/Dubai (UAE)</SelectItem>
                      <SelectItem value="Asia/Riyadh">Asia/Riyadh (KSA)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Localization</CardTitle>
              <CardDescription>Language and regional settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Primary Language</label>
                  <Select
                    value={generalSettings.language}
                    onValueChange={(value) => handleGeneralSettingChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Arabic">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Secondary Language</label>
                  <Select
                    value={generalSettings.secondaryLanguage}
                    onValueChange={(value) => handleGeneralSettingChange('secondaryLanguage', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arabic">العربية</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover-dark transition-all"
            onClick={() => router.push('/settings/theme')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-blue-600" />
                Theme Customization
                <Sparkles className="h-4 w-4 text-yellow-500 ml-auto" />
              </CardTitle>
              <CardDescription>
                Customize colors and appearance for each page and section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Personalize your dashboard with custom themes, preset options, and dark mode
                </div>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  Configure Theme
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users & Roles */}
        <TabsContent value="users" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>User Roles & Permissions</CardTitle>
                  <CardDescription>Manage user roles and access levels</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userRoles.map((role) => (
                  <div key={role.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Shield className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{role.name}</h3>
                            <Badge className={getStatusColor(role.status)}>
                              {role.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{role.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{role.users} users assigned</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm font-medium mb-2">Permissions:</div>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((permission) => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="font-medium mb-4">Business Alerts</h3>
                <div className="space-y-3">
                  {Object.entries(notifications).slice(0, 6).map(([key, enabled]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                      <Switch checked={enabled} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-4">Delivery Methods</h3>
                <div className="space-y-3">
                  {Object.entries(notifications).slice(6).map(([key, enabled]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                      <Switch checked={enabled} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>Manage connections with external services and APIs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <integration.icon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{integration.name}</h3>
                            <Badge className={getStatusColor(integration.status)}>
                              {getStatusIcon(integration.status)}
                              {integration.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{integration.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Last sync: {integration.lastSync}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4" />
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

        {/* System Settings */}
        <TabsContent value="system" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Core system settings and maintenance options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="font-medium mb-4">Data Management</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Automatic Backup</label>
                    <Switch checked={systemSettings.autoBackup} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Audit Logging</label>
                    <Switch checked={systemSettings.auditLogs} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Performance Monitoring</label>
                    <Switch checked={systemSettings.performanceMonitoring} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Error Reporting</label>
                    <Switch checked={systemSettings.errorReporting} />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-4">Maintenance</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Maintenance Mode</label>
                    <Switch checked={systemSettings.maintenanceMode} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure authentication and security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="font-medium mb-4">Authentication</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Two-Factor Authentication</label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Password Expiry (90 days)</label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Login Session Timeout</label>
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
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-4">Data Protection</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Data Encryption at Rest</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">API Rate Limiting</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">IP Whitelist</label>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;