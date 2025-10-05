import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-simple';
import { AuthService } from '@/lib/services/auth.service';

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Not authenticated',
          messageArabic: 'غير مصادق',
        },
        { status: 401 }
      );
    }

    // Resend verification code
    await authService.sendVerificationCode(session.user.id, 'email');

    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully',
      messageArabic: 'تم إرسال رمز التحقق بنجاح',
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to resend verification code',
        messageArabic: 'فشل في إعادة إرسال رمز التحقق',
      },
      { status: 500 }
    );
  }
}
