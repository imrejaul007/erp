import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Diagnostic endpoint to check Prisma client
 */
export async function GET(req: NextRequest) {
  try {
    // Check what's available in prisma object
    const prismaKeys = Object.keys(prisma).filter(key => !key.startsWith('_') && !key.startsWith('$'));

    // Check if specific models exist
    const checks = {
      hasTenant: 'tenant' in prisma,
      hasUser: 'user' in prisma,
      hasCategory: 'category' in prisma,
      hasBrand: 'brand' in prisma,
      hasProduct: 'product' in prisma,
      hasStore: 'store' in prisma,
    };

    // Try to get Prisma version
    let prismaVersion = 'unknown';
    try {
      const { PrismaClient } = require('@prisma/client');
      prismaVersion = PrismaClient.version || 'unknown';
    } catch (e) {
      prismaVersion = 'error: ' + (e as Error).message;
    }

    return NextResponse.json({
      success: true,
      prismaVersion,
      availableModels: prismaKeys,
      modelChecks: checks,
      databaseUrl: process.env.DATABASE_URL ? 'Set (hidden)' : 'NOT SET',
      nodeEnv: process.env.NODE_ENV,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
