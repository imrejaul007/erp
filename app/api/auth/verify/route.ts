import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';
import { z } from 'zod';

const verifySchema = z.object({
  userId: z.string().cuid(),
  code: z.string().min(6, 'Verification code must be at least 6 characters'),
});

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = verifySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid verification data',
          messageArabic: 'بيانات التحقق غير صحيحة',
          errors: validationResult.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { userId, code } = validationResult.data;

    // Verify account
    const result = await authService.verifyAccount(userId, code);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });

  } catch (error) {
    console.error('Verification error:', error);
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