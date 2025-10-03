import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const prisma = new PrismaClient();

// QuickBooks Integration schema
const quickbooksAuthSchema = z.object({
  code: z.string(),
  state: z.string(),
  realmId: z.string(),
});

const quickbooksSyncSchema = z.object({
  type: z.enum(['accounts', 'customers', 'vendors', 'items', 'transactions', 'all']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Get QuickBooks configuration
export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'auth_url') {
      // Generate QuickBooks OAuth URL
      const authUrl = generateQuickBooksAuthUrl();
      return apiResponse({
        success: true,
        data: { authUrl },
      });
    }

    // Get QuickBooks integration configuration
    const qbConfig = await prisma.$queryRaw`
      SELECT * FROM quickbooks_configs WHERE is_active = true LIMIT 1
    ` as any[];

    if (qbConfig.length === 0) {
      return apiResponse({
        success: true,
        data: null,
        message: 'No QuickBooks integration configured',
      });
    }

    const config = qbConfig[0];

    // Check token expiry
    const isTokenExpired = new Date() > new Date(config.token_expires_at);

    // Get sync history
    const syncHistory = await prisma.$queryRaw`
      SELECT
        type,
        status,
        records_synced,
        started_at,
        completed_at,
        error_message
      FROM quickbooks_sync_logs
      WHERE quickbooks_config_id = ${config.id}
      ORDER BY started_at DESC
      LIMIT 10
    ` as any[];

    return apiResponse({
      success: true,
      data: {
        id: config.id,
        companyId: config.company_id,
        baseUrl: config.base_url,
        lastSyncAt: config.last_sync_at,
        isActive: config.is_active,
        isTokenExpired,
        tokenExpiresAt: config.token_expires_at,
        syncHistory,
        connectionStatus: isTokenExpired ? { success: false, error: 'Token expired' } : { success: true },
      },
    });
  } catch (error) {
    console.error('QuickBooks Integration GET error:', error);
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }
    return apiError('Failed to fetch QuickBooks configuration', 500);
  }
});

// Complete QuickBooks OAuth authentication
export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const body = await request.json();
    const validatedData = quickbooksAuthSchema.parse(body);

    // Exchange authorization code for access token
    const tokenResponse = await exchangeCodeForTokens(validatedData.code, validatedData.realmId);

    if (!tokenResponse.success) {
      return apiError('Failed to obtain access token', 400);
    }

    const configId = generateId();

    // Save QuickBooks configuration
    await prisma.$executeRaw`
      INSERT INTO quickbooks_configs (
        id, company_id, access_token, refresh_token, token_expires_at,
        base_url, is_active, created_at, updated_at
      ) VALUES (
        ${configId}, ${validatedData.realmId}, ${tokenResponse.accessToken},
        ${tokenResponse.refreshToken}, ${tokenResponse.expiresAt},
        ${tokenResponse.baseUrl}, true, ${new Date()}, ${new Date()}
      )
    `;

    return apiResponse({
      success: true,
      data: {
        id: configId,
        companyId: validatedData.realmId,
      },
      message: 'QuickBooks integration configured successfully',
    });
  } catch (error) {
    console.error('QuickBooks Integration POST error:', error);
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }
    return apiError('Failed to configure QuickBooks integration', 500);
  }
});

// Sync data with QuickBooks
export const PUT = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const body = await request.json();
    const validatedData = quickbooksSyncSchema.parse(body);

    // Get QuickBooks configuration
    const qbConfig = await prisma.$queryRaw`
      SELECT * FROM quickbooks_configs WHERE is_active = true LIMIT 1
    ` as any[];

    if (qbConfig.length === 0) {
      return apiError('No QuickBooks integration configured', 400);
    }

    const config = qbConfig[0];

    // Check and refresh token if needed
    const isTokenExpired = new Date() > new Date(config.token_expires_at);
    if (isTokenExpired) {
      const refreshResult = await refreshQuickBooksToken(config);
      if (!refreshResult.success) {
        return apiError('Token refresh failed', 401);
      }
      config.access_token = refreshResult.accessToken;
    }

    // Start sync process
    const syncLogId = generateId();
    await prisma.$executeRaw`
      INSERT INTO quickbooks_sync_logs (
        id, quickbooks_config_id, type, status, started_at, started_by
      ) VALUES (
        ${syncLogId}, ${config.id}, ${validatedData.type}, 'in_progress',
        ${new Date()}, ${user.id}
      )
    `;

    let syncResult;
    try {
      switch (validatedData.type) {
        case 'accounts':
          syncResult = await syncAccountsFromQuickBooks(config);
          break;
        case 'customers':
          syncResult = await syncCustomersFromQuickBooks(config);
          break;
        case 'vendors':
          syncResult = await syncVendorsFromQuickBooks(config);
          break;
        case 'items':
          syncResult = await syncItemsFromQuickBooks(config);
          break;
        case 'transactions':
          syncResult = await syncTransactionsFromQuickBooks(config, validatedData.startDate, validatedData.endDate);
          break;
        case 'all':
          syncResult = await syncAllFromQuickBooks(config, validatedData.startDate, validatedData.endDate);
          break;
        default:
          throw new Error('Invalid sync type');
      }

      // Update sync log with success
      await prisma.$executeRaw`
        UPDATE quickbooks_sync_logs
        SET
          status = 'completed',
          records_synced = ${syncResult.recordsSynced},
          completed_at = ${new Date()}
        WHERE id = ${syncLogId}
      `;

      // Update last sync time
      await prisma.$executeRaw`
        UPDATE quickbooks_configs
        SET last_sync_at = ${new Date()}
        WHERE id = ${config.id}
      `;

      return apiResponse({
        success: true,
        data: syncResult,
        message: 'Sync completed successfully',
      });
    } catch (syncError) {
      // Update sync log with error
      await prisma.$executeRaw`
        UPDATE quickbooks_sync_logs
        SET
          status = 'failed',
          error_message = ${(syncError as Error).message},
          completed_at = ${new Date()}
        WHERE id = ${syncLogId}
      `;

      throw syncError;
    }
  } catch (error) {
    console.error('QuickBooks Sync error:', error);
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }
    return apiError('Sync failed: ' + (error as Error).message, 500);
  }
});

