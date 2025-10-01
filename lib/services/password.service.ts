import { prisma } from '@/lib/database/prisma';
import { PasswordPolicyData } from '@/types/auth';
import bcrypt from 'bcryptjs';

interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  errorsArabic: string[];
  score: number;
}

export class PasswordService {
  /**
   * Validate password against policy
   */
  async validatePassword(password: string, userId?: string): Promise<PasswordValidationResult> {
    const policy = await this.getPasswordPolicy();
    const errors: string[] = [];
    const errorsArabic: string[] = [];
    let score = 0;

    // Check minimum length
    if (password.length < policy.minLength) {
      errors.push(`Password must be at least ${policy.minLength} characters long`);
      errorsArabic.push(`يجب أن تكون كلمة المرور ${policy.minLength} أحرف على الأقل`);
    } else {
      score += 1;
    }

    // Check uppercase requirement
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
      errorsArabic.push('يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل');
    } else if (policy.requireUppercase) {
      score += 1;
    }

    // Check lowercase requirement
    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
      errorsArabic.push('يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل');
    } else if (policy.requireLowercase) {
      score += 1;
    }

    // Check numbers requirement
    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
      errorsArabic.push('يجب أن تحتوي كلمة المرور على رقم واحد على الأقل');
    } else if (policy.requireNumbers) {
      score += 1;
    }

    // Check special characters requirement
    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
      errorsArabic.push('يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل');
    } else if (policy.requireSpecialChars) {
      score += 1;
    }

    // Check password reuse (if userId provided)
    if (userId && policy.preventReuse > 0) {
      const hashedPassword = await bcrypt.hash(password, 12);
      const recentPasswords = await prisma.passwordHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: policy.preventReuse,
      });

      for (const oldPassword of recentPasswords) {
        if (await bcrypt.compare(password, oldPassword.passwordHash)) {
          errors.push(`Cannot reuse any of the last ${policy.preventReuse} passwords`);
          errorsArabic.push(`لا يمكن إعادة استخدام أي من كلمات المرور الـ ${policy.preventReuse} الأخيرة`);
          break;
        }
      }
    }

    // Check for common weak patterns
    const weakPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /admin/i,
      /welcome/i,
      /123abc/i,
    ];

    for (const pattern of weakPatterns) {
      if (pattern.test(password)) {
        errors.push('Password contains common weak patterns');
        errorsArabic.push('تحتوي كلمة المرور على أنماط ضعيفة شائعة');
        score -= 1;
        break;
      }
    }

    // Check for consecutive characters
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password should not contain repeating characters');
      errorsArabic.push('يجب ألا تحتوي كلمة المرور على أحرف متكررة');
    }

    // Check for keyboard patterns
    const keyboardPatterns = [
      /qwerty/i,
      /asdfgh/i,
      /zxcvbn/i,
      /123456/,
      /098765/,
    ];

    for (const pattern of keyboardPatterns) {
      if (pattern.test(password)) {
        errors.push('Password should not contain keyboard patterns');
        errorsArabic.push('يجب ألا تحتوي كلمة المرور على أنماط لوحة المفاتيح');
        break;
      }
    }

    // Additional strength checks for bonus points
    if (password.length >= 12) score += 1;
    if (/[^\w\s]/.test(password)) score += 1; // Complex special chars
    if (password.length >= 16) score += 1;

    return {
      isValid: errors.length === 0,
      errors,
      errorsArabic,
      score: Math.max(0, score),
    };
  }

  /**
   * Get password strength description
   */
  getPasswordStrength(score: number): { level: string; description: string; descriptionArabic: string; color: string } {
    if (score <= 2) {
      return {
        level: 'weak',
        description: 'Weak',
        descriptionArabic: 'ضعيف',
        color: 'red',
      };
    } else if (score <= 4) {
      return {
        level: 'fair',
        description: 'Fair',
        descriptionArabic: 'مقبول',
        color: 'orange',
      };
    } else if (score <= 6) {
      return {
        level: 'good',
        description: 'Good',
        descriptionArabic: 'جيد',
        color: 'yellow',
      };
    } else {
      return {
        level: 'strong',
        description: 'Strong',
        descriptionArabic: 'قوي',
        color: 'green',
      };
    }
  }

  /**
   * Generate secure password
   */
  generateSecurePassword(length: number = 12): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const allChars = uppercase + lowercase + numbers + special;
    let password = '';

    // Ensure at least one character from each required set
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Check if password is expired
   */
  async isPasswordExpired(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordSetAt: true },
    });

    if (!user?.passwordSetAt) return false;

    const policy = await this.getPasswordPolicy();
    const expiryDate = new Date(user.passwordSetAt.getTime() + policy.maxAge * 24 * 60 * 60 * 1000);

    return new Date() > expiryDate;
  }

  /**
   * Get days until password expires
   */
  async getDaysUntilPasswordExpiry(userId: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordSetAt: true },
    });

    if (!user?.passwordSetAt) return 0;

    const policy = await this.getPasswordPolicy();
    const expiryDate = new Date(user.passwordSetAt.getTime() + policy.maxAge * 24 * 60 * 60 * 1000);
    const daysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

    return Math.max(0, daysLeft);
  }

  /**
   * Get password policy
   */
  async getPasswordPolicy(): Promise<PasswordPolicyData> {
    const policy = await prisma.passwordPolicy.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return {
      minLength: policy?.minLength || 8,
      requireUppercase: policy?.requireUppercase || true,
      requireLowercase: policy?.requireLowercase || true,
      requireNumbers: policy?.requireNumbers || true,
      requireSpecialChars: policy?.requireSpecialChars || true,
      preventReuse: policy?.preventReuse || 5,
      maxAge: policy?.maxAge || 90,
      lockoutAttempts: policy?.lockoutAttempts || 5,
      lockoutDuration: policy?.lockoutDuration || 30,
      sessionTimeout: policy?.sessionTimeout || 480,
    };
  }

  /**
   * Update password policy
   */
  async updatePasswordPolicy(policy: PasswordPolicyData): Promise<void> {
    // Deactivate existing policies
    await prisma.passwordPolicy.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Create new policy
    await prisma.passwordPolicy.create({
      data: {
        ...policy,
        isActive: true,
      },
    });
  }

  /**
   * Clean old password history
   */
  async cleanPasswordHistory(): Promise<void> {
    const policy = await this.getPasswordPolicy();

    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true },
    });

    for (const user of users) {
      // Keep only the last N passwords as per policy
      const oldPasswords = await prisma.passwordHistory.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        skip: policy.preventReuse,
      });

      if (oldPasswords.length > 0) {
        await prisma.passwordHistory.deleteMany({
          where: {
            id: {
              in: oldPasswords.map(p => p.id),
            },
          },
        });
      }
    }
  }

  /**
   * Get users with expiring passwords
   */
  async getUsersWithExpiringPasswords(daysThreshold: number = 7): Promise<Array<{
    id: string;
    email: string;
    name: string;
    daysLeft: number;
  }>> {
    const policy = await this.getPasswordPolicy();
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        passwordSetAt: {
          not: null,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        passwordSetAt: true,
      },
    });

    const expiringUsers = [];

    for (const user of users) {
      if (user.passwordSetAt) {
        const expiryDate = new Date(user.passwordSetAt.getTime() + policy.maxAge * 24 * 60 * 60 * 1000);
        const daysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

        if (daysLeft <= daysThreshold && daysLeft > 0) {
          expiringUsers.push({
            id: user.id,
            email: user.email,
            name: user.name || 'Unknown',
            daysLeft,
          });
        }
      }
    }

    return expiringUsers;
  }

  /**
   * Force password reset for user
   */
  async forcePasswordReset(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordSetAt: new Date('1970-01-01'), // Force immediate expiry
      },
    });
  }

  /**
   * Check for compromised passwords (basic implementation)
   */
  async isPasswordCompromised(password: string): Promise<boolean> {
    // This is a basic implementation. In production, you might want to:
    // 1. Check against known breached password databases (HaveIBeenPwned API)
    // 2. Implement local breach database checks
    // 3. Use more sophisticated detection algorithms

    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey',
      'dragon', 'pass', 'master', 'hello', 'freedom',
    ];

    return commonPasswords.includes(password.toLowerCase());
  }
}