'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Smartphone,
  ShoppingCart,
  Users,
  Truck,
  DollarSign,
  UserCheck,
  Beaker,
  Gift,
  FileCheck,
  Zap,
  Building2,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Globe,
  ChevronRight,
  ArrowLeft} from 'lucide-react';

export default function FeaturesPage() {
  const router = useRouter();

  const featureModules = [
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      description: 'Business intelligence, forecasting, and deep insights',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      path: '/features/analytics',
      status: 'active',
      features: ['Sales Forecasting', 'Customer Analytics', 'Profit Analysis', 'ABC Analysis']
    },
    {
      id: 'mobile',
      title: 'Mobile Apps',
      description: 'Mobile POS, warehouse scanner, and manager dashboard',
      icon: Smartphone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      path: '/features/mobile',
      status: 'active',
      features: ['Mobile POS', 'Scanner App', 'Manager Dashboard', 'Sales Rep App']
    },
    {
      id: 'ecommerce',
      title: 'E-Commerce',
      description: 'Online store, order management, and customer portal',
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/features/ecommerce',
      status: 'active',
      features: ['Online Store', 'Order Tracking', 'WhatsApp Commerce', 'Instagram Shopping']
    },
    {
      id: 'crm-advanced',
      title: 'Advanced CRM',
      description: 'Segmentation, campaigns, and customer engagement',
      icon: Users,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      path: '/features/crm-advanced',
      status: 'active',
      features: ['Segmentation', 'Campaigns', 'Feedback', 'Appointments']
    },
    {
      id: 'logistics',
      title: 'Logistics',
      description: 'Supply chain, shipping, and route optimization',
      icon: Truck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      path: '/features/logistics',
      status: 'active',
      features: ['Route Planning', 'Supplier Portal', '3PL Integration', 'Quality Control']
    },
    {
      id: 'finance-advanced',
      title: 'Finance Pro',
      description: 'Advanced financial management and forecasting',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/features/finance-advanced',
      status: 'active',
      features: ['Petty Cash', 'Budgets', 'Forecasting', 'Credit Management']
    },
    {
      id: 'hr-payroll',
      title: 'HR & Payroll',
      description: 'Complete human resource management system',
      icon: UserCheck,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      path: '/features/hr-payroll',
      status: 'active',
      features: ['Payroll', 'Leave Management', 'Performance', 'Commission']
    },
    {
      id: 'production-pro',
      title: 'Production Pro',
      description: 'Advanced production and quality management',
      icon: Beaker,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      path: '/features/production-pro',
      status: 'active',
      features: ['Recipe Management', 'QC Tests', 'Equipment', 'Traceability']
    },
    {
      id: 'marketing',
      title: 'Marketing & Loyalty',
      description: 'Marketing automation and loyalty programs',
      icon: Gift,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      path: '/features/marketing',
      status: 'active',
      features: ['Loyalty Points', 'Referrals', 'Promotions', 'Social Media']
    },
    {
      id: 'compliance',
      title: 'Compliance',
      description: 'Certifications, audit trails, and documentation',
      icon: FileCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      path: '/features/compliance',
      status: 'active',
      features: ['ISO Tracking', 'Halal Certs', 'CITES', 'Audit Trail']
    },
    {
      id: 'automation',
      title: 'AI & Automation',
      description: 'Intelligent automation and AI-powered features',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      path: '/features/automation',
      status: 'active',
      features: ['Chatbot', 'Auto-Reordering', 'Price Optimization', 'Fraud Detection']
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Connect with payment gateways and third-party apps',
      icon: Globe,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      path: '/features/integrations',
      status: 'active',
      features: ['Payments', 'Accounting', 'Tax', 'Marketplaces']
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            Advanced Features
          </h1>
          <p className="text-muted-foreground mt-2">
            Explore powerful features to grow your business
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{featureModules.length}</div>
            <p className="text-sm text-gray-600">Total Modules</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {featureModules.filter(f => f.status === 'active').length}
            </div>
            <p className="text-sm text-gray-600">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl sm:text-2xl font-bold text-purple-600">
              {featureModules.reduce((sum, m) => sum + m.features.length, 0)}
            </div>
            <p className="text-sm text-gray-600">Total Features</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl sm:text-2xl font-bold text-amber-600">100%</div>
            <p className="text-sm text-gray-600">Coverage</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {featureModules.map((module) => {
          const Icon = module.icon;
          return (
            <Card
              key={module.id}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={() => router.push(module.path)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${module.bgColor}`}>
                    <Icon className={`h-6 w-6 ${module.color}`} />
                  </div>
                  <Badge className="bg-green-100 text-green-800">{module.status}</Badge>
                </div>
                <CardTitle className="mt-4">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600 mb-2">Key Features:</div>
                  <div className="space-y-1">
                    {module.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <ChevronRight className="h-3 w-3" />
                        {feature}
                      </div>
                    ))}
                    {module.features.length > 3 && (
                      <div className="text-sm text-blue-600 font-medium">
                        +{module.features.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
