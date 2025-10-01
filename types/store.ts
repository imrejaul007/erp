// Store and Multi-Location Management Types
export interface Store {
  id: string;
  name: string;
  code: string; // Unique store identifier
  type: StoreType;
  status: StoreStatus;
  emirate: UAEEmirate;
  city: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  phone?: string;
  email?: string;
  managerId?: string;
  manager?: StoreManager;
  parentStoreId?: string; // For store hierarchy
  parentStore?: Store;
  childStores?: Store[];
  openingHours: OpeningHours;
  settings: StoreSettings;
  metrics?: StoreMetrics;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}

export interface StoreManager {
  id: string;
  name: string;
  email: string;
  phone?: string;
  storeId: string;
}

export interface StoreSettings {
  id: string;
  storeId: string;
  taxRate: number;
  currency: string;
  timezone: string;
  autoReplenishment: boolean;
  minStockThreshold: number;
  maxStockThreshold: number;
  enableTransfers: boolean;
  requireTransferApproval: boolean;
  enablePriceSync: boolean;
  enablePromotionSync: boolean;
  emergencyContactEmail?: string;
  notificationSettings: NotificationSettings;
}

export interface NotificationSettings {
  lowStockAlerts: boolean;
  transferAlerts: boolean;
  salesAlerts: boolean;
  emergencyAlerts: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface OpeningHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime?: string; // "09:00"
  closeTime?: string; // "21:00"
  breakStart?: string;
  breakEnd?: string;
}

export interface StoreMetrics {
  totalSales: number;
  monthlyRevenue: number;
  averageOrderValue: number;
  footfall: number;
  conversionRate: number;
  topProducts: ProductSalesMetric[];
  performanceScore: number;
  inventoryTurnover: number;
  stockValue: number;
  lowStockItems: number;
  lastUpdated: Date;
}

export interface ProductSalesMetric {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
  rank: number;
}

