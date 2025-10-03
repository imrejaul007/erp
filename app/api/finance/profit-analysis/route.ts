import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

const prisma = new PrismaClient();

// Profit Analysis schema
const profitAnalysisSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  analysisType: z.enum(['product', 'batch', 'store', 'category', 'all']),
  groupBy: z.enum(['day', 'week', 'month', 'quarter', 'year']).optional(),
  currency: z.string().default('AED'),
  includeReturns: z.boolean().default(true),
  includeDiscounts: z.boolean().default(true),
  storeId: z.string().optional(),
  productId: z.string().optional(),
  categoryId: z.string().optional(),
});

// Get comprehensive profit analysis
export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const params = {
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      analysisType: searchParams.get('analysisType') || 'all',
      groupBy: searchParams.get('groupBy'),
      currency: searchParams.get('currency') || 'AED',
      includeReturns: searchParams.get('includeReturns') !== 'false',
      includeDiscounts: searchParams.get('includeDiscounts') !== 'false',
      storeId: searchParams.get('storeId'),
      productId: searchParams.get('productId'),
      categoryId: searchParams.get('categoryId'),
    };

    if (!params.startDate || !params.endDate) {
      return apiError('Start date and end date are required', 400);
    }

    const validatedParams = profitAnalysisSchema.parse(params);

    let analysisResult: any = {};

    // Generate analysis based on type
    switch (validatedParams.analysisType) {
      case 'product':
        analysisResult = await generateProductProfitAnalysis(tenantId, validatedParams);
        break;
      case 'batch':
        analysisResult = await generateBatchProfitAnalysis(tenantId, validatedParams);
        break;
      case 'store':
        analysisResult = await generateStoreProfitAnalysis(tenantId, validatedParams);
        break;
      case 'category':
        analysisResult = await generateCategoryProfitAnalysis(tenantId, validatedParams);
        break;
      case 'all':
        analysisResult = await generateComprehensiveProfitAnalysis(tenantId, validatedParams);
        break;
    }

    return apiResponse({
      success: true,
      data: analysisResult,
      metadata: {
        period: {
          startDate: validatedParams.startDate,
          endDate: validatedParams.endDate,
        },
        analysisType: validatedParams.analysisType,
        groupBy: validatedParams.groupBy,
        currency: validatedParams.currency,
        filters: {
          storeId: validatedParams.storeId,
          productId: validatedParams.productId,
          categoryId: validatedParams.categoryId,
        },
        generatedAt: new Date().toISOString(),
        generatedBy: user?.email,
      },
    });
  } catch (error) {
    console.error('Profit Analysis error:', error);
    if (error instanceof z.ZodError) {
      return apiError('Invalid parameters: ' + error.errors.map(e => e.message).join(', '), 400);
    }
    return apiError('Failed to generate profit analysis', 500);
  }
});

// Save profit analysis report
export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const body = await request.json();
    const { analysisData, reportName, reportType } = body;

    const reportId = generateId();

    // Save analysis report
    await prisma.$executeRaw`
      INSERT INTO profit_analysis_reports (
        id, tenant_id, report_name, report_type, analysis_data,
        generated_at, generated_by
      ) VALUES (
        ${reportId}, ${tenantId}, ${reportName}, ${reportType}, ${JSON.stringify(analysisData)},
        ${new Date()}, ${user.id}
      )
    `;

    return apiResponse({
      success: true,
      data: {
        id: reportId,
        reportName,
        reportType,
      },
      message: 'Profit analysis report saved successfully',
    });
  } catch (error) {
    console.error('Profit Analysis POST error:', error);
    return apiError('Failed to save profit analysis report', 500);
  }
});

