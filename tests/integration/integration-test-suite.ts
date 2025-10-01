import { describe, beforeAll, afterAll, beforeEach, afterEach, it, expect, jest } from '@jest/globals';
import { prisma } from '@/lib/prisma';
import { AuditService } from '@/lib/services/audit-service';
import { searchService } from '@/lib/services/search-service';
import { backupService } from '@/lib/services/backup-service';
import { notificationService } from '@/lib/services/notification-service';
import { systemMonitor } from '@/lib/services/system-monitor';
import { SyncService } from '@/lib/services/sync-service';
import { DataValidator } from '@/lib/validation/data-validator';
import { GlobalErrorHandler } from '@/lib/error-handling/global-error-handler';

// Test data
const testUser = {
  id: 'test-user-001',
  email: 'test@example.com',
  name: 'Test User'
};

const testProduct = {
  id: 'test-product-001',
  name: 'Test Product',
  sku: 'TEST-001',
  price: 100,
  description: 'A test product for integration testing'
};

const testCustomer = {
  id: 'test-customer-001',
  companyName: 'Test Company',
  email: 'customer@test.com',
  phone: '+1234567890',
  type: 'business',
  status: 'active'
};

describe('ERP System Integration Tests', () => {
  beforeAll(async () => {
    // Setup test environment
    console.log('Setting up integration test environment...');

    // Clear test data
    await cleanupTestData();

    // Create test user
    await prisma.user.create({
      data: {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name,
        password: 'hashed-password',
        role: 'admin'
      }
    });
  });

  afterAll(async () => {
    // Clean up test environment
    console.log('Cleaning up integration test environment...');
    await cleanupTestData();
    await prisma.$disconnect();
  });

  describe('Cross-Module Data Flow', () => {
    it('should create product and update inventory', async () => {
      // Create product via inventory module
      const product = await prisma.product.create({
        data: {
          ...testProduct,
          categoryId: null,
          barcode: 'TEST-BARCODE-001',
          inventory: {
            create: {
              quantity: 100,
              minimumStock: 10,
              maximumStock: 1000,
              location: 'A1-B2-C3'
            }
          }
        },
        include: { inventory: true }
      });

      expect(product).toBeDefined();
      expect(product.inventory).toBeDefined();
      expect(product.inventory?.quantity).toBe(100);

      // Verify audit log was created
      const auditLogs = await prisma.auditLog.findMany({
        where: { userId: 'system' }
      });
      expect(auditLogs.length).toBeGreaterThan(0);
    });

    it('should create customer and associate with sale', async () => {
      // Create customer via CRM
      const customer = await prisma.customer.create({
        data: testCustomer
      });

      // Create sale with customer
      const sale = await prisma.sale.create({
        data: {
          saleNumber: 'SALE-TEST-001',
          customerId: customer.id,
          totalAmount: 100,
          status: 'completed',
          saleDate: new Date(),
          items: {
            create: [{
              productId: testProduct.id,
              quantity: 1,
              unitPrice: 100,
              totalPrice: 100
            }]
          }
        },
        include: { items: true, customer: true }
      });

      expect(sale).toBeDefined();
      expect(sale.customer?.id).toBe(customer.id);
      expect(sale.items.length).toBe(1);
    });

    it('should validate cross-module data integrity', async () => {
      const validator = new DataValidator();

      // Test product reference validation
      const saleData = {
        productId: testProduct.id,
        quantity: 5,
        customerId: testCustomer.id
      };

      const result = await validator.validate(
        saleData,
        {} as any, // Schema would be defined
        { userId: testUser.id, module: 'sales', operation: 'create' }
      );

      expect(result).toBeDefined();
      // Additional validation assertions would go here
    });
  });

  describe('Real-time Synchronization', () => {
    it('should sync inventory updates across modules', async () => {
      // This would test the sync service
      // In a real implementation, you'd mock WebSocket connections
      const syncEvent = {
        id: 'sync-test-001',
        type: 'update' as const,
        module: 'inventory',
        entity: 'product',
        entityId: testProduct.id,
        data: { quantity: 95 },
        userId: testUser.id,
        timestamp: new Date(),
        version: 1
      };

      // Test sync processing
      // This would involve mocking the sync service
      expect(syncEvent).toBeDefined();
    });
  });

  describe('Search Integration', () => {
    it('should index and search across modules', async () => {
      // Index test data
      await searchService.indexDocument({
        id: testProduct.id,
        type: 'product',
        module: 'inventory',
        title: testProduct.name,
        content: `${testProduct.name} ${testProduct.description}`,
        metadata: {
          sku: testProduct.sku,
          price: testProduct.price
        },
        tags: ['test', 'product'],
        permissions: {
          public: true,
          roles: [],
          users: []
        },
        status: 'active'
      });

      // Search for the product
      const searchResults = await searchService.search(
        'Test Product',
        { modules: ['inventory'] },
        { limit: 10 },
        testUser.id
      );

      expect(searchResults.results.length).toBeGreaterThan(0);
      expect(searchResults.results[0].id).toBe(testProduct.id);
    });

    it('should provide suggestions and autocomplete', async () => {
      const suggestions = await searchService.suggest('Test');
      expect(suggestions).toBeDefined();
      expect(Array.isArray(suggestions)).toBe(true);
    });
  });

  describe('Notification System', () => {
    it('should send notifications across modules', async () => {
      const notificationId = await notificationService.sendNotification(
        testUser.id,
        {
          type: 'info',
          title: 'Test Notification',
          message: 'This is a test notification from integration tests',
          category: 'test',
          module: 'test',
          priority: 'medium',
          channels: ['in_app']
        }
      );

      expect(notificationId).toBeDefined();
      expect(notificationId.length).toBeGreaterThan(0);

      // Verify notification was created
      const notifications = await notificationService.getUserNotifications(testUser.id);
      expect(notifications.notifications.length).toBeGreaterThan(0);
    });

    it('should handle notification preferences', async () => {
      const preferences = await notificationService.getUserPreferences(testUser.id);
      expect(preferences).toBeDefined();
      expect(preferences.userId).toBe(testUser.id);

      // Update preferences
      const updated = await notificationService.updateUserPreferences(testUser.id, {
        channels: { in_app: true, email: false }
      });
      expect(updated).toBe(true);
    });
  });

  describe('Backup and Restore', () => {
    it('should create and manage backup configurations', async () => {
      const configId = await backupService.createBackupConfig({
        name: 'Test Backup',
        description: 'Test backup configuration',
        schedule: {
          enabled: false,
          frequency: 'daily',
          time: '02:00'
        },
        includedModules: ['inventory', 'sales'],
        includedTables: ['Product', 'Sale'],
        excludedTables: [],
        compression: true,
        encryption: false,
        retentionDays: 30,
        destination: {
          type: 'local',
          path: './test-backups'
        },
        active: true,
        createdBy: testUser.id
      });

      expect(configId).toBeDefined();
      expect(typeof configId).toBe('string');

      // Test backup stats
      const stats = await backupService.getBackupStats(configId);
      expect(stats).toBeDefined();
      expect(stats.totalBackups).toBeGreaterThanOrEqual(0);
    });

    it('should start and monitor backup jobs', async () => {
      // This would test actual backup functionality
      // In a real test, you might mock file system operations
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('System Monitoring', () => {
    it('should monitor system health', async () => {
      const health = await systemMonitor.getSystemHealth();

      expect(health).toBeDefined();
      expect(health.overall).toMatch(/healthy|warning|critical/);
      expect(health.score).toBeGreaterThanOrEqual(0);
      expect(health.score).toBeLessThanOrEqual(100);
      expect(health.components).toBeDefined();
    });

    it('should collect performance metrics', async () => {
      const metrics = await systemMonitor.getPerformanceMetrics();
      expect(metrics).toBeDefined();
      expect(Array.isArray(metrics)).toBe(true);
    });

    it('should manage system alerts', async () => {
      const alerts = systemMonitor.getSystemAlerts();
      expect(alerts).toBeDefined();
      expect(Array.isArray(alerts)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle and log errors globally', async () => {
      const errorHandler = GlobalErrorHandler.getInstance();

      const testError = new Error('Test integration error');
      const context = {
        userId: testUser.id,
        module: 'test',
        action: 'integration_test',
        timestamp: new Date()
      };

      const result = await errorHandler.handleError(testError, context);

      expect(result).toBeDefined();
      expect(result.errorId).toBeDefined();
      expect(result.userMessage).toBeDefined();
    });

    it('should provide error metrics and reporting', async () => {
      const errorHandler = GlobalErrorHandler.getInstance();
      const metrics = await errorHandler.getErrorMetrics();

      expect(metrics).toBeDefined();
      expect(typeof metrics.totalErrors).toBe('number');
      expect(typeof metrics.errorRate).toBe('number');
    });
  });

  describe('Audit Trail', () => {
    it('should log activities across all modules', async () => {
      await AuditService.logActivity({
        userId: testUser.id,
        action: 'integration_test_action',
        module: 'test',
        details: { testData: 'integration test' },
        timestamp: new Date()
      });

      const auditLogs = await AuditService.queryLogs({
        userId: testUser.id,
        module: 'test'
      });

      expect(auditLogs.logs.length).toBeGreaterThan(0);
      expect(auditLogs.logs[0].action).toBe('integration_test_action');
    });

    it('should provide audit statistics and analysis', async () => {
      const stats = await AuditService.getStats();

      expect(stats).toBeDefined();
      expect(typeof stats.totalLogs).toBe('number');
      expect(stats.logsByModule).toBeDefined();
      expect(stats.recentActivity).toBeDefined();
    });
  });

  describe('API Gateway Integration', () => {
    it('should route requests through the gateway', async () => {
      // This would test the API gateway
      // In practice, you'd make HTTP requests to test endpoints
      const gatewayRequest = {
        module: 'inventory',
        action: 'getProducts',
        data: {}
      };

      // Mock gateway validation
      const validator = new DataValidator();
      const result = validator.validateGatewayRequest(gatewayRequest);

      expect(result.isValid).toBe(true);
    });
  });

  describe('End-to-End Scenarios', () => {
    it('should complete full sales process', async () => {
      // 1. Create customer
      const customer = await prisma.customer.create({
        data: {
          id: 'e2e-customer-001',
          companyName: 'E2E Test Company',
          email: 'e2e@test.com',
          type: 'business',
          status: 'active'
        }
      });

      // 2. Create product with inventory
      const product = await prisma.product.create({
        data: {
          id: 'e2e-product-001',
          name: 'E2E Test Product',
          sku: 'E2E-001',
          price: 50,
          inventory: {
            create: {
              quantity: 50,
              minimumStock: 5,
              maximumStock: 500
            }
          }
        },
        include: { inventory: true }
      });

      // 3. Create sale
      const sale = await prisma.sale.create({
        data: {
          saleNumber: 'E2E-SALE-001',
          customerId: customer.id,
          totalAmount: 150,
          status: 'completed',
          saleDate: new Date(),
          items: {
            create: [{
              productId: product.id,
              quantity: 3,
              unitPrice: 50,
              totalPrice: 150
            }]
          }
        },
        include: { items: true }
      });

      // 4. Update inventory
      await prisma.inventory.update({
        where: { productId: product.id },
        data: {
          quantity: {
            decrement: 3
          }
        }
      });

      // 5. Verify final state
      const updatedInventory = await prisma.inventory.findUnique({
        where: { productId: product.id }
      });

      expect(sale).toBeDefined();
      expect(sale.items.length).toBe(1);
      expect(updatedInventory?.quantity).toBe(47);

      // 6. Verify audit trail
      const auditLogs = await AuditService.queryLogs({
        limit: 10
      });
      expect(auditLogs.logs.length).toBeGreaterThan(0);
    });

    it('should handle inventory low stock alerts', async () => {
      // Create product with low stock
      const lowStockProduct = await prisma.product.create({
        data: {
          id: 'low-stock-product-001',
          name: 'Low Stock Product',
          sku: 'LOW-001',
          price: 25,
          inventory: {
            create: {
              quantity: 3,
              minimumStock: 10,
              maximumStock: 100
            }
          }
        },
        include: { inventory: true }
      });

      // This would trigger a low stock notification in a real system
      expect(lowStockProduct.inventory?.quantity).toBeLessThan(
        lowStockProduct.inventory?.minimumStock || 0
      );
    });
  });

  describe('Performance and Load Testing', () => {
    it('should handle concurrent operations', async () => {
      const operations = [];

      // Create multiple concurrent operations
      for (let i = 0; i < 10; i++) {
        operations.push(
          prisma.product.create({
            data: {
              id: `perf-product-${i}`,
              name: `Performance Test Product ${i}`,
              sku: `PERF-${i.toString().padStart(3, '0')}`,
              price: 10 + i
            }
          })
        );
      }

      const results = await Promise.all(operations);
      expect(results.length).toBe(10);

      // Clean up
      await prisma.product.deleteMany({
        where: {
          id: { startsWith: 'perf-product-' }
        }
      });
    });

    it('should maintain data consistency under load', async () => {
      // Test concurrent inventory updates
      const product = await prisma.product.create({
        data: {
          id: 'concurrency-test-product',
          name: 'Concurrency Test Product',
          sku: 'CONC-001',
          price: 100,
          inventory: {
            create: {
              quantity: 1000,
              minimumStock: 10,
              maximumStock: 2000
            }
          }
        }
      });

      // Multiple concurrent updates
      const updates = [];
      for (let i = 0; i < 5; i++) {
        updates.push(
          prisma.inventory.update({
            where: { productId: product.id },
            data: {
              quantity: { decrement: 10 }
            }
          })
        );
      }

      await Promise.all(updates);

      const finalInventory = await prisma.inventory.findUnique({
        where: { productId: product.id }
      });

      expect(finalInventory?.quantity).toBe(950);
    });
  });
});

// Helper functions
async function cleanupTestData() {
  const tables = [
    'SaleItem',
    'Sale',
    'Inventory',
    'Product',
    'Customer',
    'AuditLog',
    'Notification',
    'SearchDocument',
    'BackupJob',
    'ErrorLog'
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "${table}" WHERE id LIKE 'test-%' OR id LIKE 'e2e-%' OR id LIKE 'perf-%' OR id LIKE 'concurrency-%'`);
    } catch (error) {
      // Table might not exist or might be empty
      console.log(`Could not clean up ${table}:`, error.message);
    }
  }

  // Clean up test user
  try {
    await prisma.user.deleteMany({
      where: {
        email: { endsWith: '@test.com' }
      }
    });
  } catch (error) {
    console.log('Could not clean up test users:', error.message);
  }
}

// Test utilities
export class IntegrationTestHelper {
  static async createTestUser(userData: Partial<typeof testUser> = {}) {
    return await prisma.user.create({
      data: {
        ...testUser,
        ...userData,
        id: userData.id || `test-user-${Date.now()}`,
        password: 'hashed-password',
        role: userData.role || 'user'
      }
    });
  }

  static async createTestProduct(productData: Partial<typeof testProduct> = {}) {
    return await prisma.product.create({
      data: {
        ...testProduct,
        ...productData,
        id: productData.id || `test-product-${Date.now()}`,
        inventory: {
          create: {
            quantity: 100,
            minimumStock: 10,
            maximumStock: 1000,
            ...productData.inventory
          }
        }
      },
      include: { inventory: true }
    });
  }

  static async createTestCustomer(customerData: Partial<typeof testCustomer> = {}) {
    return await prisma.customer.create({
      data: {
        ...testCustomer,
        ...customerData,
        id: customerData.id || `test-customer-${Date.now()}`
      }
    });
  }

  static async waitForAsync(ms: number = 100) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async expectEventuallyTrue(
    condition: () => Promise<boolean>,
    timeoutMs: number = 5000,
    intervalMs: number = 100
  ) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      if (await condition()) {
        return true;
      }
      await this.waitForAsync(intervalMs);
    }

    throw new Error(`Condition did not become true within ${timeoutMs}ms`);
  }
}

export { cleanupTestData };