// Transfer System Types
export interface TransferRequest {
  id: string;
  transferNumber: string;
  fromStoreId: string;
  toStoreId: string;
  fromStore: Store;
  toStore: Store;
  status: TransferStatus;
  priority: TransferPriority;
  requestedById: string;
  requestedBy: User;
  approvedById?: string;
  approvedBy?: User;
  items: TransferItem[];
  notes?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  trackingNumber?: string;
  shippingCost?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransferItem {
  id: string;
  transferId: string;
  productId: string;
  product: Product;
  quantityRequested: number;
  quantityApproved?: number;
  quantityShipped?: number;
  quantityReceived?: number;
  unitCost: number;
  notes?: string;
  batchNumber?: string;
  expiryDate?: Date;
}

export interface TransferTracking {
  id: string;
  transferId: string;
  status: TransferStatus;
  location?: string;
  notes?: string;
  timestamp: Date;
  updatedById: string;
  updatedBy: User;
}

// Multi-Location Inventory Types
export interface LocationInventory {
  id: string;
  storeId: string;
  store: Store;
  productId: string;
  product: Product;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  minLevel: number;
  maxLevel: number;
  reorderPoint: number;
  averageCost: number;
  lastMovementDate?: Date;
  lastCountDate?: Date;
  status: InventoryStatus;
}

export interface StockDistribution {
  productId: string;
  productName: string;
  totalStock: number;
  locations: StockLocation[];
  reorderSuggestions: ReorderSuggestion[];
  lastUpdated: Date;
}

export interface StockLocation {
  storeId: string;
  storeName: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  stockValue: number;
  lastMovement?: Date;
  status: InventoryStatus;
}

export interface ReorderSuggestion {
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  currentStock: number;
  suggestedQuantity: number;
  priority: ReorderPriority;
  reason: string;
  estimatedCost: number;
}

// Auto-Replenishment Types
export interface ReplenishmentRule {
  id: string;
  storeId: string;
  productId?: string; // null for store-wide rules
  categoryId?: string; // null for product-specific rules
  minLevel: number;
  maxLevel: number;
  reorderQuantity: number;
  leadTimeDays: number;
  safetyStock: number;
  seasonalAdjustment: SeasonalAdjustment[];
  isActive: boolean;
  autoApprove: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SeasonalAdjustment {
  month: number; // 1-12
  adjustmentPercentage: number; // -50 to 200
  reason?: string;
}

export interface ReplenishmentAlert {
  id: string;
  storeId: string;
  productId: string;
  alertType: ReplenishmentAlertType;
  currentStock: number;
  suggestedOrder: number;
  priority: AlertPriority;
  message: string;
  isResolved: boolean;
  createdAt: Date;
  resolvedAt?: Date;
}

// Form Data Types
export interface StoreFormData {
  name: string;
  code: string;
  type: StoreType;
  emirate: UAEEmirate;
  city: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  phone?: string;
  email?: string;
  managerId?: string;
  parentStoreId?: string;
  openingHours: OpeningHours;
  settings: Omit<StoreSettings, 'id' | 'storeId'>;
}

export interface TransferRequestFormData {
  fromStoreId: string;
  toStoreId: string;
  priority: TransferPriority;
  notes?: string;
  estimatedDelivery?: Date;
  items: {
    productId: string;
    quantityRequested: number;
    notes?: string;
  }[];
}

export interface BulkTransferFormData {
  fromStoreId: string;
  toStoreIds: string[];
  priority: TransferPriority;
  notes?: string;
  items: {
    productId: string;
    quantityRequested: number;
    notes?: string;
  }[];
}

// Sync Types
export interface SyncEvent {
  id: string;
  type: SyncEventType;
  storeId?: string;
  entityId: string;
  entityType: string;
  data: any;
  timestamp: Date;
  status: SyncStatus;
  error?: string;
}

export interface PricingSync {
  productId: string;
  basePrice: number;
  storeAdjustments: StorePrice[];
  effectiveDate: Date;
  syncedAt: Date;
}

export interface StorePrice {
  storeId: string;
  price: number;
  adjustmentPercentage: number;
  reason?: string;
}

export interface PromotionSync {
  id: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: Date;
  endDate: Date;
  applicableStores: string[];
  applicableProducts?: string[];
  applicableCategories?: string[];
  conditions?: PromotionCondition[];
  isActive: boolean;
  syncedAt: Date;
}

export interface PromotionCondition {
  type: ConditionType;
  value: number;
  operator: OperatorType;
}

// Enum Types
export enum StoreType {
  FLAGSHIP = 'FLAGSHIP',
  OUTLET = 'OUTLET',
  KIOSK = 'KIOSK',
  ONLINE = 'ONLINE',
  WAREHOUSE = 'WAREHOUSE',
  DISTRIBUTION_CENTER = 'DISTRIBUTION_CENTER'
}

export enum StoreStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  TEMPORARILY_CLOSED = 'TEMPORARILY_CLOSED',
  PERMANENTLY_CLOSED = 'PERMANENTLY_CLOSED'
}

export enum UAEEmirate {
  DUBAI = 'DUBAI',
  ABU_DHABI = 'ABU_DHABI',
  SHARJAH = 'SHARJAH',
  AJMAN = 'AJMAN',
  RAS_AL_KHAIMAH = 'RAS_AL_KHAIMAH',
  FUJAIRAH = 'FUJAIRAH',
  UMM_AL_QUWAIN = 'UMM_AL_QUWAIN'
}

export enum TransferStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PICKING = 'PICKING',
  PACKED = 'PACKED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
  PARTIAL = 'PARTIAL'
}

export enum TransferPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  EMERGENCY = 'EMERGENCY'
}

export enum InventoryStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  OVERSTOCK = 'OVERSTOCK',
  RESERVED = 'RESERVED',
  ON_HOLD = 'ON_HOLD'
}

export enum ReorderPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ReplenishmentAlertType {
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  OVERSTOCK = 'OVERSTOCK',
  SEASONAL_ADJUSTMENT = 'SEASONAL_ADJUSTMENT',
  DEMAND_SPIKE = 'DEMAND_SPIKE',
  SLOW_MOVING = 'SLOW_MOVING'
}

export enum AlertPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum SyncEventType {
  INVENTORY_UPDATE = 'INVENTORY_UPDATE',
  PRICE_UPDATE = 'PRICE_UPDATE',
  PROMOTION_UPDATE = 'PROMOTION_UPDATE',
  TRANSFER_UPDATE = 'TRANSFER_UPDATE',
  STORE_UPDATE = 'STORE_UPDATE'
}

export enum SyncStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  RETRY = 'RETRY'
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  BUY_X_GET_Y = 'BUY_X_GET_Y',
  BULK_DISCOUNT = 'BULK_DISCOUNT'
}

export enum ConditionType {
  MIN_QUANTITY = 'MIN_QUANTITY',
  MIN_AMOUNT = 'MIN_AMOUNT',
  CUSTOMER_TYPE = 'CUSTOMER_TYPE',
  FIRST_PURCHASE = 'FIRST_PURCHASE'
}

export enum OperatorType {
  EQUALS = 'EQUALS',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL'
}

// Filter and Search Types
export interface StoreFilters {
  search?: string;
  type?: StoreType;
  status?: StoreStatus;
  emirate?: UAEEmirate;
  city?: string;
  managerId?: string;
  parentStoreId?: string;
}

