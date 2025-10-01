import { prisma } from '@/lib/database/prisma';

interface EmailTemplate {
  subject: string;
  subjectArabic?: string;
  html: string;
  htmlArabic?: string;
}

interface SMSTemplate {
  message: string;
  messageArabic?: string;
}

export class NotificationService {
  /**
   * Send verification email
   */
  async sendVerificationEmail(email: string, code: string, language: string = 'en'): Promise<void> {
    const template = this.getVerificationEmailTemplate(code, language);

    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    });
  }

  /**
   * Send verification SMS
   */
  async sendVerificationSMS(phone: string, code: string, language: string = 'en'): Promise<void> {
    const template = this.getVerificationSMSTemplate(code, language);

    await this.sendSMS({
      to: phone,
      message: template.message,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, token: string, language: string = 'en'): Promise<void> {
    const template = this.getPasswordResetEmailTemplate(token, language);

    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    });
  }

  /**
   * Send password reset SMS
   */
  async sendPasswordResetSMS(phone: string, code: string, language: string = 'en'): Promise<void> {
    const template = this.getPasswordResetSMSTemplate(code, language);

    await this.sendSMS({
      to: phone,
      message: template.message,
    });
  }

  /**
   * Send 2FA code via email
   */
  async send2FAEmail(email: string, code: string, language: string = 'en'): Promise<void> {
    const template = this.get2FAEmailTemplate(code, language);

    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    });
  }

  /**
   * Send 2FA code via SMS
   */
  async send2FASMS(phone: string, code: string, language: string = 'en'): Promise<void> {
    const template = this.get2FASMSTemplate(code, language);

    await this.sendSMS({
      to: phone,
      message: template.message,
    });
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email: string, name: string, language: string = 'en'): Promise<void> {
    const template = this.getWelcomeEmailTemplate(name, language);

    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    });
  }

  /**
   * Send password expiry warning
   */
  async sendPasswordExpiryWarning(email: string, name: string, daysLeft: number, language: string = 'en'): Promise<void> {
    const template = this.getPasswordExpiryEmailTemplate(name, daysLeft, language);

    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    });
  }

  /**
   * Send account locked notification
   */
  async sendAccountLockedNotification(email: string, name: string, language: string = 'en'): Promise<void> {
    const template = this.getAccountLockedEmailTemplate(name, language);

    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    });
  }

  /**
   * Send suspicious activity alert
   */
  async sendSuspiciousActivityAlert(email: string, name: string, activity: string, ipAddress: string, language: string = 'en'): Promise<void> {
    const template = this.getSuspiciousActivityEmailTemplate(name, activity, ipAddress, language);

    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    });
  }

  // Private methods for actual sending (integrate with your email/SMS providers)

  private async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    try {
      // TODO: Integrate with email service (SendGrid, SES, etc.)
      console.log(`Sending email to ${params.to}: ${params.subject}`);

      // Example implementation with SendGrid:
      /*
      import sgMail from '@sendgrid/mail';
      sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

      await sgMail.send({
        to: params.to,
        from: process.env.FROM_EMAIL!,
        subject: params.subject,
        html: params.html,
      });
      */
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  private async sendSMS(params: {
    to: string;
    message: string;
  }): Promise<void> {
    try {
      // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
      console.log(`Sending SMS to ${params.to}: ${params.message}`);

      // Example implementation with Twilio:
      /*
      import twilio from 'twilio';
      const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

      await client.messages.create({
        body: params.message,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: params.to,
      });
      */
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw error;
    }
  }

  // Template methods

  private getVerificationEmailTemplate(code: string, language: string): EmailTemplate {
    if (language === 'ar') {
      return {
        subject: 'رمز التحقق من الحساب',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>رمز التحقق من حسابك</h2>
            <p>أهلاً وسهلاً،</p>
            <p>رمز التحقق الخاص بك هو:</p>
            <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
              ${code}
            </div>
            <p>هذا الرمز صالح لمدة 15 دقيقة.</p>
            <p>مع تحيات فريق عود PMS</p>
          </div>
        `,
      };
    }

    return {
      subject: 'Account Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your Account</h2>
          <p>Hello,</p>
          <p>Your verification code is:</p>
          <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
            ${code}
          </div>
          <p>This code is valid for 15 minutes.</p>
          <p>Best regards,<br>Oud PMS Team</p>
        </div>
      `,
    };
  }

  private getVerificationSMSTemplate(code: string, language: string): SMSTemplate {
    if (language === 'ar') {
      return {
        message: `رمز التحقق من عود PMS: ${code}. صالح لمدة 15 دقيقة.`,
      };
    }

    return {
      message: `Your Oud PMS verification code: ${code}. Valid for 15 minutes.`,
    };
  }

  private getPasswordResetEmailTemplate(token: string, language: string): EmailTemplate {
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

    if (language === 'ar') {
      return {
        subject: 'إعادة تعيين كلمة المرور',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>إعادة تعيين كلمة المرور</h2>
            <p>أهلاً وسهلاً،</p>
            <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك.</p>
            <p>انقر على الرابط أدناه لإعادة تعيين كلمة المرور:</p>
            <div style="margin: 20px 0;">
              <a href="${resetUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                إعادة تعيين كلمة المرور
              </a>
            </div>
            <p>هذا الرابط صالح لمدة 30 دقيقة.</p>
            <p>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد.</p>
            <p>مع تحيات فريق عود PMS</p>
          </div>
        `,
      };
    }

    return {
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password.</p>
          <p>Click the link below to reset your password:</p>
          <div style="margin: 20px 0;">
            <a href="${resetUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Reset Password
            </a>
          </div>
          <p>This link is valid for 30 minutes.</p>
          <p>If you didn't request a password reset, please ignore this email.</p>
          <p>Best regards,<br>Oud PMS Team</p>
        </div>
      `,
    };
  }

  private getPasswordResetSMSTemplate(code: string, language: string): SMSTemplate {
    if (language === 'ar') {
      return {
        message: `رمز إعادة تعيين كلمة المرور لعود PMS: ${code}. صالح لمدة 30 دقيقة.`,
      };
    }

    return {
      message: `Your Oud PMS password reset code: ${code}. Valid for 30 minutes.`,
    };
  }

  private get2FAEmailTemplate(code: string, language: string): EmailTemplate {
    if (language === 'ar') {
      return {
        subject: 'رمز المصادقة الثنائية',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>رمز المصادقة الثنائية</h2>
            <p>رمز المصادقة الثنائية الخاص بك:</p>
            <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
              ${code}
            </div>
            <p>هذا الرمز صالح لمدة 5 دقائق.</p>
          </div>
        `,
      };
    }

    return {
      subject: 'Two-Factor Authentication Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Two-Factor Authentication</h2>
          <p>Your two-factor authentication code:</p>
          <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
            ${code}
          </div>
          <p>This code is valid for 5 minutes.</p>
        </div>
      `,
    };
  }

  private get2FASMSTemplate(code: string, language: string): SMSTemplate {
    if (language === 'ar') {
      return {
        message: `رمز المصادقة الثنائية لعود PMS: ${code}`,
      };
    }

    return {
      message: `Your Oud PMS 2FA code: ${code}`,
    };
  }

  private getWelcomeEmailTemplate(name: string, language: string): EmailTemplate {
    if (language === 'ar') {
      return {
        subject: 'مرحباً بك في عود PMS',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>مرحباً بك ${name}!</h2>
            <p>نرحب بك في نظام إدارة العطور والعود.</p>
            <p>يمكنك الآن الوصول إلى جميع ميزات النظام وإدارة أعمالك بكفاءة.</p>
            <p>إذا كان لديك أي أسئلة، لا تتردد في التواصل مع فريق الدعم.</p>
            <p>مع تحيات فريق عود PMS</p>
          </div>
        `,
      };
    }

    return {
      subject: 'Welcome to Oud PMS',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome ${name}!</h2>
          <p>Welcome to the Perfume & Oud Management System.</p>
          <p>You can now access all system features and manage your business efficiently.</p>
          <p>If you have any questions, don't hesitate to contact our support team.</p>
          <p>Best regards,<br>Oud PMS Team</p>
        </div>
      `,
    };
  }

  private getPasswordExpiryEmailTemplate(name: string, daysLeft: number, language: string): EmailTemplate {
    if (language === 'ar') {
      return {
        subject: 'تنبيه: كلمة المرور ستنتهي قريباً',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>تنبيه انتهاء كلمة المرور</h2>
            <p>عزيزي ${name},</p>
            <p>كلمة المرور الخاصة بك ستنتهي صلاحيتها خلال ${daysLeft} أيام.</p>
            <p>يرجى تغيير كلمة المرور قبل انتهاء صلاحيتها لتجنب انقطاع الوصول لحسابك.</p>
            <p>مع تحيات فريق عود PMS</p>
          </div>
        `,
      };
    }

    return {
      subject: 'Password Expiry Warning',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Expiry Warning</h2>
          <p>Dear ${name},</p>
          <p>Your password will expire in ${daysLeft} days.</p>
          <p>Please change your password before it expires to avoid account access disruption.</p>
          <p>Best regards,<br>Oud PMS Team</p>
        </div>
      `,
    };
  }

  private getAccountLockedEmailTemplate(name: string, language: string): EmailTemplate {
    if (language === 'ar') {
      return {
        subject: 'تم قفل حسابك',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>تم قفل حسابك</h2>
            <p>عزيزي ${name},</p>
            <p>تم قفل حسابك بسبب محاولات دخول متعددة فاشلة.</p>
            <p>يرجى التواصل مع المدير أو فريق الدعم لإعادة تفعيل حسابك.</p>
            <p>مع تحيات فريق عود PMS</p>
          </div>
        `,
      };
    }

    return {
      subject: 'Account Locked',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Account Locked</h2>
          <p>Dear ${name},</p>
          <p>Your account has been locked due to multiple failed login attempts.</p>
          <p>Please contact your administrator or support team to unlock your account.</p>
          <p>Best regards,<br>Oud PMS Team</p>
        </div>
      `,
    };
  }

  private getSuspiciousActivityEmailTemplate(name: string, activity: string, ipAddress: string, language: string): EmailTemplate {
    if (language === 'ar') {
      return {
        subject: 'تنبيه أمني: نشاط مشبوه',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>تنبيه أمني</h2>
            <p>عزيزي ${name},</p>
            <p>تم اكتشاف نشاط مشبوه في حسابك:</p>
            <p><strong>النشاط:</strong> ${activity}</p>
            <p><strong>عنوان IP:</strong> ${ipAddress}</p>
            <p>إذا لم تكن أنت من قام بهذا النشاط، يرجى تغيير كلمة المرور فوراً والتواصل مع فريق الدعم.</p>
            <p>مع تحيات فريق عود PMS</p>
          </div>
        `,
      };
    }

    return {
      subject: 'Security Alert: Suspicious Activity',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Security Alert</h2>
          <p>Dear ${name},</p>
          <p>Suspicious activity has been detected on your account:</p>
          <p><strong>Activity:</strong> ${activity}</p>
          <p><strong>IP Address:</strong> ${ipAddress}</p>
          <p>If this wasn't you, please change your password immediately and contact support.</p>
          <p>Best regards,<br>Oud PMS Team</p>
        </div>
      `,
    };
  }
}