import * as bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-simple';
import { prisma } from '@/lib/database/prisma';
import { UserRole } from '@prisma/client';

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Higher = more secure but slower
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 * @param password - Plain text password
 * @param hash - Hashed password
 * @returns Boolean indicating if password is correct
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Get the current authenticated user session
 * @returns Session data or null
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

/**
 * Get the current user with full details from database
 * @returns User object or null
 */
export async function getCurrentUserDetails() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      stores: {
        include: {
          store: true,
        },
      },
    },
  });

  return user;
}

/**
 * Check if the current user has a specific role
 * @param allowedRoles - Array of allowed roles
 * @returns Boolean indicating if user has required role
 */
export async function hasRole(allowedRoles: UserRole[]): Promise<boolean> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return false;
  }

  return allowedRoles.includes(session.user.role as UserRole);
}

/**
 * Check if user is admin or owner
 * @returns Boolean indicating if user is admin/owner
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole(['OWNER', 'MANAGER']);
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized - Authentication required');
  }

  return user;
}

/**
 * Require specific role - throws error if user doesn't have role
 * @param allowedRoles - Array of allowed roles
 */
export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();
  const hasRequiredRole = await hasRole(allowedRoles);

  if (!hasRequiredRole) {
    throw new Error('Forbidden - Insufficient permissions');
  }

  return user;
}

/**
 * Generate a random secure password
 * @param length - Password length (default: 16)
 * @returns Random password
 */
export function generateRandomPassword(length: number = 16): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation result
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  // Minimum length
  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long');
  } else {
    score += 20;
  }

  // Contains lowercase
  if (/[a-z]/.test(password)) {
    score += 20;
  } else {
    feedback.push('Password should contain lowercase letters');
  }

  // Contains uppercase
  if (/[A-Z]/.test(password)) {
    score += 20;
  } else {
    feedback.push('Password should contain uppercase letters');
  }

  // Contains numbers
  if (/[0-9]/.test(password)) {
    score += 20;
  } else {
    feedback.push('Password should contain numbers');
  }

  // Contains special characters
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 20;
  } else {
    feedback.push('Password should contain special characters');
  }

  // Length bonus
  if (password.length >= 12) {
    score += 10;
  }

  const isValid = score >= 80;

  return {
    isValid,
    score: Math.min(score, 100),
    feedback,
  };
}

/**
 * Sanitize user data for safe display (remove sensitive fields)
 * @param user - User object from database
 * @returns Sanitized user object
 */
export function sanitizeUser(user: any) {
  const { password, emailVerified, lastLogin, ...safeUser } = user;
  return safeUser;
}
