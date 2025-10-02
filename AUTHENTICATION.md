# Authentication System Documentation

## Overview

The Oud Perfume ERP system uses NextAuth.js v4 for authentication with PostgreSQL database backend via Prisma ORM.

## Features

### Core Authentication
- ✅ Email/Phone/Username login with bcrypt password hashing
- ✅ Google OAuth integration (configurable)
- ✅ Session-based JWT authentication
- ✅ Secure password validation with strength checking
- ✅ Role-based access control (RBAC)
- ✅ Multi-store access management

### Security Features
- ✅ bcrypt password hashing (12 salt rounds)
- ✅ Rate limiting (100 req/min per IP, 500 req/min per user)
- ✅ Security headers (CSP, HSTS, X-Frame-Options, etc.)
- ✅ Inactive account blocking
- ✅ Last login tracking
- ✅ 2FA support (optional for sensitive operations)

### Role-Based Access
- **OWNER**: Full system access
- **MANAGER**: Store management, reports, analytics
- **ACCOUNTANT**: Financial reports, purchasing
- **SALES_STAFF**: POS, CRM, inventory viewing
- **INVENTORY_STAFF**: Inventory management, purchasing
- **USER**: Basic dashboard access

## Setup

### 1. Environment Variables

Update your `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/oud_perfume_erp"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 2. Generate NextAuth Secret

```bash
# Generate a secure secret
openssl rand -base64 32
```

### 3. Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with default admin user
npm run db:seed
```

## Default Credentials

After seeding, you can login with:

**Email**: `admin@oudpalace.ae`
**Password**: `admin123`

**⚠️ IMPORTANT**: Change this password immediately in production!

## Usage

### Client-Side Authentication

```typescript
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Component() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <button onClick={() => signIn()}>Sign In</button>;
  }

  return (
    <div>
      <p>Welcome, {session.user.name}!</p>
      <p>Role: {session.user.role}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

### Server-Side Authentication

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-simple';
import { requireAuth, requireRole } from '@/lib/auth-utils';

// Get current user
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  return Response.json({ user: session.user });
}

// Require authentication
export async function POST() {
  const user = await requireAuth(); // Throws if not authenticated

  // Your protected code here
}

// Require specific role
export async function DELETE() {
  const user = await requireRole(['OWNER', 'MANAGER']); // Throws if insufficient permissions

  // Your protected code here
}
```

### API Routes Protection

```typescript
import { requireAuth, requireRole } from '@/lib/auth-utils';

export async function POST(req: Request) {
  try {
    // Require authentication
    const user = await requireAuth();

    // Require admin role
    if (req.url.includes('/admin/')) {
      await requireRole(['OWNER', 'MANAGER']);
    }

    // Your protected API logic here
    return Response.json({ success: true });

  } catch (error) {
    if (error.message.includes('Unauthorized')) {
      return new Response('Unauthorized', { status: 401 });
    }
    if (error.message.includes('Forbidden')) {
      return new Response('Forbidden', { status: 403 });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}
```

### User Registration

```typescript
import { hashPassword, validatePasswordStrength } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';

export async function registerUser(data: {
  email: string;
  password: string;
  name: string;
  phone?: string;
}) {
  // Validate password strength
  const { isValid, feedback } = validatePasswordStrength(data.password);

  if (!isValid) {
    throw new Error(`Weak password: ${feedback.join(', ')}`);
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      phone: data.phone,
      role: 'USER',
      isActive: true,
    },
  });

  return user;
}
```

### Password Reset

```typescript
import { hashPassword } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';

export async function resetPassword(userId: string, newPassword: string) {
  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}
```

## Middleware Protection

The system includes comprehensive middleware protection in `middleware.ts`:

- **Rate Limiting**: 100 req/min per IP, 500 req/min per user
- **Security Headers**: CSP, HSTS, X-Frame-Options, etc.
- **Route Protection**: Automatic redirect to signin for unauthenticated users
- **Role-Based Access**: Blocks access to unauthorized routes
- **Store-Level Access**: Restricts access to specific stores

