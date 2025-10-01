// Customer Feedback Collection System with NPS Scoring
// Supports bilingual feedback collection for UAE market

import { prisma } from '@/lib/prisma';
import { FeedbackType } from '@/types/crm';

export interface CreateFeedbackRequest {
  customerId: string;
  orderId?: string;
  type: FeedbackType;
  rating: number; // 1-5 for general rating
  npsScore?: number; // 0-10 for NPS
  comment?: string;
  commentArabic?: string;
  isPublic?: boolean;
  tags?: string[];
  language?: 'en' | 'ar';
}

export interface FeedbackAnalytics {
  totalFeedbacks: number;
  averageRating: number;
  npsScore: number;
  npsDistribution: {
    promoters: number; // 9-10
    passives: number;  // 7-8
    detractors: number; // 0-6
  };
  sentimentAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
  };
  categoryBreakdown: Record<string, number>;
  trendAnalysis: Array<{
    period: string;
    rating: number;
    nps: number;
    count: number;
  }>;
}

export interface FeedbackSurvey {
  id: string;
  name: string;
  nameArabic: string;
  type: 'post_purchase' | 'service_feedback' | 'product_review' | 'general_satisfaction';
  questions: Array<{
    id: string;
    type: 'rating' | 'nps' | 'text' | 'multiple_choice';
    question: string;
    questionArabic: string;
    required: boolean;
    options?: string[];
    optionsArabic?: string[];
  }>;
  isActive: boolean;
  triggerConditions?: {
    orderStatus?: string[];
    customerSegment?: string[];
    productCategories?: string[];
  };
}

export class FeedbackSystem {

