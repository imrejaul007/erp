// Finance & Accounting Module Types for UAE ERP System
// Comprehensive types supporting UAE VAT compliance and multi-currency operations

export interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
  nameAr?: string;
  type: AccountType;
  parentId?: string;
  level: number;
  balance: number;
  currency: string;
  isActive: boolean;
  description?: string;
  taxCode?: string;
  isControlAccount: boolean;
  allowPosting: boolean;
  createdAt: Date;
  updatedAt: Date;
  children?: ChartOfAccount[];
  parent?: ChartOfAccount;
}

export interface JournalEntry {
  id: string;
  journalNo: string;
  reference?: string;
  description: string;
  transactionDate: Date;
  postingDate?: Date;
  currency: string;
  exchangeRate: number;
  totalDebit: number;
  totalCredit: number;
  status: JournalEntryStatus;
  source: string; // manual, sales, purchase, inventory, payroll
  sourceId?: string;
  approvedBy?: string;
  approvedAt?: Date;
  reversedBy?: string;
  reversedAt?: Date;
  reversalReason?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lineItems: JournalEntryLine[];
}

export interface JournalEntryLine {
  id: string;
  journalEntryId: string;
  lineNumber: number;
  accountId: string;
  description: string;
  debitAmount: number;
  creditAmount: number;
  currency: string;
  exchangeRate: number;
  debitAmountBase: number;
  creditAmountBase: number;
  vatCode?: string;
  vatAmount?: number;
  costCenter?: string;
  project?: string;
  dimension1?: string;
  dimension2?: string;
  account?: ChartOfAccount;
}

export interface TrialBalance {
  id: string;
  period: string; // YYYY-MM
  asOfDate: Date;
  currency: string;
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
  generatedBy: string;
  generatedAt: Date;
  balances: TrialBalanceItem[];
}

export interface TrialBalanceItem {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountNameAr?: string;
  accountType: AccountType;
  openingBalance: number;
  debitMovements: number;
  creditMovements: number;
  closingBalance: number;
}

// UAE VAT Compliance Types
export interface VATConfiguration {
  id: string;
  standardRate: number; // 5% for UAE
  zeroRate: number; // 0%
  exemptRate: number; // 0% but different treatment
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTo?: Date;
}

export interface VATCode {
  id: string;
  code: string;
  name: string;
  nameAr?: string;
  rate: number;
  type: VATCodeType;
  description?: string;
  accountId: string; // VAT account for posting
  isActive: boolean;
  reportingCategory: string; // for FTA reporting
}

