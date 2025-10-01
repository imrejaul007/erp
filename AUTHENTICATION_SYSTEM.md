# Comprehensive Authentication & Role-Based Access Control System

## Overview

This document describes the comprehensive Authentication & Role-Based Access Control (RBAC) system implemented for the Perfume & Oud ERP system. The system is designed to meet UAE security standards and provide robust, scalable access control for a multi-store environment.

## System Architecture

### Core Components

1. **Authentication Services**
   - User registration and login
   - Password management and policies
   - Two-factor authentication (2FA)
   - Social login integration
   - Session management

2. **Authorization Framework**
   - Role-based access control (RBAC)
   - Permission-based access control
   - Multi-store access management
   - Conditional access controls

3. **Security Features**
   - Rate limiting and brute force protection
   - Audit logging and compliance
   - Data encryption and protection
   - IP whitelisting and geo-restrictions

4. **Multi-Language Support**
   - English and Arabic language support
   - Localized error messages and notifications
   - RTL support for Arabic interface

## Database Schema

### Enhanced User Model

```typescript
model User {
  id            String    @id @default(cuid())
  name          String?
  nameArabic    String?
  email         String    @unique
  emailVerified DateTime?
  phone         String?   @unique
  phoneVerified DateTime?
  username      String?   @unique
  image         String?
  role          UserRole  @default(USER)

  // Authentication fields
  password      String?
  passwordSetAt DateTime?
  lastLoginAt   DateTime?
  loginAttempts Int       @default(0)
  lockedUntil   DateTime?

  // Account status
  isActive      Boolean   @default(true)
  isVerified    Boolean   @default(false)
  isLocked      Boolean   @default(false)

  // Multi-language and location
  language      String    @default("en")
  timezone      String    @default("Asia/Dubai")
  country       String    @default("UAE")

  // Relations
  userRoles        UserRoleAssignment[]
  userStores       UserStore[]
  twoFactorAuth    TwoFactorAuth?
  // ... other relations
}
```

### Role-Based Access Control

```typescript
enum UserRole {
  OWNER         // Full system access
  ADMIN         // System administration
  MANAGER       // Store/regional management
  ACCOUNTANT    // Financial access
  SALES         // Sales operations
  INVENTORY     // Inventory management
  CUSTOMER      // Customer access
  USER          // Basic user access
}

model Role {
  id          String   @id @default(cuid())
  name        String   @unique
  displayName String
  displayNameArabic String?
  description String?
  permissions RolePermission[]
}

model Permission {
  id       String             @id @default(cuid())
  action   PermissionAction   // CREATE, READ, UPDATE, DELETE, etc.
  resource PermissionResource // USERS, PRODUCTS, ORDERS, etc.
}
```

## Authentication Features

### 1. User Registration & Login

- **Multiple Login Methods**: Email, phone, or username
- **Social Login**: Google and Apple integration
- **Account Verification**: Email/SMS verification required
- **Password Policies**: Configurable password requirements

```typescript
// Example usage
const authService = new AuthService();

// Register user
const result = await authService.registerUser({
  name: "John Doe",
  nameArabic: "جون دو",
  email: "john@example.com",
  password: "SecurePass123!",
  language: "en"
});

// Login user
const loginResult = await authService.authenticateUser({
  identifier: "john@example.com",
  password: "SecurePass123!",
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0..."
});
```

### 2. Two-Factor Authentication

- **Multiple Methods**: SMS, Email, Authenticator app
- **Backup Codes**: Emergency access codes
- **QR Code Generation**: For authenticator apps

```typescript
const twoFactorService = new TwoFactorService();

// Setup 2FA
const setupData = await twoFactorService.setup2FA(userId, 'AUTHENTICATOR');

// Verify and enable
const result = await twoFactorService.verify2FA(userId, verificationCode);
```

### 3. Password Management

- **Policy Enforcement**: Configurable password policies
- **History Tracking**: Prevents password reuse
- **Expiry Management**: Automatic password expiration
- **Strength Validation**: Real-time password strength checking

