'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Megaphone, Gift, Tag, Share2, Mail, MessageSquare, Users2, Award,
  ArrowLeft, TrendingUp, Target, DollarSign, Clock, CheckCircle2,
  AlertCircle, Activity
} from 'lucide-react';

export default function MarketingLoyaltyPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');

  const marketingSummary = {
    activeCampaigns: 12,
    totalReach: 45600,
    engagementRate: 8.7,
    conversionRate: 4.2,
    loyaltyMembers: 2847,
    pointsIssued: 1245000,
    redemptionRate: 62.5,
    campaignROI: 385
  };

  const marketingFeatures = [
    {
      id: 'loyalty',
      title: 'Loyalty Points System',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      path: '/features/marketing/loyalty',
      status: 'active',
      description: 'Comprehensive loyalty program with points, tiers, and rewards',
      metrics: {
        members: 2847,
        activeRate: 68.2,
        avgPoints: 437,
        monthlyRedemptions: 456
      },
      features: [
        'Multi-tier loyalty program (Bronze, Silver, Gold, Platinum)',
        'Points earning on purchases (1 AED = 1 point)',
        'Bonus points for birthdays and anniversaries',
        'Points redemption for discounts and products',
        'Tier-based benefits and exclusive perks',
        'Automated point expiry management',
        'Loyalty card integration (physical & digital)',
        'Member-only events and previews'
      ]
    },
    {
      id: 'referral',
      title: 'Referral Programs',
      icon: Users2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      path: '/features/marketing/referral',
      status: 'active',
      description: 'Customer referral system with rewards for both parties',
      metrics: {
        activeReferrers: 543,
        conversionRate: 32.5,
        avgReward: 85,
        monthlyReferrals: 127
      },
      features: [
        'Unique referral codes for each customer',
        'Dual rewards (referrer & referee)',
        'Tiered rewards based on referral count',
        'Social media sharing integration',
        'Referral tracking dashboard',
        'Automated reward distribution',
        'Leaderboard for top referrers',
        'Custom referral campaigns'
      ]
    },
    {
      id: 'promotions',
      title: 'Promotions Management',
      icon: Tag,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      path: '/features/marketing/promotions',
      status: 'active',
      description: 'Create and manage discounts, offers, and promotional campaigns',
      metrics: {
        activePromos: 8,
        totalRedemptions: 1834,
        avgDiscount: 22.5,
        revenueImpact: 245000
      },
      features: [
        'Flexible discount types (percentage, fixed, BOGO)',
        'Product/category/brand specific promotions',
        'Time-based offers (flash sales, happy hours)',
        'Customer segment targeting',
        'Minimum purchase requirements',
        'Coupon code generation',
        'Bundle offers and gift with purchase',
        'Performance analytics per promotion'
      ]
    },
    {
      id: 'social',
      title: 'Social Media Integration',
      icon: Share2,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      path: '/features/marketing/social',
      status: 'active',
      description: 'Multi-channel social media management and analytics',
      metrics: {
        totalFollowers: 28500,
        engagementRate: 6.8,
        postsPerWeek: 15,
        reach: 45600
      },
      features: [
        'Instagram Shopping integration',
        'Facebook Shop management',
        'WhatsApp Business API',
        'Social media post scheduling',
        'Unified inbox for all channels',
        'Social listening and sentiment analysis',
        'Influencer collaboration tracking',
        'Social commerce analytics'
      ]
    },
    {
      id: 'email',
      title: 'Email Marketing',
      icon: Mail,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      path: '/features/marketing/email',
      status: 'active',
      description: 'Automated email campaigns with personalization',
      metrics: {
        subscribers: 12450,
        openRate: 28.5,
        clickRate: 4.7,
        monthlyEmails: 8560
      },
      features: [
        'Drag & drop email template builder',
        'Customer segmentation for targeting',
        'Automated workflows (welcome, cart abandonment)',
        'A/B testing for subject lines and content',
        'Personalization with customer data',
        'Email analytics and heatmaps',
        'Unsubscribe management',
        'Integration with CRM data'
      ]
    },
    {
      id: 'sms',
      title: 'SMS Campaigns',
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/features/marketing/sms',
      status: 'active',
      description: 'Bulk SMS marketing with high open rates',
      metrics: {
        subscribers: 8745,
        deliveryRate: 98.2,
        responseRate: 12.5,
        monthlySMS: 4280
      },
      features: [
        'Bulk SMS campaigns',
        'Personalized message templates',
        'Scheduled sending',
        'Two-way SMS conversations',
        'Opt-in/opt-out management',
        'SMS automation triggers',
        'Link tracking and analytics',
        'Multi-language support (English/Arabic)'
      ]
    },
    {
      id: 'influencer',
      title: 'Influencer Collaboration',
      icon: Users2,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100',
      path: '/features/marketing/influencer',
      status: 'active',
      description: 'Manage influencer partnerships and track performance',
      metrics: {
        activeInfluencers: 15,
        totalReach: 285000,
        engagementRate: 5.8,
        avgROI: 420
      },
      features: [
        'Influencer database management',
        'Campaign brief creation',
        'Unique discount codes per influencer',
        'Performance tracking by influencer',
        'Content approval workflow',
        'Payment and commission tracking',
        'ROI calculation per collaboration',
        'Contract and agreement storage'
      ]
    },
    {
      id: 'rewards',
      title: 'Customer Rewards',
      icon: Gift,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      path: '/features/marketing/rewards',
      status: 'active',
      description: 'Gamification and reward programs to boost engagement',
      metrics: {
        activeRewards: 28,
        redemptions: 1245,
        participationRate: 45.5,
        avgValue: 65
      },
      features: [
        'Birthday and anniversary rewards',
        'Gamification with badges and achievements',
        'Spin-the-wheel promotions',
        'Scratch cards for random rewards',
        'Milestone rewards (10th purchase, etc.)',
        'Seasonal reward campaigns',
        'Surprise & delight programs',
        'Gift card management'
      ]
    }
  ];

  const campaignPerformance = [
    {
      campaign: 'Ramadan Premium Collection',
      reach: 12500,
      engagement: 9.5,
      conversion: 5.8,
      revenue: 125000,
      roi: 450,
      status: 'active'
    },
    {
      campaign: 'VIP Summer Sale',
      reach: 8400,
      engagement: 12.3,
      conversion: 7.2,
      revenue: 98000,
      roi: 520,
      status: 'active'
    },
    {
      campaign: 'New Customer Welcome',
      reach: 6800,
      engagement: 6.8,
      conversion: 3.5,
      revenue: 45000,
      roi: 280,
      status: 'active'
    },
    {
      campaign: 'Weekend Flash Sale',
      reach: 15600,
      engagement: 8.2,
      conversion: 4.8,
      revenue: 87000,
      roi: 380,
      status: 'completed'
    }
  ];

  const channelPerformance = [
    { channel: 'Email', reach: 12450, engagement: 28.5, conversion: 4.7, cost: 2500 },
    { channel: 'SMS', reach: 8745, engagement: 68.2, conversion: 12.5, cost: 1800 },
    { channel: 'Instagram', reach: 15600, engagement: 6.8, conversion: 2.3, cost: 3500 },
    { channel: 'WhatsApp', reach: 5400, engagement: 45.5, conversion: 8.5, cost: 800 },
    { channel: 'Facebook', reach: 9200, engagement: 5.2, conversion: 1.8, cost: 2200 },
    { channel: 'Influencer', reach: 28500, engagement: 5.8, conversion: 3.2, cost: 8500 }
  ];

  const benefits = [
    {
      icon: Target,
      title: 'Targeted Campaigns',
      description: 'Reach the right customers with segmentation and personalization'
    },
    {
      icon: TrendingUp,
      title: 'Boost Engagement',
      description: 'Increase customer interaction and brand loyalty'
    },
    {
      icon: DollarSign,
      title: 'Maximize ROI',
      description: 'Track and optimize marketing spend for best returns'
    },
    {
      icon: Activity,
      title: 'Multi-Channel',
      description: 'Unified marketing across email, SMS, social media, and more'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/features')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Marketing & Loyalty</h1>
            <p className="text-muted-foreground">
              Drive customer engagement and retention with powerful marketing tools
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Active
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Campaigns</CardDescription>
            <CardTitle className="text-3xl">{marketingSummary.activeCampaigns}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Across all channels
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Reach</CardDescription>
            <CardTitle className="text-3xl">{marketingSummary.totalReach?.toLocaleString() || "0"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600">
              +{marketingSummary.engagementRate}% engagement rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Loyalty Members</CardDescription>
            <CardTitle className="text-3xl">{marketingSummary.loyaltyMembers?.toLocaleString() || "0"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {marketingSummary.redemptionRate}% redemption rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Campaign ROI</CardDescription>
            <CardTitle className="text-3xl">{marketingSummary.campaignROI}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600">
              {marketingSummary.conversionRate}% conversion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why Marketing & Loyalty?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-3">
                <div className="flex-shrink-0">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                  <p className="text-xs text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketingFeatures.map((feature) => (
              <Card
                key={feature.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(feature.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(feature.metrics).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-muted-foreground capitalize">{key}</p>
                          <p className="text-lg font-semibold">
                            {typeof value === 'number' && value > 100 ? value?.toLocaleString() || "0" : value}
                            {key.includes('Rate') ? '%' : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full" variant="outline">
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Active and recent marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignPerformance.map((campaign) => (
                  <div key={campaign.campaign} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{campaign.campaign}</h3>
                        <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="flex gap-4 sm:gap-6 text-sm text-muted-foreground">
                        <span>Reach: {campaign.reach?.toLocaleString() || "0"}</span>
                        <span>Engagement: {campaign.engagement}%</span>
                        <span>Conversion: {campaign.conversion}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl sm:text-2xl font-bold text-green-600">AED {(campaign.revenue / 1000).toFixed(0)}K</p>
                      <p className="text-sm text-muted-foreground">ROI: {campaign.roi}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Channel Performance</CardTitle>
              <CardDescription>Compare performance across marketing channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channelPerformance.map((channel) => (
                  <div key={channel.channel} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{channel.channel}</h3>
                        <p className="text-sm text-muted-foreground">
                          Reach: {channel.reach?.toLocaleString() || "0"} | Engagement: {channel.engagement}% | Conversion: {channel.conversion}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">AED {channel.cost?.toLocaleString() || "0"}</p>
                        <p className="text-xs text-muted-foreground">Cost</p>
                      </div>
                    </div>
                    <Progress value={channel.engagement} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Set up your marketing and loyalty programs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Configure Loyalty Program</h3>
                <p className="text-sm text-muted-foreground">
                  Set up tiers, points rules, and redemption options
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Import Customer Data</h3>
                <p className="text-sm text-muted-foreground">
                  Upload customer lists and create segments
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Connect Channels</h3>
                <p className="text-sm text-muted-foreground">
                  Integrate email, SMS, and social media accounts
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Launch First Campaign</h3>
                <p className="text-sm text-muted-foreground">
                  Create and schedule your first marketing campaign
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