export interface VATTransaction {
  id: string;
  transactionNo: string;
  type: VATTransactionType;
  invoiceNo?: string;
  supplierTaxNo?: string;
  customerTaxNo?: string;
  transactionDate: Date;
  currency: string;
  netAmount: number;
  vatAmount: number;
  grossAmount: number;
  vatRate: number;
  vatCode: string;
  status: VATTransactionStatus;
  isReverseCharge: boolean;
  description: string;
  sourceDocument: string;
  sourceId: string;
  period: string; // YYYY-MM
  filingStatus: VATFilingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface VATReturn {
  id: string;
  period: string; // YYYY-MM
  startDate: Date;
  endDate: Date;
  currency: string;
  standardRatedSupplies: number;
  zeroRatedSupplies: number;
  exemptSupplies: number;
  outputVAT: number;
  standardRatedPurchases: number;
  inputVAT: number;
  reverseChargeVAT: number;
  netVATDue: number;
  status: VATReturnStatus;
  submittedAt?: Date;
  submittedBy?: string;
  ftaReference?: string;
  createdAt: Date;
  updatedAt: Date;
  transactions: VATTransaction[];
}

export interface VATAuditTrail {
  id: string;
  vatTransactionId: string;
  action: string;
  oldValue?: any;
  newValue?: any;
  reason?: string;
  performedBy: string;
  performedAt: Date;
}

// Financial Reporting Types
export interface ProfitLossStatement {
  id: string;
  period: string;
  periodType: ReportPeriodType;
  startDate: Date;
  endDate: Date;
  currency: string;
  revenue: ProfitLossSection;
  costOfGoodsSold: ProfitLossSection;
  grossProfit: number;
  operatingExpenses: ProfitLossSection;
  operatingIncome: number;
  otherIncome: ProfitLossSection;
  otherExpenses: ProfitLossSection;
  netProfitBeforeTax: number;
  taxExpense: number;
  netProfitAfterTax: number;
  generatedAt: Date;
  generatedBy: string;
}

export interface ProfitLossSection {
  total: number;
  items: ProfitLossItem[];
}

export interface ProfitLossItem {
  accountId: string;
  accountCode: string;
  accountName: string;
  amount: number;
  percentage: number;
}

export interface BalanceSheet {
  id: string;
  asOfDate: Date;
  currency: string;
  assets: BalanceSheetSection;
  liabilities: BalanceSheetSection;
  equity: BalanceSheetSection;
  totalAssets: number;
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
  generatedAt: Date;
  generatedBy: string;
}

export interface BalanceSheetSection {
  total: number;
  subsections: BalanceSheetSubsection[];
}

export interface BalanceSheetSubsection {
  name: string;
  nameAr?: string;
  total: number;
  items: BalanceSheetItem[];
}

export interface BalanceSheetItem {
  accountId: string;
  accountCode: string;
  accountName: string;
  amount: number;
}

export interface CashFlowStatement {
  id: string;
  period: string;
  startDate: Date;
  endDate: Date;
  currency: string;
  operatingActivities: CashFlowSection;
  investingActivities: CashFlowSection;
  financingActivities: CashFlowSection;
  netCashFlow: number;
  openingCashBalance: number;
  closingCashBalance: number;
  generatedAt: Date;
  generatedBy: string;
}

export interface CashFlowSection {
  total: number;
  items: CashFlowItem[];
}

export interface CashFlowItem {
  description: string;
  amount: number;
  category: string;
}

// Multi-Currency Types
export interface CurrencyRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  rateDate: Date;
  source: string; // central_bank, manual, api
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CurrencyGainLoss {
  id: string;
  transactionId: string;
  currency: string;
  originalAmount: number;
  originalRate: number;
  currentRate: number;
  gainLossAmount: number;
  type: 'realized' | 'unrealized';
  accountId: string;
  recognizedAt: Date;
}

// Payables & Receivables Types
export interface Supplier {
  id: string;
  supplierNo: string;
  name: string;
  nameAr?: string;
  type: SupplierType;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country: string;
  vatNumber?: string;
  trn?: string; // Tax Registration Number
  paymentTerms: number; // days
  creditLimit: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Purchase {
  id: string;
  purchaseNo: string;
  supplierId: string;
  invoiceNo?: string;
  invoiceDate: Date;
  dueDate: Date;
  currency: string;
  exchangeRate: number;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  status: PurchaseStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  supplier?: Supplier;
  lineItems: PurchaseLineItem[];
  payments: PurchasePayment[];
}

export interface PurchaseLineItem {
  id: string;
  purchaseId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  rawMaterialId?: string;
  assetId?: string;
}

export interface PurchasePayment {
  id: string;
  purchaseId: string;
  paymentNo: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  reference?: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgingReport {
  id: string;
  type: 'receivables' | 'payables';
  asOfDate: Date;
  currency: string;
  totalAmount: number;
  current: number;
  days30: number;
  days60: number;
  days90: number;
  days90Plus: number;
  items: AgingReportItem[];
  generatedAt: Date;
  generatedBy: string;
}

export interface AgingReportItem {
  id: string;
  customerSupplierId: string;
  name: string;
  totalAmount: number;
  current: number;
  days30: number;
  days60: number;
  days90: number;
  days90Plus: number;
  overdueDays: number;
}

// Integration Types
export interface TallyIntegration {
  id: string;
  companyName: string;
  serverAddress: string;
  port: number;
  username?: string;
  lastSyncAt?: Date;
  isActive: boolean;
  syncSettings: TallySyncSettings;
}

export interface TallySyncSettings {
  syncAccounts: boolean;
  syncCustomers: boolean;
  syncSuppliers: boolean;
  syncVouchers: boolean;
  syncInventory: boolean;
  autoSync: boolean;
  syncInterval: number; // minutes
}

export interface QuickBooksConfig {
  id: string;
  companyId: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: Date;
  baseUrl: string;
  lastSyncAt?: Date;
  isActive: boolean;
}

export interface ZohoBooksConfig {
  id: string;
  organizationId: string;
  clientId: string;
  clientSecret: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: Date;
  lastSyncAt?: Date;
  isActive: boolean;
}

export interface BankAccount {
  id: string;
  accountNo: string;
  bankName: string;
  branchName?: string;
  iban?: string;
  swiftCode?: string;
  currency: string;
  accountType: BankAccountType;
  balance: number;
  isActive: boolean;
  chartAccountId: string; // Link to chart of accounts
  lastReconciliationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BankTransaction {
  id: string;
  bankAccountId: string;
  transactionDate: Date;
  description: string;
  reference?: string;
  debitAmount?: number;
  creditAmount?: number;
  runningBalance: number;
  status: BankTransactionStatus;
  isReconciled: boolean;
  reconciledAt?: Date;
  journalEntryId?: string;
  importedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BankReconciliation {
  id: string;
  bankAccountId: string;
  period: string;
  statementDate: Date;
  openingBalance: number;
  closingBalance: number;
  bookBalance: number;
  difference: number;
  status: ReconciliationStatus;
  reconciledBy?: string;
  reconciledAt?: Date;
  adjustments: BankAdjustment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BankAdjustment {
  id: string;
  reconciliationId: string;
  description: string;
  amount: number;
  type: 'outstanding_deposit' | 'outstanding_cheque' | 'bank_charge' | 'interest';
  journalEntryId?: string;
}

// Enums
export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE'
}

export enum JournalEntryStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  POSTED = 'POSTED',
  REVERSED = 'REVERSED'
}

export enum VATCodeType {
  STANDARD = 'STANDARD',
  ZERO_RATED = 'ZERO_RATED',
  EXEMPT = 'EXEMPT'
}

export enum VATTransactionType {
  SALE = 'SALE',
  PURCHASE = 'PURCHASE',
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT'
}

export enum VATTransactionStatus {
  ACTIVE = 'ACTIVE',
  REVERSED = 'REVERSED',
  CANCELLED = 'CANCELLED'
}

export enum VATFilingStatus {
  NOT_FILED = 'NOT_FILED',
  FILED = 'FILED',
  AMENDED = 'AMENDED'
}

export enum VATReturnStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export enum ReportPeriodType {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY'
}

export enum SupplierType {
  INDIVIDUAL = 'INDIVIDUAL',
  CORPORATE = 'CORPORATE'
}

export enum PurchaseStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CARD = 'CARD',
  DIGITAL_WALLET = 'DIGITAL_WALLET'
}

export enum BankAccountType {
  CURRENT = 'CURRENT',
  SAVINGS = 'SAVINGS',
  FIXED_DEPOSIT = 'FIXED_DEPOSIT',
  LOAN = 'LOAN'
}

export enum BankTransactionStatus {
  PENDING = 'PENDING',
  CLEARED = 'CLEARED',
  REJECTED = 'REJECTED'
}

export enum ReconciliationStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  APPROVED = 'APPROVED'
}

// API Response Types
export interface FinanceApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FinanceDashboardData {
  cashPosition: {
    totalCash: number;
    bankAccounts: Array<{
      accountName: string;
      balance: number;
      currency: string;
    }>;
  };
  vatSummary: {
    currentPeriod: string;
    outputVAT: number;
    inputVAT: number;
    netVATDue: number;
    filingDueDate: Date;
  };
  profitLoss: {
    revenue: number;
    expenses: number;
    netProfit: number;
    profitMargin: number;
  };
  receivables: {
    total: number;
    overdue: number;
    current: number;
  };
  payables: {
    total: number;
    overdue: number;
    current: number;
  };
}

export interface CostAnalysisData {
  batchId: string;
  batchNo: string;
  productName: string;
  rawMaterialCosts: Array<{
    materialName: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }>;
  laborCosts: Array<{
    stage: string;
    hours: number;
    rate: number;
    totalCost: number;
  }>;
  overheadCosts: Array<{
    category: string;
    amount: number;
  }>;
  totalCost: number;
  costPerUnit: number;
  sellingPrice: number;
  grossProfit: number;
  profitMargin: number;
}

export interface ProfitByBatchData {
  batchId: string;
  batchNo: string;
  productName: string;
  productionDate: Date;
  quantityProduced: number;
  quantitySold: number;
  totalCost: number;
  totalRevenue: number;
  grossProfit: number;
  profitMargin: number;
  status: string;
}

// Form Types
export interface JournalEntryForm {
  reference?: string;
  description: string;
  transactionDate: Date;
  currency: string;
  lineItems: Array<{
    accountId: string;
    description: string;
    debitAmount: number;
    creditAmount: number;
  }>;
}

export interface VATReturnForm {
  period: string;
  standardRatedSupplies: number;
  zeroRatedSupplies: number;
  exemptSupplies: number;
  standardRatedPurchases: number;
  reverseChargeVAT: number;
}

export interface BankReconciliationForm {
  bankAccountId: string;
  statementDate: Date;
  openingBalance: number;
  closingBalance: number;
  adjustments: Array<{
    description: string;
    amount: number;
    type: string;
  }>;
}