// Generate product-wise profit analysis
async function generateProductProfitAnalysis(tenantId: string, params: any) {
  const start = new Date(params.startDate);
  const end = new Date(params.endDate);
  end.setHours(23, 59, 59, 999);

  const whereClause = buildWhereClause(tenantId, params, start, end);

  // Get sales data by product
  const productSales = await prisma.$queryRaw`
    SELECT
      p.id as product_id,
      p.code as product_code,
      p.name as product_name,
      p.name_ar as product_name_ar,
      p.category,
      p.subcategory,
      s.store_id,
      st.name as store_name,
      COUNT(DISTINCT s.id) as total_orders,
      SUM(si.quantity) as total_quantity_sold,
      SUM(si.unit_price * si.quantity) as gross_revenue,
      SUM(si.discount_amount) as total_discounts,
      SUM(si.vat_amount) as total_vat,
      SUM(si.total_amount) as net_revenue,
      AVG(si.unit_price) as avg_selling_price,
      MIN(si.unit_price) as min_selling_price,
      MAX(si.unit_price) as max_selling_price
    FROM products p
    LEFT JOIN sale_items si ON p.id = si.product_id
    LEFT JOIN sales s ON si.sale_id = s.id
    LEFT JOIN stores st ON s.store_id = st.id
    WHERE p.tenant_id = ${tenantId}
      AND s.tenant_id = ${tenantId}
      AND s.status IN ('COMPLETED', 'CONFIRMED')
      AND s.sale_date >= ${start}
      AND s.sale_date <= ${end}
      AND s.currency = ${params.currency}
      ${params.storeId ? `AND s.store_id = '${params.storeId}'` : ''}
      ${params.productId ? `AND p.id = '${params.productId}'` : ''}
      ${params.categoryId ? `AND p.category = '${params.categoryId}'` : ''}
    GROUP BY p.id, p.code, p.name, p.name_ar, p.category, p.subcategory, s.store_id, st.name
    ORDER BY net_revenue DESC
  ` as any[];

  // Get cost data for each product
  const productCosts = await Promise.all(
    productSales.map(async (product) => {
      // Get average cost price from recent stock movements or production batches
      const avgCost = await getAverageProductCost(tenantId, product.product_id, start, end);

      const totalCost = Number(product.total_quantity_sold) * avgCost;
      const grossProfit = Number(product.net_revenue) - totalCost;
      const grossProfitMargin = product.net_revenue > 0 ? (grossProfit / Number(product.net_revenue)) * 100 : 0;

      return {
        ...product,
        avg_cost_price: avgCost,
        total_cost: totalCost,
        gross_profit: grossProfit,
        gross_profit_margin: grossProfitMargin,
        revenue_per_unit: product.total_quantity_sold > 0 ? Number(product.net_revenue) / Number(product.total_quantity_sold) : 0,
        profit_per_unit: product.total_quantity_sold > 0 ? grossProfit / Number(product.total_quantity_sold) : 0,
      };
    })
  );

  // Calculate summary statistics
  const summary = {
    totalProducts: productCosts.length,
    totalRevenue: productCosts.reduce((sum, p) => sum + Number(p.net_revenue), 0),
    totalCost: productCosts.reduce((sum, p) => sum + p.total_cost, 0),
    totalProfit: productCosts.reduce((sum, p) => sum + p.gross_profit, 0),
    avgProfitMargin: productCosts.length > 0
      ? productCosts.reduce((sum, p) => sum + p.gross_profit_margin, 0) / productCosts.length
      : 0,
    topPerformer: productCosts.length > 0 ? productCosts[0] : null,
    profitableProducts: productCosts.filter(p => p.gross_profit > 0).length,
    unprofitableProducts: productCosts.filter(p => p.gross_profit <= 0).length,
  };

  return {
    type: 'product',
    summary,
    products: productCosts,
    period: { startDate: params.startDate, endDate: params.endDate },
    currency: params.currency,
  };
}