### Public Routes

These routes are accessible without authentication:
- `/` - Home page
- `/auth/*` - All authentication pages
- `/about` - About page
- `/contact` - Contact page

### Protected Routes

All other routes require authentication. Additional role requirements:

- `/dashboard/admin/*` - Requires OWNER or ADMIN
- `/dashboard/analytics/*` - Requires OWNER, ADMIN, or MANAGER
- `/dashboard/inventory/*` - Requires OWNER, ADMIN, MANAGER, or INVENTORY
- `/dashboard/financial/*` - Requires OWNER, ADMIN, MANAGER, or ACCOUNTANT

## Helper Functions

### Password Management

```typescript
// Hash a password
const hashed = await hashPassword('myPassword123');

// Verify a password
const isValid = await verifyPassword('myPassword123', hashed);

// Validate password strength
const { isValid, score, feedback } = validatePasswordStrength('weak');
// { isValid: false, score: 40, feedback: ['Add uppercase', 'Add numbers'] }

// Generate random secure password
const randomPassword = generateRandomPassword(16);
```

### User Session

```typescript
// Get current user (minimal data)
const user = await getCurrentUser();

// Get current user with full details
const userDetails = await getCurrentUserDetails();

// Check if user has role
const isManager = await hasRole(['OWNER', 'MANAGER']);

// Check if user is admin
const isAdminUser = await isAdmin();

// Sanitize user data (remove sensitive fields)
const safeUser = sanitizeUser(user);
```

## Testing Authentication

### 1. Test Login

Navigate to http://localhost:3000/auth/signin

### 2. Test Protected Routes

Try accessing http://localhost:3000/dashboard without logging in - should redirect to signin.

### 3. Test Role-Based Access

Login as different users with different roles and verify access restrictions.

### 4. Test Password Strength

```typescript
import { validatePasswordStrength } from '@/lib/auth-utils';

console.log(validatePasswordStrength('weak'));
// { isValid: false, score: 40, feedback: [...] }

console.log(validatePasswordStrength('StrongP@ssw0rd123'));
// { isValid: true, score: 100, feedback: [] }
```

## Production Deployment

### Security Checklist

- [ ] Change default admin password
- [ ] Set strong NEXTAUTH_SECRET (use `openssl rand -base64 32`)
- [ ] Enable HTTPS only
- [ ] Configure proper CORS settings
- [ ] Set up database backups
- [ ] Enable 2FA for admin accounts
- [ ] Configure rate limiting in production
- [ ] Set up monitoring and alerts
- [ ] Review and update security headers
- [ ] Enable audit logging
- [ ] Configure OAuth providers (if using)

### Environment Variables

```env
# Production
NODE_ENV="production"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-super-secure-secret-here"
DATABASE_URL="postgresql://user:pass@host:5432/db"

# OAuth (optional)
GOOGLE_CLIENT_ID="prod-client-id"
GOOGLE_CLIENT_SECRET="prod-client-secret"
```

## Troubleshooting

### "Unauthorized" Error
- Verify NextAuth configuration in `.env.local`
- Check if user exists in database
- Verify password is correct
- Check if user account is active

### "Forbidden" Error
- User doesn't have required role
- User trying to access restricted store
- 2FA not enabled for sensitive operations

### Session Not Persisting
- Check NEXTAUTH_URL matches your domain
- Verify cookies are enabled
- Check session configuration in authOptions

### Rate Limit Errors
- Wait for rate limit window to reset
- Check if IP is being blocked
- Verify rate limiter configuration

## API Reference

### Auth Endpoints

- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session
- `GET /api/auth/csrf` - Get CSRF token
- `POST /api/auth/callback/google` - Google OAuth callback

### Custom Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/verify` - Verify email
- `POST /api/auth/password/reset` - Reset password

## Support

For issues or questions:
1. Check this documentation
2. Review the code in `/lib/auth-simple.ts` and `/lib/auth-utils.ts`
3. Check Next Auth.js docs: https://next-auth.js.org/
4. Contact your system administrator
