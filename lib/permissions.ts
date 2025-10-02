/**
 * Role-Based Access Control (RBAC) Permissions
 * Defines granular permissions for each user role in the Oud & Perfume ERP
 */

export type Permission =
  // Sales & POS
  | 'pos:use'
  | 'pos:apply_discount'
  | 'pos:void_transaction'
  | 'sales:view'
  | 'sales:create'
  | 'sales:edit'
  | 'sales:delete'
  | 'sales:view_cost_price'
  | 'sales:refund'

  // Inventory
  | 'inventory:view'
  | 'inventory:add'
  | 'inventory:edit'
  | 'inventory:delete'
  | 'inventory:transfer'
  | 'inventory:adjust'
  | 'inventory:waste'
  | 'inventory:sampling'

  // Production
  | 'production:view'
  | 'production:create_batch'
  | 'production:edit_batch'
  | 'production:approve_batch'
  | 'production:distillation'
  | 'production:blending'
  | 'production:bottling'

  // Procurement
  | 'procurement:view'
  | 'procurement:create_po'
  | 'procurement:edit_po'
  | 'procurement:approve_po'
  | 'procurement:receive_goods'
  | 'procurement:manage_suppliers'

  // Finance
  | 'finance:view_reports'
  | 'finance:view_all'
  | 'finance:accounts_payable'
  | 'finance:accounts_receivable'
  | 'finance:bank_reconciliation'
  | 'finance:vat_filing'
  | 'finance:profit_loss'
  | 'finance:approve_payments'

  // Customers
  | 'customers:view'
  | 'customers:create'
  | 'customers:edit'
  | 'customers:delete'
  | 'customers:view_history'

  // HR
  | 'hr:view_staff'
  | 'hr:add_staff'
  | 'hr:edit_staff'
  | 'hr:delete_staff'
  | 'hr:attendance'
  | 'hr:payroll'
  | 'hr:commission'
  | 'hr:performance'

  // Settings
  | 'settings:view'
  | 'settings:edit'
  | 'settings:branding'
  | 'settings:locations'
  | 'settings:users'
  | 'settings:roles'

  // Reports
  | 'reports:sales'
  | 'reports:inventory'
  | 'reports:finance'
  | 'reports:hr'
  | 'reports:production'
  | 'reports:export'

  // Events
  | 'events:view'
  | 'events:create'
  | 'events:manage'
  | 'events:sales'
  | 'events:profitability'

  // Admin
  | 'admin:all'
  | 'admin:override'
  | 'admin:audit_log';

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  // 1. Super Admin - Full Control
  SUPER_ADMIN: [
    'admin:all',
    'admin:override',
    'admin:audit_log',
    'pos:use',
    'pos:apply_discount',
    'pos:void_transaction',
    'sales:view',
    'sales:create',
    'sales:edit',
    'sales:delete',
    'sales:view_cost_price',
    'sales:refund',
    'inventory:view',
    'inventory:add',
    'inventory:edit',
    'inventory:delete',
    'inventory:transfer',
    'inventory:adjust',
    'inventory:waste',
    'inventory:sampling',
    'production:view',
    'production:create_batch',
    'production:edit_batch',
    'production:approve_batch',
    'production:distillation',
    'production:blending',
    'production:bottling',
    'procurement:view',
    'procurement:create_po',
    'procurement:edit_po',
    'procurement:approve_po',
    'procurement:receive_goods',
    'procurement:manage_suppliers',
    'finance:view_all',
    'finance:accounts_payable',
    'finance:accounts_receivable',
    'finance:bank_reconciliation',
    'finance:vat_filing',
    'finance:profit_loss',
    'finance:approve_payments',
    'customers:view',
    'customers:create',
    'customers:edit',
    'customers:delete',
    'customers:view_history',
    'hr:view_staff',
    'hr:add_staff',
    'hr:edit_staff',
    'hr:delete_staff',
    'hr:attendance',
    'hr:payroll',
    'hr:commission',
    'hr:performance',
    'settings:view',
    'settings:edit',
    'settings:branding',
    'settings:locations',
    'settings:users',
    'settings:roles',
    'reports:sales',
    'reports:inventory',
    'reports:finance',
    'reports:hr',
    'reports:production',
    'reports:export',
    'events:view',
    'events:create',
    'events:manage',
    'events:sales',
    'events:profitability',
  ],

  // 2. Admin (Branch Manager)
  ADMIN: [
    'pos:use',
    'pos:apply_discount',
    'pos:void_transaction',
    'sales:view',
    'sales:create',
    'sales:edit',
    'sales:refund',
    'sales:view_cost_price', // Branch managers can see costs
    'inventory:view',
    'inventory:add',
    'inventory:edit',
    'inventory:transfer',
    'inventory:adjust',
    'inventory:waste',
    'inventory:sampling',
    'production:view',
    'production:edit_batch',
    'production:approve_batch',
    'procurement:view',
    'procurement:create_po',
    'procurement:receive_goods',
    'finance:view_reports', // Branch-level only
    'customers:view',
    'customers:create',
    'customers:edit',
    'customers:view_history',
    'hr:view_staff',
    'hr:attendance',
    'hr:commission',
    'settings:view',
    'reports:sales',
    'reports:inventory',
    'reports:export',
  ],

  // 3. Sales Staff (POS User)
  SALES_STAFF: [
    'pos:use',
    'pos:apply_discount', // If allowed by manager
    'sales:view',
    'sales:create',
    'customers:view',
    'customers:create',
    'customers:edit',
    'inventory:view', // Can see stock levels
  ],

  // 4. Inventory/Warehouse Staff
  INVENTORY_STAFF: [
    'inventory:view',
    'inventory:add',
    'inventory:edit',
    'inventory:transfer',
    'inventory:adjust',
    'inventory:waste',
    'inventory:sampling',
    'procurement:view',
    'procurement:receive_goods',
    'reports:inventory',
  ],

  // 5. Production Staff
  PRODUCTION_STAFF: [
    'production:view',
    'production:create_batch',
    'production:edit_batch',
    'production:distillation',
    'production:blending',
    'production:bottling',
    'inventory:view', // Can see raw materials
    'reports:production',
  ],

  // 6. Procurement Officer
  PROCUREMENT_OFFICER: [
    'procurement:view',
    'procurement:create_po',
    'procurement:edit_po',
    'procurement:receive_goods',
    'procurement:manage_suppliers',
    'inventory:view',
    'reports:inventory',
    'reports:export',
  ],

  // 7. Accountant (Finance & Accounts)
  ACCOUNTANT: [
    'finance:view_all',
    'finance:accounts_payable',
    'finance:accounts_receivable',
    'finance:bank_reconciliation',
    'finance:vat_filing',
    'finance:profit_loss',
    'sales:view',
    'procurement:view',
    'reports:sales',
    'reports:finance',
    'reports:export',
  ],

  // 8. HR Manager
  HR_MANAGER: [
    'hr:view_staff',
    'hr:add_staff',
    'hr:edit_staff',
    'hr:delete_staff',
    'hr:attendance',
    'hr:payroll',
    'hr:commission',
    'hr:performance',
    'reports:hr',
    'reports:export',
  ],

  // 9. Event Staff
  EVENT_STAFF: [
    'pos:use',
    'sales:view',
    'sales:create',
    'customers:create',
    'events:sales',
    'inventory:view', // Event location stock only
  ],

  // 10. Event Manager
  EVENT_MANAGER: [
    'pos:use',
    'pos:apply_discount',
    'sales:view',
    'sales:create',
    'sales:edit',
    'sales:view_cost_price',
    'customers:view',
    'customers:create',
    'events:view',
    'events:create',
    'events:manage',
    'events:sales',
    'events:profitability',
    'inventory:view',
    'reports:sales',
    'reports:export',
  ],

  // 11. Auditor (Read-Only)
  AUDITOR: [
    'sales:view',
    'inventory:view',
    'production:view',
    'procurement:view',
    'finance:view_all',
    'customers:view',
    'hr:view_staff',
    'reports:sales',
    'reports:inventory',
    'reports:finance',
    'reports:hr',
    'reports:production',
    'reports:export',
    'admin:audit_log',
  ],

  // Legacy Roles (for backwards compatibility)
  MANAGER: [
    'pos:use',
    'pos:apply_discount',
    'sales:view',
    'sales:create',
    'sales:edit',
    'inventory:view',
    'inventory:add',
    'customers:view',
    'customers:create',
    'reports:sales',
    'reports:inventory',
  ],

  OWNER: [
    // Redirects to SUPER_ADMIN permissions
    'admin:all',
  ],

  USER: [
    'sales:view',
    'inventory:view',
    'customers:view',
  ],
};

/**
 * Check if a user role has a specific permission
 */
export function hasPermission(role: string, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission) || permissions.includes('admin:all');
}

/**
 * Check if a user role has any of the specified permissions
 */
export function hasAnyPermission(role: string, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Check if a user role has all of the specified permissions
 */
export function hasAllPermissions(role: string, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: string): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}
