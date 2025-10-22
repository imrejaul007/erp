import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const ProfileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
});

const PasswordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

// GET /api/profile - Get current user profile
export const GET = withTenant(async (req, { user }) => {
  try {
    const userProfile = await prisma.users.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        isActive: true,
        language: true,
        timezone: true,
        createdAt: true,
      }
    });

    if (!userProfile) {
      return apiError('User not found', 404);
    }

    // Transform to match frontend expectations
    const response = {
      id: userProfile.id,
      name: `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || userProfile.email,
      email: userProfile.email,
      phone: userProfile.phone || '',
      address: '', // Field doesn't exist in schema, return empty string
      role: 'USER', // Field doesn't exist in schema, return default
      createdAt: userProfile.createdAt,
      avatar: userProfile.avatar,
      language: userProfile.language,
      timezone: userProfile.timezone,
    };

    return apiResponse(response);
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return apiError(error.message || 'Failed to fetch profile', 500);
  }
});

// PUT /api/profile - Update current user profile
export const PUT = withTenant(async (req, { user }) => {
  try {
    const body = await req.json();
    const profileData = ProfileUpdateSchema.parse(body);

    // Split name into firstName and lastName if provided
    const updateData: any = {};

    if (profileData.name) {
      const nameParts = profileData.name.trim().split(/\s+/);
      updateData.firstName = nameParts[0] || '';
      updateData.lastName = nameParts.slice(1).join(' ') || '';
    }

    if (profileData.phone !== undefined) {
      updateData.phone = profileData.phone;
    }

    updateData.updatedAt = new Date();

    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        createdAt: true,
      }
    });

    // Transform response to match frontend expectations
    const response = {
      id: updatedUser.id,
      name: `${updatedUser.firstName || ''} ${updatedUser.lastName || ''}`.trim() || updatedUser.email,
      email: updatedUser.email,
      phone: updatedUser.phone || '',
      address: '', // Field doesn't exist in schema
      role: 'USER', // Field doesn't exist in schema
      createdAt: updatedUser.createdAt,
    };

    return apiResponse(response);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }

    console.error('Error updating profile:', error);
    return apiError(error.message || 'Failed to update profile', 500);
  }
});

// POST /api/profile - Change password
export const POST = withTenant(async (req, { user }) => {
  try {
    const body = await req.json();
    const { currentPassword, newPassword } = PasswordChangeSchema.parse(body);

    // Get current user with password
    const currentUser = await prisma.users.findUnique({
      where: { id: user.id },
    });

    if (!currentUser || !currentUser.password) {
      return apiError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);

    if (!isPasswordValid) {
      return apiError('Current password is incorrect', 401);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.users.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    return apiResponse({ message: 'Password changed successfully' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }

    console.error('Error changing password:', error);
    return apiError(error.message || 'Failed to change password', 500);
  }
});
