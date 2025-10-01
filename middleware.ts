import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter for middleware
class SimpleRateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();

  check(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const data = this.requests.get(key);

    if (!data || now > data.resetTime) {
      const resetTime = now + windowMs;
      this.requests.set(key, { count: 1, resetTime });
      return { allowed: true, remaining: limit - 1, resetTime };
    }

    if (data.count >= limit) {
      return { allowed: false, remaining: 0, resetTime: data.resetTime };
    }

    data.count++;
    this.requests.set(key, data);
    return { allowed: true, remaining: limit - data.count, resetTime: data.resetTime };
  }

  cleanup() {
    const now = Date.now();
    for (const [key, data] of this.requests.entries()) {
      if (now > data.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

const rateLimiter = new SimpleRateLimiter();

// Cleanup rate limiter every 5 minutes
setInterval(() => {
  rateLimiter.cleanup();
}, 5 * 60 * 1000);

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const pathname = req.nextUrl.pathname;
    const isAPIRoute = pathname.startsWith('/api/');

    // Get IP address for rate limiting
    const ip = req.ip || req.headers.get('X-Forwarded-For') || req.headers.get('X-Real-IP') || 'unknown';

    try {
      // Rate limiting for API routes
      if (isAPIRoute) {
        const ipLimit = rateLimiter.check(`ip:${ip}`, 100, 60 * 1000); // 100 requests per minute per IP
        if (!ipLimit.allowed) {
          return new NextResponse('Too Many Requests', {
            status: 429,
            headers: {
              'X-RateLimit-Limit': '100',
              'X-RateLimit-Remaining': ipLimit.remaining.toString(),
              'X-RateLimit-Reset': new Date(ipLimit.resetTime).toISOString(),
              'Retry-After': Math.ceil((ipLimit.resetTime - Date.now()) / 1000).toString(),
            },
          });
        }

        // User-based rate limiting if authenticated
        if (token?.sub) {
          const userLimit = rateLimiter.check(`user:${token.sub}`, 500, 60 * 1000); // 500 requests per minute per user
          if (!userLimit.allowed) {
            return new NextResponse('Too Many Requests', {
              status: 429,
              headers: {
                'X-RateLimit-Limit': '500',
                'X-RateLimit-Remaining': userLimit.remaining.toString(),
                'X-RateLimit-Reset': new Date(userLimit.resetTime).toISOString(),
              },
            });
          }
        }

        // API Key authentication check
        const authHeader = req.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer oup_')) {
          // This would normally validate against database, but for now we'll allow it
          // In production, you'd verify the API key here
        }
      }

      // Public routes that don't require authentication
      const publicRoutes = [
        '/',
        '/auth/signin',
        '/auth/signup',
        '/auth/reset-password',
        '/auth/verify-email',
        '/auth/error',
        '/auth/verify-request',
        '/auth/welcome',
        '/api/auth',
        '/about',
        '/contact',
      ];

      // Check if the current path is public
      const isPublicRoute = publicRoutes.some((route) =>
        pathname.startsWith(route)
      );

      // If not authenticated and trying to access protected route
      if (!isAuth && !isPublicRoute) {
        if (isAPIRoute) {
          return new NextResponse('Unauthorized', { status: 401 });
        }
        const signInUrl = new URL('/auth/signin', req.url);
        signInUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(signInUrl);
      }

      // If authenticated but account is inactive
      if (isAuth && !token?.isActive && !pathname.startsWith('/auth/')) {
        if (isAPIRoute) {
          return new NextResponse('Account Inactive', { status: 403 });
        }
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }

      // If authenticated but not verified for protected routes
      if (isAuth && pathname.startsWith('/dashboard') && !token?.isVerified) {
        if (isAPIRoute) {
          return new NextResponse('Account Not Verified', { status: 403 });
        }
        return NextResponse.redirect(new URL('/auth/verify-email', req.url));
      }

      // Enhanced role-based access control
      if (isAuth && token) {
        const userRole = token.role as string;
        const userRoles = token.roles as string[] || [];
        const userPermissions = token.permissions as any[] || [];
        const userStores = token.stores as string[] || [];

        // Owner/Admin routes - highest level access
        const ownerRoutes = ['/dashboard/admin', '/dashboard/system'];
        if (ownerRoutes.some(route => pathname.startsWith(route))) {
          if (!['OWNER', 'ADMIN'].includes(userRole)) {
            if (isAPIRoute) {
              return new NextResponse('Forbidden', { status: 403 });
            }
            return NextResponse.redirect(new URL('/dashboard', req.url));
          }
        }

        // Manager routes - management level access
        const managerRoutes = ['/dashboard/analytics', '/dashboard/reports', '/dashboard/users'];
        if (managerRoutes.some(route => pathname.startsWith(route))) {
          if (!['OWNER', 'ADMIN', 'MANAGER'].includes(userRole)) {
            if (isAPIRoute) {
              return new NextResponse('Forbidden', { status: 403 });
            }
            return NextResponse.redirect(new URL('/dashboard', req.url));
          }
        }

        // Inventory management - specific roles only
        if (pathname.startsWith('/dashboard/inventory') || pathname.startsWith('/api/inventory')) {
          if (!['OWNER', 'ADMIN', 'MANAGER', 'INVENTORY'].includes(userRole)) {
            if (isAPIRoute) {
              return new NextResponse('Forbidden', { status: 403 });
            }
            return NextResponse.redirect(new URL('/dashboard', req.url));
          }
        }

        // Financial routes - accounting access
        if (pathname.startsWith('/dashboard/financial') || pathname.startsWith('/api/financial')) {
          if (!['OWNER', 'ADMIN', 'MANAGER', 'ACCOUNTANT'].includes(userRole)) {
            if (isAPIRoute) {
              return new NextResponse('Forbidden', { status: 403 });
            }
            return NextResponse.redirect(new URL('/dashboard', req.url));
          }
        }

        // Store-specific access control
        const storeMatch = pathname.match(/\/dashboard\/store\/([^\/]+)/);
        if (storeMatch) {
          const storeId = storeMatch[1];
          if (!['OWNER', 'ADMIN'].includes(userRole) && !userStores.includes(storeId)) {
            if (isAPIRoute) {
              return new NextResponse('Store Access Denied', { status: 403 });
            }
            return NextResponse.redirect(new URL('/dashboard/unauthorized', req.url));
          }
        }

        // 2FA requirement for sensitive operations
        const sensitive2FARoutes = [
          '/dashboard/admin/users',
          '/dashboard/admin/roles',
          '/dashboard/admin/security',
          '/api/admin',
          '/api/users',
          '/api/roles',
        ];

        if (sensitive2FARoutes.some(route => pathname.startsWith(route))) {
          if (!token.twoFactorEnabled) {
            if (isAPIRoute) {
              return new NextResponse('Two-Factor Authentication Required', { status: 403 });
            }
            return NextResponse.redirect(new URL('/dashboard/security/2fa-setup', req.url));
          }
        }
      }

      // Create response with security headers
      const response = NextResponse.next();

      // Security headers
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

      // HSTS for HTTPS
      if (req.nextUrl.protocol === 'https:') {
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      }

      // CSP for non-API routes
      if (!isAPIRoute) {
        const csp = [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://www.googletagmanager.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: blob: https:",
          "connect-src 'self' https:",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; ');

        response.headers.set('Content-Security-Policy', csp);
      }

      return response;

    } catch (error) {
      console.error('Middleware error:', error);

      if (isAPIRoute) {
        return new NextResponse('Internal Server Error', { status: 500 });
      }

      return NextResponse.redirect(new URL('/error', req.url));
    }
  },
  {
    callbacks: {
      authorized: () => true, // Let the middleware function handle authorization
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};