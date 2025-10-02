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
import { Progress } from "@/components/ui/progress";
import {
  Gift,
  Star,
  Trophy,
  Target,
  Calendar,
  Users,
  CreditCard,
  ShoppingBag,
  Percent,
  Award,
  Crown,
  Heart,
  Zap,
  Settings,
  Save,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  BarChart3
} from 'lucide-react';

const LoyaltySettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');

  // Loyalty Program Settings
  const [loyaltySettings, setLoyaltySettings] = useState({
    isEnabled: true,
    programName: 'Oud Palace Rewards',
    programDescription: 'Earn points on every purchase and unlock exclusive rewards',
    pointsPerDirham: 1,
    minimumRedemption: 100,
    pointsExpiry: 365,
    tierSystem: true,
    referralBonus: 500,
    birthdayBonus: 200,
    welcomeBonus: 100,
    autoEnrollment: true,
    emailNotifications: true,
    smsNotifications: true
  });

  // Loyalty Tiers
  const [loyaltyTiers, setLoyaltyTiers] = useState([
    {
      id: 'bronze',
      name: 'Bronze',
      description: 'Starting tier for new members',
      icon: '🥉',
      color: '#CD7F32',
      minimumSpend: 0,
      minimumPoints: 0,
      pointsMultiplier: 1,
      benefits: [
        'Earn 1 point per AED spent',
        'Birthday bonus: 200 points',
        'Early access to sales'
      ],
      memberCount: 1250,
      isActive: true
    },
    {
      id: 'silver',
      name: 'Silver',
      description: 'For valued customers',
      icon: '🥈',
      color: '#C0C0C0',
      minimumSpend: 5000,
      minimumPoints: 2500,
      pointsMultiplier: 1.25,
      benefits: [
        'Earn 1.25 points per AED spent',
        'Free shipping on all orders',
        'Priority customer support',
        'Birthday bonus: 300 points'
      ],
      memberCount: 680,
      isActive: true
    },
    {
      id: 'gold',
      name: 'Gold',
      description: 'For our best customers',
      icon: '🥇',
      color: '#FFD700',
      minimumSpend: 15000,
      minimumPoints: 7500,
      pointsMultiplier: 1.5,
      benefits: [
        'Earn 1.5 points per AED spent',
        'Exclusive access to premium products',
        'Personal shopping assistant',
        'Free express delivery',
        'Birthday bonus: 500 points'
      ],
      memberCount: 320,
      isActive: true
    },
    {
      id: 'platinum',
      name: 'Platinum',
      description: 'VIP treatment for elite customers',
      icon: '💎',
      color: '#E5E4E2',
      minimumSpend: 50000,
      minimumPoints: 25000,
      pointsMultiplier: 2,
      benefits: [
        'Earn 2 points per AED spent',
        'VIP customer service line',
        'Complimentary gift wrapping',
        'Exclusive events and previews',
        'Personal fragrance consultation',
        'Birthday bonus: 1000 points'
      ],
      memberCount: 85,
      isActive: true
    }
  ]);

  // Reward Categories
  const [rewardCategories, setRewardCategories] = useState([
    {
      id: 'discounts',
      name: 'Discount Vouchers',
      description: 'Percentage and fixed amount discounts',
      icon: Percent,
      rewards: [
        { id: 'disc5', name: '5% Off Next Purchase', points: 500, type: 'percentage', value: 5 },
        { id: 'disc10', name: '10% Off Next Purchase', points: 1000, type: 'percentage', value: 10 },
        { id: 'disc50', name: 'AED 50 Off', points: 1250, type: 'fixed', value: 50 },
        { id: 'disc100', name: 'AED 100 Off', points: 2500, type: 'fixed', value: 100 }
      ],
      isActive: true
    },
    {
      id: 'products',
      name: 'Free Products',
      description: 'Complimentary products and samples',
      icon: Gift,
      rewards: [
        { id: 'sample', name: 'Fragrance Sample Set', points: 800, type: 'product', value: 'SAMPLE-SET-001' },
        { id: 'travel', name: 'Travel Size Oud', points: 1500, type: 'product', value: 'TRAVEL-OUD-001' },
        { id: 'premium', name: 'Premium Oud 10ml', points: 3000, type: 'product', value: 'PREMIUM-OUD-10ML' }
      ],
      isActive: true
    },
    {
      id: 'services',
      name: 'Premium Services',
      description: 'Exclusive services and experiences',
      icon: Star,
      rewards: [
        { id: 'consultation', name: 'Personal Fragrance Consultation', points: 2000, type: 'service', value: 'CONSULTATION' },
        { id: 'delivery', name: 'Free Express Delivery', points: 300, type: 'service', value: 'EXPRESS-DELIVERY' },
        { id: 'wrapping', name: 'Premium Gift Wrapping', points: 200, type: 'service', value: 'GIFT-WRAP' }
      ],
      isActive: true
    },
    {
      id: 'experiences',
      name: 'Exclusive Experiences',
      description: 'VIP events and special experiences',
      icon: Trophy,
      rewards: [
        { id: 'workshop', name: 'Oud Blending Workshop', points: 5000, type: 'experience', value: 'WORKSHOP' },
        { id: 'vip-event', name: 'VIP Product Launch Event', points: 8000, type: 'experience', value: 'VIP-EVENT' },
        { id: 'masterclass', name: 'Perfumery Masterclass', points: 10000, type: 'experience', value: 'MASTERCLASS' }
      ],
      isActive: true
    }
  ]);

  // Program Statistics
  const [programStats, setProgramStats] = useState({
    totalMembers: 2335,
    activeMembers: 1896,
    pointsIssued: 1250000,
    pointsRedeemed: 485000,
    redemptionRate: 38.8,
    averageOrderValue: 850,
    memberRetention: 82.5,
    monthlyGrowth: 12.3
  });

  // Recent Activities
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'redemption',
      customer: 'Aisha Rahman',
      action: 'Redeemed 1000 points for 10% discount',
      points: -1000,
      timestamp: '2024-03-15 14:30'
    },
    {
      id: 2,
      type: 'earn',
      customer: 'Mohammed Al Rashid',
      action: 'Earned points from purchase',
      points: +450,
      timestamp: '2024-03-15 13:45'
    },
    {
      id: 3,
      type: 'tier_upgrade',
      customer: 'Fatima Hassan',
      action: 'Upgraded to Gold tier',
      points: 0,
      timestamp: '2024-03-15 12:20'
    },
    {
      id: 4,
      type: 'bonus',
      customer: 'Omar Khalil',
      action: 'Birthday bonus awarded',
      points: +500,
      timestamp: '2024-03-15 10:15'
    },
    {
      id: 5,
      type: 'referral',
      customer: 'Sara Ahmed',
      action: 'Referral bonus for new member',
      points: +500,
      timestamp: '2024-03-15 09:30'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'redemption': return <Gift className="h-4 w-4 text-blue-600" />;
      case 'earn': return <Star className="h-4 w-4 text-green-600" />;
      case 'tier_upgrade': return <Trophy className="h-4 w-4 text-purple-600" />;
      case 'bonus': return <Award className="h-4 w-4 text-orange-600" />;
      case 'referral': return <Users className="h-4 w-4 text-pink-600" />;
      default: return <Star className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPointsColor = (points) => {
    return points > 0 ? 'text-green-600' : 'text-red-600';
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
            <h1 className="text-3xl font-bold text-gray-900">Loyalty Program Configuration</h1>
            <p className="text-gray-600">Configure rewards, tiers, and loyalty program settings</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Program Status Alert */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Gift className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Loyalty Program Active</p>
              <p className="text-sm text-green-700">
                {programStats.totalMembers?.toLocaleString() || "0"} total members • {programStats.activeMembers?.toLocaleString() || "0"} active members •
                {programStats.redemptionRate}% redemption rate
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loyalty Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="tiers" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Tiers
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Rewards
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Members
          </TabsTrigger>
        </TabsList>

        {/* General Loyalty Settings */}
        <TabsContent value="general" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Program Configuration</CardTitle>
              <CardDescription>Configure basic loyalty program settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="programName">Program Name</Label>
                  <Input
                    id="programName"
                    value={loyaltySettings.programName}
                    onChange={(e) =>
                      setLoyaltySettings(prev => ({...prev, programName: e.target.value}))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="pointsPerDirham">Points per AED Spent</Label>
                  <Input
                    id="pointsPerDirham"
                    type="number"
                    value={loyaltySettings.pointsPerDirham}
                    onChange={(e) =>
                      setLoyaltySettings(prev => ({...prev, pointsPerDirham: parseInt(e.target.value)}))
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="programDescription">Program Description</Label>
                  <Textarea
                    id="programDescription"
                    value={loyaltySettings.programDescription}
                    onChange={(e) =>
                      setLoyaltySettings(prev => ({...prev, programDescription: e.target.value}))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="minimumRedemption">Minimum Points for Redemption</Label>
                  <Input
                    id="minimumRedemption"
                    type="number"
                    value={loyaltySettings.minimumRedemption}
                    onChange={(e) =>
                      setLoyaltySettings(prev => ({...prev, minimumRedemption: parseInt(e.target.value)}))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="pointsExpiry">Points Expiry (Days)</Label>
                  <Input
                    id="pointsExpiry"
                    type="number"
                    value={loyaltySettings.pointsExpiry}
                    onChange={(e) =>
                      setLoyaltySettings(prev => ({...prev, pointsExpiry: parseInt(e.target.value)}))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bonus Points Configuration</CardTitle>
              <CardDescription>Configure bonus points for special events and actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="welcomeBonus">Welcome Bonus</Label>
                  <Input
                    id="welcomeBonus"
                    type="number"
                    value={loyaltySettings.welcomeBonus}
                    onChange={(e) =>
                      setLoyaltySettings(prev => ({...prev, welcomeBonus: parseInt(e.target.value)}))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="birthdayBonus">Birthday Bonus</Label>
                  <Input
                    id="birthdayBonus"
                    type="number"
                    value={loyaltySettings.birthdayBonus}
                    onChange={(e) =>
                      setLoyaltySettings(prev => ({...prev, birthdayBonus: parseInt(e.target.value)}))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="referralBonus">Referral Bonus</Label>
                  <Input
                    id="referralBonus"
                    type="number"
                    value={loyaltySettings.referralBonus}
                    onChange={(e) =>
                      setLoyaltySettings(prev => ({...prev, referralBonus: parseInt(e.target.value)}))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Program Options</CardTitle>
              <CardDescription>Configure program behavior and customer experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isEnabled">Enable Loyalty Program</Label>
                    <p className="text-sm text-gray-600">Activate the loyalty program for all customers</p>
                  </div>
                  <Switch
                    id="isEnabled"
                    checked={loyaltySettings.isEnabled}
                    onCheckedChange={(checked) =>
                      setLoyaltySettings(prev => ({...prev, isEnabled: checked}))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="tierSystem">Enable Tier System</Label>
                    <p className="text-sm text-gray-600">Use multiple tiers with different benefits</p>
                  </div>
                  <Switch
                    id="tierSystem"
                    checked={loyaltySettings.tierSystem}
                    onCheckedChange={(checked) =>
                      setLoyaltySettings(prev => ({...prev, tierSystem: checked}))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoEnrollment">Auto-Enrollment</Label>
                    <p className="text-sm text-gray-600">Automatically enroll new customers</p>
                  </div>
                  <Switch
                    id="autoEnrollment"
                    checked={loyaltySettings.autoEnrollment}
                    onCheckedChange={(checked) =>
                      setLoyaltySettings(prev => ({...prev, autoEnrollment: checked}))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Send points and reward notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={loyaltySettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setLoyaltySettings(prev => ({...prev, emailNotifications: checked}))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Send points updates via SMS</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={loyaltySettings.smsNotifications}
                    onCheckedChange={(checked) =>
                      setLoyaltySettings(prev => ({...prev, smsNotifications: checked}))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Loyalty Tiers */}
        <TabsContent value="tiers" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Loyalty Tiers</CardTitle>
                  <CardDescription>Configure tier levels and their benefits</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tier
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {loyaltyTiers.map((tier) => (
                  <div key={tier.id} className="border rounded-lg p-6" style={{borderColor: tier.color}}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{tier.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold" style={{color: tier.color}}>{tier.name}</h3>
                            <Badge className={getStatusColor(tier.isActive ? 'active' : 'inactive')}>
                              {tier.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-4">{tier.description}</p>

                          <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-4">
                            <div>
                              <h4 className="font-medium mb-2">Requirements</h4>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div>Minimum Spend: AED {tier.minimumSpend?.toLocaleString() || "0"}</div>
                                <div>Minimum Points: {tier.minimumPoints?.toLocaleString() || "0"}</div>
                                <div>Points Multiplier: {tier.pointsMultiplier}x</div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Statistics</h4>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div>Members: {tier.memberCount?.toLocaleString() || "0"}</div>
                                <div>Percentage: {((tier.memberCount / programStats.totalMembers) * 100).toFixed(1)}%</div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Benefits</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {tier.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span>{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={tier.isActive}
                          onCheckedChange={(checked) => {
                            // Update tier active status
                            console.log(`Setting ${tier.name} active: ${checked}`);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards */}
        <TabsContent value="rewards" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Reward Categories</CardTitle>
                  <CardDescription>Manage available rewards and redemption options</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reward
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {rewardCategories.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <category.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={category.isActive}
                          onCheckedChange={(checked) => {
                            // Update category active status
                            console.log(`Setting ${category.name} active: ${checked}`);
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {category.rewards.map((reward) => (
                        <div key={reward.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{reward.name}</h4>
                            <Badge variant="secondary">{reward.points} pts</Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            Type: {reward.type} • Value: {reward.value}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">Total Members</h3>
                </div>
                <p className="text-xl sm:text-2xl font-bold">{programStats.totalMembers?.toLocaleString() || "0"}</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  +{programStats.monthlyGrowth}% this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-medium">Points Issued</h3>
                </div>
                <p className="text-xl sm:text-2xl font-bold">{programStats.pointsIssued?.toLocaleString() || "0"}</p>
                <p className="text-sm text-gray-600">Total lifetime</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium">Redemption Rate</h3>
                </div>
                <p className="text-xl sm:text-2xl font-bold">{programStats.redemptionRate}%</p>
                <p className="text-sm text-gray-600">{programStats.pointsRedeemed?.toLocaleString() || "0"} points redeemed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag className="h-5 w-5 text-purple-600" />
                  <h3 className="font-medium">Avg Order Value</h3>
                </div>
                <p className="text-xl sm:text-2xl font-bold">AED {programStats.averageOrderValue}</p>
                <p className="text-sm text-gray-600">Member vs non-member</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tier Distribution</CardTitle>
              <CardDescription>Member distribution across loyalty tiers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loyaltyTiers.map((tier) => {
                  const percentage = (tier.memberCount / programStats.totalMembers) * 100;
                  return (
                    <div key={tier.id} className="flex items-center gap-4">
                      <div className="flex items-center gap-2 w-32">
                        <span className="text-lg">{tier.icon}</span>
                        <span className="font-medium">{tier.name}</span>
                      </div>
                      <div className="flex-1">
                        <Progress value={percentage} className="h-3" />
                      </div>
                      <div className="w-20 text-right">
                        <div className="font-medium">{tier.memberCount?.toLocaleString() || "0"}</div>
                        <div className="text-sm text-gray-600">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest loyalty program activities and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getActivityIcon(activity.type)}
                      <div>
                        <div className="font-medium">{activity.customer}</div>
                        <div className="text-sm text-gray-600">{activity.action}</div>
                        <div className="text-xs text-gray-500">{activity.timestamp}</div>
                      </div>
                    </div>
                    {activity.points !== 0 && (
                      <div className={`font-medium ${getPointsColor(activity.points)}`}>
                        {activity.points > 0 ? '+' : ''}{activity.points} pts
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members */}
        <TabsContent value="members" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Member Management</CardTitle>
                  <CardDescription>View and manage loyalty program members</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Members
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export List
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder="Search members..." className="flex-1" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="bronze">Bronze</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="active">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border rounded-lg">
                  <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b font-medium">
                    <div>Member</div>
                    <div>Tier</div>
                    <div>Points</div>
                    <div>Total Spent</div>
                    <div>Join Date</div>
                    <div>Actions</div>
                  </div>

                  {/* Sample member data - in real app this would come from props/state */}
                  <div className="divide-y">
                    <div className="grid grid-cols-6 gap-4 p-4 items-center">
                      <div>
                        <div className="font-medium">Aisha Rahman</div>
                        <div className="text-sm text-gray-600">aisha.rahman@email.com</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🥇</span>
                        <span>Gold</span>
                      </div>
                      <div className="font-mono">12,450</div>
                      <div>AED 18,500</div>
                      <div className="text-sm">Jan 15, 2023</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-4 p-4 items-center">
                      <div>
                        <div className="font-medium">Mohammed Al Rashid</div>
                        <div className="text-sm text-gray-600">mohammed.rashid@email.com</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🥈</span>
                        <span>Silver</span>
                      </div>
                      <div className="font-mono">8,720</div>
                      <div>AED 9,850</div>
                      <div className="text-sm">Mar 22, 2023</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-4 p-4 items-center">
                      <div>
                        <div className="font-medium">Fatima Hassan</div>
                        <div className="text-sm text-gray-600">fatima.hassan@email.com</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🥉</span>
                        <span>Bronze</span>
                      </div>
                      <div className="font-mono">3,200</div>
                      <div>AED 3,200</div>
                      <div className="text-sm">Nov 8, 2023</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
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

export default LoyaltySettingsPage;