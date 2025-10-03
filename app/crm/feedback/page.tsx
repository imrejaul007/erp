'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  Star,
  TrendingUp,
  TrendingDown,
  ThumbsUp,
  ThumbsDown,
  Users,
  BarChart3,
  Plus,
  Download,
  AlertCircle,
  CheckCircle,
  Filter,
  ArrowLeft} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Feedback {
  id: string;
  type: 'post_purchase' | 'sampling' | 'nps' | 'product_review';
  customer: {
    name: string;
    email: string;
    phone: string;
    type: 'VIP' | 'REGULAR' | 'TOURIST';
  };
  product?: string;
  rating: number;
  npsScore?: number;
  responses: {
    question: string;
    answer: string;
  }[];
  sentiment: 'positive' | 'neutral' | 'negative';
  actionRequired: boolean;
  status: 'new' | 'reviewed' | 'resolved';
  date: string;
  notes?: string;
}

interface Survey {
  id: string;
  name: string;
  type: 'post_purchase' | 'sampling' | 'nps' | 'general';
  active: boolean;
  responses: number;
  avgRating: number;
  createdDate: string;
}

export default function FeedbackPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');

  // Mock data
  const feedbacks: Feedback[] = [
    {
      id: '1',
      type: 'post_purchase',
      customer: {
        name: 'Ahmed Al Mansoori',
        email: 'ahmed@example.com',
        phone: '+971501234567',
        type: 'VIP',
      },
      product: 'Royal Oud Perfume 50ml',
      rating: 5,
      responses: [
        { question: 'How satisfied are you with your purchase?', answer: 'Very satisfied' },
        {
          question: 'What did you like most about the product?',
          answer: 'The longevity is incredible. Lasts 12+ hours easily.',
        },
        {
          question: 'Would you recommend this to others?',
          answer: 'Absolutely! Already told 3 friends about it.',
        },
      ],
      sentiment: 'positive',
      actionRequired: false,
      status: 'reviewed',
      date: '2024-01-15',
    },
    {
      id: '2',
      type: 'sampling',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+971509876543',
        type: 'TOURIST',
      },
      product: 'Summer Breeze Attar Sample',
      rating: 3,
      responses: [
        { question: 'How did you like the sample?', answer: 'It was okay, but not my style' },
        {
          question: 'What prevented you from purchasing?',
          answer:
            'Too floral for my taste. I prefer woody, masculine scents. Also, the price seemed high.',
        },
        { question: 'Any suggestions for improvement?', answer: 'Maybe create a men\'s version?' },
      ],
      sentiment: 'neutral',
      actionRequired: true,
      status: 'new',
      date: '2024-01-18',
      notes: 'Opportunity: Create masculine variant. Price sensitivity noted.',
    },
    {
      id: '3',
      type: 'nps',
      customer: {
        name: 'Fatima Hassan',
        email: 'fatima@example.com',
        phone: '+971507654321',
        type: 'VIP',
      },
      npsScore: 9,
      rating: 5,
      responses: [
        {
          question: 'How likely are you to recommend us? (0-10)',
          answer: '9 - Promoter',
        },
        {
          question: 'What is the main reason for your score?',
          answer: 'Excellent quality and authentic oud. Staff is knowledgeable and helpful.',
        },
        {
          question: 'What can we improve?',
          answer: 'Add more sampling options before committing to full bottles.',
        },
      ],
      sentiment: 'positive',
      actionRequired: false,
      status: 'reviewed',
      date: '2024-01-12',
    },
    {
      id: '4',
      type: 'product_review',
      customer: {
        name: 'Mohammed Ali',
        email: 'mohammed@example.com',
        phone: '+971503344556',
        type: 'REGULAR',
      },
      product: 'Oud Chips Premium 100g',
      rating: 2,
      responses: [
        { question: 'How would you rate this product?', answer: '2 stars' },
        {
          question: 'What was your experience?',
          answer:
            'The quality is not consistent. Some chips burn well, others don\'t produce much smoke.',
        },
        {
          question: 'Would you buy again?',
          answer: 'Not unless quality improves. Expected better for the price.',
        },
      ],
      sentiment: 'negative',
      actionRequired: true,
      status: 'new',
      date: '2024-01-20',
      notes: 'URGENT: Quality control issue with Batch #2024-001. Investigate supplier.',
    },
  ];

  const surveys: Survey[] = [
    {
      id: 'S1',
      name: 'Post-Purchase Satisfaction',
      type: 'post_purchase',
      active: true,
      responses: 145,
      avgRating: 4.3,
      createdDate: '2024-01-01',
    },
    {
      id: 'S2',
      name: 'Sampling Feedback Form',
      type: 'sampling',
      active: true,
      responses: 89,
      avgRating: 3.8,
      createdDate: '2024-01-01',
    },
    {
      id: 'S3',
      name: 'Net Promoter Score (NPS)',
      type: 'nps',
      active: true,
      responses: 67,
      avgRating: 4.5,
      createdDate: '2024-01-01',
    },
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'neutral':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="h-4 w-4" />;
      case 'negative':
        return <ThumbsDown className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const filteredFeedbacks = feedbacks.filter((fb) => {
    if (activeTab !== 'all' && fb.type !== activeTab) return false;
    if (sentimentFilter !== 'all' && fb.sentiment !== sentimentFilter) return false;
    return true;
  });

  const totalFeedbacks = feedbacks.length;
  const positiveFeedbacks = feedbacks.filter((f) => f.sentiment === 'positive').length;
  const negativeFeedbacks = feedbacks.filter((f) => f.sentiment === 'negative').length;
  const actionRequired = feedbacks.filter((f) => f.actionRequired).length;
  const avgRating = (
    feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
  ).toFixed(1);
  const npsScore =
    feedbacks
      .filter((f) => f.npsScore)
      .reduce((sum, f) => sum + (f.npsScore || 0), 0) /
    feedbacks.filter((f) => f.npsScore).length;

  return (
    <div className="space-y-6">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Feedback & Surveys
          </h1>
          <p className="text-gray-600 mt-2">
            Collect structured insights and customer satisfaction data
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button className="bg-gradient-to-r from-teal-500 to-cyan-600">
            <Plus className="mr-2 h-4 w-4" />
            Create Survey
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFeedbacks}</div>
            <p className="text-xs text-gray-600 mt-1">{actionRequired} need action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating}/5</div>
            <div className="flex items-center gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.round(parseFloat(avgRating))
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NPS Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{npsScore.toFixed(0)}</div>
            <p className="text-xs text-gray-600 mt-1">Net Promoter Score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive</CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{positiveFeedbacks}</div>
            <p className="text-xs text-gray-600 mt-1">
              {((positiveFeedbacks / totalFeedbacks) * 100).toFixed(0)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negative</CardTitle>
            <ThumbsDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{negativeFeedbacks}</div>
            <p className="text-xs text-gray-600 mt-1">
              {((negativeFeedbacks / totalFeedbacks) * 100).toFixed(0)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by sentiment..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiments</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Feedback</CardTitle>
          <CardDescription>All feedback and survey responses</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="post_purchase">Post-Purchase</TabsTrigger>
              <TabsTrigger value="sampling">Sampling</TabsTrigger>
              <TabsTrigger value="nps">NPS</TabsTrigger>
              <TabsTrigger value="product_review">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {filteredFeedbacks.map((feedback) => (
                <Card
                  key={feedback.id}
                  className={`border-l-4 ${
                    feedback.sentiment === 'positive'
                      ? 'border-l-green-500'
                      : feedback.sentiment === 'negative'
                      ? 'border-l-red-500'
                      : 'border-l-yellow-500'
                  }`}
                >
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{feedback.customer.name}</h3>
                          <Badge className={getSentimentColor(feedback.sentiment)}>
                            <span className="flex items-center gap-1">
                              {getSentimentIcon(feedback.sentiment)}
                              {feedback.sentiment.toUpperCase()}
                            </span>
                          </Badge>
                          <Badge variant="outline">{feedback.type.replace('_', ' ')}</Badge>
                          {feedback.customer.type === 'VIP' && (
                            <Badge className="bg-purple-100 text-purple-800">VIP</Badge>
                          )}
                          {feedback.actionRequired && (
                            <Badge className="bg-orange-100 text-orange-800">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Action Required
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{feedback.customer.email}</span>
                          <span>{feedback.customer.phone}</span>
                          <span>{new Date(feedback.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < feedback.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">
                          {feedback.rating}/5 Rating
                        </p>
                      </div>
                    </div>

                    {/* Product */}
                    {feedback.product && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-600">Product</p>
                        <p className="font-medium">{feedback.product}</p>
                      </div>
                    )}

                    {/* NPS Score */}
                    {feedback.npsScore !== undefined && (
                      <div
                        className={`rounded-lg p-3 mb-4 ${
                          feedback.npsScore >= 9
                            ? 'bg-green-50 border border-green-200'
                            : feedback.npsScore >= 7
                            ? 'bg-yellow-50 border border-yellow-200'
                            : 'bg-red-50 border border-red-200'
                        }`}
                      >
                        <p className="text-sm font-medium mb-1">
                          NPS Score: {feedback.npsScore}/10
                        </p>
                        <p className="text-xs">
                          {feedback.npsScore >= 9
                            ? 'Promoter - Likely to recommend'
                            : feedback.npsScore >= 7
                            ? 'Passive - Satisfied but unenthusiastic'
                            : 'Detractor - Unlikely to recommend'}
                        </p>
                      </div>
                    )}

                    {/* Responses */}
                    <div className="space-y-3 mb-4">
                      {feedback.responses.map((response, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            {response.question}
                          </p>
                          <p className="text-sm text-gray-900">{response.answer}</p>
                        </div>
                      ))}
                    </div>

                    {/* Notes */}
                    {feedback.notes && (
                      <div
                        className={`rounded-lg p-4 mb-4 ${
                          feedback.actionRequired
                            ? 'bg-orange-50 border border-orange-200'
                            : 'bg-blue-50 border border-blue-200'
                        }`}
                      >
                        <p
                          className={`text-sm font-medium mb-1 ${
                            feedback.actionRequired ? 'text-orange-900' : 'text-blue-900'
                          }`}
                        >
                          Internal Notes
                        </p>
                        <p
                          className={`text-sm ${
                            feedback.actionRequired ? 'text-orange-700' : 'text-blue-700'
                          }`}
                        >
                          {feedback.notes}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {feedback.status === 'new' && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-teal-500 to-cyan-600"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Reviewed
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Users className="mr-2 h-4 w-4" />
                        View Customer
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Reply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredFeedbacks.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>No feedback found matching your filters</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Active Surveys */}
      <Card>
        <CardHeader>
          <CardTitle>Active Surveys</CardTitle>
          <CardDescription>Current survey forms and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {surveys.map((survey) => (
              <div
                key={survey.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold">{survey.name}</h4>
                    <Badge variant="outline">{survey.type.replace('_', ' ')}</Badge>
                    {survey.active && (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {survey.responses} responses · Avg rating: {survey.avgRating}/5
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