// Generate batch-wise profit analysis
async function generateBatchProfitAnalysis(tenantId: string, params: any) {
  const start = new Date(params.startDate);
  const end = new Date(params.endDate);

  // Get production batch profitability
  const batchAnalysis = await prisma.$queryRaw`
    SELECT
      pb.id as batch_id,
      pb.batch_no,
      p.name as product_name,
      p.category,
      pb.planned_qty,
      pb.actual_qty,
      pb.cost as production_cost,
      pb.start_date,
      pb.completion_date,
      pb.status,

      -- Sales data for this batch
      COALESCE(sales.total_sold, 0) as total_sold,
      COALESCE(sales.total_revenue, 0) as total_revenue,
      COALESCE(sales.avg_selling_price, 0) as avg_selling_price,

      -- Cost per unit
      CASE WHEN pb.actual_qty > 0 THEN pb.cost / pb.actual_qty ELSE 0 END as cost_per_unit,

      -- Profit calculations
      CASE
        WHEN pb.actual_qty > 0 AND sales.total_sold > 0
        THEN sales.total_revenue - (pb.cost * (sales.total_sold / pb.actual_qty))
        ELSE 0
      END as realized_profit,

      -- Inventory value
      CASE
        WHEN pb.actual_qty > 0 AND sales.total_sold > 0
        THEN pb.cost * ((pb.actual_qty - sales.total_sold) / pb.actual_qty)
        ELSE pb.cost
      END as inventory_value

    FROM production_batches pb
    JOIN products p ON pb.product_id = p.id
    LEFT JOIN (
      SELECT
        pb_inner.id as batch_id,
        SUM(si.quantity) as total_sold,
        SUM(si.total_amount) as total_revenue,
        AVG(si.unit_price) as avg_selling_price
      FROM production_batches pb_inner
      JOIN sale_items si ON pb_inner.product_id = si.product_id
      JOIN sales s ON si.sale_id = s.id
      WHERE s.status IN ('COMPLETED', 'CONFIRMED')
        AND s.sale_date >= ${start}
        AND s.sale_date <= ${end}
      GROUP BY pb_inner.id
    ) sales ON pb.id = sales.batch_id

    WHERE pb.completion_date >= ${start}
      AND pb.completion_date <= ${end}
      AND pb.status = 'COMPLETED'

    ORDER BY realized_profit DESC
  ` as any[];

  // Calculate raw material costs for each batch
  const batchesWithRawMaterialCosts = await Promise.all(
    batchAnalysis.map(async (batch) => {
      const rawMaterialCosts = await prisma.$queryRaw`
        SELECT
          rm.name as raw_material_name,
          pbrm.planned_qty,
          pbrm.actual_qty,
          pbrm.cost,
          pbrm.unit
        FROM production_batch_raw_materials pbrm
        JOIN batches b ON pbrm.batch_id = b.id
        JOIN raw_materials rm ON b.raw_material_id = rm.id
        WHERE pbrm.production_batch_id = ${batch.batch_id}
      ` as any[];

      const totalRawMaterialCost = rawMaterialCosts.reduce(
        (sum, rm) => sum + Number(rm.cost), 0
      );

      const profitMargin = batch.total_revenue > 0
        ? (Number(batch.realized_profit) / Number(batch.total_revenue)) * 100
        : 0;

      return {
        ...batch,
        raw_materials: rawMaterialCosts,
        total_raw_material_cost: totalRawMaterialCost,
        profit_margin: profitMargin,
        roi: batch.production_cost > 0
          ? (Number(batch.realized_profit) / Number(batch.production_cost)) * 100
          : 0,
      };
    })
  );

  const summary = {
    totalBatches: batchesWithRawMaterialCosts.length,
    completedBatches: batchesWithRawMaterialCosts.filter(b => b.status === 'COMPLETED').length,
    totalProductionCost: batchesWithRawMaterialCosts.reduce((sum, b) => sum + Number(b.production_cost), 0),
    totalRevenue: batchesWithRawMaterialCosts.reduce((sum, b) => sum + Number(b.total_revenue), 0),
    totalProfit: batchesWithRawMaterialCosts.reduce((sum, b) => sum + Number(b.realized_profit), 0),
    avgProfitMargin: batchesWithRawMaterialCosts.length > 0
      ? batchesWithRawMaterialCosts.reduce((sum, b) => sum + b.profit_margin, 0) / batchesWithRawMaterialCosts.length
      : 0,
    mostProfitable: batchesWithRawMaterialCosts.length > 0 ? batchesWithRawMaterialCosts[0] : null,
  };

  return {
    type: 'batch',
    summary,
    batches: batchesWithRawMaterialCosts,
    period: { startDate: params.startDate, endDate: params.endDate },
    currency: params.currency,
  };
}

