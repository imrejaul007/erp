/**
 * Data export utilities for Excel, CSV, and PDF
 * Supports exporting reports, inventory, sales data, etc.
 */

/**
 * Convert array of objects to CSV string
 */
export function arrayToCSV<T extends Record<string, any>>(
  data: T[],
  columns?: { key: keyof T; label: string }[]
): string {
  if (data.length === 0) {
    return '';
  }

  // If columns not specified, use all keys from first object
  const cols = columns || Object.keys(data[0]).map((key) => ({ key, label: key }));

  // Create header row
  const headers = cols.map((col) => escapeCSV(col.label));
  const headerRow = headers.join(',');

  // Create data rows
  const dataRows = data.map((row) => {
    return cols
      .map((col) => {
        const value = row[col.key];
        return escapeCSV(String(value ?? ''));
      })
      .join(',');
  });

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Escape CSV values
 */
function escapeCSV(value: string): string {
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Download CSV file in browser
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export table data to CSV
 */
export function exportTableToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
): void {
  const csv = arrayToCSV(data, columns);
  downloadCSV(filename, csv);
}

/**
 * Generate Excel-compatible CSV with BOM
 */
export function arrayToExcelCSV<T extends Record<string, any>>(
  data: T[],
  columns?: { key: keyof T; label: string }[]
): string {
  const csv = arrayToCSV(data, columns);
  // Add BOM for Excel compatibility
  return '\uFEFF' + csv;
}

/**
 * Download Excel-compatible CSV
 */
export function downloadExcelCSV(filename: string, csvContent: string): void {
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format date for export
 */
export function formatDateForExport(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * Format currency for export
 */
export function formatCurrencyForExport(
  amount: number,
  currency: string = 'AED'
): string {
  return `${currency} ${amount.toFixed(2)}`;
}

/**
 * Export templates for common entities
 */

export interface InventoryExportRow {
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  cost: number;
  price: number;
  value: number;
}

export function exportInventory(data: InventoryExportRow[], filename?: string) {
  const columns = [
    { key: 'sku' as const, label: 'SKU' },
    { key: 'name' as const, label: 'Product Name' },
    { key: 'category' as const, label: 'Category' },
    { key: 'quantity' as const, label: 'Quantity' },
    { key: 'unit' as const, label: 'Unit' },
    { key: 'cost' as const, label: 'Cost' },
    { key: 'price' as const, label: 'Price' },
    { key: 'value' as const, label: 'Total Value' },
  ];

  exportTableToCSV(
    data,
    filename || `inventory-export-${Date.now()}.csv`,
    columns
  );
}

export interface SalesExportRow {
  date: string;
  orderId: string;
  customer: string;
  items: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: string;
}

export function exportSales(data: SalesExportRow[], filename?: string) {
  const columns = [
    { key: 'date' as const, label: 'Date' },
    { key: 'orderId' as const, label: 'Order ID' },
    { key: 'customer' as const, label: 'Customer' },
    { key: 'items' as const, label: 'Items' },
    { key: 'subtotal' as const, label: 'Subtotal' },
    { key: 'discount' as const, label: 'Discount' },
    { key: 'tax' as const, label: 'Tax' },
    { key: 'total' as const, label: 'Total' },
    { key: 'paymentMethod' as const, label: 'Payment Method' },
    { key: 'status' as const, label: 'Status' },
  ];

  exportTableToCSV(data, filename || `sales-export-${Date.now()}.csv`, columns);
}

export interface CustomerExportRow {
  name: string;
  email: string;
  phone: string;
  type: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
}

export function exportCustomers(data: CustomerExportRow[], filename?: string) {
  const columns = [
    { key: 'name' as const, label: 'Name' },
    { key: 'email' as const, label: 'Email' },
    { key: 'phone' as const, label: 'Phone' },
    { key: 'type' as const, label: 'Type' },
    { key: 'totalOrders' as const, label: 'Total Orders' },
    { key: 'totalSpent' as const, label: 'Total Spent' },
    { key: 'lastOrder' as const, label: 'Last Order' },
  ];

  exportTableToCSV(
    data,
    filename || `customers-export-${Date.now()}.csv`,
    columns
  );
}

/**
 * Simple HTML to PDF converter
 * For production, consider using a library like jsPDF or pdfmake
 */
export function printToPDF(elementId: string, title?: string): void {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    return;
  }

  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('Failed to open print window');
    return;
  }

  // Write HTML content
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title || 'Print'}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  // Print after content loads
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}
