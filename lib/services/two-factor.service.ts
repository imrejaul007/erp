import { prisma } from '@/lib/database/prisma';
import { TwoFactorSetupData, AuthResponse } from '@/types/auth';
import { TwoFactorMethod } from '@prisma/client';
import { authenticator } from 'otplib';
import { randomBytes } from 'crypto';
import QRCode from 'qrcode';
import { NotificationService } from './notification.service';
import { AuditService } from './audit.service';

export class TwoFactorService {
  private notificationService: NotificationService;
  private auditService: AuditService;

  constructor() {
    this.notificationService = new NotificationService();
    this.auditService = new AuditService();
  }

  /**
   * Setup 2FA for user
   */
  async setup2FA(userId: string, method: TwoFactorMethod, phone?: string): Promise<TwoFactorSetupData> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    let setupData: TwoFactorSetupData = { method };

    if (method === 'AUTHENTICATOR') {
      // Generate secret for authenticator app
      const secret = authenticator.generateSecret();
      const label = `${user.name || user.email}`;
      const issuer = 'Oud PMS';

      const otpauth = authenticator.keyuri(label, issuer, secret);
      const qrCode = await QRCode.toDataURL(otpauth);

      setupData.secret = secret;
      setupData.qrCode = qrCode;
    } else if (method === 'SMS') {
      if (!phone) {
        throw new Error('Phone number is required for SMS 2FA');
      }
      setupData.phone = phone;
    }

    // Generate backup codes
    const backupCodes = this.generateBackupCodes();
    setupData.backupCodes = backupCodes;

    // Store 2FA settings (not enabled yet)
    await prisma.twoFactorAuth.upsert({
      where: { userId },
      create: {
        userId,
        method,
        secret: setupData.secret,
        phone: setupData.phone,
        backupCodes: backupCodes.map(code => this.hashBackupCode(code)),
        isEnabled: false,
        isVerified: false,
      },
      update: {
        method,
        secret: setupData.secret,
        phone: setupData.phone,
        backupCodes: backupCodes.map(code => this.hashBackupCode(code)),
        isEnabled: false,
        isVerified: false,
      },
    });

