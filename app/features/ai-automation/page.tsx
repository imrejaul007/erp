'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Bot, Brain, Zap, MessageSquare, FileSearch, BarChart3, Sparkles, Workflow,
  ArrowLeft, TrendingUp, Target, Clock, CheckCircle2, Activity, DollarSign
} from 'lucide-react';

export default function AIAutomationPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');

  const aiSummary = {
    activeWorkflows: 45,
    tasksSaved: 12500,
    timeSavedHours: 856,
    accuracyRate: 96.8,
    predictionsGenerated: 3456,
    automationROI: 420,
    aiModelsActive: 12,
    processingSpeed: 15000
  };

  const aiFeatures = [
    {
      id: 'chatbot',
      title: 'AI Customer Chatbot',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      path: '/features/ai-automation/chatbot',
      status: 'active',
      description: '24/7 AI-powered customer support in English and Arabic',
      metrics: {
        conversations: 8456,
        satisfaction: 92.5,
        resolution: 78.5,
        avgResponse: 2.3
      },
      features: [
        'Natural language processing (English & Arabic)',
        'Product recommendations based on preferences',
        'Order tracking and status updates',
        'FAQ and knowledge base integration',
        'Seamless handoff to human agents',
        'Multi-channel support (web, WhatsApp, social)',
        'Sentiment analysis and feedback collection',
        'Continuous learning from interactions'
      ]
    },
    {
      id: 'forecasting',
      title: 'AI Demand Forecasting',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      path: '/features/ai-automation/forecasting',
      status: 'active',
      description: 'Predict demand and optimize inventory with machine learning',
      metrics: {
        accuracy: 94.5,
        forecasts: 2456,
        savings: 125000,
        stockouts: 5
      },
      features: [
        'Sales trend prediction (daily, weekly, monthly)',
        'Seasonal pattern recognition',
        'Event-based demand spikes (Ramadan, Eid)',
        'Multi-location demand planning',
        'New product launch forecasting',
        'Weather and holiday impact analysis',
        'Reorder point optimization',
        'Excess inventory identification'
      ]
    },
    {
      id: 'pricing',
      title: 'Dynamic Pricing AI',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/features/ai-automation/pricing',
      status: 'active',
      description: 'AI-powered price optimization for maximum profitability',
      metrics: {
        products: 856,
        marginIncrease: 12.5,
        competitiveness: 94,
        revenue: 285000
      },
      features: [
        'Competitive price monitoring',
        'Demand-based pricing adjustments',
        'Margin optimization algorithms',
        'Promotional pricing recommendations',
        'Price elasticity analysis',
        'Bundle pricing optimization',
        'Location-based pricing strategies',
        'Real-time price updates'
      ]
    },
    {
      id: 'document',
      title: 'Document Intelligence',
      icon: FileSearch,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      path: '/features/ai-automation/document',
      status: 'active',
      description: 'Extract data from invoices, receipts, and documents',
      metrics: {
        processed: 4567,
        accuracy: 98.2,
        timeSaved: 456,
        errors: 12
      },
      features: [
        'Invoice and receipt OCR scanning',
        'Automatic data extraction',
        'Multi-language document support',
        'Purchase order processing',
        'Contract analysis and key term extraction',
        'Document classification',
        'Handwriting recognition',
        'Validation against business rules'
      ]
    },
    {
      id: 'workflows',
      title: 'Workflow Automation',
      icon: Workflow,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      path: '/features/ai-automation/workflows',
      status: 'active',
      description: 'Automate repetitive tasks and business processes',
      metrics: {
        workflows: 45,
        executions: 12500,
        successRate: 96.8,
        timeSaved: 856
      },
      features: [
        'Visual workflow builder (drag & drop)',
        'Trigger-based automation (time, event, condition)',
        'Multi-step workflow sequences',
        'Email and SMS automation',
        'Data transformation and mapping',
        'API integration support',
        'Error handling and retries',
        'Audit logs and monitoring'
      ]
    },
    {
      id: 'analytics',
      title: 'Predictive Analytics',
      icon: BarChart3,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100',
      path: '/features/ai-automation/analytics',
      status: 'active',
      description: 'AI-powered insights and business predictions',
      metrics: {
        predictions: 3456,
        accuracy: 92.8,
        insights: 856,
        alerts: 45
      },
      features: [
        'Customer churn prediction',
        'Product trend forecasting',
        'Sales performance prediction',
        'Inventory optimization suggestions',
        'Anomaly detection (fraud, errors)',
        'Customer lifetime value prediction',
        'Market basket analysis',
        'Automated insight generation'
      ]
    },
    {
      id: 'recommendations',
      title: 'Smart Recommendations',
      icon: Sparkles,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      path: '/features/ai-automation/recommendations',
      status: 'active',
      description: 'Personalized product recommendations for customers',
      metrics: {
        recommendations: 15600,
        clickRate: 18.5,
        conversion: 8.7,
        revenue: 185000
      },
      features: [
        'Collaborative filtering algorithms',
        'Content-based recommendations',
        'Frequently bought together',
        'Personalized for each customer',
        'Similar product suggestions',
        'Trending and popular items',
        'Cross-sell and upsell opportunities',
        'A/B testing for recommendation strategies'
      ]
    },
    {
      id: 'auto-reorder',
      title: 'Auto Reordering',
      icon: Zap,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      path: '/features/ai-automation/auto-reorder',
      status: 'active',
      description: 'Automatic purchase orders based on AI predictions',
      metrics: {
        orders: 245,
        accuracy: 95.5,
        stockouts: 2,
        savings: 85000
      },
      features: [
        'Automatic reorder point calculation',
        'Lead time and supplier performance tracking',
        'Multi-supplier optimization',
        'Budget and cash flow consideration',
        'Seasonal adjustment',
        'Minimum and maximum order quantities',
        'Purchase order generation',
        'Approval workflow integration'
      ]
    }
  ];

  const workflowPerformance = [
    {
      workflow: 'Auto-invoice Processing',
      executions: 3456,
      success: 98.5,
      timeSaved: 256,
      status: 'active'
    },
    {
      workflow: 'Customer Welcome Email',
      executions: 2847,
      success: 99.2,
      timeSaved: 142,
      status: 'active'
    },
    {
      workflow: 'Low Stock Alerts',
      executions: 1245,
      success: 97.8,
      timeSaved: 98,
      status: 'active'
    },
    {
      workflow: 'Daily Sales Report',
      executions: 95,
      success: 100,
      timeSaved: 47,
      status: 'active'
    },
    {
      workflow: 'VIP Customer Rewards',
      executions: 456,
      success: 96.5,
      timeSaved: 68,
      status: 'active'
    }
  ];

  const aiModels = [
    {
      model: 'Sales Forecasting Model',
      type: 'Regression',
      accuracy: 94.5,
      predictions: 8456,
      lastTrained: '2024-09-28'
    },
    {
      model: 'Customer Churn Predictor',
      type: 'Classification',
      accuracy: 91.2,
      predictions: 2847,
      lastTrained: '2024-09-25'
    },
    {
      model: 'Product Recommender',
      type: 'Collaborative Filtering',
      accuracy: 87.5,
      predictions: 15600,
      lastTrained: '2024-09-29'
    },
    {
      model: 'Price Optimization',
      type: 'Reinforcement Learning',
      accuracy: 93.8,
      predictions: 1245,
      lastTrained: '2024-09-27'
    },
    {
      model: 'Sentiment Analysis',
      type: 'NLP',
      accuracy: 89.5,
      predictions: 5678,
      lastTrained: '2024-09-26'
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Automate repetitive tasks and free up staff for strategic work'
    },
    {
      icon: Target,
      title: 'Increase Accuracy',
      description: 'Reduce human errors with AI-powered automation'
    },
    {
      icon: TrendingUp,
      title: 'Better Decisions',
      description: 'Make data-driven decisions with predictive insights'
    },
    {
      icon: DollarSign,
      title: 'Boost Revenue',
      description: 'Optimize pricing, inventory, and customer experience'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/features')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">AI & Automation</h1>
            <p className="text-muted-foreground">
              Intelligent automation and AI-powered business insights
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {aiSummary.activeWorkflows} Active
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Workflows</CardDescription>
            <CardTitle className="text-3xl">{aiSummary.activeWorkflows}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {aiSummary.tasksSaved.toLocaleString()} tasks automated
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Time Saved</CardDescription>
            <CardTitle className="text-3xl">{aiSummary.timeSavedHours}h</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Accuracy Rate</CardDescription>
            <CardTitle className="text-3xl">{aiSummary.accuracyRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={aiSummary.accuracyRate} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              Across all AI models
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Automation ROI</CardDescription>
            <CardTitle className="text-3xl">{aiSummary.automationROI}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600">
              {aiSummary.predictionsGenerated.toLocaleString()} predictions generated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why AI & Automation?</CardTitle>
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
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiFeatures.map((feature) => (
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
                          <p className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                          <p className="text-lg font-semibold">
                            {typeof value === 'number' && value > 100 ? value.toLocaleString() : value}
                            {key.includes('Rate') || key.includes('accuracy') || key.includes('satisfaction') || key.includes('resolution') || key.includes('success') ? '%' : ''}
                            {key.includes('avgResponse') ? 's' : ''}
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

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Performance</CardTitle>
              <CardDescription>Active automation workflows and their execution stats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowPerformance.map((workflow) => (
                  <div key={workflow.workflow} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{workflow.workflow}</h3>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {workflow.status}
                        </Badge>
                      </div>
                      <div className="flex gap-6 text-sm text-muted-foreground">
                        <span>Executions: {workflow.executions.toLocaleString()}</span>
                        <span>Success: {workflow.success}%</span>
                        <span>Time Saved: {workflow.timeSaved}h</span>
                      </div>
                    </div>
                    <div>
                      <Progress value={workflow.success} className="w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Models</CardTitle>
              <CardDescription>Machine learning models powering your AI features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiModels.map((model) => (
                  <div key={model.model} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{model.model}</h3>
                        <p className="text-sm text-muted-foreground">
                          {model.type} | {model.predictions.toLocaleString()} predictions | Last trained: {model.lastTrained}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{model.accuracy}%</p>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                      </div>
                    </div>
                    <Progress value={model.accuracy} />
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
          <CardDescription>Set up AI and automation features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Connect Data Sources</h3>
                <p className="text-sm text-muted-foreground">
                  Integrate your sales, inventory, and customer data
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Configure AI Models</h3>
                <p className="text-sm text-muted-foreground">
                  Train models with your historical business data
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Create Workflows</h3>
                <p className="text-sm text-muted-foreground">
                  Build automation workflows for repetitive tasks
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Monitor & Optimize</h3>
                <p className="text-sm text-muted-foreground">
                  Track performance and refine AI models over time
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
