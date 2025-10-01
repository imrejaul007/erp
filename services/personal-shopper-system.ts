// VIP Personal Shopper Assignment and Management System
// Tailored for luxury fragrance retail in the UAE market

import { prisma } from '@/lib/prisma';
import { CustomerSegment } from '@/types/crm';

export interface CreatePersonalShopperRequest {
  userId: string;
  name: string;
  nameArabic?: string;
  email: string;
  phone: string;
  languages: string[];
  specialties: string[];
  certifications?: string[];
  experience?: number; // years
  workingHours?: {
    start: string;
    end: string;
    timezone: string;
  };
  availability?: {
    days: string[];
    maxCustomers?: number;
  };
}

export interface AssignPersonalShopperRequest {
  customerId: string;
  shopperId?: string; // If not provided, system will auto-assign
  notes?: string;
  preferredLanguage?: 'en' | 'ar';
  preferredSpecialties?: string[];
}

export interface PersonalShopperPerformance {
  shopperId: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    totalCustomers: number;
    activeCustomers: number;
    satisfactionRating: number;
    salesGenerated: number;
    averageOrderValue: number;
    customerRetention: number;
    responseTime: number; // average in minutes
    totalAppointments: number;
    completedAppointments: number;
  };
  customerFeedback: Array<{
    rating: number;
    comment?: string;
    createdAt: Date;
  }>;
}

export interface ShopperRecommendation {
  shopperId: string;
  score: number;
  reasons: string[];
  shopper: {
    name: string;
    nameArabic?: string;
    languages: string[];
    specialties: string[];
    currentLoad: number;
    availability: boolean;
  };
}

export class PersonalShopperSystem {

