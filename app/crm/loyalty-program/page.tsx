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
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Award,
  Crown,
  Star,
  Gift,
  TrendingUp,
  Users,
  Target,
  Plus,
  Settings,
  Search,
  Filter,
  Calendar,
  Coins,
  Trophy,
  Gem,
  ShoppingBag,
  Heart,
  MessageSquare,
  Send,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { LoyaltyTier } from '@/types/crm';

interface LoyaltyStats {
  totalMembers: number;
  activeMembers: number;
  pointsIssued: number;
  pointsRedeemed: number;
  pointsPending: number;
  redemptionRate: number;
  tierDistribution: {
    tier: LoyaltyTier;
    count: number;
    percentage: number;
  }[];
  monthlyGrowth: number;
  topRewards: {
    id: string;
    name: string;
    claimCount: number;
    pointsCost: number;
  }[];
}

interface LoyaltyMember {
  id: string;
  customerId: string;
  customerName: string;
  email: string;
  phone: string;
  points: number;
  tier: LoyaltyTier;
  totalEarned: number;
  totalRedeemed: number;
  tierProgress: number;
  nextTierPoints: number;
  joinDate: string;
  lastActivity: string;
  isActive: boolean;
}

interface Reward {
  id: string;
  name: string;
  nameArabic?: string;
  description: string;
  type: 'DISCOUNT' | 'FREE_PRODUCT' | 'EXCLUSIVE_ACCESS';
  pointsCost: number;
  discountPercent?: number;
  minTier: LoyaltyTier;
  isActive: boolean;
  validFrom: string;
  validUntil?: string;
  usageLimit?: number;
  timesUsed: number;
  image?: string;
}

interface LoyaltyTransaction {
  id: string;
  accountId: string;
  customerName: string;
  type: 'EARN' | 'REDEEM' | 'EXPIRE' | 'BONUS';
  points: number;
  description: string;
  orderId?: string;
  createdAt: string;
}

const TIER_COLORS = {
  BRONZE: '#CD7F32',
  SILVER: '#C0C0C0',
  GOLD: '#FFD700',
  PLATINUM: '#E5E4E2',
  DIAMOND: '#B9F2FF'
};

const TIER_BENEFITS = {
  BRONZE: { minSpend: 0, pointsMultiplier: 1, benefits: ['Basic support', 'Standard shipping'] },
  SILVER: { minSpend: 5000, pointsMultiplier: 1.2, benefits: ['Priority support', 'Free shipping on orders > AED 500'] },
  GOLD: { minSpend: 15000, pointsMultiplier: 1.5, benefits: ['Personal shopper', 'Free shipping', 'Birthday bonus'] },
  PLATINUM: { minSpend: 50000, pointsMultiplier: 2, benefits: ['VIP events', 'Exclusive products', 'Personal concierge'] },
  DIAMOND: { minSpend: 100000, pointsMultiplier: 2.5, benefits: ['Private shopping', 'Custom blending', 'Annual gifts'] }
};

