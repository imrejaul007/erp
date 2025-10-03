import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client with optimized configuration for production
 * - Connection pooling
 * - Query logging in development
 * - Graceful shutdown handling
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma client configuration
const prismaClientConfig = {
  log:
    process.env.NODE_ENV === 'development'
      ? [
          { level: 'query' as const, emit: 'event' as const },
          { level: 'error' as const, emit: 'stdout' as const },
          { level: 'warn' as const, emit: 'stdout' as const },
        ]
      : [{ level: 'error' as const, emit: 'stdout' as const }],
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient(prismaClientConfig);

// Log queries in development
if (process.env.NODE_ENV === 'development') {
  (prisma as any).$on('query', (e: any) => {
    if (e.duration > 1000) {
      // Log slow queries (>1s)
      console.warn(`⚠️  Slow query (${e.duration}ms): ${e.query}`);
    }
  });
}

// Cache in development to prevent hot-reload issues
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Graceful shutdown - disconnect Prisma on process exit
 */
const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

/**
 * Test database connection
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

/**
 * Get database connection info
 */
export async function getDatabaseInfo() {
  try {
    const result = await prisma.$queryRaw<Array<{ version: string }>>`
      SELECT version()
    `;
    return {
      connected: true,
      version: result[0]?.version || 'Unknown',
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}