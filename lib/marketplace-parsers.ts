import { randomUUID } from 'crypto';
import { prisma } from '@/lib/database/prisma';

interface ParsedOrder {
  marketplaceOrderId: string;
  orderDate: Date;
  customerName?: string;
  customerEmail?: string;
  items: ParsedOrderItem[];
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  shipping?: number;
  commission?: number;
  notes?: string;
}

interface ParsedOrderItem {
  sku?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
}

interface ParseContext {
  tenantId: string;
  storeId: string;
  userId: string;
}

// Main parser function
export async function parseMarketplaceFile(
  fileContent: string,
  marketplace: string,
  context: ParseContext
): Promise<any[]> {

  let parsedOrders: ParsedOrder[] = [];

  switch (marketplace.toUpperCase()) {
    case 'NOON':
      parsedOrders = parseNoonCSV(fileContent);
      break;
    case 'AMAZON':
      parsedOrders = parseAmazonCSV(fileContent);
      break;
    case 'GENERIC':
    case 'CSV':
      parsedOrders = parseGenericCSV(fileContent);
      break;
    default:
      throw new Error(`Unsupported marketplace: ${marketplace}`);
  }

  // Save to database
  const savedOrders = [];

  for (const order of parsedOrders) {
    const saved = await saveOrderToDatabase(order, marketplace, context);
    savedOrders.push(saved);
  }

  return savedOrders;
}

// Parse Noon.com CSV export
function parseNoonCSV(csvContent: string): ParsedOrder[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = parseCSVLine(lines[0]);

  const ordersMap = new Map<string, ParsedOrder>();

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) continue;

    const row: any = {};
    headers.forEach((header, index) => {
      row[header.toLowerCase().replace(/\s+/g, '_')] = values[index];
    });

    // Noon CSV format typically has: Order ID, Order Date, SKU, Product Name, Quantity, Price, VAT
    const orderId = row.order_id || row.order_number || row.orderid;
    const orderDate = row.order_date || row.date || row.orderdate;
    const sku = row.sku || row.product_sku;
    const productName = row.product_name || row.item_name || row.product;
    const quantity = parseInt(row.quantity || row.qty || '1');
    const unitPrice = parseFloat(row.unit_price || row.price || row.item_price || '0');
    const vatAmount = parseFloat(row.vat || row.vat_amount || '0');

    if (!orderId) continue;

    if (!ordersMap.has(orderId)) {
      ordersMap.set(orderId, {
        marketplaceOrderId: orderId,
        orderDate: new Date(orderDate || Date.now()),
        customerName: row.customer_name || 'Noon Customer',
        customerEmail: row.customer_email,
        items: [],
        subtotal: 0,
        vatAmount: 0,
        totalAmount: 0,
        commission: parseFloat(row.commission || '0'),
        notes: `Imported from Noon`
      });
    }

    const order = ordersMap.get(orderId)!;
    const itemTotal = quantity * unitPrice;

    order.items.push({
      sku,
      productName,
      quantity,
      unitPrice,
      vatRate: unitPrice > 0 ? (vatAmount / itemTotal) * 100 : 5
    });

    order.subtotal += itemTotal;
    order.vatAmount += vatAmount;
  }

  // Calculate totals
  ordersMap.forEach(order => {
    order.totalAmount = order.subtotal + order.vatAmount;
  });

  return Array.from(ordersMap.values());
}

// Parse Amazon CSV export
function parseAmazonCSV(csvContent: string): ParsedOrder[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = parseCSVLine(lines[0]);

  const ordersMap = new Map<string, ParsedOrder>();

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) continue;

    const row: any = {};
    headers.forEach((header, index) => {
      row[header.toLowerCase().replace(/\s+/g, '_')] = values[index];
    });

    // Amazon format: amazon-order-id, purchase-date, sku, product-name, quantity, item-price, item-tax
    const orderId = row.amazon_order_id || row['amazon-order-id'] || row.order_id;
    const orderDate = row.purchase_date || row['purchase-date'] || row.order_date;
    const sku = row.sku || row.seller_sku;
    const productName = row.product_name || row['product-name'] || row.title;
    const quantity = parseInt(row.quantity || row['quantity-purchased'] || '1');
    const unitPrice = parseFloat(row.item_price || row['item-price'] || '0');
    const vatAmount = parseFloat(row.item_tax || row['item-tax'] || '0');

    if (!orderId) continue;

    if (!ordersMap.has(orderId)) {
      ordersMap.set(orderId, {
        marketplaceOrderId: orderId,
        orderDate: new Date(orderDate || Date.now()),
        customerName: 'Amazon Customer',
        items: [],
        subtotal: 0,
        vatAmount: 0,
        totalAmount: 0,
        notes: `Imported from Amazon`
      });
    }

    const order = ordersMap.get(orderId)!;
    const itemTotal = quantity * unitPrice;

    order.items.push({
      sku,
      productName,
      quantity,
      unitPrice,
      vatRate: unitPrice > 0 ? (vatAmount / itemTotal) * 100 : 5
    });

    order.subtotal += itemTotal;
    order.vatAmount += vatAmount;
  }

  // Calculate totals
  ordersMap.forEach(order => {
    order.totalAmount = order.subtotal + order.vatAmount;
  });

  return Array.from(ordersMap.values());
}

