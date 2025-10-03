import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Multi-Tenant Seed Script...\n');

  // Step 1: Create Default Tenant
  console.log('📦 Step 1: Creating Default Tenant...');

  const defaultTenant = await prisma.tenant.upsert({
    where: { slug: 'oud-palace-default' },
    update: {},
    create: {
      id: 'default-tenant-oud-palace',
      name: 'Oud Palace',
      nameArabic: 'قصر العود',
      slug: 'oud-palace-default',

      // Business Info
      businessType: 'RETAIL',
      tradeLicense: 'TL-123456',
      vatNumber: 'VAT-AE-123456789',

      // Contact
      ownerName: 'Admin',
      ownerEmail: 'admin@oudpalace.ae',
      ownerPhone: '+971-50-123-4567',
      address: 'Dubai, UAE',
      emirate: 'Dubai',
      city: 'Dubai',

      // Branding
      logoUrl: null,
      primaryColor: '#FF6B35',
      secondaryColor: '#004E89',

      // Subscription
      plan: 'ENTERPRISE',
      planStartDate: new Date(),
      planEndDate: null, // Unlimited
      billingCycle: 'YEARLY',
      maxUsers: 999,
      maxStores: 999,
      maxProducts: 99999,

      // Features - All enabled for default tenant
      features: {
        pos: true,
        inventory: true,
        production: true,
        events: true,
        crm: true,
        finance: true,
        hr: true,
        api: true,
        sampling: true
      },

      // Status
      status: 'ACTIVE',
      isActive: true,
      trialEndsAt: null,

      // Metrics
      totalSales: 0,
      totalOrders: 0,
      activeUsers: 0,
      storageUsed: 0
    }
  });

  console.log(`✅ Default Tenant Created: ${defaultTenant.name} (${defaultTenant.id})\n`);

  // Step 2: Update all existing records with default tenant ID
  console.log('🔄 Step 2: Updating existing records with default tenant ID...\n');

  const tenantId = defaultTenant.id;

  // Update Users
  const usersUpdated = await prisma.$executeRaw`
    UPDATE users SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${usersUpdated} users`);

  // Update UserStores
  const userStoresUpdated = await prisma.$executeRaw`
    UPDATE user_stores SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${userStoresUpdated} user_stores`);

  // Update Customers
  const customersUpdated = await prisma.$executeRaw`
    UPDATE customers SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${customersUpdated} customers`);

  // Update Suppliers
  const suppliersUpdated = await prisma.$executeRaw`
    UPDATE suppliers SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${suppliersUpdated} suppliers`);

  // Update Categories
  const categoriesUpdated = await prisma.$executeRaw`
    UPDATE categories SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${categoriesUpdated} categories`);

  // Update Brands
  const brandsUpdated = await prisma.$executeRaw`
    UPDATE brands SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${brandsUpdated} brands`);

  // Update Products
  const productsUpdated = await prisma.$executeRaw`
    UPDATE products SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${productsUpdated} products`);

  // Update Stores
  const storesUpdated = await prisma.$executeRaw`
    UPDATE stores SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${storesUpdated} stores`);

  // Update StoreInventory
  const storeInventoryUpdated = await prisma.$executeRaw`
    UPDATE store_inventory SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${storeInventoryUpdated} store_inventory`);

  // Update Transfers
  const transfersUpdated = await prisma.$executeRaw`
    UPDATE transfers SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${transfersUpdated} transfers`);

  // Update TransferItems
  const transferItemsUpdated = await prisma.$executeRaw`
    UPDATE transfer_items SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${transferItemsUpdated} transfer_items`);

  // Update Orders
  const ordersUpdated = await prisma.$executeRaw`
    UPDATE orders SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${ordersUpdated} orders`);

  // Update OrderItems
  const orderItemsUpdated = await prisma.$executeRaw`
    UPDATE order_items SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${orderItemsUpdated} order_items`);

  // Update Payments
  const paymentsUpdated = await prisma.$executeRaw`
    UPDATE payments SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${paymentsUpdated} payments`);

  // Update PurchaseOrders
  const purchaseOrdersUpdated = await prisma.$executeRaw`
    UPDATE purchase_orders SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${purchaseOrdersUpdated} purchase_orders`);

  // Update PurchaseOrderItems
  const purchaseOrderItemsUpdated = await prisma.$executeRaw`
    UPDATE purchase_order_items SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${purchaseOrderItemsUpdated} purchase_order_items`);

  // Update Recipes
  const recipesUpdated = await prisma.$executeRaw`
    UPDATE recipes SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${recipesUpdated} recipes`);

  // Update RecipeIngredients
  const recipeIngredientsUpdated = await prisma.$executeRaw`
    UPDATE recipe_ingredients SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${recipeIngredientsUpdated} recipe_ingredients`);

  // Update RecipeVersions
  const recipeVersionsUpdated = await prisma.$executeRaw`
    UPDATE recipe_versions SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${recipeVersionsUpdated} recipe_versions`);

  // Update Materials
  const materialsUpdated = await prisma.$executeRaw`
    UPDATE materials SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${materialsUpdated} materials`);

  // Update BOMs
  const bomsUpdated = await prisma.$executeRaw`
    UPDATE boms SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${bomsUpdated} boms`);

  // Update BOMItems
  const bomItemsUpdated = await prisma.$executeRaw`
    UPDATE bom_items SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${bomItemsUpdated} bom_items`);

  // Update ProductionBatches
  const productionBatchesUpdated = await prisma.$executeRaw`
    UPDATE production_batches SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${productionBatchesUpdated} production_batches`);

  // Update ProductionInputs
  const productionInputsUpdated = await prisma.$executeRaw`
    UPDATE production_inputs SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${productionInputsUpdated} production_inputs`);

  // Update ProductionOutputs
  const productionOutputsUpdated = await prisma.$executeRaw`
    UPDATE production_outputs SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${productionOutputsUpdated} production_outputs`);

  // Update QualityControls
  const qualityControlsUpdated = await prisma.$executeRaw`
    UPDATE quality_controls SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${qualityControlsUpdated} quality_controls`);

  // Update WastageRecords
  const wastageRecordsUpdated = await prisma.$executeRaw`
    UPDATE wastage_records SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${wastageRecordsUpdated} wastage_records`);

  // Update ProcessingStages
  const processingStagesUpdated = await prisma.$executeRaw`
    UPDATE processing_stages SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${processingStagesUpdated} processing_stages`);

  // Update StockMovements
  const stockMovementsUpdated = await prisma.$executeRaw`
    UPDATE stock_movements SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${stockMovementsUpdated} stock_movements`);

  // Update MarketingCampaigns
  const marketingCampaignsUpdated = await prisma.$executeRaw`
    UPDATE marketing_campaigns SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${marketingCampaignsUpdated} marketing_campaigns`);

  // Update CampaignMessages
  const campaignMessagesUpdated = await prisma.$executeRaw`
    UPDATE campaign_messages SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${campaignMessagesUpdated} campaign_messages`);

  // Update CampaignResponses
  const campaignResponsesUpdated = await prisma.$executeRaw`
    UPDATE campaign_responses SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${campaignResponsesUpdated} campaign_responses`);

  // Update CustomerSegments
  const customerSegmentsUpdated = await prisma.$executeRaw`
    UPDATE customer_segments SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${customerSegmentsUpdated} customer_segments`);

  // Update CustomerSegmentMembers
  const customerSegmentMembersUpdated = await prisma.$executeRaw`
    UPDATE customer_segment_members SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${customerSegmentMembersUpdated} customer_segment_members`);

  // Update CustomerComplaints
  const customerComplaintsUpdated = await prisma.$executeRaw`
    UPDATE customer_complaints SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${customerComplaintsUpdated} customer_complaints`);

  // Update LoyaltyPointsTransactions
  const loyaltyPointsTransactionsUpdated = await prisma.$executeRaw`
    UPDATE loyalty_points_transactions SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${loyaltyPointsTransactionsUpdated} loyalty_points_transactions`);

  // Update VIPEvents
  const vipEventsUpdated = await prisma.$executeRaw`
    UPDATE vip_events SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${vipEventsUpdated} vip_events`);

  // Update VIPEventAttendees
  const vipEventAttendeesUpdated = await prisma.$executeRaw`
    UPDATE vip_event_attendees SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${vipEventAttendeesUpdated} vip_event_attendees`);

  // Update VATReturns
  const vatReturnsUpdated = await prisma.$executeRaw`
    UPDATE vat_returns SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${vatReturnsUpdated} vat_returns`);

  // Update BankAccounts
  const bankAccountsUpdated = await prisma.$executeRaw`
    UPDATE bank_accounts SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${bankAccountsUpdated} bank_accounts`);

  // Update BankTransactions
  const bankTransactionsUpdated = await prisma.$executeRaw`
    UPDATE bank_transactions SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${bankTransactionsUpdated} bank_transactions`);

  // Update BankReconciliations
  const bankReconciliationsUpdated = await prisma.$executeRaw`
    UPDATE bank_reconciliations SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${bankReconciliationsUpdated} bank_reconciliations`);

  // Update Employees
  const employeesUpdated = await prisma.$executeRaw`
    UPDATE employees SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${employeesUpdated} employees`);

  // Update Payroll
  const payrollUpdated = await prisma.$executeRaw`
    UPDATE payroll SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${payrollUpdated} payroll`);

  // Update Attendance
  const attendanceUpdated = await prisma.$executeRaw`
    UPDATE attendance SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${attendanceUpdated} attendance`);

  // Update Leaves
  const leavesUpdated = await prisma.$executeRaw`
    UPDATE leaves SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${leavesUpdated} leaves`);

  // Update GiftCards
  const giftCardsUpdated = await prisma.$executeRaw`
    UPDATE gift_cards SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${giftCardsUpdated} gift_cards`);

  // Update GiftCardTransactions
  const giftCardTransactionsUpdated = await prisma.$executeRaw`
    UPDATE gift_card_transactions SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${giftCardTransactionsUpdated} gift_card_transactions`);

  // Update Discounts
  const discountsUpdated = await prisma.$executeRaw`
    UPDATE discounts SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${discountsUpdated} discounts`);

  // Update Promotions
  const promotionsUpdated = await prisma.$executeRaw`
    UPDATE promotions SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${promotionsUpdated} promotions`);

  // Update SamplingSessions
  const samplingSessionsUpdated = await prisma.$executeRaw`
    UPDATE sampling_sessions SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${samplingSessionsUpdated} sampling_sessions`);

  // Update SamplingProducts
  const samplingProductsUpdated = await prisma.$executeRaw`
    UPDATE sampling_products SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${samplingProductsUpdated} sampling_products`);

  // Update TesterStock
  const testerStockUpdated = await prisma.$executeRaw`
    UPDATE tester_stock SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${testerStockUpdated} tester_stock`);

  // Update TesterRefills
  const testerRefillsUpdated = await prisma.$executeRaw`
    UPDATE tester_refills SET tenant_id = ${tenantId} WHERE tenant_id IS NULL
  `;
  console.log(`✅ Updated ${testerRefillsUpdated} tester_refills`);

  console.log('\n🎉 Multi-Tenant Seed Complete!');
  console.log(`\n📊 Summary:`);
  console.log(`   Tenant: ${defaultTenant.name}`);
  console.log(`   Tenant ID: ${defaultTenant.id}`);
  console.log(`   Status: ${defaultTenant.status}`);
  console.log(`   Plan: ${defaultTenant.plan}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
