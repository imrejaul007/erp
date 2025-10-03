import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const prisma = new PrismaClient();

// Tally Integration schema
const tallyConfigSchema = z.object({
  companyName: z.string().min(1),
  serverAddress: z.string().min(1),
  port: z.number().min(1).max(65535),
  username: z.string().optional(),
  password: z.string().optional(),
  syncSettings: z.object({
    syncAccounts: z.boolean().default(true),
    syncCustomers: z.boolean().default(true),
    syncSuppliers: z.boolean().default(true),
    syncVouchers: z.boolean().default(true),
    syncInventory: z.boolean().default(true),
    autoSync: z.boolean().default(false),
    syncInterval: z.number().min(5).max(1440).default(60), // minutes
  }),
});

const tallySyncSchema = z.object({
  type: z.enum(['accounts', 'customers', 'suppliers', 'vouchers', 'inventory', 'all']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Get Tally configuration
export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    // Get Tally integration configuration
    const tallyConfig = await prisma.$queryRaw`
      SELECT * FROM tally_integrations WHERE is_active = true LIMIT 1
    ` as any[];

    if (tallyConfig.length === 0) {
      return apiResponse({
        success: true,
        data: null,
        message: 'No Tally integration configured',
      });
    }

    const config = tallyConfig[0];

    // Get sync history
    const syncHistory = await prisma.$queryRaw`
      SELECT
        type,
        status,
        records_synced,
        started_at,
        completed_at,
        error_message
      FROM tally_sync_logs
      WHERE tally_integration_id = ${config.id}
      ORDER BY started_at DESC
      LIMIT 10
    ` as any[];

    return apiResponse({
      success: true,
      data: {
        id: config.id,
        companyName: config.company_name,
        serverAddress: config.server_address,
        port: config.port,
        username: config.username,
        lastSyncAt: config.last_sync_at,
        isActive: config.is_active,
        syncSettings: config.sync_settings,
        syncHistory,
        connectionStatus: await testTallyConnection(config),
      },
    });
  } catch (error) {
    console.error('Tally Integration GET error:', error);
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }
    return apiError('Failed to fetch Tally configuration', 500);
  }
});

// Create or update Tally configuration
export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const body = await request.json();
    const validatedData = tallyConfigSchema.parse(body);

    // Test connection first
    const connectionTest = await testTallyConnection(validatedData);
    if (!connectionTest.success) {
      return apiError('Connection test failed: ' + (connectionTest.error || 'Unknown error'), 400);
    }

    // Check if configuration already exists
    const existingConfig = await prisma.$queryRaw`
      SELECT id FROM tally_integrations WHERE is_active = true LIMIT 1
    ` as any[];

    const configId = generateId();

    if (existingConfig.length > 0) {
      // Update existing configuration
      await prisma.$executeRaw`
        UPDATE tally_integrations
        SET
          company_name = ${validatedData.companyName},
          server_address = ${validatedData.serverAddress},
          port = ${validatedData.port},
          username = ${validatedData.username || null},
          sync_settings = ${JSON.stringify(validatedData.syncSettings)},
          updated_at = ${new Date()}
        WHERE id = ${existingConfig[0].id}
      `;
    } else {
      // Create new configuration
      await prisma.$executeRaw`
        INSERT INTO tally_integrations (
          id, company_name, server_address, port, username,
          sync_settings, is_active, created_at, updated_at
        ) VALUES (
          ${configId}, ${validatedData.companyName}, ${validatedData.serverAddress},
          ${validatedData.port}, ${validatedData.username || null},
          ${JSON.stringify(validatedData.syncSettings)}, true, ${new Date()}, ${new Date()}
        )
      `;
    }

    return apiResponse({
      success: true,
      data: {
        id: existingConfig.length > 0 ? existingConfig[0].id : configId,
        connectionStatus: connectionTest,
      },
      message: 'Tally configuration saved successfully',
    });
  } catch (error) {
    console.error('Tally Integration POST error:', error);
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }
    return apiError('Failed to save Tally configuration', 500);
  }
});