// Parse generic CSV (flexible format)
function parseGenericCSV(csvContent: string): ParsedOrder[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = parseCSVLine(lines[0]);

  const ordersMap = new Map<string, ParsedOrder>();

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) continue;

    const row: any = {};
    headers.forEach((header, index) => {
      row[header.toLowerCase().replace(/\s+/g, '_')] = values[index];
    });

    // Generic format - try common field names
    const orderId = row.order_id || row.orderid || row.order_number || row.invoice_no || `GEN-${Date.now()}-${i}`;
    const orderDate = row.order_date || row.date || row.sale_date || row.invoice_date;
    const sku = row.sku || row.product_code || row.item_code;
    const productName = row.product_name || row.product || row.item || row.description || 'Unknown Product';
    const quantity = parseInt(row.quantity || row.qty || '1');
    const unitPrice = parseFloat(row.unit_price || row.price || row.amount || '0');
    const vatRate = parseFloat(row.vat_rate || row.tax_rate || '5');
    const vatAmount = parseFloat(row.vat || row.vat_amount || row.tax || '0');

    if (!ordersMap.has(orderId)) {
      ordersMap.set(orderId, {
        marketplaceOrderId: orderId,
        orderDate: new Date(orderDate || Date.now()),
        customerName: row.customer_name || row.customer || 'Generic Customer',
        customerEmail: row.customer_email || row.email,
        items: [],
        subtotal: 0,
        vatAmount: 0,
        totalAmount: 0,
        notes: `Imported from CSV`
      });
    }

    const order = ordersMap.get(orderId)!;
    const itemTotal = quantity * unitPrice;
    const calculatedVat = vatAmount || (itemTotal * (vatRate / 100));

    order.items.push({
      sku,
      productName,
      quantity,
      unitPrice,
      vatRate
    });

    order.subtotal += itemTotal;
    order.vatAmount += calculatedVat;
  }

  // Calculate totals
  ordersMap.forEach(order => {
    order.totalAmount = order.subtotal + order.vatAmount;
  });

  return Array.from(ordersMap.values());
}

// Helper to parse CSV line (handles quoted fields)
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

