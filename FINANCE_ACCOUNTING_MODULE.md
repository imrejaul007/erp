# Finance & Accounting Module - UAE ERP System

## Overview

A comprehensive Finance & Accounting module built for the Perfume & Oud ERP system with full UAE compliance, multi-currency support, and integration capabilities. The system follows UAE accounting standards and supports the 5% VAT system.

## Architecture

The module is built with:
- **Framework**: Next.js 14 with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Validation**: Zod schemas
- **Currency**: AED as base currency with multi-currency support

## Core Features

### 1. UAE VAT Compliance System ✅
- **Standard Rate**: 5% VAT for most goods and services
- **Zero-Rated**: 0% VAT for exports and specific items
- **Exempt**: Non-taxable supplies
- **Reverse Charge**: VAT on imports
- **FTA Compliance**: Reports in UAE Federal Tax Authority format

#### API Endpoints:
```
GET    /api/finance/vat/dashboard          # VAT summary dashboard
GET    /api/finance/vat/returns            # VAT returns list
POST   /api/finance/vat/returns            # Create VAT return
GET    /api/finance/vat/reports            # Generate VAT reports
GET    /api/finance/vat/audit-trail        # VAT audit trail
POST   /api/finance/vat/audit-trail        # Log VAT changes
```

### 2. Double-Entry Accounting System ✅
- **Chart of Accounts**: UAE standard + customizable
- **General Ledger**: Full double-entry bookkeeping
- **Trial Balance**: Automated generation
- **Journal Entries**: With approval workflow
- **Account Reconciliation**: Built-in tools

#### API Endpoints:
```
GET    /api/finance/accounts/chart         # Chart of accounts
POST   /api/finance/accounts/chart         # Create account
PUT    /api/finance/accounts/chart         # Update account
PATCH  /api/finance/accounts/chart         # Initialize UAE standard accounts

GET    /api/finance/accounts/journal       # Journal entries list
POST   /api/finance/accounts/journal       # Create journal entry
GET    /api/finance/accounts/journal/[id]  # Get specific journal entry
POST   /api/finance/accounts/journal/[id]  # Post journal entry
DELETE /api/finance/accounts/journal/[id]  # Reverse journal entry

GET    /api/finance/accounts/trial-balance # Generate trial balance
POST   /api/finance/accounts/trial-balance # Save trial balance
```

### 3. Financial Reporting ✅
- **Profit & Loss Statement**: Monthly/Quarterly/Yearly
- **Balance Sheet**: UAE format compliance
- **Cash Flow Statement**: Direct and indirect methods
- **Cost Analysis**: Raw material → finished goods
- **Profit by Batch**: Production profitability

#### API Endpoints:
```
GET    /api/finance/reports/profit-loss    # P&L statement
POST   /api/finance/reports/profit-loss    # Save P&L statement
GET    /api/finance/reports/balance-sheet  # Balance sheet
POST   /api/finance/reports/balance-sheet  # Save balance sheet
GET    /api/finance/reports/cash-flow      # Cash flow statement
POST   /api/finance/reports/cash-flow      # Save cash flow statement
```

### 4. Integration Modules ✅
- **Tally Integration**: Import/Export with Tally ERP
- **QuickBooks Connector**: OAuth integration
- **Zoho Books Sync**: Cloud accounting sync
- **Bank Reconciliation**: Automated matching
- **Payment Gateway Integration**: Multi-gateway support

#### API Endpoints:
```
GET    /api/finance/integrations/tally          # Tally configuration
POST   /api/finance/integrations/tally          # Setup Tally integration
PUT    /api/finance/integrations/tally          # Sync with Tally

GET    /api/finance/integrations/quickbooks     # QuickBooks configuration
POST   /api/finance/integrations/quickbooks     # Complete OAuth
PUT    /api/finance/integrations/quickbooks     # Sync with QuickBooks
DELETE /api/finance/integrations/quickbooks     # Disconnect

GET    /api/finance/integrations/zoho-books     # Zoho Books configuration
POST   /api/finance/integrations/zoho-books     # Complete OAuth
PUT    /api/finance/integrations/zoho-books     # Sync with Zoho Books
DELETE /api/finance/integrations/zoho-books     # Disconnect
```

### 5. Payables & Receivables ✅
- **Supplier Management**: Complete supplier database
- **Purchase Management**: PO to payment cycle
- **Customer Receivables**: AR aging reports
- **Payment Processing**: Multiple payment methods
- **Credit Management**: Credit limits and terms

#### API Endpoints:
```
GET    /api/finance/payables               # Purchase orders and payables
POST   /api/finance/payables               # Create purchase order

GET    /api/finance/receivables            # Receivables aging report
POST   /api/finance/receivables            # Record payment
```

### 6. Multi-Currency Finance ✅
- **Exchange Rates**: Real-time and manual rates
- **Currency Conversion**: Automatic conversion
- **Gain/Loss Calculation**: Realized and unrealized
- **Hedging Management**: Foreign exchange hedging
- **Multi-Currency Reporting**: Consolidated reports

#### API Endpoints:
```
GET    /api/finance/currency               # Get currency rates
POST   /api/finance/currency               # Create/update rates
PUT    /api/finance/currency               # Sync from external API
PATCH  /api/finance/currency               # Calculate unrealized gains/losses
```

### 7. Finance Dashboard ✅
- **Cash Position**: Real-time cash flow
- **VAT Summary**: Current period VAT status
- **P&L Summary**: Quick profit/loss overview
- **KPIs**: Financial key performance indicators
- **Recent Transactions**: Latest financial activities

#### API Endpoints:
```
GET    /api/finance/dashboard              # Comprehensive dashboard data
```

## UAE Accounting Standards Compliance

