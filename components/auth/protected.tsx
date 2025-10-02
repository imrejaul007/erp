import { usePermissions } from '@/hooks/use-permissions';
import { type Permission } from '@/lib/permissions';

interface ProtectedProps {
  children: React.ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Component to conditionally render UI based on user permissions
 *
 * @example
 * ```tsx
 * <Protected permission="sales:create">
 *   <CreateSaleButton />
 * </Protected>
 *
 * <Protected permissions={['inventory:edit', 'inventory:delete']} requireAll>
 *   <AdvancedInventoryActions />
 * </Protected>
 *
 * <Protected permission="finance:view_all" fallback={<AccessDenied />}>
 *   <FinancialReports />
 * </Protected>
 * ```
 */
export function Protected({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
}: ProtectedProps) {
  const { can, canAny, canAll } = usePermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = can(permission);
  } else if (permissions) {
    hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
  } else {
    // No permission specified, always show
    hasAccess = true;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

/**
 * Higher-order component to protect pages
 */
export function withPermission(permission: Permission) {
  return function <P extends object>(Component: React.ComponentType<P>) {
    return function ProtectedComponent(props: P) {
      const { can } = usePermissions();

      if (!can(permission)) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
              <p className="text-gray-600">You don't have permission to access this page.</p>
            </div>
          </div>
        );
      }

      return <Component {...props} />;
    };
  };
}