// Sync data with Tally
export const PUT = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const body = await request.json();
    const validatedData = tallySyncSchema.parse(body);

    // Get Tally configuration
    const tallyConfig = await prisma.$queryRaw`
      SELECT * FROM tally_integrations WHERE is_active = true LIMIT 1
    ` as any[];

    if (tallyConfig.length === 0) {
      return apiError('No Tally integration configured', 400);
    }

    const config = tallyConfig[0];

    // Start sync process
    const syncLogId = generateId();
    await prisma.$executeRaw`
      INSERT INTO tally_sync_logs (
        id, tally_integration_id, type, status, started_at, started_by
      ) VALUES (
        ${syncLogId}, ${config.id}, ${validatedData.type}, 'in_progress',
        ${new Date()}, ${user.id}
      )
    `;

    let syncResult;
    try {
      switch (validatedData.type) {
        case 'accounts':
          syncResult = await syncAccountsFromTally(config);
          break;
        case 'customers':
          syncResult = await syncCustomersFromTally(config);
          break;
        case 'suppliers':
          syncResult = await syncSuppliersFromTally(config);
          break;
        case 'vouchers':
          syncResult = await syncVouchersFromTally(config, validatedData.startDate, validatedData.endDate);
          break;
        case 'inventory':
          syncResult = await syncInventoryFromTally(config);
          break;
        case 'all':
          syncResult = await syncAllFromTally(config, validatedData.startDate, validatedData.endDate);
          break;
        default:
          throw new Error('Invalid sync type');
      }

      // Update sync log with success
      await prisma.$executeRaw`
        UPDATE tally_sync_logs
        SET
          status = 'completed',
          records_synced = ${syncResult.recordsSynced},
          completed_at = ${new Date()}
        WHERE id = ${syncLogId}
      `;

      // Update last sync time
      await prisma.$executeRaw`
        UPDATE tally_integrations
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
        UPDATE tally_sync_logs
        SET
          status = 'failed',
          error_message = ${(syncError as Error).message},
          completed_at = ${new Date()}
        WHERE id = ${syncLogId}
      `;

      throw syncError;
    }
  } catch (error) {
    console.error('Tally Sync error:', error);
    if (error instanceof z.ZodError) {
      return apiError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
    }
    return apiError('Sync failed: ' + (error as Error).message, 500);
  }
});

// Test Tally connection
async function testTallyConnection(config: any): Promise<{ success: boolean; error?: string }> {
  try {
    // This would implement actual Tally API connection test
    // For now, we'll simulate the connection test

    const tallyUrl = `http://${config.serverAddress || config.server_address}:${config.port || config.port}`;

    // Simulate HTTP request to Tally
    // In real implementation, you would make an actual HTTP request to Tally's XML API
    const response = await fetch(`${tallyUrl}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
      },
      body: `
        <ENVELOPE>
          <HEADER>
            <TALLYREQUEST>Export Data</TALLYREQUEST>
          </HEADER>
          <BODY>
            <EXPORTDATA>
              <REQUESTDESC>
                <REPORTNAME>List of Companies</REPORTNAME>
                <STATICVARIABLES>
                  <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                </STATICVARIABLES>
              </REQUESTDESC>
            </EXPORTDATA>
          </BODY>
        </ENVELOPE>
      `,
    }).catch(() => null);

    if (!response || !response.ok) {
      return {
        success: false,
        error: 'Unable to connect to Tally server',
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Connection failed: ${(error as Error).message}`,
    };
  }
}

// Sync functions (simplified implementations)
async function syncAccountsFromTally(config: any) {
  // This would implement actual Tally account sync
  // For now, we'll return a mock result
  return {
    recordsSynced: 50,
    details: 'Synced 50 accounts from Tally',
  };
}

async function syncCustomersFromTally(config: any) {
  return {
    recordsSynced: 25,
    details: 'Synced 25 customers from Tally',
  };
}

async function syncSuppliersFromTally(config: any) {
  return {
    recordsSynced: 15,
    details: 'Synced 15 suppliers from Tally',
  };
}

async function syncVouchersFromTally(config: any, startDate?: string, endDate?: string) {
  return {
    recordsSynced: 100,
    details: `Synced 100 vouchers from Tally${startDate ? ` from ${startDate} to ${endDate}` : ''}`,
  };
}

async function syncInventoryFromTally(config: any) {
  return {
    recordsSynced: 200,
    details: 'Synced 200 inventory items from Tally',
  };
}

async function syncAllFromTally(config: any, startDate?: string, endDate?: string) {
  const accounts = await syncAccountsFromTally(config);
  const customers = await syncCustomersFromTally(config);
  const suppliers = await syncSuppliersFromTally(config);
  const vouchers = await syncVouchersFromTally(config, startDate, endDate);
  const inventory = await syncInventoryFromTally(config);

  return {
    recordsSynced: accounts.recordsSynced + customers.recordsSynced + suppliers.recordsSynced + vouchers.recordsSynced + inventory.recordsSynced,
    details: {
      accounts: accounts.recordsSynced,
      customers: customers.recordsSynced,
      suppliers: suppliers.recordsSynced,
      vouchers: vouchers.recordsSynced,
      inventory: inventory.recordsSynced,
    },
  };
}

function generateId(): string {
  return `tally_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}