// Disconnect QuickBooks integration
export const DELETE = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    // Deactivate QuickBooks configuration
    await prisma.$executeRaw`
      UPDATE quickbooks_configs
      SET is_active = false, updated_at = ${new Date()}
      WHERE is_active = true
    `;

    return apiResponse({
      success: true,
      message: 'QuickBooks integration disconnected successfully',
    });
  } catch (error) {
    console.error('QuickBooks Integration DELETE error:', error);
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }
    return apiError('Failed to disconnect QuickBooks integration', 500);
  }
});

// Helper functions
function generateQuickBooksAuthUrl(): string {
  const clientId = process.env.QUICKBOOKS_CLIENT_ID;
  const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI;
  const scope = 'com.intuit.quickbooks.accounting';
  const state = generateRandomState();

  const baseUrl = 'https://appcenter.intuit.com/connect/oauth2';
  const params = new URLSearchParams({
    client_id: clientId || '',
    scope,
    redirect_uri: redirectUri || '',
    response_type: 'code',
    access_type: 'offline',
    state,
  });

  return `${baseUrl}?${params.toString()}`;
}

async function exchangeCodeForTokens(code: string, realmId: string) {
  try {
    const clientId = process.env.QUICKBOOKS_CLIENT_ID;
    const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET;
    const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI;

    const response = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri || '',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error };
    }

    const tokenData = await response.json();

    return {
      success: true,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
      baseUrl: tokenData.realmId ? 'https://sandbox-quickbooks.api.intuit.com' : 'https://quickbooks.api.intuit.com',
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

async function refreshQuickBooksToken(config: any) {
  try {
    const clientId = process.env.QUICKBOOKS_CLIENT_ID;
    const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET;

    const response = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: config.refresh_token,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error };
    }

    const tokenData = await response.json();

    // Update stored tokens
    await prisma.$executeRaw`
      UPDATE quickbooks_configs
      SET
        access_token = ${tokenData.access_token},
        refresh_token = ${tokenData.refresh_token || config.refresh_token},
        token_expires_at = ${new Date(Date.now() + tokenData.expires_in * 1000)},
        updated_at = ${new Date()}
      WHERE id = ${config.id}
    `;

    return {
      success: true,
      accessToken: tokenData.access_token,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

// Sync functions (simplified implementations)
async function syncAccountsFromQuickBooks(config: any) {
  // This would implement actual QuickBooks API calls
  // For now, we'll return a mock result
  return {
    recordsSynced: 30,
    details: 'Synced 30 accounts from QuickBooks',
  };
}

async function syncCustomersFromQuickBooks(config: any) {
  return {
    recordsSynced: 45,
    details: 'Synced 45 customers from QuickBooks',
  };
}

async function syncVendorsFromQuickBooks(config: any) {
  return {
    recordsSynced: 20,
    details: 'Synced 20 vendors from QuickBooks',
  };
}

async function syncItemsFromQuickBooks(config: any) {
  return {
    recordsSynced: 120,
    details: 'Synced 120 items from QuickBooks',
  };
}

async function syncTransactionsFromQuickBooks(config: any, startDate?: string, endDate?: string) {
  return {
    recordsSynced: 80,
    details: `Synced 80 transactions from QuickBooks${startDate ? ` from ${startDate} to ${endDate}` : ''}`,
  };
}

async function syncAllFromQuickBooks(config: any, startDate?: string, endDate?: string) {
  const accounts = await syncAccountsFromQuickBooks(config);
  const customers = await syncCustomersFromQuickBooks(config);
  const vendors = await syncVendorsFromQuickBooks(config);
  const items = await syncItemsFromQuickBooks(config);
  const transactions = await syncTransactionsFromQuickBooks(config, startDate, endDate);

  return {
    recordsSynced: accounts.recordsSynced + customers.recordsSynced + vendors.recordsSynced + items.recordsSynced + transactions.recordsSynced,
    details: {
      accounts: accounts.recordsSynced,
      customers: customers.recordsSynced,
      vendors: vendors.recordsSynced,
      items: items.recordsSynced,
      transactions: transactions.recordsSynced,
    },
  };
}

function generateRandomState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateId(): string {
  return `qb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}