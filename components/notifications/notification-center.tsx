'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, X, Check, Settings, Filter, Search, Archive } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { notificationService, Notification, NotificationPreferences } from '@/lib/services/notification-service';

interface NotificationCenterProps {
  userId: string;
  className?: string;
}

export function NotificationCenter({ userId, className }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<{
    category?: string;
    type?: string;
    unreadOnly: boolean;
  }>({ unreadOnly: false });
  const [searchTerm, setSearchTerm] = useState('');
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const result = await notificationService.getUserNotifications(userId, {
        unreadOnly: filter.unreadOnly,
        category: filter.category,
        type: filter.type as any,
        limit: 50
      });

      setNotifications(result.notifications);
      setUnreadCount(result.unreadCount);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, filter]);

  // Load user preferences
  const loadPreferences = useCallback(async () => {
    try {
      const prefs = await notificationService.getUserPreferences(userId);
      setPreferences(prefs);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }, [userId]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (showPreferences && !preferences) {
      loadPreferences();
    }
  }, [showPreferences, preferences, loadPreferences]);

  // Subscribe to real-time notifications
  useEffect(() => {
    const unsubscribe = notificationService.subscribe(userId, (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return unsubscribe;
  }, [userId]);

  // Filter notifications based on search term
  const filteredNotifications = notifications.filter(notification => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        notification.title.toLowerCase().includes(searchLower) ||
        notification.message.toLowerCase().includes(searchLower) ||
        notification.category.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId, userId);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true, readAt: new Date() } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const count = await notificationService.markAllAsRead(userId);
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true, readAt: new Date() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId, userId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      const deletedNotification = notifications.find(n => n.id === notificationId);
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleUpdatePreferences = async (updatedPreferences: Partial<NotificationPreferences>) => {
    try {
      await notificationService.updateUserPreferences(userId, updatedPreferences);
      setPreferences(prev => prev ? { ...prev, ...updatedPreferences } : null);
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      case 'alert': return '🚨';
      case 'reminder': return '⏰';
      case 'approval': return '📋';
      default: return '📱';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="end">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notifications</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreferences(!showPreferences)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    Mark all read
                  </Button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Select
                    value={filter.category || 'all'}
                    onValueChange={(value) =>
                      setFilter(prev => ({ ...prev, category: value === 'all' ? undefined : value }))
                    }
                  >
                    <SelectTrigger className="h-8 w-32">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="inventory">Inventory</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="crm">CRM</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="unread-only"
                      checked={filter.unreadOnly}
                      onCheckedChange={(checked) =>
                        setFilter(prev => ({ ...prev, unreadOnly: checked as boolean }))
                      }
                    />
                    <label htmlFor="unread-only" className="text-sm">
                      Unread only
                    </label>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {showPreferences ? (
                <NotificationPreferences
                  preferences={preferences}
                  onUpdate={handleUpdatePreferences}
                  onClose={() => setShowPreferences(false)}
                />
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Loading notifications...
                    </div>
                  ) : filteredNotifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No notifications found
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={handleMarkAsRead}
                          onDelete={handleDeleteNotification}
                          formatTimestamp={formatTimestamp}
                          getPriorityColor={getPriorityColor}
                          getTypeIcon={getTypeIcon}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  formatTimestamp: (date: Date) => string;
  getPriorityColor: (priority: string) => string;
  getTypeIcon: (type: string) => string;
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  formatTimestamp,
  getPriorityColor,
  getTypeIcon
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`p-3 border-b hover:bg-muted/50 transition-colors ${
        !notification.read ? 'bg-muted/30' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start space-x-3">
        <div className="text-lg">{getTypeIcon(notification.type)}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium truncate">
              {notification.title}
            </p>
            <div className="flex items-center space-x-1">
              <Badge variant={getPriorityColor(notification.priority) as any} className="text-xs">
                {notification.priority}
              </Badge>
              {isHovered && (
                <div className="flex items-center space-x-1">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkAsRead(notification.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(notification.id)}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {notification.message}
          </p>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {notification.category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(notification.createdAt)}
              </span>
            </div>

            {notification.actionRequired && notification.actionUrl && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                {notification.actionText || 'Take Action'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface NotificationPreferencesProps {
  preferences: NotificationPreferences | null;
  onUpdate: (preferences: Partial<NotificationPreferences>) => void;
  onClose: () => void;
}

function NotificationPreferences({ preferences, onUpdate, onClose }: NotificationPreferencesProps) {
  if (!preferences) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading preferences...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="channels" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="priorities">Priorities</TabsTrigger>
          <TabsTrigger value="timing">Timing</TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="space-y-3">
          <div className="space-y-2">
            {Object.entries(preferences.channels).map(([channel, enabled]) => (
              <div key={channel} className="flex items-center space-x-2">
                <Checkbox
                  id={channel}
                  checked={enabled}
                  onCheckedChange={(checked) =>
                    onUpdate({
                      channels: { ...preferences.channels, [channel]: checked as boolean }
                    })
                  }
                />
                <label htmlFor={channel} className="text-sm capitalize">
                  {channel.replace('_', ' ')}
                </label>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="priorities" className="space-y-3">
          <div className="space-y-2">
            {Object.entries(preferences.priorities).map(([priority, enabled]) => (
              <div key={priority} className="flex items-center space-x-2">
                <Checkbox
                  id={priority}
                  checked={enabled}
                  onCheckedChange={(checked) =>
                    onUpdate({
                      priorities: { ...preferences.priorities, [priority]: checked as boolean }
                    })
                  }
                />
                <label htmlFor={priority} className="text-sm capitalize">
                  {priority} Priority
                </label>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timing" className="space-y-3">
          <div className="space-y-3">
            <Select
              value={preferences.frequency}
              onValueChange={(value) =>
                onUpdate({ frequency: value as 'immediate' | 'batched' | 'digest' })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Notification Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="batched">Batched</SelectItem>
                <SelectItem value="digest">Daily Digest</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="quiet-hours"
                checked={preferences.quietHours.enabled}
                onCheckedChange={(checked) =>
                  onUpdate({
                    quietHours: { ...preferences.quietHours, enabled: checked as boolean }
                  })
                }
              />
              <label htmlFor="quiet-hours" className="text-sm">
                Enable Quiet Hours
              </label>
            </div>

            {preferences.quietHours.enabled && (
              <div className="flex items-center space-x-2">
                <Input
                  type="time"
                  value={preferences.quietHours.start}
                  onChange={(e) =>
                    onUpdate({
                      quietHours: { ...preferences.quietHours, start: e.target.value }
                    })
                  }
                  className="w-24"
                />
                <span className="text-sm">to</span>
                <Input
                  type="time"
                  value={preferences.quietHours.end}
                  onChange={(e) =>
                    onUpdate({
                      quietHours: { ...preferences.quietHours, end: e.target.value }
                    })
                  }
                  className="w-24"
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}