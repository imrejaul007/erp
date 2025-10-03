import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Security headers configuration for production
 * Protects against common web vulnerabilities
 */

export interface SecurityConfig {
  contentSecurityPolicy?: boolean;
  strictTransportSecurity?: boolean;
  xFrameOptions?: boolean;
  xContentTypeOptions?: boolean;
  referrerPolicy?: boolean;
  permissionsPolicy?: boolean;
}

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(
  response: NextResponse,
  config: SecurityConfig = {}
): NextResponse {
  const {
    contentSecurityPolicy = true,
    strictTransportSecurity = true,
    xFrameOptions = true,
    xContentTypeOptions = true,
    referrerPolicy = true,
    permissionsPolicy = true,
  } = config;

  // Content Security Policy (CSP)
  if (contentSecurityPolicy) {
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-inline/eval in dev
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https:",
        "font-src 'self' data:",
        "connect-src 'self' https:",
        "frame-ancestors 'self'",
      ].join('; ')
    );
  }

  // HTTP Strict Transport Security (HSTS)
  if (strictTransportSecurity && process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Prevent clickjacking
  if (xFrameOptions) {
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  }

  // Prevent MIME type sniffing
  if (xContentTypeOptions) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
  }

  // Referrer Policy
  if (referrerPolicy) {
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  }

  // Permissions Policy (formerly Feature Policy)
  if (permissionsPolicy) {
    response.headers.set(
      'Permissions-Policy',
      [
        'camera=()',
        'microphone=()',
        'geolocation=()',
        'payment=()',
      ].join(', ')
    );
  }

  // Additional security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');

  return response;
}

/**
 * CORS configuration helper
 */
export function applyCorsHeaders(
  response: NextResponse,
  allowedOrigins: string[] = [],
  allowedMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: string[] = ['Content-Type', 'Authorization']
): NextResponse {
  const origin = allowedOrigins.length > 0 ? allowedOrigins.join(', ') : '*';

  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', allowedMethods.join(', '));
  response.headers.set('Access-Control-Allow-Headers', allowedHeaders.join(', '));
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  return response;
}

/**
 * Validate request origin
 */
export function isValidOrigin(request: NextRequest, allowedOrigins: string[]): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // Same-origin requests don't send Origin header

  return allowedOrigins.includes(origin);
}

/**
 * Generate nonce for inline scripts (CSP)
 */
export function generateNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString('base64');
}

/**
 * Sanitize header value to prevent header injection
 */
export function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]/g, '');
}
