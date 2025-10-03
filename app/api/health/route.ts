import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { getRateLimitStatus } from '@/lib/rateLimit';
import { PerformanceMonitor } from '@/lib/requestLogger';

/**
 * Health check endpoint for production monitoring
 * No authentication required - used by load balancers and monitoring services
 *
 * Returns:
 * - 200: All systems operational
 * - 503: Service unavailable (database down)
 */

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    database: {
      status: 'up' | 'down';
      responseTime?: number;
      error?: string;
    };
    rateLimit: {
      status: 'operational';
      activeIdentifiers: number;
    };
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  };
  performance?: {
    slowestEndpoints: Array<{
      path: string;
      avgDuration: number;
      maxDuration: number;
      requestCount: number;
    }>;
  };
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  // Database health check
  let databaseStatus: HealthCheckResponse['checks']['database'] = {
    status: 'down',
  };

  try {
    const dbCheckStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - dbCheckStart;

    databaseStatus = {
      status: 'up',
      responseTime,
    };
  } catch (error) {
    databaseStatus = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  // Rate limiter status
  const rateLimitStatus = getRateLimitStatus();

  // Memory usage
  const memUsage = process.memoryUsage();
  const memoryStatus = {
    used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
    total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
    percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
  };

  // Performance metrics
  const perfStats = PerformanceMonitor.getAllStats();
  const slowestEndpoints = Object.entries(perfStats)
    .map(([path, stats]) => ({
      path,
      avgDuration: stats ? Math.round(stats.avg) : 0,
      maxDuration: stats ? stats.max : 0,
      requestCount: stats ? stats.count : 0,
    }))
    .filter(stat => stat.avgDuration > 0)
    .sort((a, b) => b.avgDuration - a.avgDuration)
    .slice(0, 10);

  // Determine overall status
  let overallStatus: HealthCheckResponse['status'] = 'healthy';
  if (databaseStatus.status === 'down') {
    overallStatus = 'unhealthy';
  } else if (memoryStatus.percentage > 90) {
    overallStatus = 'degraded';
  }

  const response: HealthCheckResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: databaseStatus,
      rateLimit: {
        status: 'operational',
        activeIdentifiers: rateLimitStatus.totalIdentifiers,
      },
      memory: memoryStatus,
    },
    performance: {
      slowestEndpoints,
    },
  };

  // Return 503 if unhealthy, 200 otherwise
  const statusCode = overallStatus === 'unhealthy' ? 503 : 200;

  return NextResponse.json(response, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Response-Time': `${Date.now() - startTime}ms`,
    },
  });
}

/**
 * Detailed health check with extended diagnostics
 * Used for internal monitoring and debugging
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  // Run all health checks from GET
  const basicHealth = await GET(request);
  const basicData = await basicHealth.json();

  // Additional detailed checks
  const detailedChecks = {
    ...basicData,
    detailed: {
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      database: {
        connectionPool: {
          // Prisma connection pool info would go here
          // This is a placeholder for actual pool metrics
          status: 'active',
        },
      },
      process: {
        pid: process.pid,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
      },
    },
  };

  return NextResponse.json(detailedChecks, {
    status: basicData.status === 'unhealthy' ? 503 : 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Response-Time': `${Date.now() - startTime}ms`,
    },
  });
}