```typescript
const passwordService = new PasswordService();

// Validate password
const validation = await passwordService.validatePassword("newPassword123!", userId);

// Check if password is expired
const isExpired = await passwordService.isPasswordExpired(userId);
```

## Authorization Framework

### Role-Based Access Control (RBAC)

The system implements a comprehensive RBAC framework with the following hierarchy:

1. **Owner** - Full system access
2. **Admin** - System administration
3. **Manager** - Store/regional management
4. **Accountant** - Financial access
5. **Sales** - Sales operations
6. **Inventory** - Inventory management
7. **Customer** - Customer portal access
8. **User** - Basic system access

### Permission System

Granular permissions are defined using action-resource combinations:

```typescript
enum PermissionAction {
  CREATE, READ, UPDATE, DELETE, APPROVE, EXPORT, IMPORT, AUDIT
}

enum PermissionResource {
  USERS, ROLES, PRODUCTS, INVENTORY, ORDERS, CUSTOMERS,
  SUPPLIERS, REPORTS, FINANCIALS, SETTINGS, STORES, AUDIT_LOGS
}
```

### Multi-Store Access Control

- **Store Assignment**: Users can be assigned to specific stores
- **Cross-Store Access**: Configurable access across multiple stores
- **Default Store**: Each user has a default store context
- **Manager Hierarchy**: Regional and store-level management

```typescript
const storeService = new StoreService();

// Assign user to store
await storeService.assignUserToStore(userId, storeId, isDefault);

// Check store access
const hasAccess = await storeService.validateStoreAccess(userId, storeId);
```

## Security Features

### 1. Rate Limiting & Brute Force Protection

- **IP-Based Limiting**: Prevents brute force attacks
- **User-Based Limiting**: Per-user request limits
- **API Key Limiting**: Rate limits for API access
- **Progressive Delays**: Increasing delays for failed attempts

### 2. Audit Logging & Compliance

- **Comprehensive Logging**: All user actions are logged
- **UAE Compliance**: 7-year data retention policy
- **Security Monitoring**: Real-time security event detection
- **Compliance Reports**: Built-in compliance reporting

```typescript
const auditService = new AuditService();

// Log user action
await auditService.log({
  userId: "user123",
  action: "USER_LOGIN",
  resource: "auth",
  ipAddress: "192.168.1.1",
  metadata: { loginMethod: "credentials" }
});

// Get audit statistics
const stats = await auditService.getAuditStatistics({
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-12-31")
});
```

### 3. API Security

- **JWT Token Management**: Secure token-based authentication
- **API Key Authentication**: Alternative authentication method
- **Request Validation**: Input validation and sanitization
- **CORS Configuration**: Secure cross-origin requests

```typescript
const apiSecurityService = new APISecurityService();

// Generate JWT token
const token = apiSecurityService.generateJWT({
  userId: "user123",
  email: "user@example.com",
  role: "MANAGER",
  permissions: ["READ:PRODUCTS", "CREATE:ORDERS"],
  stores: ["store1", "store2"]
});

// Create API key
const apiKeyResult = await apiSecurityService.createAPIKey(userId, {
  name: "Mobile App Key",
  permissions: [{ action: "READ", resource: "PRODUCTS" }],
  rateLimit: 1000
});
```

## Middleware Security

The system includes comprehensive middleware for:

- **Route Protection**: Automatic route-based access control
- **Security Headers**: OWASP-recommended security headers
- **Content Security Policy**: XSS and injection protection
- **Rate Limiting**: Request throttling
- **IP Filtering**: Geographic and IP-based restrictions

```typescript
// Enhanced middleware with security features
export default withAuth(
  function middleware(req) {
    // Rate limiting
    // Role-based access control
    // Store-specific access
    // 2FA requirements for sensitive operations
    // Security headers
  }
);
```

## UAE Compliance Features

### Data Protection

- **Data Encryption**: All sensitive data encrypted at rest
- **Data Retention**: Configurable retention policies
- **Right to Deletion**: GDPR-style data deletion
- **Consent Management**: User consent tracking

### Audit & Compliance

- **Regulatory Compliance**: UAE Data Protection Law compliance
- **Audit Trail**: Complete audit trail for all operations
- **Regular Reports**: Automated compliance reports
- **Data Export**: Compliance data export functionality

