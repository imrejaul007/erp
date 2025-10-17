import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// Product categories from almutalib.com
const CATEGORIES_TO_SCRAPE = [
  { url: 'https://almutalib.com/product-category/agarwood/', name: 'Agarwood' },
  { url: 'https://almutalib.com/product-category/perfumes/', name: 'Perfumes' },
  { url: 'https://almutalib.com/product-category/bakhour/', name: 'Bakhour' },
  { url: 'https://almutalib.com/product-category/dehnal-oudh/', name: 'Dehnal Oudh' },
  { url: 'https://almutalib.com/product-category/incense/', name: 'Incense' },
];

async function importAlmutalibProducts() {
  try {
    console.log('🚀 Starting Al Mutalib product import...\n');

    // Step 1: Get tenant and user
    const tenant = await prisma.tenants.findFirst();
    const user = await prisma.users.findFirst();

    if (!tenant || !user) {
      console.log('❌ No tenant or user found. Run setup first.');
      return;
    }

    console.log(`✅ Using tenant: ${tenant.name}`);
    console.log(`✅ Using user: ${user.email}\n`);

    // Step 2: Get or create categories
    console.log('Step 1: Ensuring categories exist...');
    const categoryMap = {};

    for (const cat of CATEGORIES_TO_SCRAPE) {
      const existing = await prisma.$queryRaw`
        SELECT * FROM categories WHERE name = ${cat.name} AND "tenantId" = ${tenant.id} LIMIT 1
      `;

      let categoryId;

      if (existing.length === 0) {
        categoryId = randomUUID();
        await prisma.$executeRaw`
          INSERT INTO categories (id, name, "isActive", "tenantId", "createdAt")
          VALUES (${categoryId}, ${cat.name}, true, ${tenant.id}, NOW())
        `;
        console.log(`   ✅ Created category: ${cat.name}`);
      } else {
        categoryId = existing[0].id;
        console.log(`   ⏭️  Category exists: ${cat.name}`);
      }

      categoryMap[cat.name] = categoryId;
    }

    // Step 3: Get or create default brand
    console.log('\nStep 2: Ensuring brand exists...');
    const existingBrand = await prisma.$queryRaw`
      SELECT * FROM brands WHERE name = 'Al Mutalib' AND "tenantId" = ${tenant.id} LIMIT 1
    `;

    let brandId;

    if (existingBrand.length === 0) {
      brandId = randomUUID();
      await prisma.$executeRaw`
        INSERT INTO brands (id, name, "nameArabic", "isActive", "tenantId", "createdAt")
        VALUES (${brandId}, 'Al Mutalib', 'المطلب', true, ${tenant.id}, NOW())
      `;
      console.log('   ✅ Created brand: Al Mutalib');
    } else {
      brandId = existingBrand[0].id;
      console.log('   ⏭️  Brand exists: Al Mutalib');
    }

    const brand = { id: brandId };

    // Step 4: Scrape and import products
    console.log('\nStep 3: Scraping and importing products...\n');
    let totalImported = 0;
    let totalSkipped = 0;

    for (const category of CATEGORIES_TO_SCRAPE) {
      console.log(`\n📦 Processing category: ${category.name}`);
      console.log(`   URL: ${category.url}`);

      // Fetch HTML directly
      console.log('   Fetching page...');
      const response = await fetch(category.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      });

      if (!response.ok) {
        console.log(`   ❌ Failed to fetch: ${response.status}`);
        continue;
      }

      const html = await response.text();
      console.log(`   ✅ Fetched HTML (${html.length} bytes)`);

      // Extract products from HTML
      const products = extractProductsFromHTML(html, category.url);
      console.log(`   Found ${products.length} products`);

      // Import each product
      for (const product of products) {
        try {
          // Check if product already exists
          const existing = await prisma.$queryRaw`
            SELECT * FROM products WHERE name = ${product.name} AND "tenantId" = ${tenant.id} LIMIT 1
          `;

          if (existing.length > 0) {
            totalSkipped++;
            continue;
          }

          // Parse price
          let sellingPrice = 100; // Default
          let costPrice = 50;
          if (product.price) {
            const priceMatch = product.price.match(/([0-9,]+\.?[0-9]*)/);
            if (priceMatch) {
              sellingPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
              costPrice = sellingPrice * 0.5; // Cost is estimated at 50% of selling price
            }
          }

          // Create product
          const productId = randomUUID();
          const sku = generateSKU(product.name, totalImported);
          const code = `ALM-${String(totalImported + 1).padStart(5, '0')}`;

          await prisma.$executeRaw`
            INSERT INTO products (
              id, code, name, "nameAr", category, "baseUnit",
              "sellingPrice", "costPrice", currency, "vatRate",
              "minStockLevel", "maxStockLevel", sku,
              "isActive", "imageUrl", "tenantId", "createdAt", "updatedAt"
            )
            VALUES (
              ${productId}, ${code}, ${product.name}, '', ${category.name}, 'PIECE',
              ${sellingPrice}, ${costPrice}, 'AED', 5.0,
              10, 200, ${sku},
              true, ${product.imageUrl || null}, ${tenant.id}, NOW(), NOW()
            )
          `;

          totalImported++;
          console.log(`   ✅ Imported: ${product.name.substring(0, 50)}...`);

        } catch (error) {
          console.log(`   ⚠️  Failed to import: ${product.name.substring(0, 40)} - ${error.message}`);
        }
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅  IMPORT COMPLETE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n📊 Statistics:`);
    console.log(`   Total Imported: ${totalImported}`);
    console.log(`   Total Skipped (duplicates): ${totalSkipped}`);
    console.log(`\n✅ Products are now in your database!`);
    console.log(`   Go to: http://localhost:3000 to view them\n`);

  } catch (error) {
    console.error('\n❌ Import failed:', error);
    console.error('Details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

function extractProductsFromHTML(html, baseUrl) {
  const products = [];

  // Al Mutalib uses anchor tags with product links
  // Pattern: <a href="product-url">...<h3>Product Name</h3>...<span>Price AED</span>...</a>
  const productLinkPattern = /<a\s+href="https:\/\/almutalib\.com\/product\/[^"]+">[\s\S]*?<\/a>/gi;
  const matches = html.match(productLinkPattern);

  if (!matches) {
    console.log('   ⚠️  No product links found');
    // Try alternative pattern - sometimes products are in sections
    const altPattern = /<h3[^>]*>([^<]+)<\/h3>[\s\S]{0,500}?<span[^>]*>[\s\S]*?([0-9,]+\.?[0-9]*)\s*AED/gi;
    const altMatches = [...html.matchAll(altPattern)];

    for (const match of altMatches.slice(0, 50)) {
      products.push({
        name: cleanText(match[1]),
        price: match[2] + ' AED',
        imageUrl: null
      });
    }

    return products;
  }

  for (const block of matches.slice(0, 50)) {
    const product = {};

    // Extract name from h3 tag
    const nameMatch = block.match(/<h3[^>]*>([^<]+)<\/h3>/i);
    if (nameMatch && nameMatch[1]) {
      product.name = cleanText(nameMatch[1]);
    }

    // Extract price - look for patterns like "20,000.00 AED" or "Original price was: X AED"
    const pricePatterns = [
      /Current price is:\s*([0-9,]+\.?[0-9]*)\s*AED/i,
      /<span[^>]*>([0-9,]+\.?[0-9]*)\s*AED<\/span>/i,
      /([0-9,]+\.?[0-9]*)\s*AED/i
    ];

    for (const pattern of pricePatterns) {
      const priceMatch = block.match(pattern);
      if (priceMatch && priceMatch[1]) {
        product.price = priceMatch[1] + ' AED';
        break;
      }
    }

    // Extract image
    const imgMatch = block.match(/<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/i);
    if (imgMatch) {
      product.imageUrl = imgMatch[1];
      // If no name was found, try using alt text
      if (!product.name && imgMatch[2]) {
        product.name = cleanText(imgMatch[2]);
      }
    }

    if (product.name && product.name.length > 3) {
      products.push(product);
    }
  }

  return products;
}

function cleanText(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function generateSKU(name, index) {
  const prefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'ALM');
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}-${timestamp}-${String(index + 1).padStart(3, '0')}`;
}

importAlmutalibProducts();