// Generate store-wise profit analysis
async function generateStoreProfitAnalysis(tenantId: string, params: any) {
  const start = new Date(params.startDate);
  const end = new Date(params.endDate);

  const storeAnalysis = await prisma.$queryRaw`
    SELECT
      s.store_id,
      st.name as store_name,
      st.city,
      st.emirate,

      COUNT(DISTINCT s.id) as total_orders,
      COUNT(DISTINCT s.customer_id) as unique_customers,
      SUM(s.subtotal) as gross_revenue,
      SUM(s.discount_amount) as total_discounts,
      SUM(s.vat_amount) as total_vat,
      SUM(s.total_amount) as net_revenue,
      AVG(s.total_amount) as avg_order_value,
      MIN(s.total_amount) as min_order_value,
      MAX(s.total_amount) as max_order_value,

      -- Product mix
      COUNT(DISTINCT si.product_id) as unique_products_sold,
      SUM(si.quantity) as total_units_sold

    FROM sales s
    JOIN stores st ON s.store_id = st.id
    JOIN sale_items si ON s.id = si.sale_id

    WHERE s.tenant_id = ${tenantId}
      AND st.tenant_id = ${tenantId}
      AND s.status IN ('COMPLETED', 'CONFIRMED')
      AND s.sale_date >= ${start}
      AND s.sale_date <= ${end}
      AND s.currency = ${params.currency}
      ${params.storeId ? `AND s.store_id = '${params.storeId}'` : ''}

    GROUP BY s.store_id, st.name, st.city, st.emirate
    ORDER BY net_revenue DESC
  ` as any[];

  // Calculate costs and profits for each store
  const storesWithProfitability = await Promise.all(
    storeAnalysis.map(async (store) => {
      // Get average inventory cost for this store
      const inventoryCost = await getStoreInventoryCost(tenantId, store.store_id, start, end);

      // Estimate operational costs (this would typically come from expense tracking)
      const operationalCosts = await getStoreOperationalCosts(tenantId, store.store_id, start, end);

      const totalCosts = inventoryCost + operationalCosts;
      const grossProfit = Number(store.net_revenue) - inventoryCost;
      const netProfit = grossProfit - operationalCosts;
      const profitMargin = store.net_revenue > 0 ? (netProfit / Number(store.net_revenue)) * 100 : 0;

      return {
        ...store,
        inventory_cost: inventoryCost,
        operational_costs: operationalCosts,
        total_costs: totalCosts,
        gross_profit: grossProfit,
        net_profit: netProfit,
        profit_margin: profitMargin,
        revenue_per_customer: store.unique_customers > 0
          ? Number(store.net_revenue) / Number(store.unique_customers) : 0,
        units_per_order: store.total_orders > 0
          ? Number(store.total_units_sold) / Number(store.total_orders) : 0,
      };
    })
  );

  const summary = {
    totalStores: storesWithProfitability.length,
    totalRevenue: storesWithProfitability.reduce((sum, s) => sum + Number(s.net_revenue), 0),
    totalProfit: storesWithProfitability.reduce((sum, s) => sum + s.net_profit, 0),
    avgProfitMargin: storesWithProfitability.length > 0
      ? storesWithProfitability.reduce((sum, s) => sum + s.profit_margin, 0) / storesWithProfitability.length
      : 0,
    topPerformingStore: storesWithProfitability.length > 0 ? storesWithProfitability[0] : null,
    profitableStores: storesWithProfitability.filter(s => s.net_profit > 0).length,
  };

  return {
    type: 'store',
    summary,
    stores: storesWithProfitability,
    period: { startDate: params.startDate, endDate: params.endDate },
    currency: params.currency,
  };
}

