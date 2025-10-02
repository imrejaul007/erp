'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Search,
  Filter,
  Plus,
  Eye,
  Send,
  Reply,
  FileText,
  TrendingUp,
  BarChart3,
  Users,
  Target,
  Headphones,
  Phone,
  Mail,
  MessageCircle,
  AlertCircle,
  Settings,
  RefreshCw,
  Download,
  Flag,
  ArrowUpDown
} from 'lucide-react';
import { TicketStatus, TicketPriority } from '@/types/crm';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customerSegment: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: string;
  assignedToId?: string;
  assignedToName?: string;
  resolutionTime?: number;
  satisfaction?: number;
  satisfactionComment?: string;
  channel: 'EMAIL' | 'PHONE' | 'WHATSAPP' | 'IN_PERSON' | 'WEBSITE' | 'SOCIAL_MEDIA';
  orderId?: string;
  productId?: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  responses: TicketResponse[];
}

interface TicketResponse {
  id: string;
  ticketId: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
  createdById: string;
  createdByName: string;
  attachments: string[];
}

interface CustomerFeedback {
  id: string;
  customerId: string;
  customerName: string;
  orderId?: string;
  type: 'PRODUCT' | 'SERVICE' | 'GENERAL' | 'DELIVERY' | 'WEBSITE' | 'STAFF';
  rating: number;
  comment?: string;
  isPublic: boolean;
  isVerified: boolean;
  helpfulVotes: number;
  totalVotes: number;
  response?: string;
  respondedAt?: string;
  createdAt: string;
  tags: string[];
}

interface ComplaintStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  averageResolutionTime: number;
  customerSatisfactionScore: number;
  firstResponseTime: number;
  ticketsByPriority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  ticketsByChannel: Array<{
    channel: string;
    count: number;
    percentage: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    averageResolution: number;
    satisfaction: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    tickets: number;
    resolved: number;
    satisfaction: number;
  }>;
  feedbackStats: {
    totalFeedback: number;
    averageRating: number;
    positivePercentage: number;
    verifiedPercentage: number;
  };
}

interface SupportAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  specialties: string[];
  languages: string[];
  isOnline: boolean;
  activeTickets: number;
  resolvedToday: number;
  averageRating: number;
  totalRatings: number;
}

const TICKET_CATEGORIES = [
  'Product Quality',
  'Delivery Issues',
  'Billing & Payment',
  'Website Issues',
  'Service Complaint',
  'Refund Request',
  'Exchange Request',
  'Product Information',
  'General Inquiry',
  'Technical Support',
  'Account Issues',
  'Other'
];

const PRIORITY_COLORS = {
  LOW: '#10B981',
  MEDIUM: '#F59E0B',
  HIGH: '#EF4444',
  CRITICAL: '#DC2626'
};

const STATUS_COLORS = {
  OPEN: '#3B82F6',
  IN_PROGRESS: '#8B5CF6',
  RESOLVED: '#10B981',
  CLOSED: '#6B7280',
  CANCELLED: '#EF4444'
};

export default function ComplaintsAndFeedbackPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [feedback, setFeedback] = useState<CustomerFeedback[]>([]);
  const [agents, setAgents] = useState<SupportAgent[]>([]);
  const [stats, setStats] = useState<ComplaintStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchComplaintData();
  }, []);

  const fetchComplaintData = async () => {
    try {
      setLoading(true);
      const [ticketsRes, feedbackRes, agentsRes, statsRes] = await Promise.all([
        fetch('/api/crm/support/tickets'),
        fetch('/api/crm/feedback'),
        fetch('/api/crm/support/agents'),
        fetch('/api/crm/support/stats')
      ]);

      if (ticketsRes.ok) {
        const ticketsData = await ticketsRes.json();
        setTickets(ticketsData.tickets || []);
      }

      if (feedbackRes.ok) {
        const feedbackData = await feedbackRes.json();
        setFeedback(feedbackData.feedback || []);
      }

      if (agentsRes.ok) {
        const agentsData = await agentsRes.json();
        setAgents(agentsData.agents || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching complaint data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    const matchesAssignee = assigneeFilter === 'all' || ticket.assignedToId === assigneeFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAssignee;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'priority':
        const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      case 'customer':
        aValue = a.customerName.toLowerCase();
        bValue = b.customerName.toLowerCase();
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-AE').format(num);
  };

  const getStatusBadge = (status: TicketStatus) => {
    return (
      <Badge
        style={{
          backgroundColor: `${STATUS_COLORS[status]}20`,
          color: STATUS_COLORS[status]
        }}
      >
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    return (
      <Badge
        style={{
          backgroundColor: `${PRIORITY_COLORS[priority]}20`,
          color: PRIORITY_COLORS[priority]
        }}
      >
        {priority}
      </Badge>
    );
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'EMAIL': return <Mail className="w-4 h-4" />;
      case 'PHONE': return <Phone className="w-4 h-4" />;
      case 'WHATSAPP': return <MessageCircle className="w-4 h-4" />;
      case 'IN_PERSON': return <User className="w-4 h-4" />;
      case 'WEBSITE': return <MessageSquare className="w-4 h-4" />;
      case 'SOCIAL_MEDIA': return <MessageCircle className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const stars = [];
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`${starSize} ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  if (loading || !stats) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
            <Headphones className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Support & Feedback</h1>
            <p className="text-gray-600 mt-1">Manage complaints, tickets, and customer feedback</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchComplaintData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setShowCreateTicket(true)} className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Ticket
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatNumber(stats.totalTickets)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.openTickets} currently open
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.averageResolutionTime}h</div>
            <p className="text-xs text-muted-foreground">
              First response: {stats.firstResponseTime}h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.customerSatisfactionScore}/5</div>
            <p className="text-xs text-muted-foreground">
              From resolved tickets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {Math.round((stats.resolvedTickets / stats.totalTickets) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.resolvedTickets} of {stats.totalTickets} resolved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Priority & Channel Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="w-5 h-5" />
              Tickets by Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.ticketsByPriority).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: PRIORITY_COLORS[priority.toUpperCase() as keyof typeof PRIORITY_COLORS] }}
                    ></div>
                    <span className="capitalize">{priority}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32">
                      <Progress
                        value={(count / stats.totalTickets) * 100}
                        className="h-2"
                      />
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Tickets by Channel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.ticketsByChannel.map((channel) => (
                <div key={channel.channel} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getChannelIcon(channel.channel)}
                    <span>{channel.channel.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32">
                      <Progress value={channel.percentage} className="h-2" />
                    </div>
                    <span className="text-sm font-medium">{channel.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Support Team Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Support Team Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center gap-3 p-4 border rounded-lg">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`/avatars/${agent.id}.jpg`} />
                  <AvatarFallback className={agent.isOnline ? 'bg-green-100 text-green-600' : 'bg-gray-100'}>
                    {agent.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{agent.name}</div>
                    <div className={`w-2 h-2 rounded-full ${agent.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>
                  <div className="text-sm text-gray-600">{agent.department}</div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>Active: {agent.activeTickets}</span>
                    <span>Resolved: {agent.resolvedToday}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{agent.averageRating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="tickets" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="feedback">Customer Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Reports</TabsTrigger>
          <TabsTrigger value="settings">Support Settings</TabsTrigger>
        </TabsList>

        {/* Support Tickets Tab */}
        <TabsContent value="tickets" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Support Tickets
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" onClick={() => {
                        setSortBy('createdAt');
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      }}>
                        Ticket <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => {
                        setSortBy('customer');
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      }}>
                        Customer <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => {
                        setSortBy('priority');
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      }}>
                        Priority <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTickets.slice(0, 15).map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <div>
                          <div className="font-mono text-sm font-medium">{ticket.ticketNumber}</div>
                          <div className="text-xs text-gray-500">{formatDate(ticket.createdAt)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ticket.customerName}</div>
                          <Badge variant="outline" className="text-xs">
                            {ticket.customerSegment}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="font-medium truncate">{ticket.subject}</div>
                          <div className="text-sm text-gray-600">{ticket.category}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(ticket.priority)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(ticket.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getChannelIcon(ticket.channel)}
                          <span className="text-sm">{ticket.channel}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {ticket.assignedToName ? (
                          <div className="text-sm">{ticket.assignedToName}</div>
                        ) : (
                          <Badge variant="outline">Unassigned</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Reply className="w-3 h-3 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Customer Feedback & Reviews
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    Avg Rating: {stats.feedbackStats.averageRating}/5
                  </Badge>
                  <Badge variant="outline">
                    {stats.feedbackStats.positivePercentage}% Positive
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedback.slice(0, 10).map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback>
                                {item.customerName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{item.customerName}</div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                {renderStars(item.rating)}
                                <span>• {formatDate(item.createdAt)}</span>
                                {item.isVerified && (
                                  <>
                                    <span>•</span>
                                    <Badge variant="secondary" className="text-xs">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Verified Purchase
                                    </Badge>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {item.comment && (
                            <p className="text-gray-700 mb-4">{item.comment}</p>
                          )}

                          {item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {item.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {item.response && (
                            <div className="bg-blue-50 p-4 rounded-lg mt-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="default" className="text-xs">
                                  Official Response
                                </Badge>
                                <span className="text-xs text-gray-600">
                                  {item.respondedAt && formatDate(item.respondedAt)}
                                </span>
                              </div>
                              <p className="text-sm text-blue-800">{item.response}</p>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4">
                              <Button size="sm" variant="outline">
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                Helpful ({item.helpfulVotes})
                              </Button>
                              {item.totalVotes > 0 && (
                                <div className="text-sm text-gray-600">
                                  {item.helpfulVotes} of {item.totalVotes} found helpful
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {!item.response && (
                                <Button size="sm" variant="outline">
                                  <Reply className="w-3 h-3 mr-1" />
                                  Respond
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <Flag className="w-3 h-3 mr-1" />
                                Report
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics & Reports Tab */}
        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Category Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.categoryBreakdown.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.category}</span>
                        <div className="flex items-center gap-4 text-sm">
                          <span>{category.count} tickets</span>
                          <span>{category.averageResolution}h avg</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{category.satisfaction}</span>
                          </div>
                        </div>
                      </div>
                      <Progress
                        value={(category.count / stats.totalTickets) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Monthly Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.monthlyTrends.map((month) => (
                    <div key={month.month} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-16 text-sm font-medium">{month.month}</div>
                        <div className="w-24">
                          <Progress
                            value={(month.tickets / Math.max(...stats.monthlyTrends.map(m => m.tickets))) * 100}
                            className="h-2"
                          />
                        </div>
                      </div>
                      <div className="flex gap-4 sm:gap-6 text-sm">
                        <div>
                          <div className="text-gray-600">Tickets</div>
                          <div className="font-semibold">{month.tickets}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Resolved</div>
                          <div className="font-semibold">{month.resolved}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Satisfaction</div>
                          <div className="font-semibold">{month.satisfaction}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Support Settings Tab */}
        <TabsContent value="settings" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {TICKET_CATEGORIES.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span>{category}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <XCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Auto-Response Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Auto-acknowledge tickets</div>
                      <div className="text-sm text-gray-600">Send confirmation when ticket is created</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Priority escalation</div>
                      <div className="text-sm text-gray-600">Auto-escalate high priority tickets</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Satisfaction survey</div>
                      <div className="text-sm text-gray-600">Send survey after ticket resolution</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Weekend support</div>
                      <div className="text-sm text-gray-600">Auto-response for weekend tickets</div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Ticket Details Dialog */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Ticket #{selectedTicket.ticketNumber}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 sm:space-y-6">
              {/* Ticket Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{selectedTicket.subject}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Customer: {selectedTicket.customerName}</span>
                    <span>Category: {selectedTicket.category}</span>
                    <span>Created: {formatDate(selectedTicket.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {getPriorityBadge(selectedTicket.priority)}
                  {getStatusBadge(selectedTicket.status)}
                </div>
              </div>

              <Separator />

              {/* Ticket Description */}
              <div>
                <Label className="text-lg">Description</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  {selectedTicket.description}
                </div>
              </div>

              {/* Ticket Responses */}
              <div>
                <Label className="text-lg">Conversation History</Label>
                <div className="mt-3 space-y-4">
                  {selectedTicket.responses.map((response) => (
                    <div key={response.id} className={`p-4 rounded-lg ${
                      response.isInternal ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'
                    } border`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{response.createdByName}</span>
                          {response.isInternal && (
                            <Badge variant="secondary" className="text-xs">Internal Note</Badge>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">
                          {formatDate(response.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700">{response.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Satisfaction Score */}
              {selectedTicket.satisfaction && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Customer Satisfaction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStars(selectedTicket.satisfaction, 'md')}
                    <span className="font-medium">{selectedTicket.satisfaction}/5</span>
                  </div>
                  {selectedTicket.satisfactionComment && (
                    <p className="text-sm text-green-700 mt-2">"{selectedTicket.satisfactionComment}"</p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1">
                  <Reply className="w-4 h-4 mr-2" />
                  Reply to Customer
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Add Internal Note
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Update Status
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}