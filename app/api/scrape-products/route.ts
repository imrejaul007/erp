import { NextRequest } from 'next/server';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

export const POST = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    // TODO: Add tenantId filter to all Prisma queries in this handler
    const { url } = await request.json();

    if (!url) {
      return apiError('URL is required', 400);
    }

    console.log('Scraping URL:', url);

    // Validate URL
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch {
      return apiError('Invalid URL format', 400);
    }

    // Detect if this is a single product page or listing page
    const isSingleProductPage = targetUrl.pathname.includes('/product/') ||
                               targetUrl.pathname.includes('/item/') ||
                               targetUrl.pathname.includes('/p/') ||
                               targetUrl.search.includes('product');

    // Fetch the page with proper headers
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    console.log('Successfully fetched HTML, length:', html.length);

    const products: any[] = [];

    // Handle single product pages differently
    if (isSingleProductPage) {
      console.log('Detected single product page, using specialized extraction...');

      const singleProduct = extractSingleProductInfo(html, targetUrl);
      if (singleProduct && singleProduct.name && singleProduct.name.length > 3) {
        products.push({
          ...singleProduct,
          sku: generateSKU(singleProduct.name, 0),
        });
      }
    } else {
      // Extract products using regex patterns for listing pages
      const productPatterns = [
      // WooCommerce patterns
      /<(?:li|div)[^>]*class="[^"]*product[^"]*"[^>]*>[\s\S]*?<\/(?:li|div)>/gi,
      // Shopify patterns
      /<(?:div|article)[^>]*class="[^"]*product-card[^"]*"[^>]*>[\s\S]*?<\/(?:div|article)>/gi,
      // Generic product patterns
      /<(?:div|article)[^>]*class="[^"]*item[^"]*"[^>]*>[\s\S]*?<\/(?:div|article)>/gi,
    ];

    for (const pattern of productPatterns) {
      const matches = html.match(pattern);
      if (matches && matches.length > 0) {
        console.log(`Found ${matches.length} potential products with pattern`);

        for (let i = 0; i < Math.min(matches.length, 50); i++) {
          const productHtml = matches[i];
          const product = extractProductInfo(productHtml, targetUrl);

          if (product && product.name && product.name.length > 3) {
            products.push({
              ...product,
              sku: generateSKU(product.name, products.length),
            });
          }
        }

        // Continue checking other patterns to get more products
        // Don't break after first successful pattern
      }
    }

    // Fallback: Look for common product patterns in the HTML
    if (products.length === 0) {
      console.log('Trying fallback extraction...');

      // Look for headings that might be product names
      const titlePattern = /<h[1-6][^>]*>([^<]*(?:oud|perfume|fragrance|parfum|cologne|attar|scent|musk|amber)[^<]*)<\/h[1-6]>/gi;
      const titleMatches = html.match(titlePattern);

      if (titleMatches) {
        for (let i = 0; i < Math.min(titleMatches.length, 20); i++) {
          const titleMatch = titleMatches[i];
          const nameMatch = titleMatch.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i);

          if (nameMatch && nameMatch[1]) {
            const name = cleanText(nameMatch[1]);
            if (name.length > 5 && isLikelyProductName(name)) {
              products.push({
                name,
                price: '',
                category: 'Perfumes',
                brand: extractBrandFromName(name),
                sku: generateSKU(name, products.length),
              });
            }
          }
        }
      }
    }

    // Enhanced extraction for raeesaloud.com specifically
    if (targetUrl.hostname.includes('raeesaloud') && products.length === 0) {
      console.log('Using raeesaloud-specific extraction...');

      // Look for specific patterns used by this site
      const raeesPatterns = [
        /class="product-title"[^>]*><a[^>]*>([^<]+)<\/a>/gi,
        /class="woocommerce-loop-product__title"[^>]*>([^<]+)<\/[^>]+>/gi,
        /data-product-title="([^"]+)"/gi,
      ];

      for (const pattern of raeesPatterns) {
        const matches = html.match(pattern);
        if (matches) {
          console.log(`Found ${matches.length} products with raeesaloud pattern`);

          for (const match of matches.slice(0, 50)) {
            const nameMatch = match.match(/(?:>([^<]+)<|"([^"]+)")/);
            if (nameMatch) {
              const name = cleanText(nameMatch[1] || nameMatch[2]);
              if (name.length > 3) {
                products.push({
                  name,
                  price: '',
                  category: 'Perfumes',
                  brand: extractBrandFromName(name),
                  sku: generateSKU(name, products.length),
                });
              }
            }
          }
          // Continue with other patterns to get more products
        }
      }
    }
    }

    console.log(`Final result: ${products.length} products extracted`);

    return apiResponse({
      success: true,
      products: products.slice(0, 50),
      totalFound: products.length,
      siteType: detectSiteType(url),
      url
    });

  } catch (error) {
    console.error('Scraping error:', error);

    return apiError('Failed to scrape products: ' + (error instanceof Error ? error.message : 'Unknown error'), 500);
  }
});

