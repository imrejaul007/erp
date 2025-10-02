'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Save,
  Camera,
  Shield,
  Activity,
  Clock,
  Award,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@oudpalace.ae',
    phone: '+971-50-123-4567',
    address: 'Dubai, UAE',
    role: 'Administrator',
    department: 'Management',
    joinDate: '2023-01-15',
    bio: 'System administrator with full access to all modules.',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const activityLog = [
    { action: 'Logged in', time: '2 hours ago', ip: '192.168.1.1' },
    { action: 'Updated inventory', time: '3 hours ago', ip: '192.168.1.1' },
    { action: 'Generated report', time: '5 hours ago', ip: '192.168.1.1' },
    { action: 'Created purchase order', time: '1 day ago', ip: '192.168.1.1' },
    { action: 'Logged in', time: '2 days ago', ip: '192.168.1.5' },
  ];

  const achievements = [
    { title: 'First Sale', description: 'Completed your first sale', date: '2023-01-15' },
    { title: '100 Sales', description: 'Reached 100 sales milestone', date: '2023-03-20' },
    { title: 'Perfect Month', description: 'Met all targets for a month', date: '2023-06-30' },
  ];

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password changed successfully');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8 text-blue-600" />
            My Profile
          </h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <Button variant="outline" className="text-red-600" onClick={() => router.push('/login')}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {profileData.firstName[0]}{profileData.lastName[0]}
              </div>
              <Button
                size="sm"
                className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profileData.firstName} {profileData.lastName}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {profileData.role}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {profileData.joinDate}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Badge className="bg-green-100 text-green-800">Active</Badge>
                <Badge variant="outline">{profileData.department}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Profile Info Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleChangePassword} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your recent actions and login history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activityLog.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{activity.action}</div>
                        <div className="text-sm text-gray-600">IP: {activity.ip}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements
              </CardTitle>
              <CardDescription>Your milestones and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                        <Award className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-2">{achievement.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