// Save order to database
async function saveOrderToDatabase(
  order: ParsedOrder,
  marketplace: string,
  context: ParseContext
): Promise<any> {
  const { tenantId, storeId, userId } = context;

  // Generate sale number
  const saleNo = await generateSaleNumber(tenantId);
  const saleId = randomUUID();

  // Find or create customer
  let customerId: string | null = null;

  if (order.customerEmail) {
    const existing = await prisma.$queryRaw<any[]>`
      SELECT id FROM customers WHERE email = ${order.customerEmail} AND "tenantId" = ${tenantId} LIMIT 1
    `;

    if (existing.length > 0) {
      customerId = existing[0].id;
    } else if (order.customerName) {
      customerId = randomUUID();
      await prisma.$executeRaw`
        INSERT INTO customers (id, code, name, email, "isActive", "tenantId", "createdById", "createdAt", "updatedAt")
        VALUES (${customerId}, ${`CUST-${Date.now()}`}, ${order.customerName}, ${order.customerEmail}, true, ${tenantId}, ${userId}, NOW(), NOW())
      `;
    }
  }

  // Create products if they don't exist (match by SKU or name)
  for (const item of order.items) {
    const existingProduct = await prisma.$queryRaw<any[]>`
      SELECT id FROM products
      WHERE (sku = ${item.sku || ''} OR name = ${item.productName})
      AND "tenantId" = ${tenantId}
      LIMIT 1
    `;

    if (existingProduct.length === 0 && item.productName) {
      // Create product
      const productId = randomUUID();
      const productCode = `IMP-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase();

      await prisma.$executeRaw`
        INSERT INTO products (
          id, code, name, sku, category, "baseUnit",
          "sellingPrice", "costPrice", currency, "vatRate",
          "minStockLevel", "maxStockLevel",
          "isActive", "tenantId", "createdAt", "updatedAt"
        )
        VALUES (
          ${productId}, ${productCode}, ${item.productName}, ${item.sku || productCode},
          'Imported', 'PIECE', ${item.unitPrice}, ${item.unitPrice * 0.7}, 'AED', ${item.vatRate},
          0, 100, true, ${tenantId}, NOW(), NOW()
        )
      `;
    }
  }

  // Create sale
  await prisma.$executeRaw`
    INSERT INTO sales (
      id, "saleNo", "storeId", "customerId", status, "saleDate",
      subtotal, "discountAmount", "vatAmount", "totalAmount", currency,
      "paymentStatus", notes, source, "marketplaceOrderId", "importedAt",
      "createdById", "updatedById", "tenantId", "createdAt", "updatedAt"
    )
    VALUES (
      ${saleId}, ${saleNo}, ${storeId}, ${customerId}, 'COMPLETED',
      ${order.orderDate}, ${order.subtotal}, 0, ${order.vatAmount}, ${order.totalAmount},
      'AED', 'PAID', ${order.notes || null}, ${marketplace.toUpperCase()},
      ${order.marketplaceOrderId}, NOW(), ${userId}, ${userId}, ${tenantId}, NOW(), NOW()
    )
  `;

  // Create sale items
  for (const item of order.items) {
    // Find product ID
    const products = await prisma.$queryRaw<any[]>`
      SELECT id FROM products
      WHERE (sku = ${item.sku || ''} OR name = ${item.productName})
      AND "tenantId" = ${tenantId}
      LIMIT 1
    `;

    if (products.length > 0) {
      const productId = products[0].id;
      const itemId = randomUUID();
      const itemTotal = item.quantity * item.unitPrice;
      const itemVat = itemTotal * (item.vatRate / 100);
      const itemTotalWithVat = itemTotal + itemVat;

      await prisma.$executeRaw`
        INSERT INTO sale_items (
          id, "saleId", "productId", quantity, unit, "unitPrice",
          "discountPercent", "discountAmount", "vatRate", "vatAmount",
          "totalAmount", "tenantId"
        )
        VALUES (
          ${itemId}, ${saleId}, ${productId}, ${item.quantity}, 'PIECE',
          ${item.unitPrice}, 0, 0, ${item.vatRate}, ${itemVat},
          ${itemTotalWithVat}, ${tenantId}
        )
      `;
    }
  }

  // Create VAT record
  const vatRecordId = randomUUID();
  const vatRecordNo = `VAT-${Date.now()}`;

  await prisma.$executeRaw`
    INSERT INTO vat_records (
      id, "recordNo", type, amount, "vatAmount", "vatRate",
      currency, description, "referenceType", "referenceId",
      "recordDate", period, status, "tenantId", "createdAt", "updatedAt"
    )
    VALUES (
      ${vatRecordId}, ${vatRecordNo}, 'OUTPUT',
      ${order.subtotal}, ${order.vatAmount}, 5.0, 'AED',
      ${`${marketplace} Order ${order.marketplaceOrderId}`}, 'SALE', ${saleId},
      ${order.orderDate}, ${order.orderDate.toISOString().slice(0, 7)},
      'ACTIVE', ${tenantId}, NOW(), NOW()
    )
  `;

  return {
    saleId,
    saleNo,
    marketplaceOrderId: order.marketplaceOrderId,
    totalAmount: order.totalAmount,
    itemsCount: order.items.length
  };
}

async function generateSaleNumber(tenantId: string): Promise<string> {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');

  const lastSale = await prisma.$queryRaw<any[]>`
    SELECT "saleNo" FROM sales
    WHERE "tenantId" = ${tenantId}
    ORDER BY "createdAt" DESC
    LIMIT 1
  `;

  let sequence = 1;
  if (lastSale.length > 0) {
    const lastNo = lastSale[0].saleNo;
    const match = lastNo.match(/-(\d+)$/);
    if (match) {
      sequence = parseInt(match[1]) + 1;
    }
  }

  return `SAL-${year}${month}-${sequence.toString().padStart(5, '0')}`;
}