// Generate category-wise profit analysis
async function generateCategoryProfitAnalysis(tenantId: string, params: any) {
  const start = new Date(params.startDate);
  const end = new Date(params.endDate);

  const categoryAnalysis = await prisma.$queryRaw`
    SELECT
      p.category,
      p.subcategory,

      COUNT(DISTINCT p.id) as unique_products,
      COUNT(DISTINCT s.id) as total_orders,
      SUM(si.quantity) as total_quantity_sold,
      SUM(si.unit_price * si.quantity) as gross_revenue,
      SUM(si.discount_amount) as total_discounts,
      SUM(si.total_amount) as net_revenue,
      AVG(si.unit_price) as avg_selling_price,

      -- Best selling product in category
      (SELECT p2.name
       FROM products p2
       JOIN sale_items si2 ON p2.id = si2.product_id
       JOIN sales s2 ON si2.sale_id = s2.id
       WHERE p2.tenant_id = ${tenantId}
         AND s2.tenant_id = ${tenantId}
         AND p2.category = p.category
         AND p2.subcategory = p.subcategory
         AND s2.status IN ('COMPLETED', 'CONFIRMED')
         AND s2.sale_date >= ${start}
         AND s2.sale_date <= ${end}
       GROUP BY p2.id, p2.name
       ORDER BY SUM(si2.total_amount) DESC
       LIMIT 1
      ) as best_selling_product

    FROM products p
    JOIN sale_items si ON p.id = si.product_id
    JOIN sales s ON si.sale_id = s.id

    WHERE p.tenant_id = ${tenantId}
      AND s.tenant_id = ${tenantId}
      AND s.status IN ('COMPLETED', 'CONFIRMED')
      AND s.sale_date >= ${start}
      AND s.sale_date <= ${end}
      AND s.currency = ${params.currency}
      ${params.storeId ? `AND s.store_id = '${params.storeId}'` : ''}

    GROUP BY p.category, p.subcategory
    ORDER BY net_revenue DESC
  ` as any[];

  // Calculate costs and profitability for each category
  const categoriesWithProfitability = await Promise.all(
    categoryAnalysis.map(async (category) => {
      // Get average cost for products in this category
      const avgCategoryCost = await getAverageCategoryCost(tenantId, category.category, category.subcategory, start, end);

      const totalCost = Number(category.total_quantity_sold) * avgCategoryCost;
      const grossProfit = Number(category.net_revenue) - totalCost;
      const profitMargin = category.net_revenue > 0 ? (grossProfit / Number(category.net_revenue)) * 100 : 0;

      return {
        ...category,
        avg_cost_price: avgCategoryCost,
        total_cost: totalCost,
        gross_profit: grossProfit,
        profit_margin: profitMargin,
        revenue_per_product: category.unique_products > 0
          ? Number(category.net_revenue) / Number(category.unique_products) : 0,
        avg_order_value: category.total_orders > 0
          ? Number(category.net_revenue) / Number(category.total_orders) : 0,
      };
    })
  );

  const summary = {
    totalCategories: categoriesWithProfitability.length,
    totalRevenue: categoriesWithProfitability.reduce((sum, c) => sum + Number(c.net_revenue), 0),
    totalProfit: categoriesWithProfitability.reduce((sum, c) => sum + c.gross_profit, 0),
    avgProfitMargin: categoriesWithProfitability.length > 0
      ? categoriesWithProfitability.reduce((sum, c) => sum + c.profit_margin, 0) / categoriesWithProfitability.length
      : 0,
    topCategory: categoriesWithProfitability.length > 0 ? categoriesWithProfitability[0] : null,
  };

  return {
    type: 'category',
    summary,
    categories: categoriesWithProfitability,
    period: { startDate: params.startDate, endDate: params.endDate },
    currency: params.currency,
  };
}