  // Create a new personal shopper profile
  async createPersonalShopper(request: CreatePersonalShopperRequest) {
    // Validate user exists and has appropriate permissions
    const user = await prisma.user.findUnique({
      where: { id: request.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if user already has a personal shopper profile
    const existingShopper = await prisma.personalShopper.findUnique({
      where: { userId: request.userId },
    });

    if (existingShopper) {
      throw new Error('User already has a personal shopper profile');
    }

    const personalShopper = await prisma.personalShopper.create({
      data: {
        userId: request.userId,
        name: request.name,
        nameArabic: request.nameArabic,
        email: request.email,
        phone: request.phone,
        languages: request.languages,
        specialties: request.specialties,
      },
    });

    return personalShopper;
  }

  // Assign a personal shopper to a VIP customer
  async assignPersonalShopper(request: AssignPersonalShopperRequest) {
    // Validate customer exists and is VIP
    const customer = await prisma.customer.findUnique({
      where: { id: request.customerId },
      include: {
        personalShopper: true,
        preferences: true,
        loyaltyAccount: true,
      },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    if (customer.segment !== CustomerSegment.VIP) {
      throw new Error('Personal shopper service is only available for VIP customers');
    }

    let shopperId = request.shopperId;

    // Auto-assign if no specific shopper requested
    if (!shopperId) {
      const recommendation = await this.recommendPersonalShopper(request.customerId);
      if (recommendation.length === 0) {
        throw new Error('No available personal shoppers found');
      }
      shopperId = recommendation[0].shopperId;
    }

    // Validate shopper exists and is active
    const shopper = await prisma.personalShopper.findUnique({
      where: { id: shopperId },
      include: {
        assignments: {
          where: { isActive: true },
        },
      },
    });

    if (!shopper || !shopper.isActive) {
      throw new Error('Personal shopper not found or inactive');
    }

    // Check shopper capacity (max 15 VIP customers per shopper)
    const activeAssignments = shopper.assignments.filter(a => a.isActive).length;
    if (activeAssignments >= 15) {
      throw new Error('Personal shopper has reached maximum customer capacity');
    }

    // Remove existing assignment if any
    if (customer.personalShopper) {
      await prisma.personalShopperAssignment.update({
        where: { id: customer.personalShopper.id },
        data: { isActive: false },
      });
    }

    // Create new assignment
    const assignment = await prisma.personalShopperAssignment.create({
      data: {
        shopperId,
        customerId: request.customerId,
        notes: request.notes,
        isActive: true,
      },
      include: {
        shopper: {
          select: {
            name: true,
            nameArabic: true,
            email: true,
            phone: true,
            languages: true,
            specialties: true,
          },
        },
        customer: {
          select: {
            name: true,
            nameArabic: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Send welcome message to customer
    await this.sendWelcomeMessage(assignment);

    // Update customer history
    await prisma.customerHistory.create({
      data: {
        customerId: request.customerId,
        eventType: 'PERSONAL_SHOPPER_ASSIGNED',
        description: `Personal shopper assigned: ${shopper.name}`,
        createdById: 'system',
      },
    });

    return assignment;
  }

  // Recommend best personal shopper for a customer
  async recommendPersonalShopper(customerId: string): Promise<ShopperRecommendation[]> {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        preferences: true,
        loyaltyAccount: true,
      },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Get all active personal shoppers
    const shoppers = await prisma.personalShopper.findMany({
      where: { isActive: true },
      include: {
        assignments: {
          where: { isActive: true },
          include: {
            customer: {
              select: {
                segment: true,
                totalLifetimeValue: true,
              },
            },
          },
        },
      },
    });

    const recommendations: ShopperRecommendation[] = [];

    for (const shopper of shoppers) {
      const score = this.calculateShopperScore(customer, shopper);
      const currentLoad = shopper.assignments.length;

      // Only recommend shoppers with capacity
      if (currentLoad < 15) {
        recommendations.push({
          shopperId: shopper.id,
          score,
          reasons: this.getRecommendationReasons(customer, shopper, score),
          shopper: {
            name: shopper.name,
            nameArabic: shopper.nameArabic,
            languages: shopper.languages,
            specialties: shopper.specialties,
            currentLoad,
            availability: currentLoad < 15,
          },
        });
      }
    }

    // Sort by score (highest first)
    return recommendations.sort((a, b) => b.score - a.score);
  }

  // Calculate compatibility score between customer and shopper
  private calculateShopperScore(customer: any, shopper: any): number {
    let score = 50; // Base score

    // Language compatibility
    const customerLanguage = customer.language || 'en';
    if (shopper.languages.includes(customerLanguage)) {
      score += 20;
    }

    // Specialty matching
    if (customer.preferences) {
      const customerPreferences = customer.preferences.fragranceTypes || [];
      const matchingSpecialties = shopper.specialties.filter((specialty: string) =>
        customerPreferences.some((pref: string) =>
          specialty.toLowerCase().includes(pref.toLowerCase()) ||
          pref.toLowerCase().includes(specialty.toLowerCase())
        )
      );
      score += matchingSpecialties.length * 5;
    }

    // Workload balancing (prefer shoppers with fewer customers)
    const currentLoad = shopper.assignments.length;
    score += Math.max(0, (15 - currentLoad) * 2);

    // Experience bonus (based on number of customers served)
    const totalCustomersServed = shopper.assignments.length;
    if (totalCustomersServed >= 10) score += 10;
    else if (totalCustomersServed >= 5) score += 5;

    return Math.min(100, score);
  }

  // Get recommendation reasons
  private getRecommendationReasons(customer: any, shopper: any, score: number): string[] {
    const reasons = [];

    if (shopper.languages.includes(customer.language || 'en')) {
      reasons.push(`Speaks ${customer.language === 'ar' ? 'Arabic' : 'English'}`);
    }

    if (customer.preferences) {
      const matchingSpecialties = shopper.specialties.filter((specialty: string) =>
        customer.preferences.fragranceTypes?.some((pref: string) =>
          specialty.toLowerCase().includes(pref.toLowerCase())
        )
      );

      if (matchingSpecialties.length > 0) {
        reasons.push(`Specializes in ${matchingSpecialties.join(', ')}`);
      }
    }

    if (shopper.assignments.length < 5) {
      reasons.push('Available for dedicated attention');
    }

    if (score >= 80) {
      reasons.push('Excellent compatibility match');
    } else if (score >= 60) {
      reasons.push('Good compatibility match');
    }

    return reasons;
  }

  // Send welcome message to customer
  private async sendWelcomeMessage(assignment: any) {
    const { customer, shopper } = assignment;

    const message = customer.language === 'ar'
      ? `مرحباً ${customer.name}! تم تعيين ${shopper.nameArabic || shopper.name} كمستشار التسوق الشخصي الخاص بك. للتواصل: ${shopper.phone}`
      : `Hello ${customer.name}! ${shopper.name} has been assigned as your personal shopper. Contact: ${shopper.phone}`;

    // This would integrate with WhatsApp/SMS service
    console.log(`Sending welcome message: ${message}`);
  }

  // Get personal shopper performance metrics
  async getShopperPerformance(
    shopperId: string,
    startDate: Date,
    endDate: Date
  ): Promise<PersonalShopperPerformance> {
    const shopper = await prisma.personalShopper.findUnique({
      where: { id: shopperId },
      include: {
        assignments: {
          include: {
            customer: {
              include: {
                orders: {
                  where: {
                    orderDate: {
                      gte: startDate,
                      lte: endDate,
                    },
                  },
                },
                feedback: {
                  where: {
                    createdAt: {
                      gte: startDate,
                      lte: endDate,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!shopper) {
      throw new Error('Personal shopper not found');
    }

    const customers = shopper.assignments.map(a => a.customer);
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c =>
      c.orders.some(o => o.orderDate >= startDate && o.orderDate <= endDate)
    ).length;

    // Calculate sales metrics
    const allOrders = customers.flatMap(c => c.orders);
    const salesGenerated = allOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const averageOrderValue = allOrders.length > 0 ? salesGenerated / allOrders.length : 0;

    // Calculate satisfaction rating
    const allFeedback = customers.flatMap(c => c.feedback);
    const satisfactionRating = allFeedback.length > 0
      ? allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length
      : 0;

    // Customer retention (customers who made multiple orders)
    const retainedCustomers = customers.filter(c => c.orders.length > 1).length;
    const customerRetention = totalCustomers > 0 ? (retainedCustomers / totalCustomers) * 100 : 0;

    return {
      shopperId,
      period: { start: startDate, end: endDate },
      metrics: {
        totalCustomers,
        activeCustomers,
        satisfactionRating: Math.round(satisfactionRating * 100) / 100,
        salesGenerated,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        customerRetention: Math.round(customerRetention * 100) / 100,
        responseTime: 15, // This would be calculated from actual response data
        totalAppointments: 0, // Would be calculated from appointment data
        completedAppointments: 0,
      },
      customerFeedback: allFeedback.map(f => ({
        rating: f.rating,
        comment: f.comment,
        createdAt: f.createdAt,
      })),
    };
  }

  // Get shopper dashboard data
  async getShopperDashboard(shopperId: string) {
    const shopper = await prisma.personalShopper.findUnique({
      where: { id: shopperId },
      include: {
        assignments: {
          where: { isActive: true },
          include: {
            customer: {
              include: {
                loyaltyAccount: true,
                orders: {
                  orderBy: { orderDate: 'desc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!shopper) {
      throw new Error('Personal shopper not found');
    }

    const customers = shopper.assignments.map(a => ({
      ...a.customer,
      assignedAt: a.assignedAt,
      notes: a.notes,
      lastOrderDate: a.customer.orders[0]?.orderDate || null,
    }));

    // Sort by priority: recent orders first, then by loyalty tier
    customers.sort((a, b) => {
      if (a.lastOrderDate && b.lastOrderDate) {
        return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime();
      }
      if (a.lastOrderDate && !b.lastOrderDate) return -1;
      if (!a.lastOrderDate && b.lastOrderDate) return 1;

      // Secondary sort by loyalty points
      const aPoints = a.loyaltyAccount?.points || 0;
      const bPoints = b.loyaltyAccount?.points || 0;
      return bPoints - aPoints;
    });

    return {
      shopper: {
        id: shopper.id,
        name: shopper.name,
        nameArabic: shopper.nameArabic,
        email: shopper.email,
        phone: shopper.phone,
        languages: shopper.languages,
        specialties: shopper.specialties,
      },
      customers,
      metrics: {
        totalCustomers: customers.length,
        capacity: 15,
        utilizationRate: Math.round((customers.length / 15) * 100),
        recentOrders: customers.filter(c => c.lastOrderDate &&
          new Date(c.lastOrderDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
      },
    };
  }

  // Transfer customer to another personal shopper
  async transferCustomer(customerId: string, newShopperId: string, reason: string) {
    const currentAssignment = await prisma.personalShopperAssignment.findFirst({
      where: {
        customerId,
        isActive: true,
      },
      include: {
        shopper: true,
      },
    });

    if (!currentAssignment) {
      throw new Error('No active personal shopper assignment found');
    }

    const newShopper = await prisma.personalShopper.findUnique({
      where: { id: newShopperId },
      include: {
        assignments: { where: { isActive: true } },
      },
    });

    if (!newShopper) {
      throw new Error('New personal shopper not found');
    }

    if (newShopper.assignments.length >= 15) {
      throw new Error('New personal shopper has reached maximum capacity');
    }

    // Deactivate current assignment
    await prisma.personalShopperAssignment.update({
      where: { id: currentAssignment.id },
      data: { isActive: false },
    });

    // Create new assignment
    const newAssignment = await prisma.personalShopperAssignment.create({
      data: {
        shopperId: newShopperId,
        customerId,
        notes: `Transferred from ${currentAssignment.shopper.name}. Reason: ${reason}`,
        isActive: true,
      },
      include: {
        shopper: true,
        customer: true,
      },
    });

    // Log the transfer
    await prisma.customerHistory.create({
      data: {
        customerId,
        eventType: 'PERSONAL_SHOPPER_TRANSFERRED',
        description: `Personal shopper changed from ${currentAssignment.shopper.name} to ${newShopper.name}. Reason: ${reason}`,
        createdById: 'system',
      },
    });

    return newAssignment;
  }

  // Get all personal shoppers with their current load
  async getAllPersonalShoppers() {
    const shoppers = await prisma.personalShopper.findMany({
      include: {
        assignments: {
          where: { isActive: true },
          include: {
            customer: {
              select: {
                name: true,
                nameArabic: true,
                totalLifetimeValue: true,
                segment: true,
              },
            },
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            isActive: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return shoppers.map(shopper => ({
      id: shopper.id,
      name: shopper.name,
      nameArabic: shopper.nameArabic,
      email: shopper.email,
      phone: shopper.phone,
      languages: shopper.languages,
      specialties: shopper.specialties,
      isActive: shopper.isActive && shopper.user.isActive,
      metrics: {
        totalCustomers: shopper.assignments.length,
        capacity: 15,
        utilizationRate: Math.round((shopper.assignments.length / 15) * 100),
        totalLifetimeValue: shopper.assignments.reduce(
          (sum, a) => sum + Number(a.customer.totalLifetimeValue),
          0
        ),
      },
      topCustomers: shopper.assignments
        .sort((a, b) => Number(b.customer.totalLifetimeValue) - Number(a.customer.totalLifetimeValue))
        .slice(0, 3)
        .map(a => ({
          name: a.customer.name,
          nameArabic: a.customer.nameArabic,
          segment: a.customer.segment,
          lifetimeValue: Number(a.customer.totalLifetimeValue),
        })),
    }));
  }

  // Generate personal shopper report
  async generateShopperReport(startDate: Date, endDate: Date) {
    const shoppers = await this.getAllPersonalShoppers();
    const reportData = [];

    for (const shopper of shoppers) {
      if (shopper.isActive) {
        const performance = await this.getShopperPerformance(shopper.id, startDate, endDate);
        reportData.push({
          shopper: {
            name: shopper.name,
            nameArabic: shopper.nameArabic,
            specialties: shopper.specialties,
          },
          performance: performance.metrics,
          feedback: {
            averageRating: performance.metrics.satisfactionRating,
            totalReviews: performance.customerFeedback.length,
          },
        });
      }
    }

    // Calculate aggregated metrics
    const aggregatedMetrics = {
      totalShoppers: reportData.length,
      totalCustomers: reportData.reduce((sum, r) => sum + r.performance.totalCustomers, 0),
      totalSales: reportData.reduce((sum, r) => sum + r.performance.salesGenerated, 0),
      averageSatisfaction: reportData.length > 0
        ? reportData.reduce((sum, r) => sum + r.performance.satisfactionRating, 0) / reportData.length
        : 0,
      averageUtilization: reportData.length > 0
        ? reportData.reduce((sum, r) => sum + (r.performance.totalCustomers / 15) * 100, 0) / reportData.length
        : 0,
    };

    return {
      period: { startDate, endDate },
      aggregatedMetrics,
      shopperData: reportData.sort((a, b) => b.performance.salesGenerated - a.performance.salesGenerated),
    };
  }

  // Update personal shopper specialties and languages
  async updateShopperProfile(shopperId: string, updates: {
    specialties?: string[];
    languages?: string[];
    nameArabic?: string;
    phone?: string;
  }) {
    const shopper = await prisma.personalShopper.update({
      where: { id: shopperId },
      data: updates,
    });

    return shopper;
  }

  // Deactivate personal shopper (with customer reassignment)
  async deactivatePersonalShopper(shopperId: string, reason: string) {
    const shopper = await prisma.personalShopper.findUnique({
      where: { id: shopperId },
      include: {
        assignments: {
          where: { isActive: true },
          include: { customer: true },
        },
      },
    });

    if (!shopper) {
      throw new Error('Personal shopper not found');
    }

    // Find alternative shoppers for reassignment
    const activeCustomers = shopper.assignments.length;
    const reassignmentResults = [];

    for (const assignment of shopper.assignments) {
      try {
        const recommendations = await this.recommendPersonalShopper(assignment.customerId);
        if (recommendations.length > 0) {
          await this.transferCustomer(
            assignment.customerId,
            recommendations[0].shopperId,
            `Previous shopper deactivated: ${reason}`
          );
          reassignmentResults.push({
            customerId: assignment.customerId,
            customerName: assignment.customer.name,
            newShopperId: recommendations[0].shopperId,
            success: true,
          });
        } else {
          reassignmentResults.push({
            customerId: assignment.customerId,
            customerName: assignment.customer.name,
            success: false,
            error: 'No available shoppers for reassignment',
          });
        }
      } catch (error) {
        reassignmentResults.push({
          customerId: assignment.customerId,
          customerName: assignment.customer.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Deactivate the shopper
    await prisma.personalShopper.update({
      where: { id: shopperId },
      data: { isActive: false },
    });

    return {
      deactivatedShopper: {
        id: shopper.id,
        name: shopper.name,
      },
      customersReassigned: activeCustomers,
      reassignmentResults,
      summary: {
        successful: reassignmentResults.filter(r => r.success).length,
        failed: reassignmentResults.filter(r => !r.success).length,
      },
    };
  }
}