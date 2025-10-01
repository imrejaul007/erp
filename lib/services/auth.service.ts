import { prisma } from '@/lib/database/prisma';
import { PasswordService } from './password.service';
import { TwoFactorService } from './two-factor.service';
import { AuditService } from './audit.service';
import { NotificationService } from './notification.service';
import {
  AuthResponse,
  SignInCredentials,
  SignUpData,
  AuthUser,
  PasswordResetRequest,
  PasswordResetData,
  ChangePasswordData,
} from '@/types/auth';
import { UserRole, LoginAttemptResult } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

export class AuthService {
  private passwordService: PasswordService;
  private twoFactorService: TwoFactorService;
  private auditService: AuditService;
  private notificationService: NotificationService;

  constructor() {
    this.passwordService = new PasswordService();
    this.twoFactorService = new TwoFactorService();
    this.auditService = new AuditService();
    this.notificationService = new NotificationService();
  }

  /**
   * Authenticate user with credentials
   */
  async authenticateUser(credentials: {
    identifier: string;
    password: string;
    twoFactorCode?: string;
    ipAddress: string;
    userAgent: string;
  }): Promise<AuthResponse> {
    const { identifier, password, twoFactorCode, ipAddress, userAgent } = credentials;

    try {
      // Find user by email, phone, or username
      const user = await this.findUserByIdentifier(identifier);

      if (!user) {
        await this.logFailedAttempt(identifier, ipAddress, userAgent, 'FAILED_INVALID_CREDENTIALS');
        return {
          success: false,
          message: 'Invalid credentials',
          messageArabic: 'بيانات اعتماد غير صحيحة',
        };
      }

      // Check if account is locked
      if (user.isLocked || (user.lockedUntil && user.lockedUntil > new Date())) {
        await this.logFailedAttempt(identifier, ipAddress, userAgent, 'FAILED_ACCOUNT_LOCKED', user.id);
        return {
          success: false,
          message: 'Account is locked. Please try again later.',
          messageArabic: 'الحساب مقفل. يرجى المحاولة مرة أخرى لاحقاً.',
        };
      }

      // Check if account is disabled
      if (!user.isActive) {
        await this.logFailedAttempt(identifier, ipAddress, userAgent, 'FAILED_ACCOUNT_DISABLED', user.id);
        return {
          success: false,
          message: 'Account is disabled.',
          messageArabic: 'الحساب معطل.',
        };
      }

      // Verify password
      if (!user.password || !await bcrypt.compare(password, user.password)) {
        await this.handleFailedLogin(user.id, identifier, ipAddress, userAgent);
        return {
          success: false,
          message: 'Invalid credentials',
          messageArabic: 'بيانات اعتماد غير صحيحة',
        };
      }

      // Check if 2FA is required
      const twoFactorAuth = await prisma.twoFactorAuth.findUnique({
        where: { userId: user.id },
      });

      if (twoFactorAuth?.isEnabled) {
        if (!twoFactorCode) {
          return {
            success: false,
            requires2FA: true,
            message: 'Two-factor authentication required',
            messageArabic: 'مطلوب مصادقة ثنائية العامل',
            tempToken: await this.generateTempToken(user.id),
          };
        }

        const isValidCode = await this.twoFactorService.verifyCode(user.id, twoFactorCode);
        if (!isValidCode) {
          await this.logFailedAttempt(identifier, ipAddress, userAgent, 'FAILED_2FA_INVALID', user.id);
          return {
            success: false,
            message: 'Invalid two-factor authentication code',
            messageArabic: 'رمز المصادقة الثنائية غير صحيح',
          };
        }
      }

      // Reset failed login attempts
      await this.resetFailedAttempts(user.id);

      // Log successful login
      await this.auditService.log({
        userId: user.id,
        action: 'USER_LOGIN',
        ipAddress,
        userAgent,
        metadata: { method: 'credentials' },
      });

      // Get user with roles and permissions
      const authUser = await this.getUserWithRolesAndPermissions(user.id);

      return {
        success: true,
        message: 'Login successful',
        messageArabic: 'تم تسجيل الدخول بنجاح',
        user: authUser,
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        message: 'Authentication failed',
        messageArabic: 'فشل في المصادقة',
      };
    }
  }