```typescript
// UAE compliance features
const complianceReport = await auditService.getComplianceReport({
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-12-31"),
  storeId: "store123"
});

// Data retention cleanup
await auditService.cleanOldLogs();
```

## Multi-Language Support

### English and Arabic Support

- **RTL Layout**: Right-to-left layout for Arabic
- **Localized Messages**: All messages in both languages
- **Date/Time Formats**: Localized formatting
- **Currency Support**: Multi-currency support

```typescript
// Multi-language error messages
return {
  success: false,
  message: "Invalid credentials",
  messageArabic: "بيانات اعتماد غير صحيحة"
};
```

## API Endpoints

### Authentication Endpoints

```
POST /api/auth/signup          - User registration
POST /api/auth/verify          - Account verification
POST /api/auth/password/reset  - Password reset
POST /api/auth/2fa/setup       - Setup 2FA
POST /api/auth/2fa/verify      - Verify 2FA
```

### User Management Endpoints

```
GET    /api/users              - List users
POST   /api/users              - Create user
PUT    /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user
POST   /api/users/:id/roles    - Assign role
```

### Role Management Endpoints

```
GET    /api/roles              - List roles
POST   /api/roles              - Create role
PUT    /api/roles/:id          - Update role
DELETE /api/roles/:id          - Delete role
```

### Store Management Endpoints

```
GET    /api/stores             - List stores
POST   /api/stores             - Create store
PUT    /api/stores/:id         - Update store
POST   /api/stores/:id/users   - Assign users
```

## Installation & Setup

### 1. Database Setup

```bash
# Run Prisma migrations
npx prisma migrate dev

# Initialize default roles and permissions
npx prisma db seed
```

### 2. Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
APPLE_ID="..."
APPLE_SECRET="..."

# JWT
JWT_SECRET="your-jwt-secret"

# Notification Services
SENDGRID_API_KEY="..."
TWILIO_SID="..."
TWILIO_AUTH_TOKEN="..."
```

### 3. Initialize Default Data

```typescript
// Initialize roles and permissions
const rbacService = new RBACService();
await rbacService.initializeDefaultRoles();

// Create first admin user
const authService = new AuthService();
await authService.registerUser({
  name: "System Administrator",
  email: "admin@company.com",
  password: "SecureAdminPass123!",
  role: "ADMIN"
});
```

## Security Best Practices

### 1. Password Security

- Minimum 8 characters with complexity requirements
- Password history tracking (prevent reuse of last 5 passwords)
- Automatic password expiration (90 days default)
- Account lockout after 5 failed attempts

### 2. Session Security

- Secure session tokens
- Automatic session timeout (8 hours default)
- Session invalidation on password change
- Concurrent session management

### 3. API Security

- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- API key rotation policies

### 4. Monitoring & Alerting

- Failed login attempt monitoring
- Suspicious activity detection
- Real-time security alerts
- Regular security audits

## Testing

### Unit Tests

```bash
# Run authentication tests
npm run test auth

# Run RBAC tests
npm run test rbac

# Run security tests
npm run test security
```

### Integration Tests

```bash
# Run full authentication flow tests
npm run test:integration auth

# Run API security tests
npm run test:integration api
```

## Monitoring & Maintenance

### 1. Regular Tasks

- Password expiry notifications
- Audit log cleanup
- Session cleanup
- Rate limiting cleanup

### 2. Security Monitoring

- Failed login attempts
- Privilege escalations
- Unusual access patterns
- API abuse detection

### 3. Compliance Reporting

- Monthly access reports
- Annual compliance audits
- Data retention reviews
- Security incident reports

## Conclusion

This comprehensive authentication and RBAC system provides:

- ✅ Secure user authentication with multiple methods
- ✅ Granular role-based access control
- ✅ Multi-store access management
- ✅ UAE compliance and data protection
- ✅ Comprehensive audit logging
- ✅ Multi-language support (English/Arabic)
- ✅ Advanced security features
- ✅ Scalable architecture for growth

The system is designed to grow with your business while maintaining the highest security standards and regulatory compliance.