// Helper functions
function extractProductInfo(html: string, baseUrl: URL) {
  const product: any = {};

  // Extract name using various patterns
  const namePatterns = [
    /<(?:h[1-6]|a)[^>]*class="[^"]*(?:product-title|title|name)[^"]*"[^>]*>([^<]+)<\/(?:h[1-6]|a)>/i,
    /<a[^>]*title="([^"]+)"[^>]*>/i,
    /<(?:h[1-6])[^>]*>([^<]*(?:oud|perfume|fragrance|parfum)[^<]*)<\/(?:h[1-6])>/i,
  ];

  for (const pattern of namePatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      product.name = cleanText(match[1]);
      if (product.name.length > 3) break;
    }
  }

  // Extract price
  const pricePatterns = [
    /class="[^"]*price[^"]*"[^>]*>[\s\S]*?([0-9,]+\.?[0-9]*)/i,
    /\$([0-9,]+\.?[0-9]*)/i,
    /(AED|SAR|QAR|₹)[\s]*([0-9,]+\.?[0-9]*)/i,
  ];

  for (const pattern of pricePatterns) {
    const match = html.match(pattern);
    if (match) {
      product.price = match[1] || match[2] || '';
      if (product.price) break;
    }
  }

  // Extract image URL
  const imgPattern = /<img[^>]*src="([^"]+)"[^>]*>/i;
  const imgMatch = html.match(imgPattern);
  if (imgMatch && imgMatch[1]) {
    let imageUrl = imgMatch[1];
    if (!imageUrl.startsWith('http')) {
      try {
        imageUrl = new URL(imageUrl, baseUrl.origin).href;
      } catch {}
    }
    product.imageUrl = imageUrl;
  }

  // Extract product URL
  const linkPattern = /<a[^>]*href="([^"]+)"[^>]*>/i;
  const linkMatch = html.match(linkPattern);
  if (linkMatch && linkMatch[1]) {
    let productUrl = linkMatch[1];
    if (!productUrl.startsWith('http')) {
      try {
        productUrl = new URL(productUrl, baseUrl.origin).href;
      } catch {}
    }
    product.url = productUrl;
  }

  if (product.name) {
    product.brand = extractBrandFromName(product.name);
    product.category = 'Perfumes';
    product.description = '';
  }

  return product;
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').replace(/&[^;]+;/g, ' ').trim();
}

function extractBrandFromName(name: string): string {
  const brandKeywords = ['Al Haramain', 'Ajmal', 'Rasasi', 'Amouage', 'Creed', 'Tom Ford', 'Dior', 'Chanel', 'Raees Al Oud'];
  for (const brand of brandKeywords) {
    if (name.toLowerCase().includes(brand.toLowerCase())) {
      return brand;
    }
  }
  return '';
}

function generateSKU(name: string, index: number): string {
  const prefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
  return `${prefix}-${String(index + 1).padStart(3, '0')}`;
}

function detectSiteType(url: string): string {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes('raeesaloud')) return 'raeesaloud';
    if (hostname.includes('shopify')) return 'shopify';
    return 'generic';
  } catch {
    return 'unknown';
  }
}

function isLikelyProductName(text: string): boolean {
  const perfumeKeywords = [
    'oud', 'perfume', 'fragrance', 'eau de', 'parfum', 'cologne', 'attar', 'scent',
    'musk', 'amber', 'rose', 'jasmine', 'sandalwood', 'vanilla', 'woody', 'floral',
    'ml', 'oz', 'bottle', 'spray', 'oil', 'concentrate'
  ];

  const lowerText = text.toLowerCase();
  return perfumeKeywords.some(keyword => lowerText.includes(keyword)) &&
         text.length > 5 &&
         text.length < 100 &&
         !text.includes('\n') &&
         /[a-zA-Z]/.test(text);
}