export interface TransferFilters {
  search?: string;
  fromStoreId?: string;
  toStoreId?: string;
  status?: TransferStatus;
  priority?: TransferPriority;
  startDate?: Date;
  endDate?: Date;
  requestedById?: string;
}

export interface InventoryFilters {
  search?: string;
  storeId?: string;
  productId?: string;
  categoryId?: string;
  status?: InventoryStatus;
  lowStock?: boolean;
  outOfStock?: boolean;
}

// WebSocket Types for Real-time Updates
export interface WebSocketMessage {
  type: WebSocketEventType;
  payload: any;
  timestamp: Date;
  storeId?: string;
}

export enum WebSocketEventType {
  INVENTORY_UPDATED = 'INVENTORY_UPDATED',
  TRANSFER_STATUS_CHANGED = 'TRANSFER_STATUS_CHANGED',
  PRICE_UPDATED = 'PRICE_UPDATED',
  PROMOTION_UPDATED = 'PROMOTION_UPDATED',
  STORE_ALERT = 'STORE_ALERT',
  SYNC_COMPLETED = 'SYNC_COMPLETED'
}

// UAE Specific Data
export const UAE_CITIES = {
  DUBAI: [
    'Dubai Marina', 'Downtown Dubai', 'Jumeirah', 'Deira', 'Bur Dubai',
    'Dubai Mall', 'Mall of the Emirates', 'Ibn Battuta Mall', 'City Walk',
    'Dubai Festival City', 'Dubai International Financial Centre', 'Al Karama'
  ],
  ABU_DHABI: [
    'Abu Dhabi City', 'Al Ain', 'Ruwais', 'Liwa', 'Madinat Zayed',
    'Yas Island', 'Saadiyat Island', 'Al Reem Island', 'Khalifa City'
  ],
  SHARJAH: [
    'Sharjah City', 'Khorfakkan', 'Kalba', 'Dibba Al-Hisn',
    'City Centre Sharjah', 'Mega Mall', 'Al Nahda', 'Al Qasimia'
  ],
  AJMAN: ['Ajman City', 'Manama', 'Masfout'],
  RAS_AL_KHAIMAH: ['Ras Al Khaimah City', 'Julfar', 'Al Rams'],
  FUJAIRAH: ['Fujairah City', 'Dibba', 'Masafi', 'Qidfa'],
  UMM_AL_QUWAIN: ['Umm Al Quwain City', 'Al Sinniyah']
} as const;

// Popular Shopping Locations in UAE
export const POPULAR_LOCATIONS = [
  // Dubai
  { name: 'The Dubai Mall', emirate: UAEEmirate.DUBAI, city: 'Downtown Dubai', type: 'mall' },
  { name: 'Mall of the Emirates', emirate: UAEEmirate.DUBAI, city: 'Al Barsha', type: 'mall' },
  { name: 'Dubai Festival City Mall', emirate: UAEEmirate.DUBAI, city: 'Festival City', type: 'mall' },
  { name: 'Ibn Battuta Mall', emirate: UAEEmirate.DUBAI, city: 'Jebel Ali', type: 'mall' },
  { name: 'City Walk', emirate: UAEEmirate.DUBAI, city: 'Jumeirah', type: 'outdoor' },
  { name: 'Dubai Marina Mall', emirate: UAEEmirate.DUBAI, city: 'Dubai Marina', type: 'mall' },
  { name: 'Gold Souk', emirate: UAEEmirate.DUBAI, city: 'Deira', type: 'souk' },
  { name: 'Perfume Souk', emirate: UAEEmirate.DUBAI, city: 'Deira', type: 'souk' },

  // Abu Dhabi
  { name: 'Yas Mall', emirate: UAEEmirate.ABU_DHABI, city: 'Yas Island', type: 'mall' },
  { name: 'Marina Mall', emirate: UAEEmirate.ABU_DHABI, city: 'Abu Dhabi City', type: 'mall' },
  { name: 'The Galleria', emirate: UAEEmirate.ABU_DHABI, city: 'Al Maryah Island', type: 'mall' },
  { name: 'WTC Mall', emirate: UAEEmirate.ABU_DHABI, city: 'Abu Dhabi City', type: 'mall' },

  // Sharjah
  { name: 'City Centre Sharjah', emirate: UAEEmirate.SHARJAH, city: 'Sharjah City', type: 'mall' },
  { name: 'Mega Mall', emirate: UAEEmirate.SHARJAH, city: 'Sharjah City', type: 'mall' },
  { name: 'Al Wahda Mall', emirate: UAEEmirate.SHARJAH, city: 'Sharjah City', type: 'mall' }
];