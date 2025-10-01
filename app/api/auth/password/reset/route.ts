import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';
import { PasswordResetRequest, PasswordResetData } from '@/types/auth';
import { z } from 'zod';

const resetRequestSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  method: z.enum(['email', 'sms']),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const authService = new AuthService();

// Request password reset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if this is a reset request or password reset
    if (body.token) {
      // Password reset with token
      const validationResult = resetPasswordSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            message: 'Validation failed',
            messageArabic: 'فشل في التحقق',
            errors: validationResult.error.issues.map(issue => ({
              field: issue.path.join('.'),
              message: issue.message,
            })),
          },
          { status: 400 }
        );
      }

      const resetData: PasswordResetData = validationResult.data;
      const result = await authService.resetPassword(resetData);

      return NextResponse.json(result, {
        status: result.success ? 200 : 400,
      });

    } else {
      // Password reset request
      const validationResult = resetRequestSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            message: 'Validation failed',
            messageArabic: 'فشل في التحقق',
            errors: validationResult.error.issues.map(issue => ({
              field: issue.path.join('.'),
              message: issue.message,
            })),
          },
          { status: 400 }
        );
      }

      const requestData: PasswordResetRequest = validationResult.data;
      const result = await authService.requestPasswordReset(requestData);

      return NextResponse.json(result, {
        status: result.success ? 200 : 400,
      });
    }

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        messageArabic: 'خطأ في الخادم الداخلي',
      },
      { status: 500 }
    );
  }
}