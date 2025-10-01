import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/database/prisma';
import { UserRole } from '@prisma/client';
import { AuthService } from '@/lib/services/auth.service';
import { AuditService } from '@/lib/services/audit.service';
import { PasswordService } from '@/lib/services/password.service';

const authService = new AuthService();
const auditService = new AuditService();
const passwordService = new PasswordService();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        identifier: { label: 'Email/Phone/Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        twoFactorCode: { label: '2FA Code', type: 'text' },
      },
      async authorize(credentials, req) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        try {
          const result = await authService.authenticateUser({
            identifier: credentials.identifier,
            password: credentials.password,
            twoFactorCode: credentials.twoFactorCode,
            ipAddress: req?.headers?.['x-forwarded-for'] as string || req?.headers?.['x-real-ip'] as string || 'unknown',
            userAgent: req?.headers?.['user-agent'] || 'unknown',
          });

          if (result.success && result.user) {
            return {
              id: result.user.id,
              email: result.user.email,
              name: result.user.name,
              image: result.user.image,
              role: result.user.role,
              isActive: result.user.isActive,
              isVerified: result.user.isVerified,
              requires2FA: result.requires2FA,
            };
          }

          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (account && user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            userRoles: {
              include: {
                role: {
                  include: {
                    permissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
            userStores: {
              include: {
                store: true,
              },
            },
            twoFactorAuth: true,
            preferences: true,
          },
        });

        if (dbUser) {
          // Extract roles and permissions
          const roles = dbUser.userRoles
            .filter(ur => ur.isActive)
            .map(ur => ur.role.name);

          const permissions = dbUser.userRoles
            .filter(ur => ur.isActive)
            .flatMap(ur => ur.role.permissions)
            .map(rp => ({
              id: rp.permission.id,
              action: rp.permission.action,
              resource: rp.permission.resource,
              conditions: rp.conditions || rp.permission.conditions,
            }));

          const stores = dbUser.userStores
            .filter(us => us.canAccess)
            .map(us => us.storeId);

          const currentStore = dbUser.userStores.find(us => us.isDefault)?.storeId;

          token.role = dbUser.role;
          token.roles = roles;
          token.permissions = permissions;
          token.stores = stores;
          token.currentStore = currentStore;
          token.isActive = dbUser.isActive;
          token.isVerified = dbUser.isVerified;
          token.twoFactorEnabled = dbUser.twoFactorAuth?.isEnabled || false;
          token.language = dbUser.preferences?.language || dbUser.language;
          token.timezone = dbUser.preferences?.timezone || dbUser.timezone;

          // Update last login
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { lastLoginAt: new Date() },
          });

          // Log successful login
          await auditService.log({
            userId: dbUser.id,
            action: 'USER_LOGIN',
            ipAddress: token.ipAddress as string || 'unknown',
            userAgent: token.userAgent as string || 'unknown',
            metadata: {
              provider: account.provider,
              type: account.type,
            },
          });
        }
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        // Refresh user data when session is updated
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub! },
          include: {
            userRoles: {
              include: {
                role: {
                  include: {
                    permissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
            userStores: {
              include: {
                store: true,
              },
            },
            twoFactorAuth: true,
            preferences: true,
          },
        });

        if (dbUser) {
          const roles = dbUser.userRoles
            .filter(ur => ur.isActive)
            .map(ur => ur.role.name);

          const permissions = dbUser.userRoles
            .filter(ur => ur.isActive)
            .flatMap(ur => ur.role.permissions)
            .map(rp => ({
              id: rp.permission.id,
              action: rp.permission.action,
              resource: rp.permission.resource,
              conditions: rp.conditions || rp.permission.conditions,
            }));

          const stores = dbUser.userStores
            .filter(us => us.canAccess)
            .map(us => us.storeId);

          token.roles = roles;
          token.permissions = permissions;
          token.stores = stores;
          token.isActive = dbUser.isActive;
          token.isVerified = dbUser.isVerified;
          token.twoFactorEnabled = dbUser.twoFactorAuth?.isEnabled || false;
          token.language = dbUser.preferences?.language || dbUser.language;
          token.timezone = dbUser.preferences?.timezone || dbUser.timezone;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole;
        session.user.roles = token.roles as string[];
        session.user.permissions = token.permissions as any[];
        session.user.stores = token.stores as string[];
        session.user.currentStore = token.currentStore as string;
        session.user.isActive = token.isActive as boolean;
        session.user.isVerified = token.isVerified as boolean;
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean;
        session.user.language = token.language as string;
        session.user.timezone = token.timezone as string;
      }

      return session;
    },
    async signIn({ user, account, profile, credentials }) {
      // Check if user is active and allowed to sign in
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: {
            twoFactorAuth: true,
            securitySettings: true,
          },
        });

        if (!dbUser) {
          // For OAuth, create user if doesn't exist
          if (account?.provider !== 'credentials') {
            return true;
          }
          return false;
        }

        // Check if user is active
        if (!dbUser.isActive || dbUser.isLocked) {
          return false;
        }

        // Check if user is verified for credentials login
        if (account?.provider === 'credentials' && !dbUser.isVerified) {
          return '/auth/verify-email';
        }

        // Check if account is locked
        if (dbUser.lockedUntil && dbUser.lockedUntil > new Date()) {
          return false;
        }

        // Reset login attempts on successful login
        if (dbUser.loginAttempts > 0) {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              loginAttempts: 0,
              lockedUntil: null,
            },
          });
        }
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/welcome',
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
    updateAge: 60 * 60, // 1 hour
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signOut({ token }) {
      if (token?.sub) {
        // Log signout
        await auditService.log({
          userId: token.sub,
          action: 'USER_LOGOUT',
          ipAddress: 'unknown',
          userAgent: 'unknown',
        });

        // Deactivate user sessions
        await prisma.userSession.updateMany({
          where: {
            userId: token.sub,
            isActive: true,
          },
          data: {
            isActive: false,
          },
        });
      }
    },
    async createUser({ user }) {
      // Send welcome email or SMS
      if (user.email) {
        // TODO: Send welcome email
      }
    },
  },
};