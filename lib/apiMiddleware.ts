import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-simple';
import { prisma } from '@/lib/prisma';
import { handleError, AppError, ErrorCode, ErrorHelpers } from '@/lib/errorHandler';
import { RequestLogger } from '@/lib/requestLogger';
import { rateLimit, RateLimits } from '@/lib/rateLimit';

/**
 * API Response helper with consistent error handling
 */
export function apiResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Get authenticated user with tenant context from request
 * Returns null if not authenticated
 */
export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    role: session.user.role,
    tenantId: session.user.tenantId,
    isActive: session.user.isActive,
  };
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth() {
  const user = await getAuthenticatedUser();

  if (!user) {
    ErrorHelpers.unauthorized('Please log in');
  }

  if (!user.isActive) {
    ErrorHelpers.forbidden('Account is inactive');
  }

  return user;
}

/**
 * Require tenant context - throws error if user has no tenant
 */
export async function requireTenant() {
  const user = await requireAuth();

  if (!user.tenantId) {
    throw new AppError(
      'No tenant context. Please contact support.',
      ErrorCode.TENANT_NOT_FOUND,
      401
    );
  }

  // Verify tenant is active
  const tenant = await prisma.tenant.findUnique({
    where: { id: user.tenantId },
    select: { id: true, isActive: true, status: true },
  });

  if (!tenant) {
    throw new AppError(
      'Tenant not found',
      ErrorCode.TENANT_NOT_FOUND,
      404
    );
  }

  if (!tenant.isActive || tenant.status === 'SUSPENDED' || tenant.status === 'CANCELLED') {
    throw new AppError(
      'Tenant account is inactive. Please contact support.',
      ErrorCode.FORBIDDEN,
      403
    );
  }

  return {
    user,
    tenantId: user.tenantId,
  };
}

/**
 * Wrapper for API routes that require authentication and tenant context
 * Usage:
 *
 * export const GET = withTenant(async (req, context) => {
 *   const { tenantId, user } = context;
 *   // Your code here - tenantId is guaranteed to exist
 *   const products = await prisma.product.findMany({
 *     where: { tenantId }
 *   });
 *   return apiResponse(products);
 * });
 */
export function withTenant(
  handler: (
    req: NextRequest,
    context: { tenantId: string; user: Awaited<ReturnType<typeof requireAuth>>; logger: RequestLogger }
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const logger = new RequestLogger(req);

    try {
      const { tenantId, user } = await requireTenant();
      logger['tenantId'] = tenantId;
      logger['userId'] = user.id;

      const response = await handler(req, { tenantId, user, logger });

      // Log successful response
      logger.success(response.status);

      return response;
    } catch (error: any) {
      const url = new URL(req.url);
      const errorResponse = handleError(error, url.pathname);

      // Log error response
      logger.error(
        errorResponse.status,
        error instanceof AppError ? error.message : 'An error occurred'
      );

      return errorResponse;
    }
  };
}

/**
 * Wrapper for API routes that only require authentication (no tenant required)
 */
export function withAuth(
  handler: (
    req: NextRequest,
    context: { user: Awaited<ReturnType<typeof requireAuth>>; logger: RequestLogger }
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const logger = new RequestLogger(req);

    try {
      const user = await requireAuth();
      logger['userId'] = user.id;

      const response = await handler(req, { user, logger });

      // Log successful response
      logger.success(response.status);

      return response;
    } catch (error: any) {
      const url = new URL(req.url);
      const errorResponse = handleError(error, url.pathname);

      // Log error response
      logger.error(
        errorResponse.status,
        error instanceof AppError ? error.message : 'An error occurred'
      );

      return errorResponse;
    }
  };
}

/**
 * Check if user has specific role
 */
export function hasRole(user: Awaited<ReturnType<typeof requireAuth>>, roles: string | string[]) {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(user.role);
}

/**
 * Require specific role - throws if user doesn't have role
 */
export function requireRole(user: Awaited<ReturnType<typeof requireAuth>>, roles: string | string[]) {
  if (!hasRole(user, roles)) {
    ErrorHelpers.forbidden(`Requires role ${Array.isArray(roles) ? roles.join(' or ') : roles}`);
  }
}

/**
 * Enhanced withTenant with rate limiting
 * Usage:
 * export const POST = withTenant(handler, { rateLimit: RateLimits.write() });
 */
export function withTenantAndRateLimit(
  handler: (
    req: NextRequest,
    context: { tenantId: string; user: Awaited<ReturnType<typeof requireAuth>>; logger: RequestLogger }
  ) => Promise<NextResponse>,
  options?: {
    rateLimit?: ReturnType<typeof rateLimit>;
  }
) {
  return async (req: NextRequest) => {
    const logger = new RequestLogger(req);

    try {
      const { tenantId, user } = await requireTenant();
      logger['tenantId'] = tenantId;
      logger['userId'] = user.id;

      // Apply rate limiting if configured
      if (options?.rateLimit) {
        await options.rateLimit(req, tenantId);
      }

      const response = await handler(req, { tenantId, user, logger });

      // Log successful response
      logger.success(response.status);

      return response;
    } catch (error: any) {
      const url = new URL(req.url);
      const errorResponse = handleError(error, url.pathname);

      // Log error response
      logger.error(
        errorResponse.status,
        error instanceof AppError ? error.message : 'An error occurred'
      );

      return errorResponse;
    }
  };
}

// Export utilities for use in routes
export { AppError, ErrorCode, ErrorHelpers, RateLimits };