    return setupData;
  }

  /**
   * Verify and enable 2FA
   */
  async verify2FA(userId: string, code: string): Promise<AuthResponse> {
    try {
      const twoFactorAuth = await prisma.twoFactorAuth.findUnique({
        where: { userId },
      });

      if (!twoFactorAuth) {
        return {
          success: false,
          message: '2FA not set up',
          messageArabic: 'لم يتم إعداد المصادقة الثنائية',
        };
      }

      let isValid = false;

      if (twoFactorAuth.method === 'AUTHENTICATOR' && twoFactorAuth.secret) {
        isValid = authenticator.verify({
          token: code,
          secret: twoFactorAuth.secret,
          window: 2, // Allow 2 time windows (±30 seconds)
        });
      } else if (twoFactorAuth.method === 'SMS' || twoFactorAuth.method === 'EMAIL') {
        // Check OTP token
        const otpToken = await prisma.otpToken.findFirst({
          where: {
            userId,
            token: code,
            type: '2FA',
            isUsed: false,
            expiresAt: { gt: new Date() },
          },
        });

        if (otpToken) {
          isValid = true;
          // Mark token as used
          await prisma.otpToken.update({
            where: { id: otpToken.id },
            data: { isUsed: true },
          });
        }
      }

      if (!isValid) {
        return {
          success: false,
          message: 'Invalid 2FA code',
          messageArabic: 'رمز المصادقة الثنائية غير صحيح',
        };
      }

      // Enable 2FA
      await prisma.twoFactorAuth.update({
        where: { userId },
        data: {
          isEnabled: true,
          isVerified: true,
        },
      });

      // Log 2FA enablement
      await this.auditService.log({
        userId,
        action: 'USER_UPDATE',
        resource: 'users',
        resourceId: userId,
        metadata: { action: '2FA_ENABLED', method: twoFactorAuth.method },
        ipAddress: 'unknown',
        userAgent: 'unknown',
      });

      return {
        success: true,
        message: '2FA enabled successfully',
        messageArabic: 'تم تفعيل المصادقة الثنائية بنجاح',
      };
    } catch (error) {
      console.error('2FA verification error:', error);
      return {
        success: false,
        message: '2FA verification failed',
        messageArabic: 'فشل في التحقق من المصادقة الثنائية',
      };
    }
  }

  /**
   * Verify 2FA code during login
   */
  async verifyCode(userId: string, code: string): Promise<boolean> {
    const twoFactorAuth = await prisma.twoFactorAuth.findUnique({
      where: { userId },
    });

    if (!twoFactorAuth?.isEnabled) {
      return false;
    }

    // Check if it's a backup code
    if (await this.verifyBackupCode(userId, code)) {
      return true;
    }

    if (twoFactorAuth.method === 'AUTHENTICATOR' && twoFactorAuth.secret) {
      return authenticator.verify({
        token: code,
        secret: twoFactorAuth.secret,
        window: 2,
      });
    } else if (twoFactorAuth.method === 'SMS' || twoFactorAuth.method === 'EMAIL') {
      const otpToken = await prisma.otpToken.findFirst({
        where: {
          userId,
          token: code,
          type: '2FA',
          isUsed: false,
          expiresAt: { gt: new Date() },
        },
      });

      if (otpToken) {
        // Mark token as used
        await prisma.otpToken.update({
          where: { id: otpToken.id },
          data: { isUsed: true },
        });
        return true;
      }
    }

    return false;
  }

  /**
   * Send 2FA code via SMS or Email
   */
  async sendCode(userId: string): Promise<AuthResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { twoFactorAuth: true },
      });

      if (!user?.twoFactorAuth?.isEnabled) {
        return {
          success: false,
          message: '2FA not enabled',
          messageArabic: 'المصادقة الثنائية غير مفعلة',
        };
      }

      const twoFactorAuth = user.twoFactorAuth;
      const code = this.generateOTPCode();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Store OTP token
      await prisma.otpToken.create({
        data: {
          userId,
          token: code,
          type: '2FA',
          method: twoFactorAuth.method,
          expiresAt,
        },
      });

      // Send code
      if (twoFactorAuth.method === 'SMS' && twoFactorAuth.phone) {
        await this.notificationService.send2FASMS(twoFactorAuth.phone, code, user.language);
      } else if (twoFactorAuth.method === 'EMAIL' && user.email) {
        await this.notificationService.send2FAEmail(user.email, code, user.language);
      }

      return {
        success: true,
        message: '2FA code sent',
        messageArabic: 'تم إرسال رمز المصادقة الثنائية',
      };
    } catch (error) {
      console.error('Send 2FA code error:', error);
      return {
        success: false,
        message: 'Failed to send 2FA code',
        messageArabic: 'فشل في إرسال رمز المصادقة الثنائية',
      };
    }
  }

  /**
   * Disable 2FA
   */
  async disable2FA(userId: string, verificationCode: string): Promise<AuthResponse> {
    try {
      // Verify the current 2FA code to ensure user has access
      const isValid = await this.verifyCode(userId, verificationCode);

      if (!isValid) {
        return {
          success: false,
          message: 'Invalid verification code',
          messageArabic: 'رمز التحقق غير صحيح',
        };
      }

      // Disable 2FA
      await prisma.twoFactorAuth.update({
        where: { userId },
        data: {
          isEnabled: false,
          isVerified: false,
        },
      });

      // Log 2FA disablement
      await this.auditService.log({
        userId,
        action: 'USER_UPDATE',
        resource: 'users',
        resourceId: userId,
        metadata: { action: '2FA_DISABLED' },
        ipAddress: 'unknown',
        userAgent: 'unknown',
      });

      return {
        success: true,
        message: '2FA disabled successfully',
        messageArabic: 'تم إلغاء تفعيل المصادقة الثنائية بنجاح',
      };
    } catch (error) {
      console.error('Disable 2FA error:', error);
      return {
        success: false,
        message: 'Failed to disable 2FA',
        messageArabic: 'فشل في إلغاء تفعيل المصادقة الثنائية',
      };
    }
  }

  /**
   * Generate new backup codes
   */
  async generateNewBackupCodes(userId: string, verificationCode: string): Promise<AuthResponse & { backupCodes?: string[] }> {
    try {
      // Verify the current 2FA code
      const isValid = await this.verifyCode(userId, verificationCode);

      if (!isValid) {
        return {
          success: false,
          message: 'Invalid verification code',
          messageArabic: 'رمز التحقق غير صحيح',
        };
      }

      // Generate new backup codes
      const backupCodes = this.generateBackupCodes();

      // Update 2FA with new backup codes
      await prisma.twoFactorAuth.update({
        where: { userId },
        data: {
          backupCodes: backupCodes.map(code => this.hashBackupCode(code)),
        },
      });

      // Log backup codes regeneration
      await this.auditService.log({
        userId,
        action: 'USER_UPDATE',
        resource: 'users',
        resourceId: userId,
        metadata: { action: 'BACKUP_CODES_REGENERATED' },
        ipAddress: 'unknown',
        userAgent: 'unknown',
      });

      return {
        success: true,
        message: 'New backup codes generated',
        messageArabic: 'تم إنشاء رموز احتياطية جديدة',
        backupCodes,
      };
    } catch (error) {
      console.error('Generate backup codes error:', error);
      return {
        success: false,
        message: 'Failed to generate backup codes',
        messageArabic: 'فشل في إنشاء الرموز الاحتياطية',
      };
    }
  }

  /**
   * Get 2FA status for user
   */
  async get2FAStatus(userId: string): Promise<{
    isEnabled: boolean;
    method?: TwoFactorMethod;
    hasBackupCodes: boolean;
    phone?: string;
  }> {
    const twoFactorAuth = await prisma.twoFactorAuth.findUnique({
      where: { userId },
    });

    return {
      isEnabled: twoFactorAuth?.isEnabled || false,
      method: twoFactorAuth?.method,
      hasBackupCodes: (twoFactorAuth?.backupCodes?.length || 0) > 0,
      phone: twoFactorAuth?.phone,
    };
  }

  // Private helper methods

  private generateOTPCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateBackupCodes(): string[] {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }

  private hashBackupCode(code: string): string {
    // Simple hash for backup codes (in production, use bcrypt)
    return Buffer.from(code).toString('base64');
  }

  private async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    const twoFactorAuth = await prisma.twoFactorAuth.findUnique({
      where: { userId },
    });

    if (!twoFactorAuth?.backupCodes) {
      return false;
    }

    const hashedCode = this.hashBackupCode(code);
    const codeIndex = twoFactorAuth.backupCodes.indexOf(hashedCode);

    if (codeIndex === -1) {
      return false;
    }

    // Remove used backup code
    const updatedCodes = [...twoFactorAuth.backupCodes];
    updatedCodes.splice(codeIndex, 1);

    await prisma.twoFactorAuth.update({
      where: { userId },
      data: {
        backupCodes: updatedCodes,
      },
    });

    // Log backup code usage
    await this.auditService.log({
      userId,
      action: 'USER_LOGIN',
      metadata: { method: 'backup_code', codesRemaining: updatedCodes.length },
      ipAddress: 'unknown',
      userAgent: 'unknown',
    });

    return true;
  }

  /**
   * Clean expired OTP tokens
   */
  async cleanExpiredTokens(): Promise<void> {
    await prisma.otpToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { isUsed: true, createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }, // 24 hours old
        ],
      },
    });
  }

  /**
   * Get 2FA statistics
   */
  async get2FAStatistics(): Promise<{
    totalUsers: number;
    enabled2FA: number;
    byMethod: Record<TwoFactorMethod, number>;
    enablementRate: number;
  }> {
    const totalUsers = await prisma.user.count({
      where: { isActive: true },
    });

    const enabled2FA = await prisma.twoFactorAuth.count({
      where: { isEnabled: true },
    });

    const byMethod = await prisma.twoFactorAuth.groupBy({
      by: ['method'],
      where: { isEnabled: true },
      _count: true,
    });

    const methodCounts = {
      SMS: 0,
      EMAIL: 0,
      AUTHENTICATOR: 0,
    };

    byMethod.forEach(group => {
      methodCounts[group.method] = group._count;
    });

    return {
      totalUsers,
      enabled2FA,
      byMethod: methodCounts,
      enablementRate: totalUsers > 0 ? (enabled2FA / totalUsers) * 100 : 0,
    };
  }
}