import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/database/prisma';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "demo",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "demo",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        identifier: { label: 'Email/Phone/Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        try {
          // Accept both 'identifier' and 'email' for backwards compatibility
          const loginIdentifier = credentials.identifier || credentials.email;

          if (!loginIdentifier) {
            return null;
          }

          // Find user by email or phone with roles
          const user = await prisma.users.findFirst({
            where: {
              OR: [
                { email: loginIdentifier },
                { phone: loginIdentifier },
              ]
            },
            include: {
              user_roles: {
                include: {
                  roles: true
                }
              }
            }
          });

          // Verify user exists, is active, and has a password
          if (!user || !user.isActive || !user.password) {
            return null;
          }

          // Verify password using bcrypt
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Get user's role (use first role or default to 'USER')
          const userRole = user.user_roles && user.user_roles.length > 0
            ? user.user_roles[0].roles.name
            : 'USER';

          // Return user data (password excluded)
          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
            image: user.avatar || null,
            role: userRole,
            tenantId: user.tenantId,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        const dbUser = await prisma.users.findUnique({
          where: { id: user.id },
          include: {
            user_roles: {
              include: {
                roles: true
              }
            }
          }
        });

        if (dbUser) {
          // Get user's role from user_roles relationship
          const userRole = dbUser.user_roles && dbUser.user_roles.length > 0
            ? dbUser.user_roles[0].roles.name
            : 'USER';

          token.role = userRole;
          token.isActive = dbUser.isActive;
          token.tenantId = dbUser.tenantId;

          // Update last login
          await prisma.users.update({
            where: { id: dbUser.id },
            data: { lastLoginAt: new Date() },
          });
        }
      }

      // For credentials login, get tenantId and role from user object
      if (user && 'tenantId' in user) {
        token.tenantId = user.tenantId;
      }
      if (user && 'role' in user) {
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole;
        session.user.isActive = token.isActive as boolean;
        session.user.tenantId = token.tenantId as string | null;
      }

      return session;
    },
    async signIn({ user, account, profile, credentials }) {
      if (user?.email) {
        const dbUser = await prisma.users.findUnique({
          where: { email: user.email },
        });

        if (!dbUser && account?.provider !== 'credentials') {
          return true; // Allow OAuth users to be created
        }

        if (dbUser && !dbUser.isActive) {
          return false; // Block inactive users
        }
      }

      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  secret: process.env.NEXTAUTH_SECRET || "development-secret-key",
};