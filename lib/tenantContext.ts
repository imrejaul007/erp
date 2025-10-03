import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Get the current tenant ID from the session
 * This should be called in API routes and server components
 */
export async function getTenantId(): Promise<string | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.tenantId) {
    return null;
  }

  return session.user.tenantId;
}

/**
 * Get the current tenant ID and throw if not found
 * Use this when tenant context is required
 */
export async function requireTenantId(): Promise<string> {
  const tenantId = await getTenantId();

  if (!tenantId) {
    throw new Error('Unauthorized: No tenant context found. Please log in.');
  }

  return tenantId;
}

/**
 * Validate if a user has access to a specific tenant
 */
export async function validateTenantAccess(tenantId: string): Promise<boolean> {
  const userTenantId = await getTenantId();

  if (!userTenantId) {
    return false;
  }

  return userTenantId === tenantId;
}

/**
 * Get tenant context with user information
 */
export async function getTenantContext() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  return {
    tenantId: session.user.tenantId || null,
    userId: session.user.id,
    userEmail: session.user.email,
    userRole: session.user.role,
  };
}
