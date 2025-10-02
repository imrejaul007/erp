# Role-Based Access Control (RBAC) Documentation

## Overview

The Oud & Perfume ERP system implements a comprehensive role-based access control system to ensure that each user only has access to the features and data relevant to their job function.

## User Roles

### 1. 👑 Super Admin (`SUPER_ADMIN`)
**Who:** Owner / Head Office Management

**Full Access To:**
- ✅ All modules and features
- ✅ Add/remove users and assign roles
- ✅ Manage all locations, warehouses, and events
- ✅ Access all financial data across all branches
- ✅ Approve/override any transaction
- ✅ System settings and branding
- ✅ Audit logs and compliance reports

**Use Cases:**
- Managing the entire business
- Strategic decision-making
- Setting up new branches
- Financial oversight

---

### 2. 🏢 Admin / Branch Manager (`ADMIN`)
**Who:** Store/Branch Manager

**Can Access:**
- ✅ Manage assigned store/branch only
- ✅ Approve purchases, sales discounts, wastage, sampling
- ✅ View branch-level reports
- ✅ Control stock transfers in/out of branch
- ✅ Manage branch staff
- ✅ See cost prices and margins

**Restrictions:**
- ❌ Cannot access other branches
- ❌ Limited to branch-level financial reports
- ❌ Cannot modify system settings

**Use Cases:**
- Daily branch operations
- Staff management
- Local inventory control
- Branch performance tracking

---

### 3. 🛒 Sales Staff / POS User (`SALES_STAFF`)
**Who:** Cashier / Sales Associate

**Can Access:**
- ✅ Use POS system for sales
- ✅ Create walk-in customer profiles
- ✅ Apply discounts (if authorized)
- ✅ Handle multi-payment transactions
- ✅ Issue invoices and receipts
- ✅ View stock availability

**Restrictions:**
- ❌ Cannot see cost prices or margins
- ❌ Cannot access full financial reports
- ❌ Cannot modify inventory counts
- ❌ Cannot delete transactions

**Use Cases:**
- Processing customer sales
- Creating new customer records
- Daily POS operations

---

### 4. 📦 Inventory / Warehouse Staff (`INVENTORY_STAFF`)
**Who:** Stock Manager / Warehouse Worker

**Can Access:**
- ✅ Add stock receipts (purchases)
- ✅ Manage stock transfers between locations
- ✅ Handle segregation & grading (with approval)
- ✅ Update stock counts, wastage, and sampling
- ✅ View inventory reports

**Restrictions:**
- ❌ No access to sales module
- ❌ No access to finance module
- ❌ Cannot see selling prices or margins

**Use Cases:**
- Receiving goods
- Stock counting
- Inter-branch transfers
- Wastage management

---

### 5. 🧪 Production Staff (`PRODUCTION_STAFF`)
**Who:** Lab Technician / Oil Distiller / Perfumer

**Can Access:**
- ✅ Access production management
- ✅ Create batches (distillation, blending)
- ✅ Update yields, wastage, costs
- ✅ Manage segregation, blending, bottling
- ✅ View raw materials inventory

**Restrictions:**
- ❌ Cannot see financial reports
- ❌ Cannot see selling prices
- ❌ Cannot access sales or procurement

**Use Cases:**
- Oil distillation
- Perfume blending
- Batch management
- Quality control

---

### 6. 🚚 Procurement Officer (`PROCUREMENT_OFFICER`)
**Who:** Purchase Officer / Buyer

**Can Access:**
- ✅ Create purchase orders
- ✅ Manage suppliers
- ✅ Record received goods
- ✅ Track shipments and customs
- ✅ View procurement reports

**Restrictions:**
- ❌ Cannot access finance module
- ❌ Cannot see sales data
- ❌ Cannot modify inventory outside of procurement

**Use Cases:**
- Supplier management
- Purchase orders
- Goods receipt
- Procurement analytics

---

### 7. 💰 Accountant (`ACCOUNTANT`)
**Who:** Finance & Accounts Manager

**Can Access:**
- ✅ Finance & accounting module
- ✅ Accounts payable/receivable
- ✅ Bank reconciliation
- ✅ VAT filings (UAE 5%)
- ✅ Salary & payroll approvals
- ✅ Profit & loss reports
- ✅ Financial statements

**Restrictions:**
- ❌ Cannot change inventory or sales entries
- ❌ Cannot modify cost prices
- ❌ View-only for sales and inventory

**Use Cases:**
- Financial reporting
- Tax compliance
- Payroll management
- Accounts reconciliation

---

### 8. 👥 HR Manager (`HR_MANAGER`)
**Who:** Human Resources Manager

**Can Access:**
- ✅ Staff records & contracts
- ✅ Attendance, shifts, leave management
- ✅ Payroll processing
- ✅ Commission tracking for sales staff
- ✅ Performance reviews
- ✅ HR reports