  /**
   * Register new user
   */
  async registerUser(data: SignUpData): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await this.findUserByIdentifier(data.email);
      if (existingUser) {
        return {
          success: false,
          message: 'User already exists',
          messageArabic: 'المستخدم موجود بالفعل',
        };
      }

      // Validate password policy
      const passwordValidation = await this.passwordService.validatePassword(data.password);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          message: passwordValidation.errors.join(', '),
          messageArabic: passwordValidation.errorsArabic.join('، '),
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          name: data.name,
          nameArabic: data.nameArabic,
          email: data.email,
          phone: data.phone,
          username: data.username,
          password: hashedPassword,
          passwordSetAt: new Date(),
          role: UserRole.USER,
          language: data.language || 'en',
          isVerified: false,
          isActive: true,
          isLocked: false,
        },
      });

      // Create user preferences
      await prisma.userPreferences.create({
        data: {
          userId: user.id,
          language: data.language || 'en',
        },
      });

      // Add to password history
      await prisma.passwordHistory.create({
        data: {
          userId: user.id,
          passwordHash: hashedPassword,
        },
      });

      // Send verification email/SMS
      await this.sendVerificationCode(user.id, 'email');

      // Log user creation
      await this.auditService.log({
        userId: user.id,
        action: 'USER_CREATE',
        resource: 'users',
        resourceId: user.id,
        ipAddress: 'unknown',
        userAgent: 'unknown',
        metadata: { method: 'registration' },
      });

      return {
        success: true,
        message: 'Registration successful. Please verify your account.',
        messageArabic: 'تم التسجيل بنجاح. يرجى التحقق من حسابك.',
        redirectTo: '/auth/verify-email',
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed',
        messageArabic: 'فشل في التسجيل',
      };
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(request: PasswordResetRequest): Promise<AuthResponse> {
    try {
      const user = await this.findUserByIdentifier(request.identifier);
      if (!user) {
        // Don't reveal if user exists or not
        return {
          success: true,
          message: 'If an account exists, a reset code has been sent.',
          messageArabic: 'إذا كان الحساب موجوداً، فقد تم إرسال رمز إعادة التعيين.',
        };
      }

      // Generate reset token
      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

      // Store OTP token
      await prisma.otpToken.create({
        data: {
          userId: user.id,
          token,
          type: 'PASSWORD_RESET',
          method: request.method.toUpperCase(),
          expiresAt,
        },
      });

      // Send reset code
      if (request.method === 'email' && user.email) {
        await this.notificationService.sendPasswordResetEmail(user.email, token, user.language);
      } else if (request.method === 'sms' && user.phone) {
        await this.notificationService.sendPasswordResetSMS(user.phone, token, user.language);
      }

      // Log password reset request
      await this.auditService.log({
        userId: user.id,
        action: 'PASSWORD_RESET',
        metadata: { method: request.method },
        ipAddress: 'unknown',
        userAgent: 'unknown',
      });

      return {
        success: true,
        message: 'Reset code sent successfully.',
        messageArabic: 'تم إرسال رمز إعادة التعيين بنجاح.',
      };
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        message: 'Failed to send reset code',
        messageArabic: 'فشل في إرسال رمز إعادة التعيين',
      };
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: PasswordResetData): Promise<AuthResponse> {
    try {
      // Find valid token
      const otpToken = await prisma.otpToken.findFirst({
        where: {
          token: data.token,
          type: 'PASSWORD_RESET',
          isUsed: false,
          expiresAt: { gt: new Date() },
        },
        include: {
          user: true,
        },
      });

      if (!otpToken) {
        return {
          success: false,
          message: 'Invalid or expired reset token',
          messageArabic: 'رمز إعادة التعيين غير صحيح أو منتهي الصلاحية',
        };
      }

      // Validate new password
      const passwordValidation = await this.passwordService.validatePassword(data.newPassword, otpToken.userId);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          message: passwordValidation.errors.join(', '),
          messageArabic: passwordValidation.errorsArabic.join('، '),
        };
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(data.newPassword, 12);

      // Update user password
      await prisma.user.update({
        where: { id: otpToken.userId },
        data: {
          password: hashedPassword,
          passwordSetAt: new Date(),
          loginAttempts: 0,
          lockedUntil: null,
        },
      });

      // Add to password history
      await prisma.passwordHistory.create({
        data: {
          userId: otpToken.userId,
          passwordHash: hashedPassword,
        },
      });

      // Mark token as used
      await prisma.otpToken.update({
        where: { id: otpToken.id },
        data: { isUsed: true },
      });

      // Log password change
      await this.auditService.log({
        userId: otpToken.userId,
        action: 'PASSWORD_CHANGE',
        metadata: { method: 'reset' },
        ipAddress: 'unknown',
        userAgent: 'unknown',
      });

      return {
        success: true,
        message: 'Password reset successful',
        messageArabic: 'تم إعادة تعيين كلمة المرور بنجاح',
        redirectTo: '/auth/signin',
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: 'Password reset failed',
        messageArabic: 'فشل في إعادة تعيين كلمة المرور',
      };
    }
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(userId: string, data: ChangePasswordData): Promise<AuthResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.password) {
        return {
          success: false,
          message: 'User not found',
          messageArabic: 'المستخدم غير موجود',
        };
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(data.currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return {
          success: false,
          message: 'Current password is incorrect',
          messageArabic: 'كلمة المرور الحالية غير صحيحة',
        };
      }

      // Validate new password
      const passwordValidation = await this.passwordService.validatePassword(data.newPassword, userId);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          message: passwordValidation.errors.join(', '),
          messageArabic: passwordValidation.errorsArabic.join('، '),
        };
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(data.newPassword, 12);

      // Update user password
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          passwordSetAt: new Date(),
        },
      });

      // Add to password history
      await prisma.passwordHistory.create({
        data: {
          userId,
          passwordHash: hashedPassword,
        },
      });

      // Log password change
      await this.auditService.log({
        userId,
        action: 'PASSWORD_CHANGE',
        metadata: { method: 'manual' },
        ipAddress: 'unknown',
        userAgent: 'unknown',
      });

      return {
        success: true,
        message: 'Password changed successfully',
        messageArabic: 'تم تغيير كلمة المرور بنجاح',
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Password change failed',
        messageArabic: 'فشل في تغيير كلمة المرور',
      };
    }
  }

  /**
   * Send verification code
   */
  async sendVerificationCode(userId: string, method: 'email' | 'sms'): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return;

    const token = randomBytes(3).toString('hex').toUpperCase(); // 6-digit code
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.otpToken.create({
      data: {
        userId,
        token,
        type: 'EMAIL_VERIFICATION',
        method: method.toUpperCase(),
        expiresAt,
      },
    });

    if (method === 'email' && user.email) {
      await this.notificationService.sendVerificationEmail(user.email, token, user.language);
    } else if (method === 'sms' && user.phone) {
      await this.notificationService.sendVerificationSMS(user.phone, token, user.language);
    }
  }

  /**
   * Verify email/phone with code
   */
  async verifyAccount(userId: string, code: string): Promise<AuthResponse> {
    try {
      const otpToken = await prisma.otpToken.findFirst({
        where: {
          userId,
          token: code,
          type: 'EMAIL_VERIFICATION',
          isUsed: false,
          expiresAt: { gt: new Date() },
        },
      });

      if (!otpToken) {
        return {
          success: false,
          message: 'Invalid or expired verification code',
          messageArabic: 'رمز التحقق غير صحيح أو منتهي الصلاحية',
        };
      }

      // Update user as verified
      await prisma.user.update({
        where: { id: userId },
        data: {
          isVerified: true,
          emailVerified: otpToken.method === 'EMAIL' ? new Date() : undefined,
          phoneVerified: otpToken.method === 'SMS' ? new Date() : undefined,
        },
      });

      // Mark token as used
      await prisma.otpToken.update({
        where: { id: otpToken.id },
        data: { isUsed: true },
      });

      return {
        success: true,
        message: 'Account verified successfully',
        messageArabic: 'تم التحقق من الحساب بنجاح',
      };
    } catch (error) {
      console.error('Account verification error:', error);
      return {
        success: false,
        message: 'Verification failed',
        messageArabic: 'فشل في التحقق',
      };
    }
  }

  // Private helper methods

  private async findUserByIdentifier(identifier: string) {
    return await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier },
          { username: identifier },
        ],
      },
    });
  }

  private async handleFailedLogin(userId: string, identifier: string, ipAddress: string, userAgent: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return;

    const newAttempts = user.loginAttempts + 1;
    const passwordPolicy = await this.passwordService.getPasswordPolicy();

    let updateData: any = {
      loginAttempts: newAttempts,
    };

    // Lock account if exceeded max attempts
    if (newAttempts >= passwordPolicy.lockoutAttempts) {
      updateData.lockedUntil = new Date(Date.now() + passwordPolicy.lockoutDuration * 60 * 1000);
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    await this.logFailedAttempt(identifier, ipAddress, userAgent, 'FAILED_INVALID_CREDENTIALS', userId);
  }

  private async resetFailedAttempts(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  private async logFailedAttempt(
    identifier: string,
    ipAddress: string,
    userAgent: string,
    result: LoginAttemptResult,
    userId?: string
  ) {
    await prisma.loginAttempt.create({
      data: {
        email: identifier.includes('@') ? identifier : undefined,
        phone: identifier.startsWith('+') ? identifier : undefined,
        username: !identifier.includes('@') && !identifier.startsWith('+') ? identifier : undefined,
        ipAddress,
        userAgent,
        result,
        userId,
      },
    });
  }

  private async generateTempToken(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await prisma.otpToken.create({
      data: {
        userId,
        token,
        type: '2FA',
        method: 'TEMP',
        expiresAt,
      },
    });

    return token;
  }

  private async getUserWithRolesAndPermissions(userId: string): Promise<AuthUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          where: { isActive: true },
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
          where: { canAccess: true },
          include: {
            store: true,
          },
        },
        twoFactorAuth: true,
        preferences: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const roles = user.userRoles.map(ur => ({
      id: ur.role.id,
      name: ur.role.name,
      displayName: ur.role.displayName,
      displayNameArabic: ur.role.displayNameArabic,
      color: ur.role.color,
      isActive: ur.role.isActive,
    }));

    const permissions = user.userRoles
      .flatMap(ur => ur.role.permissions)
      .map(rp => ({
        id: rp.permission.id,
        action: rp.permission.action,
        resource: rp.permission.resource,
        conditions: rp.conditions || rp.permission.conditions,
      }));

    const stores = user.userStores.map(us => ({
      id: us.id,
      storeId: us.storeId,
      storeName: us.store.name,
      storeCode: us.store.code,
      isDefault: us.isDefault,
      canAccess: us.canAccess,
    }));

    const currentStore = stores.find(s => s.isDefault);

    return {
      id: user.id,
      name: user.name,
      nameArabic: user.nameArabic,
      email: user.email,
      phone: user.phone,
      username: user.username,
      image: user.image,
      role: user.role,
      roles,
      permissions,
      stores,
      currentStore,
      isActive: user.isActive,
      isVerified: user.isVerified,
      isLocked: user.isLocked,
      twoFactorEnabled: user.twoFactorAuth?.isEnabled || false,
      language: user.preferences?.language || user.language,
      timezone: user.preferences?.timezone || user.timezone,
      country: user.country,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }
}