import { NextRequest } from 'next/server';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';
import { AuditService } from '@/lib/services/audit-service';
import { RateLimiter } from '@/lib/services/rate-limiter';
import { DataValidator } from '@/lib/validation/data-validator';

// API Gateway - Unified endpoint for all module communications
export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    // Rate limiting
    const rateLimiter = new RateLimiter();
    const isAllowed = await rateLimiter.checkLimit(user.id, 'api_gateway');
    if (!isAllowed) {
      return apiError('Rate limit exceeded', 429);
    }

    const { module, action, data } = await request.json();

    // Validate request structure
    const validator = new DataValidator();
    const validationResult = validator.validateGatewayRequest({ module, action, data });
    if (!validationResult.isValid) {
      return apiError('Invalid request format: ' + validationResult.errors.join(', '), 400);
    }

    // Log the API request
    await AuditService.logActivity({
      userId: user.id,
      action: 'api_gateway_request',
      module: 'gateway',
      details: { targetModule: module, targetAction: action },
      timestamp: new Date(),
      ipAddress: request.ip,
      userAgent: request.headers.get('user-agent')
    });

    // Route to appropriate module handler
    const result = await routeToModule(module, action, data, { user, tenantId });

    return apiResponse(result);
  } catch (error) {
    console.error('API Gateway Error:', error);

    // Log error
    if (request.headers.get('authorization')) {
      await AuditService.logActivity({
        userId: 'unknown',
        action: 'api_gateway_error',
        module: 'gateway',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date(),
        ipAddress: request.ip,
        userAgent: request.headers.get('user-agent')
      });
    }

    return apiError('Internal server error', 500);
  }
});

async function routeToModule(module: string, action: string, data: any, session: any) {
  const moduleHandlers = {
    inventory: () => import('@/lib/services/inventory-service'),
    sales: () => import('@/lib/services/sales-service'),
    crm: () => import('@/lib/services/crm-service'),
    finance: () => import('@/lib/services/finance-service'),
    production: () => import('@/lib/services/production-service'),
    supply_chain: () => import('@/lib/services/supply-chain-service'),
    analytics: () => import('@/lib/services/analytics-service'),
    ecommerce: () => import('@/lib/services/ecommerce-service')
  };

  if (!moduleHandlers[module]) {
    throw new Error(`Unknown module: ${module}`);
  }

  const moduleService = await moduleHandlers[module]();

  if (!moduleService[action]) {
    throw new Error(`Unknown action: ${action} for module: ${module}`);
  }

  return await moduleService[action](data, session);
}

// GET endpoint for health checks and module status
export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const { searchParams } = new URL(request.url);
    const check = searchParams.get('check');

    if (check === 'health') {
      return apiResponse({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        modules: {
          inventory: 'online',
          sales: 'online',
          crm: 'online',
          finance: 'online',
          production: 'online',
          supply_chain: 'online',
          analytics: 'online',
          ecommerce: 'online'
        }
      });
    }

    if (check === 'modules') {
      return apiResponse({
        availableModules: [
          'inventory',
          'sales',
          'crm',
          'finance',
          'production',
          'supply_chain',
          'analytics',
          'ecommerce'
        ],
        version: '1.0.0'
      });
    }

    return apiResponse({ message: 'API Gateway is running' });
  } catch (error) {
    return apiError('Gateway health check failed', 500);
  }
});