'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FlaskConical,
  Beaker,
  Star,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Filter,
  BarChart3,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RDExperiment {
  id: string;
  experimentCode: string;
  name: string;
  type: 'fragrance' | 'oud_distillation' | 'blend' | 'extraction';
  status: 'planning' | 'in_progress' | 'testing' | 'success' | 'failed';
  startDate: string;
  endDate?: string;
  researcher: string;
  batchSize: number;
  cost: number;
  formula: {
    ingredient: string;
    percentage: number;
    notes?: string;
  }[];
  targetProfile: string;
  actualProfile?: string;
  customerFeedback?: {
    rating: number;
    comments: string;
  }[];
  successRate: number;
  notes: string;
  version: number;
}

export default function RDExperimentsPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [showNewExperiment, setShowNewExperiment] = useState(false);

  // Mock data
  const experiments: RDExperiment[] = [
    {
      id: '1',
      experimentCode: 'EXP-2024-001',
      name: 'Royal Oud Premium Blend v3',
      type: 'blend',
      status: 'success',
      startDate: '2024-11-15',
      endDate: '2024-12-01',
      researcher: 'Dr. Ahmed Hassan',
      batchSize: 500,
      cost: 2500.0,
      formula: [
        { ingredient: 'Cambodian Oud Oil', percentage: 40, notes: 'Premium grade' },
        { ingredient: 'Indian Sandalwood', percentage: 25 },
        { ingredient: 'Rose Absolute', percentage: 20 },
        { ingredient: 'Amber Extract', percentage: 10 },
        { ingredient: 'Musk Base', percentage: 5 },
      ],
      targetProfile: 'Rich, woody, with floral undertones. Long-lasting (8-12 hours)',
      actualProfile: 'Achieved target. Excellent longevity (10+ hours)',
      customerFeedback: [
        { rating: 5, comments: 'Absolutely stunning! The best oud I have ever tried.' },
        { rating: 5, comments: 'Perfect balance of woody and floral notes.' },
        { rating: 4, comments: 'Great scent but a bit pricey.' },
      ],
      successRate: 95,
      notes: 'This version is ready for production. Customer feedback is overwhelmingly positive.',
      version: 3,
    },
    {
      id: '2',
      experimentCode: 'EXP-2024-002',
      name: 'Summer Breeze Attar',
      type: 'fragrance',
      status: 'in_progress',
      startDate: '2024-12-10',
      researcher: 'Fatima Al Mansouri',
      batchSize: 250,
      cost: 1200.0,
      formula: [
        { ingredient: 'Jasmine Absolute', percentage: 35 },
        { ingredient: 'Bergamot Oil', percentage: 30 },
        { ingredient: 'White Musk', percentage: 20 },
        { ingredient: 'Vanilla Extract', percentage: 10 },
        { ingredient: 'Citrus Blend', percentage: 5 },
      ],
      targetProfile: 'Light, fresh, citrusy. Suitable for daily wear in hot weather.',
      successRate: 0,
      notes: 'Currently in maturation phase. Will test after 2 weeks of aging.',
      version: 1,
    },
    {
      id: '3',
      experimentCode: 'EXP-2024-003',
      name: 'Intense Oud Distillation',
      type: 'oud_distillation',
      status: 'failed',
      startDate: '2024-11-01',
      endDate: '2024-11-25',
      researcher: 'Mohammed Ali',
      batchSize: 100,
      cost: 3500.0,
      formula: [
        { ingredient: 'Malaysian Agarwood Chips', percentage: 100, notes: 'Grade A+' },
      ],
      targetProfile: 'Strong, smoky, resinous. High concentration.',
      actualProfile: 'Too harsh, overpowering smoke notes. Not marketable.',
      customerFeedback: [
        { rating: 2, comments: 'Too strong for my taste.' },
        { rating: 3, comments: 'Smells medicinal rather than luxurious.' },
      ],
      successRate: 25,
      notes: 'Distillation temperature was too high. Need to reduce by 15-20°C for next trial.',
      version: 1,
    },
    {
      id: '4',
      experimentCode: 'EXP-2024-004',
      name: 'Rose & Saffron Fusion',
      type: 'blend',
      status: 'testing',
      startDate: '2024-12-05',
      researcher: 'Dr. Ahmed Hassan',
      batchSize: 300,
      cost: 1800.0,
      formula: [
        { ingredient: 'Persian Rose Oil', percentage: 50 },
        { ingredient: 'Saffron Tincture', percentage: 15 },
        { ingredient: 'Oud Wood Base', percentage: 20 },
        { ingredient: 'Cardamom Essence', percentage: 10 },
        { ingredient: 'Patchouli', percentage: 5 },
      ],
      targetProfile: 'Luxurious, spicy-floral blend. Middle Eastern heritage.',
      customerFeedback: [
        { rating: 4, comments: 'Beautiful, but saffron could be stronger.' },
        { rating: 5, comments: 'Exactly what I was looking for!' },
      ],
      successRate: 75,
      notes: 'Customer testing underway. Positive initial feedback. May increase saffron to 18%.',
      version: 2,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      default:
        return <FlaskConical className="h-4 w-4" />;
    }
  };

  const filteredExperiments = experiments.filter((exp) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['planning', 'in_progress', 'testing'].includes(exp.status);
    return exp.status === activeTab;
  });

  const totalExperiments = experiments.length;
  const successfulExperiments = experiments.filter((e) => e.status === 'success').length;
  const activeExperiments = experiments.filter((e) =>
    ['planning', 'in_progress', 'testing'].includes(e.status)
  ).length;
  const totalInvestment = experiments.reduce((sum, e) => sum + e.cost, 0);
  const successRate = totalExperiments > 0
    ? ((successfulExperiments / experiments.filter((e) => ['success', 'failed'].includes(e.status)).length) * 100).toFixed(0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            R&D Experiments
          </h1>
          <p className="text-gray-600 mt-2">
            Track fragrance experiments, trials, and customer feedback
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-purple-500 to-pink-600"
          onClick={() => setShowNewExperiment(!showNewExperiment)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Experiment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Experiments</CardTitle>
            <FlaskConical className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExperiments}</div>
            <p className="text-xs text-gray-600 mt-1">{activeExperiments} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successRate}%</div>
            <p className="text-xs text-gray-600 mt-1">{successfulExperiments} successful</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">R&D Investment</CardTitle>
            <Beaker className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {totalInvestment.toFixed(0)}</div>
            <p className="text-xs text-gray-600 mt-1">Total spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2/5</div>
            <p className="text-xs text-gray-600 mt-1">Customer feedback</p>
          </CardContent>
        </Card>
      </div>

      {/* Experiments List */}
      <Card>
        <CardHeader>
          <CardTitle>Experiments</CardTitle>
          <CardDescription>All R&D experiments and trials</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="testing">Testing</TabsTrigger>
              <TabsTrigger value="success">Success</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {filteredExperiments.map((exp) => (
                <Card key={exp.id} className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{exp.name}</h3>
                          <Badge className={getStatusColor(exp.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(exp.status)}
                              {exp.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </Badge>
                          <Badge variant="outline">{exp.type.replace('_', ' ')}</Badge>
                          <Badge variant="outline">v{exp.version}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Code: {exp.experimentCode}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Success Rate</p>
                        <p className="text-2xl font-bold text-purple-600">{exp.successRate}%</p>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Researcher</p>
                        <p className="font-medium">{exp.researcher}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Batch Size</p>
                        <p className="font-medium">{exp.batchSize}ml</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Cost</p>
                        <p className="font-medium">AED {exp.cost.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-medium">
                          {exp.endDate
                            ? `${Math.ceil(
                                (new Date(exp.endDate).getTime() -
                                  new Date(exp.startDate).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )} days`
                            : 'Ongoing'}
                        </p>
                      </div>
                    </div>

                    {/* Formula */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Formula Composition</p>
                      <div className="space-y-2">
                        {exp.formula.map((ingredient, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-50 rounded-lg p-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">{ingredient.ingredient}</span>
                                <span className="text-sm text-gray-600">{ingredient.percentage}%</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-500 to-pink-600"
                                  style={{ width: `${ingredient.percentage}%` }}
                                />
                              </div>
                              {ingredient.notes && (
                                <p className="text-xs text-gray-500 mt-1">{ingredient.notes}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Target vs Actual */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-sm font-medium text-blue-900 mb-2">Target Profile</p>
                        <p className="text-sm text-blue-700">{exp.targetProfile}</p>
                      </div>
                      {exp.actualProfile && (
                        <div
                          className={`rounded-lg p-4 border ${
                            exp.status === 'success'
                              ? 'bg-green-50 border-green-200'
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <p
                            className={`text-sm font-medium mb-2 ${
                              exp.status === 'success' ? 'text-green-900' : 'text-red-900'
                            }`}
                          >
                            Actual Profile
                          </p>
                          <p
                            className={`text-sm ${
                              exp.status === 'success' ? 'text-green-700' : 'text-red-700'
                            }`}
                          >
                            {exp.actualProfile}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Customer Feedback */}
                    {exp.customerFeedback && exp.customerFeedback.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Customer Feedback ({exp.customerFeedback.length})
                        </p>
                        <div className="space-y-2">
                          {exp.customerFeedback.map((feedback, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < feedback.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                                <span className="text-xs text-gray-600">
                                  {feedback.rating}/5
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{feedback.comments}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Research Notes</p>
                      <p className="text-sm text-gray-600">{exp.notes}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {exp.status === 'success' && (
                        <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Move to Production
                        </Button>
                      )}
                      {exp.status === 'failed' && (
                        <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600">
                          <FlaskConical className="mr-2 h-4 w-4" />
                          Create New Version
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Analytics
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredExperiments.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FlaskConical className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>No experiments found in this category</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
