'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  RefreshCw,
  Medal,
  Award,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Star,
  Crown
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface LeaderboardEntry {
  rank: number
  userId: string
  userName: string
  userEmail: string
  metric: number
  badge?: string
}

export default function LeaderboardDashboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [leaderboardType, setLeaderboardType] = useState('sales')
  const [timePeriod, setTimePeriod] = useState('month')

  useEffect(() => {
    fetchLeaderboard()
  }, [leaderboardType, timePeriod])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/leaderboard?period=${timePeriod}&type=${leaderboardType}`)
      const data = await response.json()

      if (response.ok) {
        setLeaderboardData(data.leaderboard || [])
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || 'Failed to fetch leaderboard'
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to load leaderboard'
      })
    } finally {
      setLoading(false)
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full">
          <Crown className="h-6 w-6 text-white" />
        </div>
      )
    }
    if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full">
          <Medal className="h-6 w-6 text-white" />
        </div>
      )
    }
    if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full">
          <Award className="h-6 w-6 text-white" />
        </div>
      )
    }
    return (
      <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
        <span className="text-lg font-bold text-gray-600">#{rank}</span>
      </div>
    )
  }

  const formatMetric = (value: number) => {
    if (leaderboardType === 'sales') {
      return `$${value.toLocaleString()}`
    }
    if (leaderboardType === 'orders') {
      return `${value} orders`
    }
    if (leaderboardType === 'customers') {
      return `${value} customers`
    }
    return value.toString()
  }

  const getMetricIcon = () => {
    if (leaderboardType === 'sales') return <DollarSign className="h-5 w-5" />
    if (leaderboardType === 'orders') return <ShoppingCart className="h-5 w-5" />
    if (leaderboardType === 'customers') return <Users className="h-5 w-5" />
    return <Star className="h-5 w-5" />
  }

  const getTopPerformers = () => {
    return leaderboardData.slice(0, 3)
  }

  const getOtherEntries = () => {
    return leaderboardData.slice(3)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-600" />
            Sales Leaderboard
          </h1>
          <p className="text-muted-foreground">Track top performers and team rankings</p>
        </div>
        <div className="flex gap-2">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchLeaderboard}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Leaderboard Type Tabs */}
      <Tabs value={leaderboardType} onValueChange={setLeaderboardType}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sales">
            <DollarSign className="h-4 w-4 mr-2" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="customers">
            <Users className="h-4 w-4 mr-2" />
            Customers
          </TabsTrigger>
        </TabsList>

        <TabsContent value={leaderboardType} className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-12 w-12 animate-spin text-muted-foreground" />
            </div>
          ) : leaderboardData.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <Trophy className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">No leaderboard data available</p>
                  <p className="text-sm">Data will appear once sales are recorded</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Top 3 Performers - Podium Style */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getTopPerformers().map((entry, index) => (
                  <Card key={entry.userId} className={`${
                    entry.rank === 1
                      ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-white'
                      : entry.rank === 2
                      ? 'border-gray-300 bg-gradient-to-br from-gray-50 to-white'
                      : 'border-orange-300 bg-gradient-to-br from-orange-50 to-white'
                  } relative overflow-hidden ${entry.rank === 1 ? 'md:order-2 md:scale-105' : entry.rank === 2 ? 'md:order-1' : 'md:order-3'}`}>
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        {getRankBadge(entry.rank)}
                      </div>
                      <h3 className="text-xl font-bold mb-1">{entry.userName}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{entry.userEmail}</p>
                      <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                        {getMetricIcon()}
                        <span>{formatMetric(entry.metric)}</span>
                      </div>
                      {entry.rank === 1 && (
                        <Badge className="mt-4 bg-yellow-600">
                          <Star className="h-3 w-3 mr-1" />
                          Top Performer
                        </Badge>
                      )}
                      {entry.badge && entry.rank !== 1 && (
                        <Badge variant="outline" className="mt-4">
                          {entry.badge}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Rest of Leaderboard - Table Style */}
              {getOtherEntries().length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Full Rankings</CardTitle>
                    <CardDescription>All team members ranked by {leaderboardType}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getOtherEntries().map((entry) => (
                        <div
                          key={entry.userId}
                          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-shrink-0">
                            {getRankBadge(entry.rank)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-lg">{entry.userName}</h4>
                            <p className="text-sm text-muted-foreground truncate">{entry.userEmail}</p>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <div className="flex items-center gap-2 text-xl font-bold">
                              {getMetricIcon()}
                              <span>{formatMetric(entry.metric)}</span>
                            </div>
                            {entry.badge && (
                              <Badge variant="outline" className="mt-1">
                                {entry.badge}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stats Summary */}
              {leaderboardData.length > 0 && (
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{leaderboardData.length}</div>
                      <p className="text-xs text-muted-foreground">Active team members</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
                      <Crown className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{leaderboardData[0]?.userName}</div>
                      <p className="text-xs text-muted-foreground">{formatMetric(leaderboardData[0]?.metric || 0)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatMetric(
                          Math.round(
                            leaderboardData.reduce((sum, entry) => sum + entry.metric, 0) / leaderboardData.length
                          )
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Team average</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