export default function LoyaltyProgramPage() {
  const [stats, setStats] = useState<LoyaltyStats | null>(null);
  const [members, setMembers] = useState<LoyaltyMember[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState<LoyaltyMember | null>(null);
  const [showAddReward, setShowAddReward] = useState(false);
  const [showAdjustPoints, setShowAdjustPoints] = useState(false);

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);
      const [statsRes, membersRes, rewardsRes, transactionsRes] = await Promise.all([
        fetch('/api/crm/loyalty/stats'),
        fetch('/api/crm/loyalty/members'),
        fetch('/api/crm/loyalty/rewards'),
        fetch('/api/crm/loyalty/transactions')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (membersRes.ok) {
        const membersData = await membersRes.json();
        setMembers(membersData.members || []);
      }

      if (rewardsRes.ok) {
        const rewardsData = await rewardsRes.json();
        setRewards(rewardsData.rewards || []);
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone?.includes(searchTerm);
    const matchesTier = tierFilter === 'all' || member.tier === tierFilter;
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && member.isActive) ||
                         (statusFilter === 'inactive' && !member.isActive);

    return matchesSearch && matchesTier && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-AE').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTierIcon = (tier: LoyaltyTier) => {
    switch (tier) {
      case LoyaltyTier.BRONZE: return <Award className="w-4 h-4" style={{ color: TIER_COLORS.BRONZE }} />;
      case LoyaltyTier.SILVER: return <Star className="w-4 h-4" style={{ color: TIER_COLORS.SILVER }} />;
      case LoyaltyTier.GOLD: return <Trophy className="w-4 h-4" style={{ color: TIER_COLORS.GOLD }} />;
      case LoyaltyTier.PLATINUM: return <Crown className="w-4 h-4" style={{ color: TIER_COLORS.PLATINUM }} />;
      case LoyaltyTier.DIAMOND: return <Gem className="w-4 h-4" style={{ color: TIER_COLORS.DIAMOND }} />;
    }
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
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loyalty Program Management</h1>
          <p className="text-gray-600 mt-1">Manage customer loyalty, rewards, and tier benefits</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Program Settings
          </Button>
          <Button onClick={() => setShowAddReward(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Reward
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalMembers)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeMembers} active ({Math.round((stats.activeMembers / stats.totalMembers) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Outstanding</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.pointsPending)}</div>
            <p className="text-xs text-muted-foreground">
              Available for redemption
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redemption Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.redemptionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Points redeemed vs earned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyGrowth > 0 ? '+' : ''}{stats.monthlyGrowth}%</div>
            <p className="text-xs text-muted-foreground">
              New member growth
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tier Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Tier Distribution & Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(LoyaltyTier).map(([key, tier]) => {
              const tierStats = stats.tierDistribution.find(t => t.tier === tier);
              const benefits = TIER_BENEFITS[tier];

              return (
                <div
                  key={tier}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  style={{ borderColor: TIER_COLORS[tier] }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTierIcon(tier)}
                      <span className="font-semibold" style={{ color: TIER_COLORS[tier] }}>
                        {tier}
                      </span>
                    </div>
                    <Badge variant="secondary">
                      {tierStats?.count || 0}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>Min Spend: {formatCurrency(benefits.minSpend)}</div>
                    <div>Points: {benefits.pointsMultiplier}x</div>
                    <div className="text-xs text-gray-600">
                      {tierStats?.percentage || 0}% of members
                    </div>
                  </div>

                  <div className="mt-3">
                    <Progress
                      value={tierStats?.percentage || 0}
                      className="h-2"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Loyalty Members
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={tierFilter} onValueChange={setTierFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Tiers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      {Object.values(LoyaltyTier).map(tier => (
                        <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.slice(0, 10).map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{member.customerName}</div>
                          <div className="text-sm text-gray-600">{member.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 w-fit"
                          style={{
                            backgroundColor: `${TIER_COLORS[member.tier]}20`,
                            color: TIER_COLORS[member.tier]
                          }}
                        >
                          {getTierIcon(member.tier)}
                          {member.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold">{formatNumber(member.points)}</div>
                          <div className="text-sm text-gray-600">
                            Earned: {formatNumber(member.totalEarned)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {member.nextTierPoints > 0 &&
                              `${formatNumber(member.nextTierPoints)} pts to next tier`
                            }
                          </div>
                          <Progress value={member.tierProgress} className="h-2 w-20" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(member.lastActivity)}</div>
                          <Badge variant={member.isActive ? "default" : "secondary"} className="text-xs">
                            {member.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedMember(member)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowAdjustPoints(true)}
                          >
                            Adjust
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

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Available Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.map((reward) => (
                  <Card key={reward.id} className="relative">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{reward.name}</CardTitle>
                          {reward.nameArabic && (
                            <p className="text-sm text-gray-600" dir="rtl">{reward.nameArabic}</p>
                          )}
                        </div>
                        <Badge variant={reward.isActive ? "default" : "secondary"}>
                          {reward.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">{reward.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Coins className="w-4 h-4 text-yellow-600" />
                          <span className="font-semibold">{formatNumber(reward.pointsCost)} pts</span>
                        </div>
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: TIER_COLORS[reward.minTier],
                            color: TIER_COLORS[reward.minTier]
                          }}
                        >
                          {reward.minTier}+
                        </Badge>
                      </div>

                      {reward.type === 'DISCOUNT' && reward.discountPercent && (
                        <div className="bg-green-50 p-2 rounded-lg">
                          <div className="text-sm font-medium text-green-800">
                            {reward.discountPercent}% Discount
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <span>Used: {reward.timesUsed}</span>
                        {reward.usageLimit && (
                          <span>Limit: {reward.usageLimit}</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 10).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="font-medium">{transaction.customerName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.type === 'EARN' ? 'default' :
                            transaction.type === 'REDEEM' ? 'destructive' :
                            transaction.type === 'BONUS' ? 'secondary' : 'outline'
                          }
                        >
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${
                          transaction.type === 'EARN' || transaction.type === 'BONUS'
                            ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'EARN' || transaction.type === 'BONUS' ? '+' : '-'}
                          {formatNumber(transaction.points)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{transaction.description}</div>
                        {transaction.orderId && (
                          <div className="text-xs text-gray-500">
                            Order: {transaction.orderId}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(transaction.createdAt)}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topRewards.map((reward, index) => (
                    <div key={reward.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{reward.name}</div>
                          <div className="text-sm text-gray-600">{formatNumber(reward.pointsCost)} points</div>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {reward.claimCount} claims
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Program Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Points Issued</span>
                      <span className="font-semibold">{formatNumber(stats.pointsIssued)}</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Points Redeemed</span>
                      <span className="font-semibold">{formatNumber(stats.pointsRedeemed)}</span>
                    </div>
                    <Progress value={stats.redemptionRate} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Active Members</span>
                      <span className="font-semibold">{formatNumber(stats.activeMembers)}</span>
                    </div>
                    <Progress
                      value={(stats.activeMembers / stats.totalMembers) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Member Details Dialog */}
      {selectedMember && (
        <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getTierIcon(selectedMember.tier)}
                {selectedMember.customerName} - Loyalty Profile
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current Points</Label>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatNumber(selectedMember.points)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Current Tier</Label>
                  <Badge
                    className="text-lg p-2"
                    style={{
                      backgroundColor: `${TIER_COLORS[selectedMember.tier]}20`,
                      color: TIER_COLORS[selectedMember.tier]
                    }}
                  >
                    {selectedMember.tier}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Earned</Label>
                  <div className="text-lg font-semibold text-green-600">
                    {formatNumber(selectedMember.totalEarned)}
                  </div>
                </div>
                <div>
                  <Label>Total Redeemed</Label>
                  <div className="text-lg font-semibold text-red-600">
                    {formatNumber(selectedMember.totalRedeemed)}
                  </div>
                </div>
              </div>

              {selectedMember.nextTierPoints > 0 && (
                <div className="space-y-2">
                  <Label>Progress to Next Tier</Label>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{formatNumber(selectedMember.nextTierPoints)} points needed</span>
                      <span>{selectedMember.tierProgress}% complete</span>
                    </div>
                    <Progress value={selectedMember.tierProgress} className="h-3" />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="flex-1">
                  <Gift className="w-4 h-4 mr-2" />
                  Send Reward
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}