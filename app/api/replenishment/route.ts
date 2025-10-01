import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';

// Validation schemas
const ReplenishmentRuleSchema = z.object({
  storeId: z.string().optional(),
  productId: z.string().optional(),
  categoryId: z.string().optional(),
  minLevel: z.number().min(0, 'Min level must be non-negative'),
  maxLevel: z.number().min(1, 'Max level must be positive'),
  reorderQuantity: z.number().min(1, 'Reorder quantity must be positive'),
  leadTimeDays: z.number().min(1, 'Lead time must be at least 1 day'),
  safetyStock: z.number().min(0, 'Safety stock must be non-negative'),
  seasonalAdjustment: z.array(z.object({
    month: z.number().min(1).max(12, 'Month must be between 1 and 12'),
    adjustmentPercentage: z.number().min(-90).max(500, 'Adjustment percentage out of range'),
    reason: z.string().optional()
  })).optional(),
  autoApprove: z.boolean().default(false),
  isActive: z.boolean().default(true)
}).refine(data => {
  return data.maxLevel > data.minLevel;
}, {
  message: 'Max level must be greater than min level',
  path: ['maxLevel']
});

const AlertActionSchema = z.object({
  alertId: z.string().min(1, 'Alert ID is required'),
  action: z.enum(['resolve', 'create_order', 'snooze']),
  notes: z.string().optional(),
  snoozeUntil: z.string().datetime().optional()
});