// Specialized extraction for single product pages
function extractSingleProductInfo(html: string, baseUrl: URL) {
  const product: any = {};

  // Extract product name with more specific patterns for single product pages
  const namePatterns = [
    // WooCommerce product title
    /<h1[^>]*class="[^"]*product_title[^"]*"[^>]*>([^<]+)<\/h1>/i,
    /<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>([^<]+)<\/h1>/i,
    // Shopify product title
    /<h1[^>]*class="[^"]*product-title[^"]*"[^>]*>([^<]+)<\/h1>/i,
    // Schema.org product name
    /<[^>]*itemprop="name"[^>]*>([^<]+)<\/[^>]*>/i,
    // Meta property
    /<meta[^>]*property="og:title"[^>]*content="([^"]+)"[^>]*\/?>/i,
    // Title tag fallback
    /<title[^>]*>([^<]*(?:oud|perfume|fragrance|parfum|attar)[^<]*)<\/title>/i,
    // Generic h1
    /<h1[^>]*>([^<]*(?:oud|perfume|fragrance|parfum|attar)[^<]*)<\/h1>/i,
  ];

  for (const pattern of namePatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const name = cleanText(match[1]);
      if (name.length > 5 && name.length < 150) {
        product.name = name;
        break;
      }
    }
  }

  // Extract price with more comprehensive patterns
  const pricePatterns = [
    // WooCommerce price
    /<span[^>]*class="[^"]*woocommerce-Price-amount[^"]*"[^>]*>([^<]*[\d,]+\.?\d*[^<]*)<\/span>/i,
    /<span[^>]*class="[^"]*price[^"]*"[^>]*>([^<]*[\d,]+\.?\d*[^<]*)<\/span>/i,
    // Schema.org price
    /<[^>]*itemprop="price"[^>]*content="([^"]+)"[^>]*\/?>/i,
    /<[^>]*itemprop="price"[^>]*>([^<]*[\d,]+\.?\d*[^<]*)<\/[^>]*>/i,
    // Meta property
    /<meta[^>]*property="product:price:amount"[^>]*content="([^"]+)"[^>]*\/?>/i,
    // Currency symbols
    /(?:AED|SAR|QAR|USD|\$|₹|€|£)\s*([\d,]+\.?\d*)/i,
    /([\d,]+\.?\d*)\s*(?:AED|SAR|QAR|USD|Dirham|Riyal)/i,
    // Generic price patterns
    /price[^>]*>.*?([\d,]+\.?\d*)/i,
  ];

  for (const pattern of pricePatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const price = match[1].replace(/[^\d.,]/g, '');
      if (price && parseFloat(price) > 0) {
        product.price = price;
        break;
      }
    }
  }

  // Extract description
  const descriptionPatterns = [
    // WooCommerce short description
    /<div[^>]*class="[^"]*woocommerce-product-details__short-description[^"]*"[^>]*>([^<]+)<\/div>/i,
    // Meta description
    /<meta[^>]*name="description"[^>]*content="([^"]+)"[^>]*\/?>/i,
    /<meta[^>]*property="og:description"[^>]*content="([^"]+)"[^>]*\/?>/i,
    // Schema.org description
    /<[^>]*itemprop="description"[^>]*>([^<]+)<\/[^>]*>/i,
  ];

  for (const pattern of descriptionPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const desc = cleanText(match[1]);
      if (desc.length > 10 && desc.length < 500) {
        product.description = desc;
        break;
      }
    }
  }

  // Extract main product image
  const imagePatterns = [
    // WooCommerce featured image
    /<img[^>]*class="[^"]*wp-post-image[^"]*"[^>]*src="([^"]+)"[^>]*>/i,
    // Schema.org image
    /<[^>]*itemprop="image"[^>]*src="([^"]+)"[^>]*>/i,
    /<img[^>]*itemprop="image"[^>]*src="([^"]+)"[^>]*>/i,
    // Meta property
    /<meta[^>]*property="og:image"[^>]*content="([^"]+)"[^>]*\/?>/i,
    // Product gallery main image
    /<img[^>]*class="[^"]*product[^"]*"[^>]*src="([^"]+)"[^>]*>/i,
  ];

  for (const pattern of imagePatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      let imageUrl = match[1];
      if (!imageUrl.startsWith('http')) {
        try {
          imageUrl = new URL(imageUrl, baseUrl.origin).href;
        } catch {}
      }
      if (imageUrl.includes('.jpg') || imageUrl.includes('.png') || imageUrl.includes('.webp')) {
        product.imageUrl = imageUrl;
        break;
      }
    }
  }

  // If we have a product name, set default values
  if (product.name) {
    product.brand = extractBrandFromName(product.name);
    product.category = 'Perfumes';
    product.url = baseUrl.href;
  }

  return product;
}