import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const prisma = new PrismaClient();

// Zoho Books Integration schema
const zohoBooksAuthSchema = z.object({
  code: z.string(),
  organizationId: z.string(),
});

const zohoBooksSyncSchema = z.object({
  type: z.enum(['accounts', 'contacts', 'items', 'transactions', 'all']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Get Zoho Books configuration
export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'auth_url') {
      // Generate Zoho Books OAuth URL
      const authUrl = generateZohoBooksAuthUrl();
      return apiResponse({
        success: true,
        data: { authUrl },
      });
    }

    if (action === 'organizations') {
      // Get available organizations for authenticated user
      const organizations = await getZohoBooksOrganizations();
      return apiResponse({
        success: true,
        data: organizations,
      });
    }

    // Get Zoho Books integration configuration
    const zohoBooksConfig = await prisma.$queryRaw`
      SELECT * FROM zoho_books_configs WHERE is_active = true LIMIT 1
    ` as any[];

    if (zohoBooksConfig.length === 0) {
      return apiResponse({
        success: true,
        data: null,
        message: 'No Zoho Books integration configured',
      });
    }

    const config = zohoBooksConfig[0];

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
      FROM zoho_books_sync_logs
      WHERE zoho_books_config_id = ${config.id}
      ORDER BY started_at DESC
      LIMIT 10
    ` as any[];

    return apiResponse({
      success: true,
      data: {
        id: config.id,
        organizationId: config.organization_id,
        lastSyncAt: config.last_sync_at,
        isActive: config.is_active,
        isTokenExpired,
        tokenExpiresAt: config.token_expires_at,
        syncHistory,
        connectionStatus: isTokenExpired ? { success: false, error: 'Token expired' } : { success: true },
      },
    });
  } catch (error) {
    console.error('Zoho Books Integration GET error:', error);
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }
    return apiError('Failed to fetch Zoho Books configuration', 500);
  }
});

// Complete Zoho Books OAuth authentication
export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const body = await request.json();
    const validatedData = zohoBooksAuthSchema.parse(body);

    // Exchange authorization code for access token
    const tokenResponse = await exchangeCodeForTokens(validatedData.code);

    if (!tokenResponse.success) {
      return apiError('Failed to obtain access token', 400);
    }

    const configId = generateId();

    // Save Zoho Books configuration
    await prisma.$executeRaw`
      INSERT INTO zoho_books_configs (
        id, organization_id, client_id, client_secret, access_token,
        refresh_token, token_expires_at, is_active, created_at, updated_at
      ) VALUES (
        ${configId}, ${validatedData.organizationId}, ${process.env.ZOHO_BOOKS_CLIENT_ID},
        ${process.env.ZOHO_BOOKS_CLIENT_SECRET}, ${tokenResponse.accessToken},
        ${tokenResponse.refreshToken}, ${tokenResponse.expiresAt},
        true, ${new Date()}, ${new Date()}
      )
    `;

    return apiResponse({
      success: true,
      data: {
        id: configId,
        organizationId: validatedData.organizationId,
      },
      message: 'Zoho Books integration configured successfully',
    });
  } catch (error) {
    console.error('Zoho Books Integration POST error:', error);
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }
    return apiError('Failed to configure Zoho Books integration', 500);
  }
});

// Sync data with Zoho Books
export const PUT = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const body = await request.json();
    const validatedData = zohoBooksSyncSchema.parse(body);

    // Get Zoho Books configuration
    const zohoBooksConfig = await prisma.$queryRaw`
      SELECT * FROM zoho_books_configs WHERE is_active = true LIMIT 1
    ` as any[];

    if (zohoBooksConfig.length === 0) {
      return apiError('No Zoho Books integration configured', 400);
    }

    const config = zohoBooksConfig[0];

    // Check and refresh token if needed
    const isTokenExpired = new Date() > new Date(config.token_expires_at);
    if (isTokenExpired) {
      const refreshResult = await refreshZohoBooksToken(config);
      if (!refreshResult.success) {
        return apiError('Token refresh failed', 401);
      }
      config.access_token = refreshResult.accessToken;
    }

    // Start sync process
    const syncLogId = generateId();
    await prisma.$executeRaw`
      INSERT INTO zoho_books_sync_logs (
        id, zoho_books_config_id, type, status, started_at, started_by
      ) VALUES (
        ${syncLogId}, ${config.id}, ${validatedData.type}, 'in_progress',
        ${new Date()}, ${user.id}
      )
    `;

    let syncResult;
    try {
      switch (validatedData.type) {
        case 'accounts':
          syncResult = await syncAccountsFromZohoBooks(config);
          break;
        case 'contacts':
          syncResult = await syncContactsFromZohoBooks(config);
          break;
        case 'items':
          syncResult = await syncItemsFromZohoBooks(config);
          break;
        case 'transactions':
          syncResult = await syncTransactionsFromZohoBooks(config, validatedData.startDate, validatedData.endDate);
          break;
        case 'all':
          syncResult = await syncAllFromZohoBooks(config, validatedData.startDate, validatedData.endDate);
          break;
        default:
          throw new Error('Invalid sync type');
      }

      // Update sync log with success
      await prisma.$executeRaw`
        UPDATE zoho_books_sync_logs
        SET
          status = 'completed',
          records_synced = ${syncResult.recordsSynced},
          completed_at = ${new Date()}
        WHERE id = ${syncLogId}
      `;

      // Update last sync time
      await prisma.$executeRaw`
        UPDATE zoho_books_configs
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
        UPDATE zoho_books_sync_logs
        SET
          status = 'failed',
          error_message = ${(syncError as Error).message},
          completed_at = ${new Date()}
        WHERE id = ${syncLogId}
      `;

      throw syncError;
    }
  } catch (error) {
    console.error('Zoho Books Sync error:', error);
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }
    return apiError('Sync failed: ' + (error as Error).message, 500);
  }
});

// Disconnect Zoho Books integration
export const DELETE = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    // Deactivate Zoho Books configuration
    await prisma.$executeRaw`
      UPDATE zoho_books_configs
      SET is_active = false, updated_at = ${new Date()}
      WHERE is_active = true
    `;

    return apiResponse({
      success: true,
      message: 'Zoho Books integration disconnected successfully',
    });
  } catch (error) {
    console.error('Zoho Books Integration DELETE error:', error);
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }
    return apiError('Failed to disconnect Zoho Books integration', 500);
  }
});

// Helper functions
function generateZohoBooksAuthUrl(): string {
  const clientId = process.env.ZOHO_BOOKS_CLIENT_ID;
  const redirectUri = process.env.ZOHO_BOOKS_REDIRECT_URI;
  const scope = 'ZohoBooks.fullaccess.all';
  const state = generateRandomState();

  const baseUrl = 'https://accounts.zoho.com/oauth/v2/auth';
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

async function exchangeCodeForTokens(code: string) {
  try {
    const clientId = process.env.ZOHO_BOOKS_CLIENT_ID;
    const clientSecret = process.env.ZOHO_BOOKS_CLIENT_SECRET;
    const redirectUri = process.env.ZOHO_BOOKS_REDIRECT_URI;

    const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId || '',
        client_secret: clientSecret || '',
        redirect_uri: redirectUri || '',
        code,
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
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

async function refreshZohoBooksToken(config: any) {
  try {
    const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: config.client_id,
        client_secret: config.client_secret,
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
      UPDATE zoho_books_configs
      SET
        access_token = ${tokenData.access_token},
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

async function getZohoBooksOrganizations() {
  // This would fetch organizations from Zoho Books API
  // For now, return mock data
  return [
    {
      organization_id: '123456789',
      name: 'Perfume & Oud Trading LLC',
      currency_code: 'AED',
      time_zone: 'Asia/Dubai',
    },
    {
      organization_id: '987654321',
      name: 'Another Organization',
      currency_code: 'USD',
      time_zone: 'America/New_York',
    },
  ];
}

// Sync functions (simplified implementations)
async function syncAccountsFromZohoBooks(config: any) {
  // This would implement actual Zoho Books API calls
  // For now, we'll return a mock result
  return {
    recordsSynced: 25,
    details: 'Synced 25 accounts from Zoho Books',
  };
}

async function syncContactsFromZohoBooks(config: any) {
  return {
    recordsSynced: 40,
    details: 'Synced 40 contacts from Zoho Books',
  };
}

async function syncItemsFromZohoBooks(config: any) {
  return {
    recordsSynced: 150,
    details: 'Synced 150 items from Zoho Books',
  };
}

async function syncTransactionsFromZohoBooks(config: any, startDate?: string, endDate?: string) {
  return {
    recordsSynced: 75,
    details: `Synced 75 transactions from Zoho Books${startDate ? ` from ${startDate} to ${endDate}` : ''}`,
  };
}

async function syncAllFromZohoBooks(config: any, startDate?: string, endDate?: string) {
  const accounts = await syncAccountsFromZohoBooks(config);
  const contacts = await syncContactsFromZohoBooks(config);
  const items = await syncItemsFromZohoBooks(config);
  const transactions = await syncTransactionsFromZohoBooks(config, startDate, endDate);

  return {
    recordsSynced: accounts.recordsSynced + contacts.recordsSynced + items.recordsSynced + transactions.recordsSynced,
    details: {
      accounts: accounts.recordsSynced,
      contacts: contacts.recordsSynced,
      items: items.recordsSynced,
      transactions: transactions.recordsSynced,
    },
  };
}

function generateRandomState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateId(): string {
  return `zb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}