// Generate comprehensive profit analysis (all types combined)
async function generateComprehensiveProfitAnalysis(tenantId: string, params: any) {
  const [productAnalysis, batchAnalysis, storeAnalysis, categoryAnalysis] = await Promise.all([
    generateProductProfitAnalysis(tenantId, params),
    generateBatchProfitAnalysis(tenantId, params),
    generateStoreProfitAnalysis(tenantId, params),
    generateCategoryProfitAnalysis(tenantId, params),
  ]);

  return {
    type: 'comprehensive',
    products: productAnalysis,
    batches: batchAnalysis,
    stores: storeAnalysis,
    categories: categoryAnalysis,
    period: { startDate: params.startDate, endDate: params.endDate },
    currency: params.currency,
  };
}

// Helper functions
function buildWhereClause(tenantId: string, params: any, start: Date, end: Date): string {
  let clause = `WHERE s.tenant_id = '${tenantId}' AND s.status IN ('COMPLETED', 'CONFIRMED')
    AND s.sale_date >= ${start} AND s.sale_date <= ${end}
    AND s.currency = '${params.currency}'`;

  if (params.storeId) {
    clause += ` AND s.store_id = '${params.storeId}'`;
  }

  if (!params.includeReturns) {
    clause += ` AND s.status != 'RETURNED'`;
  }

  return clause;
}

async function getAverageProductCost(tenantId: string, productId: string, start: Date, end: Date): Promise<number> {
  // This would get the weighted average cost from stock movements or production batches
  // For simplicity, using cost_price from product table
  const product = await prisma.product.findUnique({
    where: {
      tenantId,
      id: productId
    },
    select: { costPrice: true }
  });

  return product ? Number(product.costPrice) : 0;
}

async function getStoreInventoryCost(tenantId: string, storeId: string, start: Date, end: Date): Promise<number> {
  // Calculate inventory cost based on sales in the period
  // This is a simplified calculation - in practice would use FIFO/LIFO/Weighted Average
  const salesCost = await prisma.$queryRaw`
    SELECT SUM(p.cost_price * si.quantity) as total_cost
    FROM sale_items si
    JOIN sales s ON si.sale_id = s.id
    JOIN products p ON si.product_id = p.id
    WHERE s.tenant_id = ${tenantId}
      AND p.tenant_id = ${tenantId}
      AND s.store_id = ${storeId}
      AND s.sale_date >= ${start}
      AND s.sale_date <= ${end}
      AND s.status IN ('COMPLETED', 'CONFIRMED')
  ` as any[];

  return salesCost.length > 0 ? Number(salesCost[0].total_cost) || 0 : 0;
}

async function getStoreOperationalCosts(tenantId: string, storeId: string, start: Date, end: Date): Promise<number> {
  // This would typically come from expense tracking
  // For now, returning a placeholder calculation
  const store = await prisma.store.findUnique({
    where: {
      tenantId,
      id: storeId
    }
  });

  // Simplified: assume 20% of revenue as operational costs
  const revenue = await prisma.$queryRaw`
    SELECT SUM(total_amount) as total_revenue
    FROM sales
    WHERE tenant_id = ${tenantId}
      AND store_id = ${storeId}
      AND sale_date >= ${start}
      AND sale_date <= ${end}
      AND status IN ('COMPLETED', 'CONFIRMED')
  ` as any[];

  const totalRevenue = revenue.length > 0 ? Number(revenue[0].total_revenue) || 0 : 0;
  return totalRevenue * 0.2; // 20% operational cost assumption
}

async function getAverageCategoryCost(tenantId: string, category: string, subcategory: string, start: Date, end: Date): Promise<number> {
  const avgCost = await prisma.$queryRaw`
    SELECT AVG(cost_price) as avg_cost
    FROM products
    WHERE tenant_id = ${tenantId}
      AND category = ${category}
      AND subcategory = ${subcategory}
      AND is_active = true
  ` as any[];

  return avgCost.length > 0 ? Number(avgCost[0].avg_cost) || 0 : 0;
}

function generateId(): string {
  return `pa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}