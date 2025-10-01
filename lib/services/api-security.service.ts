import { prisma } from '@/lib/database/prisma';
import { ApiKeyData, ApiKeyResponse, AuthResponse } from '@/types/auth';
import { randomBytes, createHash } from 'crypto';
import jwt from 'jsonwebtoken';
import { AuditService } from './audit.service';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  stores: string[];
  iat: number;
  exp: number;
}

interface RateLimitData {
  count: number;
  resetTime: number;
}

export class APISecurityService {
  private auditService: AuditService;
  private rateLimitStore: Map<string, RateLimitData> = new Map();

  constructor() {
    this.auditService = new AuditService();
    this.startCleanupInterval();
  }

  /**
   * Generate JWT token
   */
  generateJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>, expiresIn: string = '8h'): string {
    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET!;

    return jwt.sign(payload, secret, {
      expiresIn,
      issuer: 'oud-pms',
      audience: 'oud-pms-api',
    });
  }

  /**
   * Verify JWT token
   */
  verifyJWT(token: string): JWTPayload | null {
    try {
      const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET!;

      const decoded = jwt.verify(token, secret, {
        issuer: 'oud-pms',
        audience: 'oud-pms-api',
      }) as JWTPayload;

      return decoded;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  /**
   * Refresh JWT token
   */
  async refreshJWT(token: string): Promise<{ token: string; refreshToken: string } | null> {
    const decoded = this.verifyJWT(token);
    if (!decoded) return null;

    // Check if user is still active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        userRoles: {
          where: { isActive: true },
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
        userStores: {
          where: { canAccess: true },
        },
      },
    });

    if (!user || !user.isActive) return null;

    // Generate new tokens
    const permissions = user.userRoles
      .flatMap(ur => ur.role.permissions)
      .map(rp => `${rp.permission.action}:${rp.permission.resource}`);

    const stores = user.userStores.map(us => us.storeId);

    const newToken = this.generateJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions,
      stores,
    });

    const refreshToken = this.generateJWT(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        permissions,
        stores,
      },
      '7d'
    );

    return { token: newToken, refreshToken };
  }

  /**
   * Create API key
   */
  async createAPIKey(userId: string, keyData: ApiKeyData): Promise<AuthResponse & { apiKey?: ApiKeyResponse }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
          messageArabic: 'المستخدم غير موجود',
        };
      }

      // Generate API key
      const keyString = this.generateAPIKeyString();
      const keyHash = this.hashAPIKey(keyString);

      // Store API key
      const apiKey = await prisma.apiKey.create({
        data: {
          userId,
          name: keyData.name,
          keyHash,
          permissions: keyData.permissions,
          expiresAt: keyData.expiresAt,
          rateLimit: keyData.rateLimit || 1000,
        },
      });

      // Log API key creation
      await this.auditService.log({
        userId,
        action: 'USER_CREATE',
        resource: 'api_keys',
        resourceId: apiKey.id,
        metadata: { name: keyData.name },
        ipAddress: 'unknown',
        userAgent: 'unknown',
      });

      return {
        success: true,
        message: 'API key created successfully',
        messageArabic: 'تم إنشاء مفتاح API بنجاح',
        apiKey: {
          id: apiKey.id,
          name: apiKey.name,
          key: keyString, // Only returned on creation
          keyPreview: this.maskAPIKey(keyString),
          permissions: keyData.permissions,
          expiresAt: apiKey.expiresAt,
          rateLimit: apiKey.rateLimit,
          isActive: apiKey.isActive,
          createdAt: apiKey.createdAt,
        },
      };
    } catch (error) {
      console.error('Create API key error:', error);
      return {
        success: false,
        message: 'Failed to create API key',
        messageArabic: 'فشل في إنشاء مفتاح API',
      };
    }
  }

  /**
   * Verify API key
   */
  async verifyAPIKey(keyString: string): Promise<{
    isValid: boolean;
    userId?: string;
    permissions?: any[];
    rateLimit?: number;
  }> {
    try {
      const keyHash = this.hashAPIKey(keyString);

      const apiKey = await prisma.apiKey.findUnique({
        where: { keyHash },
        include: {
          user: {
            select: {
              id: true,
              isActive: true,
            },
          },
        },
      });

      if (!apiKey || !apiKey.isActive || !apiKey.user.isActive) {
        return { isValid: false };
      }

      // Check expiry
      if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
        return { isValid: false };
      }

      // Update last used
      await prisma.apiKey.update({
        where: { id: apiKey.id },
        data: { lastUsed: new Date() },
      });

      return {
        isValid: true,
        userId: apiKey.userId,
        permissions: apiKey.permissions as any[],
        rateLimit: apiKey.rateLimit,
      };
    } catch (error) {
      console.error('API key verification error:', error);
      return { isValid: false };
    }
  }

  /**
   * Revoke API key
   */
  async revokeAPIKey(keyId: string, revokedBy: string): Promise<AuthResponse> {
    try {
      const apiKey = await prisma.apiKey.findUnique({
        where: { id: keyId },
      });

      if (!apiKey) {
        return {
          success: false,
          message: 'API key not found',
          messageArabic: 'مفتاح API غير موجود',
        };
      }

      await prisma.apiKey.update({
        where: { id: keyId },
        data: { isActive: false },
      });

      // Log API key revocation
      await this.auditService.log({
        userId: revokedBy,
        action: 'USER_DELETE',
        resource: 'api_keys',
        resourceId: keyId,
        metadata: { name: apiKey.name, action: 'revoked' },
        ipAddress: 'unknown',
        userAgent: 'unknown',
      });

      return {
        success: true,
        message: 'API key revoked successfully',
        messageArabic: 'تم إلغاء مفتاح API بنجاح',
      };
    } catch (error) {
      console.error('Revoke API key error:', error);
      return {
        success: false,
        message: 'Failed to revoke API key',
        messageArabic: 'فشل في إلغاء مفتاح API',
      };
    }
  }

  /**
   * Get user API keys
   */
  async getUserAPIKeys(userId: string): Promise<ApiKeyResponse[]> {
    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiKeys.map(key => ({
      id: key.id,
      name: key.name,
      key: '', // Never return actual key
      keyPreview: `${key.keyHash.substring(0, 8)}...`,
      permissions: key.permissions as any[],
      expiresAt: key.expiresAt,
      rateLimit: key.rateLimit,
      lastUsed: key.lastUsed,
      isActive: key.isActive,
      createdAt: key.createdAt,
    }));
  }

  /**
   * Rate limiting check
   */
  async checkRateLimit(
    key: string,
    limit: number,
    windowMs: number = 60 * 60 * 1000 // 1 hour
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    const now = Date.now();
    const data = this.rateLimitStore.get(key);

    if (!data || now > data.resetTime) {
      // New window or expired
      const resetTime = now + windowMs;
      this.rateLimitStore.set(key, { count: 1, resetTime });
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime,
      };
    }

    if (data.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: data.resetTime,
      };
    }

    // Increment count
    data.count++;
    this.rateLimitStore.set(key, data);

    return {
      allowed: true,
      remaining: limit - data.count,
      resetTime: data.resetTime,
    };
  }

  /**
   * IP-based rate limiting
   */
  async checkIPRateLimit(
    ipAddress: string,
    limit: number = 1000,
    windowMs: number = 60 * 60 * 1000
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    return this.checkRateLimit(`ip:${ipAddress}`, limit, windowMs);
  }

  /**
   * User-based rate limiting
   */
  async checkUserRateLimit(
    userId: string,
    limit: number = 5000,
    windowMs: number = 60 * 60 * 1000
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    return this.checkRateLimit(`user:${userId}`, limit, windowMs);
  }

  /**
   * API key-based rate limiting
   */
  async checkAPIKeyRateLimit(
    keyHash: string,
    limit: number,
    windowMs: number = 60 * 60 * 1000
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    return this.checkRateLimit(`apikey:${keyHash}`, limit, windowMs);
  }

  /**
   * Clean expired rate limit data
   */
  private startCleanupInterval(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, data] of this.rateLimitStore.entries()) {
        if (now > data.resetTime) {
          this.rateLimitStore.delete(key);
        }
      }
    }, 5 * 60 * 1000); // Clean every 5 minutes
  }

  /**
   * Validate API request permissions
   */
  validateAPIPermissions(
    userPermissions: any[],
    requiredAction: string,
    requiredResource: string
  ): boolean {
    const permissionString = `${requiredAction}:${requiredResource}`;
    return userPermissions.some(permission => {
      if (typeof permission === 'string') {
        return permission === permissionString;
      }
      return `${permission.action}:${permission.resource}` === permissionString;
    });
  }

  /**
   * Log API access
   */
  async logAPIAccess(params: {
    userId?: string;
    method: string;
    endpoint: string;
    ipAddress: string;
    userAgent?: string;
    statusCode: number;
    responseTime: number;
    apiKeyId?: string;
  }): Promise<void> {
    await this.auditService.log({
      userId: params.userId,
      action: 'SENSITIVE_DATA_ACCESS',
      resource: 'api',
      metadata: {
        method: params.method,
        endpoint: params.endpoint,
        statusCode: params.statusCode,
        responseTime: params.responseTime,
        apiKeyId: params.apiKeyId,
      },
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      severity: params.statusCode >= 400 ? 'WARN' : 'INFO',
    });
  }

  /**
   * Get API usage statistics
   */
  async getAPIUsageStatistics(options: {
    startDate?: Date;
    endDate?: Date;
    userId?: string;
  } = {}) {
    const { startDate, endDate, userId } = options;

    const where: any = {
      action: 'SENSITIVE_DATA_ACCESS',
      resource: 'api',
    };

    if (userId) where.userId = userId;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [
      totalRequests,
      requestsByUser,
      requestsByEndpoint,
      requestsByStatus,
      averageResponseTime,
    ] = await Promise.all([
      // Total requests
      prisma.auditLog.count({ where }),

      // Requests by user
      prisma.auditLog.groupBy({
        by: ['userId'],
        where: { ...where, userId: { not: null } },
        _count: true,
        orderBy: { _count: { userId: 'desc' } },
        take: 10,
      }),

      // Requests by endpoint
      prisma.auditLog.groupBy({
        by: ['metadata'],
        where,
        _count: true,
        orderBy: { _count: { metadata: 'desc' } },
        take: 10,
      }),

      // Requests by status code
      prisma.auditLog.findMany({
        where,
        select: { metadata: true },
      }),

      // Average response time
      prisma.auditLog.findMany({
        where,
        select: { metadata: true },
      }),
    ]);

    // Process status codes and response times
    const statusCodes: Record<string, number> = {};
    let totalResponseTime = 0;
    let responseTimeCount = 0;

    requestsByStatus.forEach(log => {
      const metadata = log.metadata as any;
      if (metadata?.statusCode) {
        const code = metadata.statusCode.toString();
        statusCodes[code] = (statusCodes[code] || 0) + 1;
      }
      if (metadata?.responseTime) {
        totalResponseTime += metadata.responseTime;
        responseTimeCount++;
      }
    });

    return {
      totalRequests,
      requestsByUser: requestsByUser.map(r => ({
        userId: r.userId,
        count: r._count,
      })),
      requestsByEndpoint: requestsByEndpoint.map(r => ({
        endpoint: (r.metadata as any)?.endpoint || 'unknown',
        count: r._count,
      })),
      statusCodes,
      averageResponseTime: responseTimeCount > 0 ? totalResponseTime / responseTimeCount : 0,
    };
  }

  // Private helper methods

  private generateAPIKeyString(): string {
    return 'oup_' + randomBytes(32).toString('hex');
  }

  private hashAPIKey(key: string): string {
    return createHash('sha256').update(key).digest('hex');
  }

  private maskAPIKey(key: string): string {
    if (key.length <= 12) return key;
    return key.substring(0, 12) + '...';
  }
}