**Restrictions:**
- ❌ No access to sales module
- ❌ No access to finance module
- ❌ No access to inventory

**Use Cases:**
- Employee management
- Attendance tracking
- Payroll processing
- Performance reviews

---

### 9. 🎪 Event Staff (`EVENT_STAFF`)
**Who:** Exhibition / Pop-up Sales Staff

**Can Access:**
- ✅ Special POS access for exhibitions/pop-ups
- ✅ Record event sales & sampling
- ✅ Create customer profiles
- ✅ View event location stock only

**Restrictions:**
- ❌ Cannot access head office data
- ❌ Cannot see other locations
- ❌ Limited to event duration

**Use Cases:**
- Exhibition sales
- Pop-up stores
- Event sampling
- Temporary locations

---

### 10. 🎯 Event Manager (`EVENT_MANAGER`)
**Who:** Event Coordinator / Exhibition Manager

**Can Access:**
- ✅ All event staff permissions
- ✅ Event profitability reports
- ✅ Cost prices for events
- ✅ Manage event inventory
- ✅ Apply discounts
- ✅ Event performance analytics

**Restrictions:**
- ❌ Cannot access permanent locations
- ❌ Cannot modify head office data

**Use Cases:**
- Managing exhibitions
- Event profitability analysis
- Team coordination
- Inventory planning for events

---

### 11. 🔍 Auditor (`AUDITOR`)
**Who:** External Accountant / Compliance Officer

**Can Access:**
- ✅ Financial & inventory reports (READ-ONLY)
- ✅ Audit logs
- ✅ Compliance reports
- ✅ All historical data

**Restrictions:**
- ❌ Cannot edit or delete ANY data
- ❌ Cannot create transactions
- ❌ View-only access everywhere

**Use Cases:**
- Annual audits
- Compliance checks
- Financial reviews
- Regulatory reporting

---

## Granular Permissions

Each role has specific permissions that control access to features:

### Sales Permissions
- `pos:use` - Use POS terminal
- `pos:apply_discount` - Apply discounts to sales
- `sales:view_cost_price` - See cost prices and margins
- `sales:refund` - Process refunds

### Inventory Permissions
- `inventory:transfer` - Transfer stock between locations
- `inventory:adjust` - Adjust stock levels
- `inventory:waste` - Record wastage
- `inventory:sampling` - Record sampling

### Finance Permissions
- `finance:view_all` - View all financial data
- `finance:approve_payments` - Approve payment transactions
- `finance:profit_loss` - View P&L reports
- `finance:vat_filing` - Manage VAT filings

### Admin Permissions
- `admin:all` - Full administrative access
- `admin:override` - Override restrictions
- `settings:users` - Manage user accounts
- `settings:roles` - Assign roles

## Usage in Code

### In Components
```tsx
import { usePermissions } from '@/hooks/use-permissions';
import { Protected } from '@/components/auth/protected';

function SalesPage() {
  const { can, isAdmin } = usePermissions();

  return (
    <div>
      {/* Show cost price only to authorized roles */}
      <Protected permission="sales:view_cost_price">
        <div>Cost: AED {product.cost}</div>
      </Protected>

      {/* Show delete button only to admins */}
      {isAdmin && <DeleteButton />}

      {/* Conditional rendering */}
      {can('sales:refund') && <RefundButton />}
    </div>
  );
}
```

### In API Routes
```typescript
import { hasPermission } from '@/lib/permissions';

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!hasPermission(session.user.role, 'sales:create')) {
    return new Response('Forbidden', { status: 403 });
  }

  // Process sale...
}
```

## Database Schema

Roles are stored in the `UserRole` enum:

```prisma
enum UserRole {
  SUPER_ADMIN
  ADMIN
  SALES_STAFF
  INVENTORY_STAFF
  PRODUCTION_STAFF
  PROCUREMENT_OFFICER
  ACCOUNTANT
  HR_MANAGER
  EVENT_STAFF
  EVENT_MANAGER
  AUDITOR
  MANAGER  // Legacy
  OWNER    // Legacy
  USER     // Basic
}
```

## Best Practices

1. **Principle of Least Privilege**: Only grant the minimum permissions needed for a role
2. **Regular Audits**: Review user roles quarterly
3. **Separation of Duties**: No single user should have conflicting responsibilities
4. **Event Staff**: Always set expiration dates for temporary event accounts
5. **Auditor Access**: Grant only when needed, revoke after audit completion
6. **Testing**: Test permission changes in staging before production

## Migration Notes

Existing users with legacy roles (`OWNER`, `MANAGER`) will continue to work. New users should use the updated role system.

To migrate existing users:
```sql
UPDATE users SET role = 'SUPER_ADMIN' WHERE role = 'OWNER';
UPDATE users SET role = 'ADMIN' WHERE role = 'MANAGER';
```
