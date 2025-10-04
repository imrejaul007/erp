/**
 * QR Code Generator for UAE e-Invoice Compliance
 * Implements TLV (Tag-Length-Value) format as per ZATCA/UAE e-invoicing standards
 */

interface InvoiceData {
  sellerName: string;
  vatNumber: string;
  timestamp: Date;
  totalAmount: number;
  vatAmount: number;
}

/**
 * Convert a string to hexadecimal representation
 */
function stringToHex(str: string): string {
  return Buffer.from(str, 'utf8').toString('hex');
}

/**
 * Convert number to hex with proper length encoding
 */
function encodeLength(length: number): string {
  return length.toString(16).padStart(2, '0');
}

/**
 * Create TLV (Tag-Length-Value) encoded field
 * @param tag - Field identifier
 * @param value - Field value
 */
function createTLVField(tag: number, value: string): string {
  const hexValue = stringToHex(value);
  const length = hexValue.length / 2; // Length in bytes
  const hexTag = tag.toString(16).padStart(2, '0');
  const hexLength = encodeLength(length);

  return hexTag + hexLength + hexValue;
}

/**
 * Generate UAE e-Invoice QR Code data in TLV format
 *
 * Format follows UAE/ZATCA standards:
 * Tag 1: Seller Name
 * Tag 2: VAT Registration Number
 * Tag 3: Invoice Timestamp (ISO 8601)
 * Tag 4: Invoice Total (with VAT)
 * Tag 5: VAT Amount
 *
 * @param data - Invoice data for QR code generation
 * @returns Base64-encoded TLV string for QR code
 */
export function generateUAEInvoiceQRCode(data: InvoiceData): string {
  // Tag 1: Seller Name
  const sellerNameTLV = createTLVField(1, data.sellerName);

  // Tag 2: VAT Registration Number
  const vatNumberTLV = createTLVField(2, data.vatNumber);

  // Tag 3: Timestamp (ISO 8601 format)
  const timestamp = data.timestamp.toISOString();
  const timestampTLV = createTLVField(3, timestamp);

  // Tag 4: Invoice Total (formatted to 2 decimal places)
  const totalStr = data.totalAmount.toFixed(2);
  const totalTLV = createTLVField(4, totalStr);

  // Tag 5: VAT Amount (formatted to 2 decimal places)
  const vatStr = data.vatAmount.toFixed(2);
  const vatTLV = createTLVField(5, vatStr);

  // Concatenate all TLV fields
  const tlvData = sellerNameTLV + vatNumberTLV + timestampTLV + totalTLV + vatTLV;

  // Convert hex string to buffer and encode as base64
  const buffer = Buffer.from(tlvData, 'hex');
  return buffer.toString('base64');
}

/**
 * Generate a simple QR code data string (for non-UAE invoices)
 * @param invoiceNumber - Invoice number
 * @param totalAmount - Total invoice amount
 * @param currency - Currency code
 * @returns JSON string for QR code
 */
export function generateSimpleInvoiceQRCode(
  invoiceNumber: string,
  totalAmount: number,
  currency: string = 'AED'
): string {
  const qrData = {
    invoice: invoiceNumber,
    amount: totalAmount.toFixed(2),
    currency,
    timestamp: new Date().toISOString(),
  };

  return JSON.stringify(qrData);
}

/**
 * Decode UAE TLV QR code data (for verification)
 * @param base64Data - Base64-encoded TLV data
 * @returns Decoded invoice data
 */
export function decodeUAEInvoiceQRCode(base64Data: string): Partial<InvoiceData> {
  const buffer = Buffer.from(base64Data, 'base64');
  const hexData = buffer.toString('hex');

  const result: any = {};
  let offset = 0;

  while (offset < hexData.length) {
    // Read tag (1 byte = 2 hex chars)
    const tag = parseInt(hexData.substr(offset, 2), 16);
    offset += 2;

    // Read length (1 byte = 2 hex chars)
    const length = parseInt(hexData.substr(offset, 2), 16);
    offset += 2;

    // Read value (length bytes = length * 2 hex chars)
    const valueHex = hexData.substr(offset, length * 2);
    const value = Buffer.from(valueHex, 'hex').toString('utf8');
    offset += length * 2;

    // Map tags to field names
    switch (tag) {
      case 1:
        result.sellerName = value;
        break;
      case 2:
        result.vatNumber = value;
        break;
      case 3:
        result.timestamp = new Date(value);
        break;
      case 4:
        result.totalAmount = parseFloat(value);
        break;
      case 5:
        result.vatAmount = parseFloat(value);
        break;
    }
  }

  return result;
}

/**
 * Generate payment QR code for popular payment apps
 * @param phoneNumber - Payment account phone number
 * @param amount - Payment amount
 * @param reference - Payment reference (invoice number)
 * @returns Payment QR code data
 */
export function generatePaymentQRCode(
  phoneNumber: string,
  amount: number,
  reference: string
): string {
  // UAE common payment QR format
  const qrData = {
    type: 'payment',
    phone: phoneNumber,
    amount: amount.toFixed(2),
    currency: 'AED',
    reference,
  };

  return JSON.stringify(qrData);
}
