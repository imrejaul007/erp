'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  ShoppingCart,
  Globe,
  Package,
  CreditCard,
  Truck,
  Star,
  MessageSquare,
  ShoppingBag,
  Instagram,
  Facebook,
  Send,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle
} from 'lucide-react';

export default function EcommercePage() {
  const router = useRouter();

  const ecommerceFeatures = [
    {
      id: 'online-store',
      title: 'Online Store',
      description: 'Full-featured e-commerce website with product catalog',
      icon: Globe,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      path: '/features/ecommerce/store',
      status: 'active',
      features: [
        'Beautiful product showcase',
        'Shopping cart & checkout',
        'Customer accounts',
        'Order tracking',
        'Product reviews',
        'Search & filters',
        'Mobile responsive',
        'SEO optimized'
      ],
      metrics: {
        monthlyVisitors: '12.5K',
        conversionRate: '3.8%',
        avgOrderValue: 'AED 1,850',
        activeProducts: 287
      }
    },
    {
      id: 'whatsapp-commerce',
      title: 'WhatsApp Commerce',
      description: 'Sell directly through WhatsApp with catalog integration',
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/features/ecommerce/whatsapp',
      status: 'active',
      features: [
        'WhatsApp Business API',
        'Product catalog sharing',
        'Order via chat',
        'Payment links',
        'Automated responses',
        'Order confirmations',
        'Delivery updates',
        'Customer support'
      ],
      metrics: {
        monthlyChats: '3,450',
        ordersPlaced: 285,
        responseTime: '2.3min',
        satisfaction: '4.9/5'
      }
    },
    {
      id: 'instagram-shopping',
      title: 'Instagram Shopping',
      description: 'Tag products in posts and enable direct purchases',
      icon: Instagram,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      path: '/features/ecommerce/instagram',
      status: 'active',
      features: [
        'Product tagging',
        'Shop tab on profile',
        'Checkout on Instagram',
        'Story shopping',
        'Live shopping',
        'Reels shopping',
        'Insights & analytics',
        'Influencer collaboration'
      ],
      metrics: {
        followers: '28.5K',
        monthlyReach: '145K',
        productViews: '8,950',
        purchases: 156
      }
    },
    {
      id: 'facebook-shop',
      title: 'Facebook Shop',
      description: 'Sell on Facebook with integrated storefront',
      icon: Facebook,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      path: '/features/ecommerce/facebook',
      status: 'active',
      features: [
        'Facebook Shop setup',
        'Product collections',
        'Messenger integration',
        'Facebook Marketplace',
        'Live shopping events',
        'Customer reviews',
        'Ad integration',
        'Analytics dashboard'
      ],
      metrics: {
        shopVisits: '9,250',
        likes: '15.2K',
        monthlyOrders: 128,
        adROI: '4.2x'
      }
    },
    {
      id: 'marketplace-integration',
      title: 'Marketplace Integration',
      description: 'Sell on Noon, Amazon, and other marketplaces',
      icon: ShoppingBag,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      path: '/features/ecommerce/marketplaces',
      status: 'active',
      features: [
        'Multi-marketplace sync',
        'Centralized inventory',
        'Order management',
        'Price optimization',
        'Automated fulfillment',
        'Review management',
        'Analytics & reporting',
        'Commission tracking'
      ],
      metrics: {
        marketplaces: 4,
        monthlyOrders: 425,
        totalRevenue: 'AED 285K',
        avgFee: '12.5%'
      }
    },
    {
      id: 'payment-gateway',
      title: 'Payment Gateway',
      description: 'Accept online payments securely',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      path: '/features/ecommerce/payments',
      status: 'active',
      features: [
        'Multiple payment methods',
        'Credit/Debit cards',
        'Digital wallets',
        'Bank transfers',
        'Cash on delivery',
        'Payment links',
        'Secure checkout',
        'Fraud detection'
      ],
      metrics: {
        successRate: '98.5%',
        avgProcessTime: '3.2s',
        monthlyVolume: 'AED 1.2M',
        methods: 8
      }
    },
    {
      id: 'shipping-integration',
      title: 'Shipping Integration',
      description: 'Integrate with courier services for delivery',
      icon: Truck,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      path: '/features/ecommerce/shipping',
      status: 'active',
      features: [
        'Multiple courier integration',
        'Real-time tracking',
        'Label printing',
        'Rate comparison',
        'Pickup scheduling',
        'COD collection',
        'Returns management',
        'Delivery notifications'
      ],
      metrics: {
        partners: 5,
        monthlyShipments: 385,
        onTimeDelivery: '94%',
        avgCost: 'AED 15'
      }
    },
    {
      id: 'order-management',
      title: 'Order Management',
      description: 'Centralized order processing from all channels',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/features/ecommerce/orders',
      status: 'active',
      features: [
        'Unified order view',
        'Order status tracking',
        'Automated workflows',
        'Inventory sync',
        'Picking & packing',
        'Return processing',
        'Customer notifications',
        'Analytics & reports'
      ],
      metrics: {
        dailyOrders: 45,
        avgProcessTime: '2.5h',
        fulfillmentRate: '97%',
        returnRate: '3.2%'
      }
    }
  ];

  const channelPerformance = [
    { channel: 'Online Store', orders: 485, revenue: 897500, growth: 22.5, icon: Globe },
    { channel: 'WhatsApp', orders: 285, revenue: 425000, growth: 35.8, icon: MessageSquare },
    { channel: 'Instagram', orders: 156, revenue: 288600, growth: 45.2, icon: Instagram },
    { channel: 'Facebook', orders: 128, revenue: 236800, growth: 18.3, icon: Facebook },
    { channel: 'Marketplaces', orders: 425, revenue: 765000, growth: 28.7, icon: ShoppingBag }
  ];

  const ecommerceSummary = {
    totalOrders: 1479,
    totalRevenue: 2612900,
    avgOrderValue: 1767,
    conversionRate: 3.8,
    cartAbandonment: 32.5,
    customerSatisfaction: 4.7
  };

  const benefits = [
    {
      title: 'Reach More Customers',
      description: 'Sell 24/7 online and reach customers beyond physical stores',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Increase Revenue',
      description: 'Multi-channel selling increases sales by average 40%',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Automate Operations',
      description: 'Automated order processing saves time and reduces errors',
      icon: CheckCircle,
      color: 'text-purple-600'
    },
    {
      title: 'Better Insights',
      description: 'Track customer behavior and optimize your strategy',
      icon: Star,
      color: 'text-amber-600'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-8 w-8 text-green-600" />
            E-Commerce Integration
          </h1>
          <p className="text-muted-foreground">
            Online store, social commerce, marketplaces, and omnichannel order management
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        <Card>
          <CardContent className="pt-6">
            <ShoppingCart className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{ecommerceSummary.totalOrders?.toLocaleString() || "0"}</div>
            <div className="text-sm text-gray-600">Monthly Orders</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <DollarSign className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">AED {(ecommerceSummary.totalRevenue / 1000).toFixed(0)}K</div>
            <div className="text-sm text-gray-600">Online Revenue</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">AED {ecommerceSummary.avgOrderValue}</div>
            <div className="text-sm text-gray-600">Avg Order Value</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <CheckCircle className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{ecommerceSummary.conversionRate}%</div>
            <div className="text-sm text-gray-600">Conversion Rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Package className="h-8 w-8 text-amber-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{ecommerceSummary.cartAbandonment}%</div>
            <div className="text-sm text-gray-600">Cart Abandon</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Star className="h-8 w-8 text-amber-600 mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{ecommerceSummary.customerSatisfaction}</div>
            <div className="text-sm text-gray-600">Satisfaction</div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why E-Commerce?</CardTitle>
          <CardDescription>Transform your retail business with online selling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="border rounded-lg p-4">
                  <Icon className={`h-8 w-8 ${benefit.color} mb-3`} />
                  <div className="font-semibold mb-1">{benefit.title}</div>
                  <div className="text-sm text-gray-600">{benefit.description}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Channel Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Channel Performance</CardTitle>
          <CardDescription>Sales breakdown by e-commerce channel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {channelPerformance.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-lg">{channel.channel}</div>
                        <Badge className="bg-green-100 text-green-800">
                          +{channel.growth}% Growth
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Orders</div>
                          <div className="font-bold">{channel.orders}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Revenue</div>
                          <div className="font-bold text-green-600">AED {(channel.revenue / 1000).toFixed(0)}K</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Avg Order</div>
                          <div className="font-bold text-purple-600">AED {Math.round(channel.revenue / channel.orders)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* E-commerce Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {ecommerceFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.id}
              className="cursor-pointer hover:shadow-lg transition-all"
              onClick={() => router.push(feature.path)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <Badge className="bg-green-100 text-green-800">{feature.status}</Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Key Metrics:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(feature.metrics).map(([key, value], idx) => (
                      <div key={idx}>
                        <span className="text-gray-600">{key.replace(/([A-Z])/g, ' $1').trim()}: </span>
                        <span className="font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Features:</div>
                  <div className="space-y-1">
                    {feature.features.slice(0, 4).map((feat, idx) => (
                      <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        {feat}
                      </div>
                    ))}
                    {feature.features.length > 4 && (
                      <div className="text-sm text-blue-600 font-medium">
                        +{feature.features.length - 4} more
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started with E-Commerce</CardTitle>
          <CardDescription>Launch your online sales channels in 4 easy steps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <div className="font-semibold mb-1">Setup Store</div>
              <div className="text-sm text-gray-600">Configure your online store and product catalog</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-green-600">2</span>
              </div>
              <div className="font-semibold mb-1">Connect Channels</div>
              <div className="text-sm text-gray-600">Link WhatsApp, Instagram, and marketplaces</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <div className="font-semibold mb-1">Enable Payments</div>
              <div className="text-sm text-gray-600">Integrate payment gateways and shipping</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-amber-600">4</span>
              </div>
              <div className="font-semibold mb-1">Start Selling</div>
              <div className="text-sm text-gray-600">Launch and manage orders from one dashboard</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Partners */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Partners</CardTitle>
          <CardDescription>Trusted partners for payments, shipping, and marketplaces</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Stripe', 'PayPal', 'Tabby', 'Aramex', 'DHL', 'Noon', 'Amazon', 'Careem', 'Talabat', 'Instashop', 'Shopify', 'Meta'].map((partner, index) => (
              <div key={index} className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <div className="font-semibold text-sm">{partner}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
