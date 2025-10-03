import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-simple';
import { prisma } from '@/lib/database/prisma';

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
    throw new Error('Unauthorized: Please log in');
  }

  if (!user.isActive) {
    throw new Error('Account is inactive');
  }

  return user;
}

/**
 * Require tenant context - throws error if user has no tenant
 */
export async function requireTenant() {
  const user = await requireAuth();

  if (!user.tenantId) {
    throw new Error('Unauthorized: No tenant context. Please contact support.');
  }

  // Verify tenant is active
  const tenant = await prisma.tenant.findUnique({
    where: { id: user.tenantId },
    select: { id: true, isActive: true, status: true },
  });

  if (!tenant) {
    throw new Error('Tenant not found');
  }

  if (!tenant.isActive || tenant.status === 'SUSPENDED' || tenant.status === 'CANCELLED') {
    throw new Error('Tenant account is inactive. Please contact support.');
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
    context: { tenantId: string; user: Awaited<ReturnType<typeof requireAuth>> }
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const { tenantId, user } = await requireTenant();
      return await handler(req, { tenantId, user });
    } catch (error: any) {
      return apiError(error.message || 'An error occurred', 401);
    }
  };
}

/**
 * Wrapper for API routes that only require authentication (no tenant required)
 */
export function withAuth(
  handler: (
    req: NextRequest,
    context: { user: Awaited<ReturnType<typeof requireAuth>> }
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const user = await requireAuth();
      return await handler(req, { user });
    } catch (error: any) {
      return apiError(error.message || 'An error occurred', 401);
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
    throw new Error(`Forbidden: Requires role ${Array.isArray(roles) ? roles.join(' or ') : roles}`);
  }
}