  // Create customer feedback
  async createFeedback(request: CreateFeedbackRequest) {
    // Validate NPS score if provided
    if (request.npsScore !== undefined && (request.npsScore < 0 || request.npsScore > 10)) {
      throw new Error('NPS score must be between 0 and 10');
    }

    // Validate rating
    if (request.rating < 1 || request.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const feedback = await prisma.customerFeedback.create({
      data: {
        customerId: request.customerId,
        orderId: request.orderId,
        type: request.type,
        rating: request.rating,
        npsScore: request.npsScore,
        comment: request.comment,
        commentArabic: request.commentArabic,
        isPublic: request.isPublic || false,
        tags: request.tags || [],
      },
      include: {
        customer: {
          select: {
            name: true,
            nameArabic: true,
            segment: true,
            loyaltyAccount: {
              select: {
                tier: true,
              },
            },
          },
        },
        order: {
          select: {
            orderNo: true,
            totalAmount: true,
            orderDate: true,
          },
        },
      },
    });

    // Award loyalty points for feedback
    if (feedback.customer.loyaltyAccount) {
      await this.awardFeedbackPoints(request.customerId, request.type, request.rating);
    }

    // Trigger follow-up actions based on feedback
    await this.processFeedbackActions(feedback);

    return feedback;
  }

  // Get feedback analytics
  async getFeedbackAnalytics(
    startDate: Date,
    endDate: Date,
    filters?: {
      type?: FeedbackType;
      customerSegment?: string[];
      productCategory?: string[];
      emirate?: string[];
    }
  ): Promise<FeedbackAnalytics> {
    const whereClause: any = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    // Apply filters
    if (filters?.type) {
      whereClause.type = filters.type;
    }

    if (filters?.customerSegment) {
      whereClause.customer = {
        segment: { in: filters.customerSegment },
      };
    }

    if (filters?.emirate) {
      whereClause.customer = {
        ...whereClause.customer,
        emirate: { in: filters.emirate },
      };
    }

    // Get feedback data
    const feedbacks = await prisma.customerFeedback.findMany({
      where: whereClause,
      include: {
        customer: {
          select: {
            segment: true,
            emirate: true,
          },
        },
      },
    });

    const totalFeedbacks = feedbacks.length;
    if (totalFeedbacks === 0) {
      return this.getEmptyAnalytics();
    }

    // Calculate average rating
    const totalRating = feedbacks.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = totalRating / totalFeedbacks;

    // Calculate NPS
    const npsResponses = feedbacks.filter(f => f.npsScore !== null);
    const npsScore = this.calculateNPS(npsResponses.map(f => f.npsScore!));

    // NPS Distribution
    const npsDistribution = this.getNPSDistribution(npsResponses.map(f => f.npsScore!));

    // Sentiment Analysis
    const sentimentAnalysis = this.analyzeSentiment(feedbacks);

    // Category Breakdown
    const categoryBreakdown = this.getCategoryBreakdown(feedbacks);

    // Trend Analysis (monthly)
    const trendAnalysis = await this.getTrendAnalysis(startDate, endDate, whereClause);

    return {
      totalFeedbacks,
      averageRating: Math.round(averageRating * 100) / 100,
      npsScore: Math.round(npsScore * 100) / 100,
      npsDistribution,
      sentimentAnalysis,
      categoryBreakdown,
      trendAnalysis,
    };
  }

  // Calculate Net Promoter Score
  private calculateNPS(scores: number[]): number {
    if (scores.length === 0) return 0;

    const promoters = scores.filter(score => score >= 9).length;
    const detractors = scores.filter(score => score <= 6).length;
    const total = scores.length;

    return ((promoters - detractors) / total) * 100;
  }

  // Get NPS distribution
  private getNPSDistribution(scores: number[]) {
    const promoters = scores.filter(score => score >= 9).length;
    const passives = scores.filter(score => score >= 7 && score <= 8).length;
    const detractors = scores.filter(score => score <= 6).length;

    return { promoters, passives, detractors };
  }

  // Basic sentiment analysis
  private analyzeSentiment(feedbacks: any[]) {
    let positive = 0;
    let neutral = 0;
    let negative = 0;

    feedbacks.forEach(feedback => {
      if (feedback.rating >= 4) {
        positive++;
      } else if (feedback.rating === 3) {
        neutral++;
      } else {
        negative++;
      }
    });

    return { positive, neutral, negative };
  }

  // Get category breakdown
  private getCategoryBreakdown(feedbacks: any[]): Record<string, number> {
    const breakdown: Record<string, number> = {};

    feedbacks.forEach(feedback => {
      const category = feedback.type;
      breakdown[category] = (breakdown[category] || 0) + 1;
    });

    return breakdown;
  }

  // Get trend analysis
  private async getTrendAnalysis(
    startDate: Date,
    endDate: Date,
    whereClause: any
  ): Promise<Array<{ period: string; rating: number; nps: number; count: number }>> {
    const months: Array<{ period: string; rating: number; nps: number; count: number }> = [];

    const current = new Date(startDate);
    while (current <= endDate) {
      const monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
      const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);

      const monthFeedbacks = await prisma.customerFeedback.findMany({
        where: {
          ...whereClause,
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      });

      const count = monthFeedbacks.length;
      const rating = count > 0
        ? monthFeedbacks.reduce((sum, f) => sum + f.rating, 0) / count
        : 0;

      const npsResponses = monthFeedbacks.filter(f => f.npsScore !== null);
      const nps = npsResponses.length > 0
        ? this.calculateNPS(npsResponses.map(f => f.npsScore!))
        : 0;

      months.push({
        period: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`,
        rating: Math.round(rating * 100) / 100,
        nps: Math.round(nps * 100) / 100,
        count,
      });

      current.setMonth(current.getMonth() + 1);
    }

    return months;
  }

  // Get empty analytics structure
  private getEmptyAnalytics(): FeedbackAnalytics {
    return {
      totalFeedbacks: 0,
      averageRating: 0,
      npsScore: 0,
      npsDistribution: { promoters: 0, passives: 0, detractors: 0 },
      sentimentAnalysis: { positive: 0, neutral: 0, negative: 0 },
      categoryBreakdown: {},
      trendAnalysis: [],
    };
  }

  // Award loyalty points for feedback
  private async awardFeedbackPoints(customerId: string, type: FeedbackType, rating: number) {
    const loyaltyAccount = await prisma.loyaltyAccount.findUnique({
      where: { customerId },
    });

    if (!loyaltyAccount) return;

    // Points based on feedback type and rating
    const basePoints = {
      [FeedbackType.PRODUCT]: 10,
      [FeedbackType.SERVICE]: 15,
      [FeedbackType.GENERAL]: 5,
      [FeedbackType.COMPLAINT]: 20, // Higher reward for complaint feedback
      [FeedbackType.SUGGESTION]: 25,
    };

    const points = basePoints[type] + (rating >= 4 ? 5 : 0); // Bonus for positive feedback

    await prisma.loyaltyTransaction.create({
      data: {
        accountId: loyaltyAccount.id,
        type: 'BONUS',
        points,
        description: `Feedback reward - ${type}`,
      },
    });

    await prisma.loyaltyAccount.update({
      where: { id: loyaltyAccount.id },
      data: {
        points: { increment: points },
        totalEarned: { increment: points },
      },
    });
  }

  // Process feedback actions
  private async processFeedbackActions(feedback: any) {
    // Low rating alert
    if (feedback.rating <= 2 || (feedback.npsScore !== null && feedback.npsScore <= 6)) {
      await this.createLowRatingAlert(feedback);
    }

    // High rating celebration
    if (feedback.rating >= 5 || (feedback.npsScore !== null && feedback.npsScore >= 9)) {
      await this.processHighRatingFeedback(feedback);
    }

    // Complaint handling
    if (feedback.type === FeedbackType.COMPLAINT) {
      await this.createComplaintTicket(feedback);
    }
  }

  // Create alert for low rating
  private async createLowRatingAlert(feedback: any) {
    await prisma.supportTicket.create({
      data: {
        ticketNumber: `FEEDBACK-${Date.now()}`,
        customerId: feedback.customerId,
        subject: `Low Rating Alert - ${feedback.rating}/5`,
        description: `Customer provided low rating: ${feedback.rating}/5${
          feedback.npsScore ? ` (NPS: ${feedback.npsScore}/10)` : ''
        }\n\nComment: ${feedback.comment || 'No comment provided'}${
          feedback.commentArabic ? `\n\nArabic Comment: ${feedback.commentArabic}` : ''
        }`,
        priority: 'HIGH',
        status: 'OPEN',
        category: 'Customer Satisfaction',
      },
    });
  }

  // Process high rating feedback
  private async processHighRatingFeedback(feedback: any) {
    // Could trigger review request, testimonial collection, etc.
    console.log(`High rating feedback received from customer ${feedback.customerId}`);
  }

  // Create support ticket for complaint
  private async createComplaintTicket(feedback: any) {
    await prisma.supportTicket.create({
      data: {
        ticketNumber: `COMPLAINT-${Date.now()}`,
        customerId: feedback.customerId,
        subject: 'Customer Complaint',
        description: `Complaint Details:\n${feedback.comment || 'No details provided'}${
          feedback.commentArabic ? `\n\nArabic: ${feedback.commentArabic}` : ''
        }\n\nRating: ${feedback.rating}/5${
          feedback.npsScore ? `\nNPS Score: ${feedback.npsScore}/10` : ''
        }`,
        priority: 'HIGH',
        status: 'OPEN',
        category: 'Complaint',
      },
    });
  }

  // Get customer feedback history
  async getCustomerFeedbackHistory(customerId: string) {
    const feedbacks = await prisma.customerFeedback.findMany({
      where: { customerId },
      include: {
        order: {
          select: {
            orderNo: true,
            totalAmount: true,
            orderDate: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const stats = {
      totalFeedbacks: feedbacks.length,
      averageRating: feedbacks.length > 0
        ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
        : 0,
      npsScore: this.calculateNPS(
        feedbacks.filter(f => f.npsScore !== null).map(f => f.npsScore!)
      ),
      lastFeedback: feedbacks[0]?.createdAt || null,
    };

    return {
      stats,
      feedbacks,
    };
  }

  // Create feedback survey
  async createFeedbackSurvey(survey: Omit<FeedbackSurvey, 'id'>) {
    // This would be stored in a surveys table (not in the schema yet)
    // For now, returning a mock implementation
    return {
      id: `survey-${Date.now()}`,
      ...survey,
    };
  }

  // Get feedback surveys for triggers
  async getTriggerSurveys(conditions: {
    orderStatus?: string;
    customerSegment?: string;
    productCategory?: string;
  }): Promise<FeedbackSurvey[]> {
    // Mock implementation - would query surveys table
    return this.getPredefinedSurveys().filter(survey => {
      if (!survey.triggerConditions) return true;

      const triggers = survey.triggerConditions;

      if (conditions.orderStatus && triggers.orderStatus) {
        return triggers.orderStatus.includes(conditions.orderStatus);
      }

      if (conditions.customerSegment && triggers.customerSegment) {
        return triggers.customerSegment.includes(conditions.customerSegment);
      }

      if (conditions.productCategory && triggers.productCategories) {
        return triggers.productCategories.includes(conditions.productCategory);
      }

      return true;
    });
  }

  // Get predefined surveys for UAE market
  private getPredefinedSurveys(): FeedbackSurvey[] {
    return [
      {
        id: 'post-purchase-general',
        name: 'Post-Purchase Satisfaction',
        nameArabic: 'رضا ما بعد الشراء',
        type: 'post_purchase',
        isActive: true,
        triggerConditions: {
          orderStatus: ['DELIVERED'],
        },
        questions: [
          {
            id: 'overall-satisfaction',
            type: 'rating',
            question: 'How satisfied are you with your overall purchase experience?',
            questionArabic: 'ما مدى رضاك عن تجربة الشراء الإجمالية؟',
            required: true,
          },
          {
            id: 'nps-score',
            type: 'nps',
            question: 'How likely are you to recommend Perfume & Oud to friends and family?',
            questionArabic: 'ما مدى احتمالية أن توصي بعطور وعود للأصدقاء والعائلة؟',
            required: true,
          },
          {
            id: 'product-quality',
            type: 'rating',
            question: 'How would you rate the quality of the fragrance?',
            questionArabic: 'كيف تقيم جودة العطر؟',
            required: true,
          },
          {
            id: 'service-quality',
            type: 'rating',
            question: 'How would you rate our customer service?',
            questionArabic: 'كيف تقيم خدمة العملاء لدينا؟',
            required: true,
          },
          {
            id: 'improvement-suggestions',
            type: 'text',
            question: 'What can we do to improve your experience?',
            questionArabic: 'ما الذي يمكننا فعله لتحسين تجربتك؟',
            required: false,
          },
        ],
      },
      {
        id: 'vip-service-feedback',
        name: 'VIP Service Experience',
        nameArabic: 'تجربة خدمة كبار الشخصيات',
        type: 'service_feedback',
        isActive: true,
        triggerConditions: {
          customerSegment: ['VIP'],
        },
        questions: [
          {
            id: 'vip-service-rating',
            type: 'rating',
            question: 'How satisfied are you with our VIP service?',
            questionArabic: 'ما مدى رضاك عن خدمة كبار الشخصيات؟',
            required: true,
          },
          {
            id: 'personal-shopper-rating',
            type: 'rating',
            question: 'How would you rate your personal shopper?',
            questionArabic: 'كيف تقيم المتسوق الشخصي الخاص بك؟',
            required: false,
          },
          {
            id: 'vip-nps',
            type: 'nps',
            question: 'How likely are you to recommend our VIP service?',
            questionArabic: 'ما مدى احتمالية أن توصي بخدمة كبار الشخصيات؟',
            required: true,
          },
          {
            id: 'vip-suggestions',
            type: 'text',
            question: 'What additional VIP services would you like to see?',
            questionArabic: 'ما هي خدمات كبار الشخصيات الإضافية التي ترغب في رؤيتها؟',
            required: false,
          },
        ],
      },
      {
        id: 'product-review',
        name: 'Product Review',
        nameArabic: 'مراجعة المنتج',
        type: 'product_review',
        isActive: true,
        questions: [
          {
            id: 'product-rating',
            type: 'rating',
            question: 'How would you rate this fragrance?',
            questionArabic: 'كيف تقيم هذا العطر؟',
            required: true,
          },
          {
            id: 'fragrance-longevity',
            type: 'multiple_choice',
            question: 'How long does the fragrance last?',
            questionArabic: 'كم يدوم العطر؟',
            required: false,
            options: ['Less than 2 hours', '2-4 hours', '4-6 hours', '6-8 hours', '8+ hours'],
            optionsArabic: ['أقل من ساعتين', '2-4 ساعات', '4-6 ساعات', '6-8 ساعات', '8+ ساعات'],
          },
          {
            id: 'fragrance-sillage',
            type: 'multiple_choice',
            question: 'How would you describe the projection/sillage?',
            questionArabic: 'كيف تصف الإشعاع/السيلاج؟',
            required: false,
            options: ['Very light', 'Light', 'Moderate', 'Strong', 'Very strong'],
            optionsArabic: ['خفيف جداً', 'خفيف', 'معتدل', 'قوي', 'قوي جداً'],
          },
          {
            id: 'product-review-text',
            type: 'text',
            question: 'Please share your detailed review:',
            questionArabic: 'يرجى مشاركة مراجعتك المفصلة:',
            required: false,
          },
        ],
      },
    ];
  }

  // Send feedback request
  async sendFeedbackRequest(customerId: string, orderId?: string, surveyId?: string) {
    // This would integrate with WhatsApp/SMS/Email services
    // Implementation would send a personalized feedback request
    console.log(`Sending feedback request to customer ${customerId} for order ${orderId}`);

    // Create a feedback request record to track
    // This could be stored in a feedback_requests table
    return {
      success: true,
      message: 'Feedback request sent successfully',
    };
  }

  // Get feedback insights for management dashboard
  async getFeedbackInsights(period: 'week' | 'month' | 'quarter' = 'month') {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
    }

    const analytics = await this.getFeedbackAnalytics(startDate, endDate);

    // Additional insights
    const topComplaints = await this.getTopComplaints(startDate, endDate);
    const topPraises = await this.getTopPraises(startDate, endDate);
    const improvementAreas = await this.getImprovementAreas(analytics);

    return {
      ...analytics,
      insights: {
        topComplaints,
        topPraises,
        improvementAreas,
        recommendations: this.generateRecommendations(analytics),
      },
    };
  }

  // Get top complaints
  private async getTopComplaints(startDate: Date, endDate: Date) {
    const complaints = await prisma.customerFeedback.findMany({
      where: {
        type: FeedbackType.COMPLAINT,
        createdAt: { gte: startDate, lte: endDate },
        comment: { not: null },
      },
      select: {
        comment: true,
        commentArabic: true,
        rating: true,
        tags: true,
      },
    });

    // Simple keyword analysis for complaints
    const keywords = new Map<string, number>();
    complaints.forEach(complaint => {
      const text = `${complaint.comment || ''} ${complaint.commentArabic || ''}`.toLowerCase();

      // Common complaint keywords
      const complaintKeywords = [
        'delivery', 'توصيل', 'late', 'متأخر', 'quality', 'جودة',
        'service', 'خدمة', 'staff', 'موظفين', 'price', 'سعر',
        'packaging', 'تغليف', 'fragrance', 'عطر', 'smell', 'رائحة'
      ];

      complaintKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
          keywords.set(keyword, (keywords.get(keyword) || 0) + 1);
        }
      });
    });

    return Array.from(keywords.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([keyword, count]) => ({ keyword, count }));
  }

  // Get top praises
  private async getTopPraises(startDate: Date, endDate: Date) {
    const praises = await prisma.customerFeedback.findMany({
      where: {
        rating: { gte: 4 },
        createdAt: { gte: startDate, lte: endDate },
        comment: { not: null },
      },
      select: {
        comment: true,
        commentArabic: true,
        rating: true,
        tags: true,
      },
    });

    // Simple keyword analysis for positive feedback
    const keywords = new Map<string, number>();
    praises.forEach(praise => {
      const text = `${praise.comment || ''} ${praise.commentArabic || ''}`.toLowerCase();

      const praiseKeywords = [
        'excellent', 'ممتاز', 'great', 'رائع', 'amazing', 'مذهل',
        'quality', 'جودة', 'service', 'خدمة', 'staff', 'موظفين',
        'beautiful', 'جميل', 'lovely', 'wonderful', 'رائع'
      ];

      praiseKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
          keywords.set(keyword, (keywords.get(keyword) || 0) + 1);
        }
      });
    });

    return Array.from(keywords.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([keyword, count]) => ({ keyword, count }));
  }

  // Get improvement areas based on analytics
  private getImprovementAreas(analytics: FeedbackAnalytics) {
    const areas = [];

    if (analytics.averageRating < 4.0) {
      areas.push({
        area: 'Overall Satisfaction',
        priority: 'High',
        description: 'Average rating below 4.0 requires immediate attention',
      });
    }

    if (analytics.npsScore < 0) {
      areas.push({
        area: 'Customer Loyalty',
        priority: 'Critical',
        description: 'Negative NPS score indicates customer loyalty issues',
      });
    }

    if (analytics.sentimentAnalysis.negative > analytics.sentimentAnalysis.positive) {
      areas.push({
        area: 'Customer Sentiment',
        priority: 'High',
        description: 'More negative feedback than positive - review service quality',
      });
    }

    return areas;
  }

  // Generate recommendations
  private generateRecommendations(analytics: FeedbackAnalytics) {
    const recommendations = [];

    if (analytics.npsScore < 50) {
      recommendations.push({
        action: 'Implement customer recovery program',
        priority: 'High',
        description: 'Focus on converting detractors to promoters',
      });
    }

    if (analytics.totalFeedbacks < 100) {
      recommendations.push({
        action: 'Increase feedback collection efforts',
        priority: 'Medium',
        description: 'Send more feedback requests to gather better insights',
      });
    }

    recommendations.push({
      action: 'Regular feedback review meetings',
      priority: 'Medium',
      description: 'Schedule monthly reviews of customer feedback trends',
    });

    return recommendations;
  }
}