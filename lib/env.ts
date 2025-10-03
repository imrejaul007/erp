import { z } from 'zod';

/**
 * Environment Configuration with validation
 * Validates environment variables on application startup
 */

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL connection string'),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // Optional: External Services
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  
  // Optional: File Storage
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  
  // Optional: Monitoring
  SENTRY_DSN: z.string().url().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate and parse environment variables
 * Call this at application startup
 */
export function validateEnv(): Env {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(err => {
        const path = err.path.join('.');
        return `  ❌ ${path}: ${err.message}`;
      });
      
      console.error('❌ Environment validation failed:\n');
      console.error(messages.join('\n'));
      console.error('\n💡 Please check your .env.local file\n');
    }
    
    throw new Error('Environment validation failed');
  }
}

/**
 * Get validated environment configuration
 * Cached after first call
 */
let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (!cachedEnv) {
    cachedEnv = validateEnv();
  }
  return cachedEnv;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return getEnv().NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return getEnv().NODE_ENV === 'development';
}

/**
 * Check if running in test
 */
export function isTest(): boolean {
  return getEnv().NODE_ENV === 'test';
}

/**
 * Get database URL with connection pooling parameters
 */
export function getDatabaseUrl(): string {
  const env = getEnv();
  const url = new URL(env.DATABASE_URL);
  
  // Add connection pool settings if not present
  if (isProduction() && !url.searchParams.has('connection_limit')) {
    url.searchParams.set('connection_limit', '10');
    url.searchParams.set('pool_timeout', '20');
  }
  
  return url.toString();
}
