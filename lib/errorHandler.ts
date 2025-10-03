import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

/**
 * Standard error response format
 */
export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: any;
    timestamp: string;
    path?: string;
  };
}

/**
 * Error codes for different error types
 */
export enum ErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

  // Database
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  DATABASE_ERROR = 'DATABASE_ERROR',
  CONSTRAINT_VIOLATION = 'CONSTRAINT_VIOLATION',

  // Business Logic
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  INVALID_OPERATION = 'INVALID_OPERATION',
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',

  // Multi-tenancy
  TENANT_NOT_FOUND = 'TENANT_NOT_FOUND',
  CROSS_TENANT_ACCESS = 'CROSS_TENANT_ACCESS',

  // Server
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

/**
 * Custom application error class
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public code: ErrorCode,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle Prisma errors and convert to user-friendly messages
 */
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): AppError {
  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      const field = (error.meta?.target as string[])?.join(', ') || 'field';
      return new AppError(
        `A record with this ${field} already exists`,
        ErrorCode.DUPLICATE_ENTRY,
        409,
        { field, originalError: error.code }
      );

    case 'P2025':
      // Record not found
      return new AppError(
        'The requested record was not found',
        ErrorCode.NOT_FOUND,
        404,
        { originalError: error.code }
      );

    case 'P2003':
      // Foreign key constraint violation
      return new AppError(
        'Cannot perform this operation due to related records',
        ErrorCode.CONSTRAINT_VIOLATION,
        400,
        { originalError: error.code }
      );

    case 'P2014':
      // Invalid ID
      return new AppError(
        'Invalid ID provided',
        ErrorCode.INVALID_INPUT,
        400,
        { originalError: error.code }
      );

    default:
      return new AppError(
        'A database error occurred',
        ErrorCode.DATABASE_ERROR,
        500,
        { originalError: error.code, message: error.message }
      );
  }
}

/**
 * Handle Zod validation errors
 */
function handleZodError(error: ZodError): AppError {
  const details = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code,
  }));

  return new AppError(
    'Validation failed',
    ErrorCode.VALIDATION_ERROR,
    400,
    { errors: details }
  );
}

/**
 * Global error handler - converts errors to standardized format
 */
export function handleError(error: unknown, path?: string): NextResponse<ErrorResponse> {
  console.error('[Error Handler]', error);

  let appError: AppError;

  // Handle different error types
  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    appError = handlePrismaError(error);
  } else if (error instanceof ZodError) {
    appError = handleZodError(error);
  } else if (error instanceof Error) {
    appError = new AppError(
      process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : error.message,
      ErrorCode.INTERNAL_ERROR,
      500,
      process.env.NODE_ENV === 'development' ? { stack: error.stack } : undefined
    );
  } else {
    appError = new AppError(
      'An unknown error occurred',
      ErrorCode.INTERNAL_ERROR,
      500
    );
  }

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: appError.message,
      code: appError.code,
      details: appError.details,
      timestamp: new Date().toISOString(),
      ...(path && { path }),
    },
  };

  return NextResponse.json(errorResponse, { status: appError.statusCode });
}

/**
 * Async error wrapper for API routes
 */
export function asyncHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse<ErrorResponse>> => {
    try {
      return await fn(...args);
    } catch (error) {
      return handleError(error);
    }
  };
}

/**
 * Throw common errors with standardized messages
 */
export const ErrorHelpers = {
  notFound: (resource: string) => {
    throw new AppError(
      `${resource} not found`,
      ErrorCode.NOT_FOUND,
      404
    );
  },

  unauthorized: (message: string = 'Unauthorized access') => {
    throw new AppError(
      message,
      ErrorCode.UNAUTHORIZED,
      401
    );
  },

  forbidden: (message: string = 'Access forbidden') => {
    throw new AppError(
      message,
      ErrorCode.FORBIDDEN,
      403
    );
  },

  validation: (message: string, details?: any) => {
    throw new AppError(
      message,
      ErrorCode.VALIDATION_ERROR,
      400,
      details
    );
  },

  duplicate: (field: string) => {
    throw new AppError(
      `${field} already exists`,
      ErrorCode.DUPLICATE_ENTRY,
      409,
      { field }
    );
  },

  insufficientStock: (productName: string, available: number, requested: number) => {
    throw new AppError(
      `Insufficient stock for ${productName}. Available: ${available}, Requested: ${requested}`,
      ErrorCode.INSUFFICIENT_STOCK,
      400,
      { productName, available, requested }
    );
  },

  crossTenantAccess: () => {
    throw new AppError(
      'Cannot access resources from another tenant',
      ErrorCode.CROSS_TENANT_ACCESS,
      403
    );
  },

  businessRule: (message: string, details?: any) => {
    throw new AppError(
      message,
      ErrorCode.BUSINESS_RULE_VIOLATION,
      400,
      details
    );
  },
};