### Chart of Accounts Structure
```
1000 - ASSETS
  1100 - Current Assets
    1110 - Cash in Hand
    1120 - Bank Accounts
    1130 - Accounts Receivable
    1140 - Inventory - Raw Materials
    1150 - Inventory - Finished Goods
    1160 - Prepaid Expenses
    1170 - VAT Recoverable
  1200 - Fixed Assets
    1210 - Property, Plant & Equipment
    1220 - Accumulated Depreciation

2000 - LIABILITIES
  2100 - Current Liabilities
    2110 - Accounts Payable
    2120 - VAT Payable
    2130 - Accrued Expenses
    2140 - Short-term Loans
  2200 - Long-term Liabilities
    2210 - Long-term Loans

3000 - EQUITY
  3100 - Share Capital
  3200 - Retained Earnings
  3300 - Current Year Profit/Loss

4000 - REVENUE
  4100 - Sales Revenue
    4110 - Perfume Sales
    4120 - Oud Sales
  4200 - Other Income

5000 - COST OF GOODS SOLD
  5100 - Raw Material Costs
  5200 - Direct Labor
  5300 - Manufacturing Overhead

6000 - OPERATING EXPENSES
  6100 - Selling Expenses
  6200 - Administrative Expenses
  6300 - Rent Expense
  6400 - Utilities
  6500 - Depreciation Expense
```

### VAT Configuration
- **Standard Rate**: 5%
- **Zero Rate**: 0% (exports, certain supplies)
- **Exempt Rate**: 0% (different treatment)
- **Filing Period**: Monthly
- **Filing Deadline**: 28th of following month

## Technical Implementation

### Type Definitions
Located in `/types/finance.ts`:
- Complete TypeScript interfaces
- Zod validation schemas
- Enum definitions for status fields
- API response types

### Database Schema Integration
The system extends the existing Prisma schema with:
- Finance-specific tables
- VAT compliance tables
- Multi-currency support
- Audit trail tables

### Security Features
- Session-based authentication
- Role-based access control
- Input validation with Zod
- SQL injection prevention
- Audit trails for all changes

### Performance Optimization
- Database query optimization
- Pagination for large datasets
- Caching for frequently accessed data
- Background processing for reports

## API Response Formats

### Standard Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Standard Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ]
}
```

## Supported Export Formats
- **JSON**: Default API response format
- **CSV**: For Excel compatibility
- **XML**: For FTA VAT returns
- **PDF**: For official reports (implementation pending)

## Environment Variables Required

```env
# Database
DATABASE_URL="postgresql://..."

# QuickBooks Integration
QUICKBOOKS_CLIENT_ID="your_quickbooks_client_id"
QUICKBOOKS_CLIENT_SECRET="your_quickbooks_client_secret"
QUICKBOOKS_REDIRECT_URI="your_redirect_uri"

# Zoho Books Integration
ZOHO_BOOKS_CLIENT_ID="your_zoho_client_id"
ZOHO_BOOKS_CLIENT_SECRET="your_zoho_client_secret"
ZOHO_BOOKS_REDIRECT_URI="your_redirect_uri"

# Company Details
COMPANY_TRN="123456789012345"  # Tax Registration Number
```

## Installation & Setup

1. **Database Migration**: Run Prisma migrations to create finance tables
2. **Seed Data**: Initialize UAE standard chart of accounts
3. **Environment Setup**: Configure required environment variables
4. **Integration Setup**: Configure external system integrations

### Initialize UAE Chart of Accounts
```bash
curl -X PATCH http://localhost:3000/api/finance/accounts/chart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Usage Examples

### Create Journal Entry
```javascript
const journalEntry = {
  description: "Monthly depreciation entry",
  transactionDate: "2024-01-31",
  currency: "AED",
  lineItems: [
    {
      accountId: "depreciation_expense_account_id",
      description: "Depreciation Expense",
      debitAmount: 5000,
      creditAmount: 0
    },
    {
      accountId: "accumulated_depreciation_account_id",
      description: "Accumulated Depreciation",
      debitAmount: 0,
      creditAmount: 5000
    }
  ]
};

const response = await fetch('/api/finance/accounts/journal', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(journalEntry)
});
```

### Generate VAT Return
```javascript
const vatReturn = {
  period: "2024-01",
  standardRatedSupplies: 100000,
  zeroRatedSupplies: 20000,
  exemptSupplies: 5000,
  standardRatedPurchases: 60000,
  reverseChargeVAT: 500
};

const response = await fetch('/api/finance/vat/returns', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(vatReturn)
});
```

## Best Practices

### Data Entry
- Always use double-entry bookkeeping
- Validate all monetary amounts
- Maintain proper audit trails
- Use appropriate currency rates

### VAT Compliance
- Record VAT transactions immediately
- Maintain proper supporting documents
- File returns on time
- Keep detailed audit trails

### Multi-Currency
- Update exchange rates regularly
- Calculate unrealized gains/losses monthly
- Use appropriate rate sources
- Document rate selection methodology

## Future Enhancements

1. **Advanced Reporting**: Custom report builder
2. **AI Insights**: Machine learning for financial analysis
3. **Mobile App**: Mobile finance management
4. **API Gateway**: Enhanced API management
5. **Real-time Sync**: Live data synchronization
6. **Blockchain**: Immutable audit trails

## Support & Maintenance

- Regular database backups
- Monitor API performance
- Update exchange rates daily
- Review VAT compliance monthly
- Audit trail verification
- Security updates

## Compliance Certifications

- UAE Federal Tax Authority (FTA) compliant
- International Financial Reporting Standards (IFRS) aligned
- ISO 27001 security standards ready
- SOX compliance features available

---

**Created**: September 29, 2024
**Version**: 1.0.0
**Status**: Production Ready
**License**: Proprietary

For technical support or feature requests, please contact the development team.