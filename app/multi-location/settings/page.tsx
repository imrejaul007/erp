'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Settings, Bell, Shield, Database, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function MultiLocationSettingsPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('general');

  const [generalSettings, setGeneralSettings] = useState({
    defaultCurrency: 'AED',
    timezone: 'Asia/Dubai',
    dateFormat: 'DD/MM/YYYY',
    fiscalYearStart: 'january',
    enableMultiCurrency: true,
    autoSyncInterval: '15',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    lowStockAlerts: true,
    transferUpdates: true,
    performanceReports: true,
    staffUpdates: false,
    revenueThreshold: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    requireApprovalForTransfers: true,
    requireApprovalThreshold: '50000',
    twoFactorAuth: false,
    sessionTimeout: '60',
    restrictLocationAccess: true,
    auditLogging: true,
  });

  const [dataSettings, setDataSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: '365',
    dataEncryption: true,
    syncConflictResolution: 'manual',
  });

  const handleSaveSettings = (settingType: string) => {
    toast.success(`${settingType} settings saved successfully`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 text-blue-600" />
            Multi-Location Settings
          </h1>
          <p className="text-muted-foreground">Configure system-wide settings for all locations</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="data">Data & Sync</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Select
                    value={generalSettings.defaultCurrency}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, defaultCurrency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Dubai">Asia/Dubai (GST +4)</SelectItem>
                      <SelectItem value="Asia/Abu_Dhabi">Asia/Abu Dhabi (GST +4)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={generalSettings.dateFormat}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, dateFormat: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fiscalYearStart">Fiscal Year Start</Label>
                  <Select
                    value={generalSettings.fiscalYearStart}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, fiscalYearStart: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="january">January</SelectItem>
                      <SelectItem value="april">April</SelectItem>
                      <SelectItem value="july">July</SelectItem>
                      <SelectItem value="october">October</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="autoSyncInterval">Auto-Sync Interval (minutes)</Label>
                  <Input
                    id="autoSyncInterval"
                    type="number"
                    value={generalSettings.autoSyncInterval}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, autoSyncInterval: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-between pt-6">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableMultiCurrency">Enable Multi-Currency</Label>
                    <div className="text-sm text-gray-500">Allow transactions in multiple currencies</div>
                  </div>
                  <Switch
                    id="enableMultiCurrency"
                    checked={generalSettings.enableMultiCurrency}
                    onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, enableMultiCurrency: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('General')} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Manage alerts and notification channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
                    <div className="text-sm text-gray-500">Get notified when inventory is running low</div>
                  </div>
                  <Switch
                    id="lowStockAlerts"
                    checked={notificationSettings.lowStockAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, lowStockAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="transferUpdates">Transfer Updates</Label>
                    <div className="text-sm text-gray-500">Updates on inter-location transfers</div>
                  </div>
                  <Switch
                    id="transferUpdates"
                    checked={notificationSettings.transferUpdates}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, transferUpdates: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="performanceReports">Performance Reports</Label>
                    <div className="text-sm text-gray-500">Weekly and monthly performance summaries</div>
                  </div>
                  <Switch
                    id="performanceReports"
                    checked={notificationSettings.performanceReports}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, performanceReports: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="staffUpdates">Staff Updates</Label>
                    <div className="text-sm text-gray-500">Staff attendance and schedule changes</div>
                  </div>
                  <Switch
                    id="staffUpdates"
                    checked={notificationSettings.staffUpdates}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, staffUpdates: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="revenueThreshold">Revenue Threshold Alerts</Label>
                    <div className="text-sm text-gray-500">Alert when revenue targets are at risk</div>
                  </div>
                  <Switch
                    id="revenueThreshold"
                    checked={notificationSettings.revenueThreshold}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, revenueThreshold: checked })}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-4">Notification Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <div className="text-sm text-gray-500">Receive notifications via email</div>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotifications">SMS Notifications</Label>
                      <div className="text-sm text-gray-500">Receive notifications via SMS</div>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                      <div className="text-sm text-gray-500">Receive browser push notifications</div>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, pushNotifications: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('Notification')} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireApprovalForTransfers">Require Approval for Transfers</Label>
                    <div className="text-sm text-gray-500">All transfers need manager approval</div>
                  </div>
                  <Switch
                    id="requireApprovalForTransfers"
                    checked={securitySettings.requireApprovalForTransfers}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, requireApprovalForTransfers: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requireApprovalThreshold">Approval Threshold (AED)</Label>
                  <Input
                    id="requireApprovalThreshold"
                    type="number"
                    value={securitySettings.requireApprovalThreshold}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, requireApprovalThreshold: e.target.value })}
                    placeholder="50000"
                  />
                  <div className="text-sm text-gray-500">Transfers above this amount require approval</div>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <div className="text-sm text-gray-500">Require 2FA for all users</div>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Select
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) => setSecuritySettings({ ...securitySettings, sessionTimeout: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="restrictLocationAccess">Restrict Location Access</Label>
                    <div className="text-sm text-gray-500">Users can only access assigned locations</div>
                  </div>
                  <Switch
                    id="restrictLocationAccess"
                    checked={securitySettings.restrictLocationAccess}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, restrictLocationAccess: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="auditLogging">Audit Logging</Label>
                    <div className="text-sm text-gray-500">Log all user actions for security audit</div>
                  </div>
                  <Switch
                    id="auditLogging"
                    checked={securitySettings.auditLogging}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, auditLogging: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('Security')} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data & Sync Settings */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data & Synchronization
              </CardTitle>
              <CardDescription>Manage data backup and synchronization settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoBackup">Automatic Backup</Label>
                    <div className="text-sm text-gray-500">Enable automatic data backup</div>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={dataSettings.autoBackup}
                    onCheckedChange={(checked) => setDataSettings({ ...dataSettings, autoBackup: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select
                    value={dataSettings.backupFrequency}
                    onValueChange={(value) => setDataSettings({ ...dataSettings, backupFrequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retentionPeriod">Data Retention Period (days)</Label>
                  <Input
                    id="retentionPeriod"
                    type="number"
                    value={dataSettings.retentionPeriod}
                    onChange={(e) => setDataSettings({ ...dataSettings, retentionPeriod: e.target.value })}
                    placeholder="365"
                  />
                  <div className="text-sm text-gray-500">How long to keep backup data</div>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="dataEncryption">Data Encryption</Label>
                    <div className="text-sm text-gray-500">Encrypt all stored data</div>
                  </div>
                  <Switch
                    id="dataEncryption"
                    checked={dataSettings.dataEncryption}
                    onCheckedChange={(checked) => setDataSettings({ ...dataSettings, dataEncryption: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="syncConflictResolution">Sync Conflict Resolution</Label>
                  <Select
                    value={dataSettings.syncConflictResolution}
                    onValueChange={(value) => setDataSettings({ ...dataSettings, syncConflictResolution: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Resolution</SelectItem>
                      <SelectItem value="latest">Use Latest Update</SelectItem>
                      <SelectItem value="highest">Use Highest Authority</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-gray-500">How to resolve data conflicts during sync</div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('Data')} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
