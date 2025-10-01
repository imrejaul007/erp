import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AuditService } from '@/lib/services/audit-service';
import { RateLimiter } from '@/lib/services/rate-limiter';
import { DataValidator } from '@/lib/validation/data-validator';

// API Gateway - Unified endpoint for all module communications
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rate limiting
    const rateLimiter = new RateLimiter();
    const isAllowed = await rateLimiter.checkLimit(session.user.id, 'api_gateway');
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const { module, action, data } = await request.json();

    // Validate request structure
    const validator = new DataValidator();
    const validationResult = validator.validateGatewayRequest({ module, action, data });
    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: 'Invalid request format', details: validationResult.errors },
        { status: 400 }
      );
    }

    // Log the API request
    await AuditService.logActivity({
      userId: session.user.id,
      action: 'api_gateway_request',
      module: 'gateway',
      details: { targetModule: module, targetAction: action },
      timestamp: new Date(),
      ipAddress: request.ip,
      userAgent: request.headers.get('user-agent')
    });

    // Route to appropriate module handler
    const result = await routeToModule(module, action, data, session);

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Gateway Error:', error);

    // Log error
    if (request.headers.get('authorization')) {
      await AuditService.logActivity({
        userId: 'unknown',
        action: 'api_gateway_error',
        module: 'gateway',
        details: { error: error.message },
        timestamp: new Date(),
        ipAddress: request.ip,
        userAgent: request.headers.get('user-agent')
      });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const check = searchParams.get('check');

    if (check === 'health') {
      return NextResponse.json({
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
      return NextResponse.json({
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

    return NextResponse.json({ message: 'API Gateway is running' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gateway health check failed' },
      { status: 500 }
    );
  }
}