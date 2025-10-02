'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  Clock,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('all');

  const notifications = [
    {
      id: '1',
      type: 'alert',
      title: 'Low Stock Alert',
      message: 'Royal Oud Premium is running low (8 units remaining)',
      time: '5 minutes ago',
      read: false,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      id: '2',
      type: 'success',
      title: 'Sale Completed',
      message: 'New sale of AED 4,850 completed at Dubai Mall',
      time: '15 minutes ago',
      read: false,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: '3',
      type: 'info',
      title: 'New Customer Registered',
      message: 'Ahmed Al-Rashid joined your loyalty program',
      time: '1 hour ago',
      read: false,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: '4',
      type: 'alert',
      title: 'Purchase Order Approval',
      message: 'PO-2024-156 is pending your approval (AED 45,000)',
      time: '2 hours ago',
      read: true,
      icon: DollarSign,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },
    {
      id: '5',
      type: 'success',
      title: 'Batch Production Complete',
      message: 'BATCH-001 has completed production (1000ml)',
      time: '3 hours ago',
      read: true,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: '6',
      type: 'info',
      title: 'Daily Sales Report',
      message: 'Your daily sales report is ready to download',
      time: '5 hours ago',
      read: true,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: '7',
      type: 'alert',
      title: 'VAT Filing Reminder',
      message: 'VAT return is due in 3 days',
      time: '1 day ago',
      read: true,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      id: '8',
      type: 'info',
      title: 'Staff Schedule Updated',
      message: 'Next week\'s staff schedule has been published',
      time: '2 days ago',
      read: true,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'unread') return !n.read;
    return n.type === selectedTab;
  });

  const markAsRead = (id: string) => {
    toast.success('Notification marked as read');
  };

  const markAllAsRead = () => {
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    toast.success('Notification deleted');
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8 text-blue-600" />
            Notifications
          </h1>
          <p className="text-muted-foreground">Stay updated with your business activities</p>
        </div>
        <Button variant="outline" onClick={markAllAsRead}>
          <Check className="h-4 w-4 mr-2" />
          Mark All as Read
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{unreadCount}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alerts</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">
                  {notifications.filter(n => n.type === 'alert').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Updates</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {notifications.filter(n => n.type === 'success').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Info</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  {notifications.filter(n => n.type === 'info').length}
                </p>
              </div>
              <Info className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread {unreadCount > 0 && <Badge className="ml-2">{unreadCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="alert">Alerts</TabsTrigger>
          <TabsTrigger value="success">Updates</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab}>
          <Card>
            <CardContent className="pt-6">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No notifications in this category</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => {
                    const Icon = notification.icon;
                    return (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                          !notification.read ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${notification.bgColor}`}>
                          <Icon className={`h-5 w-5 ${notification.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold">{notification.title}</h3>
                            {!notification.read && (
                              <Badge className="bg-blue-600">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {notification.time}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
