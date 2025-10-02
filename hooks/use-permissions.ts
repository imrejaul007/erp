import { useSession } from 'next-auth/react';
import { hasPermission, hasAnyPermission, hasAllPermissions, getRolePermissions, type Permission } from '@/lib/permissions';

/**
 * Hook to check user permissions based on their role
 *
 * @example
 * ```tsx
 * const { hasPermission, can } = usePermissions();
 *
 * if (can('sales:create')) {
 *   // Show create sale button
 * }
 *
 * // Or use directly in JSX
 * {hasPermission('inventory:edit') && <EditButton />}
 * ```
 */
export function usePermissions() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'USER';

  return {
    /**
     * Check if user has a specific permission
     */
    can: (permission: Permission) => hasPermission(userRole, permission),

    /**
     * Alias for `can` - more readable in some contexts
     */
    hasPermission: (permission: Permission) => hasPermission(userRole, permission),

    /**
     * Check if user has any of the specified permissions
     */
    canAny: (permissions: Permission[]) => hasAnyPermission(userRole, permissions),

    /**
     * Check if user has all of the specified permissions
     */
    canAll: (permissions: Permission[]) => hasAllPermissions(userRole, permissions),

    /**
     * Get all permissions for the current user
     */
    permissions: getRolePermissions(userRole),

    /**
     * Current user role
     */
    role: userRole,

    /**
     * Check if user is admin (SUPER_ADMIN or ADMIN)
     */
    isAdmin: userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' || userRole === 'OWNER',

    /**
     * Check if user is super admin
     */
    isSuperAdmin: userRole === 'SUPER_ADMIN' || userRole === 'OWNER',
  };
}
