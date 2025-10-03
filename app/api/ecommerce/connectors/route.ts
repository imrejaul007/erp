import { NextRequest } from 'next/server';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

export interface EcommerceConnector {
  id: string;
  name: string;
  type: 'shopify' | 'woocommerce' | 'magento' | 'bigcommerce' | 'opencart' | 'custom';
  description: string;
  status: 'active' | 'inactive' | 'error' | 'syncing';
  configuration: {
    apiUrl?: string;
    apiKey?: string;
    secretKey?: string;
    storeUrl?: string;
    storeName?: string;
    currency?: string;
    language?: string;
    timezone?: string;
    webhookUrl?: string;
    syncFrequency?: number; // minutes
    lastSyncAt?: string;
    autoSync?: boolean;
  };
  mappings: {
    productFields: { [key: string]: string };
    categoryFields: { [key: string]: string };
    customerFields: { [key: string]: string };
    orderFields: { [key: string]: string };
  };
  syncSettings: {
    syncProducts: boolean;
    syncCategories: boolean;
    syncCustomers: boolean;
    syncOrders: boolean;
    syncInventory: boolean;
    syncPricing: boolean;
    bidirectional: boolean;
    conflictResolution: 'erpWins' | 'ecommerceWins' | 'lastUpdatedWins' | 'manual';
  };
  filters: {
    productCategories?: string[];
    priceRange?: { min: number; max: number };
    brands?: string[];
    excludeOutOfStock?: boolean;
    onlyFeatured?: boolean;
  };
  transformations: {
    priceMultiplier?: number;
    categoryMapping?: { [key: string]: string };
    brandMapping?: { [key: string]: string };
    imageTransformation?: {
      resize: boolean;
      quality: number;
      format: 'webp' | 'jpg' | 'png';
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface SyncOperation {
  id: string;
  connectorId: string;
  type: 'full' | 'incremental' | 'manual';
  operation: 'export' | 'import' | 'bidirectional';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  progress: {
    total: number;
    processed: number;
    succeeded: number;
    failed: number;
    skipped: number;
  };
  summary: {
    productsProcessed: number;
    categoriesProcessed: number;
    customersProcessed: number;
    ordersProcessed: number;
    inventoryUpdates: number;
    errors: Array<{
      type: string;
      message: string;
      itemId?: string;
      details?: any;
    }>;
  };
  logs: Array<{
    timestamp: string;
    level: 'info' | 'warning' | 'error';
    message: string;
    details?: any;
  }>;
}

// Mock connectors database
const connectors: EcommerceConnector[] = [
  {
    id: 'shopify_001',
    name: 'Oud Premium Shopify Store',
    type: 'shopify',
    description: 'Main Shopify store for online sales',
    status: 'active',
    configuration: {
      storeUrl: 'oud-premium.myshopify.com',
      storeName: 'Oud Premium',
      currency: 'AED',
      language: 'en',
      timezone: 'Asia/Dubai',
      syncFrequency: 30,
      lastSyncAt: '2024-06-30T10:30:00Z',
      autoSync: true
    },
    mappings: {
      productFields: {
        'name': 'title',
        'description': 'body_html',
        'sku': 'variants.sku',
        'price': 'variants.price',
        'inventory': 'variants.inventory_quantity',
        'weight': 'variants.weight',
        'images': 'images'
      },
      categoryFields: {
        'name': 'title',
        'description': 'body_html'
      },
      customerFields: {
        'name': 'first_name,last_name',
        'email': 'email',
        'phone': 'phone'
      },
      orderFields: {
        'total': 'total_price',
        'status': 'fulfillment_status',
        'items': 'line_items'
      }
    },
    syncSettings: {
      syncProducts: true,
      syncCategories: true,
      syncCustomers: true,
      syncOrders: true,
      syncInventory: true,
      syncPricing: true,
      bidirectional: true,
      conflictResolution: 'lastUpdatedWins'
    },
    filters: {
      excludeOutOfStock: false,
      onlyFeatured: false
    },
    transformations: {
      priceMultiplier: 1.0,
      imageTransformation: {
        resize: true,
        quality: 85,
        format: 'webp'
      }
    },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-06-30T10:30:00Z'
  },
  {
    id: 'woocommerce_001',
    name: 'WooCommerce B2B Portal',
    type: 'woocommerce',
    description: 'B2B wholesale portal on WooCommerce',
    status: 'active',
    configuration: {
      apiUrl: 'https://b2b.oudpremium.ae/wp-json/wc/v3/',
      storeUrl: 'b2b.oudpremium.ae',
      storeName: 'Oud Premium B2B',
      currency: 'AED',
      language: 'en',
      timezone: 'Asia/Dubai',
      syncFrequency: 60,
      lastSyncAt: '2024-06-30T09:00:00Z',
      autoSync: true
    },
    mappings: {
      productFields: {
        'name': 'name',
        'description': 'description',
        'sku': 'sku',
        'price': 'regular_price',
        'salePrice': 'sale_price',
        'inventory': 'stock_quantity',
        'weight': 'weight',
        'images': 'images'
      },
      categoryFields: {
        'name': 'name',
        'description': 'description',
        'slug': 'slug'
      },
      customerFields: {
        'name': 'first_name,last_name',
        'email': 'email',
        'company': 'billing.company'
      },
      orderFields: {
        'total': 'total',
        'status': 'status',
        'items': 'line_items'
      }
    },
    syncSettings: {
      syncProducts: true,
      syncCategories: true,
      syncCustomers: true,
      syncOrders: true,
      syncInventory: true,
      syncPricing: true,
      bidirectional: false,
      conflictResolution: 'erpWins'
    },
    filters: {
      productCategories: ['Premium Oud', 'Attar', 'Accessories'],
      priceRange: { min: 100, max: 5000 },
      excludeOutOfStock: true
    },
    transformations: {
      priceMultiplier: 0.85, // Wholesale discount
      categoryMapping: {
        'Premium Oud': 'wholesale-oud',
        'Attar': 'wholesale-attar'
      }
    },
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-06-30T09:00:00Z'
  },
  {
    id: 'magento_001',
    name: 'Magento Enterprise Store',
    type: 'magento',
    description: 'High-volume Magento store for premium customers',
    status: 'inactive',
    configuration: {
      apiUrl: 'https://premium.oudstore.com/rest/V1/',
      storeUrl: 'premium.oudstore.com',
      storeName: 'Oud Premium Enterprise',
      currency: 'AED',
      language: 'en',
      timezone: 'Asia/Dubai',
      syncFrequency: 120,
      autoSync: false
    },
    mappings: {
      productFields: {
        'name': 'name',
        'description': 'custom_attributes.description',
        'sku': 'sku',
        'price': 'price',
        'inventory': 'extension_attributes.stock_item.qty'
      },
      categoryFields: {
        'name': 'name',
        'description': 'custom_attributes.description'
      },
      customerFields: {
        'name': 'firstname,lastname',
        'email': 'email'
      },
      orderFields: {
        'total': 'grand_total',
        'status': 'status'
      }
    },
    syncSettings: {
      syncProducts: true,
      syncCategories: true,
      syncCustomers: false,
      syncOrders: true,
      syncInventory: true,
      syncPricing: true,
      bidirectional: false,
      conflictResolution: 'erpWins'
    },
    filters: {
      onlyFeatured: true,
      priceRange: { min: 200, max: 10000 }
    },
    transformations: {
      priceMultiplier: 1.15, // Premium markup
      imageTransformation: {
        resize: true,
        quality: 95,
        format: 'jpg'
      }
    },
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-06-15T00:00:00Z'
  }
];

// Mock sync operations
const syncOperations: SyncOperation[] = [
  {
    id: 'sync_001',
    connectorId: 'shopify_001',
    type: 'incremental',
    operation: 'export',
    status: 'completed',
    startedAt: '2024-06-30T10:00:00Z',
    completedAt: '2024-06-30T10:30:00Z',
    progress: {
      total: 150,
      processed: 150,
      succeeded: 145,
      failed: 3,
      skipped: 2
    },
    summary: {
      productsProcessed: 120,
      categoriesProcessed: 15,
      customersProcessed: 0,
      ordersProcessed: 10,
      inventoryUpdates: 120,
      errors: [
        {
          type: 'validation_error',
          message: 'Product weight exceeds platform limit',
          itemId: 'OUD-ROYAL-001',
          details: { maxWeight: '50kg', actualWeight: '60kg' }
        },
        {
          type: 'api_error',
          message: 'Rate limit exceeded',
          details: { retryAfter: 60 }
        }
      ]
    },
    logs: [
      {
        timestamp: '2024-06-30T10:00:00Z',
        level: 'info',
        message: 'Starting incremental sync for Shopify store'
      },
      {
        timestamp: '2024-06-30T10:15:00Z',
        level: 'warning',
        message: 'Product OUD-ROYAL-001 weight exceeds platform limit'
      },
      {
        timestamp: '2024-06-30T10:30:00Z',
        level: 'info',
        message: 'Sync completed successfully'
      }
    ]
  }
];

// Shopify specific functions
class ShopifyConnector {
  static async syncProducts(connector: EcommerceConnector, products: any[]): Promise<any> {
    // Mock Shopify product sync
    const results = {
      created: 0,
      updated: 0,
      errors: [] as Array<{type: string, message: string, itemId?: string, details?: any}>
    };

    for (const product of products) {
      try {
        // Transform product data for Shopify
        const shopifyProduct = {
          title: product.name,
          body_html: product.description,
          vendor: product.brand,
          product_type: product.category,
          variants: [{
            itemId: product.sku,
            price: (product.retailPrice * (connector.transformations.priceMultiplier || 1)).toFixed(2),
            inventory_quantity: product.stock?.quantity || 0,
            weight: product.specifications?.weight || 0,
            weight_unit: 'g'
          }],
          images: product.images?.map((url: string) => ({ src: url })) || []
        };

        // Mock API call
        console.log('Creating/updating Shopify product:', shopifyProduct.title);
        results.updated++;

      } catch (error) {
        results.errors.push({
          type: 'product_sync_error',
          itemId: product.sku,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  static async syncInventory(connector: EcommerceConnector, inventoryUpdates: any[]): Promise<any> {
    // Mock Shopify inventory sync
    const results = {
      updated: 0,
      errors: [] as Array<{type: string, message: string, itemId?: string, details?: any}>
    };

    for (const update of inventoryUpdates) {
      try {
        // Mock inventory update
        console.log(`Updating Shopify inventory for ${update.sku}: ${update.quantity}`);
        results.updated++;
      } catch (error) {
        results.errors.push({
          type: 'inventory_sync_error',
          itemId: update.sku,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  static async importOrders(connector: EcommerceConnector): Promise<any> {
    // Mock Shopify order import
    const mockOrders = [
      {
        id: 'shopify_order_001',
        order_number: 'SO-001',
        email: 'customer@example.com',
        total_price: '650.00',
        currency: 'AED',
        financial_status: 'paid',
        fulfillment_status: 'pending',
        line_items: [
          {
            itemId: 'OUD-ROYAL-001',
            quantity: 1,
            price: '650.00'
          }
        ],
        created_at: '2024-06-30T08:00:00Z'
      }
    ];

    return {
      orders: mockOrders,
      imported: mockOrders.length
    };
  }
}

// WooCommerce specific functions
class WooCommerceConnector {
  static async syncProducts(connector: EcommerceConnector, products: any[]): Promise<any> {
    const results = {
      created: 0,
      updated: 0,
      errors: [] as Array<{type: string, message: string, itemId?: string, details?: any}>
    };

    for (const product of products) {
      try {
        const wooProduct = {
          name: product.name,
          description: product.description,
          itemId: product.sku,
          regular_price: (product.wholesalePrice * (connector.transformations.priceMultiplier || 1)).toFixed(2),
          stock_quantity: product.stock?.quantity || 0,
          weight: product.specifications?.weight || 0,
          categories: [{ name: product.category }],
          images: product.images?.map((url: string) => ({ src: url })) || []
        };

        console.log('Creating/updating WooCommerce product:', wooProduct.name);
        results.updated++;

      } catch (error) {
        results.errors.push({
          type: 'product_sync_error',
          itemId: product.sku,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }
}

// Generic sync function
async function performSync(connectorId: string, operation: 'export' | 'import' | 'bidirectional'): Promise<SyncOperation> {
  const connector = connectors.find(c => c.id === connectorId);
  if (!connector) {
    throw new Error('Connector not found');
  }

  const syncOp: SyncOperation = {
    id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    connectorId,
    type: 'manual',
    operation,
    status: 'running',
    startedAt: new Date().toISOString(),
    progress: {
      total: 0,
      processed: 0,
      succeeded: 0,
      failed: 0,
      skipped: 0
    },
    summary: {
      productsProcessed: 0,
      categoriesProcessed: 0,
      customersProcessed: 0,
      ordersProcessed: 0,
      inventoryUpdates: 0,
      errors: [] as Array<{type: string, message: string, itemId?: string, details?: any}>
    },
    logs: [{
      timestamp: new Date().toISOString(),
      level: 'info',
      message: `Starting ${operation} sync for ${connector.name}`
    }]
  };

  try {
    // Simulate sync process
    if (operation === 'export' || operation === 'bidirectional') {
      // Export products to e-commerce platform
      const mockProducts = [
        {
          name: 'Royal Oud Collection',
          itemId: 'OUD-ROYAL-001',
          description: 'Premium oud fragrance',
          category: 'Premium Oud',
          brand: 'Royal Heritage',
          retailPrice: 650,
          wholesalePrice: 520,
          stock: { quantity: 45 },
          images: ['https://example.com/image1.jpg']
        }
      ];

      let syncResult;
      switch (connector.type) {
        case 'shopify':
          syncResult = await ShopifyConnector.syncProducts(connector, mockProducts);
          break;
        case 'woocommerce':
          syncResult = await WooCommerceConnector.syncProducts(connector, mockProducts);
          break;
        default:
          throw new Error(`Connector type ${connector.type} not supported`);
      }

      syncOp.summary.productsProcessed = mockProducts.length;
      syncOp.progress.total = mockProducts.length;
      syncOp.progress.processed = mockProducts.length;
      syncOp.progress.succeeded = syncResult.updated;
      syncOp.summary.errors = syncResult.errors;
    }

    if (operation === 'import' || operation === 'bidirectional') {
      // Import orders from e-commerce platform
      if (connector.type === 'shopify') {
        const orderResult = await ShopifyConnector.importOrders(connector);
        syncOp.summary.ordersProcessed = orderResult.imported;
      }
    }

    syncOp.status = 'completed';
    syncOp.completedAt = new Date().toISOString();
    syncOp.logs.push({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Sync completed successfully'
    });

    // Update connector last sync time
    connector.configuration.lastSyncAt = new Date().toISOString();

  } catch (error) {
    syncOp.status = 'failed';
    syncOp.completedAt = new Date().toISOString();
    syncOp.logs.push({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }

  return syncOp;
}

// GET endpoint - retrieve connectors
export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const includeConfig = searchParams.get('includeConfig') === 'true';

    let filteredConnectors = [...connectors];

    if (type) {
      filteredConnectors = filteredConnectors.filter(c => c.type === type);
    }

    if (status) {
      filteredConnectors = filteredConnectors.filter(c => c.status === status);
    }

    // Remove sensitive configuration data unless explicitly requested
    const responseConnectors = filteredConnectors.map(connector => {
      const { configuration, ...safeConnector } = connector;

      if (includeConfig) {
        // Remove sensitive keys
        const { apiKey, secretKey, ...safeConfig } = configuration;
        return {
          ...safeConnector,
          configuration: {
            ...safeConfig,
            apiKey: apiKey ? '***' : undefined,
            secretKey: secretKey ? '***' : undefined
          }
        };
      }

      return {
        ...safeConnector,
        configuration: {
          storeUrl: configuration.storeUrl,
          storeName: configuration.storeName,
          currency: configuration.currency,
          lastSyncAt: configuration.lastSyncAt,
          autoSync: configuration.autoSync
        }
      };
    });

    return apiResponse({
      connectors: responseConnectors,
      total: responseConnectors.length,
      supportedPlatforms: [
        { type: 'shopify', name: 'Shopify', description: 'Shopify e-commerce platform' },
        { type: 'woocommerce', name: 'WooCommerce', description: 'WordPress WooCommerce plugin' },
        { type: 'magento', name: 'Magento', description: 'Magento e-commerce platform' },
        { type: 'bigcommerce', name: 'BigCommerce', description: 'BigCommerce e-commerce platform' },
        { type: 'opencart', name: 'OpenCart', description: 'OpenCart e-commerce platform' }
      ]
    });

  } catch (error) {
    console.error('Get connectors message:', error);
    return apiError('Failed to retrieve connectors', 500);
  }
});

// POST endpoint - create connector or start sync
export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case 'create_connector':
        // Create new connector
        const newConnector: EcommerceConnector = {
          id: `${data.type}_${Date.now()}`,
          ...data,
          status: 'inactive',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        connectors.push(newConnector);

        return apiResponse({
          success: true,
          connector: newConnector,
          message: 'Connector created successfully'
        });

      case 'test_connection':
        // Test connector connection
        const { connectorId } = data;
        const connector = connectors.find(c => c.id === connectorId);

        if (!connector) {
          return apiError('Connector not found', 404);
        }

        // Mock connection test
        const testResult = {
          success: true,
          message: 'Connection successful',
          details: {
            platform: connector.type,
            store: connector.configuration.storeName,
            apiVersion: '2023-10',
            responseTime: '125ms'
          }
        };

        return apiResponse(testResult);

      case 'start_sync':
        // Start synchronization
        const { connectorId: syncConnectorId, operation = 'export' } = data;

        const syncOperation = await performSync(syncConnectorId, operation);

        return apiResponse({
          success: true,
          syncOperation,
          message: 'Sync started successfully'
        });

      default:
        return apiError('Invalid action', 400);
    }

  } catch (error) {
    console.error('Connector operation message:', error);
    return apiError('Failed to process request', 500);
  }
});

// PUT endpoint - update connector
export const PUT = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { connectorId, ...updates } = await request.json();

    const connectorIndex = connectors.findIndex(c => c.id === connectorId);
    if (connectorIndex === -1) {
      return apiError('Connector not found', 404);
    }

    // Update connector
    connectors[connectorIndex] = {
      ...connectors[connectorIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return apiResponse({
      success: true,
      connector: connectors[connectorIndex],
      message: 'Connector updated successfully'
    });

  } catch (error) {
    console.error('Update connector message:', error);
    return apiError('Failed to update connector', 500);
  }
});

// DELETE endpoint - remove connector
export const DELETE = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const connectorId = searchParams.get('connectorId');

    if (!connectorId) {
      return apiError('Connector ID is required', 400);
    }

    const connectorIndex = connectors.findIndex(c => c.id === connectorId);
    if (connectorIndex === -1) {
      return apiError('Connector not found', 404);
    }

    // Remove connector
    connectors.splice(connectorIndex, 1);

    return apiResponse({
      success: true,
      message: 'Connector deleted successfully'
    });

  } catch (error) {
    console.error('Delete connector message:', error);
    return apiError('Failed to delete connector', 500);
  }
});