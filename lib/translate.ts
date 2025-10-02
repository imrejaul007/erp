/**
 * Auto-translate utility for English to Arabic translation
 * Uses browser's built-in Translation API or Google Translate API
 */

export interface TranslateOptions {
  from?: string;
  to?: string;
  fallback?: string;
}

/**
 * Translate text from English to Arabic using Google Translate API
 * For production, you'll need to add GOOGLE_TRANSLATE_API_KEY to .env
 */
export async function translateText(
  text: string,
  options: TranslateOptions = {}
): Promise<string> {
  const { from = 'en', to = 'ar', fallback = text } = options;

  // Return original if empty
  if (!text || text.trim() === '') {
    return fallback;
  }

  try {
    // Option 1: Use Google Translate API (if API key is available)
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;

    if (apiKey) {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            source: from,
            target: to,
            format: 'text',
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.data.translations[0].translatedText;
      }
    }

    // Option 2: Use MyMemory Translation API (Free, no API key required)
    const myMemoryResponse = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${from}|${to}`
    );

    if (myMemoryResponse.ok) {
      const data = await myMemoryResponse.json();
      if (data.responseStatus === 200) {
        return data.responseData.translatedText;
      }
    }

    // Option 3: Use LibreTranslate API (Free, self-hosted option)
    const libreResponse = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: from,
        target: to,
        format: 'text',
      }),
    });

    if (libreResponse.ok) {
      const data = await libreResponse.json();
      return data.translatedText;
    }

    // Fallback: Return original text
    return fallback;
  } catch (error) {
    console.error('Translation error:', error);
    return fallback;
  }
}

/**
 * Translate multiple texts at once
 */
export async function translateBatch(
  texts: string[],
  options: TranslateOptions = {}
): Promise<string[]> {
  const promises = texts.map((text) => translateText(text, options));
  return Promise.all(promises);
}

/**
 * Translate an object with multiple text fields
 */
export async function translateObject<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[],
  options: TranslateOptions = {}
): Promise<Partial<T>> {
  const result: Partial<T> = {};

  for (const field of fields) {
    const value = obj[field];
    if (typeof value === 'string') {
      result[field] = (await translateText(value, options)) as any;
    }
  }

  return result;
}

/**
 * Common Oud & Perfume terms - English to Arabic dictionary
 * This provides instant translation for common terms without API calls
 */
export const commonTerms: Record<string, string> = {
  // Products
  'Oud': 'عود',
  'Oud Oil': 'زيت العود',
  'Attar': 'عطر',
  'Perfume': 'عطر',
  'Fragrance': 'رائحة',
  'Incense': 'بخور',
  'Chips': 'رقائق',
  'Wood': 'خشب',
  'Rose': 'ورد',
  'Musk': 'مسك',
  'Amber': 'عنبر',
  'Sandalwood': 'صندل',
  'Agarwood': 'عود',

  // Units
  'ml': 'مل',
  'gram': 'جرام',
  'grams': 'جرام',
  'tola': 'تولة',
  'ounce': 'أونصة',
  'kg': 'كجم',
  'liter': 'لتر',

  // Quality
  'Premium': 'فاخر',
  'Deluxe': 'ديلوكس',
  'Royal': 'ملكي',
  'Classic': 'كلاسيكي',
  'Limited Edition': 'إصدار محدود',
  'Exclusive': 'حصري',

  // Invoice Terms
  'Invoice': 'فاتورة',
  'Receipt': 'إيصال',
  'Date': 'التاريخ',
  'Time': 'الوقت',
  'Customer': 'العميل',
  'Items': 'المنتجات',
  'Quantity': 'الكمية',
  'Price': 'السعر',
  'Subtotal': 'المجموع الفرعي',
  'Discount': 'خصم',
  'VAT': 'ضريبة القيمة المضافة',
  'Total': 'الإجمالي',
  'Grand Total': 'المبلغ الإجمالي',
  'Payment': 'الدفع',
  'Cash': 'نقدي',
  'Card': 'بطاقة',
  'Change': 'الباقي',
  'Thank you': 'شكراً لك',
  'Welcome': 'مرحباً',

  // Store Info
  'Store': 'متجر',
  'Address': 'العنوان',
  'Phone': 'الهاتف',
  'Email': 'البريد الإلكتروني',
  'Website': 'الموقع الإلكتروني',
  'VAT Number': 'الرقم الضريبي',
  'Trade License': 'الرخصة التجارية',
};

/**
 * Quick translate using dictionary (instant, no API call)
 */
export function quickTranslate(text: string): string {
  // Check if exact match exists
  if (commonTerms[text]) {
    return commonTerms[text];
  }

  // Check for partial matches (case-insensitive)
  const lowerText = text.toLowerCase();
  for (const [key, value] of Object.entries(commonTerms)) {
    if (lowerText === key.toLowerCase()) {
      return value;
    }
  }

  return text;
}

/**
 * Auto-translate helper for branding
 * Tries dictionary first, then falls back to API
 */
export async function autoTranslate(text: string): Promise<string> {
  // Try quick translate first
  const quick = quickTranslate(text);
  if (quick !== text) {
    return quick;
  }

  // Fall back to API translation
  return translateText(text, { from: 'en', to: 'ar', fallback: text });
}