// GET /api/replenishment - Get replenishment rules and alerts
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const userRole = session.user.role;
    if (!['OWNER', 'ADMIN', 'MANAGER', 'INVENTORY'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const url = new URL(req.url);
    const type = url.searchParams.get('type') || 'all'; // rules, alerts, or all
    const storeId = url.searchParams.get('storeId');
    const priority = url.searchParams.get('priority');

    // Filter by user's accessible stores if not admin/owner
    const userStores = session.user.stores || [];
    const accessibleStores = ['OWNER', 'ADMIN'].includes(userRole) ? null : userStores;

    // Mock data - TODO: Replace with actual database queries
    const mockRules = [
      {
        id: '1',
        storeId: '1',
        productId: null,
        categoryId: 'cat1',
        minLevel: 10,
        maxLevel: 100,
        reorderQuantity: 50,
        leadTimeDays: 3,
        safetyStock: 5,
        seasonalAdjustment: [
          { month: 12, adjustmentPercentage: 50, reason: 'Holiday season increase' },
          { month: 6, adjustmentPercentage: -20, reason: 'Summer decrease' }
        ],
        autoApprove: true,
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        storeId: '2',
        productId: 'prod2',
        categoryId: null,
        minLevel: 15,
        maxLevel: 80,
        reorderQuantity: 30,
        leadTimeDays: 2,
        safetyStock: 8,
        seasonalAdjustment: [],
        autoApprove: false,
        isActive: true,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01')
      }
    ];

    const mockAlerts = [
      {
        id: '1',
        storeId: '1',
        productId: 'prod2',
        alertType: 'LOW_STOCK',
        currentStock: 8,
        suggestedOrder: 25,
        priority: 'HIGH',
        message: 'Rose Perfume is running low at Dubai Mall Store. Current stock (8) is below minimum level (15).',
        isResolved: false,
        createdAt: new Date('2024-09-16T08:30:00Z'),
        resolvedAt: null
      },
      {
        id: '2',
        storeId: '2',
        productId: 'prod3',
        alertType: 'OUT_OF_STOCK',
        currentStock: 0,
        suggestedOrder: 20,
        priority: 'CRITICAL',
        message: 'Arabian Nights is out of stock at Mall of the Emirates. Immediate replenishment required.',
        isResolved: false,
        createdAt: new Date('2024-09-15T14:20:00Z'),
        resolvedAt: null
      },
      {
        id: '3',
        storeId: '1',
        productId: 'prod1',
        alertType: 'SEASONAL_ADJUSTMENT',
        currentStock: 45,
        suggestedOrder: 75,
        priority: 'MEDIUM',
        message: 'Increase Oud Al Malaki stock for upcoming holiday season (50% adjustment recommended).',
        isResolved: true,
        createdAt: new Date('2024-09-10T10:00:00Z'),
        resolvedAt: new Date('2024-09-12T16:30:00Z')
      }
    ];

    let response: any = {};

    if (type === 'rules' || type === 'all') {
      let filteredRules = mockRules;

      if (accessibleStores) {
        filteredRules = filteredRules.filter(rule =>
          !rule.storeId || accessibleStores.includes(rule.storeId)
        );
      }

      if (storeId) {
        filteredRules = filteredRules.filter(rule => rule.storeId === storeId);
      }

      response.rules = filteredRules;
    }

    if (type === 'alerts' || type === 'all') {
      let filteredAlerts = mockAlerts;

      if (accessibleStores) {
        filteredAlerts = filteredAlerts.filter(alert =>
          accessibleStores.includes(alert.storeId)
        );
      }

      if (storeId) {
        filteredAlerts = filteredAlerts.filter(alert => alert.storeId === storeId);
      }

      if (priority) {
        filteredAlerts = filteredAlerts.filter(alert => alert.priority === priority);
      }

      response.alerts = filteredAlerts;

      // Add alert statistics
      response.alertStats = {
        total: filteredAlerts.length,
        unresolved: filteredAlerts.filter(a => !a.isResolved).length,
        critical: filteredAlerts.filter(a => a.priority === 'CRITICAL' && !a.isResolved).length,
        high: filteredAlerts.filter(a => a.priority === 'HIGH' && !a.isResolved).length,
        resolvedToday: filteredAlerts.filter(a =>
          a.isResolved &&
          a.resolvedAt &&
          new Date(a.resolvedAt).toDateString() === new Date().toDateString()
        ).length
      };
    }

    // Add engine status
    response.engineStatus = {
      isEnabled: true,
      lastRun: new Date('2024-09-16T09:00:00Z'),
      nextRun: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      rulesProcessed: mockRules.filter(r => r.isActive).length,
      alertsGenerated: 2
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching replenishment data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/replenishment - Create rule or process alert
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const userRole = session.user.role;
    if (!['OWNER', 'ADMIN', 'MANAGER', 'INVENTORY'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const { action, data } = body;
    const userStores = session.user.stores || [];

    switch (action) {
      case 'create_rule':
        const ruleData = ReplenishmentRuleSchema.parse(data);

        // Check store access if storeId is provided
        if (ruleData.storeId && !['OWNER', 'ADMIN'].includes(userRole)) {
          if (!userStores.includes(ruleData.storeId)) {
            return NextResponse.json({ error: 'Access denied to this store' }, { status: 403 });
          }
        }

        // Validate rule logic
        if (ruleData.storeId && ruleData.productId && ruleData.categoryId) {
          return NextResponse.json({
            error: 'Rule cannot specify both productId and categoryId'
          }, { status: 400 });
        }

        // TODO: Check for conflicting rules
        // TODO: Create rule in database

        const newRule = {
          id: `rule_${Date.now()}`,
          ...ruleData,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        return NextResponse.json(newRule, { status: 201 });

      case 'process_alert':
        const alertAction = AlertActionSchema.parse(data);

        // Check store access for the alert
        // TODO: Get alert from database and check store access

        switch (alertAction.action) {
          case 'resolve':
            // TODO: Mark alert as resolved in database
            const resolvedAlert = {
              id: alertAction.alertId,
              isResolved: true,
              resolvedAt: new Date(),
              resolvedBy: session.user.id,
              notes: alertAction.notes
            };

            return NextResponse.json({
              message: 'Alert resolved successfully',
              alert: resolvedAlert
            });

          case 'create_order':
            // TODO: Create purchase order based on alert suggestion
            const purchaseOrder = {
              id: `po_${Date.now()}`,
              alertId: alertAction.alertId,
              status: 'PENDING',
              createdBy: session.user.id,
              createdAt: new Date(),
              notes: alertAction.notes
            };

            // TODO: Mark alert as resolved
            return NextResponse.json({
              message: 'Purchase order created successfully',
              purchaseOrder
            }, { status: 201 });

          case 'snooze':
            if (!alertAction.snoozeUntil) {
              return NextResponse.json({
                error: 'Snooze until date is required'
              }, { status: 400 });
            }

            // TODO: Update alert with snooze date
            const snoozedAlert = {
              id: alertAction.alertId,
              snoozedUntil: new Date(alertAction.snoozeUntil),
              snoozedBy: session.user.id,
              notes: alertAction.notes
            };

            return NextResponse.json({
              message: 'Alert snoozed successfully',
              alert: snoozedAlert
            });
        }
        break;

      case 'run_engine':
        // Manual trigger of replenishment engine
        if (!['OWNER', 'ADMIN', 'MANAGER'].includes(userRole)) {
          return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        // TODO: Trigger replenishment engine
        const engineRun = {
          id: `run_${Date.now()}`,
          triggeredBy: session.user.id,
          startTime: new Date(),
          status: 'RUNNING'
        };

        return NextResponse.json({
          message: 'Replenishment engine started',
          run: engineRun
        });

      case 'generate_suggestions':
        const { storeIds, productIds } = data;

        // Check store access
        const accessibleStores = ['OWNER', 'ADMIN'].includes(userRole) ?
          storeIds :
          storeIds?.filter((id: string) => userStores.includes(id)) || userStores;

        // TODO: Generate reorder suggestions based on current stock levels
        const suggestions = [
          {
            storeId: '1',
            storeName: 'Dubai Mall Store',
            productId: 'prod2',
            productName: 'Rose Perfume',
            currentStock: 8,
            suggestedQuantity: 25,
            priority: 'HIGH',
            reason: 'Stock below reorder point (15)',
            estimatedCost: 6250,
            leadTimeDays: 2
          },
          {
            storeId: '2',
            storeName: 'Mall of the Emirates',
            productId: 'prod3',
            productName: 'Arabian Nights',
            currentStock: 0,
            suggestedQuantity: 20,
            priority: 'CRITICAL',
            reason: 'Out of stock',
            estimatedCost: 7000,
            leadTimeDays: 1
          }
        ];

        return NextResponse.json({
          suggestions: suggestions.filter(s =>
            accessibleStores.includes(s.storeId) &&
            (!productIds || productIds.includes(s.productId))
          )
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error processing replenishment request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/replenishment - Update rule or engine settings
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const userRole = session.user.role;
    if (!['OWNER', 'ADMIN', 'MANAGER'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const { action, data } = body;

    switch (action) {
      case 'update_rule':
        const { ruleId, updates } = data;
        const ruleUpdates = ReplenishmentRuleSchema.partial().parse(updates);

        // TODO: Check if user has access to the rule's store
        // TODO: Update rule in database

        const updatedRule = {
          id: ruleId,
          ...ruleUpdates,
          updatedAt: new Date()
        };

        return NextResponse.json(updatedRule);

      case 'toggle_engine':
        if (!['OWNER', 'ADMIN'].includes(userRole)) {
          return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const { enabled } = data;

        // TODO: Update engine status in database
        // TODO: Start/stop background processes

        return NextResponse.json({
          engineEnabled: enabled,
          message: `Replenishment engine ${enabled ? 'enabled' : 'disabled'}`,
          updatedAt: new Date(),
          updatedBy: session.user.id
        });

      case 'update_settings':
        if (!['OWNER', 'ADMIN'].includes(userRole)) {
          return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const { settings } = data;

        // TODO: Update engine settings in database
        const updatedSettings = {
          runInterval: settings.runInterval ?? 3600, // seconds
          enableEmailNotifications: settings.enableEmailNotifications ?? true,
          enableSmsNotifications: settings.enableSmsNotifications ?? false,
          autoApproveThreshold: settings.autoApproveThreshold ?? 1000, // AED
          maxOrderValue: settings.maxOrderValue ?? 50000, // AED
          updatedAt: new Date(),
          updatedBy: session.user.id
        };

        return NextResponse.json(updatedSettings);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating replenishment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/replenishment - Delete rule
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const userRole = session.user.role;
    if (!['OWNER', 'ADMIN', 'MANAGER'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const url = new URL(req.url);
    const ruleId = url.searchParams.get('ruleId');

    if (!ruleId) {
      return NextResponse.json({ error: 'Rule ID is required' }, { status: 400 });
    }

    // TODO: Check if user has access to the rule's store
    // TODO: Check if rule can be deleted (no pending orders, etc.)
    // TODO: Soft delete rule (mark as inactive)

    return NextResponse.json({
      message: 'Replenishment rule deleted successfully',
      ruleId,
      deletedAt: new Date(),
      deletedBy: session.user.id
    });

  } catch (error) {
    console.error('Error deleting replenishment rule:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}